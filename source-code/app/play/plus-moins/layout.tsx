import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plus ou moins",
  description:
    "Deux vidéos YouTube face à face : laquelle fait le plus de vues ? Enchaîne la plus longue série possible — une erreur et c'est fini. Mode exclusif de l'accès à vie ViewGuessr.",
  alternates: { canonical: "/play/plus-moins" },
  openGraph: {
    title: "Plus ou moins · ViewGuessr",
    description:
      "Deux vidéos YouTube face à face : laquelle fait le plus de vues ? Enchaîne la plus longue série possible.",
    url: "/play/plus-moins",
  },
};

export default function PlusMoinsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
