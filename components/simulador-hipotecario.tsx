"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import SeleccionBanco from "./seleccion-banco"
import ResultadoSimulacion from "./resultado-simulacion"
import BuscadorPropiedadesCredito from "./buscador-propiedades-credito"
import { bancos } from "@/data/bancos"
import type { Banco, ResultadoCalculo } from "@/types/tipos"
import { Button } from "@/components/ui/button"

interface SimuladorHipotecarioProps {
  bancoPreseleccionado?: string | null
  calculadoraAbierta?: boolean
}

export default function SimuladorHipotecario({
  bancoPreseleccionado,
  calculadoraAbierta: calculadoraAbiertaProp = false,
}: SimuladorHipotecarioProps) {
  const [bancoSeleccionado, setBancoSeleccionado] = useState<Banco | null>(null)
  const [cobraSueldo, setCobraSueldo] = useState<boolean>(false)
  const [montoFinanciar, setMontoFinanciar] = useState<number>(0)
  const [valorPropiedad, setValorPropiedad] = useState<number>(0)
  const [plazo, setPlazo] = useState<number>(0)
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null)
  const [calculadoraAbierta, setCalculadoraAbierta] = useState(calculadoraAbiertaProp || false)

  // Efecto para preseleccionar el banco si viene en los parámetros
  useEffect(() => {
    if (bancoPreseleccionado) {
      const banco = bancos.find((b) => b.id === bancoPreseleccionado)
      if (banco) {
        setBancoSeleccionado(banco)
        setCobraSueldo(false)
      }
    }
  }, [bancoPreseleccionado])

  const handleBancoSeleccionado = (banco: Banco, cobraSueldoEnBanco: boolean) => {
    setBancoSeleccionado(banco)
    setCobraSueldo(cobraSueldoEnBanco)
    // Resetear valores cuando se cambia de banco
    setMontoFinanciar(0)
    setValorPropiedad(0)
    setPlazo(0)
    setResultado(null)
  }

  const handleCalcular = (monto: number, plazoMeses: number, valorProp: number, cobraSueldoEnBanco: boolean) => {
    if (!bancoSeleccionado) return

    setMontoFinanciar(monto)
    setValorPropiedad(valorProp)
    setPlazo(plazoMeses)
    setCobraSueldo(cobraSueldoEnBanco)

    // Usar la tasa correspondiente según si cobra sueldo o no
    const tasaAnual = cobraSueldoEnBanco ? bancoSeleccionado.tasaAnualConSueldo : bancoSeleccionado.tasaAnual

    // Calcular cuota mensual en pesos (sistema francés)
    const tasaMensual = tasaAnual / 12 / 100
    const cuotaMensualPesos =
      (monto * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1)

    // Calcular valor UVA actual (valor real actualizado)
    const valorUVA = 1392.8 // Valor actualizado de UVA

    // La cuota en UVA es fija durante todo el préstamo
    const cuotaMensualUVA = cuotaMensualPesos / valorUVA

    // Generar proyección de pagos
    const proyeccion = generarProyeccionPagos(monto, plazoMeses, tasaMensual, valorUVA)

    console.log("Calculando préstamo:", {
      monto,
      valorPropiedad: valorProp,
      plazoMeses,
      tasaAnual,
      cobraSueldo: cobraSueldoEnBanco,
      cuotaMensualPesos,
    })

    setResultado({
      cuotaMensualPesos,
      cuotaMensualUVA,
      montoTotalPesos: cuotaMensualPesos * plazoMeses,
      montoTotalUVA: cuotaMensualUVA * plazoMeses,
      proyeccion,
    })
  }

  const generarProyeccionPagos = (monto: number, plazoMeses: number, tasaMensual: number, valorUVAInicial: number) => {
    const proyeccion = []
    let saldoCapital = monto
    const fechaActual = new Date()

    // Calcular la cuota fija en pesos (sistema francés)
    const cuotaFijaPesos =
      (monto * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1)

    // Calcular la cuota fija en UVAs (esta se mantiene constante)
    const cuotaFijaUVA = cuotaFijaPesos / valorUVAInicial

    for (let mes = 1; mes <= plazoMeses; mes++) {
      // Simular incremento de UVA (inflación simulada del 1% mensual)
      const valorUVA = valorUVAInicial * Math.pow(1.01, mes - 1)

      // La cuota en pesos varía según el valor de la UVA
      const cuotaPesos = cuotaFijaUVA * valorUVA

      // Calcular interés y amortización
      const interes = saldoCapital * tasaMensual
      const amortizacion = cuotaPesos - interes
      saldoCapital -= amortizacion

      // Calcular fecha de la cuota
      const fechaCuota = new Date(fechaActual)
      fechaCuota.setMonth(fechaActual.getMonth() + mes)

      proyeccion.push({
        mes,
        fecha: fechaCuota,
        cuotaPesos: cuotaPesos,
        cuotaUVA: cuotaFijaUVA,
        amortizacion,
        interes,
        saldoCapital: saldoCapital > 0 ? saldoCapital : 0,
        valorUVA,
      })
    }

    return proyeccion
  }

  return (
    <div className="space-y-8 pt-12">
      {!resultado ? (
        // Pantalla inicial: Selección de banco y calculadora
        <Card className="border-pastel-blue/30 shadow-md hover:shadow-lg transition-shadow duration-300 bg-pastel-blue/5 max-w-3xl mx-auto">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <SeleccionBanco
              bancos={bancos}
              onBancoSeleccionado={handleBancoSeleccionado}
              onCalcular={handleCalcular}
              bancoPreseleccionado={bancoPreseleccionado}
              calculadoraAbierta={calculadoraAbierta}
            />
          </CardContent>
        </Card>
      ) : (
        // Pantalla de resultados después de calcular
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left w-full">
              Resultado de la simulación
            </h2>
            <Button
              variant="outline"
              onClick={() => setResultado(null)}
              className="border-pastel-purple/50 hover:bg-pastel-purple/10 mx-auto sm:mx-0"
            >
              Volver a calcular
            </Button>
          </div>

          {/* Resultado de la simulación */}
          <Card className="border-pastel-purple/30 shadow-md hover:shadow-lg transition-shadow duration-300 bg-pastel-purple/5">
            <CardContent className="pt-6 pb-8">
              <ResultadoSimulacion
                resultado={resultado}
                banco={bancoSeleccionado!}
                montoFinanciar={montoFinanciar}
                plazo={plazo}
                cobraSueldo={cobraSueldo}
              />
            </CardContent>
          </Card>

          {/* Buscador de propiedades siempre visible después de la simulación */}
          <div className="mt-8">
            <Card className="border-pastel-green/30 shadow-md hover:shadow-lg transition-shadow duration-300 bg-pastel-green/5">
              <CardContent className="pt-6 pb-8">
                <BuscadorPropiedadesCredito
                  montoPrestamoAprobado={montoFinanciar}
                  valorPropiedad={valorPropiedad}
                  porcentajeFinanciacion={bancoSeleccionado?.financiacionMaxima || 80}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
