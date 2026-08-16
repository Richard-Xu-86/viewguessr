import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ViewGuessr Devine les vues des vidéos YouTube",
    short_name: "ViewGuessr",
    description:
      "Le jeu gratuit où tu devines le nombre de vues de vraies vidéos YouTube. Solo et multijoueur, en français.",
    start_url: "/",
    display: "standalone",
    lang: "fr",
    dir: "ltr",
    background_color: "#F5F6FB",
    theme_color: "#EF233C",
    categories: ["games", "entertainment"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
