import FaqHipotecario from "@/components/faq-hipotecario"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AdvancedSeo from "@/components/seo/advanced-seo"

export default function FaqsPage() {
  return (
    <>
      <AdvancedSeo
        pageName="faqs"
        additionalMetaTags={[
          { name: "article:published_time", content: "2025-03-01T08:00:00+00:00" },
          { name: "article:modified_time", content: "2025-03-28T10:15:00+00:00" },
          { name: "article:author", content: "Felipe Lonardi" },
        ]}
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
            <h1 className="text-2xl font-bold">Preguntas frecuentes</h1>
          </div>
          <FaqHipotecario />
        </div>
      </main>
    </>
  )
}
