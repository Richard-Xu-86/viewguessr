import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accès à vie",
  description:
    "Débloque ViewGuessr en accès à vie pour 5,99 $ CA en paiement unique, sans abonnement : parties solo illimitées et multijoueur sans limite (jusqu'à 10 joueurs). Soutiens un créateur indépendant.",
  alternates: { canonical: "/pro" },
  openGraph: {
    title: "Accès à vie · ViewGuessr",
    description:
      "5,99 $ CA en paiement unique, sans abonnement : jeu illimité, multijoueur jusqu'à 10 joueurs.",
    url: "/pro",
  },
};

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
