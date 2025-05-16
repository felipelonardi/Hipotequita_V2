import { NextResponse } from "next/server"

// Valor UVA hardcodeado (actualizado al 18/03/2025)
const VALOR_UVA_FALLBACK = 1384.3
const FECHA_UVA_FALLBACK = "2025-03-18"

export async function GET() {
  return NextResponse.json({
    success: true,
    valor: VALOR_UVA_FALLBACK,
    fecha: FECHA_UVA_FALLBACK,
    fuente: "Valor hardcodeado",
  })
}
