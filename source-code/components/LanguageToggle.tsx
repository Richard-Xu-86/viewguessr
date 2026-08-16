"use client";

import { useLocale } from "@/lib/i18n";

// Bascule FR/EN. Affiche la langue VERS laquelle on bascule (ex. en FR → "EN").
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const other = locale === "fr" ? "en" : "fr";
  return (
    <button
      onClick={() => setLocale(other)}
      aria-label={other === "en" ? "Switch to English" : "Passer en français"}
      title={other === "en" ? "English" : "Français"}
      className={`flex h-9 items-center gap-1.5 rounded-full border-2 border-platinum/15 bg-white px-3 text-xs font-bold uppercase tracking-wider text-lavender transition hover:border-platinum/40 hover:text-platinum ${className}`}
    >
      <span aria-hidden>{locale === "fr" ? "🇫🇷" : "🇬🇧"}</span>
      <span>{other.toUpperCase()}</span>
    </button>
  );
}
