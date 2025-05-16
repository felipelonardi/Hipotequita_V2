import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Intentar obtener el valor UVA desde una API pública alternativa
    const response = await fetch("https://api.estadisticasbcra.com/uva", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Error al obtener datos: ${response.status} ${response.statusText}`,
      })
    }

    const data = await response.json()

    // Verificar si hay datos
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No se encontraron datos de UVA",
      })
    }

    // Obtener el último valor
    const ultimoValor = data[data.length - 1]

    return NextResponse.json({
      success: true,
      valor: ultimoValor.v,
      fecha: ultimoValor.d,
      fuente: "API estadísticasbcra",
    })
  } catch (error) {
    console.error("Error al obtener valor UVA alternativo:", error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}
