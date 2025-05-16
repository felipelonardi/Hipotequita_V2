"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search, Home, Loader2 } from "lucide-react"
import { PropiedadCard } from "./propiedad-card"
import type { Propiedad } from "@/types/tipos"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ubicacionesPrincipales,
  barriosCapitalFederal,
  ciudadesPorProvincia,
  tiposPropiedades,
} from "@/data/ubicaciones"

interface BuscadorSimpleProps {
  precioMaximoDolares?: number
}

export default function BuscadorSimple({ precioMaximoDolares }: BuscadorSimpleProps) {
  // Estados
  const [ubicacionPrincipal, setUbicacionPrincipal] = useState<string>("")
  const [subUbicacion, setSubUbicacion] = useState<string>("")
  const [subUbicacionesDisponibles, setSubUbicacionesDisponibles] = useState<Array<{ id: string; nombre: string }>>([])
  const [tipoPropiedad, setTipoPropiedad] = useState<string>("")
  const [precioMinimo, setPrecioMinimo] = useState<string>("")
  const [precioMaximo, setPrecioMaximo] = useState<string>(precioMaximoDolares?.toString() || "")
  const [ambientes, setAmbientes] = useState<string>("")
  const [dormitorios, setDormitorios] = useState<string>("")
  const [metrosCubiertosMin, setMetrosCubiertosMin] = useState<string>("")
  const [metrosCubiertosMax, setMetrosCubiertosMax] = useState<string>("")
  const [cochera, setCochera] = useState<boolean>(false)
  const [aptoCredito, setAptoCredito] = useState<boolean>(false)
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [cargando, setCargando] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [busquedaRealizada, setBusquedaRealizada] = useState<boolean>(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Actualizar sububicaciones cuando cambia la ubicación principal
  useEffect(() => {
    if (ubicacionPrincipal === "capital-federal") {
      setSubUbicacionesDisponibles(barriosCapitalFederal)
    } else if (ubicacionPrincipal && ciudadesPorProvincia[ubicacionPrincipal]) {
      setSubUbicacionesDisponibles(ciudadesPorProvincia[ubicacionPrincipal])
    } else {
      setSubUbicacionesDisponibles([])
    }
    setSubUbicacion("")
  }, [ubicacionPrincipal])

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

      if (ambientes) {
        params.append("ambientes", ambientes)
      }

      if (dormitorios) {
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

      if (aptoCredito) {
        params.append("aptoCredito", "true")
      }

      // Usar el endpoint simplificado
      const response = await fetch(`/api/ml-simple?${params.toString()}`)

      const data = await response.json()

      if (data.success) {
        setPropiedades(data.propiedades || [])
        setDebugInfo({
          query: data.query,
          count: data.propiedades.length,
          source: data.source,
          url: data.url,
        })

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
    setAptoCredito(false)
    setError(null)
    setDebugInfo(null)
    setPropiedades([])
    setBusquedaRealizada(false)
  }

  // Reemplazar la sección de la interfaz de usuario para incluir todos los filtros
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Buscar propiedades</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Ubicación Principal */}
        <div className="space-y-2">
          <Label htmlFor="ubicacion-principal">Ubicación Principal</Label>
          <Select value={ubicacionPrincipal} onValueChange={setUbicacionPrincipal}>
            <SelectTrigger id="ubicacion-principal">
              <SelectValue placeholder="Selecciona ubicación" />
            </SelectTrigger>
            <SelectContent>
              {ubicacionesPrincipales.map((ubicacion) => (
                <SelectItem key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Barrio o Ciudad */}
        <div className="space-y-2">
          <Label htmlFor="sub-ubicacion">{ubicacionPrincipal === "capital-federal" ? "Barrio" : "Ciudad"}</Label>
          <Select
            value={subUbicacion}
            onValueChange={setSubUbicacion}
            disabled={!ubicacionPrincipal || subUbicacionesDisponibles.length === 0}
          >
            <SelectTrigger id="sub-ubicacion">
              <SelectValue
                placeholder={`Selecciona ${ubicacionPrincipal === "capital-federal" ? "barrio" : "ciudad"}`}
              />
            </SelectTrigger>
            <SelectContent>
              {subUbicacionesDisponibles.map((subUbicacion) => (
                <SelectItem key={subUbicacion.id} value={subUbicacion.id}>
                  {subUbicacion.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de propiedad */}
        <div className="space-y-2">
          <Label htmlFor="tipo-propiedad">Tipo de propiedad</Label>
          <Select value={tipoPropiedad} onValueChange={setTipoPropiedad}>
            <SelectTrigger id="tipo-propiedad">
              <SelectValue placeholder="Selecciona tipo de propiedad" />
            </SelectTrigger>
            <SelectContent>
              {tiposPropiedades.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Precio mínimo */}
        <div className="space-y-2">
          <Label htmlFor="precio-minimo">Precio mínimo (USD)</Label>
          <Input
            id="precio-minimo"
            type="number"
            placeholder="Precio mínimo"
            value={precioMinimo}
            onChange={(e) => setPrecioMinimo(e.target.value)}
          />
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

        {/* Ambientes */}
        <div className="space-y-2">
          <Label htmlFor="ambientes">Ambientes</Label>
          <Select value={ambientes} onValueChange={setAmbientes}>
            <SelectTrigger id="ambientes">
              <SelectValue placeholder="Cantidad de ambientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cualquiera">Cualquiera</SelectItem>
              <SelectItem value="1">1 ambiente</SelectItem>
              <SelectItem value="2">2 ambientes</SelectItem>
              <SelectItem value="3">3 ambientes</SelectItem>
              <SelectItem value="4">4 ambientes</SelectItem>
              <SelectItem value="5">5 o más ambientes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dormitorios */}
        <div className="space-y-2">
          <Label htmlFor="dormitorios">Dormitorios</Label>
          <Select value={dormitorios} onValueChange={setDormitorios}>
            <SelectTrigger id="dormitorios">
              <SelectValue placeholder="Cantidad de dormitorios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cualquiera">Cualquiera</SelectItem>
              <SelectItem value="1">1 dormitorio</SelectItem>
              <SelectItem value="2">2 dormitorios</SelectItem>
              <SelectItem value="3">3 dormitorios</SelectItem>
              <SelectItem value="4">4 dormitorios</SelectItem>
              <SelectItem value="5">5 o más dormitorios</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metros cuadrados mínimos */}
        <div className="space-y-2">
          <Label htmlFor="metros-min">Metros cuadrados (mín)</Label>
          <Input
            id="metros-min"
            type="number"
            placeholder="Metros cuadrados mínimos"
            value={metrosCubiertosMin}
            onChange={(e) => setMetrosCubiertosMin(e.target.value)}
          />
        </div>

        {/* Metros cuadrados máximos */}
        <div className="space-y-2">
          <Label htmlFor="metros-max">Metros cuadrados (máx)</Label>
          <Input
            id="metros-max"
            type="number"
            placeholder="Metros cuadrados máximos"
            value={metrosCubiertosMax}
            onChange={(e) => setMetrosCubiertosMax(e.target.value)}
          />
        </div>

        {/* Cochera */}
        <div className="flex items-center space-x-2 pt-8">
          <Checkbox id="cochera" checked={cochera} onCheckedChange={(checked) => setCochera(checked === true)} />
          <Label htmlFor="cochera">Con cochera</Label>
        </div>

        {/* Apto crédito */}
        <div className="flex items-center space-x-2 pt-8">
          <Checkbox
            id="apto-credito"
            checked={aptoCredito}
            onCheckedChange={(checked) => setAptoCredito(checked === true)}
          />
          <Label htmlFor="apto-credito">Apto crédito</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={limpiarFiltros} disabled={cargando}>
          Limpiar filtros
        </Button>
        <Button onClick={buscarPropiedades} disabled={cargando} className="gap-2 w-full sm:w-auto">
          {cargando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {cargando ? "Buscando..." : "Buscar propiedades"}
        </Button>
      </div>

      {/* Información de depuración */}
      {debugInfo && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800">Información de búsqueda</AlertTitle>
          <AlertDescription className="text-blue-700 text-sm">
            <p>
              <strong>Consulta:</strong> {debugInfo.query}
            </p>
            <p>
              <strong>Resultados encontrados:</strong> {debugInfo.count}
            </p>
            <p>
              <strong>Fuente:</strong> {debugInfo.source}
            </p>
            <p>
              <strong>URL:</strong>{" "}
              <a href={debugInfo.url} target="_blank" rel="noopener noreferrer" className="underline">
                {debugInfo.url}
              </a>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Resultados */}
      <div className="mt-6 sm:mt-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
