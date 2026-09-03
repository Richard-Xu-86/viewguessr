import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lifetime access",
  description:
    "Unlock ViewGuessr for life with a one-time CA$5.99 payment, no subscription: unlimited solo games and unlimited multiplayer (up to 10 players). Support an independent creator.",
  alternates: { canonical: "/pro" },
  openGraph: {
    title: "Lifetime access · ViewGuessr",
    description:
      "CA$5.99, one-time payment, no subscription: unlimited play, multiplayer up to 10 players.",
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
