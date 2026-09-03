"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { YTVideo, RoundResult } from "@/lib/types";
import {
  points as scorePoints,
  scoreLabelKey,
  scoreColor,
  MAX_POINTS_PER_ROUND,
} from "@/lib/scoring";
import { useT, useLocale, compactViewsL, groupedViewsL, intlLocale } from "@/lib/i18n";
import { GuessSlider } from "@/components/GuessSlider";
import { VideoThumb } from "@/components/VideoThumb";
import { Button } from "@/components/Buttons";
import { CountUp } from "@/components/CountUp";
import { Confetti } from "@/components/Confetti";
import { GameTopBar } from "./GameTopBar";
import { Loader } from "./Loader";
import { RoundIntro } from "./RoundIntro";
import {
  parisDay,
  dailyNumber,
  getDailyResult,
  saveDailyResult,
  updateStreakForToday,
  liveStreak,
  getFreezes,
  shareText,
  type DailyResult,
} from "@/lib/daily";
import { getName } from "@/lib/profile";
import { logActivity } from "@/lib/activity";
import { Sound, resumeAudio, vibrate } from "@/lib/sound";
import { PercentileLine } from "@/components/PercentileLine";
import { DailyLeaderboard } from "./DailyLeaderboard";

type Status =
  | "loading"
  | "confirm"
  | "intro"
  | "playing"
  | "reveal"
  | "finished"
  | "done"
  | "error";

export function DailyGame() {
  const t = useT();
  const { locale } = useLocale();
  const [status, setStatus] = useState<Status>("loading");
  const [day, setDay] = useState(parisDay());
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState(1_000_000);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [error, setError] = useState("");
  const [streak, setStreak] = useState(0);
  const [stored, setStored] = useState<DailyResult | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    const today = parisDay();
    setDay(today);
    // Déjà joué aujourd'hui → écran récap + partage (une seule tentative par jour).
    const already = getDailyResult(today);
    if (already) {
      setStored(already);
      setStreak(liveStreak(today));
      setStatus("done");
      return;
    }
    try {
      const res = await fetch("/api/daily", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.videos?.length) {
        throw new Error(data.error ?? "Daily challenge unavailable.");
      }
      setVideos(data.videos);
      setDay(data.day ?? today);
      setIndex(0);
      setResults([]);
      setGuess(1_000_000);
      setStreak(liveStreak(today));
      setStatus("confirm");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loading error.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (status !== "intro") return;
    const t = setTimeout(() => setStatus("playing"), 950);
    return () => clearTimeout(t);
  }, [status, index]);

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
      const roundsPts = results.map((r) => r.points);
      const finalScore = roundsPts.reduce((a, b) => a + b, 0);
      const result: DailyResult = { day, score: finalScore, rounds: roundsPts };
      saveDailyResult(result);
      setStored(result);
      setStreak(updateStreakForToday(day).current);
      logActivity(getName(), finalScore, "defi");
      setStatus("finished");
    } else {
      setIndex((i) => i + 1);
      setGuess(1_000_000);
      setStatus("intro");
    }
  }

  // --- Rendus ---

  if (status === "loading") {
    return (
      <Shell>
        <Loader label={t("daily.loader")} />
      </Shell>
    );
  }

  if (status === "error") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="text-5xl">😕</div>
          <p className="max-w-sm text-lavender">{error}</p>
          <Button onClick={load} className="px-6 py-3">
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
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center"
        >
          <div className="w-full rounded-2xl glass-strong p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-strawberry">
              {t("daily.title", { n: dailyNumber(day) })}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold text-platinum">
              {t("daily.fiveOneTry")}
            </h1>
            <p className="mt-3 text-lavender">
              {t("daily.intro")}
            </p>
            {streak > 0 && (
              <div className="mx-auto mt-4 w-fit rounded-full bg-strawberry/10 px-4 py-1.5 text-sm font-bold text-crimson">
                {t("daily.streak", { n: streak, s: streak > 1 ? "s" : "" })}
              </div>
            )}
            <div className="mt-7">
              <Button
                onClick={() => {
                  resumeAudio();
                  Sound.click();
                  setStatus("intro");
                }}
                className="w-full py-4 text-lg"
              >
                {t("daily.playChallenge")}
              </Button>
              <Link href="/">
                <Button variant="glass" className="mt-3 w-full py-3.5">
                  {t("common.later")}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Shell>
    );
  }

  if (status === "done" && stored) {
    return (
      <Shell>
        <DoneCard result={stored} streak={streak} />
      </Shell>
    );
  }

  if (status === "finished" && stored) {
    return (
      <Shell>
        <FinishedCard result={stored} results={results} streak={streak} />
      </Shell>
    );
  }

  return (
    <Shell
      right={
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-full glass px-3 py-1 font-semibold text-lavender">
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
  right,
  children,
}: {
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <main className="min-h-dvh pb-16">
      <GameTopBar title={t("title.defi")} right={right} />
      <div className="mx-auto max-w-2xl px-4 py-4">{children}</div>
    </main>
  );
}

