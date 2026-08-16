import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon espace",
  description:
    "Ton tableau de bord ViewGuessr : profil, statistiques, parties gratuites du jour et reprise de partie multijoueur.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
