import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AdvancedSeo from "@/components/seo/advanced-seo"
import BuscadorSimple from "@/components/buscador-simple"
import { notFound } from "next/navigation"
import { ubicacionesPrincipales } from "@/data/ubicaciones"

export async function generateStaticParams() {
  return ubicacionesPrincipales.map((ubicacion) => ({
    ubicacion: ubicacion.id,
  }))
}

export default function UbicacionPage({ params }: { params: { ubicacion: string } }) {
  const ubicacion = ubicacionesPrincipales.find((u) => u.id === params.ubicacion)

  if (!ubicacion) {
    notFound()
  }

  // Datos estructurados específicos para esta página de ubicación
  const ubicacionStructuredData = {
    place: {
      "@context": "https://schema.org",
      "@type": "Place",
      name: ubicacion.nombre,
      address: {
        "@type": "PostalAddress",
        addressLocality: ubicacion.nombre,
        addressRegion: "Argentina",
        addressCountry: "AR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "-34.603722",
        longitude: "-58.381592",
      },
    },
  }

  return (
    <>
      <AdvancedSeo
        pageName="propiedades"
        customTitle={`Propiedades en ${ubicacion.nombre} | Aptas para Crédito Hipotecario | Hipotequita`}
        customDescription={`Encuentra propiedades aptas para crédito hipotecario en ${ubicacion.nombre}, Argentina. Filtra por precio, características y más para encontrar tu vivienda ideal.`}
        customCanonical={`https://hipotequita.vercel.app/propiedades/${ubicacion.id}`}
        customOgImage={`ubicacion-${ubicacion.id}.jpg`}
        additionalMetaTags={[
          { name: "geo.region", content: "AR" },
          { name: "geo.placename", content: ubicacion.nombre },
        ]}
        additionalStructuredData={ubicacionStructuredData}
      />

      <main className="min-h-screen bg-pastel-blue/5 dark:bg-gray-950">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center mb-6">
            <Link href="/propiedades">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Todas las propiedades
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Propiedades en {ubicacion.nombre}</h1>
          </div>

          <div className="max-w-5xl mx-auto">
            <BuscadorSimple />
          </div>
        </div>
      </main>
    </>
  )
}