/** Grille d'emojis + score + bouton copier (partage façon Wordle). */
function ShareBlock({ result }: { result: DailyResult }) {
  const t = useT();
  const { locale } = useLocale();
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(shareText(result, locale)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <Button onClick={copy} variant="glass" className="w-full py-3.5">
      {copied ? t("daily.copied") : t("daily.copyScore")}
    </Button>
  );
}

function StreakChip({ streak }: { streak: number }) {
  const t = useT();
  const [freezes, setFreezes] = useState(0);
  useEffect(() => {
    setFreezes(getFreezes());
    const r = () => setFreezes(getFreezes());
    window.addEventListener("vg-streak-change", r);
    return () => window.removeEventListener("vg-streak-change", r);
  }, []);
  if (streak <= 0) return null;
  return (
    <div className="mt-3 flex flex-col items-center gap-1.5">
      <div className="w-fit rounded-full bg-strawberry/10 px-4 py-1.5 text-sm font-bold text-crimson">
        {t("daily.streakRun", { n: streak, s: streak > 1 ? "s" : "" })}
      </div>
      {freezes > 0 && (
        <div className="text-xs font-medium text-lavender">
          {t("streak.freezes", { n: freezes, s: freezes > 1 ? "s" : "" })}
        </div>
      )}
    </div>
  );
}

function DoneCard({ result, streak }: { result: DailyResult; streak: number }) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md text-center"
    >
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-strawberry">
        {t("daily.title", { n: dailyNumber(result.day) })}
      </div>
      <h1 className="mt-1 font-display text-3xl font-bold text-platinum">
        {t("daily.alreadyToday")}
      </h1>
      <div className="mt-4 font-display text-5xl font-bold text-platinum">
        {result.score.toLocaleString(intlLocale(locale))}
        <span className="ml-2 align-middle text-base font-semibold text-lavender">
          {t("common.points")}
        </span>
      </div>
      <StreakChip streak={streak} />
      <PercentileLine score={result.score} className="mt-3" />
      <div className="mt-6">
        <ShareBlock result={result} />
      </div>
      <DailyLeaderboard day={result.day} score={result.score} />
      <p className="mt-5 text-sm text-lavender">
        {t("daily.comeBack")}
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <Link href="/play/solo">
          <Button className="px-6 py-3">{t("daily.playSolo")}</Button>
        </Link>
        <Link href="/">
          <Button variant="glass" className="px-6 py-3">
            {t("common.home")}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function FinishedCard({
  result,
  results,
  streak,
}: {
  result: DailyResult;
  results: RoundResult[];
  streak: number;
}) {
  const t = useT();
  const { locale } = useLocale();
  const max = result.rounds.length * MAX_POINTS_PER_ROUND;
  useEffect(() => {
    resumeAudio();
    const timers = results.map((_, i) =>
      setTimeout(() => Sound.tick(), 180 + i * 200)
    );
    const winT = setTimeout(() => Sound.win(), 180 + results.length * 200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(winT);
    };
  }, []);
  return (
    <div className="relative">
      {result.score >= max * 0.7 && <Confetti />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md text-center"
      >
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-strawberry">
          {t("daily.finishedTag", { n: dailyNumber(result.day) })}
        </div>
        <div className="mt-3 font-display text-6xl font-bold text-platinum">
          <CountUp to={result.score} format={(n) => n.toLocaleString(intlLocale(locale))} />
        </div>
        <div className="mt-1 text-lavender">
          {t("game.outOf", { max: max.toLocaleString(intlLocale(locale)) })}
        </div>
        <StreakChip streak={streak} />
        <PercentileLine score={result.score} className="mt-3" />

        <div className="mt-6">
          <ShareBlock result={result} />
        </div>

        <DailyLeaderboard day={result.day} score={result.score} />

        <div className="mt-6 space-y-2 text-left">
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
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

        <p className="mt-6 text-sm text-lavender">
          {t("daily.comeBack")}
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/play/solo">
            <Button className="px-6 py-3">{t("daily.continueSolo")}</Button>
          </Link>
          <Link href="/">
            <Button variant="glass" className="px-6 py-3">
              {t("common.home")}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
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
    points >= 4500 ? t("reveal.bullseye") : tooHigh ? t("reveal.tooHigh") : t("reveal.tooLow");

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
        {isLast ? t("reveal.myResult") : t("reveal.next")}
      </Button>
    </motion.div>
  );
}
