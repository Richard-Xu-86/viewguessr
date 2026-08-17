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
        inLanguage: "fr-FR",
        description:
          "Jeu gratuit où l'on devine le nombre de vues de vraies vidéos YouTube tendance.",
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
          "ViewGuessr est un jeu français où l'on devine le nombre de vues de vraies vidéos YouTube. Modes solo et multijoueur en ligne.",
        image: `${SITE_URL}/logo.png`,
        inLanguage: ["fr", "en"],
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
          name: "Accès à vie",
          price: "3.99",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          category: "Paiement unique",
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
