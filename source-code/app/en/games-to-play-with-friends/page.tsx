import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/seo/ContentShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faq } from "@/components/seo/Faq";
import { ArticleLd } from "@/components/seo/ArticleLd";

export const metadata: Metadata = {
  title: "Online Games to Play With Friends (No Sign-Up)",
  description:
    "A hand-picked list of free online games to play with friends — no sign-up, no download. Starting with ViewGuessr, where you guess the views of real YouTube videos in multiplayer.",
  keywords: [
    "games to play with friends",
    "online games with friends",
    "games to play with friends online free",
    "no sign up games",
    "browser multiplayer games",
    "games to play over discord",
    "party games online",
  ],
  alternates: {
    canonical: "/en/games-to-play-with-friends",
    languages: {
      "en-US": "/en/games-to-play-with-friends",
      "fr-FR": "/jeux-entre-potes",
      "x-default": "/en/games-to-play-with-friends",
    },
  },
  openGraph: {
    title: "Online Games to Play With Friends (No Sign-Up) · ViewGuessr",
    description:
      "Free online games to play with friends, no sign-up. With ViewGuessr in multiplayer.",
    url: "/en/games-to-play-with-friends",
    type: "article",
  },
};

const GAMES: {
  name: string;
  tag: string;
  href?: string | null;
  internal?: boolean;
  desc: string;
}[] = [
  {
    name: "ViewGuessr",
    tag: "Our game",
    href: "/multiplayer",
    internal: true,
    desc: "Guess the view count of real trending YouTube videos. Create a room, share a 6-letter code, and everyone plays the same videos. Up to 10 players, real time, no sign-up.",
  },
  {
    name: "Skribbl",
    tag: "Drawing",
    desc: "Online Pictionary: one person draws a word, the rest race to guess it. Perfect over voice chat — quick rounds, lots of laughs.",
  },
  {
    name: "Gartic Phone",
    tag: "Chaos",
    desc: "Telephone meets drawing: a sentence becomes a drawing, which becomes a sentence again. The final result is never what you expected.",
  },
  {
    name: "Among Us",
    tag: "Bluffing",
    desc: "Find the impostor aboard a spaceship. The social-deduction game that works just as well with 4 players as with 10.",
  },
  {
    name: "GeoGuessr",
    tag: "Geography",
    href: "/en/guessr-games",
    internal: true,
    desc: "The pioneer of the « guessr » genre: dropped somewhere on Street View, guess where you are. The game that inspired a whole category — including ViewGuessr.",
  },
  {
    name: "Codenames",
    tag: "Words",
    desc: "Two teams, one-word clues, secret agents to find in a grid. Great for groups that like to think together.",
  },
];

export default function Page() {
  return (
    <ContentShell locale="en" altHref="/jeux-entre-potes">
      <ArticleLd
        path="/en/games-to-play-with-friends"
        locale="en"
        headline="Online Games to Play With Friends (No Sign-Up)"
        description="A hand-picked list of free online games to play with friends, no sign-up, including ViewGuessr in multiplayer."
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/en" },
          { name: "Guides", href: "/en/games-to-play-with-friends" },
          { name: "Games with friends", href: "/en/games-to-play-with-friends" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-5 py-8">
        <span className="sticker -rotate-2">Guide · game nights</span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-platinum sm:text-5xl">
          Online games to play <span className="hl-red">with friends</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-lavender">
          A long-distance hangout, a voice call that won't end, or just the urge
          to roast each other: here are the best online games to play with
          friends, <strong className="text-platinum">free and with no
          sign-up</strong>. We start with ours — ViewGuessr — then give you an
          honest pick of crowd-pleasers.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/multiplayer" className="btn-ink px-6 py-3">
            Create a multiplayer game
          </Link>
          <Link href="/en" className="btn-paper px-6 py-3">
            Discover ViewGuessr
          </Link>
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          ViewGuessr: guess the views, together
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          <Link href="/en" className="font-semibold text-crimson hover:underline">
            ViewGuessr
          </Link>{" "}
          is a game where you guess the view count of real trending YouTube
          videos. In multiplayer it's a great group game: the host creates a room,
          picks a theme (gaming, music, sport…) and a language, then shares a{" "}
          <strong className="text-platinum">6-letter code</strong>. Everyone gets
          the same videos, places their slider, and whoever lands closest to the
          real number scores the most. The leaderboard updates live, up to 10
          players.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-lavender">
          No account, no download, nothing to install: a link, a code, and you're
          playing. That's what makes it ideal when you're already on a Discord
          call and want to start something in ten seconds.
        </p>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          Our pick of games to play with friends
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {GAMES.map((g) => (
            <div key={g.name} className="card-ink rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-platinum">
                  {g.name}
                </h3>
                <span className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2 py-0.5 text-[11px] font-bold text-platinum">
                  {g.tag}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-lavender">{g.desc}</p>
              {g.internal && g.href && (
                <Link
                  href={g.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-crimson hover:underline"
                >
                  {g.name === "ViewGuessr" ? "Create a game" : "Learn more"}
                  <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 card-ink rounded-2xl p-7 text-center">
          <h2 className="font-display text-2xl font-bold text-platinum">
            Ready to start a game?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-lavender">
            Create a room, share the code, and take on your friends on real
            YouTube videos. Free, no sign-up.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/multiplayer" className="btn-ink px-7 py-3.5">
              Play multiplayer
            </Link>
            <Link href="/play/solo" className="btn-paper px-7 py-3.5">
              Try solo
            </Link>
          </div>
        </div>
      </article>

      <Faq
        heading="Frequently asked questions"
        items={[
          {
            q: "What online game can I play with friends without installing anything?",
            a: "ViewGuessr runs right in your browser with no account or download: the host creates a room and shares a 6-letter code. Skribbl, Gartic Phone and Codenames also work with no installation.",
          },
          {
            q: "How many people can play ViewGuessr together?",
            a: "Up to 10 players in one multiplayer game. One free multiplayer game per day is included; lifetime access (€3.99, one-time) unlocks unlimited multiplayer.",
          },
          {
            q: "Are these games free?",
            a: "Yes. ViewGuessr is free with daily games included, as are Skribbl, Gartic Phone and Among Us. None require a subscription to play with friends.",
          },
          {
            q: "Can we play while on a Discord call?",
            a: "Absolutely. ViewGuessr is a lightweight browser game, so you can stay in Discord voice and drop the game code in the text channel for everyone to join.",
          },
        ]}
      />
    </ContentShell>
  );
}
