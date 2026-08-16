import type { MetadataRoute } from "next";

const SITE_URL = "https://view-guessr.com";

/** Paires de pages traduites → balises hreflang dans le sitemap. */
const alt = (fr: string, en: string) => ({
  languages: {
    "fr-FR": `${SITE_URL}${fr}`,
    "en-US": `${SITE_URL}${en}`,
    "x-default": `${SITE_URL}${fr}`,
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    // --- Accueil + équivalent EN ---------------------------------------
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
      alternates: alt("/", "/en"),
    },
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: alt("/", "/en"),
    },

    // --- Contenu SEO (guides) FR + EN ----------------------------------
    {
      url: `${SITE_URL}/jeux-entre-potes`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: alt("/jeux-entre-potes", "/en/games-to-play-with-friends"),
    },
    {
      url: `${SITE_URL}/en/games-to-play-with-friends`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: alt("/jeux-entre-potes", "/en/games-to-play-with-friends"),
    },
    {
      url: `${SITE_URL}/c-est-quoi-un-guessr`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: alt("/c-est-quoi-un-guessr", "/en/guessr-games"),
    },
    {
      url: `${SITE_URL}/en/guessr-games`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: alt("/c-est-quoi-un-guessr", "/en/guessr-games"),
    },

    // --- Modes de jeu --------------------------------------------------
    {
      url: `${SITE_URL}/defi`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/play/solo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/play/plus-moins`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/multiplayer`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/pro`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // --- Légal ---------------------------------------------------------
    {
      url: `${SITE_URL}/mentions-legales`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/cgu`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
