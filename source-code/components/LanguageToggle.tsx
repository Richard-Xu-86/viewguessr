"use client";

import { useLocale } from "@/lib/i18n";

// Bascule FR/EN. Le drapeau ET le code désignent tous deux la langue VERS
// laquelle on bascule : en anglais le bouton affiche « 🇫🇷 FR » (= passer en
// français), en français « 🇬🇧 EN ». Le choix est mémorisé (localStorage).
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const other = locale === "fr" ? "en" : "fr";
  return (
    <button
      onClick={() => setLocale(other)}
      aria-label={other === "en" ? "Switch to English" : "Passer en français"}
      title={other === "en" ? "Switch to English" : "Passer en français"}
      className={`flex h-9 items-center gap-1.5 rounded-full border-2 border-platinum/15 bg-white px-3 text-xs font-bold uppercase tracking-wider text-lavender transition hover:border-platinum/40 hover:text-platinum ${className}`}
    >
      <span aria-hidden>{other === "fr" ? "🇫🇷" : "🇬🇧"}</span>
      <span>{other.toUpperCase()}</span>
    </button>
  );
}
