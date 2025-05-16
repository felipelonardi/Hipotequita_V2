"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { Banco } from "@/types/tipos"

// Importar el servicio para obtener la cotización del dólar
import { obtenerCotizacionDolarMEPConCache } from "@/services/dolar-service"

interface CalculadoraPrestamoProps {
  banco: Banco
  onCalcular: (monto: number, plazoMeses: number, valorPropiedad: number, cobraSueldo: boolean) => void
  montoMaximo: number | null
  cobraSueldo: boolean
}

export default function CalculadoraPrestamo({ banco, onCalcular, montoMaximo, cobraSueldo }: CalculadoraPrestamoProps) {
  const [valorPropiedad, setValorPropiedad] = useState<number>(0)
  const [porcentajeFinanciacion, setPorcentajeFinanciacion] = useState<number>(70)
  const [plazoAnios, setPlazoAnios] = useState<number>(20)
  const [error, setError] = useState<string | null>(null)

  // Agregar estado para la cotización del dólar
  const [cotizacionDolarMEP, setCotizacionDolarMEP] = useState<number>(1650) // Valor actualizado (marzo 2025)
  const [cargandoCotizacion, setCargandoCotizacion] = useState<boolean>(true)

  // Calcular monto a financiar
  const montoFinanciar = Math.round(valorPropiedad * (porcentajeFinanciacion / 100))
  const plazoMeses = plazoAnios * 12

  // Verificar si excede el monto máximo
  const excedeLimite = montoMaximo !== null && montoFinanciar > montoMaximo

  // Agregar useEffect para cargar la cotización
  useEffect(() => {
    async function cargarCotizacion() {
      try {
        setCargandoCotizacion(true)
        const cotizacion = await obtenerCotizacionDolarMEPConCache()
        setCotizacionDolarMEP(cotizacion)
      } catch (error) {
        console.error("Error al cargar cotización:", error)
      } finally {
        setCargandoCotizacion(false)
      }
    }

    cargarCotizacion()
  }, [])

  // Verificar si excede el monto máximo cuando cambia el valor de la propiedad o el porcentaje
  useEffect(() => {
    if (montoMaximo !== null && montoFinanciar > montoMaximo) {
      setError(
        `El monto a financiar excede el límite máximo del banco (${montoMaximo.toLocaleString("es-AR")}). Ajuste el valor de la propiedad o el porcentaje de financiación.`,
      )
    } else {
      setError(null)
    }
  }, [valorPropiedad, porcentajeFinanciacion, montoMaximo, montoFinanciar])

  const handleCalcular = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Verificar si excede el monto máximo
    if (excedeLimite) {
      return // No permitir continuar si excede el límite
    }

    // Pasar el valor de cobraSueldo al calcular
    onCalcular(montoFinanciar, plazoMeses, valorPropiedad, cobraSueldo)
  }

  // Formatear números para mostrar
  const formatoPeso = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Calcular préstamo</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3 sm:space-y-4">
        {/* Mantener los mismos campos pero con espaciado optimizado */}
        <div className="space-y-2">
          <Label htmlFor="valor-propiedad">Valor de la propiedad (ARS)</Label>
          <Input
            id="valor-propiedad"
            type="text"
            value={valorPropiedad.toLocaleString("es-AR")}
            onChange={(e) => {
              // Eliminar todos los caracteres no numéricos
              const numericValue = e.target.value.replace(/\D/g, "")
              // Convertir a número usando parseFloat para manejar valores grandes
              const newValue = numericValue ? Number.parseFloat(numericValue) : 0
              setValorPropiedad(newValue)
            }}
            placeholder="Ingrese el valor de la propiedad"
            className={`text-right border-pastel-blue/50 focus-visible:ring-pastel-blue ${excedeLimite ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="porcentaje-financiacion" className="text-gray-600">
              Porcentaje a financiar
            </Label>
            <span className="text-sm font-medium text-gray-600">{porcentajeFinanciacion}%</span>
          </div>
          <Slider
            id="porcentaje-financiacion"
            value={[porcentajeFinanciacion]}
            onValueChange={(value) => setPorcentajeFinanciacion(value[0])}
            min={10}
            max={banco.financiacionMaxima}
            step={5}
            className="[&_[role=slider]]:shadow-none [&>.bg-background]:bg-gray-200 [&>span]:bg-gradient-to-r [&>span]:from-purple-500 [&>span]:to-blue-500 [&>span]:shadow-md"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10%</span>
            <span>{banco.financiacionMaxima}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="plazo-anios">Plazo del préstamo en años</Label>
          </div>
          <div className="grid grid-cols-6 gap-1 mt-2">
            {[5, 10, 15, 20, 25, 30].map((anios) => (
              <Button
                key={anios}
                type="button"
                variant={plazoAnios === anios ? "default" : "outline"}
                size="sm"
                className={`text-xs ${plazoAnios === anios ? "bg-gradient-to-r from-purple-500 to-blue-500" : ""}`}
                onClick={() => setPlazoAnios(anios)}
              >
                {anios}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-pastel-green/20 p-2 sm:p-3 rounded-md border border-pastel-green/30 text-sm">
          <div className="flex justify-between">
            <span>Monto a financiar:</span>
            <span className={`font-bold ${excedeLimite ? "text-red-600" : ""}`}>
              $ {montoFinanciar.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>En dólares (MEP):</span>
            <span>
              {cargandoCotizacion ? (
                <span className="animate-pulse">Cargando...</span>
              ) : (
                <span>USD {Math.round(montoFinanciar / cotizacionDolarMEP).toLocaleString("es-AR")}</span>
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Plazo:</span>
            <span>
              {plazoAnios} años ({plazoMeses} meses)
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Cotización dólar MEP:</span>
            {cargandoCotizacion ? (
              <span className="animate-pulse">Cargando...</span>
            ) : (
              <span>${cotizacionDolarMEP.toLocaleString("es-AR")}</span>
            )}
          </div>
          {montoMaximo !== null && (
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Monto máximo permitido:</span>
              <span>${montoMaximo.toLocaleString("es-AR")}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {!banco && (
            <div className="text-red-500 text-sm mb-2">Por favor, selecciona un banco antes de calcular la cuota.</div>
          )}
          <Button
            onClick={handleCalcular}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition-opacity"
            disabled={!banco || valorPropiedad <= 0 || excedeLimite}
          >
            Calcular cuota
          </Button>
        </div>
      </div>
    </div>
  )
}
