"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Función para alternar el tema
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
    console.log("Cambiando tema de", theme, "a", theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 opacity-0">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="icon" className="w-9 h-9" onClick={toggleTheme} aria-label="Alternar tema">
      {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
