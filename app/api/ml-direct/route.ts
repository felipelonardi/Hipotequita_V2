import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const searchParams = request.nextUrl.searchParams
    const ubicacion = searchParams.get("ubicacion") || "Capital Federal"
    const tipoPropiedad = searchParams.get("tipoPropiedad") || "departamento"
    const precioMaximoStr = searchParams.get("precioMaximo")

    // Convertir precio máximo a número
    const precioMaximo = precioMaximoStr ? Number.parseInt(precioMaximoStr) : undefined

    // Construir la consulta de búsqueda para MercadoLibre
    const query = `${tipoPropiedad} en venta ${ubicacion}`

    // Construir URL para la API pública de MercadoLibre
    // Usamos la API pública que no requiere autenticación
    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(query)}&category=MLA1459&limit=20`

    // Agregar filtro de precio si está definido
    if (precioMaximo && precioMaximo > 0) {
      url += `&price=*-${precioMaximo}`
    }

    console.log("URL de búsqueda en MercadoLibre:", url)

    // Realizar la petición a la API pública de MercadoLibre
    // Usamos un enfoque diferente sin encabezados de autorización
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error en respuesta de MercadoLibre (${response.status}):`, errorText)
      throw new Error(`Error al conectar con MercadoLibre: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`MercadoLibre encontró ${data.results?.length || 0} resultados`)

    // Transformar resultados al formato de nuestra aplicación
    const propiedades = (data.results || [])
      .filter((item: any) => {
        // Verificar que sea una propiedad inmobiliaria
        return item.category_id === "MLA1459"
      })
      .map((item: any) => {
        try {
          // Extraer información de atributos
          const getAttributeValue = (name: string) => {
            const attr = item.attributes?.find((a: any) => a.id === name)
            return attr ? attr.value_name : null
          }

          const ambientes = getAttributeValue("ROOMS") || "1"
          const dormitorios = getAttributeValue("BEDROOMS") || "1"
          const metrosCubiertos = Number.parseInt(getAttributeValue("COVERED_AREA") || "0")
          const metrosTotales = Number.parseInt(getAttributeValue("TOTAL_AREA") || "0")
          const cochera = getAttributeValue("PARKING_LOTS")
            ? Number.parseInt(getAttributeValue("PARKING_LOTS")) > 0
            : false

          return {
            id: item.id,
            titulo: item.title,
            precioDolares: item.price,
            ubicacion: item.address?.city_name || item.address?.state_name || "Argentina",
            ambientes: Number.parseInt(ambientes) || 1,
            dormitorios: Number.parseInt(dormitorios) || 1,
            cochera,
            metrosCubiertos,
            metrosTotales: metrosTotales || metrosCubiertos,
            aptaCredito: true, // Asumimos que todas las propiedades listadas son aptas para crédito
            imagen: item.thumbnail,
            thumbnail: item.thumbnail,
            plataforma: "mercadolibre",
            url: item.permalink,
            operacion: "venta",
          }
        } catch (error) {
          console.error("Error al mapear propiedad:", error, "Item:", item)
          return null
        }
      })
      .filter(Boolean) // Eliminar elementos nulos

    // Devolver resultados
    return NextResponse.json({
      success: true,
      propiedades,
      count: propiedades.length,
      query,
      url,
      rawResults: data.results?.length || 0,
      filters: data.filters || [],
      availableFilters: data.available_filters || [],
    })
  } catch (error) {
    console.error("Error al buscar propiedades en MercadoLibre:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error al buscar propiedades en MercadoLibre: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
