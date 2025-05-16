// Configuración SEO centralizada para toda la aplicación
export const seoConfig = {
  defaultTitle: "Simulador de Préstamos Hipotecarios UVA en Argentina | Hipotequita",
  titleTemplate: "%s | Hipotequita - Simulador Hipotecario",
  description:
    "Simulador avanzado de préstamos hipotecarios UVA en Argentina. Compara tasas entre bancos, visualiza proyecciones de cuotas y encuentra propiedades que se ajusten a tu presupuesto.",
  canonical: "https://hipotequita.com",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://hipotequita.com",
    siteName: "Hipotequita - Simulador de Préstamos Hipotecarios",
    title: "Simulador de Préstamos Hipotecarios UVA en Argentina",
    description: "Calcula tu préstamo hipotecario UVA, compara bancos y encuentra propiedades en Argentina",
    images: [
      {
        url: "https://hipotequita.com/og/home.jpg",
        width: 1200,
        height: 630,
        alt: "Hipotequita - Simulador de Préstamos Hipotecarios",
      },
    ],
  },
  twitter: {
    handle: "@hipotequita",
    site: "@hipotequita",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "author",
      content: "Felipe Lonardi",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=5",
    },
    {
      name: "apple-mobile-web-app-title",
      content: "Hipotequita",
    },
    {
      name: "application-name",
      content: "Hipotequita",
    },
    {
      name: "msapplication-TileColor",
      content: "#8b5cf6",
    },
    {
      name: "theme-color",
      content: "#8b5cf6",
    },
    {
      name: "mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "default",
    },
    {
      name: "format-detection",
      content: "telephone=no",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "mask-icon",
      href: "/safari-pinned-tab.svg",
      color: "#8b5cf6",
    },
  ],
  languageAlternates: [
    {
      hrefLang: "es-AR",
      href: "https://hipotequita.com",
    },
    {
      hrefLang: "x-default",
      href: "https://hipotequita.com",
    },
  ],
}

// Palabras clave por página
export const keywordsByPage = {
  home: [
    "préstamo hipotecario",
    "simulador hipotecario",
    "crédito UVA",
    "hipoteca Argentina",
    "calcular cuota hipoteca",
    "comparar bancos hipotecarios",
    "tasa hipotecaria",
    "préstamo vivienda",
    "simulación crédito UVA",
    "proyección cuotas hipoteca",
    "calculadora hipotecaria",
    "préstamo banco hipotecario",
    "préstamo banco nación",
    "préstamo banco ciudad",
    "préstamo banco provincia",
    "préstamo banco galicia",
    "préstamo banco santander",
    "préstamo banco bbva",
    "préstamo banco macro",
    "préstamo banco supervielle",
  ],
  faqs: [
    "preguntas frecuentes préstamos hipotecarios",
    "dudas crédito UVA",
    "cómo funciona préstamo hipotecario",
    "inflación y préstamos UVA",
    "cancelación anticipada hipoteca",
    "requisitos préstamo hipotecario",
    "riesgos crédito UVA",
    "ventajas préstamo hipotecario",
    "desventajas crédito UVA",
    "cuota préstamo hipotecario",
    "valor UVA",
    "cálculo UVA",
    "préstamo hipotecario vs tradicional",
    "hipoteca a tasa fija o UVA",
  ],
  propiedades: [
    "propiedades aptas crédito hipotecario",
    "inmuebles financiables",
    "casas con préstamo hipotecario",
    "departamentos con crédito UVA",
    "buscar propiedades hipotecables",
    "viviendas financiables Argentina",
    "propiedades banco nación",
    "propiedades banco ciudad",
    "propiedades banco provincia",
    "propiedades banco hipotecario",
  ],
}

// Configuración de páginas específicas
export const pageConfigs = {
  home: {
    title: "Simulador de Préstamos Hipotecarios UVA en Argentina | Hipotequita",
    description:
      "Calcula tu préstamo hipotecario UVA en Argentina. Compara tasas entre bancos, visualiza la evolución de cuotas y encuentra propiedades que se ajusten a tu presupuesto.",
    slug: "",
    ogImage: "home.jpg",
  },
  faqs: {
    title: "Preguntas Frecuentes sobre Préstamos Hipotecarios UVA | Hipotequita",
    description:
      "Encuentra respuestas a las preguntas más comunes sobre préstamos hipotecarios UVA en Argentina. Aprende sobre tasas, inflación, requisitos y más información importante.",
    slug: "faqs",
    ogImage: "faqs.jpg",
  },
  propiedades: {
    title: "Propiedades Aptas para Crédito Hipotecario | Hipotequita",
    description:
      "Encuentra propiedades aptas para crédito hipotecario en Argentina. Filtra por ubicación, precio, características y más para encontrar tu vivienda ideal.",
    slug: "propiedades",
    ogImage: "propiedades.jpg",
  },
}

