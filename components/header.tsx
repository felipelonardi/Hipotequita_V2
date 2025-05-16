"use client"
import { HelpCircle, BarChart2 } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { obtenerCotizacionDolarMEPConCache } from "@/services/dolar-service"
import { AnimatedValues } from "./animated-values"

export function Header() {
  const pathname = usePathname()
  const isFaqsPage = pathname === "/faqs"
  const isComparePage = pathname === "/comparativa-tasas"
  const isHomePage = pathname === "/"

  // Agregar estados para el dólar MEP y UVA
  const [dolarMEP, setDolarMEP] = useState<number | null>(null)
  const [valorUVA, setValorUVA] = useState<number | null>(null)
  const [cargando, setCargando] = useState(true)

  // Efecto para cargar los valores cuando se monta el componente
  useEffect(() => {
    async function cargarValores() {
      try {
        // Cargar dólar MEP
        const cotizacion = await obtenerCotizacionDolarMEPConCache()
        setDolarMEP(cotizacion)

        // Cargar valor UVA
        const respuestaUVA = await fetch("/api/uva-bcra")
        const dataUVA = await respuestaUVA.json()
        if (dataUVA.success && dataUVA.valor) {
          setValorUVA(dataUVA.valor)
        }
      } catch (error) {
        console.error("Error al cargar valores:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarValores()
  }, [])

  return (
    <header className="bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-800 fixed top-0 left-0 right-0 z-50 w-full h-16">
      <div className="container mx-auto h-full px-4">
        <div className="flex justify-between items-center h-full">
          {/* Logo y valores animados */}
          {/* Ajustar el ancho del contenedor para acomodar las etiquetas */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 relative ${
                isHomePage ? "text-purple-600 dark:text-purple-400" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 stroke-2 text-purple-500 dark:text-purple-400"
              >
                <path d="M4 10 L12 4 L20 10 V20 A2 2 0 0 1 18 22 H6 A2 2 0 0 1 4 20 Z"></path>
                <path d="M9 22 V12 H15 V22"></path>
              </svg>
              Hipotequita
              {isHomePage && (
                <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full bg-purple-500"></div>
              )}
            </Link>

            {/* Componente de valores animados con más espacio para las etiquetas */}
            <AnimatedValues dolarMEP={dolarMEP} valorUVA={valorUVA} cargando={cargando} />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/comparativa-tasas"
              className={`flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 relative ${
                isComparePage ? "text-purple-600 dark:text-purple-400" : ""
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Comparar tasas</span>
              {isComparePage && (
                <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full bg-purple-500"></div>
              )}
            </Link>

            <Link
              href="/faqs"
              className={`flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 relative ${
                isFaqsPage ? "text-purple-600 dark:text-purple-400" : ""
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Preguntas</span>
              {isFaqsPage && (
                <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full bg-purple-500"></div>
              )}
            </Link>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              <span className="hidden sm:inline text-sm">Tema</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
