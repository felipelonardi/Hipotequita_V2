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

    // Construir la URL de búsqueda para el sitio web de MercadoLibre (no la API)
    const query = `${tipoPropiedad} en venta ${ubicacion}`
    let url = `https://listado.mercadolibre.com.ar/inmuebles/${encodeURIComponent(query.replace(/ /g, "-"))}`

    // Agregar filtro de precio si está definido
    if (precioMaximo && precioMaximo > 0) {
      url += `_PriceRange_0-${precioMaximo}USD`
    }

    console.log("URL de búsqueda web:", url)

    // Realizar la petición al sitio web
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error en la búsqueda web: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()

    // Parsear el HTML con jsdom
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extraer los resultados de la búsqueda
    const resultados = Array.from(document.querySelectorAll(".ui-search-layout__item"))
    console.log(`Se encontraron ${resultados.length} resultados en la página web`)

    // Transformar los resultados al formato de nuestra aplicación
    const propiedades = resultados
      .map((item, index) => {
        try {
          const titulo = item.querySelector(".ui-search-item__title")?.textContent || `Propiedad ${index + 1}`

          // Extraer precio
          const precioText = item.querySelector(".price-tag-amount")?.textContent || "0"
          const precioDolares = Number.parseInt(precioText.replace(/\D/g, "")) || 0

          // Extraer URL
          const url = item.querySelector("a.ui-search-link")?.getAttribute("href") || "#"

          // Extraer imagen
          const imagen =
            item.querySelector("img")?.getAttribute("data-src") ||
            item.querySelector("img")?.getAttribute("src") ||
            "/placeholder.svg"

          // Extraer ubicación
          const ubicacionText = item.querySelector(".ui-search-item__location")?.textContent || ubicacion

          return {
            id: `web-${index}`,
            titulo,
            precioDolares,
            ubicacion: ubicacionText,
            ambientes: 0, // No podemos extraer esta información de la página de resultados
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
      webScraping: true,
    })
  } catch (error) {
    console.error("Error al buscar propiedades en la web:", error)

    // En caso de error, usar datos simulados
    return await buscarPropiedadesMock(
      searchParams.get("ubicacion") || "Capital Federal",
      searchParams.get("precioMaximo") ? Number.parseInt(searchParams.get("precioMaximo")!) : undefined,
    )
  }
}

// Función para generar propiedades simuladas cuando el web scraping falla
async function buscarPropiedadesMock(ubicacion: string, precioMaximo?: number) {
  console.log("Usando datos simulados para la búsqueda:", { ubicacion, precioMaximo })

  // Importar datos mock
  const { propiedadesMock } = await import("@/data/propiedades-mock")

  // Filtrar propiedades según los criterios
  let propiedadesFiltradas = propiedadesMock

  // Filtrar por ubicación si está definida
  if (ubicacion && ubicacion !== "Argentina") {
    const ubicacionLower = ubicacion.toLowerCase()
    propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.ubicacion.toLowerCase().includes(ubicacionLower))
  }

  // Filtrar por precio máximo si está definido
  if (precioMaximo && precioMaximo > 0) {
    propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.precioDolares <= precioMaximo)
  }

  // Si no hay resultados después de filtrar, devolver un subconjunto de datos mock
  if (propiedadesFiltradas.length === 0) {
    propiedadesFiltradas = propiedadesMock.slice(0, 6)
  }

  return NextResponse.json({
    success: true,
    propiedades: propiedadesFiltradas,
    count: propiedadesFiltradas.length,
    query: `Búsqueda simulada: ${ubicacion}`,
    url: "Datos simulados (el web scraping no está disponible)",
    rawResults: propiedadesFiltradas.length,
    simulado: true,
  })
}
