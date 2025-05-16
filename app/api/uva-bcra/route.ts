import { NextResponse } from "next/server"

// Valor UVA hardcodeado como último recurso (actualizado al 18/03/2025)
const VALOR_UVA_FALLBACK = 1384.3
const FECHA_UVA_FALLBACK = "2025-03-18"

export async function GET() {
  try {
    console.log("Iniciando obtención de valor UVA desde BCRA")

    try {
      // Intentar obtener el valor UVA desde la API pública de Argentina Datos
      const response = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/uva", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        next: { revalidate: 86400 }, // Revalidar cada 24 horas
      })

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Verificar si hay datos
      if (Array.isArray(data) && data.length > 0) {
        // Obtener el último valor
        const ultimoValor = data[data.length - 1]

        return NextResponse.json({
          success: true,
          valor: ultimoValor.valor,
          fecha: ultimoValor.fecha,
          fuente: "Argentina Datos API",
        })
      } else {
        throw new Error("No se encontraron datos de UVA")
      }
    } catch (fetchError) {
      console.error("Error al obtener datos de Argentina Datos:", fetchError)

      // Intentar con un segundo método
      try {
        // Realizar la petición a la página del BCRA
        const response = await fetch("https://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables.asp", {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          },
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} ${response.statusText}`)
        }

        // Obtener el HTML de la página como texto
        const html = await response.text()

        // Usar expresiones regulares para encontrar el valor UVA
        const uvaRegex = /UVA[^0-9]*([0-9.,]+)/i
        const match = html.replace(/\n/g, " ").match(uvaRegex)

        if (!match || !match[1]) {
          throw new Error("No se encontró el valor UVA en la página")
        }

        // Limpiar y convertir el valor encontrado
        const valorTexto = match[1].replace(/\./g, "").replace(",", ".").trim()
        const valorUVA = Number.parseFloat(valorTexto)

        if (isNaN(valorUVA)) {
          throw new Error("El valor UVA encontrado no es un número válido: " + valorTexto)
        }

        // Obtener la fecha actual para el registro
        const hoy = new Date()
        const fechaUVA = hoy.toISOString().split("T")[0]

        console.log(`Valor UVA obtenido: ${valorUVA}, Fecha: ${fechaUVA}`)

        // Devolver el valor encontrado
        return NextResponse.json({
          success: true,
          valor: valorUVA,
          fecha: fechaUVA,
          fuente: "BCRA (web scraping)",
        })
      } catch (scrapingError) {
        console.error("Error al obtener datos del BCRA mediante scraping:", scrapingError)
        throw scrapingError
      }
    }
  } catch (error) {
    console.error("Error general en la obtención del valor UVA:", error)

    // Devolver el valor hardcodeado como último recurso
    return NextResponse.json({
      success: true,
      valor: VALOR_UVA_FALLBACK,
      fecha: FECHA_UVA_FALLBACK,
      fuente: "Valor de respaldo (último recurso)",
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}
