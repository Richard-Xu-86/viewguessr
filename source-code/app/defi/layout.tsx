import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Défi du jour",
  description:
    "Le défi quotidien de ViewGuessr : 5 vidéos YouTube, les mêmes pour tout le monde, une seule tentative par jour. Bats ton score, garde ta série et partage ton résultat.",
  alternates: { canonical: "/defi" },
};

export default function DefiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
