import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multijoueur",
  description:
    "Affronte tes amis en temps réel sur ViewGuessr : crée ou rejoins une partie avec un code, devinez ensemble les vues de vraies vidéos YouTube et suivez le classement en direct.",
  alternates: { canonical: "/multiplayer" },
  openGraph: {
    title: "Multijoueur · ViewGuessr",
    description:
      "Crée une partie, partage le code et affronte tes amis en temps réel sur ViewGuessr.",
    url: "/multiplayer",
  },
};

export default function MultiplayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
