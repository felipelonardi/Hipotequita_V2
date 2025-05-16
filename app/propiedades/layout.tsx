import type React from "react"
import { Header } from "@/components/header"

export default function PropiedadesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
