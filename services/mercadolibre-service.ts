"use server"

import type { Propiedad } from "@/types/tipos"

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
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!response.ok) {
      throw new Error("Error al obtener token de MercadoLibre")
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error en autenticación con MercadoLibre:", error)
    return null
  }
}

// Función para buscar propiedades en MercadoLibre
export async function buscarPropiedadesMercadoLibre(
  ubicaciones: string[],
  ambientes?: string,
  dormitorios?: string,
  cochera?: boolean,
  metrosCubiertosMin?: number,
  metrosCubiertosMax?: number,
  precioMaximoDolares?: number,
  tipoPropiedad?: string | null,
): Promise<Propiedad[]> {
  try {
    // Obtener token de acceso
    const accessToken = await getAccessToken()
    if (!accessToken) {
      throw new Error("No se pudo obtener token de acceso")
    }

    // Construir parámetros de búsqueda
    let query = "inmuebles"

    // Agregar ubicación si está especificada
    if (ubicaciones && ubicaciones.length > 0) {
      // Usar la primera ubicación para la búsqueda principal
      // (MercadoLibre tiene limitaciones en búsquedas multi-ubicación)
      query += ` en ${ubicaciones[0]}`
    }

    // Construir URL con parámetros
    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(query)}&category=MLA1459`

    // Filtros adicionales
    const filters = []

    // Filtro de precio máximo
    if (precioMaximoDolares) {
      url += `&price=*-${precioMaximoDolares}`
    }

    // Filtro de ambientes
    if (ambientes && ambientes !== "cualquiera") {
      if (ambientes === "4+") {
        filters.push({ id: "ambientes", value: "4" })
        filters.push({ id: "ambientes", value: "5" })
        filters.push({ id: "ambientes", value: "6" })
      } else if (ambientes === "5+") {
        filters.push({ id: "ambientes", value: "5" })
        filters.push({ id: "ambientes", value: "6" })
      } else {
        filters.push({ id: "ambientes", value: ambientes })
      }
    }

    // Filtro de dormitorios
    if (dormitorios && dormitorios !== "cualquiera") {
      if (dormitorios === "3+") {
        filters.push({ id: "dormitorios", value: "3" })
        filters.push({ id: "dormitorios", value: "4" })
        filters.push({ id: "dormitorios", value: "5" })
      } else if (dormitorios === "4+") {
        filters.push({ id: "dormitorios", value: "4" })
        filters.push({ id: "dormitorios", value: "5" })
      } else {
        filters.push({ id: "dormitorios", value: dormitorios })
      }
    }

    // Filtro de metros cubiertos
    if (metrosCubiertosMin && metrosCubiertosMin > 0) {
      url += `&COVERED_AREA_FROM=${metrosCubiertosMin}`
    }

    if (metrosCubiertosMax && metrosCubiertosMax < 300) {
      url += `&COVERED_AREA_TO=${metrosCubiertosMax}`
    }

    // Realizar la petición a la API
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error en la búsqueda de propiedades")
    }

    const data = await response.json()

    // Transformar resultados al formato de nuestra aplicación
    const propiedades: Propiedad[] = data.results.map((item: any) => {
      // Extraer información de atributos
      const getAttributeValue = (name: string) => {
        const attr = item.attributes.find((a: any) => a.id === name)
        return attr ? attr.value_name : null
      }

      const ambientes = getAttributeValue("ROOMS") || "1"
      const dormitorios = getAttributeValue("BEDROOMS") || "1"
      const metrosCubiertos = Number.parseInt(getAttributeValue("COVERED_AREA") || "0")
      const metrosTotales = Number.parseInt(getAttributeValue("TOTAL_AREA") || "0")
      const cochera = getAttributeValue("PARKING_LOTS") ? Number.parseInt(getAttributeValue("PARKING_LOTS")) > 0 : false

      return {
        id: item.id,
        titulo: item.title,
        precioDolares: item.price,
        ubicacion: item.address?.city_name || "Argentina",
        ambientes: Number.parseInt(ambientes),
        dormitorios: Number.parseInt(dormitorios),
        cochera,
        metrosCubiertos,
        metrosTotales: metrosTotales || metrosCubiertos,
        aptaCredito: item.accepts_mercadopago, // Aproximación
        imagen: item.thumbnail,
        thumbnail: item.thumbnail,
        plataforma: "mercadolibre",
        url: item.permalink,
      }
    })

    return propiedades
  } catch (error) {
    console.error("Error al buscar propiedades en MercadoLibre:", error)
    return []
  }
}
