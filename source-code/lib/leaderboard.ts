"use client";

// Classement quotidien du Défi du jour. Identité « client » anonyme stockée
// localement (pas de compte) : sert à dédupliquer un score par jour et à
// repérer sa propre ligne dans le classement.

const CID_KEY = "vg_client_id";

export function clientId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(CID_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `c_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(CID_KEY, id);
  }
  return id;
}

export interface LBEntry {
  rank: number;
  name: string;
  score: number;
  mine: boolean;
}

export interface LBData {
  top: LBEntry[];
  total: number;
  rank: number | null;
}

const EMPTY: LBData = { top: [], total: 0, rank: null };

export async function fetchDailyLeaderboard(day: string): Promise<LBData> {
  try {
    const res = await fetch(
      `/api/daily-leaderboard?day=${encodeURIComponent(day)}&cid=${encodeURIComponent(
        clientId()
      )}`,
      { cache: "no-store" }
    );
    if (!res.ok) return EMPTY;
    return (await res.json()) as LBData;
  } catch {
    return EMPTY;
  }
}

/** Publie (ou met à jour) mon score du jour. Best-effort. */
export async function submitDailyScore(
  day: string,
  name: string,
  score: number
): Promise<void> {
  try {
    await fetch("/api/daily-leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, cid: clientId(), name, score }),
    });
  } catch {
    /* silencieux : le classement ne doit jamais casser le jeu */
  }
}
