"use client";

// Entitlement « accès à vie » stocké localement (le jeu n'a pas de comptes).
// Suffisant pour débloquer l'expérience côté client. Pour une version multi-appareils,
// on pourra plus tard lier l'achat à un e-mail/licence côté serveur.

const KEY = "vg_pro";

export function isPro(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function setPro(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) window.localStorage.setItem(KEY, "1");
  else window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("vg-pro-change"));
}

export const PRICE_CAD = 5.99;
/** @deprecated conservé le temps de la migration EUR -> CAD. */
export const PRICE_EUR = PRICE_CAD;
