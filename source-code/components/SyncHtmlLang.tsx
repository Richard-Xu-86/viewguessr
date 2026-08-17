"use client";

import { useEffect } from "react";

/**
 * Aligne <html lang> sur la langue réellement rendue par la page.
 *
 * Le <html> vit dans le layout racine (rendu statiquement en "en", la langue
 * par défaut du site). Les pages de contenu SEO françaises sont, elles,
 * explicitement en français : ce petit composant client corrige l'attribut
 * après l'hydratation pour que les lecteurs d'écran et les crawlers qui
 * exécutent le JS voient la bonne langue.
 */
export function SyncHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
