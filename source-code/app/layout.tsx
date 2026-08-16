import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { ProSync } from "@/components/ProSync";
import { LocaleProvider } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = "https://view-guessr.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ViewGuessr — Devine les vues des vidéos YouTube",
    template: "%s · ViewGuessr",
  },
  description:
    "ViewGuessr, le jeu gratuit où tu devines le nombre de vues de vraies vidéos YouTube tendance. Joue en solo ou en multijoueur contre tes amis avec un code de partie. Sans inscription, en français.",
  applicationName: "ViewGuessr",
  authors: [{ name: "PENRA" }],
  creator: "PENRA",
  publisher: "PENRA",
  category: "game",
  keywords: [
    "ViewGuessr",
    "deviner les vues YouTube",
    "jeu vues YouTube",
    "jeu YouTube gratuit",
    "quiz vidéos YouTube",
    "deviner le nombre de vues",
    "jeu vidéo français",
    "jeu multijoueur en ligne",
    "vidéos tendance YouTube",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
      "en-US": "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "ViewGuessr",
    title: "ViewGuessr Devine les vues des vidéos YouTube",
    description:
      "Le jeu gratuit où tu devines le nombre de vues de vraies vidéos YouTube. Solo et multijoueur. Affronte tes amis avec un code de partie.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ViewGuessr Devine les vues des vidéos YouTube",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViewGuessr Devine les vues des vidéos YouTube",
    description:
      "Devine le nombre de vues de vraies vidéos YouTube. Solo et multijoueur, en français et sans inscription.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Vérification Google Search Console (balise HTML). Le token n'est pas secret
  // (il est public dans le HTML). Surchargeable via GOOGLE_SITE_VERIFICATION.
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      "WU-3L-pnsrFdkyY2r_tRqOjpBEBF5HkKYVatM3ach7o",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <JsonLd />
        <ProSync />
        <LocaleProvider>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
