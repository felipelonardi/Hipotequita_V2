import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const searchParams = request.nextUrl.searchParams
    const ubicacionPrincipal = searchParams.get("ubicacionPrincipal") || ""
    const subUbicacion = searchParams.get("subUbicacion") || ""
    const tipoPropiedad = searchParams.get("tipoPropiedad") || "departamentos"
    const precioMaximoStr = searchParams.get("precioMaximo")
    const precioMinimoStr = searchParams.get("precioMinimo")
    const ambientes = searchParams.get("ambientes") || ""
    const dormitorios = searchParams.get("dormitorios")
    const metrosCubiertosMin = searchParams.get("metrosCubiertosMin")
    const metrosCubiertosMax = searchParams.get("metrosCubiertosMax")
    const cochera = searchParams.get("cochera") === "true"
    const aptoCredito = searchParams.get("aptoCredito") === "true"

    // Convertir valores numéricos
    const precioMaximo = precioMaximoStr ? Number.parseInt(precioMaximoStr) : undefined
    const precioMinimo = precioMinimoStr ? Number.parseInt(precioMinimoStr) : undefined
    const metrosMin = metrosCubiertosMin ? Number.parseInt(metrosCubiertosMin) : undefined
    const metrosMax = metrosCubiertosMax ? Number.parseInt(metrosCubiertosMax) : undefined

    console.log("Parámetros de búsqueda:", {
      ubicacionPrincipal,
      subUbicacion,
      tipoPropiedad,
      precioMinimo,
      precioMaximo,
      ambientes,
      dormitorios,
      metrosMin,
      metrosMax,
      cochera,
      aptoCredito,
    })

    // Construir la URL base para MercadoLibre
    let url = "https://inmuebles.mercadolibre.com.ar/"

    // Agregar tipo de propiedad
    if (tipoPropiedad && tipoPropiedad !== "cualquiera") {
      url += `${tipoPropiedad.toLowerCase()}/`
    }

    // Agregar "venta"
    url += "venta/"

    // SIEMPRE agregar filtro de apto crédito
    url += "apto-credito/"

    // Agregar filtro de ambientes ANTES de la ubicación
    if (ambientes && ambientes !== "") {
      url += `${ambientes}/`
    }

    // Agregar ubicación principal si no es vacía
    if (ubicacionPrincipal) {
      url += `${ubicacionPrincipal}/`

      // Agregar sububicación (barrio o ciudad) si está definida
      if (subUbicacion) {
        url += `${subUbicacion}/`
      }
    }

    // Construir parámetros de consulta como parte de la URL en lugar de usar #
    const queryParts = []

    // Agregar filtros de precio
    if (precioMinimo && precioMinimo > 0 && precioMaximo && precioMaximo > 0) {
      queryParts.push(`_PriceRange_${precioMinimo}USD-${precioMaximo}USD`)
    } else if (precioMinimo && precioMinimo > 0) {
      queryParts.push(`_PriceRange_${precioMinimo}USD-*`)
    } else if (precioMaximo && precioMaximo > 0) {
      queryParts.push(`_PriceRange_0USD-${precioMaximo}USD`)
    }

    // Agregar los queryParts a la URL
    if (queryParts.length > 0) {
      url += queryParts.join("")
    }

    // Agregar el parámetro de apto crédito en el fragmento de URL (después del #)
    url +=
      "#applied_filter_id%3DSUITABLE_FOR_MORTGAGE_LOAN%26applied_filter_name%3DApto+cr%C3%A9dito%26applied_value_id%3D242085%26applied_value_name%3DEs+apto+cr%C3%A9dito%26applied_value_order%3D1%26is_custom%3Dfalse"

    console.log("URL final de búsqueda en MercadoLibre:", url)

    // Realizar la petición al sitio web público de MercadoLibre
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
      console.error(`Error en la respuesta: ${response.status} ${response.statusText}`)
      throw new Error(`Error al conectar con MercadoLibre: ${response.status} ${response.statusText}`)
    }

    // Obtener el HTML de la página
    const html = await response.text()
    console.log(`Recibidos ${html.length} bytes de HTML`)

    // Extraer datos usando expresiones regulares (más simple que JSDOM)
    const results = extractPropertiesFromHTML(html, ubicacionPrincipal)
    console.log(`Extraídas ${results.length} propiedades`)

    // Crear un string para la consulta
    let queryString = `Propiedades en venta`
    if (ambientes && ambientes !== "") queryString += `, ${ambientes.replace(/-/g, " ")}`
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
    if (dormitorios && dormitorios !== "cualquiera") queryString += `, ${dormitorios} dormitorios`
    if (metrosMin || metrosMax) {
      queryString += `, metros: `
      if (metrosMin) queryString += `desde ${metrosMin}m² `
      if (metrosMax) queryString += `hasta ${metrosMax}m²`
    }
    if (cochera) queryString += `, con cochera`
    queryString += `, apto crédito`

    // Devolver resultados
    return NextResponse.json({
      success: true,
      site_id: "MLA",
      query: queryString,
      paging: {
        total: results.length,
        offset: 0,
        limit: 50,
        primary_results: results.length,
      },
      results,
      url,
      source: "web-mercadolibre",
    })
  } catch (error: any) {
    console.error("Error al buscar propiedades en MercadoLibre:", error)

    // En caso de error, devolver un error claro
    return NextResponse.json(
      {
        success: false,
        site_id: "MLA",
        query: "",
        paging: {
          total: 0,
          offset: 0,
          limit: 50,
          primary_results: 0,
        },
        results: [],
        error: `Error al buscar propiedades en MercadoLibre: ${error.message || "Error desconocido"}`,
        source: "error",
      },
      { status: 400 },
    )
  }
}

