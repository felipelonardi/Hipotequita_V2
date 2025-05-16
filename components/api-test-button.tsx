"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiTestButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const testApi = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/test-mercadolibre")
      const data = await response.json()

      setResult(data)
      if (!data.success) {
        setError(data.message || "Error al probar la API")
      }
    } catch (err) {
      setError(`Error al realizar la prueba: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const getFilterInfo = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/filtros-mercadolibre")
      const data = await response.json()

      if (data.success) {
        // Actualizar el resultado con la información de filtros
        setResult((prev) => ({
          ...prev,
          filterInfo: data,
        }))
      } else {
        setError(data.error || "Error al obtener información de filtros")
      }
    } catch (err) {
      setError(`Error al obtener filtros: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Diagnóstico de API MercadoLibre</h2>
        <div className="flex gap-2">
          <Button onClick={testApi} disabled={loading} className="flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Probando API..." : "Probar conexión API"}
          </Button>
          <Button onClick={getFilterInfo} disabled={loading} variant="outline">
            Ver filtros disponibles
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Conexión exitosa</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span>Conexión fallida</span>
                </>
              )}
            </CardTitle>
            <CardDescription>Prueba realizada el {new Date(result.timestamp).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="search">Búsqueda</TabsTrigger>
                <TabsTrigger value="filters">Filtros</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 pt-4">
                {/* Variables de entorno */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Variables de entorno:</h3>
                  <div className="flex gap-2">
                    <Badge variant={result.envCheck?.clientId ? "default" : "destructive"}>
                      Client ID: {result.envCheck?.clientId ? "Configurado" : "Falta"}
                    </Badge>
                    <Badge variant={result.envCheck?.clientSecret ? "default" : "destructive"}>
                      Client Secret: {result.envCheck?.clientSecret ? "Configurado" : "Falta"}
                    </Badge>
                  </div>
                </div>

                {/* Token de acceso */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Token de acceso:</h3>
                  {result.tokenResult?.success ? (
                    <div className="text-sm">
                      <Badge variant="outline" className="bg-green-50">
                        Obtenido correctamente
                      </Badge>
                      {result.tokenResult?.expiresIn && (
                        <p className="mt-1 text-gray-500">Expira en: {result.tokenResult.expiresIn} segundos</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Badge variant="destructive">Error al obtener token</Badge>
                      <p className="mt-1 text-sm text-red-500">{result.tokenResult?.error}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="search" className="space-y-4 pt-4">
                {/* Búsqueda filtrada */}
                {result.filteredSearchResult && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Búsqueda filtrada:</h3>
                    {result.filteredSearchResult.success ? (
                      <div className="text-sm">
                        <Badge variant="outline" className="bg-green-50">
                          Búsqueda exitosa
                        </Badge>
                        <p className="mt-1">Total de resultados: {result.filteredSearchResult.totalResults}</p>
                        <p>Resultados obtenidos: {result.filteredSearchResult.resultsCount}</p>

                        {result.filteredSearchResult.firstResult && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <h4 className="font-medium mb-1">Primer resultado:</h4>
                            <p className="text-sm">{result.filteredSearchResult.firstResult.title}</p>
                            <p className="text-sm">Precio: USD {result.filteredSearchResult.firstResult.price}</p>
                            <a
                              href={result.filteredSearchResult.firstResult.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Ver en MercadoLibre
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Badge variant="destructive">Error en búsqueda</Badge>
                        <p className="mt-1 text-sm text-red-500">{result.filteredSearchResult.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="filters" className="space-y-4 pt-4">
                {/* Filtros disponibles */}
                {result.filterInfo ? (
                  <div className="space-y-6">
                    {/* Operaciones */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Operaciones disponibles:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {result.filterInfo.filters.operations.map((op: any) => (
                          <div key={op.id} className="p-2 border rounded-md">
                            <p className="font-medium">{op.name}</p>
                            <p className="text-xs text-gray-500">ID: {op.id}</p>
                            <p className="text-xs text-gray-500">Resultados: {op.results}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tipos de propiedad */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Tipos de propiedad:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {result.filterInfo.filters.propertyTypes.map((type: any) => (
                          <div key={type.id} className="p-2 border rounded-md">
                            <p className="font-medium">{type.name}</p>
                            <p className="text-xs text-gray-500">ID: {type.id}</p>
                            <p className="text-xs text-gray-500">Resultados: {type.results}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ubicaciones */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Ubicaciones disponibles:</h3>
                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {result.filterInfo.filters.states.map((state: any) => (
                          <div key={state.id} className="p-2 border rounded-md">
                            <p className="font-medium">{state.name}</p>
                            <p className="text-xs text-gray-500">ID: {state.id}</p>
                            <p className="text-xs text-gray-500">Resultados: {state.results}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ver datos crudos */}
                    <div>
                      <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
                        {showDetails ? "Ocultar datos crudos" : "Ver datos crudos"}
                      </Button>

                      {showDetails && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs max-h-60 overflow-auto">
                          <pre>{JSON.stringify(result.filterInfo.rawAvailableFilters, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">
                      Haz clic en "Ver filtros disponibles" para obtener información detallada sobre los filtros de
                      MercadoLibre
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
