"use client";

import { useEffect } from "react";
import { isPro, setPro } from "@/lib/pro";

// Détecte automatiquement l'accès à vie déjà acheté depuis le même réseau (IP),
// sans aucune saisie. S'exécute une fois par session si l'accès n'est pas déjà actif.
// Une fois détecté, l'accès est mémorisé localement (persiste même si l'IP change).
export function ProSync() {
  useEffect(() => {
    if (isPro()) return;
    try {
      if (sessionStorage.getItem("vg_prosync") === "1") return;
      sessionStorage.setItem("vg_prosync", "1");
    } catch {
      /* sessionStorage indisponible */
    }
    fetch("/api/pro-status")
      .then((r) => r.json())
      .then((d) => {
        if (d?.pro) setPro(true);
      })
      .catch(() => {});
  }, []);
  return null;
}
