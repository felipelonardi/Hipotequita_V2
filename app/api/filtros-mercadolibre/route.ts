import { NextResponse } from "next/server"

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

// Función para obtener los filtros disponibles para inmuebles
export async function GET() {
  try {
    // Obtener token de acceso
    const accessToken = await getAccessToken()

    // Realizar una búsqueda básica para obtener los filtros disponibles
    const response = await fetch("https://api.mercadolibre.com/sites/MLA/search?category=MLA1459&limit=1", {
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

    // Extraer y organizar la información de filtros
    const filters = data.filters || []
    const availableFilters = data.available_filters || []

    // Obtener información específica sobre operaciones (venta, alquiler, etc.)
    const operationFilter = availableFilters.find((f: any) => f.id === "OPERATION") || { values: [] }
    const operations = operationFilter.values.map((v: any) => ({
      id: v.id,
      name: v.name,
      results: v.results,
    }))

    // Obtener información sobre tipos de propiedad
    const propertyTypeFilter = availableFilters.find((f: any) => f.id === "PROPERTY_TYPE") || { values: [] }
    const propertyTypes = propertyTypeFilter.values.map((v: any) => ({
      id: v.id,
      name: v.name,
      results: v.results,
    }))

    // Obtener información sobre ubicaciones
    const stateFilter = availableFilters.find((f: any) => f.id === "state") || { values: [] }
    const states = stateFilter.values.map((v: any) => ({
      id: v.id,
      name: v.name,
      results: v.results,
    }))

    // Devolver la información organizada
    return NextResponse.json({
      success: true,
      filters: {
        operations,
        propertyTypes,
        states,
      },
      rawFilters: filters,
      rawAvailableFilters: availableFilters,
    })
  } catch (error) {
    console.error("Error al obtener filtros:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error al obtener filtros: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
