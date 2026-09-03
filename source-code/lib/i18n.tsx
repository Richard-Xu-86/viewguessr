"use client";

// i18n léger SANS dépendance ni changement de routage : la langue est un état
// React mémorisé en localStorage.
//
// L'ANGLAIS est la langue par défaut pour TOUT LE MONDE. La langue du navigateur
// n'est jamais consultée : seul un clic explicite sur le bouton FR/EN change la
// langue, et ce choix est ensuite persistant d'une visite à l'autre.
// Serveur et 1er rendu client sont donc toujours en anglais → aucun mismatch
// d'hydratation ; bascule éventuelle vers le français après montage.

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
    // SEULE source de français : un choix explicite fait via le bouton FR/EN lors
    // d'une visite précédente. Sans ce choix, on reste en anglais — y compris pour
    // un navigateur configuré en français.
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "fr") {
        setLocaleState("fr");
        document.documentElement.lang = "fr";
        return;
      }
    } catch {
      /* ignore */
    }
    document.documentElement.lang = "en";
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