// Función para extraer propiedades del HTML usando expresiones regulares
function extractPropertiesFromHTML(html: string, defaultLocation: string): any[] {
  const results = []

  try {
    // Intentar diferentes patrones para adaptarse a posibles cambios en la estructura HTML

    // Patrón 1: Buscar elementos de lista de resultados
    let itemRegex = /<div class="ui-search-result__wrapper">([\s\S]*?)<\/a><\/div><\/div><\/div><\/div>/g
    let match
    let index = 0

    while ((match = itemRegex.exec(html)) !== null && index < 50) {
      try {
        const itemHtml = match[1]

        // Extraer título
        const titleRegex = /<h2 class="ui-search-item__title"[^>]*>(.*?)<\/h2>/i
        const titleMatch = titleRegex.exec(itemHtml)
        const title = titleMatch ? titleMatch[1].trim() : `Propiedad ${index + 1}`

        // Extraer precio - VERSIÓN MEJORADA
        let price = 0
        let currency_id = "USD"

        // Método 1: Buscar el precio en el formato de andes-money
        const priceRegex = /<span class="andes-money-amount__fraction"[^>]*>(.*?)<\/span>/i
        const priceMatch = priceRegex.exec(itemHtml)

        if (priceMatch) {
          // Eliminar puntos y convertir a número
          price = Number.parseInt(priceMatch[1].replace(/\./g, ""))

          // Verificar la moneda
          const currencyRegex = /<span class="andes-money-amount__currency-symbol"[^>]*>(.*?)<\/span>/i
          const currencyMatch = currencyRegex.exec(itemHtml)
          currency_id = currencyMatch
            ? currencyMatch[1].trim() === "U$S" || currencyMatch[1].trim() === "USD"
              ? "USD"
              : "ARS"
            : "USD"
        }

        // Método 2: Si no se encontró precio, buscar en el formato de price-tag
        if (price === 0) {
          const priceFallbackRegex = /<span class="price-tag-amount">([\s\S]*?)<\/span>/i
          const priceFallbackMatch = priceFallbackRegex.exec(itemHtml)

          if (priceFallbackMatch) {
            const priceText = priceFallbackMatch[1].replace(/<[^>]*>/g, "").trim()

            // Verificar si contiene "U$S" o "$"
            if (priceText.includes("U$S") || priceText.includes("USD")) {
              currency_id = "USD"
              // Extraer solo los números
              const numericPart = priceText.replace(/[^\d]/g, "")
              price = Number.parseInt(numericPart) || 0
            } else if (priceText.includes("$")) {
              currency_id = "ARS"
              // Extraer solo los números
              const numericPart = priceText.replace(/[^\d]/g, "")
              price = Number.parseInt(numericPart) || 0
            }
          }
        }

        // Método 3: Buscar en el formato de data-price
        if (price === 0) {
          const dataPriceRegex = /data-price="([^"]*?)"/i
          const dataPriceMatch = dataPriceRegex.exec(itemHtml)

          if (dataPriceMatch && dataPriceMatch[1]) {
            price = Number.parseInt(dataPriceMatch[1]) || 0
          }
        }

        // Método 4: Buscar en el formato JSON-LD
        if (price === 0) {
          const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i
          const jsonLdMatch = jsonLdRegex.exec(itemHtml)

          if (jsonLdMatch && jsonLdMatch[1]) {
            try {
              const jsonData = JSON.parse(jsonLdMatch[1])
              if (jsonData.offers && jsonData.offers.price) {
                price = Number.parseInt(jsonData.offers.price) || 0

                if (jsonData.offers.priceCurrency) {
                  currency_id = jsonData.offers.priceCurrency === "USD" ? "USD" : "ARS"
                }
              }
            } catch (e) {
              console.error("Error al parsear JSON-LD:", e)
            }
          }
        }

        // Método 5: Buscar datos de la API de MercadoLibre incrustados en la página
        if (price === 0) {
          try {
            // Buscar cualquier script que contenga datos de producto de MercadoLibre
            const scriptDataRegex = /<script[^>]*>[\s\S]*?window\.__PRELOADED_STATE__\s*=\s*({[\s\S]*?})<\/script>/i
            const scriptMatch = scriptDataRegex.exec(html)

            if (scriptMatch && scriptMatch[1]) {
              // Intentar extraer y parsear los datos
              const jsonText = scriptMatch[1].replace(/&quot;/g, '"').replace(/\\"/g, '"')
              try {
                const jsonData = JSON.parse(jsonText)

                // Buscar en la estructura de datos de MercadoLibre
                if (jsonData.initialState && jsonData.initialState.items) {
                  const items = jsonData.initialState.items
                  // Tomar el primer item si existe
                  if (items && items.length > 0) {
                    const item = items[0]
                    if (item.price) {
                      price = item.price
                    }
                    if (item.currency_id) {
                      currency_id = item.currency_id === "USD" ? "USD" : "ARS"
                    }
                  }
                }
              } catch (e) {
                console.error("Error al parsear datos de MercadoLibre:", e)
              }
            }
          } catch (e) {
            console.error("Error al buscar datos de MercadoLibre:", e)
          }
        }

        // Extraer URL
        const urlRegex = /<a href="([^"]*)" class="ui-search-link"/i
        const urlMatch = urlRegex.exec(itemHtml)
        const permalink = urlMatch ? urlMatch[1] : "#"

        // Extraer imagen
        const imgRegex = /<img data-src="([^"]*)" alt/i
        const imgMatch = imgRegex.exec(itemHtml)
        const thumbnail = imgMatch ? imgMatch[1] : "/placeholder.svg"

        // Extraer ubicación
        const locationRegex = /<span class="ui-search-item__location"[^>]*>(.*?)<\/span>/i
        const locationMatch = locationRegex.exec(itemHtml)
        const location = locationMatch ? locationMatch[1].trim() : defaultLocation.replace(/-/g, " ")

        // Intentar extraer características adicionales
        let bedrooms = 0
        const bathrooms = 0
        let totalArea = 0
        let coveredArea = 0
        let hasGarage = false

        // Buscar características en el texto
        const caracteristicasRegex = /<ul class="ui-search-card-attributes"[^>]*>([\s\S]*?)<\/ul>/i
        const caracteristicasMatch = caracteristicasRegex.exec(itemHtml)

        if (caracteristicasMatch) {
          const caracteristicasHtml = caracteristicasMatch[1]

          // Buscar ambientes
          const ambientesRegex = />(\d+)\s*amb/i
          const ambientesMatch = ambientesRegex.exec(caracteristicasHtml)
          if (ambientesMatch) {
            bedrooms = Number.parseInt(ambientesMatch[1])
          }

          // Buscar dormitorios
          const dormitoriosRegex = />(\d+)\s*dorm/i
          const dormitoriosMatch = dormitoriosRegex.exec(caracteristicasHtml)
          if (dormitoriosMatch) {
            bedrooms = Number.parseInt(dormitoriosMatch[1])
          }

          // Buscar metros cuadrados
          const metrosRegex = />(\d+)\s*m²/i
          const metrosMatch = metrosRegex.exec(caracteristicasHtml)
          if (metrosMatch) {
            totalArea = Number.parseInt(metrosMatch[1])
            coveredArea = totalArea
          }

          // Buscar cochera
          hasGarage = /cochera|garage|garaje|estacionamiento/i.test(caracteristicasHtml)
        }

        // Generar un ID único para MercadoLibre
        const id = `MLA${900000000 + index}`

        // Crear objeto con la estructura de la API de MercadoLibre
        results.push({
          id,
          title,
          price,
          currency_id,
          available_quantity: 1,
          sold_quantity: 0,
          condition: "used",
          permalink,
          thumbnail,
          address: {
            state_name: location.split(",").length > 1 ? location.split(",")[1].trim() : "Capital Federal",
            city_name: location.split(",")[0].trim(),
            area_code: "011",
            phone1: "",
          },
          attributes: [
            {
              id: "BEDROOMS",
              name: "Dormitorios",
              value_id: bedrooms.toString(),
              value_name: bedrooms.toString(),
            },
            {
              id: "TOTAL_AREA",
              name: "Superficie total",
              value_id: `${totalArea} m²`,
              value_name: `${totalArea} m²`,
            },
            {
              id: "COVERED_AREA",
              name: "Superficie cubierta",
              value_id: `${coveredArea} m²`,
              value_name: `${coveredArea} m²`,
            },
          ],
        })

        index++
      } catch (error) {
        console.error("Error al extraer propiedad:", error)
      }
    }

    // Si no encontramos propiedades con el primer patrón, intentar con un patrón alternativo
    if (results.length === 0) {
      console.log("Intentando con patrón alternativo de extracción")

      // Patrón alternativo más general
      itemRegex = /<li class="ui-search-layout__item">([\s\S]*?)<\/li>/g
      index = 0

      while ((match = itemRegex.exec(html)) !== null && index < 50) {
        try {
          const itemHtml = match[1]

          // Extraer título
          const titleRegex = /<h2[^>]*>(.*?)<\/h2>/i
          const titleMatch = titleRegex.exec(itemHtml)
          const title = titleMatch ? titleMatch[1].trim() : `Propiedad ${index + 1}`

          // Extraer precio - VERSIÓN MEJORADA
          let price = 0
          let currency_id = "USD"

          // Método 1: Buscar el precio en el formato de price-tag
          const priceRegex = /<span class="price-tag-amount">([\s\S]*?)<\/span>/i
          const priceMatch = priceRegex.exec(itemHtml)

          if (priceMatch) {
            const priceText = priceMatch[1].replace(/<[^>]*>/g, "").trim()

            // Verificar si contiene "U$S" o "$"
            if (priceText.includes("U$S") || priceText.includes("USD")) {
              currency_id = "USD"
              // Extraer solo los números
              const numericPart = priceText.replace(/[^\d]/g, "")
              price = Number.parseInt(numericPart) || 0
            } else if (priceText.includes("$")) {
              currency_id = "ARS"
              // Extraer solo los números
              const numericPart = priceText.replace(/[^\d]/g, "")
              price = Number.parseInt(numericPart) || 0
            }
          }

          // Método 2: Buscar en el formato de data-price
          if (price === 0) {
            const dataPriceRegex = /data-price="([^"]*?)"/i
            const dataPriceMatch = dataPriceRegex.exec(itemHtml)

            if (dataPriceMatch && dataPriceMatch[1]) {
              price = Number.parseInt(dataPriceMatch[1]) || 0
            }
          }

          // Extraer URL
          const urlRegex = /<a href="([^"]*)"[^>]*>/i
          const urlMatch = urlRegex.exec(itemHtml)
          const permalink = urlMatch ? urlMatch[1] : "#"

          // Extraer imagen
          const imgRegex = /<img[^>]*src="([^"]*)"[^>]*>/i
          const imgMatch = imgRegex.exec(itemHtml)
          const thumbnail = imgMatch ? imgMatch[1] : "/placeholder.svg"

          // Extraer ubicación
          const locationRegex = /<span class="ui-search-item__location"[^>]*>(.*?)<\/span>/i
          const locationMatch = locationRegex.exec(itemHtml)
          const location = locationMatch ? locationMatch[1].trim() : defaultLocation.replace(/-/g, " ")

          // Generar un ID único para MercadoLibre
          const id = `MLA${900000000 + index}`

          results.push({
            id,
            title,
            price,
            currency_id,
            available_quantity: 1,
            sold_quantity: 0,
            condition: "used",
            permalink,
            thumbnail,
            address: {
              state_name: location.split(",").length > 1 ? location.split(",")[1].trim() : "Capital Federal",
              city_name: location.split(",")[0].trim(),
              area_code: "011",
              phone1: "",
            },
            attributes: [],
          })

          index++
        } catch (error) {
          console.error("Error al extraer propiedad con patrón alternativo:", error)
        }
      }
    }

    // Tercer intento: buscar cualquier elemento que parezca un resultado
    if (results.length === 0) {
      console.log("Intentando con patrón de emergencia")

      // Buscar cualquier enlace que parezca un resultado de inmueble
      const urlRegex = /href="(https:\/\/www\.mercadolibre\.com\.ar\/[^"]*inmueble[^"]*)"[^>]*>/gi
      index = 0

      while ((match = urlRegex.exec(html)) !== null && index < 20) {
        try {
          const permalink = match[1]
          const id = `MLA${900000000 + index}`
          const title = `Propiedad en ${defaultLocation.replace(/-/g, " ")} #${index + 1}`

          results.push({
            id,
            title,
            price: 0,
            currency_id: "USD",
            available_quantity: 1,
            sold_quantity: 0,
            condition: "used",
            permalink,
            thumbnail: "/placeholder.svg",
            address: {
              state_name:
                defaultLocation.split(",").length > 1 ? defaultLocation.split(",")[1].trim() : "Capital Federal",
              city_name: defaultLocation.split(",")[0].trim(),
              area_code: "011",
              phone1: "",
            },
            attributes: [],
          })

          index++
        } catch (error) {
          console.error("Error al extraer propiedad con patrón de emergencia:", error)
        }
      }
    }
  } catch (error) {
    console.error("Error general al extraer propiedades:", error)
  }

  return results
}
