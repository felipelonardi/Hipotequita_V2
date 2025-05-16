import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hipotequita.com"
  const currentDate = new Date().toISOString()

  // Páginas estáticas principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/faqs`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ]

  // Páginas de bancos (generadas dinámicamente)
  const bancos = [
    "hipotecario",
    "nacion",
    "ciudad",
    "provincia",
    "galicia",
    "santander",
    "bbva",
    "macro",
    "supervielle",
    "credicoop",
  ]

  const bancosPages = bancos.map((banco) => ({
    url: `${baseUrl}/bancos/${banco}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Páginas de ubicaciones (generadas dinámicamente)
  const ubicaciones = ["capital-federal", "buenos-aires", "cordoba", "santa-fe", "mendoza"]

  const ubicacionesPages = ubicaciones.map((ubicacion) => ({
    url: `${baseUrl}/propiedades/${ubicacion}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // Combinar todas las páginas
  return [...staticPages, ...bancosPages, ...ubicacionesPages]
}
