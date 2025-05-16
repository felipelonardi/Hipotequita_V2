"use client"

import { useState, useEffect } from "react"
import type { Propiedad } from "@/types/tipos"
import { buscarPropiedades } from "@/app/services/propiedades-service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { AlertCircle, HomeIcon, Building2Icon, Search, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { PropiedadCard } from "./propiedad-card"

interface BuscadorPropiedadesProps {
  montoPrestamoAprobado?: number
  porcentajeFinanciacion?: number
  propiedadesIniciales?: Propiedad[]
  filtrosFijos?: {
    soloVenta?: boolean
    aptoCredito?: boolean
    valorEnDolares?: boolean
  }
}

// Ubicaciones principales
const ubicacionesPrincipales = [
  { id: "Capital Federal", nombre: "Capital Federal" },
  { id: "Buenos Aires", nombre: "Buenos Aires" },
  { id: "Córdoba", nombre: "Córdoba" },
  { id: "Santa Fe", nombre: "Santa Fe" },
  { id: "Mendoza", nombre: "Mendoza" },
]

// Tipos de propiedades
const tiposPropiedades = [
  { id: "departamentos", nombre: "Departamentos", icon: <Building2Icon className="h-4 w-4 mr-2" /> },
  { id: "casas", nombre: "Casas", icon: <HomeIcon className="h-4 w-4 mr-2" /> },
  { id: "ph", nombre: "PH", icon: <HomeIcon className="h-4 w-4 mr-2" /> },
]

