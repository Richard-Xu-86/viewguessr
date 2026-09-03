import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solo game",
  description:
    "Play ViewGuessr solo: a real trending YouTube video appears with its view count hidden, and you guess the number of views round after round. Free, no sign-up.",
  alternates: { canonical: "/play/solo" },
  openGraph: {
    title: "Solo game · ViewGuessr",
    description:
      "Guess the view count of real YouTube videos, round after round. The ViewGuessr solo mode.",
    url: "/play/solo",
  },
};

export default function SoloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
