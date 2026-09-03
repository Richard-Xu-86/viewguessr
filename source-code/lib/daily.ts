"use client";

// Défi du jour : verrou « une tentative par jour », série (streak) et partage
// façon Wordle. Tout est local (localStorage), pas de compte.

/** Jour calendaire en Europe/Paris (YYYY-MM-DD) — aligné avec /api/daily. */
export function parisDay(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Jour calendaire précédent (chaîne YYYY-MM-DD). */
function prevDay(day: string): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

// Numéro de défi affiché (« Défi du jour #N ») depuis le lancement.
const EPOCH = "2026-06-01";
export function dailyNumber(day: string = parisDay()): number {
  const a = Date.parse(`${day}T00:00:00Z`);
  const b = Date.parse(`${EPOCH}T00:00:00Z`);
  return Math.max(1, Math.round((a - b) / 86_400_000) + 1);
}

export interface DailyResult {
  day: string;
  score: number;
  rounds: number[]; // points par manche, pour la grille de partage
}

const RESULT_KEY = "vg_daily_result";

export function getDailyResult(day: string = parisDay()): DailyResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as DailyResult;
    return o && o.day === day && Array.isArray(o.rounds) ? o : null;
  } catch {
    return null;
  }
}

export function saveDailyResult(r: DailyResult): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(r));
}

export function hasPlayedToday(day: string = parisDay()): boolean {
  return getDailyResult(day) !== null;
}

// --- Série (streak) + gels (streak-freeze) ---

const STREAK_KEY = "vg_streak";
const FREEZE_KEY = "vg_streak_freezes";
const DEFAULT_FREEZES = 2; // dotation de départ
const MAX_FREEZES = 3; // plafond
const FREEZE_EVERY = 7; // +1 gel à chaque palier de 7 jours

export interface Streak {
  current: number;
  best: number;
  lastDay: string;
}

/** Gels disponibles (un gel évite de casser la série après UN jour manqué). */
export function getFreezes(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(FREEZE_KEY);
  if (raw === null) return DEFAULT_FREEZES; // jamais initialisé → dotation de départ
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? Math.min(n, MAX_FREEZES) : DEFAULT_FREEZES;
}

function setFreezes(n: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FREEZE_KEY, String(Math.max(0, Math.min(n, MAX_FREEZES))));
  window.dispatchEvent(new Event("vg-streak-change"));
}

/** Jour à N jours avant `day` (chaîne YYYY-MM-DD). */
function daysBefore(day: string, n: number): string {
  let d = day;
  for (let i = 0; i < n; i++) d = prevDay(d);
  return d;
}

export function getStreak(): Streak {
  if (typeof window === "undefined") return { current: 0, best: 0, lastDay: "" };
  try {
    const o = JSON.parse(window.localStorage.getItem(STREAK_KEY) || "{}");
    return { current: o.current || 0, best: o.best || 0, lastDay: o.lastDay || "" };
  } catch {
    return { current: 0, best: 0, lastDay: "" };
  }
}

/** Met à jour la série après avoir terminé le défi du jour. Idempotent.
 *  Gère le streak-freeze : si exactement UN jour a été manqué et qu'un gel est
 *  disponible, on consomme le gel et la série continue au lieu de repartir à 1. */
export function updateStreakForToday(day: string = parisDay()): Streak {
  const s = getStreak();
  if (s.lastDay === day) return s; // déjà compté aujourd'hui

  const yesterday = prevDay(day);
  const twoDaysAgo = daysBefore(day, 2);

  let current: number;
  if (s.lastDay === yesterday) {
    current = s.current + 1; // série continue normalement
  } else if (s.lastDay === twoDaysAgo && getFreezes() > 0) {
    setFreezes(getFreezes() - 1); // gel consommé : la série est sauvée
    current = s.current + 1;
  } else {
    current = 1; // nouvelle série (jamais joué, ou trop de jours manqués)
  }

  // Récompense : +1 gel à chaque nouveau palier de 7 jours atteint.
  if (current > s.current && current % FREEZE_EVERY === 0) {
    setFreezes(getFreezes() + 1);
  }

  const next: Streak = { current, best: Math.max(s.best, current), lastDay: day };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("vg-streak-change"));
  }
  return next;
}

/** Série « vivante » à afficher. Vivante si jouée aujourd'hui/hier, ou si un seul
 *  jour a été manqué mais qu'un gel la protège encore. */
export function liveStreak(day: string = parisDay()): number {
  const s = getStreak();
  if (s.lastDay === day || s.lastDay === prevDay(day)) return s.current;
  if (s.lastDay === daysBefore(day, 2) && getFreezes() > 0) return s.current;
  return 0;
}

export interface StreakInfo {
  current: number; // série vivante (0 si perdue)
  best: number;
  freezes: number;
  playedToday: boolean;
  atRisk: boolean; // a une série mais n'a pas encore joué aujourd'hui
}

/** État complet de la série pour l'affichage (badge header, écrans défi). */
export function streakInfo(day: string = parisDay()): StreakInfo {
  const s = getStreak();
  const current = liveStreak(day);
  const playedToday = s.lastDay === day;
  return {
    current,
    best: s.best,
    freezes: getFreezes(),
    playedToday,
    atRisk: current > 0 && !playedToday,
  };
}

// --- Partage façon Wordle ---

/** Carré de couleur d'une manche selon les points (max 5 000 par manche). */
export function emojiFor(points: number): string {
  if (points >= 4500) return "🟩";
  if (points >= 3000) return "🟨";
  if (points >= 1500) return "🟧";
  return "🟥";
}

/**
 * Grille de partage : un carré par manche, dans l'ordre joué.
 * Ex. "🟩🟩🟨🟧🟩". Spoiler-free : on montre la performance, jamais les vidéos.
 */
export function shareGrid(r: DailyResult): string {
  return r.rounds.map(emojiFor).join("");
}

/**
 * Texte copié/partagé, façon Wordle : titre + grille + lien.
 * La grille est la ligne qui donne envie de cliquer — ne pas la retirer.
 */
export function shareText(r: DailyResult, locale: "fr" | "en" = "en"): string {
  const n = dailyNumber(r.day);
  const grid = shareGrid(r);
  const score = r.score.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
  const title =
    locale === "fr"
      ? `ViewGuessr — Défi #${n} · ${score} pts`
      : `ViewGuessr — Daily #${n} · ${score} pts`;
  return `${title}\n${grid}\nview-guessr.com/defi`;
}
