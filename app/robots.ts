import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/_next/", "/private/", "/*.json$"],
    },
    sitemap: "https://hipotequita.com/sitemap.xml",
    host: "https://hipotequita.com",
  }
}
