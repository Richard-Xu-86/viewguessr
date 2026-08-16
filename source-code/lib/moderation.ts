// Modération légère du multijoueur.
// Objectif : empêcher les pseudos et messages clairement haineux ou injurieux
// (ex. « Hitler »). Ce n'est PAS un filtre parfait — juste un garde-fou simple.
//
// Principe : on « normalise » le texte (minuscules, accents retirés, leetspeak
// replié, ponctuation/espaces supprimés) pour déjouer les contournements
// basiques (« H1tl3r », « h.i.t.l.e.r », « Nâzi »…), puis on cherche les termes
// interdits en sous-chaîne.

// Termes interdits (forme déjà « normalisée » : minuscules, sans accent).
// Choisis volontairement DISTINCTIFS pour éviter les faux positifs.
const BANNED_RAW = [
  // Haine / nazisme / extrémisme
  "hitler",
  "adolfhitler",
  "nazi",
  "nazisme",
  "naziste",
  "fuhrer",
  "heilhitler",
  "siegheil",
  "kukluxklan",
  "kluxklan",
  "swastika",
  "croixgammee",
  "whitepower",
  "suprematieblanche",
  // Insultes racistes
  "nigger",
  "nigga",
  "negre",
  "negresse",
  "bougnoule",
  "bougnoul",
  "bicot",
  "chinetoque",
  "niakoue",
  // Antisémitisme
  "youpin",
  "youtre",
  // Homophobie
  "faggot",
  "tarlouze",
  "tafiole",
  "tantouze",
  // Pédocriminalité
  "pedophile",
  "pedonazi",
  // Injures fortes
  "encule",
  "enculer",
  "filsdepute",
  "ntm",
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents
    .replace(/0/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/[4@]/g, "a")
    .replace(/[5$]/g, "s")
    .replace(/7/g, "t")
    .replace(/[^a-z]/g, ""); // ne garde que les lettres
}

const BANNED = BANNED_RAW.map(normalize).filter(Boolean);

/** Vrai si le texte contient un terme interdit (utilisé pour refuser un pseudo). */
export function containsBannedWord(text: string): boolean {
  const n = normalize(text);
  if (!n) return false;
  return BANNED.some((b) => n.includes(b));
}

/** Remplace les mots interdits d'un message par ●●● (le reste est conservé). */
export function censorText(text: string): string {
  return text
    .split(/(\s+)/)
    .map((token) =>
      /\S/.test(token) && containsBannedWord(token) ? "●●●" : token
    )
    .join("");
}
