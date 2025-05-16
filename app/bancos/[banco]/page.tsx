import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AdvancedSeo from "@/components/seo/advanced-seo"
import { bancos } from "@/data/bancos"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return bancos.map((banco) => ({
    banco: banco.id,
  }))
}

export default function BancoPage({ params }: { params: { banco: string } }) {
  const banco = bancos.find((b) => b.id === params.banco)

  if (!banco) {
    notFound()
  }

  // Datos estructurados específicos para esta página de banco
  const bancoStructuredData = {
    financialProduct: {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      name: `Préstamo Hipotecario ${banco.nombre}`,
      description: `Información detallada sobre préstamos hipotecarios UVA de ${banco.nombre} en Argentina`,
      provider: {
        "@type": "BankOrCreditUnion",
        name: banco.nombre,
        logo: banco.logo || "https://hipotequita.vercel.app/logo.png",
      },
      annualPercentageRate: {
        "@type": "QuantitativeValue",
        value: banco.tasaAnual,
        minValue: banco.tasaAnualConSueldo,
        maxValue: banco.tasaAnual,
      },
      feesAndCommissionsSpecification: "Consultar en sucursal",
      areaServed: {
        "@type": "Country",
        name: "Argentina",
      },
    },
  }

  return (
    <>
      <AdvancedSeo
        pageName="home"
        customTitle={`Préstamos Hipotecarios ${banco.nombre} | Tasas y Condiciones | Hipotequita`}
        customDescription={`Simulá tu préstamo hipotecario UVA con ${banco.nombre}. Tasa anual desde ${banco.tasaAnualConSueldo}% hasta ${banco.tasaAnual}%. Financiación hasta ${banco.financiacionMaxima}% del valor de la propiedad.`}
        customCanonical={`https://hipotequita.vercel.app/bancos/${banco.id}`}
        customOgImage={`banco-${banco.id}.jpg`}
        additionalStructuredData={bancoStructuredData}
      />

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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-3">Préstamos Hipotecarios {banco.nombre}</h1>
              {banco.logo && (
                <img
                  src={banco.logo || "/placeholder.svg"}
                  alt={`Logo de ${banco.nombre}`}
                  className="h-10 w-10 object-contain"
                  width={40}
                  height={40}
                />
              )}
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Características del préstamo</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Tasa anual</h3>
                  <p className="text-2xl font-bold">{banco.tasaAnual}%</p>
                  {banco.tasaAnual !== banco.tasaAnualConSueldo && (
                    <p className="text-sm text-green-600">{banco.tasaAnualConSueldo}% con acreditación de sueldo</p>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Financiación máxima</h3>
                  <p className="text-2xl font-bold">{banco.financiacionMaxima}%</p>
                  <p className="text-sm text-gray-500">del valor de la propiedad</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Ventajas de este banco</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700 dark:text-blue-200">
                  <li>Préstamos en UVA con tasa fija</li>
                  <li>Plazos de hasta 30 años</li>
                  <li>Posibilidad de cancelación anticipada</li>
                  {banco.tasaAnual !== banco.tasaAnualConSueldo && (
                    <li>Tasa preferencial para clientes con acreditación de haberes</li>
                  )}
                </ul>
              </div>

              <div className="mt-6">
                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    Simular préstamo con {banco.nombre}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
