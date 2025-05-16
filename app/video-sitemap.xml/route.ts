import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://hipotequita.com"

  // Crear el XML del mapa de vídeos
  const videoSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${baseUrl}/tutoriales/como-usar-simulador</loc>
    <video:video>
      <video:thumbnail_loc>${baseUrl}/videos/thumbnails/como-usar-simulador.jpg</video:thumbnail_loc>
      <video:title>Cómo usar el simulador de préstamos hipotecarios</video:title>
      <video:description>Tutorial paso a paso para usar el simulador de préstamos hipotecarios UVA de Hipotequita</video:description>
      <video:content_loc>${baseUrl}/videos/como-usar-simulador.mp4</video:content_loc>
      <video:player_loc>${baseUrl}/tutoriales/como-usar-simulador</video:player_loc>
      <video:duration>180</video:duration>
      <video:publication_date>2025-03-01T08:00:00+00:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:live>no</video:live>
      <video:tag>préstamo hipotecario</video:tag>
      <video:tag>simulador</video:tag>
      <video:tag>UVA</video:tag>
      <video:tag>tutorial</video:tag>
    </video:video>
  </url>
</urlset>`

  // Devolver el XML con el tipo de contenido correcto
  return new NextResponse(videoSitemapXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
