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

    // Construir la URL para el sitio web de MercadoLibre (no la API)
    // Esto es diferente a la API y no requiere autenticación
    const query = `${tipoPropiedad} en venta ${ubicacion}`
    let url = `https://listado.mercadolibre.com.ar/inmuebles/${encodeURIComponent(query.replace(/ /g, "-"))}`

    // Agregar filtro de precio si está definido
    if (precioMaximo && precioMaximo > 0) {
      url += `_PriceRange_0-${precioMaximo}USD`
    }

    console.log("URL de búsqueda en MercadoLibre:", url)

    // Realizar la petición al sitio web de MercadoLibre
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error al conectar con MercadoLibre: ${response.status} ${response.statusText}`)
    }

    // Obtener el HTML de la página
    const html = await response.text()

    // Extraer datos de propiedades del HTML usando expresiones regulares
    // Esto es un enfoque simple para extraer datos sin usar JSDOM
    const propiedades = extractPropertiesFromHTML(html, ubicacion)

    // Devolver resultados
    return NextResponse.json({
      success: true,
      propiedades,
      count: propiedades.length,
      query,
      url,
      rawHTML: html.length,
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

// Función para extraer propiedades del HTML usando expresiones regulares
function extractPropertiesFromHTML(html: string, defaultLocation: string): any[] {
  const propiedades = []

  // Extraer scripts de datos estructurados (JSON-LD)
  const scriptRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  let match
  let index = 0

  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const jsonData = JSON.parse(match[1])

      // Verificar si es un producto
      if (jsonData["@type"] === "Product") {
        const titulo = jsonData.name || `Propiedad ${index + 1}`

        // Extraer precio
        let precioDolares = 0
        if (jsonData.offers && jsonData.offers.price) {
          precioDolares = Number.parseInt(jsonData.offers.price)
        }

        // Extraer URL
        const url = jsonData.url || "#"

        // Extraer imagen
        const imagen = jsonData.image || "/placeholder.svg"

        propiedades.push({
          id: `web-${index}`,
          titulo,
          precioDolares,
          ubicacion: defaultLocation,
          ambientes: 0, // No podemos extraer esta información fácilmente
          dormitorios: 0,
          cochera: false,
          metrosCubiertos: 0,
          metrosTotales: 0,
          aptaCredito: true,
          imagen: Array.isArray(imagen) ? imagen[0] : imagen,
          thumbnail: Array.isArray(imagen) ? imagen[0] : imagen,
          plataforma: "mercadolibre-web",
          url,
          operacion: "venta",
        })

        index++
      }
    } catch (error) {
      console.error("Error al parsear JSON-LD:", error)
    }
  }

  // Si no encontramos propiedades con JSON-LD, intentar con un enfoque más simple
  if (propiedades.length === 0) {
    // Extraer elementos de lista de resultados
    const itemRegex = /<li class="ui-search-layout__item">([\s\S]*?)<\/li>/g

    while ((match = itemRegex.exec(html)) !== null) {
      try {
        const itemHtml = match[1]

        // Extraer título
        const titleMatch = /<h2 class="ui-search-item__title">(.*?)<\/h2>/i.exec(itemHtml)
        const titulo = titleMatch ? titleMatch[1] : `Propiedad ${index + 1}`

        // Extraer precio
        const priceMatch = /<span class="price-tag-amount">(.*?)<\/span>/i.exec(itemHtml)
        let precioDolares = 0
        if (priceMatch) {
          const priceText = priceMatch[1].replace(/<[^>]*>/g, "")
          precioDolares = Number.parseInt(priceText.replace(/\D/g, ""))
        }

        // Extraer URL
        const urlMatch = /<a href="([^"]*)" class="ui-search-link"/i.exec(itemHtml)
        const url = urlMatch ? urlMatch[1] : "#"

        // Extraer imagen
        const imgMatch = /<img src="([^"]*)" alt/i.exec(itemHtml) || /<img data-src="([^"]*)" alt/i.exec(itemHtml)
        const imagen = imgMatch ? imgMatch[1] : "/placeholder.svg"

        propiedades.push({
          id: `web-${index}`,
          titulo,
          precioDolares,
          ubicacion: defaultLocation,
          ambientes: 0,
          dormitorios: 0,
          cochera: false,
          metrosCubiertos: 0,
          metrosTotales: 0,
          aptaCredito: true,
          imagen,
          thumbnail: imagen,
          plataforma: "mercadolibre-web",
          url,
          operacion: "venta",
        })

        index++
      } catch (error) {
        console.error("Error al extraer propiedad:", error)
      }
    }
  }

  return propiedades
}
