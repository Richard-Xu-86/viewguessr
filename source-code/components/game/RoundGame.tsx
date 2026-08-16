"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { YTVideo, RoundResult } from "@/lib/types";
import { points as scorePoints, scoreLabelKey, scoreColor, MAX_POINTS_PER_ROUND } from "@/lib/scoring";
import { Stats } from "@/lib/stats";
import { useT, useLocale, compactViewsL, groupedViewsL, intlLocale } from "@/lib/i18n";
import { GuessSlider } from "@/components/GuessSlider";
import { VideoThumb } from "@/components/VideoThumb";
import { Button } from "@/components/Buttons";
import { CountUp } from "@/components/CountUp";
import { Confetti } from "@/components/Confetti";
import { GameTopBar } from "./GameTopBar";
import { Loader } from "./Loader";
import { RoundIntro } from "./RoundIntro";
import { PaywallNotice } from "./PaywallNotice";
import { canPlay, recordPlay, remaining } from "@/lib/limits";
import { serverAllowPlay } from "@/lib/serverLimits";
import { logActivity } from "@/lib/activity";
import { Sound, resumeAudio, vibrate } from "@/lib/sound";
import { PercentileLine } from "@/components/PercentileLine";
import { THEMES } from "@/lib/themes";
import { LANGS } from "@/lib/languages";

type Status = "loading" | "confirm" | "intro" | "playing" | "reveal" | "finished" | "error";