export default function BuscadorPropiedades({
  montoPrestamoAprobado,
  porcentajeFinanciacion = 80,
  propiedadesIniciales = [],
  filtrosFijos = {
    soloVenta: true,
    aptoCredito: true,
    valorEnDolares: true,
  },
}: BuscadorPropiedadesProps) {
  // Estados para los filtros
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string | undefined>("Capital Federal")
  const [tipoPropiedad, setTipoPropiedad] = useState<string | undefined>("departamentos")
  const [precioMaximoDolares, setPrecioMaximoDolares] = useState<string>("")

  // Estados para los resultados
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [cargando, setCargando] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [busquedaRealizada, setBusquedaRealizada] = useState<boolean>(false)

  // Cotización del dólar MEP
  const cotizacionDolarMEP = 1250

  // Calcular precio máximo basado en el monto del préstamo y porcentaje de financiación
  const precioMaximoPesos = montoPrestamoAprobado
    ? Math.round(montoPrestamoAprobado / (porcentajeFinanciacion / 100))
    : undefined

  // Convertir el precio máximo a dólares usando la cotización del dólar MEP
  const precioMaximoCalculado = precioMaximoPesos ? Math.round(precioMaximoPesos / cotizacionDolarMEP) : undefined

  // Realizar búsqueda inicial al cargar el componente
  useEffect(() => {
    if (propiedadesIniciales && propiedadesIniciales.length > 0) {
      setPropiedades(propiedadesIniciales)
      setBusquedaRealizada(true)
    } else {
      // Si no hay propiedades iniciales, realizar una búsqueda automática
      buscarPropiedadesConFiltros()
    }
  }, [propiedadesIniciales])

  // Función para buscar propiedades
  const buscarPropiedadesConFiltros = async () => {
    setCargando(true)
    setPropiedades([])
    setError(null)

    // Convertir valor de precio máximo a número
    const precioMaximo = precioMaximoDolares ? Number.parseInt(precioMaximoDolares) : precioMaximoCalculado

    try {
      console.log("Iniciando búsqueda con filtros:", {
        ubicacion: ubicacionSeleccionada,
        precioMaximo,
        tipoPropiedad,
      })

      // Buscar propiedades con los filtros seleccionados
      const resultados = await buscarPropiedades(ubicacionSeleccionada, precioMaximo, tipoPropiedad)

      if (resultados.length === 0) {
        setError("No se encontraron propiedades con los filtros seleccionados. Intenta ampliar tu búsqueda.")
      }

      setPropiedades(resultados)
      setBusquedaRealizada(true)
    } catch (error) {
      console.error("Error al buscar propiedades:", error)
      setError("Ocurrió un error al buscar propiedades. Por favor, intenta nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setUbicacionSeleccionada(undefined)
    setTipoPropiedad(undefined)
    setPrecioMaximoDolares("")
    setError(null)
    buscarPropiedadesConFiltros()
  }

  return (
    <div className="w-full">
      {/* Presupuesto máximo */}
      {precioMaximoPesos && (
        <div className="mb-6">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Presupuesto máximo:</strong> ${Math.round(precioMaximoPesos).toLocaleString("es-AR")} (USD{" "}
              {precioMaximoCalculado?.toLocaleString("es-AR")})
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columna de filtros */}
        <div className="lg:col-span-1 space-y-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-800">Filtros de búsqueda</h3>

          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-xs text-blue-700">
              Solo se muestran resultados reales de MercadoLibre
            </AlertDescription>
          </Alert>

          <Separator />

          {/* Filtro de ubicación */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Ubicación</h4>
            <div className="space-y-2">
              {ubicacionesPrincipales.map((ubicacion) => (
                <div key={ubicacion.id} className="flex items-center">
                  <Checkbox
                    id={`ubicacion-${ubicacion.id}`}
                    checked={ubicacionSeleccionada === ubicacion.id}
                    onCheckedChange={(checked) => {
                      setUbicacionSeleccionada(checked ? ubicacion.id : undefined)
                    }}
                    className="mr-2"
                  />
                  <Label htmlFor={`ubicacion-${ubicacion.id}`} className="cursor-pointer">
                    {ubicacion.nombre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Filtro de tipo de propiedad */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Tipo de propiedad</h4>
            <div className="space-y-2">
              {tiposPropiedades.map((tipo) => (
                <div key={tipo.id} className="flex items-center">
                  <Checkbox
                    id={`tipo-${tipo.id}`}
                    checked={tipoPropiedad === tipo.id}
                    onCheckedChange={(checked) => {
                      setTipoPropiedad(checked ? tipo.id : undefined)
                    }}
                    className="mr-2"
                  />
                  <Label htmlFor={`tipo-${tipo.id}`} className="flex items-center cursor-pointer">
                    {tipo.icon}
                    {tipo.nombre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Filtro de precio */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Precio máximo (USD)</h4>
            <Input
              type="number"
              placeholder={precioMaximoCalculado ? precioMaximoCalculado.toString() : "Precio máximo"}
              value={precioMaximoDolares}
              onChange={(e) => setPrecioMaximoDolares(e.target.value)}
              className="h-9"
              min="0"
            />
            {precioMaximoCalculado && !precioMaximoDolares && (
              <p className="text-xs text-gray-500">
                Se usará el valor calculado: USD {precioMaximoCalculado.toLocaleString("es-AR")}
              </p>
            )}
          </div>

          {/* Filtros fijos (informativos) */}
          {(filtrosFijos.soloVenta || filtrosFijos.aptoCredito) && (
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium text-gray-700">Filtros aplicados</h4>
              <div className="flex flex-wrap gap-2">
                {filtrosFijos.soloVenta && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pastel-blue/20 text-blue-800">
                    Solo propiedades en venta
                  </span>
                )}
                {filtrosFijos.aptoCredito && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pastel-green/20 text-green-800">
                    Aptas para crédito
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-gray-200">
            <Button onClick={buscarPropiedadesConFiltros} disabled={cargando} className="gap-2">
              <Search className="h-4 w-4" />
              {cargando ? "Buscando..." : "Buscar propiedades"}
            </Button>
            <Button variant="outline" onClick={limpiarFiltros} disabled={cargando}>
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Columna de resultados */}
        <div className="lg:col-span-3">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {cargando ? (
            // Esqueletos de carga
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : busquedaRealizada ? (
            propiedades.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">Se encontraron {propiedades.length} propiedades</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {propiedades.map((propiedad) => (
                    <PropiedadCard key={propiedad.id} propiedad={propiedad} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Alert className="mb-4 max-w-md mx-auto">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No se encontraron propiedades</AlertTitle>
                  <AlertDescription>
                    No se encontraron propiedades reales con los filtros seleccionados. Prueba ajustando los filtros
                    para ampliar la búsqueda.
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Intentar una búsqueda más amplia
                    setUbicacionSeleccionada("Capital Federal")
                    setTipoPropiedad("departamentos")
                    setPrecioMaximoDolares("")
                    buscarPropiedadesConFiltros()
                  }}
                >
                  Buscar departamentos en Capital Federal
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Utiliza los filtros para buscar propiedades</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
