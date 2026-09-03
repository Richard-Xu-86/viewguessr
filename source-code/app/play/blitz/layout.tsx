import type { Metadata } from "next";

// Mode Blitz retiré : page non indexée (redirige vers l'accueil).
export const metadata: Metadata = {
  title: "Unavailable",
  robots: { index: false, follow: false },
};

export default function BlitzLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
