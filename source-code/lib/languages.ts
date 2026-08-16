// Langues de vidéos PARTAGÉES entre le solo et le multijoueur.
// L'API YouTube « mostPopular » fonctionne par pays : chaque langue est donc
// mappée vers le ou les pays dont les tendances sont dans cette langue.
// « Toutes » = mélange de pays variés (comportement historique).

export interface Lang {
  key: string;
  label: string;
  flag: string;
  /** Codes pays YouTube associés (null = mélange par défaut). */
  regions: string[] | null;
}

export const LANGS: Lang[] = [
  { key: "all", label: "Toutes", flag: "🌍", regions: null },
  { key: "fr", label: "Français", flag: "🇫🇷", regions: ["FR"] },
  { key: "en", label: "Anglais", flag: "🇺🇸", regions: ["US", "GB", "CA"] },
  { key: "es", label: "Espagnol", flag: "🇪🇸", regions: ["ES", "MX"] },
  { key: "de", label: "Allemand", flag: "🇩🇪", regions: ["DE"] },
  { key: "pt", label: "Portugais", flag: "🇧🇷", regions: ["BR"] },
  { key: "ko", label: "Coréen", flag: "🇰🇷", regions: ["KR"] },
  { key: "ja", label: "Japonais", flag: "🇯🇵", regions: ["JP"] },
  { key: "hi", label: "Hindi", flag: "🇮🇳", regions: ["IN"] },
];

export function isLangKey(k: string | null | undefined): boolean {
  return !!k && LANGS.some((l) => l.key === k);
}

export function regionsFor(key: string | null | undefined): string[] | null {
  return LANGS.find((l) => l.key === key)?.regions ?? null;
}
