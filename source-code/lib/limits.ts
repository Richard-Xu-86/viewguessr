"use client";

// Limites quotidiennes pour les joueurs gratuits (réinitialisées toutes les 24h,
// par jour calendaire local). Les détenteurs de l'accès à vie n'ont aucune limite.
import { isPro } from "./pro";

export type LimitedMode = "solo" | "mp";

const KEY = "vg_usage";
export const FREE_LIMITS: Record<LimitedMode, number> = { solo: 2, mp: 1 };

function today(): string {
  // Date locale YYYY-MM-DD le renouvellement a lieu à minuit, heure locale.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Millisecondes avant le prochain renouvellement des parties (minuit local). */
export function msUntilReset(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0); // prochain minuit local
  return Math.max(0, next.getTime() - now.getTime());
}

type Usage = { date: string; solo: number; mp: number };

function read(): Usage {
  if (typeof window === "undefined") return { date: today(), solo: 0, mp: 0 };
  try {
    const r = JSON.parse(window.localStorage.getItem(KEY) || "{}");
    if (r.date !== today()) return { date: today(), solo: 0, mp: 0 };
    return { date: today(), solo: r.solo || 0, mp: r.mp || 0 };
  } catch {
    return { date: today(), solo: 0, mp: 0 };
  }
}

function write(u: Usage): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(u));
}

/** Parties restantes aujourd'hui pour ce mode (Infinity si Pro). */
export function remaining(mode: LimitedMode): number {
  if (isPro()) return Infinity;
  const u = read();
  return Math.max(0, FREE_LIMITS[mode] - u[mode]);
}

export function canPlay(mode: LimitedMode): boolean {
  return isPro() || remaining(mode) > 0;
}

export function recordPlay(mode: LimitedMode): void {
  if (isPro()) return;
  const u = read();
  u[mode] += 1;
  write(u);
}
