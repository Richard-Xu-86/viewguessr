import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merci",
  description: "Merci pour ton achat ton accès à vie ViewGuessr est activé.",
  alternates: { canonical: "/merci" },
  robots: { index: false, follow: false },
};

export default function MerciLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
