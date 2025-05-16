import { type NextRequest, NextResponse } from "next/server"

// Función para obtener token de acceso
async function getAccessToken() {
  try {
    const clientId = process.env.MERCADOLIBRE_CLIENT_ID
    const clientSecret = process.env.MERCADOLIBRE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error("Faltan credenciales de MercadoLibre")
    }

    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "SimuladorHipotecario/1.0",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener token: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error al obtener token:", error)
    throw error
  }
}

// Función para buscar propiedades con los IDs exactos de MercadoLibre
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const searchParams = request.nextUrl.searchParams
    const stateId = searchParams.get("state") // ID de la ubicación
    const propertyTypeId = searchParams.get("propertyType") // ID del tipo de propiedad
    const precioMaximoStr = searchParams.get("precioMaximo")

    // Convertir precio máximo a número
    const precioMaximo = precioMaximoStr ? Number.parseInt(precioMaximoStr) : undefined

    console.log("Búsqueda de propiedades con IDs exactos:", { stateId, propertyTypeId, precioMaximo })

    // Validar parámetros
    if (!stateId || !propertyTypeId) {
      return NextResponse.json(
        {
          success: false,
          error: "Se requieren los IDs de ubicación y tipo de propiedad",
        },
        { status: 400 },
      )
    }

    // Obtener token de acceso
    const accessToken = await getAccessToken()

    // Construir URL con los parámetros exactos de MercadoLibre
    const params = new URLSearchParams()
    params.append("category", "MLA1459") // Categoría de inmuebles
    params.append("OPERATION", "242075") // Operación: Venta (ID exacto)
    params.append("state", stateId) // ID de la ubicación
    params.append("PROPERTY_TYPE", propertyTypeId) // ID del tipo de propiedad
    params.append("limit", "50") // Límite de resultados

    // Filtro de precio máximo
    if (precioMaximo && precioMaximo > 0) {
      params.append("price", `*-${precioMaximo}`)
    }

    // URL completa
    const url = `https://api.mercadolibre.com/sites/MLA/search?${params.toString()}`
    console.log("URL de búsqueda MercadoLibre:", url)

    // Realizar la petición a la API
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "User-Agent": "SimuladorHipotecario/1.0",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error en la búsqueda: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`MercadoLibre encontró ${data.results?.length || 0} resultados`)

    // Transformar resultados al formato de nuestra aplicación
    const propiedades = (data.results || [])
      .filter((item: any) => item.category_id === "MLA1459")
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
            aptaCredito: true,
            imagen: item.thumbnail,
            thumbnail: item.thumbnail,
            plataforma: "mercadolibre",
            url: item.permalink,
            operacion: "venta",
          }
        } catch (error) {
          console.error("Error al mapear propiedad:", error)
          return null
        }
      })
      .filter(Boolean) // Eliminar elementos nulos

    // Devolver resultados
    return NextResponse.json({
      success: true,
      propiedades,
      count: propiedades.length,
      params: { stateId, propertyTypeId, precioMaximo },
    })
  } catch (error) {
    console.error("Error al buscar propiedades:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error al buscar propiedades: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
