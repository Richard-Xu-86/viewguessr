import { PUBLISHER } from "@/lib/publisher";
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
    default: "ViewGuessr — Guess the YouTube Views Game",
    template: "%s · ViewGuessr",
  },
  description:
    "ViewGuessr is the free game where you guess the view count of real trending YouTube videos. Play solo, or take on your friends in multiplayer with a game code. No sign-up needed.",
  applicationName: "ViewGuessr",
  authors: [{ name: PUBLISHER.tradingName }],
  creator: PUBLISHER.tradingName,
  publisher: PUBLISHER.tradingName,
  category: "game",
  keywords: [
    "ViewGuessr",
    "guess the YouTube views",
    "YouTube views game",
    "free YouTube game",
    "YouTube video quiz",
    "guess the view count",
    "online multiplayer game",
    "trending YouTube videos",
    "guessing game no sign up",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "fr-FR": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    url: SITE_URL,
    siteName: "ViewGuessr",
    title: "ViewGuessr — Guess the YouTube Views Game",
    description:
      "The free game where you guess the view count of real trending YouTube videos. Solo and multiplayer. Take on your friends with a game code.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ViewGuessr — Guess the YouTube Views Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViewGuessr — Guess the YouTube Views Game",
    description:
      "Guess the view count of real trending YouTube videos. Solo and multiplayer, no sign-up.",
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
    <html lang="en">
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
