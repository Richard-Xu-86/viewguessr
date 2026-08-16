// Scoring identique à l'app iOS (échelle logarithmique).

export const MAX_POINTS_PER_ROUND = 5000;
export const DEFAULT_ROUNDS = 5;

/**
 * 5000 pts si parfait, décroissance exponentielle selon l'écart en ordre de grandeur.
 * Un facteur 2 d'écart ≈ 2600 pts, un facteur 10 ≈ 570 pts.
 */
export function points(guess: number, actual: number): number {
  if (guess <= 0 || actual <= 0) return 0;
  const diff = Math.abs(Math.log10(guess) - Math.log10(actual));
  const score = MAX_POINTS_PER_ROUND * Math.exp(-diff * 2.17);
  return Math.max(0, Math.min(MAX_POINTS_PER_ROUND, Math.round(score)));
}

export function scoreLabel(pts: number): string {
  if (pts >= 4500) return "Incroyable 🤯";
  if (pts >= 3500) return "Excellent 🔥";
  if (pts >= 2500) return "Très bien 👏";
  if (pts >= 1500) return "Pas mal 👍";
  if (pts >= 500) return "Loin… 😅";
  return "À côté de la plaque 💀";
}

/** Clé i18n du libellé de score (pour un rendu traduit via useT). */
export function scoreLabelKey(pts: number): string {
  if (pts >= 4500) return "score.incredible";
  if (pts >= 3500) return "score.excellent";
  if (pts >= 2500) return "score.great";
  if (pts >= 1500) return "score.notbad";
  if (pts >= 500) return "score.far";
  return "score.wayoff";
}

/** Couleur d'un score selon sa qualité (lisible sur thème clair). */
export function scoreColor(pts: number): string {
  if (pts >= 3500) return "#15803D"; // vert (excellent)
  if (pts >= 1500) return "#15171F"; // sombre (correct)
  return "#D80032"; // crimson (loin)
}
