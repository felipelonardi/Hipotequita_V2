import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Obtener el ID de MercadoLibre de la URL
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Se requiere un ID de MercadoLibre",
        },
        { status: 400 },
      )
    }

    // Construir la URL para obtener detalles del item
    const url = `https://api.mercadolibre.com/items/MLA${id}`
    console.log("URL de detalle de MercadoLibre:", url)

    // Realizar la petición a la API pública de MercadoLibre
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "SimuladorHipotecario/1.0",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener detalles: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Devolver solo los campos necesarios
    return NextResponse.json({
      success: true,
      id: data.id,
      title: data.title,
      price: data.price,
      currency_id: data.currency_id,
      permalink: data.permalink,
    })
  } catch (error) {
    console.error("Error al obtener detalles de la propiedad:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error al obtener detalles: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
