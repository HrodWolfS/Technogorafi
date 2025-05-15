import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import ReadingProgress from "@/components/ReadingProgress";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { IBM_Plex_Sans, Inter, Permanent_Marker } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Technogorafi",
  description: "Le site d'actualités tech qui n'existe pas",
  metadataBase: new URL("https://technogorafi.vercel.app"),
  keywords: [
    "tech",
    "actualités",
    "satire",
    "humour",
    "technologie",
    "innovation",
  ],
  authors: [{ name: "TechnoGorafi" }],
  openGraph: {
    title: "TechnoGorafi",
    description: "Toute la tech. Aucun effort de vérification.",
    url: "https://technogorafi.vercel.app",
    siteName: "TechnoGorafi",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://technogorafi.vercel.app/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "TechnoGorafi - Le site d'actualités tech satirique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechnoGorafi",
    description: "Toute la tech. Aucun effort de vérification.",
    images: ["https://technogorafi.vercel.app/images/og-default.jpg"],
  },
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
};

export const viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "TechnoGorafi",
              description: "Toute la tech. Aucun effort de vérification.",
              url: "https://technogorafi.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://technogorafi.vercel.app/articles?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              sameAs: [
                "https://twitter.com/technogorafi",
                // Ajoute tes autres réseaux sociaux ici
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${ibmPlex.variable} ${inter.variable} ${permanentMarker.variable} font-inter bg-background`}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <PageTransition>{children}</PageTransition>
                <ReadingProgress />
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </Providers>
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  );
}
