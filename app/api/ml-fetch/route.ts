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
    // Usamos fetch con opciones mínimas para evitar problemas
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // Revalidar cada minuto
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error en respuesta de MercadoLibre (${response.status}):`, errorText)

      // Intentar con el segundo endpoint
      return await fetchFromSecondEndpoint(ubicacion, tipoPropiedad, precioMaximo)
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
      source: "api-mercadolibre",
    })
  } catch (error) {
    console.error("Error al buscar propiedades en MercadoLibre:", error)

    // Intentar con el segundo endpoint en caso de error
    return await fetchFromSecondEndpoint(
      searchParams.get("ubicacion") || "Capital Federal",
      searchParams.get("tipoPropiedad") || "departamento",
      searchParams.get("precioMaximo") ? Number.parseInt(searchParams.get("precioMaximo")!) : undefined,
    )
  }
}

// Función para intentar con un segundo endpoint
async function fetchFromSecondEndpoint(ubicacion: string, tipoPropiedad: string, precioMaximo?: number) {
  try {
    console.log("Intentando con el segundo endpoint...")

    // Construir URL para la API alternativa de MercadoLibre
    const query = `${tipoPropiedad} en venta ${ubicacion}`
    let url = `https://api.mercadolibre.com/sites/MLA/search?category=MLA1459&q=${encodeURIComponent(query)}`

    if (precioMaximo && precioMaximo > 0) {
      url += `&price=*-${precioMaximo}`
    }

    console.log("URL alternativa:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Error en el segundo endpoint: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Transformar resultados
    const propiedades = (data.results || [])
      .map((item: any, index: number) => {
        try {
          return {
            id: item.id || `alt-${index}`,
            titulo: item.title || `Propiedad ${index + 1}`,
            precioDolares: item.price || 0,
            ubicacion: item.address?.city_name || item.address?.state_name || ubicacion,
            ambientes: 0,
            dormitorios: 0,
            cochera: false,
            metrosCubiertos: 0,
            metrosTotales: 0,
            aptaCredito: true,
            imagen: item.thumbnail || "/placeholder.svg",
            thumbnail: item.thumbnail || "/placeholder.svg",
            plataforma: "mercadolibre-alt",
            url: item.permalink || "#",
            operacion: "venta",
          }
        } catch (error) {
          console.error("Error al mapear propiedad alternativa:", error)
          return null
        }
      })
      .filter(Boolean)

    return NextResponse.json({
      success: true,
      propiedades,
      count: propiedades.length,
      query,
      url,
      rawResults: data.results?.length || 0,
      source: "api-mercadolibre-alt",
    })
  } catch (error) {
    console.error("Error en el segundo endpoint:", error)

    return NextResponse.json(
      {
        success: false,
        error: `No se pudieron obtener propiedades reales de MercadoLibre. Error: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
