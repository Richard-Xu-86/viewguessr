const SITE_URL = "https://view-guessr.com";

/**
 * Données structurées Article (JSON-LD) pour une page de contenu / guide.
 * Relie l'article à l'éditeur PENRA et au site, en plus du graph global
 * (WebSite / Organization / VideoGame) déjà injecté par <JsonLd/>.
 */
export function ArticleLd({
  path,
  headline,
  description,
  locale,
  datePublished = "2026-06-14",
  dateModified,
}: {
  path: string;
  headline: string;
  description: string;
  locale: "fr" | "en";
  datePublished?: string;
  dateModified?: string;
}) {
  const url = `${SITE_URL}${path}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: `${SITE_URL}/logo.png`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Organization", name: "PENRA", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "PENRA",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#game` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
