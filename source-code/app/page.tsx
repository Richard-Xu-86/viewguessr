"use client";

import { PUBLISHER } from "@/lib/publisher";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { LiveActivity } from "@/components/LiveActivity";
import { liveStreak } from "@/lib/daily";
import { Logo, Wordmark } from "@/components/Logo";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { TrendingMarquee } from "@/components/TrendingMarquee";
import { HeroPreview } from "@/components/HeroPreview";
import { Reveal } from "@/components/Reveal";
import { Offers } from "@/components/Offers";
import { LanguageToggle } from "@/components/LanguageToggle";
import { StreakBadge } from "@/components/StreakBadge";
import { useT, useLocale } from "@/lib/i18n";

// Modes de jeu listés à droite, juste avant « Pro ».
const NAV_ITEMS = [
  { key: "nav.howto", url: "#comment", icon: "play" },
  { key: "nav.offers", url: "#offres", icon: "award" },
  { key: "nav.defi", url: "/defi", icon: "bolt" },
  { key: "nav.solo", url: "/play/solo", icon: "target" },
  { key: "nav.plusmoins", url: "/play/plus-moins", icon: "sliders" },
  { key: "nav.multi", url: "/multiplayer", icon: "users" },
  { key: "nav.pro", url: "/pro", icon: "sparkle" },
];

// En-tête de section éditorial : numéro + titre alignés à gauche + filet.
function SectionHead({
  index,
  title,
  sub,
}: {
  index: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-end gap-4">
        <span className="font-display text-sm font-bold text-crimson">
          ({index})
        </span>
        <h2 className="font-display text-3xl font-bold leading-none tracking-tight text-platinum sm:text-5xl">
          {title}
        </h2>
        <span className="mb-1.5 hidden h-[2px] flex-1 bg-platinum/15 sm:block" />
      </div>
      {sub && <p className="mt-3 max-w-xl text-lavender">{sub}</p>}
    </Reveal>
  );
}

