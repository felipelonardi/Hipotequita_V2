import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://hipotequita.com"

  // Crear el XML del mapa de imágenes
  const imageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${baseUrl}/og/home.jpg</image:loc>
      <image:title>Simulador de Préstamos Hipotecarios UVA en Argentina</image:title>
      <image:caption>Calcula tu préstamo hipotecario UVA en Argentina</image:caption>
    </image:image>
  </url>
  
  <url>
    <loc>${baseUrl}/faqs</loc>
    <image:image>
      <image:loc>${baseUrl}/og/faqs.jpg</image:loc>
      <image:title>Preguntas Frecuentes sobre Préstamos Hipotecarios UVA</image:title>
      <image:caption>Encuentra respuestas a las preguntas más comunes sobre préstamos hipotecarios UVA</image:caption>
    </image:image>
  </url>
  
  <url>
    <loc>${baseUrl}/propiedades</loc>
    <image:image>
      <image:loc>${baseUrl}/og/propiedades.jpg</image:loc>
      <image:title>Propiedades Aptas para Crédito Hipotecario</image:title>
      <image:caption>Encuentra propiedades aptas para crédito hipotecario en Argentina</image:caption>
    </image:image>
  </url>
</urlset>`

  // Devolver el XML con el tipo de contenido correcto
  return new NextResponse(imageSitemapXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
