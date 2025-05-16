import BuscadorSimple from "@/components/buscador-simple"
import { Header } from "@/components/header"
import AdvancedSeo from "@/components/seo/advanced-seo"

export default function PropiedadesPage() {
  return (
    <>
      <AdvancedSeo
        pageName="propiedades"
        additionalMetaTags={[
          { name: "geo.region", content: "AR" },
          { name: "geo.placename", content: "Argentina" },
          { name: "ICBM", content: "-34.603722, -58.381592" },
        ]}
      />

      <main className="min-h-screen bg-pastel-blue/5 dark:bg-gray-950">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <h1 className="text-2xl font-bold mb-6">Propiedades Aptas para Crédito Hipotecario</h1>
          <div className="max-w-5xl mx-auto">
            <BuscadorSimple />
          </div>
        </div>
      </main>
    </>
  )
}
