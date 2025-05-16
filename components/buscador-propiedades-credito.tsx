"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search, Home, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ubicacionesPrincipales, barriosCapitalFederal, ciudadesPorProvincia } from "@/data/ubicaciones"
import { PropiedadCard } from "./propiedad-card"

// Importar el servicio para obtener la cotización del dólar
import { obtenerCotizacionDolarMEPConCache } from "@/services/dolar-service"

interface BuscadorPropiedadesCreditoProps {
  montoPrestamoAprobado?: number
  valorPropiedad?: number // Nuevo prop para el valor de la propiedad
  porcentajeFinanciacion?: number
}

export default function BuscadorPropiedadesCredito({
  montoPrestamoAprobado,
  valorPropiedad = 0, // Valor por defecto
  porcentajeFinanciacion = 80,
}: BuscadorPropiedadesCreditoProps) {
  // Convertir el precio máximo a dólares usando una cotización estimada
  const [cotizacionDolarMEP, setCotizacionDolarMEP] = useState<number>(1650) // Valor inicial actualizado por defecto (marzo 2025)
  const [cargandoCotizacion, setCargandoCotizacion] = useState<boolean>(true)

  // Estados
  const [ubicacionPrincipal, setUbicacionPrincipal] = useState<string>("")
  const [subUbicacion, setSubUbicacion] = useState<string>("")
  const [subUbicacionesDisponibles, setSubUbicacionesDisponibles] = useState<Array<{ id: string; nombre: string }>>([])
  const [tipoPropiedad, setTipoPropiedad] = useState<string>("")
  const [precioMinimo, setPrecioMinimo] = useState<string>("")
  const [precioMaximo, setPrecioMaximo] = useState<string>("")
  const [ambientes, setAmbientes] = useState<string>("")
  const [dormitorios, setDormitorios] = useState<string>("")
  const [metrosCubiertosMin, setMetrosCubiertosMin] = useState<string>("")
  const [metrosCubiertosMax, setMetrosCubiertosMax] = useState<string>("")
  const [cochera, setCochera] = useState<boolean>(false)
  const [aptoCredito, setAptoCredito] = useState<boolean>(true) // Por defecto activado para créditos
  const [propiedades, setPropiedades] = useState<any[]>([])
  const [cargando, setCargando] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [busquedaRealizada, setBusquedaRealizada] = useState<boolean>(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Añadir después de las declaraciones de estado existentes
  const [propiedadesDetalle, setPropiedadesDetalle] = useState<Record<string, any>>({})
  const [cargandoDetalle, setCargandoDetalle] = useState<Record<string, boolean>>({})

  // Agregar este useEffect después de las declaraciones de estado
  useEffect(() => {
    async function cargarCotizacion() {
      try {
        setCargandoCotizacion(true)
        const cotizacion = await obtenerCotizacionDolarMEPConCache()
        setCotizacionDolarMEP(cotizacion)
        console.log("Cotización dólar MEP cargada:", cotizacion)
      } catch (error) {
        console.error("Error al cargar cotización:", error)
        // Usar valor por defecto en caso de error
        setCotizacionDolarMEP(1650)
      } finally {
        setCargandoCotizacion(false)
      }
    }

    cargarCotizacion()
  }, [])

  // Calcular precio máximo basado en el valor de la propiedad directamente
  // Esto es lo que cambia: usamos valorPropiedad directamente, no calculamos a partir del monto del préstamo
  const precioMaximoPesos = valorPropiedad || 0
  const precioMaximoDolares = precioMaximoPesos ? Math.round(precioMaximoPesos / cotizacionDolarMEP) : undefined

  // Actualizar sububicaciones cuando cambia la ubicación principal
  useEffect(() => {
    if (ubicacionPrincipal === "capital-federal") {
      setSubUbicacionesDisponibles(barriosCapitalFederal)
    } else if (ubicacionPrincipal && ubicacionPrincipal.startsWith("bs-as-")) {
      // Definir ciudades para cada región de Buenos Aires
      const ciudadesBsAs: Record<string, Array<{ id: string; nombre: string }>> = {
        "bs-as-gba-norte": [
          { id: "vicente-lopez", nombre: "Vicente López" },
          { id: "san-isidro", nombre: "San Isidro" },
          { id: "tigre", nombre: "Tigre" },
          { id: "san-fernando", nombre: "San Fernando" },
          { id: "pilar", nombre: "Pilar" },
          { id: "escobar", nombre: "Escobar" },
        ],
        "bs-as-gba-sur": [
          { id: "avellaneda", nombre: "Avellaneda" },
          { id: "quilmes", nombre: "Quilmes" },
          { id: "lomas-de-zamora", nombre: "Lomas de Zamora" },
          { id: "lanus", nombre: "Lanús" },
          { id: "florencio-varela", nombre: "Florencio Varela" },
          { id: "berazategui", nombre: "Berazategui" },
        ],
        "bs-as-gba-oeste": [
          { id: "moron", nombre: "Morón" },
          { id: "la-matanza", nombre: "La Matanza" },
          { id: "merlo", nombre: "Merlo" },
          { id: "moreno", nombre: "Moreno" },
          { id: "tres-de-febrero", nombre: "Tres de Febrero" },
          { id: "hurlingham", nombre: "Hurlingham" },
        ],
        "bs-as-costa-atlantica": [
          { id: "mar-del-plata", nombre: "Mar del Plata" },
          { id: "pinamar", nombre: "Pinamar" },
          { id: "villa-gesell", nombre: "Villa Gesell" },
          { id: "miramar", nombre: "Miramar" },
          { id: "necochea", nombre: "Necochea" },
          { id: "san-bernardo", nombre: "San Bernardo" },
        ],
        "bs-as-interior": [
          { id: "la-plata", nombre: "La Plata" },
          { id: "bahia-blanca", nombre: "Bahía Blanca" },
          { id: "tandil", nombre: "Tandil" },
          { id: "junin", nombre: "Junín" },
          { id: "pergamino", nombre: "Pergamino" },
          { id: "olavarria", nombre: "Olavarría" },
        ],
      }

      // Usar las ciudades correspondientes a la región seleccionada
      if (ciudadesBsAs[ubicacionPrincipal]) {
        setSubUbicacionesDisponibles(ciudadesBsAs[ubicacionPrincipal])
      } else {
        setSubUbicacionesDisponibles([])
      }
    } else if (ubicacionPrincipal && ciudadesPorProvincia[ubicacionPrincipal]) {
      // Para otras provincias, usar las ciudades definidas en ciudadesPorProvincia
      setSubUbicacionesDisponibles(ciudadesPorProvincia[ubicacionPrincipal])
    } else {
      setSubUbicacionesDisponibles([])
    }
    setSubUbicacion("")
  }, [ubicacionPrincipal])

  // Añadir función para limpiar filtros
  const limpiarFiltros = () => {
    setUbicacionPrincipal("")
    setSubUbicacion("")
    setTipoPropiedad("")
    setPrecioMinimo("")
    setPrecioMaximo("")
    setAmbientes("")
    setDormitorios("")
    setMetrosCubiertosMin("")
    setMetrosCubiertosMax("")
    setCochera(false)
    setAptoCredito(true) // Mantener apto crédito activado para este buscador
    setError(null)
    setDebugInfo(null)
    setPropiedades([])
    setBusquedaRealizada(false)
  }

  // Añadir antes del return
  const obtenerDetallePropiedad = async (propiedadId: string, url: string) => {
    if (cargandoDetalle[propiedadId] || propiedadesDetalle[propiedadId]) return

    setCargandoDetalle((prev) => ({ ...prev, [propiedadId]: true }))

    try {
      // Extraer el ID de MercadoLibre de la URL si es posible
      const mlId = url.includes("MLA") ? url.match(/MLA-(\d+)/)?.[1] || url.match(/MLA(\d+)/)?.[1] : null

      if (!mlId) {
        console.log("No se pudo extraer el ID de MercadoLibre de la URL:", url)
        return
      }

      // Llamar a un endpoint que obtenga detalles adicionales
      const response = await fetch(`/api/ml-detalle?id=${mlId}`)

      if (!response.ok) {
        throw new Error(`Error al obtener detalles: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setPropiedadesDetalle((prev) => ({
          ...prev,
          [propiedadId]: {
            precioM2: data.precioM2,
            expensas: data.expensas,
            moneda: data.currency_id,
            detallesPrecio: data.detallesPrecio,
            // Otros detalles que puedan ser útiles
          },
        }))
      }
    } catch (error) {
      console.error("Error al obtener detalles de la propiedad:", error)
    } finally {
      setCargandoDetalle((prev) => ({ ...prev, [propiedadId]: false }))
    }
  }

  // Función para buscar propiedades
  const buscarPropiedades = async () => {
    setCargando(true)
    setError(null)
    setPropiedades([])
    setDebugInfo(null)

    try {
      // Construir URL con los parámetros de búsqueda
      const params = new URLSearchParams()

      // Parámetros de ubicación
      if (ubicacionPrincipal) {
        params.append("ubicacionPrincipal", ubicacionPrincipal)
      }

      if (subUbicacion) {
        params.append("subUbicacion", subUbicacion)
      }

      if (tipoPropiedad) {
        params.append("tipoPropiedad", tipoPropiedad)
      }

      if (precioMinimo) {
        params.append("precioMinimo", precioMinimo)
      }

      const precioMaximoNum = precioMaximo ? Number.parseInt(precioMaximo) : precioMaximoDolares
      if (precioMaximoNum && !isNaN(precioMaximoNum)) {
        params.append("precioMaximo", precioMaximoNum.toString())
      }

      // Importante: El filtro de ambientes debe ir en la estructura de la URL, no como parámetro
      // Lo pasamos como un parámetro especial que el backend debe manejar correctamente
      if (ambientes && ambientes !== "cualquiera") {
        params.append("ambientes", ambientes)
      }

      if (dormitorios && dormitorios !== "cualquiera") {
        params.append("dormitorios", dormitorios)
      }

      if (metrosCubiertosMin) {
        params.append("metrosCubiertosMin", metrosCubiertosMin)
      }

      if (metrosCubiertosMax) {
        params.append("metrosCubiertosMax", metrosCubiertosMax)
      }

      if (cochera) {
        params.append("cochera", "true")
      }

      // SIEMPRE incluir aptoCredito=true, independientemente del estado del checkbox
      params.append("aptoCredito", "true")

      // Usar el endpoint simplificado
      console.log("Enviando solicitud a /api/ml-simple con parámetros:", Object.fromEntries(params.entries()))
      const response = await fetch(`/api/ml-simple?${params.toString()}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error en la respuesta (${response.status}):`, errorText)
        throw new Error(`Error en la búsqueda: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Primero, agreguemos un console.log para ver la estructura exacta de los datos que recibimos
      if (data.success) {
        console.log("Datos de propiedades recibidos:", data.results)
        setPropiedades(data.results || [])
        setDebugInfo({
          query: data.query,
          count: data.results.length,
          source: data.source,
          url: data.url,
        })

        if (data.results.length === 0) {
          setError("No se encontraron propiedades con los filtros seleccionados. Intenta ampliar tu búsqueda.")
        }
      } else {
        setError(data.error || "Error al buscar propiedades")
      }
    } catch (err) {
      console.error("Error al buscar propiedades:", err)
      setError(`Error al buscar propiedades: ${err instanceof Error ? err.message : String(err)}`)

      // Si hay un error, intentar con el endpoint de respaldo
      if (err) {
        try {
          console.log("Intentando con endpoint de respaldo...")
          const params = new URLSearchParams()

          if (ubicacionPrincipal) params.append("ubicacionPrincipal", ubicacionPrincipal)
          if (subUbicacion) params.append("subUbicacion", subUbicacion)
          if (tipoPropiedad) params.append("tipoPropiedad", tipoPropiedad)
          if (precioMinimo) params.append("precioMinimo", precioMinimo)

          const precioMaximoNum = precioMaximo ? Number.parseInt(precioMaximo) : precioMaximoDolares
          if (precioMaximoNum && !isNaN(precioMaximoNum)) {
            params.append("precioMaximo", precioMaximoNum.toString())
          }

          // SIEMPRE incluir aptoCredito=true
          params.append("aptoCredito", "true")

          const fallbackResponse = await fetch(`/api/propiedades-fallback?${params.toString()}`)

          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()

            if (fallbackData.success) {
              setPropiedades(fallbackData.results || [])
              setDebugInfo({
                query: fallbackData.query,
                count: fallbackData.results.length,
                source: fallbackData.source,
                url: fallbackData.url,
              })
              setError("No se pudieron obtener datos reales de MercadoLibre. Mostrando datos simulados.")
            }
          }
        } catch (fallbackErr) {
          console.error("Error también en el endpoint de respaldo:", fallbackErr)
        }
      }
    } finally {
      setCargando(false)
      setBusquedaRealizada(true)
    }
  }

  // Realizar una búsqueda inicial automática cuando se carga el componente
  useEffect(() => {
    buscarPropiedades()
  }, [])

  return (
    <div className="w-full">
      {/* Título principal */}
      <h2 className="text-2xl font-bold mb-4">Algunas propiedades que se ajustan a tu crédito</h2>

      {/* Contenedor principal con fondo verde claro */}
      <Card className="border-pastel-green/30 shadow-md hover:shadow-lg transition-shadow duration-300 bg-pastel-green/5">
        <CardContent className="pt-6 pb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Columna de filtros (izquierda) */}
            <div className="w-full lg:w-[320px] lg:min-w-[320px] lg:shrink-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Filtros</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4">
                  {/* Presupuesto máximo */}
                  {precioMaximoPesos > 0 && (
                    <div className="space-y-1 bg-pastel-green/20 p-3 rounded-md border border-pastel-green/30">
                      <p className="text-sm text-gray-500">Presupuesto máximo:</p>
                      <p className="text-xl font-bold">USD {precioMaximoDolares?.toLocaleString("es-AR")}</p>
                      <p className="text-sm text-gray-500">${precioMaximoPesos.toLocaleString("es-AR")}</p>
                      <div className="text-xs text-gray-500">
                        Cotización dólar MEP:{" "}
                        {cargandoCotizacion ? (
                          <span className="animate-pulse">Cargando...</span>
                        ) : (
                          <span>${cotizacionDolarMEP.toLocaleString("es-AR")}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ubicación Principal */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Ubicación</h3>
                    <Select value={ubicacionPrincipal} onValueChange={setUbicacionPrincipal}>
                      <SelectTrigger id="ubicacion-principal">
                        <SelectValue placeholder="Selecciona ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="capital-federal">Capital Federal</SelectItem>
                        <SelectItem value="bs-as-gba-norte">Bs.As. G.B.A. Norte</SelectItem>
                        <SelectItem value="bs-as-gba-sur">Bs.As. G.B.A. Sur</SelectItem>
                        <SelectItem value="bs-as-gba-oeste">Bs.As. G.B.A. Oeste</SelectItem>
                        <SelectItem value="bs-as-costa-atlantica">Bs.As. Costa Atlántica</SelectItem>
                        <SelectItem value="bs-as-interior">Buenos Aires Interior</SelectItem>
                        {ubicacionesPrincipales
                          .filter((ubicacion) => ubicacion.id !== "buenos-aires" && ubicacion.id !== "capital-federal")
                          .map((ubicacion) => (
                            <SelectItem key={ubicacion.id} value={ubicacion.id}>
                              {ubicacion.nombre}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Barrio o Ciudad */}
                  {ubicacionPrincipal && subUbicacionesDisponibles.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">{ubicacionPrincipal === "capital-federal" ? "Barrio" : "Ciudad"}</h3>
                      <Select value={subUbicacion} onValueChange={setSubUbicacion}>
                        <SelectTrigger id="sub-ubicacion">
                          <SelectValue
                            placeholder={`Selecciona ${ubicacionPrincipal === "capital-federal" ? "barrio" : "ciudad"}`}
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {subUbicacionesDisponibles.map((subUbicacion) => (
                            <SelectItem key={subUbicacion.id} value={subUbicacion.id}>
                              {subUbicacion.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Tipo de Propiedad */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Tipo de propiedad</h3>
                    <Select value={tipoPropiedad} onValueChange={setTipoPropiedad}>
                      <SelectTrigger id="tipo-propiedad">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cualquiera">Cualquiera</SelectItem>
                        <SelectItem value="departamentos">Departamentos</SelectItem>
                        <SelectItem value="casas">Casas</SelectItem>
                        <SelectItem value="ph">PH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ambientes */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Ambientes</h3>
                    <Select value={ambientes} onValueChange={setAmbientes}>
                      <SelectTrigger id="ambientes">
                        <SelectValue placeholder="Cantidad de ambientes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cualquiera">Cualquiera</SelectItem>
                        <SelectItem value="1-ambiente">1 ambiente</SelectItem>
                        <SelectItem value="2-ambientes">2 ambientes</SelectItem>
                        <SelectItem value="3-ambientes">3 ambientes</SelectItem>
                        <SelectItem value="4-ambientes">4 ambientes</SelectItem>
                        <SelectItem value="5-ambientes-o-mas">5+ ambientes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Botón de búsqueda */}
                  <Button
                    onClick={buscarPropiedades}
                    disabled={cargando}
                    className="w-full mt-4 gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition-opacity"
                  >
                    {cargando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {cargando ? "Buscando..." : "Buscar propiedades"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Columna de resultados (derecha) */}
            <div className="w-full lg:flex-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 py-4">
                  <CardTitle className="text-xl font-bold flex items-center">Resultados</CardTitle>
                  <Button
                    variant="outline"
                    onClick={limpiarFiltros}
                    disabled={cargando}
                    size="sm"
                    className="my-auto text-xs scale-100 sm:scale-100 scale-75"
                  >
                    Limpiar filtros
                  </Button>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {cargando ? (
                    // Esqueletos de carga
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="overflow-hidden">
                          <div className="h-[180px] overflow-hidden rounded-md border">
                            <Skeleton className="h-[120px] w-full" />
                            <div className="p-2 space-y-1">
                              <Skeleton className="h-3 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : busquedaRealizada ? (
                    propiedades.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {propiedades.map((propiedad) => {
                            // Asegurarse de que los datos estén completos antes de renderizar
                            console.log(
                              "Renderizando propiedad:",
                              propiedad.id,
                              "price:",
                              propiedad.price,
                              "currency:",
                              propiedad.currency_id,
                            )

                            // Solo renderizar si tiene los datos mínimos necesarios
                            if (propiedad && propiedad.id) {
                              return <PropiedadCard key={propiedad.id} propiedad={propiedad} />
                            }
                            return null
                          })}
                        </div>

                        {/* Botón para ver más propiedades en MercadoLibre cuando hay más de 48 resultados */}
                        {propiedades.length >= 48 && (
                          <div className="mt-8 flex justify-center">
                            <Button
                              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
                              size="lg"
                              asChild
                            >
                              <a
                                href={debugInfo?.url || "https://inmuebles.mercadolibre.com.ar/"}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Ver más propiedades en MercadoLibre
                              </a>
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <Alert className="my-4">
                        <Home className="h-4 w-4" />
                        <AlertTitle>No se encontraron propiedades</AlertTitle>
                        <AlertDescription>Intenta ajustar los filtros para ampliar tu búsqueda.</AlertDescription>
                      </Alert>
                    )
                  ) : (
                    <Alert className="my-4">
                      <Home className="h-4 w-4" />
                      <AlertTitle>Comienza tu búsqueda</AlertTitle>
                      <AlertDescription>Ingresa los filtros para encontrar propiedades.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
