"use client";

import { isPro } from "./pro";
import type { LimitedMode } from "./limits";

/**
 * Vérifie côté SERVEUR (par adresse IP) si une partie gratuite est encore
 * autorisée aujourd'hui. Empêche le contournement de la limite en changeant
 * de navigateur / en navigation privée / en vidant le cache.
 *
 * En cas d'erreur réseau ou de suivi non configuré, renvoie `true` :
 * on ne bloque jamais le jeu à cause d'un souci serveur.
 */
export async function serverAllowPlay(mode: LimitedMode): Promise<boolean> {
  try {
    const res = await fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, pro: isPro() }),
    });
    if (!res.ok) return true;
    const data = await res.json();
    return data?.allowed !== false;
  } catch {
    return true;
  }
}

/**
 * Vérifie (PEEK) si une partie est encore disponible aujourd'hui SANS la consommer.
 * Utilisé pour le lobby multijoueur : le décompte n'a lieu qu'au lancement.
 */
export async function serverCheckPlay(mode: LimitedMode): Promise<boolean> {
  try {
    const res = await fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, pro: isPro(), peek: true }),
    });
    if (!res.ok) return true;
    const data = await res.json();
    return data?.allowed !== false;
  } catch {
    return true;
  }
}
