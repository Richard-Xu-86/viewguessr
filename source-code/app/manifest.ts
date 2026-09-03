import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ViewGuessr — Guess the YouTube Views Game",
    short_name: "ViewGuessr",
    description:
      "The free game where you guess the view count of real YouTube videos. Solo and multiplayer.",
    start_url: "/",
    display: "standalone",
    lang: "en",
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
