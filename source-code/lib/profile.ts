"use client";

// Profil local minimal + suivi de la partie multijoueur en cours (pour la reprise).
// Pas de compte : tout est stocké dans le navigateur.

const NAME_KEY = "vg_player_name";
const ACTIVE_KEY = "vg_mp_active";

export interface ActiveGame {
  gameId: string;
  code: string;
  playerId: string;
}

export function getName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(NAME_KEY) ?? "";
}

export function setName(name: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NAME_KEY, name);
}

/** Partie multijoueur en cours (pour pouvoir s'y reconnecter). */
export function getActiveGame(): ActiveGame | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    return o && o.gameId && o.code && o.playerId ? (o as ActiveGame) : null;
  } catch {
    return null;
  }
}

export function setActiveGame(g: ActiveGame): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(g));
}

export function clearActiveGame(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACTIVE_KEY);
}