export function RoundGame({
  rounds,
  title,
  statsKey,
}: {
  rounds: number;
  title: string;
  statsKey: string;
}) {
  // On démarre sur l'écran de choix du thème : plus de chargement automatique,
  // les vidéos sont récupérées au lancement, selon le thème choisi.
  const [status, setStatus] = useState<Status>("confirm");
  const [themeKey, setThemeKey] = useState("all");
  const [langKey, setLangKey] = useState("all");
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState(1_000_000);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [error, setError] = useState("");
  const [newRecord, setNewRecord] = useState(false);
  const [denied, setDenied] = useState(false);
  const [checking, setChecking] = useState(false);
  // Score de la partie PRÉCÉDENTE (pour la comparaison « vs ta dernière partie »).
  const [prevScore, setPrevScore] = useState<number | null>(null);
  const t = useT();
  const { locale } = useLocale();

  // Intro "Manche X" puis affichage de la miniature.
  useEffect(() => {
    if (status !== "intro") return;
    const t = setTimeout(() => setStatus("playing"), 950);
    return () => clearTimeout(t);
  }, [status, index]);

  // Tally sonore en fin de partie (les points s'additionnent).
  useEffect(() => {
    if (status !== "finished") return;
    resumeAudio();
    const timers = results.map((_, i) =>
      setTimeout(() => Sound.tick(), 180 + i * 200)
    );
    const winT = setTimeout(() => Sound.win(), 180 + results.length * 200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(winT);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const current = videos[index];
  const totalScore = results.reduce((s, r) => s + r.points, 0);
  const lastResult = results[results.length - 1];

  function validate() {
    if (!current) return;
    resumeAudio();
    Sound.validate();
    vibrate(12);
    const pts = scorePoints(guess, current.viewCount);
    setResults((r) => [...r, { video: current, guess, points: pts }]);
    setStatus("reveal");
  }

  function next() {
    if (index + 1 >= videos.length) {
      // Fin de partie
      const finalScore = results.reduce((s, r) => s + r.points, 0);
      Stats.incrementGames();
      const record = Stats.recordScore(finalScore, statsKey);
      setNewRecord(record);
      // Comparaison vs la partie précédente, puis on mémorise ce score.
      const prev = Stats.lastScore(statsKey);
      setPrevScore(prev > 0 ? prev : null);
      Stats.setLastScore(finalScore, statsKey);
      logActivity(Stats.getPlayerName(), finalScore, "solo");
      setStatus("finished");
    } else {
      setIndex((i) => i + 1);
      setGuess(1_000_000);
      setStatus("intro");
    }
  }

  // Boucle « encore une » : relance immédiate avec le MÊME thème/langue, sans
  // repasser par l'écran de choix. Respecte les limites → bascule sur le paywall.
  async function quickReplay() {
    setNewRecord(false);
    setPrevScore(null);
    if (!canPlay("solo")) {
      // Plus de partie gratuite : on montre l'écran (qui affiche le paywall).
      setDenied(true);
      setStatus("confirm");
      return;
    }
    await start();
  }

  async function start() {
    resumeAudio();
    Sound.click();
    setChecking(true);
    const ok = await serverAllowPlay("solo");
    if (!ok) {
      setChecking(false);
      setDenied(true);
      return;
    }
    // Charge les vidéos du thème choisi, PUIS démarre la partie.
    setStatus("loading");
    setError("");
    try {
      const cat = THEMES.find((t) => t.key === themeKey)?.cat ?? "all";
      const params = new URLSearchParams({ count: String(rounds) });
      if (cat !== "all") params.set("category", cat);
      if (langKey !== "all") params.set("lang", langKey);
      const res = await fetch(`/api/videos?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.videos?.length) {
        throw new Error(data.error ?? t("common.oops"));
      }
      setVideos(data.videos);
      setIndex(0);
      setResults([]);
      setGuess(1_000_000);
      recordPlay("solo");
      setChecking(false);
      setStatus("intro");
    } catch (e) {
      setChecking(false);
      setError(e instanceof Error ? e.message : "Erreur de chargement.");
      setStatus("error");
    }
  }

  function replay() {
    setNewRecord(false);
    setResults([]);
    setVideos([]);
    setIndex(0);
    setStatus("confirm");
  }

  // --- Rendus ---

  if (status === "loading") {
    return (
      <Shell title={title}>
        <Loader />
      </Shell>
    );
  }

  if (status === "error") {
    return (
      <Shell title={title}>
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
    if (!canPlay("solo") || denied) {
      return (
        <Shell title={title}>
          <PaywallNotice
            title={t("solo.limitTitle")}
            message={t("solo.limitMsg")}
            showReset
          />
        </Shell>
      );
    }
    const left = remaining("solo");
    return (
      <Shell title={title}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center"
        >
          <div className="w-full rounded-2xl glass-strong p-8">
            <h1 className="font-display text-3xl font-bold text-platinum">
              {t("solo.ready")}
            </h1>
            <p className="mt-3 text-lavender">
              {t("solo.intro", { rounds })}
            </p>
            {Number.isFinite(left) && (
              <p className="mt-2 text-sm font-medium text-strawberry">
                {t("solo.remaining", { n: left, s: left > 1 ? "s" : "" })}
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
            <p className="mt-1 text-left text-xs text-lavender">
              {t("solo.langHint")}
            </p>
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
              <Button onClick={start} disabled={checking} className="w-full py-4 text-lg">
                {checking ? t("common.loading") : t("solo.start")}
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

  if (status === "finished") {
    const max = videos.length * MAX_POINTS_PER_ROUND;
    return (
      <Shell title={title}>
        <div className="relative">
          {totalScore >= max * 0.7 && <Confetti />}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md text-center"
          >
            <div className="text-sm font-semibold uppercase tracking-widest text-lavender">
              {t("game.over")}
            </div>
            {newRecord && (
              <div className="sticker mx-auto mt-3 w-fit -rotate-2 !border-crimson !text-crimson !shadow-hard-red-sm">
                {t("game.newRecord")}
              </div>
            )}
            <div className="mt-4 font-display text-6xl font-bold text-platinum">
              <CountUp to={totalScore} format={(n) => n.toLocaleString(intlLocale(locale))} />
            </div>
            <div className="mt-1 text-lavender">
              {t("game.outOf", { max: max.toLocaleString(intlLocale(locale)) })}
            </div>
            {prevScore !== null && (
              <div
                className={`mx-auto mt-3 w-fit rounded-full px-4 py-1.5 text-sm font-bold ${
                  totalScore > prevScore
                    ? "bg-green-600/10 text-green-700"
                    : totalScore < prevScore
                      ? "bg-strawberry/10 text-crimson"
                      : "bg-black/[0.05] text-lavender"
                }`}
              >
                {totalScore > prevScore
                  ? t("solo.vsLastUp", {
                      delta: (totalScore - prevScore).toLocaleString(intlLocale(locale)),
                    })
                  : totalScore < prevScore
                    ? t("solo.vsLastDown", {
                        delta: (totalScore - prevScore).toLocaleString(intlLocale(locale)),
                      })
                    : t("solo.vsLastSame")}
              </div>
            )}
            <PercentileLine score={totalScore} className="mt-3" />

            <div className="mt-8 space-y-2 text-left">
              {results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-2xl glass p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.video.thumbnailURL}
                    alt={r.video.title}
                    className="h-12 w-20 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-platinum">
                      {r.video.title}
                    </div>
                    <div className="text-xs text-lavender">
                      {compactViewsL(r.video.viewCount, locale)} {t("common.views")} ·{" "}
                      {t("game.yourAnswerShort", { v: compactViewsL(r.guess, locale) })}
                    </div>
                  </div>
                  <div
                    className="text-lg font-extrabold tabular-nums"
                    style={{ color: scoreColor(r.points) }}
                  >
                    {r.points}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <Button onClick={quickReplay} className="w-full max-w-xs py-4 text-lg">
                {t("solo.replaySame")}
              </Button>
              <div className="flex justify-center gap-3">
                <Button onClick={replay} variant="glass" className="px-6 py-3">
                  {t("solo.changeTheme")}
                </Button>
                <Link href="/">
                  <Button variant="glass" className="px-6 py-3">
                    {t("common.home")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      title={title}
      right={
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-full border-2 border-platinum/15 bg-white px-3 py-1 font-bold text-lavender">
            {t("game.round", { i: index + 1, n: videos.length })}
          </span>
          <span className="rounded-full border-2 border-platinum bg-crimson px-3 py-1 font-bold text-white tabular-nums">
            {totalScore.toLocaleString(intlLocale(locale))}
          </span>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        {status === "intro" && (
          <motion.div
            key={`intro-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-[60vh] flex-col items-center justify-center"
          >
            <RoundIntro round={index + 1} total={videos.length} />
          </motion.div>
        )}

        {status === "playing" && current && (
          <motion.div
            key={`play-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <VideoThumb video={current} showQuestion />
            <div className="rounded-3xl glass-strong p-5">
              <GuessSlider value={guess} onChange={setGuess} />
              <Button onClick={validate} className="mt-5 w-full py-4 text-lg">
                {t("game.validate")}
              </Button>
            </div>
          </motion.div>
        )}

        {status === "reveal" && current && lastResult && (
          <RevealCard
            result={lastResult}
            isLast={index + 1 >= videos.length}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </Shell>
  );
}

function Shell({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh pb-16">
      <GameTopBar title={title} right={right} />
      <div className="mx-auto max-w-2xl px-4 py-4">{children}</div>
    </main>
  );
}

function RevealCard({
  result,
  isLast,
  onNext,
}: {
  result: RoundResult;
  isLast: boolean;
  onNext: () => void;
}) {
  const t = useT();
  const { locale } = useLocale();
  const { video, guess, points } = result;
  const tooHigh = guess > video.viewCount;
  const direction =
    points >= 4500
      ? t("reveal.bullseye")
      : tooHigh
        ? t("reveal.tooHigh")
        : t("reveal.tooLow");

  useEffect(() => {
    resumeAudio();
    Sound.drumroll();
    vibrate(points >= 4500 ? [0, 40, 50, 90] : 12);
    const timer = setTimeout(() => Sound.result(points), 1150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      key="reveal"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {points >= 4500 && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none fixed inset-0 z-50 bg-strawberry"
        />
      )}
      <VideoThumb video={video} />

      <div className="relative overflow-hidden rounded-3xl glass-strong p-4 text-center">
        {points >= 4500 && <Confetti count={18} />}
        <div className="text-xs font-semibold uppercase tracking-widest text-lavender">
          {t("reveal.realViews")}
        </div>
        <div className="mt-1 font-display text-3xl font-bold text-platinum sm:text-4xl">
          <CountUp to={video.viewCount} />
        </div>
        <div className="mt-1 text-sm font-medium text-lavender">{direction}</div>

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 14 }}
          className="mx-auto mt-3 w-fit rounded-2xl border-2 border-platinum bg-crimson px-5 py-2 shadow-hard-sm"
        >
          <div className="font-display text-2xl font-bold text-white">+{points}</div>
          <div className="text-xs font-semibold text-white/85">{t(scoreLabelKey(points))}</div>
        </motion.div>

        <div className="mt-2 text-sm text-lavender">
          {t("reveal.yourAnswer", { v: groupedViewsL(guess, locale) })}
        </div>

        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-lavender underline-offset-2 hover:text-platinum hover:underline"
        >
          {t("reveal.watch")}
        </a>
      </div>

      <Button onClick={onNext} className="w-full py-3.5 text-lg">
        {isLast ? t("reveal.finalResult") : t("reveal.next")}
      </Button>
    </motion.div>
  );
}
