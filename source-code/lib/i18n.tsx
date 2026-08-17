"use client";

// i18n léger SANS dépendance ni changement de routage : la langue est un état
// React mémorisé en localStorage et détecté depuis le navigateur au 1er passage.
// Rendu initial toujours en FR (serveur + 1er rendu client) → pas de mismatch
// d'hydratation ; bascule éventuelle vers EN après montage.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { messages, type MsgKey } from "./messages";

export type Locale = "fr" | "en";

const KEY = "vg_locale";

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<Ctx>({ locale: "en", setLocale: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // 1) Choix explicite de l'utilisateur (toggle) → prioritaire et persistant.
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "fr" || saved === "en") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
        return;
      }
    } catch {
      /* ignore */
    }
    // 2) Détection auto : FRANÇAIS uniquement pour les visiteurs francophones,
    //    ANGLAIS par défaut pour tout le monde d'autre (langue internationale).
    //    On regarde la langue préférée + toute la liste des langues du navigateur.
    const prefs =
      typeof navigator !== "undefined"
        ? [navigator.language, ...(navigator.languages || [])]
        : [];
    const primary = (prefs[0] || "").toLowerCase();
    const detected: Locale = primary.startsWith("fr") ? "fr" : "en";
    setLocaleState(detected);
    document.documentElement.lang = detected;
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l;
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Ctx {
  return useContext(LocaleContext);
}

export type TFunc = (key: MsgKey, vars?: Record<string, string | number>) => string;

/** Hook de traduction : t("home.hero.title", { count: 3 }). */
export function useT(): TFunc {
  const { locale } = useContext(LocaleContext);
  return useCallback(
    (key: MsgKey, vars?: Record<string, string | number>) => {
      const entry = messages[key];
      let s = entry ? entry[locale] : (key as string);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return s;
    },
    [locale]
  );
}

// --- Formatage des nombres sensible à la langue ---------------------------

/** "1,2 M" (fr) / "1.2M" (en), "987 k" / "987K", "3,4 Md" / "3.4B". */
export function compactViewsL(n: number, locale: Locale): string {
  const dec = (x: number) =>
    x.toFixed(1).replace(".0", "").replace(".", locale === "fr" ? "," : ".");
  if (locale === "en") {
    if (n >= 1_000_000_000) return dec(n / 1_000_000_000) + "B";
    if (n >= 1_000_000) return dec(n / 1_000_000) + "M";
    if (n >= 1_000) return dec(n / 1_000) + "K";
    return `${n}`;
  }
  if (n >= 1_000_000_000) return dec(n / 1_000_000_000) + " Md";
  if (n >= 1_000_000) return dec(n / 1_000_000) + " M";
  if (n >= 1_000) return dec(n / 1_000) + " k";
  return `${n}`;
}

/** "1 234 567" (fr) / "1,234,567" (en). */
export function groupedViewsL(n: number, locale: Locale): string {
  return Math.round(n).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

/** Locale BCP-47 pour toLocaleString. */
export function intlLocale(locale: Locale): string {
  return locale === "fr" ? "fr-FR" : "en-US";
}
