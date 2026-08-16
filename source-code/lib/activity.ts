"use client";

// Activité en direct (preuve sociale) : lecture du compteur + scores récents,
// et journalisation d'une partie terminée. Best-effort, ne casse jamais le jeu.

export interface ActivityItem {
  name: string;
  score: number;
  mode: string;
  created_at: string;
}

export interface ActivitySnapshot {
  todayCount: number;
  recent: ActivityItem[];
}

export async function fetchActivity(): Promise<ActivitySnapshot | null> {
  try {
    const res = await fetch("/api/activity", { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ActivitySnapshot;
  } catch {
    return null;
  }
}

export interface Percentile {
  percentile: number | null;
  sample: number;
}

/** Pourcentage de joueurs battus (24 h). null si indisponible. */
export async function fetchPercentile(score: number): Promise<Percentile | null> {
  try {
    const res = await fetch(`/api/percentile?score=${Math.round(score)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Percentile;
  } catch {
    return null;
  }
}

/** Journalise une partie terminée (fire-and-forget). */
export function logActivity(
  name: string,
  score: number,
  mode: "solo" | "defi" | "multi" | "hl"
): void {
  try {
    const clean =
      (name || "").replace(/\s*✦\s*$/, "").trim().slice(0, 24) || "Un joueur";
    void fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: clean, score: Math.round(score), mode }),
      keepalive: true,
    });
  } catch {
    /* best effort */
  }
}
