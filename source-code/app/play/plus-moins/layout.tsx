import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Higher or Lower",
  description:
    "Two YouTube videos head to head: which one has more views? Build the longest streak you can — one mistake and it's over. A ViewGuessr lifetime-access exclusive.",
  alternates: { canonical: "/play/plus-moins" },
  openGraph: {
    title: "Higher or Lower · ViewGuessr",
    description:
      "Two YouTube videos head to head: which one has more views? Build the longest streak you can.",
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
