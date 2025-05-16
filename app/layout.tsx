import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { Footer } from "@/components/footer"

// Configurar la fuente Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

// Metadatos por defecto para toda la aplicación
export const metadata: Metadata = {
  metadataBase: new URL("https://hipotequita.com"),
  title: {
    default: "Simulador de Préstamos Hipotecarios en Argentina | Hipotequita",
    template: "%s | Hipotequita",
  },
  description:
    "Simula tu préstamo hipotecario y encuentra propiedades que se ajusten a tu presupuesto. Compara tasas entre diferentes bancos en Argentina.",
  keywords: [
    "préstamo hipotecario",
    "UVA",
    "simulador",
    "Argentina",
    "crédito vivienda",
    "bancos",
    "tasa hipotecaria",
    "calculadora hipotecaria",
  ],
  authors: [{ name: "Felipe Lonardi" }],
  creator: "Felipe Lonardi",
  publisher: "Hipotequita",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://hipotequita.com",
    languages: {
      "es-AR": "https://hipotequita.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://hipotequita.com",
    siteName: "Hipotequita - Simulador de Préstamos Hipotecarios",
    images: [
      {
        url: "https://hipotequita.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hipotequita - Simulador de Préstamos Hipotecarios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hipotequita",
  },
  verification: {
    google: "google-site-verification-code", // Reemplazar con el código real cuando esté disponible
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${montserrat.variable} font-montserrat`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="min-h-[calc(100vh-120px)] dark:bg-gray-950 dark:text-gray-200">{children}</div>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
