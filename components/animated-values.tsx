"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp } from "lucide-react"

interface AnimatedValuesProps {
  dolarMEP: number | null
  valorUVA: number | null
  cargando: boolean
}

export function AnimatedValues({ dolarMEP, valorUVA, cargando }: AnimatedValuesProps) {
  const [showDolar, setShowDolar] = useState(true)
  const [animationState, setAnimationState] = useState<"entering" | "visible" | "exiting">("visible")

  // Alternar entre dólar y UVA cada 4 segundos
  useEffect(() => {
    if (cargando) return

    const interval = setInterval(() => {
      // Iniciar animación de salida
      setAnimationState("exiting")

      // Después de que termine la animación de salida, cambiar el valor y comenzar la animación de entrada
      setTimeout(() => {
        setShowDolar((prev) => !prev)
        setAnimationState("entering")

        // Después de que termine la animación de entrada, establecer como visible
        setTimeout(() => {
          setAnimationState("visible")
        }, 300) // Duración de la animación de entrada
      }, 300) // Duración de la animación de salida
    }, 4000) // Cambiar cada 4 segundos

    return () => clearInterval(interval)
  }, [cargando])

  // Clases de animación basadas en el estado
  const animationClasses = {
    entering: "animate-slide-in-top",
    visible: "opacity-100",
    exiting: "animate-slide-out-bottom",
  }

  if (cargando) {
    return (
      <div className="flex items-center gap-1 min-w-[120px] justify-center">
        <span className="animate-pulse text-xs">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="relative h-6 min-w-[140px] flex items-center justify-center overflow-hidden">
      {showDolar ? (
        <div
          className={`absolute flex items-center gap-1 text-xs whitespace-nowrap ${animationClasses[animationState]}`}
        >
          <DollarSign className="h-3.5 w-3.5 text-green-600" />
          <span className="font-medium">
            <span className="text-gray-500 mr-1">Dólar MEP:</span>${dolarMEP?.toLocaleString("es-AR")}
          </span>
        </div>
      ) : (
        <div
          className={`absolute flex items-center gap-1 text-xs whitespace-nowrap ${animationClasses[animationState]}`}
        >
          <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
          <span className="font-medium">
            <span className="text-gray-500 mr-1">UVA:</span>${valorUVA?.toLocaleString("es-AR")}
          </span>
        </div>
      )}
    </div>
  )
}
