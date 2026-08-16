// Formatage des nombres de vues miroir de l'app iOS.

/** "1,2 M", "987 k", "3,4 Md" */
export function compactViews(n: number): string {
  if (n >= 1_000_000_000)
    return (n / 1_000_000_000).toFixed(1).replace(".0", "").replace(".", ",") + " Md";
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",") + " M";
  if (n >= 1_000)
    return (n / 1_000).toFixed(1).replace(".0", "").replace(".", ",") + " k";
  return `${n}`;
}

/** "1,2 M d'abonnés", "987 k d'abonnés", "412 abonnés" */
export function compactSubs(n: number): string {
  const c = compactViews(n);
  return /[kM]|Md/.test(c) ? `${c} d'abonnés` : `${c} abonné${n > 1 ? "s" : ""}`;
}

/** "1 234 567" (espaces comme séparateurs de milliers) */
export function groupedViews(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
