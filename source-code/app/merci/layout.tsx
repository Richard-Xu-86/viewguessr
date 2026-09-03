import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Thanks for your purchase — your ViewGuessr lifetime access is active.",
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
