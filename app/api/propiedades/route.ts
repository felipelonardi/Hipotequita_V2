import { type NextRequest, NextResponse } from "next/server"
import { buscarPropiedadesMercadoLibre } from "@/app/services/mercadolibre-service"

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const searchParams = request.nextUrl.searchParams
    const ubicacion = searchParams.get("ubicacion") || undefined
    const tipoPropiedad = searchParams.get("tipoPropiedad") || undefined
    const precioMaximoStr = searchParams.get("precioMaximo")

    // Convertir precio máximo a número
    const precioMaximo = precioMaximoStr ? Number.parseInt(precioMaximoStr) : undefined

    console.log("Búsqueda de propiedades con parámetros:", { ubicacion, tipoPropiedad, precioMaximo })

    // Validar parámetros
    if (precioMaximo !== undefined && (isNaN(precioMaximo) || precioMaximo <= 0)) {
      return NextResponse.json(
        {
          success: false,
          error: "El precio máximo debe ser un número positivo",
        },
        { status: 400 },
      )
    }

    // Buscar propiedades
    const propiedades = await buscarPropiedadesMercadoLibre(ubicacion, precioMaximo, tipoPropiedad)

    // Devolver resultados
    return NextResponse.json({
      success: true,
      propiedades,
      count: propiedades.length,
      params: { ubicacion, tipoPropiedad, precioMaximo },
    })
  } catch (error) {
    console.error("Error al buscar propiedades:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error al buscar propiedades: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
