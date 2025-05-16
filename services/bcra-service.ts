"use server"

// Función para obtener el valor UVA actual
export async function obtenerValorUVAActual(): Promise<number | null> {
  try {
    // Intentar obtener el valor UVA desde la API pública del BCRA
    const response = await fetch("https://api.bcra.gob.ar/publico/series/v1/series/uva/datos", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 86400 }, // Revalidar cada 24 horas
    })

    if (!response.ok) {
      console.error(`Error al obtener valor UVA desde BCRA: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()

    // Extraer el valor más reciente
    if (data && data.datos && data.datos.length > 0) {
      const ultimoValor = data.datos[data.datos.length - 1]
      return ultimoValor.v
    }

    return null
  } catch (error) {
    console.error("Error al obtener valor UVA desde BCRA:", error)

    // Intentar con un enfoque alternativo - valor fijo actualizado manualmente
    // Este valor se puede actualizar periódicamente consultando la página del BCRA
    const valorUVAActual = 1381.11 // Valor actualizado al 18/03/2025
    return valorUVAActual
  }
}
