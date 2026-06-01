import type { Metadata } from "next";
import "./globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://kyzerrobotics.com/#business",
      name: "Kyzer Robotics Pvt. Ltd.",
      description:
        "Kyzer Robotics Pvt. Ltd. delivers intelligent robotic solutions and advanced 3D printing for a smarter tomorrow. Based in Pune, India — we build custom drones, automation systems, AI-integrated robotics, and rapid prototypes with 48-hour turnaround.",
      url: "https://kyzerrobotics.com",
      logo: "https://kyzerrobotics.com/logo.png",
      image: "https://kyzerrobotics.com/og-image.jpg",
      telephone: "+919049695264",
      email: "info@kyzerrobotics.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411000",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "18.5204",
        longitude: "73.8567",
      },
      sameAs: ["https://www.instagram.com/kyzer.robotics"],
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
      priceRange: "₹₹",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Products & Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Intelligent Automation",
              description:
                "Custom automation systems, robotic platforms, and smart control solutions designed and tested in-house in Pune.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "3D Printing & Prototyping",
              description:
                "FDM 3D printing in PLA, ABS, PETG, TPU, and Nylon with 48-hour turnaround. Rapid prototypes to production-ready parts.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI & Smart Technology",
              description:
                "Computer vision, embedded AI, and intelligent drone systems — integrating smart technology into real-world robotic applications.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Custom Solutions",
              description:
                "End-to-end engineering from concept and CAD to fabrication and delivery for startups, colleges, and industrial clients.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Drone Builds",
              description:
                "Industrial-grade FPV, survey, and agricultural drones — built for performance and tested for demanding environments.",
            },
          },
        ],
      },
      areaServed: [
        { "@type": "City", name: "Pune" },
        { "@type": "State", name: "Maharashtra" },
        { "@type": "Country", name: "India" },
      ],
      keywords:
        "drone manufacturer Pune, 3D printing service Pune, custom drone build India, rapid prototyping Pune",
    },
    {
      "@type": "WebSite",
      "@id": "https://kyzerrobotics.com/#website",
      url: "https://kyzerrobotics.com",
      name: "Kyzer Robotics Pvt. Ltd.",
      publisher: { "@id": "https://kyzerrobotics.com/#business" },
    },
  ],
};

export const metadata: Metadata = {
  title: "Kyzer Robotics — Intelligent Automation, Drones & 3D Printing in Pune",
  description:
    "Kyzer Robotics Pvt. Ltd. — Pune's trusted drone manufacturer and 3D printing service. Intelligent automation, custom drone builds, AI-smart robotics, and 48-hour rapid prototyping for startups, hobbyists, and industry teams across India.",
  keywords: [
    "drone manufacturer Pune",
    "3D printing service Pune",
    "custom drone build India",
    "rapid prototyping Pune",
    "FPV drone Pune",
    "agricultural drone India",
    "FDM printing Pune",
    "nylon printing service Pune",
    "engineering prototyping",
    "Kyzer Robotics",
  ],
  robots: "index, follow",
  authors: [{ name: "Kyzer Robotics Pvt. Ltd." }],
  openGraph: {
    type: "website",
    url: "https://kyzerrobotics.com/",
    siteName: "Kyzer Robotics Pvt. Ltd.",
    locale: "en_IN",
    title: "Kyzer Robotics — Innovate. Automate. Elevate. | Pune",
    description:
      "Intelligent robotic solutions and advanced 3D printing for a smarter tomorrow. Custom drones, AI-smart robotics, and rapid prototyping — engineered in Pune.",
    images: [
      {
        url: "https://kyzerrobotics.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kyzer Robotics — Drones and 3D Printing in Pune",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyzer Robotics — Innovate. Automate. Elevate. | Pune",
    description:
      "Intelligent robotic solutions and advanced 3D printing for a smarter tomorrow. Custom drones, AI-smart robotics, and rapid prototyping — engineered in Pune.",
    images: {
      url: "https://kyzerrobotics.com/og-image.jpg",
      alt: "Kyzer Robotics — Drones and 3D Printing in Pune",
    },
  },
  alternates: {
    canonical: "https://kyzerrobotics.com/",
  },
  other: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
