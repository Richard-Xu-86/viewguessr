// Thèmes de partie PARTAGÉS entre le solo et le multijoueur.
// Chaque thème pointe vers une catégorie YouTube ; « Tout » = vidéos
// tendances mélangées (aucune catégorie envoyée à l'API).

export interface Theme {
  key: string;
  label: string;
  /** Id de catégorie YouTube ("all" = aucune catégorie). */
  cat: string;
}

export const THEMES: Theme[] = [
  { key: "all", label: "Tout", cat: "all" },
  { key: "gaming", label: "Gaming", cat: "20" },
  { key: "music", label: "Musique", cat: "10" },
  { key: "sport", label: "Sport", cat: "17" },
];
