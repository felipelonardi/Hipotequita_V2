import { type NextRequest, NextResponse } from "next/server"
import { propiedadesMock } from "@/data/propiedades-mock"

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const searchParams = request.nextUrl.searchParams
    const ubicacion = searchParams.get("ubicacion") || "Capital Federal"
    const tipoPropiedad = searchParams.get("tipoPropiedad") || "departamento"
    const precioMaximoStr = searchParams.get("precioMaximo")

    // Convertir precio máximo a número
    const precioMaximo = precioMaximoStr ? Number.parseInt(precioMaximoStr) : undefined

    console.log("Búsqueda simulada con parámetros:", { ubicacion, tipoPropiedad, precioMaximo })

    // Filtrar propiedades según los criterios
    let propiedadesFiltradas = [...propiedadesMock]

    // Filtrar por ubicación si está definida
    if (ubicacion && ubicacion !== "Argentina") {
      const ubicacionLower = ubicacion.toLowerCase()
      propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.ubicacion.toLowerCase().includes(ubicacionLower))
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

    // Si no hay resultados después de filtrar, devolver un subconjunto aleatorio de datos mock
    if (propiedadesFiltradas.length === 0) {
      // Seleccionar aleatoriamente 6 propiedades
      propiedadesFiltradas = propiedadesMock.sort(() => 0.5 - Math.random()).slice(0, 6)
    }

    // Agregar un pequeño retraso para simular una búsqueda real
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      propiedades: propiedadesFiltradas,
      count: propiedadesFiltradas.length,
      query: `Búsqueda simulada: ${tipoPropiedad} en ${ubicacion}`,
      simulado: true,
    })
  } catch (error) {
    console.error("Error al buscar propiedades simuladas:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error al buscar propiedades: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
