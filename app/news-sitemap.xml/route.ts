import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://hipotequita.com"
  const currentDate = new Date().toISOString()

  // Crear el XML del mapa de noticias
  const newsSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}/blog/actualizacion-tasas-hipotecarias</loc>
    <news:news>
      <news:publication>
        <news:name>Hipotequita</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${currentDate}</news:publication_date>
      <news:title>Actualización de tasas hipotecarias en Argentina</news:title>
      <news:keywords>préstamos hipotecarios, tasas, UVA, bancos, Argentina</news:keywords>
    </news:news>
  </url>
  
  <url>
    <loc>${baseUrl}/blog/nuevos-creditos-hipotecarios</loc>
    <news:news>
      <news:publication>
        <news:name>Hipotequita</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${currentDate}</news:publication_date>
      <news:title>Nuevos créditos hipotecarios en Argentina</news:title>
      <news:keywords>préstamos hipotecarios, créditos, UVA, bancos, Argentina</news:keywords>
    </news:news>
  </url>
</urlset>`

  // Devolver el XML con el tipo de contenido correcto
  return new NextResponse(newsSitemapXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
