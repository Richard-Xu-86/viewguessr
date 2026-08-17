import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/seo/ContentShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faq } from "@/components/seo/Faq";
import { ArticleLd } from "@/components/seo/ArticleLd";

export const metadata: Metadata = {
  title: "What Is a Guessr Game? (GeoGuessr, ViewGuessr & more)",
  description:
    "A « guessr » is a game where you guess a hidden value from clues — a location, a view count, a price. Where the genre comes from, examples (GeoGuessr, ViewGuessr) and alternatives.",
  keywords: [
    "guessr games",
    "what is a guessr",
    "guessr game",
    "games like geoguessr",
    "geoguessr alternative",
    "free geoguessr alternative",
    "viewguessr",
    "guessing games online",
  ],
  alternates: {
    canonical: "/en/guessr-games",
    languages: {
      "en-US": "/en/guessr-games",
      "fr-FR": "/c-est-quoi-un-guessr",
      "x-default": "/en/guessr-games",
    },
  },
  openGraph: {
    title: "What Is a Guessr Game? · ViewGuessr",
    description:
      "The « guessr » genre explained: guess a hidden value from clues. From GeoGuessr to ViewGuessr.",
    url: "/en/guessr-games",
    type: "article",
  },
};

const FAMILY: {
  name: string;
  what: string;
  desc: string;
  internal?: string;
}[] = [
  {
    name: "GeoGuessr",
    what: "Guess a place",
    desc: "You're dropped onto Google Street View, anywhere on Earth. From road signs, vegetation and architecture, you place a pin on the map. The closer you are, the more you score. It's the game that popularized the « -guessr » suffix.",
  },
  {
    name: "ViewGuessr",
    what: "Guess the views",
    desc: "A real trending YouTube video appears with its view counter hidden. You estimate its view count on a scale from 1,000 to 1 billion. Here the clues are the thumbnail, title and channel. Solo or multiplayer.",
    internal: "/en",
  },
  {
    name: "Higher or Lower games",
    what: "More or less",
    desc: "The minimalist take on the genre: two items side by side — which has the bigger value (views, Google searches, subscribers)? One wrong answer ends the streak. ViewGuessr includes a Higher or Lower mode.",
    internal: "/play/plus-moins",
  },
];

export default function Page() {
  return (
    <ContentShell locale="en" altHref="/c-est-quoi-un-guessr">
      <ArticleLd
        path="/en/guessr-games"
        locale="en"
        headline="What Is a Guessr Game?"
        description="The « guessr » genre explained: guess a hidden value from clues. Origins, examples (GeoGuessr, ViewGuessr) and alternatives."
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/en" },
          { name: "Guides", href: "/en/games-to-play-with-friends" },
          { name: "Guessr games", href: "/en/guessr-games" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-5 py-8">
        <span className="sticker rotate-1">Guide · the « guessr » genre</span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-platinum sm:text-5xl">
          What is a <span className="hl-red">« guessr »</span> game?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-lavender">
          A <strong className="text-platinum">« guessr »</strong> (from{" "}
          <em className="font-accent">to guess</em>) is a type of game where you{" "}
          <strong className="text-platinum">estimate a hidden value from
          clues</strong>: a location, a number of views, a price, a date. There's
          no single right answer to stumble onto — a good score rewards how close
          your estimate is.
        </p>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          Where the word « guessr » comes from
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          The term comes from <strong className="text-platinum">GeoGuessr</strong>,
          released in 2013, which asked you to guess a location from a Street View
          shot. The game's success turned its «&nbsp;-guessr&nbsp;» suffix into a
          genre name: today, «&nbsp;guessr&nbsp;» refers to any version of the same
          idea applied to a different kind of data. Guess a place, guess the views,
          guess a price — same mechanic, a slider or a map each time, and a
          proximity-based score.
        </p>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          The guessr family
        </h2>
        <div className="mt-8 space-y-5">
          {FAMILY.map((g) => (
            <div key={g.name} className="card-ink rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-platinum">
                  {g.name}
                </h3>
                <span className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2 py-0.5 text-[11px] font-bold text-platinum">
                  {g.what}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-lavender">{g.desc}</p>
              {g.internal && (
                <Link
                  href={g.internal}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-crimson hover:underline"
                >
                  Play now <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          A free GeoGuessr alternative?
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          If you're after a guessr that's free, sign-up-free and playable with
          friends, <Link href="/en" className="font-semibold text-crimson hover:underline">ViewGuessr</Link>{" "}
          applies the exact GeoGuessr recipe to a playground everyone knows:
          YouTube. The same «&nbsp;so close!&nbsp;» feeling, but in seconds per
          round and without creating an account. It's also a great starting point
          for{" "}
          <Link
            href="/en/games-to-play-with-friends"
            className="font-semibold text-crimson hover:underline"
          >
            playing online with friends
          </Link>
          .
        </p>

        <div className="mt-10 card-ink rounded-2xl p-7 text-center">
          <h2 className="font-display text-2xl font-bold text-platinum">
            Try the YouTube-views guessr
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-lavender">
            One video, one slider, your gut feeling. Free and no sign-up.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/play/solo" className="btn-ink px-7 py-3.5">
              Play now
            </Link>
            <Link href="/multiplayer" className="btn-paper px-7 py-3.5">
              Challenge friends
            </Link>
          </div>
        </div>
      </article>

      <Faq
        heading="Frequently asked questions about guessr games"
        items={[
          {
            q: "What does « guessr » mean?",
            a: "« Guessr » comes from the verb to guess. It has become the name of a game genre where you estimate a hidden value from clues — a location, a view count, a price — with a score based on how close you are to the right answer.",
          },
          {
            q: "What games are like GeoGuessr?",
            a: "GeoGuessr (guess a location), ViewGuessr (guess a YouTube video's views) and Higher-or-Lower games share the same mechanic. ViewGuessr is a free, sign-up-free alternative you can also play in multiplayer.",
          },
          {
            q: "Is ViewGuessr free like GeoGuessr?",
            a: "ViewGuessr is free and plays with no sign-up, with daily games included. An optional lifetime access at CA$5.99 (one-time payment) unlocks unlimited modes and multiplayer.",
          },
          {
            q: "Do I need an account to play a guessr?",
            a: "It depends on the game. ViewGuessr needs no account or download: you land on the site and play right away, solo or via a game code in multiplayer.",
          },
        ]}
      />
    </ContentShell>
  );
}
