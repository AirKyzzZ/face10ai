import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
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
