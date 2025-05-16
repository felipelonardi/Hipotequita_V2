import Head from "next/head"
import Script from "next/script"
import { seoConfig, pageConfigs, keywordsByPage, structuredData } from "@/lib/seo-config"

interface AdvancedSeoProps {
  pageName: "home" | "faqs" | "propiedades"
  customTitle?: string
  customDescription?: string
  customCanonical?: string
  customOgImage?: string
  noindex?: boolean
  nofollow?: boolean
  additionalMetaTags?: Array<{ name: string; content: string }>
  additionalLinkTags?: Array<{ rel: string; href: string; sizes?: string; type?: string; color?: string }>
  additionalStructuredData?: Record<string, any>
}

export default function AdvancedSeo({
  pageName,
  customTitle,
  customDescription,
  customCanonical,
  customOgImage,
  noindex = false,
  nofollow = false,
  additionalMetaTags = [],
  additionalLinkTags = [],
  additionalStructuredData = {},
}: AdvancedSeoProps) {
  const pageConfig = pageConfigs[pageName]
  const keywords = keywordsByPage[pageName]
  const pageStructuredData = structuredData[pageName]

  // Combine default and custom values
  const title = customTitle || pageConfig.title
  const description = customDescription || pageConfig.description
  const canonical = customCanonical || `${seoConfig.canonical}/${pageConfig.slug}`
  const ogImage = customOgImage || pageConfig.ogImage

  // Robots meta tag
  const robotsContent = `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"},max-snippet:-1,max-image-preview:large,max-video-preview:-1`

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(", ")} />
        <link rel="canonical" href={canonical} />

        {/* Robots */}
        <meta name="robots" content={robotsContent} />
        <meta name="googlebot" content={robotsContent} />

        {/* Open Graph */}
        <meta property="og:type" content={seoConfig.openGraph.type} />
        <meta property="og:locale" content={seoConfig.openGraph.locale} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={seoConfig.openGraph.siteName} />
        <meta property="og:image" content={`${seoConfig.canonical}/og/${ogImage}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />

        {/* Twitter */}
        <meta name="twitter:card" content={seoConfig.twitter.cardType} />
        <meta name="twitter:site" content={seoConfig.twitter.site} />
        <meta name="twitter:creator" content={seoConfig.twitter.handle} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${seoConfig.canonical}/og/${ogImage}`} />

        {/* Language Alternates */}
        {seoConfig.languageAlternates.map((alternate) => (
          <link
            key={alternate.hrefLang}
            rel="alternate"
            hrefLang={alternate.hrefLang}
            href={alternate.href + (pageConfig.slug ? `/${pageConfig.slug}` : "")}
          />
        ))}

        {/* Additional Meta Tags */}
        {seoConfig.additionalMetaTags.map((tag, index) => (
          <meta key={`meta-${index}`} name={tag.name} content={tag.content} />
        ))}

        {additionalMetaTags.map((tag, index) => (
          <meta key={`custom-meta-${index}`} name={tag.name} content={tag.content} />
        ))}

        {/* Additional Link Tags */}
        {seoConfig.additionalLinkTags.map((tag, index) => (
          <link
            key={`link-${index}`}
            rel={tag.rel}
            href={tag.href}
            {...(tag.sizes ? { sizes: tag.sizes } : {})}
            {...(tag.color ? { color: tag.color } : {})}
            {...(tag.type ? { type: tag.type } : {})}
          />
        ))}

        {additionalLinkTags.map((tag, index) => (
          <link
            key={`custom-link-${index}`}
            rel={tag.rel}
            href={tag.href}
            {...(tag.sizes ? { sizes: tag.sizes } : {})}
            {...(tag.color ? { color: tag.color } : {})}
            {...(tag.type ? { type: tag.type } : {})}
          />
        ))}

        {/* Mobile Specific */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hipotequita" />
        <meta name="application-name" content="Hipotequita" />
        <meta name="theme-color" content="#8b5cf6" />

        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
      </Head>

      {/* Structured Data */}
      {Object.entries(pageStructuredData).map(([key, data]) => (
        <Script
          key={`structured-data-${key}`}
          id={`structured-data-${key}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      {/* Additional Structured Data */}
      {Object.entries(additionalStructuredData).map(([key, data]) => (
        <Script
          key={`additional-structured-data-${key}`}
          id={`additional-structured-data-${key}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  )
}
