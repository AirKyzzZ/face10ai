import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://face10ai.com'),
  title: {
    default: "face10ai.com - Analyse IA de votre attractivité faciale",
    template: "%s | face10ai",
  },
  description:
    "Découvrez votre note d'attractivité avec face10ai, basée sur la symétrie, le nombre d'or et des critères scientifiques. IA entraînée sur des milliers de visages.",
  keywords: [
    "analyse visage",
    "attractivité",
    "IA",
    "beauté",
    "score beauté",
    "face analysis",
    "beauty score",
    "symétrie faciale",
    "nombre d'or",
    "intelligence artificielle",
  ],
  authors: [{ name: "face10ai" }],
  creator: "face10ai",
  publisher: "face10ai",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: "face10ai.com - Analyse IA de votre attractivité faciale",
    description:
      "Découvrez votre note d'attractivité avec notre IA entraînée sur des milliers de visages. Résultats instantanés et confidentiels.",
    siteName: "face10ai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "face10ai - Analyse IA de beauté faciale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "face10ai.com - Analyse IA de votre attractivité faciale",
    description:
      "Découvrez votre note d'attractivité avec notre IA. Testez gratuitement!",
    images: ["/og-image.png"],
    creator: "@face10ai",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "face10ai",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  description:
    "Application d'analyse de l'attractivité faciale utilisant l'intelligence artificielle",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "5 analyses gratuites par mois",
  },
  featureList: [
    "Analyse faciale par IA",
    "Score d'attractivité de 1 à 10",
    "Basé sur la symétrie et le nombre d'or",
    "Résultats instantanés",
    "Confidentialité garantie",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        {/* JSON-LD structured data - static content, safe to inject */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${poppins.className} min-h-screen`}>
        <SessionProvider>
        {/* Scrollable Container */}
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black to-[#0C0F16]">
          {/* Background Grid */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute left-1/2 top-[20px] -translate-x-1/2 w-[700px] h-[700px] bg-grid-black/[0.15] dark:bg-grid-white/[0.2] bg-[length:50px_50px]"
              style={{
                maskImage:
                  "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
                WebkitMaskImage:
                  "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
              }}
            />
          </div>

          {/* Taller Triangle Glow Effect (Moved Upwards by 40px) */}
          <div className="absolute inset-x-0 top-[-80px] z-0 flex justify-center">
            {/* Larger Soft Ambient Glow */}
            <div
              className="w-0 h-0
                border-l-[450px] border-l-transparent
                border-r-[450px] border-r-transparent
                border-b-[900px] border-b-[#5B698B]/40
                blur-[100px]
                opacity-50"
            />

            {/* Inner Glow for More Softness */}
            <div
              className="absolute top-[80px]
                w-0 h-0
                border-l-[300px] border-l-transparent
                border-r-[300px] border-r-transparent
                border-b-[650px] border-b-[#5B698B]/50
                blur-[120px]
                opacity-60"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10">{children}</div>
        </div>
        </SessionProvider>
      </body>
    </html>
  );
}
