import { PUBLISHER } from "@/lib/publisher";

const SITE_URL = "https://view-guessr.com";

/**
 * Données structurées Schema.org (JSON-LD) injectées sur toutes les pages
 * via le layout racine. Décrit le site, l'éditeur et le jeu ViewGuessr
 * pour aider Google à comprendre et à afficher des rich results.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "ViewGuessr",
        alternateName: ["View Guessr", "viewguessr", "view guessr"],
        url: SITE_URL,
        inLanguage: "en-US",
        description:
          "Free game where you guess the view count of real trending YouTube videos.",
        publisher: { "@id": `${SITE_URL}/#publisher` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#publisher`,
        name: PUBLISHER.tradingName,
        legalName: PUBLISHER.legalName,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        founder: { "@type": "Person", name: PUBLISHER.legalName },
        address: {
          "@type": "PostalAddress",
          addressLocality: PUBLISHER.city,
          addressRegion: PUBLISHER.region,
          addressCountry: PUBLISHER.countryCode,
        },
      },
      {
        "@type": ["VideoGame", "SoftwareApplication"],
        "@id": `${SITE_URL}/#game`,
        name: "ViewGuessr",
        alternateName: ["View Guessr", "view guessr"],
        url: SITE_URL,
        description:
          "ViewGuessr is a game where you guess the view count of real YouTube videos. Solo and online multiplayer modes.",
        image: `${SITE_URL}/logo.png`,
        inLanguage: ["en", "fr"],
        applicationCategory: "GameApplication",
        genre: ["Guessing game", "Party game", "Trivia"],
        operatingSystem: "Web",
        gamePlatform: ["Web browser"],
        playMode: ["SinglePlayer", "MultiPlayer"],
        numberOfPlayers: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 10,
        },
        author: { "@id": `${SITE_URL}/#publisher` },
        publisher: { "@id": `${SITE_URL}/#publisher` },
        offers: {
          "@type": "Offer",
          name: "Lifetime access",
          price: "5.99",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          category: "One-time payment",
          url: `${SITE_URL}/pro`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
