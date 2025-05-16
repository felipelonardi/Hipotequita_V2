import { bancos } from "@/data/bancos"
import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://hipotequita.com"
  const date = new Date().toUTCString()

  // Crear el XML del feed RSS
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hipotequita - Simulador de Préstamos Hipotecarios</title>
    <link>${baseUrl}</link>
    <description>Simulador de préstamos hipotecarios UVA en Argentina. Compara tasas entre bancos y encuentra propiedades.</description>
    <language>es-ar</language>
    <lastBuildDate>${date}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    
    <item>
      <title>Simulador de Préstamos Hipotecarios UVA en Argentina</title>
      <link>${baseUrl}</link>
      <guid>${baseUrl}</guid>
      <pubDate>${date}</pubDate>
      <description>Calcula tu préstamo hipotecario UVA en Argentina. Compara tasas entre bancos y encuentra propiedades que se ajusten a tu presupuesto.</description>
    </item>
    
    <item>
      <title>Preguntas Frecuentes sobre Préstamos Hipotecarios UVA</title>
      <link>${baseUrl}/faqs</link>
      <guid>${baseUrl}/faqs</guid>
      <pubDate>${date}</pubDate>
      <description>Encuentra respuestas a las preguntas más comunes sobre préstamos hipotecarios UVA en Argentina.</description>
    </item>
    
    <item>
      <title>Propiedades Aptas para Crédito Hipotecario</title>
      <link>${baseUrl}/propiedades</link>
      <guid>${baseUrl}/propiedades</guid>
      <pubDate>${date}</pubDate>
      <description>Encuentra propiedades aptas para crédito hipotecario en Argentina.</description>
    </item>
    
    ${bancos
      .map(
        (banco) => `
    <item>
      <title>Préstamos Hipotecarios ${banco.nombre}</title>
      <link>${baseUrl}/bancos/${banco.id}</link>
      <guid>${baseUrl}/bancos/${banco.id}</guid>
      <pubDate>${date}</pubDate>
      <description>Simulá tu préstamo hipotecario UVA con ${banco.nombre}. Tasa anual desde ${banco.tasaAnualConSueldo}% hasta ${banco.tasaAnual}%. Financiación hasta ${banco.financiacionMaxima}% del valor de la propiedad.</description>
    </item>
    `,
      )
      .join("")}
  </channel>
</rss>`

  // Devolver el XML con el tipo de contenido correcto
  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
