"use server"

// Interfaz para la respuesta de la API
interface DolarResponse {
  compra: number
  venta: number
  casa: string
  nombre: string
  moneda: string
  fechaActualizacion: string
}

// Función para obtener la cotización del dólar MEP
export async function obtenerCotizacionDolarMEP(): Promise<number> {
  try {
    // Intentar con la API principal
    try {
      // Llamada a la API de DolarApi.com para obtener el dólar MEP (Bolsa)
      const response = await fetch("https://dolarapi.com/v1/dolares/bolsa", {
        headers: {
          Accept: "application/json",
          "User-Agent": "SimuladorHipotecario/1.0",
        },
        next: { revalidate: 3600 }, // Revalidar cada hora
      })

      if (response.ok) {
        const data: DolarResponse = await response.json()
        console.log("Cotización dólar MEP obtenida correctamente:", data.venta)
        // Usamos el valor de venta del dólar MEP
        return data.venta
      } else {
        console.warn(`Error en respuesta de API dólar: ${response.status} ${response.statusText}`)
        throw new Error(`Error en respuesta: ${response.status}`)
      }
    } catch (primaryError) {
      console.warn("Error con API principal, intentando alternativa:", primaryError)

      // Intentar con una API alternativa
      try {
        const altResponse = await fetch("https://api.bluelytics.com.ar/v2/latest", {
          headers: {
            Accept: "application/json",
            "User-Agent": "SimuladorHipotecario/1.0",
          },
          cache: "no-store",
        })

        if (altResponse.ok) {
          const altData = await altResponse.json()
          if (altData && altData.blue) {
            console.log("Cotización alternativa obtenida:", altData.blue.value_sell)
            // Usar el valor del dólar blue como aproximación
            return altData.blue.value_sell
          }
        }
        throw new Error("API alternativa no disponible")
      } catch (altError) {
        console.warn("Error con API alternativa:", altError)
        throw altError
      }
    }
  } catch (error) {
    console.error("Error al obtener cotización del dólar MEP:", error)
    // Valor actualizado por defecto en caso de error (marzo 2025)
    const valorPorDefecto = 1650
    console.log(`Usando valor por defecto: ${valorPorDefecto}`)
    return valorPorDefecto
  }
}

// Función para obtener todas las cotizaciones disponibles
export async function obtenerTodasLasCotizaciones() {
  try {
    const response = await fetch("https://dolarapi.com/v1/dolares", {
      headers: {
        Accept: "application/json",
        "User-Agent": "SimuladorHipotecario/1.0",
      },
      next: { revalidate: 3600 }, // Revalidar cada hora
    })

    if (!response.ok) {
      throw new Error(`Error al obtener cotizaciones: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error)
    throw error
  }
}

// Caché local para evitar llamadas frecuentes
let cachedDolarMEP: number | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 3600000 // 1 hora en milisegundos

// Función para obtener la cotización con caché
export async function obtenerCotizacionDolarMEPConCache(): Promise<number> {
  const now = Date.now()

  // Si tenemos un valor en caché y no ha expirado, usarlo
  if (cachedDolarMEP !== null && now - cacheTimestamp < CACHE_DURATION) {
    console.log("Usando valor en caché para dólar MEP:", cachedDolarMEP)
    return cachedDolarMEP
  }

  // Si no hay caché o expiró, obtener nuevo valor
  try {
    const valor = await obtenerCotizacionDolarMEP()
    // Guardar en caché
    cachedDolarMEP = valor
    cacheTimestamp = now
    return valor
  } catch (error) {
    console.error("Error al obtener cotización con caché:", error)
    // Si hay un error pero tenemos un valor en caché, usarlo aunque haya expirado
    if (cachedDolarMEP !== null) {
      console.log("Usando valor en caché expirado:", cachedDolarMEP)
      return cachedDolarMEP
    }
    // Si no hay caché, usar valor por defecto
    return 1650
  }
}