// Datos estructurados para cada página
export const structuredData = {
  home: {
    webApplication: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Hipotequita - Simulador de Préstamos Hipotecarios",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "ARS",
        availability: "https://schema.org/InStock",
      },
      description:
        "Simulador de préstamos hipotecarios UVA en Argentina. Compara tasas entre bancos y encuentra propiedades que se ajusten a tu presupuesto.",
      screenshot: "https://hipotequita.com/screenshots/simulator.jpg",
      featureList:
        "Simulación de préstamos hipotecarios, Comparación de bancos, Búsqueda de propiedades, Proyección de cuotas",
      softwareVersion: "1.0.0",
      author: {
        "@type": "Person",
        name: "Felipe Lonardi",
        url: "https://www.linkedin.com/in/felipelonardi/",
      },
      provider: {
        "@type": "Organization",
        name: "Hipotequita",
        url: "https://hipotequita.com",
      },
    },
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Hipotequita",
      url: "https://hipotequita.com",
      logo: "https://hipotequita.com/logo.png",
      sameAs: ["https://www.linkedin.com/in/felipelonardi/", "https://github.com/felipelonardi"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "contacto@hipotequita.com",
      },
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://hipotequita.com/",
        },
      ],
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Cómo simular un préstamo hipotecario",
      description: "Guía paso a paso para simular un préstamo hipotecario UVA en Argentina",
      step: [
        {
          "@type": "HowToStep",
          name: "Seleccionar banco",
          text: "Elige el banco donde solicitarás el préstamo hipotecario",
        },
        {
          "@type": "HowToStep",
          name: "Ingresar valor de la propiedad",
          text: "Ingresa el valor de la propiedad que deseas adquirir",
        },
        {
          "@type": "HowToStep",
          name: "Ajustar porcentaje a financiar",
          text: "Selecciona qué porcentaje del valor total deseas financiar",
        },
        {
          "@type": "HowToStep",
          name: "Elegir plazo",
          text: "Selecciona el plazo en años para devolver el préstamo",
        },
        {
          "@type": "HowToStep",
          name: "Calcular cuota",
          text: "Haz clic en 'Calcular cuota' para ver los resultados de la simulación",
        },
      ],
    },
  },
  faqs: {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué es un préstamo hipotecario UVA?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Es un crédito para comprar una vivienda donde el monto a pagar se ajusta según la inflación. UVA significa Unidad de Valor Adquisitivo, y su valor cambia todos los días.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo funciona un préstamo UVA?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pedís un monto en pesos, pero en realidad se convierte en UVAs. Cada mes pagás una cantidad fija de UVAs, pero el valor de cada UVA cambia con la inflación.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué pasa si sube la inflación?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si la inflación sube, el valor de cada UVA también sube, por lo que la cuota que pagás se vuelve más cara.",
          },
        },
        {
          "@type": "Question",
          name: "¿Y si la inflación baja?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si la inflación baja, la cuota también se mantiene más accesible porque el valor de los UVAs sube más lento.",
          },
        },
        {
          "@type": "Question",
          name: "¿Es mejor un préstamo UVA o uno tradicional?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Los préstamos UVA tienen cuotas más bajas al inicio, pero pueden subir con la inflación. En cambio, los préstamos tradicionales tienen cuotas más altas desde el principio, pero más predecibles.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo se calcula el valor de la UVA?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El Banco Central actualiza el valor de la UVA todos los días según la inflación medida por el INDEC.",
          },
        },
        {
          "@type": "Question",
          name: "¿Puedo cancelar un préstamo UVA antes de tiempo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, podés hacer pagos anticipados o cancelarlo totalmente antes del tiempo pactado, aunque algunas entidades pueden cobrar un pequeño extra.",
          },
        },
        {
          "@type": "Question",
          name: "¿Hay algún límite para que la cuota no se dispare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Algunas regulaciones establecen que si la cuota sube demasiado respecto a los sueldos, se pueden hacer ajustes para aliviar el pago.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto dinero puedo pedir en un préstamo UVA?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Depende del banco, tu sueldo y tu capacidad de pago. En general, los bancos prestan hasta el 25-30% de tus ingresos en cuota.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué pasa si no puedo pagar la cuota?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si dejás de pagar, el banco puede ejecutar la hipoteca y quedarse con la propiedad. Si ves que la cuota se vuelve difícil de pagar, es clave hablar con el banco para buscar soluciones.",
          },
        },
      ],
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://hipotequita.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Preguntas Frecuentes",
          item: "https://hipotequita.com/faqs",
        },
      ],
    },
  },
  propiedades: {
    itemList: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "RealEstateListing",
            name: "Departamento 3 ambientes en Palermo",
            description: "Hermoso departamento de 3 ambientes en Palermo, apto crédito",
            url: "https://hipotequita.com/propiedades/1",
            image: "https://hipotequita.com/images/properties/palermo.jpg",
            offers: {
              "@type": "Offer",
              price: 150000,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Palermo",
              addressRegion: "CABA",
              addressCountry: "AR",
            },
          },
        },
      ],
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://hipotequita.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Propiedades",
          item: "https://hipotequita.com/propiedades",
        },
      ],
    },
  },
}
