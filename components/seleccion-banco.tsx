"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Banco } from "@/types/tipos"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import CalculadoraPrestamo from "./calculadora-prestamo"
import { DisclaimerAlert } from "./disclaimer"

function obtenerMontoMaximo(bancoId: string): string {
  switch (bancoId) {
    case "credicoop":
      return "$200.000.000"
    case "ciudad":
      return "$350.000.000"
    case "nacion":
      return "$250.000.000"
    case "supervielle":
      return "Sin límite"
    case "icbc":
      return "$250.000.000"
    case "bbva":
      return "Sin límite"
    case "macro":
      return "Sin límite"
    case "galicia":
      return "Sin límite"
    case "patagonia":
      return "$250.000.000"
    case "hipotecario":
      return "$250.000.000"
    case "santander":
      return "Sin límite"
    case "sol":
      return "$250.000.000"
    case "brubank":
      return "$250.000.000"
    default:
      return "Consultar"
  }
}

// Función para obtener el valor numérico del monto máximo
function obtenerMontoMaximoNumerico(bancoId: string): number | null {
  switch (bancoId) {
    case "credicoop":
      return 200000000
    case "ciudad":
      return 350000000
    case "nacion":
      return 250000000
    case "supervielle":
      return null // Sin límite
    case "icbc":
      return 250000000
    case "bbva":
      return null // Sin límite
    case "macro":
      return null // Sin límite
    case "galicia":
      return null // Sin límite
    case "patagonia":
      return 250000000
    case "hipotecario":
      return 250000000
    case "santander":
      return null // Sin límite
    case "sol":
      return 250000000
    case "brubank":
      return 250000000
    default:
      return null
  }
}

// Buscar la interfaz de props y agregar el prop calculadoraAbierta
interface SeleccionBancoProps {
  bancos: Banco[]
  onBancoSeleccionado: (banco: Banco, cobraSueldo: boolean) => void
  onCalcular: (monto: number, plazo: number, valorPropiedad: number, cobraSueldo: boolean) => void
  bancoPreseleccionado?: string | null
  calculadoraAbierta?: boolean
}

