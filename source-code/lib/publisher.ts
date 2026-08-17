/**
 * Identité de l'éditeur du site — SOURCE UNIQUE.
 *
 * Publisher / site-owner identity — SINGLE SOURCE OF TRUTH.
 *
 * Ces valeurs alimentent les mentions légales, les CGU/CGV, la politique de
 * confidentialité, les données structurées (JSON-LD) et les pieds de page.
 * Elles étaient auparavant recopiées dans 8 fichiers ; ne les dupliquez plus.
 *
 * ⚠️ Les champs marqués TODO_ doivent être remplis avant de passer en
 * production / d'accepter de vrais paiements. Cherchez "TODO_" pour les
 * trouver tous.
 *
 * Les champs optionnels (null) ne sont pas affichés : mettez null pour tout
 * ce qui ne s'applique pas à votre juridiction.
 */
export const PUBLISHER = {
  /** Nom commercial affiché partout (marque). */
  tradingName: "ViewGuessr",

  /** Personne ou société juridiquement responsable du site. */
  legalName: "Richard Xu",

  /** Ex. « entreprise individuelle », « sole proprietorship », « Inc. ». */
  entityType: "entreprise individuelle",

  /**
   * Numéro d'enregistrement, si votre juridiction en impose un.
   * FR : SIREN / SIRET · CA : Business Number · null si aucun.
   */
  registrationLabel: null as string | null,
  registrationNumber: null as string | null,

  /** Code d'activité (FR : APE/NAF). null si non applicable. */
  activityCode: null as string | null,

  /** Adresse publiée. Une ville + un pays suffisent généralement. */
  city: "Toronto",
  region: "Ontario",
  country: "Canada",
  /** ISO 3166-1 alpha-2, pour le JSON-LD. Ex. "CA", "FR". */
  countryCode: "CA",

  /** Adresse de contact publique (support, RGPD, litiges). */
  email: "contact@view-guessr.com",

  /** Directeur de la publication (FR). Souvent identique à legalName. */
  publicationDirector: "Richard Xu",

  /** Mention TVA, si applicable. null pour ne rien afficher. */
  vatNote: null as string | null,

  /** Droit applicable en cas de litige. Ex. « le droit français ». */
  governingLaw: "la loi de la province de l'Ontario (Canada)",
} as const;

/** Ex. "Montréal, Québec, Canada" — parties vides ignorées. */
export function publisherLocation(): string {
  return [PUBLISHER.city, PUBLISHER.region, PUBLISHER.country]
    .filter((p) => p && !p.startsWith("TODO_"))
    .join(", ");
}
