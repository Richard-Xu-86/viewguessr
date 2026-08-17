import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/seo/ContentShell";
import { Faq } from "@/components/seo/Faq";
import { ArticleLd } from "@/components/seo/ArticleLd";

export const metadata: Metadata = {
  title: "ViewGuessr — Guess the YouTube Views Game",
  description:
    "ViewGuessr is the free game where you guess the view count of real trending YouTube videos. Play solo or challenge friends in multiplayer with a game code. No sign-up.",
  keywords: [
    "viewguessr",
    "guess the youtube views",
    "youtube views game",
    "guess the views game",
    "youtube guessing game",
    "guess youtube view count",
    "online game no sign up",
  ],
  alternates: {
    canonical: "/en",
    languages: {
      "en-US": "/en",
      "fr-FR": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "ViewGuessr — Guess the YouTube Views Game",
    description:
      "The free game where you guess the view count of real trending YouTube videos. Solo and multiplayer, no sign-up.",
    url: "/en",
    type: "website",
  },
};

const STEPS = [
  {
    n: "01",
    title: "Watch the video",
    desc: "A real trending YouTube video appears — thumbnail, title, channel. Its view counter is hidden.",
  },
  {
    n: "02",
    title: "Guess the views",
    desc: "Slide to the number of views you think it has, anywhere from 1,000 to 1 billion.",
  },
  {
    n: "03",
    title: "Score points",
    desc: "The closer you are, the more you score. 5,000 points for a perfect call, zero for a wipeout.",
  },
];

export default function Page() {
  return (
    <ContentShell locale="en" altHref="/">
      <ArticleLd
        path="/en"
        locale="en"
        headline="ViewGuessr — Guess the YouTube Views Game"
        description="The free online game where you guess the view count of real trending YouTube videos. Solo and multiplayer, no sign-up."
      />

      <article className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="sticker -rotate-2">Trending live</span>
          <span className="sticker rotate-1">No sign-up</span>
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight text-platinum sm:text-6xl">
          Guess the <span className="hl-red">YouTube views</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-lavender">
          <span className="font-accent text-xl text-platinum">
            How many views does this video have?
          </span>{" "}
          ViewGuessr is the free game where you guess the view count of real
          trending YouTube videos. Play solo to beat your record, or challenge
          your friends in real time — no account, no download.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/play/solo" className="btn-ink px-7 py-3.5 text-base">
            Play solo →
          </Link>
          <Link href="/multiplayer" className="btn-paper px-7 py-3.5 text-base">
            Multiplayer
          </Link>
        </div>

        <h2 className="mt-16 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          How to play, in three steps
        </h2>
        <div className="mt-8 grid gap-6 border-t-2 border-platinum/15 pt-8 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n}>
              <div className="font-display text-5xl font-bold leading-none text-platinum/10">
                {s.n}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-platinum">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-lavender">{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          Four ways to play
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Link href="/defi" className="card-ink block rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-platinum">
              Daily challenge
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-lavender">
              The same five videos for everyone, one attempt per day. Compare your
              score with friends.
            </p>
          </Link>
          <Link href="/play/solo" className="card-ink block rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-platinum">Solo</h3>
            <p className="mt-2 text-sm leading-relaxed text-lavender">
              Five rounds against yourself. Pick the theme and language of the
              videos, and beat your record.
            </p>
          </Link>
          <Link href="/play/plus-moins" className="card-ink block rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-platinum">
              Higher or Lower
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-lavender">
              Two videos face to face: which one has more views? One mistake and
              the streak ends.
            </p>
          </Link>
          <Link href="/multiplayer" className="card-ink block rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-platinum">
              Multiplayer
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-lavender">
              Create a room, share a 6-letter code, and settle it on the same
              videos. Up to 10 players in real time.
            </p>
          </Link>
        </div>

        <h2 className="mt-16 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          What makes ViewGuessr different
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          Most «&nbsp;guess the views&nbsp;» games are{" "}
          <em className="font-accent">higher or lower</em>: you only pick which of
          two videos is bigger. ViewGuessr asks for the{" "}
          <strong className="text-platinum">actual number</strong> — you place a
          slider on the real view count, so a great guess takes real intuition.
          The videos are <strong className="text-platinum">live YouTube
          trends</strong> across 10 countries and 8 languages, never made-up
          numbers. And the multiplayer is built for friends: one shareable code,
          up to 10 players, live ranking, and{" "}
          <strong className="text-platinum">no sign-up</strong>.
        </p>

        <div className="mt-10 card-ink rounded-2xl p-7 text-center">
          <h2 className="font-display text-2xl font-bold text-platinum">
            Ready to guess?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-lavender">
            Start a game in one click. No account required.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/play/solo" className="btn-ink px-7 py-3.5">
              Play now
            </Link>
            <Link
              href="/en/games-to-play-with-friends"
              className="btn-paper px-7 py-3.5"
            >
              Games with friends
            </Link>
          </div>
        </div>
      </article>

      <Faq
        heading="Frequently asked questions"
        items={[
          {
            q: "What is ViewGuessr?",
            a: "ViewGuessr is a free online game where you guess the view count of real trending YouTube videos. You place a slider on the number of views you think a video has; the closer you are, the more points you score. Play solo or in multiplayer.",
          },
          {
            q: "Is ViewGuessr free?",
            a: "Yes. ViewGuessr is free to play with daily games included, and no account is required. An optional lifetime access (CA$5.99, one-time payment) unlocks unlimited solo and multiplayer plus the Higher or Lower mode.",
          },
          {
            q: "Do I need an account to play?",
            a: "No. There is no sign-up and no download. You open the site and play immediately — in solo, or by sharing a 6-letter code for multiplayer.",
          },
          {
            q: "How is it different from a higher-or-lower views game?",
            a: "In higher-or-lower games you only choose which of two videos has more views. ViewGuessr asks for the exact number on a slider, which rewards real intuition. It also includes a Higher or Lower mode if you prefer that format.",
          },
        ]}
      />
    </ContentShell>
  );
}
