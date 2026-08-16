"use client";

// Mode « Plus ou moins » (solo) : deux vidéos, laquelle a le plus de vues ?
// Série infinie — on perd à la première erreur. RÉSERVÉ À L'ACCÈS À VIE
// (avantage exclusif de l'offre payante) ; illimité pour les membres.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { YTVideo } from "@/lib/types";
import { Stats } from "@/lib/stats";
import { useT, useLocale, compactViewsL, groupedViewsL } from "@/lib/i18n";
import { Button } from "@/components/Buttons";
import { CountUp } from "@/components/CountUp";
import { Confetti } from "@/components/Confetti";
import { GameTopBar } from "./GameTopBar";
import { Loader } from "./Loader";
import { logActivity } from "@/lib/activity";
import { Sound, resumeAudio, vibrate } from "@/lib/sound";
import { THEMES } from "@/lib/themes";
import { LANGS } from "@/lib/languages";
import { isPro } from "@/lib/pro";
import { PaywallNotice } from "./PaywallNotice";

type Status = "confirm" | "loading" | "playing" | "reveal" | "dead" | "error";

const BEST_KEY = "best_hl";

async function fetchBatch(cat: string, lang: string): Promise<YTVideo[]> {
  const params = new URLSearchParams({ count: "20" });
  if (cat !== "all") params.set("category", cat);
  if (lang !== "all") params.set("lang", lang);
  const res = await fetch(`/api/videos?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.videos?.length) {
    throw new Error(data.error ?? "Aucune vidéo disponible.");
  }
  return data.videos as YTVideo[];
}

// Carte d'une vidéo (gauche = vues révélées, droite = mystère + choix).
// Exportée : réutilisée par le mode « Plus ou moins » multijoueur.
export function HLCard({
  video,
  views,
  children,
  watch = false,
}: {
  video: YTVideo;
  /** "shown" → vues affichées ; "hidden" → « ? » ; nombre → CountUp (révélation). */
  views: "shown" | "hidden" | number;
  children?: React.ReactNode;
  /** Affiche un lien « Voir sur YouTube » (utilisé à la révélation). */
  watch?: boolean;
}) {
  const t = useT();
  const { locale } = useLocale();
  const subs =
    typeof video.subscriberCount === "number" && video.subscriberCount > 0
      ? `${compactViewsL(video.subscriberCount, locale)} ${t("pm.subs")}`
      : null;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl glass-strong">
      <div className="relative aspect-video w-full bg-black/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailURL}
          alt={video.title}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 py-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-platinum">
          {video.title}
        </h3>
        <p className="mt-1 truncate text-xs font-medium text-lavender">
          {video.channel}
          {subs && <span> · {subs}</span>}
        </p>
        <div className="mt-auto pt-3">
          {views === "shown" && (
            <div className="font-display text-2xl font-bold text-crimson">
              {groupedViewsL(video.viewCount, locale)}
              <span className="ml-1.5 text-sm font-semibold text-lavender">{t("common.views")}</span>
            </div>
          )}
          {typeof views === "number" && (
            <div className="font-display text-2xl font-bold text-crimson">
              <CountUp to={views} />
              <span className="ml-1.5 text-sm font-semibold text-lavender">{t("common.views")}</span>
            </div>
          )}
          {views === "hidden" && children}
          {watch && (
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-lavender underline-offset-2 hover:text-platinum hover:underline"
            >
              {t("reveal.watchShort")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function HigherLower() {
  const t = useT();
  const { locale } = useLocale();
  const [status, setStatus] = useState<Status>("confirm");
  const [themeKey, setThemeKey] = useState("all");
  const [langKey, setLangKey] = useState("all");
  const [error, setError] = useState("");

  const [left, setLeft] = useState<YTVideo | null>(null);
  const [right, setRight] = useState<YTVideo | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(true);
  const [newRecord, setNewRecord] = useState(false);

  const poolRef = useRef<YTVideo[]>([]);
  const seenRef = useRef<Set<string>>(new Set());
  const refillingRef = useRef(false);

  // Accès à vie requis (évalué après montage pour éviter tout décalage SSR).
  const [mounted, setMounted] = useState(false);
  const [pro, setProState] = useState(false);

  useEffect(() => {
    setBest(Stats.bestScore(BEST_KEY));
    setProState(isPro());
    setMounted(true);
    const onChange = () => setProState(isPro());
    window.addEventListener("vg-pro-change", onChange);
    return () => window.removeEventListener("vg-pro-change", onChange);
  }, []);

  function takeNext(): YTVideo | null {
    const v = poolRef.current.shift() ?? null;
    if (v) seenRef.current.add(v.id);
    return v;
  }

  // Recharge le pool en arrière-plan quand il s'épuise (sans interrompre la série).
  async function refill() {
    if (refillingRef.current) return;
    refillingRef.current = true;
    try {
      const batch = await fetchBatch(
        THEMES.find((th) => th.key === themeKey)?.cat ?? "all",
        langKey
      );
      const fresh = batch.filter((v) => !seenRef.current.has(v.id));
      poolRef.current.push(...fresh);
    } catch {
      /* silencieux : on retentera */
    } finally {
      refillingRef.current = false;
    }
  }

  async function start() {
    if (!isPro()) return; // réservé à l'accès à vie
    resumeAudio();
    Sound.click();
    setStatus("loading");
    setError("");
    try {
      const cat = THEMES.find((th) => th.key === themeKey)?.cat ?? "all";
      const batch = await fetchBatch(cat, langKey);
      poolRef.current = batch;
      seenRef.current = new Set();
      const l = takeNext();
      const r = takeNext();
      if (!l || !r) throw new Error("Pas assez de vidéos disponibles.");
      setLeft(l);
      setRight(r);
      setStreak(0);
      setNewRecord(false);
      setStatus("playing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement.");
      setStatus("error");
    }
  }

  function choose(higher: boolean) {
    if (status !== "playing" || !left || !right) return;
    resumeAudio();
    Sound.validate();
    vibrate(12);
    const correct = higher
      ? right.viewCount >= left.viewCount
      : right.viewCount <= left.viewCount;
    setLastCorrect(correct);
    setStatus("reveal");

    window.setTimeout(() => {
      if (correct) {
        const s = streak + 1;
        setStreak(s);
        Sound.result(5000);
        if (s === 5 || s === 10 || s === 20 || s === 50) Sound.bullseye();
        // La vidéo de droite devient la référence, on enchaîne.
        const next = takeNext();
        if (poolRef.current.length < 4) void refill();
        if (!next) {
          // Pool épuisé malgré le refill : fin « victorieuse » de la série.
          endRun(s);
          return;
        }
        setLeft(right);
        setRight(next);
        setStatus("playing");
      } else {
        Sound.result(0);
        vibrate([0, 60, 40, 60]);
        endRun(streak);
      }
    }, 1700);
  }

  function endRun(finalStreak: number) {
    const record = Stats.recordScore(finalStreak, BEST_KEY);
    setNewRecord(record && finalStreak > 0);
    setBest(Stats.bestScore(BEST_KEY));
    Stats.incrementGames();
    if (finalStreak > 0) logActivity(Stats.getPlayerName(), finalStreak, "hl");
    setStatus("dead");
  }

  function replay() {
    setStatus("confirm");
    setLeft(null);
    setRight(null);
  }

  // --- Rendus ---

  const topRight = (
    <div className="flex items-center gap-2 text-sm">
      {best > 0 && (
        <span className="hidden rounded-full border-2 border-platinum/15 bg-white px-3 py-1 font-bold text-lavender sm:inline">
          {t("pm.record", { n: best })}
        </span>
      )}
      <span className="rounded-full border-2 border-platinum bg-crimson px-3 py-1 font-bold text-white tabular-nums">
        {t("pm.streak", { n: streak })}
      </span>
    </div>
  );

  if (status === "loading") {
    return (
      <Shell>
        <Loader />
      </Shell>
    );
  }

  if (status === "error") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="text-5xl">😕</div>
          <p className="max-w-sm text-lavender">{error}</p>
          <Button onClick={() => setStatus("confirm")} className="px-6 py-3">
            {t("common.retry")}
          </Button>
          <Link href="/" className="text-sm text-lavender hover:text-platinum">
            {t("common.backToHome")}
          </Link>
        </div>
      </Shell>
    );
  }

  if (status === "confirm") {
    if (!mounted) {
      return (
        <Shell>
          <Loader />
        </Shell>
      );
    }
    if (!pro) {
      return (
        <Shell>
          <PaywallNotice
            title={t("pm.lockedTitle")}
            message={t("pm.lockedMsg")}
          />
        </Shell>
      );
    }
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center py-8 text-center"
        >
          <div className="w-full rounded-2xl glass-strong p-8">
            <div className="sticker mx-auto -rotate-2">{t("pm.badgeLife")}</div>
            <h1 className="mt-4 font-display text-3xl font-bold text-platinum">
              {t("pm.q")} <span className="font-accent font-normal text-crimson">{t("pm.qMid")}</span> {t("pm.qEnd")}
            </h1>
            <p className="mt-3 text-lavender">
              {t("pm.explain")}
            </p>
            {best > 0 && (
              <p className="mt-2 text-sm font-bold text-crimson">
                {t("pm.yourRecord", { n: best })}
              </p>
            )}

            <div className="mt-6 text-left text-sm font-semibold text-platinum">
              {t("common.theme")}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.key}
                  onClick={() => {
                    resumeAudio();
                    setThemeKey(th.key);
                    Sound.click();
                  }}
                  className={`rounded-xl border-2 py-2.5 text-sm font-bold transition ${
                    themeKey === th.key
                      ? "border-platinum bg-crimson text-white shadow-hard-sm"
                      : "border-platinum/15 bg-white text-lavender hover:border-platinum/40"
                  }`}
                >
                  {t(`theme.${th.key}`)}
                </button>
              ))}
            </div>

            <div className="mt-6 text-left text-sm font-semibold text-platinum">
              {t("common.videoLang")}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => {
                    resumeAudio();
                    setLangKey(l.key);
                    Sound.click();
                  }}
                  className={`rounded-xl border-2 py-2 text-[13px] font-bold transition ${
                    langKey === l.key
                      ? "border-platinum bg-crimson text-white shadow-hard-sm"
                      : "border-platinum/15 bg-white text-lavender hover:border-platinum/40"
                  }`}
                >
                  <span className="mr-1">{l.flag}</span>
                  {t(`lang.${l.key}`)}
                </button>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Button onClick={start} className="w-full py-4 text-lg">
                {t("pm.start")}
              </Button>
              <Link href="/">
                <Button variant="glass" className="w-full py-3.5">
                  {t("common.cancel")}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Shell>
    );
  }

  if (status === "dead") {
    return (
      <Shell>
        <div className="relative">
          {newRecord && <Confetti />}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md py-10 text-center"
          >
            <div className="text-sm font-bold uppercase tracking-widest text-lavender">
              {t("pm.streakOver")}
            </div>
            {newRecord && (
              <div className="sticker mx-auto mt-3 w-fit -rotate-2 !border-crimson !text-crimson !shadow-hard-red-sm">
                {t("game.newRecord")}
              </div>
            )}
            <div className="mt-4 font-display text-7xl font-bold text-crimson">
              {streak}
            </div>
            <div className="mt-1 text-lavender">
              {t("pm.streakStats", {
                s: streak > 1 ? "s" : "",
                best: Math.max(best, streak),
              })}
            </div>

            {left && right && (
              <div className="mt-6 rounded-2xl glass p-4 text-left text-sm">
                <div className="font-semibold text-platinum">
                  {t("pm.theAnswer")}
                </div>
                <div className="mt-1 text-lavender">
                  {t("pm.answerBody", {
                    title: `${right.title.slice(0, 60)}${right.title.length > 60 ? "…" : ""}`,
                    right: groupedViewsL(right.viewCount, locale),
                    left: groupedViewsL(left.viewCount, locale),
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={replay} className="px-7 py-3.5">
                {t("common.replay")}
              </Button>
              <Link href="/">
                <Button variant="glass" className="px-7 py-3.5">
                  {t("common.home")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Shell>
    );
  }

  // playing / reveal
  if (!left || !right) return null;
  const revealing = status === "reveal";

  return (
    <Shell right={topRight}>
      <div className="relative mx-auto max-w-4xl">
        {/* Flash résultat */}
        <AnimatePresence>
          {revealing && (
            <motion.div
              key={`flash-${streak}-${right.id}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2"
            >
              <span
                className={`sticker !text-base ${
                  lastCorrect
                    ? "!border-green-700 !text-green-700"
                    : "!border-crimson !text-crimson !shadow-hard-red-sm"
                }`}
              >
                {lastCorrect ? t("pm.goodSpot") : t("pm.missed")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
          <motion.div
            key={`l-${left.id}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <HLCard video={left} views="shown" watch={revealing} />
          </motion.div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <span className="flex h-12 w-12 rotate-3 items-center justify-center rounded-full border-2 border-platinum bg-white font-display text-lg font-bold text-platinum shadow-hard-sm">
              VS
            </span>
          </div>

          <motion.div
            key={`r-${right.id}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <HLCard
              video={right}
              views={revealing ? right.viewCount : "hidden"}
              watch={revealing}
            >
              <div className="flex flex-col gap-2">
                <Button onClick={() => choose(true)} className="w-full py-3">
                  {t("pm.more")}
                </Button>
                <Button
                  variant="glass"
                  onClick={() => choose(false)}
                  className="w-full py-3"
                >
                  {t("pm.less")}
                </Button>
              </div>
            </HLCard>
          </motion.div>
        </div>

        <p className="mt-4 text-center text-xs font-semibold text-lavender">
          {t("pm.question")}
        </p>
      </div>
    </Shell>
  );
}

function Shell({
  right,
  children,
}: {
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <main className="min-h-dvh pb-16">
      <GameTopBar title={t("title.plusmoins")} right={right} />
      <div className="mx-auto max-w-5xl px-4 py-4">{children}</div>
    </main>
  );
}
