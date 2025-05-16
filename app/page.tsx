"use client"

import { useState, useEffect } from "react"
import SimuladorHipotecario from "@/components/simulador-hipotecario"
import { Header } from "@/components/header"
import AdvancedSeo from "@/components/seo/advanced-seo"
import { useSearchParams } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function Home() {
  const [mostrarSimulador, setMostrarSimulador] = useState(false)
  const [cargando, setCargando] = useState(false)
  const searchParams = useSearchParams()
  const bancoId = searchParams.get("banco")
  const calculadoraAbierta = searchParams.get("calculadoraAbierta") === "true"

  // Si hay un banco en los parámetros de consulta, mostrar el spinner y luego el simulador
  useEffect(() => {
    if (bancoId) {
      // Mostrar el spinner
      setCargando(true)

      // Esperar 1 segundo para una transición suave
      const timer = setTimeout(() => {
        setMostrarSimulador(true)
        setCargando(false)
      }, 1000) // Cambiado de 700ms a 1000ms (1 segundo)

      return () => clearTimeout(timer)
    }
  }, [bancoId])

  // Obtener el nombre del banco para el mensaje del spinner
  const getBancoName = (id: string) => {
    const nombres: Record<string, string> = {
      hipotecario: "Banco Hipotecario",
      ciudad: "Banco Ciudad",
      supervielle: "Banco Supervielle",
      icbc: "ICBC",
      brubank: "Brubank",
      nacion: "Banco Nación",
      santander: "Santander",
      macro: "Banco Macro",
      bbva: "BBVA",
      galicia: "Banco Galicia",
      patagonia: "Banco Patagonia",
      credicoop: "Banco Credicoop",
      sol: "Banco del Sol",
    }
    return nombres[id] || "el banco seleccionado"
  }

  return (
    <>
      <AdvancedSeo
        pageName="home"
        additionalMetaTags={[
          { name: "google-site-verification", content: "tu-codigo-de-verificacion" },
          { name: "msvalidate.01", content: "tu-codigo-de-verificacion-bing" },
          { name: "yandex-verification", content: "tu-codigo-de-verificacion-yandex" },
        ]}
      />

      <main className="min-h-screen bg-pastel-blue/5 dark:bg-gray-950">
        {/* Siempre mostrar el Header */}
        <Header />

        <div className="container mx-auto py-6 px-4 sm:py-8">
          {cargando ? (
            // Mostrar el spinner mientras carga
            <div className="flex items-center justify-center min-h-[80vh]">
              <Spinner
                size="custom" // Usar el tamaño personalizado (75% del tamaño xl)
                message={`Cargando simulador para ${getBancoName(bancoId || "")}`}
              />
            </div>
          ) : !mostrarSimulador ? (
            // Mostrar la landing page
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <div className="mb-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="96"
                  height="96"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-24 w-24 stroke-2 text-purple-500 dark:text-purple-400"
                >
                  <path d="M4 10 L12 4 L20 10 V20 A2 2 0 0 1 18 22 H6 A2 2 0 0 1 4 20 Z"></path>
                  <path d="M9 22 V12 H15 V22"></path>
                </svg>
              </div>
              <p className="text-sm sm:text-base text-center mb-10 text-gray-800 dark:text-gray-200 border-gradient p-4 rounded-lg block mx-auto w-fit max-w-2xl dark:bg-gray-800 font-normal">
                Hipotequita es un simulador de préstamos hipotecarios en Argentina, con la posibilidad de encontrar
                propiedades que se ajustan a tu búsqueda sin salir de la página. Hacé click en comenzar para simular tu
                primera vivienda.
              </p>

              <button
                className="text-sm font-medium px-6 py-3 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition-opacity"
                onClick={() => setMostrarSimulador(true)}
                aria-label="Comenzar simulación de préstamo hipotecario"
              >
                Comenzar
              </button>
            </div>
          ) : (
            // Mostrar el simulador
            <SimuladorHipotecario bancoPreseleccionado={bancoId} calculadoraAbierta={calculadoraAbierta} />
          )}
        </div>
      </main>
    </>
  )
}
