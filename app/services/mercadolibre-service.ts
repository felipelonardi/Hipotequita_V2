"use server"

import type { Propiedad } from "@/types/tipos"

// Función para obtener token de acceso con reintentos
async function getAccessToken(maxRetries = 3) {
  let retries = 0

  while (retries < maxRetries) {
    try {
      const clientId = process.env.MERCADOLIBRE_CLIENT_ID
      const clientSecret = process.env.MERCADOLIBRE_CLIENT_SECRET

      if (!clientId || !clientSecret) {
        console.error("Error: Faltan credenciales de MercadoLibre. Verifica las variables de entorno.")
        throw new Error("Faltan credenciales de MercadoLibre")
      }

      console.log(`Intento ${retries + 1}: Obteniendo token de acceso de MercadoLibre...`)

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
        const errorText = await response.text()
        console.error(`Error en respuesta de token (${response.status}):`, errorText)
        throw new Error(`Error al obtener token de MercadoLibre: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Token obtenido correctamente:", data.access_token.substring(0, 10) + "...")
      return data.access_token
    } catch (error) {
      retries++
      console.error(`Error en autenticación con MercadoLibre (intento ${retries}/${maxRetries}):`, error)

      if (retries >= maxRetries) {
        console.error("Se agotaron los reintentos para obtener el token")
        return null
      }

      // Esperar antes de reintentar (backoff exponencial)
      const waitTime = 1000 * Math.pow(2, retries)
      console.log(`Esperando ${waitTime / 1000} segundos antes de reintentar...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  return null
}

// Función para buscar propiedades en MercadoLibre con reintentos
export async function buscarPropiedadesMercadoLibre(
  ubicacion?: string,
  precioMaximo?: number,
  tipoPropiedad?: string,
  maxRetries = 2,
): Promise<Propiedad[]> {
  let retries = 0

  while (retries < maxRetries) {
    try {
      // Obtener token de acceso
      const accessToken = await getAccessToken()
      if (!accessToken) {
        console.error("No se pudo obtener token de acceso para MercadoLibre")
        throw new Error("No se pudo obtener token de acceso")
      }

      // Construir URL base
      let url = "https://api.mercadolibre.com/sites/MLA/search"

      // Construir parámetros de búsqueda
      const params = new URLSearchParams()

      // Parámetros fijos
      params.append("category", "MLA1459") // Categoría de inmuebles
      params.append("OPERATION", "242075") // Operación: Venta (ID exacto de MercadoLibre)
      params.append("limit", "50") // Límite de resultados

      // Filtro de ubicación
      if (ubicacion && ubicacion !== "Argentina") {
        if (ubicacion === "Capital Federal") {
          params.append("state", "TUxBUENBUGw3M2E1") // ID exacto de Capital Federal
        } else if (ubicacion === "Buenos Aires") {
          params.append("state", "TUxBUEJVRWFiY2Vm") // ID exacto de Buenos Aires
        } else if (ubicacion === "Córdoba") {
          params.append("state", "TUxBUENPUmFkZGIw") // ID exacto de Córdoba
        } else if (ubicacion === "Santa Fe") {
          params.append("state", "TUxBUFNBTmE5Nzc4") // ID exacto de Santa Fe
        } else if (ubicacion === "Mendoza") {
          params.append("state", "TUxBUE1FTmE5OWQ4") // ID exacto de Mendoza
        } else {
          // Usar como término de búsqueda para otras ubicaciones
          params.append("q", `${ubicacion} inmuebles`)
        }
      }

      // Filtro de precio máximo
      if (precioMaximo && precioMaximo > 0) {
        params.append("price", `*-${precioMaximo}`)
      }

      // Filtro de tipo de propiedad
      if (tipoPropiedad) {
        if (tipoPropiedad === "departamentos") {
          params.append("PROPERTY_TYPE", "242059") // ID exacto de departamentos
        } else if (tipoPropiedad === "casas") {
          params.append("PROPERTY_TYPE", "242060") // ID exacto de casas
        } else if (tipoPropiedad === "ph") {
          params.append("PROPERTY_TYPE", "242061") // ID exacto de PH
        }
      }

      // URL completa
      url = `${url}?${params.toString()}`
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
        const errorText = await response.text()
        console.error(`Error en la respuesta de MercadoLibre (${response.status}):`, errorText)
        throw new Error(`Error en la búsqueda de propiedades: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`MercadoLibre encontró ${data.results?.length || 0} resultados`)

      if (data.results?.length > 0) {
        console.log("Primer resultado:", JSON.stringify(data.results[0], null, 2))
      } else {
        console.log("No se encontraron resultados")
      }

      // Transformar resultados al formato de nuestra aplicación
      const propiedades: Propiedad[] = (data.results || [])
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
          } catch (mapError) {
            console.error("Error al mapear propiedad:", mapError, "Item:", item)
            return null
          }
        })
        .filter(Boolean) // Eliminar elementos nulos

      return propiedades
    } catch (error) {
      retries++
      console.error(`Error al buscar propiedades en MercadoLibre (intento ${retries}/${maxRetries}):`, error)

      if (retries >= maxRetries) {
        console.error("Se agotaron los reintentos para buscar propiedades")
        return []
      }

      // Esperar antes de reintentar (backoff exponencial)
      const waitTime = 1000 * Math.pow(2, retries)
      console.log(`Esperando ${waitTime / 1000} segundos antes de reintentar...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  return []
}
