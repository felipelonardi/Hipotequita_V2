"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { bancos } from "@/data/bancos"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Función para obtener la fecha actual formateada
const obtenerFechaActual = () => {
  const fecha = new Date()
  return fecha.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function ComparativaTasasPage() {
  // Ordenar bancos por tasa anual (de menor a mayor)
  const bancosOrdenados = [...bancos].sort((a, b) => a.tasaAnual - b.tasaAnual)

  // Preparar datos para el gráfico
  const datosGrafico = bancosOrdenados.map((banco) => ({
    nombre: banco.nombre.split(" ").pop() || banco.nombre, // Usar solo la última palabra del nombre para etiquetas más cortas
    nombreCompleto: banco.nombre,
    tasaNormal: banco.tasaAnual,
    tasaPreferencial: banco.tasaAnualConSueldo,
    tieneTasaPreferencial: banco.tasaAnualConSueldo !== banco.tasaAnual,
  }))

  return (
    <main className="min-h-screen bg-pastel-blue/5 dark:bg-gray-950">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Comparativa de tasas hipotecarias</h1>
        </div>

        <Card className="border-pastel-purple/30 shadow-md hover:shadow-lg transition-shadow duration-300 bg-pastel-purple/5 mb-8">
          <CardHeader className="pb-2">
            <CardDescription>
              Comparativa de tasas anuales y condiciones de préstamos hipotecarios UVA en Argentina
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Actualizado a {obtenerFechaActual()}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Banco</TableHead>
                  <TableHead className="text-center">Tasa anual</TableHead>
                  <TableHead className="text-center">Tasa con acreditación de sueldo</TableHead>
                  <TableHead className="text-center">Financiación máxima</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bancosOrdenados.map((banco, index) => (
                  <TableRow key={banco.id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/?banco=${banco.id}&calculadoraAbierta=true`}
                        className="flex items-center gap-2 hover:text-purple-600 transition-colors group"
                      >
                        <div className="h-8 w-8 flex items-center justify-center shrink-0">
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
                              width: "32px",
                              height: "32px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <span className="group-hover:underline">{banco.nombre}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">{banco.tasaAnual}%</TableCell>
                    <TableCell className="text-center">
                      {banco.tasaAnualConSueldo !== banco.tasaAnual ? (
                        <span className="text-green-600 font-bold">{banco.tasaAnualConSueldo}%</span>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">No ofrece</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>{banco.financiacionMaxima}%</span>
                        {banco.financiacionMaxima >= 80 && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Alta financiación</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-pastel-purple/30 shadow-md hover:shadow-lg transition-shadow duration-300 bg-pastel-purple/5 mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Comparativa visual de tasas hipotecarias</CardTitle>
            <CardDescription>
              Visualización de tasas normales y preferenciales (con acreditación de sueldo)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 120 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 16]} />
                  <YAxis type="category" dataKey="nombre" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === "tasaPreferencial" && !props.payload.tieneTasaPreferencial) {
                        return ["No ofrece tasa preferencial", "Tasa con Acreditación de Sueldo"]
                      }
                      return [`${value}%`, name === "tasaNormal" ? "Tasa Normal" : "Tasa con Acreditación de Sueldo"]
                    }}
                    labelFormatter={(label) => {
                      const item = datosGrafico.find((item) => item.nombre === label)
                      return `Banco: ${item ? item.nombreCompleto : label}`
                    }}
                  />
                  <Legend verticalAlign="bottom" height={50} wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar dataKey="tasaNormal" name="Tasa Normal" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  <Bar
                    dataKey="tasaPreferencial"
                    name="Tasa con Acreditación de Sueldo"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    fillOpacity={(entry) => (entry.tieneTasaPreferencial ? 1 : 0.4)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