// Compteur « odomètre » décoratif : des chiffres, dont un masqué — le motif du jeu.
function Odometer({ label }: { label: string }) {
  const cells = ["4", "7", "?", "2", "9", "0", "8"];
  return (
    <div className="flex items-center gap-2">
      <div className="flex overflow-hidden rounded-lg border-2 border-platinum shadow-hard-sm">
        {cells.map((c, i) => (
          <span
            key={i}
            className={`flex h-9 w-7 items-center justify-center font-display text-lg font-bold tabular-nums ${
              c === "?"
                ? "bg-gradient-to-b from-strawberry to-crimson text-white"
                : "border-r-2 border-platinum/15 bg-white text-platinum last:border-r-0"
            }`}
          >
            {c}
          </span>
        ))}
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-lavender">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  const t = useT();
  const { locale } = useLocale();
  const guideFriends =
    locale === "en" ? "/en/games-to-play-with-friends" : "/jeux-entre-potes";
  const guideGuessr =
    locale === "en" ? "/en/guessr-games" : "/c-est-quoi-un-guessr";
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    setStreak(liveStreak());
  }, []);

  const navItems = NAV_ITEMS.map((it) => ({
    name: t(it.key),
    url: it.url,
    icon: it.icon,
  }));

  const STEPS = [
    { n: "01", title: t("home.step1.title"), desc: t("home.step1.desc") },
    { n: "02", title: t("home.step2.title"), desc: t("home.step2.desc") },
    { n: "03", title: t("home.step3.title"), desc: t("home.step3.desc") },
  ];

  return (
    <main className="relative min-h-dvh">
      <Aurora />

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b-2 border-platinum/10 bg-[#FAF7F0]/95">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={36} />
            <Wordmark className="text-xl text-platinum" />
          </Link>

          {/* Barre tubelight centrée (desktop large). */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <NavBar items={navItems} />
          </div>

          <div className="flex items-center gap-2.5">
            <StreakBadge />
            <LanguageToggle />
            <Link href="/play/solo" className="btn-ink px-5 py-2 text-sm">
              {t("common.play")}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-10 pt-12 md:grid-cols-[1.05fr_0.95fr] md:pt-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="sticker -rotate-2">
              <span className="h-2 w-2 animate-pulseGlow rounded-full bg-strawberry" />
              {t("home.badge.live")}
            </span>
            <span className="sticker rotate-1">{t("home.badge.noSignup")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 font-display text-[3.4rem] font-bold leading-[0.95] tracking-tight text-platinum sm:text-7xl"
          >
            {t("home.hero.title1")}
            <br />
            <span className="hl-red">{t("home.hero.title2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-lavender"
          >
            <span className="font-accent text-xl text-platinum">
              {t("home.hero.q")}
            </span>{" "}
            {t("home.hero.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/play/solo" className="btn-ink px-7 py-3.5 text-base">
              {t("home.hero.playSolo")}
            </Link>
            <Link href="/multiplayer" className="btn-paper px-7 py-3.5 text-base">
              {t("nav.multi")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <Odometer label={t("home.odometer.views")} />
            <LiveActivity />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.21, 0.5, 0.3, 1] }}
          className="md:rotate-1"
        >
          <HeroPreview />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <section className="py-10">
        <div className="mx-auto mb-5 flex max-w-6xl items-center gap-3 px-5">
          <span className="h-[2px] w-8 bg-crimson" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-platinum">
            {t("home.marquee.label")}
          </span>
        </div>
        <TrendingMarquee />
      </section>

      {/* COMMENT JOUER */}
      <section id="comment" className="mx-auto max-w-6xl px-5 py-20">
        <SectionHead
          index="01"
          title={
            <>
              {t("home.howto.title")}{" "}
              <span className="font-accent font-normal text-crimson">
                {t("home.howto.titleAccent")}
              </span>
            </>
          }
          sub={t("home.howto.sub")}
        />

        <div className="mt-12 grid gap-6 border-t-2 border-platinum/15 pt-10 sm:grid-cols-3 sm:gap-10">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="h-full">
                <div className="font-display text-6xl font-bold leading-none text-platinum/10 sm:text-7xl">
                  {s.n}
                </div>
                <h3 className="mt-3 font-display text-xl font-bold text-platinum">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-lavender">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MODES */}
      <section id="modes" className="mx-auto max-w-6xl px-5 py-12">
        <SectionHead index="02" title={t("home.modes.title")} sub={t("home.modes.sub")} />

        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <Link href="/defi" className="group block h-full">
              <div className="card-ink flex h-full flex-col rounded-2xl p-7">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-2xl font-bold text-platinum">
                    {t("card.defi.title")}
                  </h3>
                  <span className="sticker rotate-3 !px-2.5 !py-1">🔥</span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-lavender">
                  {t("card.defi.desc")}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2.5 py-1 text-xs font-bold text-platinum">
                    {t("card.defi.tag1")}
                  </span>
                  <span className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2.5 py-1 text-xs font-bold text-platinum">
                    {t("card.defi.tag2")}
                  </span>
                  {streak > 0 && (
                    <span className="rounded-md border border-crimson/40 bg-strawberry/10 px-2.5 py-1 text-xs font-bold text-crimson">
                      {t("card.defi.streak", { n: streak })}
                    </span>
                  )}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-crimson">
                  {t("card.defi.cta")}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.07}>
            <Link href="/play/solo" className="group block h-full">
              <div className="card-ink flex h-full flex-col rounded-2xl p-7">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-2xl font-bold text-platinum">
                    {t("card.solo.title")}
                  </h3>
                  <span className="sticker -rotate-2 !px-2.5 !py-1">🎯</span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-lavender">
                  {t("card.solo.desc")}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[t("card.solo.tag1"), t("card.solo.tag2"), t("card.solo.tag3")].map(
                    (c) => (
                      <span
                        key={c}
                        className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2.5 py-1 text-xs font-bold text-platinum"
                      >
                        {c}
                      </span>
                    )
                  )}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-crimson">
                  {t("card.solo.cta")}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.14}>
            <Link href="/play/plus-moins" className="group block h-full">
              <div className="card-ink flex h-full flex-col rounded-2xl p-7">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-2xl font-bold text-platinum">
                    {t("card.pm.title")}
                  </h3>
                  <span className="sticker -rotate-3 !px-2.5 !py-1">⚖️</span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-lavender">
                  {t("card.pm.desc")}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[t("card.pm.tag1"), t("card.pm.tag2"), t("card.pm.tag3")].map((c) => (
                    <span
                      key={c}
                      className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2.5 py-1 text-xs font-bold text-platinum"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-crimson">
                  {t("card.pm.cta")}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.21}>
            <Link href="/multiplayer" className="group block h-full">
              <div className="card-ink flex h-full flex-col rounded-2xl p-7">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-2xl font-bold text-platinum">
                    {t("card.multi.title")}
                  </h3>
                  <span className="sticker rotate-2 !px-2.5 !py-1">⚔️</span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-lavender">
                  {t("card.multi.desc")}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[t("card.multi.tag1"), t("card.multi.tag2"), t("card.multi.tag3")].map(
                    (c) => (
                      <span
                        key={c}
                        className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2.5 py-1 text-xs font-bold text-platinum"
                      >
                        {c}
                      </span>
                    )
                  )}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-crimson">
                  {t("card.multi.cta")}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* OFFRES gratuit vs accès à vie */}
      <section id="offres" className="mx-auto max-w-5xl px-5 py-16">
        <SectionHead
          index="03"
          title={
            <>
              {t("home.offers.title")}{" "}
              <span className="font-accent font-normal text-crimson">
                {t("home.offers.titleAccent")}
              </span>
            </>
          }
          sub={t("home.offers.sub")}
        />

        <Reveal className="mt-12">
          <Offers />
        </Reveal>
      </section>

      {/* BANDEAU ATOUTS */}
      <section className="cv-auto mx-auto max-w-6xl px-5 py-12">
        <Reveal>
          <div className="card-ink grid divide-y-2 divide-platinum/10 rounded-2xl sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
            {[
              { t: t("home.f1.t"), d: t("home.f1.d") },
              { t: t("home.f2.t"), d: t("home.f2.d") },
              { t: t("home.f3.t"), d: t("home.f3.d") },
            ].map((f) => (
              <div key={f.t} className="p-6">
                <h3 className="font-display text-lg font-bold text-platinum">
                  {f.t}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-lavender">{f.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA final */}
      <section className="cv-auto mx-auto max-w-xl px-5 py-16 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-platinum">
            {t("home.cta.title")}{" "}
            <span className="font-accent font-normal text-crimson">
              {t("home.cta.titleAccent")}
            </span>
            &nbsp;?
          </h2>
          <p className="mx-auto mt-2 text-sm text-lavender">{t("home.cta.sub")}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/play/solo" className="btn-ink px-7 py-3.5">
              {t("home.cta.playNow")}
            </Link>
            <Link href="/multiplayer" className="btn-paper px-7 py-3.5">
              {t("home.cta.createGame")}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="cv-auto border-t-2 border-platinum/10 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
            {/* Marque + éditeur */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <Logo size={32} />
                <Wordmark className="text-lg text-platinum" />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-lavender">
                {t("footer.tagline")}
              </p>
            </div>

            {/* Jouer */}
            <div>
              <div className="text-sm font-semibold text-platinum">{t("footer.play")}</div>
              <ul className="mt-3 space-y-2 text-sm text-lavender">
                <li><Link href="/play/solo" className="hover:text-platinum">{t("footer.solo")}</Link></li>
                <li><Link href="/play/plus-moins" className="hover:text-platinum">{t("nav.plusmoins")}</Link></li>
                <li><Link href="/multiplayer" className="hover:text-platinum">{t("nav.multi")}</Link></li>
                <li><Link href="/pro" className="hover:text-platinum">{t("footer.toLife")}</Link></li>
              </ul>
            </div>

            {/* Guides / contenu SEO */}
            <div>
              <div className="text-sm font-semibold text-platinum">{t("footer.guides")}</div>
              <ul className="mt-3 space-y-2 text-sm text-lavender">
                <li><Link href={guideFriends} className="hover:text-platinum">{t("footer.betweenFriends")}</Link></li>
                <li><Link href={guideGuessr} className="hover:text-platinum">{t("footer.guessr")}</Link></li>
              </ul>
            </div>

            {/* Société */}
            <div>
              <div className="text-sm font-semibold text-platinum">{t("footer.company")}</div>
              <ul className="mt-3 space-y-2 text-sm text-lavender">
                <li><a href={`mailto:${PUBLISHER.email}`} className="hover:text-platinum">{t("footer.contact")}</a></li>
                <li><Link href="/pro" className="hover:text-platinum">{t("footer.support")}</Link></li>
                <li><Link href="/mentions-legales" className="hover:text-platinum">{t("footer.editor")}</Link></li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <div className="text-sm font-semibold text-platinum">{t("footer.legal")}</div>
              <ul className="mt-3 space-y-2 text-sm text-lavender">
                <li><Link href="/mentions-legales" className="hover:text-platinum">{t("footer.legalNotice")}</Link></li>
                <li><Link href="/confidentialite" className="hover:text-platinum">{t("footer.privacy")}</Link></li>
                <li><Link href="/cgu" className="hover:text-platinum">{t("footer.terms")}</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-platinum/10 pt-6 sm:flex-row">
            <p className="text-xs text-lavender/70">
              © {new Date().getFullYear()} {PUBLISHER.tradingName}. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
