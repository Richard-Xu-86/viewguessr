import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multiplayer",
  description:
    "Take on your friends in real time on ViewGuessr: create or join a game with a code, guess the views of real YouTube videos together and follow the live leaderboard.",
  alternates: { canonical: "/multiplayer" },
  openGraph: {
    title: "Multiplayer · ViewGuessr",
    description:
      "Create a game, share the code and take on your friends in real time on ViewGuessr.",
    url: "/multiplayer",
  },
};

export default function MultiplayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
