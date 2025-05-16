"use server"

import { propiedadesMock } from "@/data/propiedades-mock"
import { buscarPropiedadesMercadoLibre } from "./mercadolibre-service"
import type { Propiedad } from "@/types/tipos"

// Función para obtener ubicaciones disponibles
export async function obtenerUbicacionesDisponibles(): Promise<string[]> {
  try {
    // Extraer ubicaciones únicas de las propiedades mock
    if (!propiedadesMock || !Array.isArray(propiedadesMock)) {
      console.error("propiedadesMock no es un array válido")
      return []
    }

    const ubicaciones = propiedadesMock.map((propiedad) => propiedad.ubicacion)
    return [...new Set(ubicaciones)]
  } catch (error) {
    console.error("Error al obtener ubicaciones disponibles:", error)
    return []
  }
}

// Función para buscar propiedades
export async function buscarPropiedades(
  ubicaciones: string[],
  ambientes?: string,
  dormitorios?: string,
  cochera?: boolean,
  metrosCubiertosMin?: number,
  metrosCubiertosMax?: number,
  precioMaximoDolares?: number,
  tipoPropiedad?: string | null,
  operacion?: string,
  aptoCredito?: boolean,
  precioMinimoDolares?: number,
): Promise<Propiedad[]> {
  // Verificar si tenemos las credenciales de MercadoLibre
  const usarAPIMercadoLibre = process.env.MERCADOLIBRE_CLIENT_ID && process.env.MERCADOLIBRE_CLIENT_SECRET

  // Procesar rangos de ambientes y dormitorios
  let ambientesMinimo: number | undefined = undefined
  let ambientesMaximo: number | undefined = undefined
  let dormitoriosMinimo: number | undefined = undefined
  let dormitoriosMaximo: number | undefined = undefined

  if (ambientes) {
    if (ambientes.includes("-")) {
      const [min, max] = ambientes.split("-").map(Number)
      ambientesMinimo = min
      ambientesMaximo = max
    } else if (ambientes.includes("+")) {
      ambientesMinimo = Number.parseInt(ambientes.replace("+", ""))
    } else {
      // Valor exacto
      ambientesMinimo = Number.parseInt(ambientes)
      ambientesMaximo = Number.parseInt(ambientes)
    }
  }

  if (dormitorios) {
    if (dormitorios.includes("-")) {
      const [min, max] = dormitorios.split("-").map(Number)
      dormitoriosMinimo = min
      dormitoriosMaximo = max
    } else if (dormitorios.includes("+")) {
      dormitoriosMinimo = Number.parseInt(dormitorios.replace("+", ""))
    } else {
      // Valor exacto
      dormitoriosMinimo = Number.parseInt(dormitorios)
      dormitoriosMaximo = Number.parseInt(dormitorios)
    }
  }

  if (usarAPIMercadoLibre) {
    try {
      console.log("Usando API de MercadoLibre para buscar propiedades")

      // Intentar buscar propiedades reales en MercadoLibre
      const propiedadesReales = await buscarPropiedadesMercadoLibre(
        ubicaciones,
        ambientes,
        dormitorios,
        cochera,
        metrosCubiertosMin,
        metrosCubiertosMax,
        precioMaximoDolares,
        tipoPropiedad,
        operacion,
        aptoCredito,
        precioMinimoDolares,
      )

      // Si encontramos propiedades, las devolvemos
      if (propiedadesReales.length > 0) {
        console.log(`Se encontraron ${propiedadesReales.length} propiedades reales`)
        return propiedadesReales
      }

      // Si no encontramos propiedades, caemos al modo de datos mock
      console.log("No se encontraron propiedades reales, usando datos mock")
    } catch (error) {
      console.error("Error al buscar propiedades reales:", error)
      // En caso de error, también caemos al modo de datos mock
    }
  } else {
    console.log("No se encontraron credenciales de MercadoLibre, usando datos mock")
  }

  // Filtrar propiedades mock según los criterios
  console.log("Filtrando propiedades mock con criterios:", {
    ubicaciones,
    ambientesMinimo,
    ambientesMaximo,
    dormitoriosMinimo,
    dormitoriosMaximo,
    metrosCubiertosMin,
    metrosCubiertosMax,
    precioMaximoDolares,
    precioMinimoDolares,
    tipoPropiedad,
    cochera,
  })

  // Aplicar filtros a los datos mock
  let propiedadesFiltradas = propiedadesMock

  // Filtrar por precio máximo si está definido
  if (precioMaximoDolares) {
    propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.precioDolares <= precioMaximoDolares)
  }

  // Filtrar por precio mínimo si está definido
  if (precioMinimoDolares) {
    propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.precioDolares >= precioMinimoDolares)
  }

  // Filtrar por ubicación si está definida y no es "Argentina"
  if (ubicaciones.length > 0 && ubicaciones[0] !== "Argentina") {
    const ubicacion = ubicaciones[0].split(",")[0].toLowerCase()
    propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.ubicacion.toLowerCase().includes(ubicacion))
  }

  // Filtrar por ambientes
  if (ambientesMinimo !== undefined || ambientesMaximo !== undefined) {
    propiedadesFiltradas = propiedadesFiltradas.filter((p) => {
      if (ambientesMinimo !== undefined && p.ambientes < ambientesMinimo) return false
      if (ambientesMaximo !== undefined && p.ambientes > ambientesMaximo) return false
      return true
    })
  }

  // Filtrar por dormitorios
  if (dormitoriosMinimo !== undefined || dormitoriosMaximo !== undefined) {
    propiedadesFiltradas = propiedadesFiltradas.filter((p) => {
      if (dormitoriosMinimo !== undefined && p.dormitorios < dormitoriosMinimo) return false
      if (dormitoriosMaximo !== undefined && p.dormitorios > dormitoriosMaximo) return false
      return true
    })
  }

  // Filtrar por metros cubiertos
  if (metrosCubiertosMin !== undefined || metrosCubiertosMax !== undefined) {
    propiedadesFiltradas = propiedadesFiltradas.filter((p) => {
      if (metrosCubiertosMin !== undefined && p.metrosCubiertos < metrosCubiertosMin) return false
      if (metrosCubiertosMax !== undefined && p.metrosCubiertos > metrosCubiertosMax) return false
      return true
    })
  }

  // Filtrar por cochera
  if (cochera) {
    propiedadesFiltradas = propiedadesFiltradas.filter((p) => p.cochera)
  }

  // Filtrar por tipo de propiedad
  if (tipoPropiedad) {
    const tipos = tipoPropiedad.split(",")
    propiedadesFiltradas = propiedadesFiltradas.filter((p) =>
      tipos.some((tipo) => p.titulo.toLowerCase().includes(tipo.toLowerCase())),
    )
  }

  // Si no hay resultados después de filtrar, devolver un subconjunto de datos mock
  if (propiedadesFiltradas.length === 0) {
    console.log("No hay resultados después de filtrar, devolviendo datos mock básicos")
    return propiedadesMock.slice(0, 6)
  }

  return propiedadesFiltradas
}