// Agregar el nuevo prop a la desestructuración de props
export default function SeleccionBanco({
  bancos,
  onBancoSeleccionado,
  onCalcular,
  bancoPreseleccionado,
  calculadoraAbierta = false,
}: SeleccionBancoProps) {
  // Buscar la declaración del estado mostrarCalculadora y modificarla para usar el prop
  const [mostrarCalculadora, setMostrarCalculadora] = useState<boolean>(calculadoraAbierta)
  const [bancoId, setBancoId] = useState<string | null>(null)
  const [cobraSueldo, setCobraSueldo] = useState<boolean>(false)
  const [bancoSeleccionado, setBancoSeleccionado] = useState<Banco | null>(null)

  const handleBancoChange = (value: string) => {
    // Si es el mismo banco, no hacemos nada
    if (value === bancoId) return

    setBancoId(value)
    setCobraSueldo(false) // Resetear el estado de cobraSueldo al cambiar de banco

    const banco = bancos.find((b) => b.id === value)
    if (banco) {
      setBancoSeleccionado(banco)
      onBancoSeleccionado(banco, false)
    }
  }

  const handleCobraSueldoChange = (checked: boolean) => {
    setCobraSueldo(checked)
    if (bancoSeleccionado) {
      onBancoSeleccionado(bancoSeleccionado, checked)
    }
  }

  // Función para manejar el cálculo desde la calculadora
  const handleCalcular = (monto: number, plazoMeses: number, valorPropiedad: number, cobraSueldoEnBanco: boolean) => {
    onCalcular(monto, plazoMeses, valorPropiedad, cobraSueldoEnBanco)
  }

  // Buscar el useEffect que maneja la preselección del banco y modificarlo
  useEffect(() => {
    if (bancoPreseleccionado) {
      const banco = bancos.find((b) => b.id === bancoPreseleccionado)
      if (banco) {
        handleSeleccionarBanco(banco)
        // Si calculadoraAbierta es true, mostrar la calculadora automáticamente
        if (calculadoraAbierta) {
          setMostrarCalculadora(true)
        }
      }
    }
  }, [bancoPreseleccionado, bancos, calculadoraAbierta])

  const handleSeleccionarBanco = (banco: Banco) => {
    setBancoId(banco.id)
    setCobraSueldo(false)
    setBancoSeleccionado(banco)
    onBancoSeleccionado(banco, false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Seleccioná un banco</h2>
      <RadioGroup value={bancoId || ""} onValueChange={handleBancoChange}>
        <div className="grid grid-cols-1 gap-4">
          {bancos
            .slice() // Crear una copia para no modificar el array original
            .sort((a, b) => a.tasaAnual - b.tasaAnual) // Ordenar de menor a mayor tasa
            .map((banco) => (
              <div key={banco.id} className="space-y-4">
                <Card
                  className={`cursor-pointer transition-all ${
                    bancoId === banco.id
                      ? "border-gradient shadow-md"
                      : "hover:border-pastel-purple/50 hover:bg-pastel-purple/5"
                  }`}
                  onClick={() => handleBancoChange(banco.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={banco.id} id={banco.id} />
                        <Label htmlFor={banco.id} className="cursor-pointer">
                          <div className="flex flex-col items-start text-left">
                            <div className="flex items-center gap-2">
                              <p className={`${bancoId === banco.id ? "font-bold" : "font-medium"}`}>{banco.nombre}</p>
                              {banco.tasaAnual !== banco.tasaAnualConSueldo && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-[10px] py-0.5 px-1.5 h-auto font-normal scale-90 origin-left whitespace-nowrap">
                                  Tasa preferencial
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Tasa:{" "}
                              {bancoId === banco.id && cobraSueldo ? (
                                <>
                                  {banco.tasaAnual !== banco.tasaAnualConSueldo && (
                                    <span className="line-through text-gray-400 mr-1">{banco.tasaAnual}%</span>
                                  )}
                                  <span
                                    className={`${banco.tasaAnual !== banco.tasaAnualConSueldo ? "text-green-600" : ""} font-bold`}
                                  >
                                    {banco.tasaAnualConSueldo}%
                                  </span>
                                </>
                              ) : (
                                <>{banco.tasaAnual}%</>
                              )}{" "}
                              anual
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Financiación: hasta {banco.financiacionMaxima}%
                            </p>
                            <p
                              className="text-xs text-muted-foreground flex items-center gap-1"
                              style={{ fontSize: "0.65rem" }}
                            >
                              <Info className="h-3 w-3 text-blue-500" />
                              Monto máximo: {obtenerMontoMaximo(banco.id)}
                            </p>
                          </div>
                        </Label>
                      </div>
                      {banco.logo && (
                        <div className="h-12 w-12 flex items-center justify-center shrink-0">
                          <img
                            src={
                              banco.id === "nacion"
                                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banco%20Nacion-xim06GzTgkSUfiZFAae4JaalBBi3WA.jpeg"
                                : banco.id === "provincia"
                                  ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banco_Provincia-removebg-preview-uV7skUGfTsv9Ot5jXH2hkJZSv87OjD.png"
                                  : banco.id === "ciudad"
                                    ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-Photoroom-WG9t86PhLH7WWi4xFs053XUzlVKC4M.png"
                                    : banco.id === "hipotecario"
                                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banco%20hipotecario-67w9mxSX1BVufG5VVIPdd0Ee0Rty4a.jpeg"
                                      : banco.id === "galicia"
                                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banco_Galicia-removebg-preview-VMzuiUbWqKxYl46maxu78CpYBcHBR3.png"
                                        : banco.id === "bbva"
                                          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Photoroom-hK62Lu34IJcDomuZj0oKXzrm9ghp8m.png"
                                          : banco.id === "brubank"
                                            ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brubank-QS3fYsaBIz082xGd6ONKUzkYFJ8TSG.png"
                                            : banco.id === "supervielle"
                                              ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supervielle-Photoroom-IPN68m2RvmvEcJoIA2xMu7JbIqkYdJ.png"
                                              : banco.id === "credicoop"
                                                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/credicoop-1-xFaN4VlRCN4OrbW4Pz6xpIVIt9BokP.png"
                                                : banco.id === "icbc"
                                                  ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icbc-Photoroom-vqD0ERYeI97fpyDxQOJRKu8RyEFF8o.png"
                                                  : banco.id === "santander"
                                                    ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/santander-Photoroom-A8ZKFwBr3hv85ASZ7EubK7y61R7ZQJ.png"
                                                    : banco.id === "patagonia"
                                                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/patagonia-Photoroom-qUk2YIzzB2J1AvLWGNOSudxuq795F4.png"
                                                      : banco.id === "sol"
                                                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/del%20sol-Photoroom-z31PlOUqjizReXqlJaOyTvT5jpLRGS.png"
                                                        : banco.id === "macro"
                                                          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/macro-stgm3N6iG8fPaglZGegWdzySU5pUaB.png"
                                                          : banco.logo || "/placeholder.svg"
                            }
                            alt={`Logo de ${banco.nombre}`}
                            className={`object-contain ${
                              ["nacion", "credicoop", "bbva", "hipotecario", "brubank"].includes(banco.id)
                                ? "rounded-full"
                                : ""
                            }`}
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Agregar el switch dentro de la tarjeta cuando el banco está seleccionado */}
                    {bancoId === banco.id && (
                      <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
                        <Switch
                          id={`cobra-sueldo-${banco.id}`}
                          checked={cobraSueldo}
                          onCheckedChange={handleCobraSueldoChange}
                          onClick={(e) => e.stopPropagation()} // Evitar que el click en el switch active el onClick de la Card
                          className="dark:border dark:border-gray-600"
                        />
                        <Label
                          htmlFor={`cobra-sueldo-${banco.id}`}
                          className="cursor-pointer"
                          onClick={(e) => e.stopPropagation()} // Evitar que el click en el label active el onClick de la Card
                        >
                          Cobro mi sueldo en este banco
                        </Label>
                        {cobraSueldo && banco.tasaAnual !== banco.tasaAnualConSueldo && (
                          <span className="text-sm text-green-600 font-bold ml-2">¡Tasa preferencial!</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Mostrar la calculadora justo debajo del banco seleccionado */}
                {bancoId === banco.id && (
                  <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                    <CalculadoraPrestamo
                      banco={banco}
                      onCalcular={handleCalcular}
                      montoMaximo={obtenerMontoMaximoNumerico(banco.id)}
                      cobraSueldo={cobraSueldo}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </RadioGroup>

      {/* Disclaimer legal */}
      <div className="mt-8">
        <DisclaimerAlert />
      </div>
    </div>
  )
}
