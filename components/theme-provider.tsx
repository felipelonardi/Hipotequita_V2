"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Solo establecer el tema claro si no hay tema guardado
  React.useEffect(() => {
    // Verificar si ya hay un tema guardado
    const savedTheme = localStorage.getItem("theme")
    if (!savedTheme) {
      // Solo establecer el tema claro si no hay tema guardado
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
