import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Combien sur 10 - Découvrez votre note d'attractivité",
  description: "Analysez votre visage avec notre algorithme IA avancé et découvrez votre note d'attractivité sur 10. Analyse basée sur la symétrie faciale, les proportions et le nombre d'or.",
  keywords: ["attractivité", "beauté", "analyse visage", "IA", "test attractivité", "note beauté"],
  authors: [{ name: "Combien sur 10" }],
  openGraph: {
    title: "Combien sur 10 - Découvrez votre note d'attractivité",
    description: "Analysez votre visage avec notre algorithme IA avancé",
    url: "https://combiensur10.fr",
    siteName: "Combien sur 10",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Combien sur 10 - Découvrez votre note d'attractivité",
    description: "Analysez votre visage avec notre algorithme IA avancé",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} antialiased`}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
