import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partie solo",
  description:
    "Joue à ViewGuessr en solo : une vraie vidéo YouTube tendance s'affiche, son compteur de vues masqué, et tu devines le nombre de vues manche après manche. Gratuit, sans inscription.",
  alternates: { canonical: "/play/solo" },
  openGraph: {
    title: "Partie solo · ViewGuessr",
    description:
      "Devine le nombre de vues de vraies vidéos YouTube, manche après manche. Mode solo de ViewGuessr.",
    url: "/play/solo",
  },
};

export default function SoloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
