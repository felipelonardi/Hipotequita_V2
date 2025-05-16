import { type NextRequest, NextResponse } from "next/server"
import { propiedadesMock } from "@/data/propiedades-mock"

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const searchParams = request.nextUrl.searchParams
    const ubicacionPrincipal = searchParams.get("ubicacionPrincipal") || ""
    const subUbicacion = searchParams.get("subUbicacion") || ""
    const tipoPropiedad = searchParams.get("tipoPropiedad") || ""
    const precioMaximoStr = searchParams.get("precioMaximo")
    const precioMinimoStr = searchParams.get("precioMinimo")

    // Convertir valores numéricos
    const precioMaximo = precioMaximoStr ? Number.parseInt(precioMaximoStr) : undefined
    const precioMinimo = precioMinimoStr ? Number.parseInt(precioMinimoStr) : undefined

    console.log("Usando datos de respaldo con parámetros:", {
      ubicacionPrincipal,
      subUbicacion,
      tipoPropiedad,
      precioMinimo,
      precioMaximo,
    })

    // Filtrar propiedades según los criterios
    let propiedadesFiltradas = [...propiedadesMock]

    // Añadir el campo moneda a todas las propiedades y asegurarnos de que todas sean aptas para crédito
    propiedadesFiltradas = propiedadesFiltradas.map((p) => ({
      ...p,
      moneda: "USD",
      aptaCredito: true, // Forzar que todas sean aptas para crédito
    }))

    // Filtrar por ubicación principal
    if (ubicacionPrincipal) {
      const ubicacionNombre = ubicacionPrincipal.replace(/-/g, " ")
      propiedadesFiltradas = propiedadesFiltradas.filter((p) =>
        p.ubicacion.toLowerCase().includes(ubicacionNombre.toLowerCase()),
      )
    }

    // Filtrar por sububicación si está definida
    if (subUbicacion) {
      const subUbicacionNombre = subUbicacion.replace(/-/g, " ")
      propiedadesFiltradas = propiedadesFiltradas.filter((p) =>
        p.ubicacion.toLowerCase().includes(subUbicacionNombre.toLowerCase()),
      )
    }

    // Filtrar por tipo de propiedad
    if (tipoPropiedad) {
      const tipoPropiedadLower = tipoPropiedad.toLowerCase()
      propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.titulo.toLowerCase().includes(tipoPropiedadLower))
    }

    // Filtrar por precio máximo si está definido
    if (precioMaximo && precioMaximo > 0) {
      propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.precioDolares <= precioMaximo)
    }

    // Filtrar por precio mínimo si está definido
    if (precioMinimo && precioMinimo > 0) {
      propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.precioDolares >= precioMinimo)
    }

    // Filtrar por apto crédito si se solicita explícitamente
    const aptoCredito = searchParams.get("aptoCredito") === "true"
    if (aptoCredito) {
      propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.aptaCredito === true)
    }

    // Si no hay resultados después de filtrar, devolver un subconjunto aleatorio de datos mock
    if (propiedadesFiltradas.length === 0) {
      // Seleccionar aleatoriamente 6 propiedades
      propiedadesFiltradas = propiedadesMock
        .map((p) => ({ ...p, moneda: "USD" }))
        .sort(() => 0.5 - Math.random())
        .slice(0, 6)
    }

    // Crear un string para la consulta
    let queryString = `Propiedades en venta`
    if (ubicacionPrincipal) {
      const ubicacionNombre = ubicacionPrincipal.replace(/-/g, " ")
      queryString += ` en ${ubicacionNombre}`

      if (subUbicacion) {
        const subUbicacionNombre = subUbicacion.replace(/-/g, " ")
        queryString += `, ${subUbicacionNombre}`
      }
    }
    if (tipoPropiedad) queryString += `, tipo: ${tipoPropiedad}`
    if (precioMinimo) queryString += `, desde: ${precioMinimo} USD`
    if (precioMaximo) queryString += `, hasta: ${precioMaximo} USD`

    return NextResponse.json({
      success: true,
      propiedades: propiedadesFiltradas,
      count: propiedadesFiltradas.length,
      query: queryString + " (DATOS SIMULADOS - La API de MercadoLibre no está disponible)",
      url: "Datos simulados de respaldo",
      source: "datos-simulados",
    })
  } catch (error) {
    console.error("Error al generar datos de respaldo:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error al generar datos de respaldo: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
