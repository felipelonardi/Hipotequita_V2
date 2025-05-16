"use server"

import { buscarPropiedadesMercadoLibre } from "./mercadolibre-service"
import type { Propiedad } from "@/types/tipos"

// Función simplificada para buscar propiedades
export async function buscarPropiedades(
  ubicacion?: string,
  precioMaximo?: number,
  tipoPropiedad?: string,
): Promise<Propiedad[]> {
  // Verificar si tenemos las credenciales de MercadoLibre
  const usarAPIMercadoLibre = process.env.MERCADOLIBRE_CLIENT_ID && process.env.MERCADOLIBRE_CLIENT_SECRET

  console.log("Iniciando búsqueda de propiedades con los siguientes parámetros:", {
    ubicacion,
    precioMaximo,
    tipoPropiedad,
    usarAPIMercadoLibre,
  })

  // Validar parámetros antes de la búsqueda
  if (precioMaximo && (isNaN(precioMaximo) || precioMaximo <= 0)) {
    console.warn("Precio máximo inválido:", precioMaximo, "- Se ignorará este filtro")
    precioMaximo = undefined
  }

  if (tipoPropiedad && !["departamentos", "casas", "ph"].includes(tipoPropiedad)) {
    console.warn("Tipo de propiedad inválido:", tipoPropiedad, "- Se ignorará este filtro")
    tipoPropiedad = undefined
  }

  try {
    // Intentar con la API autenticada si tenemos credenciales
    if (usarAPIMercadoLibre) {
      try {
        console.log("Intentando búsqueda con API autenticada...")
        const propiedades = await buscarPropiedadesMercadoLibre(ubicacion, precioMaximo, tipoPropiedad)
        console.log(`API autenticada encontró ${propiedades.length} propiedades`)
        return propiedades
      } catch (error) {
        console.error("Error en búsqueda autenticada:", error)
        return []
      }
    } else {
      console.log("No se encontraron credenciales de MercadoLibre")
      return []
    }
  } catch (error) {
    console.error("Error general al buscar propiedades:", error)
    return []
  }
}
