import { NextResponse } from "next/server"

// Función para obtener token de acceso
async function getAccessToken() {
  try {
    const clientId = process.env.MERCADOLIBRE_CLIENT_ID
    const clientSecret = process.env.MERCADOLIBRE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return {
        success: false,
        error: "Faltan credenciales de MercadoLibre. Verifica las variables de entorno.",
        details: { clientIdExists: !!clientId, clientSecretExists: !!clientSecret },
      }
    }

    console.log("Obteniendo token de acceso de MercadoLibre...")

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

    const responseText = await response.text()
    let responseData

    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      responseData = { raw: responseText }
    }

    if (!response.ok) {
      return {
        success: false,
        error: `Error al obtener token de MercadoLibre: ${response.status} ${response.statusText}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          response: responseData,
        },
      }
    }

    return {
      success: true,
      token: responseData.access_token,
      tokenType: responseData.token_type,
      expiresIn: responseData.expires_in,
      scope: responseData.scope,
    }
  } catch (error) {
    return {
      success: false,
      error: `Error en autenticación con MercadoLibre: ${error instanceof Error ? error.message : String(error)}`,
      details: { error },
    }
  }
}

// Función para obtener los filtros disponibles
async function getAvailableFilters(accessToken: string) {
  try {
    // Realizar una búsqueda básica para obtener los filtros disponibles
    const url = "https://api.mercadolibre.com/sites/MLA/search?category=MLA1459&limit=1"

    console.log("Obteniendo filtros disponibles de MercadoLibre:", url)

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "User-Agent": "SimuladorHipotecario/1.0",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener filtros: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Extraer información de filtros
    return {
      success: true,
      filters: data.filters || [],
      availableFilters: data.available_filters || [],
    }
  } catch (error) {
    return {
      success: false,
      error: `Error al obtener filtros: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Función para probar una búsqueda con filtros específicos
async function testFilteredSearch(accessToken: string) {
  try {
    // Construir URL con filtros específicos para inmuebles en venta
    // Usamos los IDs exactos que proporciona MercadoLibre
    const url = "https://api.mercadolibre.com/sites/MLA/search?category=MLA1459&OPERATION=242075&limit=5"

    console.log("Realizando búsqueda filtrada en MercadoLibre:", url)

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "User-Agent": "SimuladorHipotecario/1.0",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error en la búsqueda filtrada: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      totalResults: data.paging?.total || 0,
      resultsCount: data.results?.length || 0,
      firstResult: data.results?.[0]
        ? {
            id: data.results[0].id,
            title: data.results[0].title,
            price: data.results[0].price,
            permalink: data.results[0].permalink,
          }
        : null,
      appliedFilters: data.filters || [],
      availableFilters: data.available_filters || [],
    }
  } catch (error) {
    return {
      success: false,
      error: `Error en la búsqueda filtrada: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

export async function GET() {
  try {
    // Paso 1: Verificar variables de entorno
    const envCheck = {
      clientId: !!process.env.MERCADOLIBRE_CLIENT_ID,
      clientSecret: !!process.env.MERCADOLIBRE_CLIENT_SECRET,
    }

    // Paso 2: Obtener token de acceso
    const tokenResult = await getAccessToken()

    // Si no se pudo obtener el token, devolver el resultado
    if (!tokenResult.success) {
      return NextResponse.json({
        success: false,
        envCheck,
        tokenResult,
        message: "No se pudo obtener el token de acceso",
      })
    }

    // Paso 3: Obtener filtros disponibles
    const filtersResult = await getAvailableFilters(tokenResult.token)

    // Paso 4: Realizar una búsqueda con filtros específicos
    const filteredSearchResult = await testFilteredSearch(tokenResult.token)

    // Devolver todos los resultados
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      envCheck,
      tokenResult,
      filtersResult,
      filteredSearchResult,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Error general: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString(),
    })
  }
}
