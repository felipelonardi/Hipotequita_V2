"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search, Home } from "lucide-react"
import { PropiedadCard } from "./propiedad-card"
import type { Propiedad } from "@/types/tipos"

interface BuscadorPropiedadesSimpleProps {
  precioMaximoDolares?: number
}

// IDs exactos de MercadoLibre
const UBICACIONES = [
  { id: "TUxBUENBUGw3M2E1", nombre: "Capital Federal" },
  { id: "TUxBUEJVRWFiY2Vm", nombre: "Buenos Aires" },
  { id: "TUxBUENPUmFkZGIw", nombre: "Córdoba" },
  { id: "TUxBUFNBTmE5Nzc4", nombre: "Santa Fe" },
  { id: "TUxBUE1FTmE5OWQ4", nombre: "Mendoza" },
]

const TIPOS_PROPIEDAD = [
  { id: "242059", nombre: "Departamentos" },
  { id: "242060", nombre: "Casas" },
  { id: "242061", nombre: "PH" },
]

export default function BuscadorPropiedadesSimple({ precioMaximoDolares }: BuscadorPropiedadesSimpleProps) {
  // Estados
  const [ubicacionId, setUbicacionId] = useState<string>("TUxBUENBUGw3M2E1") // Capital Federal por defecto
  const [tipoPropiedadId, setTipoPropiedadId] = useState<string>("242059") // Departamentos por defecto
  const [precioMaximo, setPrecioMaximo] = useState<string>(precioMaximoDolares?.toString() || "")
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [cargando, setCargando] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [busquedaRealizada, setBusquedaRealizada] = useState<boolean>(false)

  // Función para buscar propiedades
  const buscarPropiedades = async () => {
    setCargando(true)
    setError(null)
    setPropiedades([])

    try {
      // Construir URL con los parámetros de búsqueda
      const params = new URLSearchParams()

      // Usar los IDs exactos de MercadoLibre
      params.append("state", ubicacionId)
      params.append("propertyType", tipoPropiedadId)

      const precioMaximoNum = precioMaximo ? Number.parseInt(precioMaximo) : precioMaximoDolares
      if (precioMaximoNum && !isNaN(precioMaximoNum)) {
        params.append("precioMaximo", precioMaximoNum.toString())
      }

      // Realizar la petición a nuestra API
      const response = await fetch(`/api/propiedades-exactas?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error en la búsqueda: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setPropiedades(data.propiedades || [])

        if (data.propiedades.length === 0) {
          setError("No se encontraron propiedades con los filtros seleccionados. Intenta ampliar tu búsqueda.")
        }
      } else {
        setError(data.error || "Error al buscar propiedades")
      }
    } catch (err) {
      console.error("Error al buscar propiedades:", err)
      setError(`Error al buscar propiedades: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setCargando(false)
      setBusquedaRealizada(true)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Buscar propiedades</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ubicación */}
        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Select value={ubicacionId} onValueChange={setUbicacionId}>
            <SelectTrigger id="ubicacion">
              <SelectValue placeholder="Selecciona ubicación" />
            </SelectTrigger>
            <SelectContent>
              {UBICACIONES.map((ubicacion) => (
                <SelectItem key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de propiedad */}
        <div className="space-y-2">
          <Label htmlFor="tipo-propiedad">Tipo de propiedad</Label>
          <Select value={tipoPropiedadId} onValueChange={setTipoPropiedadId}>
            <SelectTrigger id="tipo-propiedad">
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_PROPIEDAD.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Precio máximo */}
        <div className="space-y-2">
          <Label htmlFor="precio-maximo">Precio máximo (USD)</Label>
          <Input
            id="precio-maximo"
            type="number"
            placeholder={precioMaximoDolares?.toString() || "Precio máximo"}
            value={precioMaximo}
            onChange={(e) => setPrecioMaximo(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={buscarPropiedades} disabled={cargando} className="gap-2">
          <Search className="h-4 w-4" />
          {cargando ? "Buscando..." : "Buscar propiedades"}
        </Button>
      </div>

      {/* Resultados */}
      <div className="mt-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
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
            <div>
              <p className="text-sm text-gray-500 mb-4">Se encontraron {propiedades.length} propiedades</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {propiedades.map((propiedad) => (
                  <PropiedadCard key={propiedad.id} propiedad={propiedad} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No se encontraron propiedades</h3>
              <p className="text-gray-500 mt-2">Intenta ajustar los filtros para ampliar tu búsqueda</p>
            </div>
          )
        ) : null}
      </div>
    </div>
  )
}
