import Script from "next/script"

interface StructuredDataProps {
  type: "WebApplication" | "FAQPage" | "BreadcrumbList"
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  // Crear el objeto JSON-LD según el tipo
  let jsonLD = {}

  if (type === "WebApplication") {
    jsonLD = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Hipotequita - Simulador de Préstamos Hipotecarios",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      ...data,
    }
  } else if (type === "FAQPage") {
    jsonLD = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.questions.map((q: any) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.answer,
        },
      })),
    }
  } else if (type === "BreadcrumbList") {
    jsonLD = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: data.items.map((item: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
    />
  )
}
