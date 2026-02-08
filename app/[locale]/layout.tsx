import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SessionProvider } from "@/components/SessionProvider";
import { locales, type Locale } from "@/i18n/config";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const isEnglish = locale === 'en';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://face10ai.com'),
    title: {
      default: isEnglish
        ? "face10ai.com - AI Face Attractiveness Analysis"
        : "face10ai.com - Analyse IA de votre attractivité faciale",
      template: "%s | face10ai",
    },
    description: isEnglish
      ? "Discover your attractiveness score with face10ai, based on symmetry, golden ratio, and scientific criteria. AI trained on thousands of faces."
      : "Découvrez votre note d'attractivité avec face10ai, basée sur la symétrie, le nombre d'or et des critères scientifiques. IA entraînée sur des milliers de visages.",
    keywords: isEnglish
      ? ["face rating", "AI analysis", "attractiveness score", "face symmetry", "facial beauty", "AI face score", "beauty analysis"]
      : ["analyse visage", "attractivité", "IA", "beauté", "score beauté", "face analysis", "beauty score", "symétrie faciale", "nombre d'or", "intelligence artificielle"],
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
      locale: isEnglish ? "en_US" : "fr_FR",
      url: "/",
      title: isEnglish
        ? "face10ai.com - AI Face Attractiveness Analysis"
        : "face10ai.com - Analyse IA de votre attractivité faciale",
      description: isEnglish
        ? "Discover your attractiveness score with our AI trained on thousands of faces. Instant and confidential results."
        : "Découvrez votre note d'attractivité avec notre IA entraînée sur des milliers de visages. Résultats instantanés et confidentiels.",
      siteName: "face10ai",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isEnglish ? "face10ai - AI Beauty Face Analysis" : "face10ai - Analyse IA de beauté faciale",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isEnglish
        ? "face10ai.com - AI Face Attractiveness Analysis"
        : "face10ai.com - Analyse IA de votre attractivité faciale",
      description: isEnglish
        ? "Discover your attractiveness score with our AI. Try for free!"
        : "Découvrez votre note d'attractivité avec notre IA. Testez gratuitement!",
      images: ["/og-image.png"],
      creator: "@face10ai",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'fr': '/fr',
      },
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

// JSON-LD structured data for SEO (static content, safe for injection)
function getJsonLd(locale: string) {
  const isEnglish = locale === 'en';
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "face10ai",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description: isEnglish
      ? "Facial attractiveness analysis application using artificial intelligence"
      : "Application d'analyse de l'attractivité faciale utilisant l'intelligence artificielle",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: isEnglish ? "5 free analyses per month" : "5 analyses gratuites par mois",
    },
    featureList: isEnglish
      ? [
          "AI facial analysis",
          "Attractiveness score from 1 to 10",
          "Based on symmetry and golden ratio",
          "Instant results",
          "Privacy guaranteed",
        ]
      : [
          "Analyse faciale par IA",
          "Score d'attractivité de 1 à 10",
          "Basé sur la symétrie et le nombre d'or",
          "Résultats instantanés",
          "Confidentialité garantie",
        ],
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages for the current locale
  const messages = await getMessages();

  const jsonLd = getJsonLd(locale);

  return (
    <html lang={locale} className="dark">
      <head>
        <script
          type="application/ld+json"
          // Safe: jsonLd is generated from static server-side values, not user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${poppins.className} min-h-screen`}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
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

              {/* Taller Triangle Glow Effect */}
              <div className="absolute inset-x-0 top-[-80px] z-0 flex justify-center">
                <div
                  className="w-0 h-0
                    border-l-[450px] border-l-transparent
                    border-r-[450px] border-r-transparent
                    border-b-[900px] border-b-[#5B698B]/40
                    blur-[100px]
                    opacity-50"
                />
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
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
