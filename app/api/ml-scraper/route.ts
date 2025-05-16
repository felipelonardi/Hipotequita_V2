import { type NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const searchParams = request.nextUrl.searchParams
    const ubicacion = searchParams.get("ubicacion") || "Capital Federal"
    const tipoPropiedad = searchParams.get("tipoPropiedad") || "departamento"
    const precioMaximoStr = searchParams.get("precioMaximo")

    // Convertir precio máximo a número
    const precioMaximo = precioMaximoStr ? Number.parseInt(precioMaximoStr) : undefined

    // Construir la URL para el sitio web público de MercadoLibre (no la API)
    // Esta URL es accesible sin autenticación
    const query = `${tipoPropiedad} en venta ${ubicacion}`
    let url = `https://listado.mercadolibre.com.ar/inmuebles/${encodeURIComponent(query.replace(/ /g, "-"))}`

    // Agregar filtro de precio si está definido
    if (precioMaximo && precioMaximo > 0) {
      url += `_PriceRange_0-${precioMaximo}USD`
    }

    console.log("URL de búsqueda en MercadoLibre:", url)

    // Realizar la petición al sitio web público de MercadoLibre
    // Usamos headers de navegador para evitar bloqueos
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

    // Usar JSDOM para parsear el HTML
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extraer los resultados de la búsqueda
    const resultados = Array.from(document.querySelectorAll(".ui-search-layout__item"))
    console.log(`Se encontraron ${resultados.length} resultados en la página web`)

    // Transformar los resultados al formato de nuestra aplicación
    const propiedades = resultados
      .map((item, index) => {
        try {
          // Extraer título
          const titulo = item.querySelector(".ui-search-item__title")?.textContent || `Propiedad ${index + 1}`

          // Extraer precio
          const precioElement = item.querySelector(".price-tag-amount")
          let precioDolares = 0
          let precioTexto = ""

          if (precioElement) {
            precioTexto = precioElement.textContent || "0"
            // Limpiar el texto del precio para obtener solo números
            precioDolares = Number.parseInt(precioTexto.replace(/\D/g, "")) || 0
          }

          // Extraer URL
          const urlElement = item.querySelector("a.ui-search-link")
          const url = urlElement?.getAttribute("href") || "#"

          // Extraer imagen
          const imagenElement = item.querySelector("img")
          const imagen =
            imagenElement?.getAttribute("data-src") || imagenElement?.getAttribute("src") || "/placeholder.svg"

          // Extraer ubicación
          const ubicacionElement = item.querySelector(".ui-search-item__location")
          const ubicacionTexto = ubicacionElement?.textContent || ubicacion

          // Extraer características adicionales si están disponibles
          const caracteristicasElement = item.querySelector(".ui-search-card-attributes__attribute")
          let ambientes = 0
          let dormitorios = 0
          let metrosCubiertos = 0

          if (caracteristicasElement) {
            const caracteristicasTexto = caracteristicasElement.textContent || ""

            // Intentar extraer ambientes/dormitorios/metros
            const ambientesMatch = /(\d+)\s+amb/i.exec(caracteristicasTexto)
            if (ambientesMatch) ambientes = Number.parseInt(ambientesMatch[1])

            const dormitoriosMatch = /(\d+)\s+dorm/i.exec(caracteristicasTexto)
            if (dormitoriosMatch) dormitorios = Number.parseInt(dormitoriosMatch[1])

            const metrosMatch = /(\d+)\s+m²/i.exec(caracteristicasTexto)
            if (metrosMatch) metrosCubiertos = Number.parseInt(metrosMatch[1])
          }

          return {
            id: `ml-${index}`,
            titulo,
            precioDolares,
            ubicacion: ubicacionTexto,
            ambientes,
            dormitorios,
            cochera: false, // No podemos determinar esto fácilmente
            metrosCubiertos,
            metrosTotales: metrosCubiertos,
            aptaCredito: true, // Asumimos que todas son aptas para crédito
            imagen,
            thumbnail: imagen,
            plataforma: "mercadolibre",
            url,
            operacion: "venta",
          }
        } catch (error) {
          console.error("Error al extraer propiedad:", error)
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
      rawResults: resultados.length,
      source: "web-scraping",
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
