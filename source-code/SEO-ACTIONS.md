# ViewGuessr — Plan SEO (à faire après déploiement)

> ⚠️ **Correction (14 juin 2026)** : ce document supposait à tort que `viewguesser.com` était une **ancienne version du site d'Adrien**. C'est FAUX — `viewguesser.com` est un **concurrent** (jeu rival « Devine les vues YouTube » en FR, nom quasi identique), qui n'appartient pas à Adrien. **La 301 décrite ci-dessous est donc impossible et caduque.** Voir `STRATEGIE-SEO.md` (§2 et §6) pour l'approche corrigée : dépasser le concurrent + verrouiller la marque, au lieu de rediriger.

## Diagnostic
- **Vrai site** : `view-guessr.com` (avec tiret) — bien configuré.
- **Ancien site** : `viewguesser.com` (sans tiret, "guesser") — ancienne version, c'est CELUI que Google affiche. Il cannibalise ta marque.
- Quand tu tapes "ViewGuessr" / "View Guessr" / "Guessr", rien ne sort car le site est récent (peu d'autorité) et les deux domaines brouillent le signal.
- Pas de logo dans les résultats car Google indexe l'ancien domaine, pas le bon.

## Corrections déjà faites dans le code (à déployer)
1. Marque "ViewGuessr" ajoutée dans le texte visible du hero (page.tsx).
2. Titre SERP nettoyé : "ViewGuessr — Devine les vues des vidéos YouTube".
3. favicon.ico régénéré avec les tailles 16→256px (Google exige ≥48px pour afficher le logo).

➡️ **Déploie** (push sur la branche de prod / `vercel --prod`) pour que ces changements soient en ligne.

## Actions hors-code (les plus importantes)

### 1. Régler l'ancien domaine viewguesser.com — PRIORITÉ N°1
C'est ce qui débloque tout. Deux options propres :
- **Idéal** : ajoute `viewguesser.com` comme domaine du projet Vercel `view-guessr.com`, puis définis `view-guessr.com` comme domaine principal. Vercel fera une redirection 301 automatique. Supprime l'ancien déploiement.
- **Sinon** : sur l'hébergeur de l'ancien site, mets une redirection 301 de toutes les URLs de `viewguesser.com` vers `https://view-guessr.com`.

Une 301 transfère l'autorité de l'ancien domaine vers le bon et fait disparaître le doublon dans Google.

### 2. Google Search Console (déjà vérifié pour view-guessr.com)
- Soumets le sitemap : `https://view-guessr.com/sitemap.xml`.
- Outil **Inspection d'URL** → colle `https://view-guessr.com/` → **Demander une indexation**. Répète pour /defi, /play/solo, /multiplayer, /pro.
- Ajoute aussi `viewguesser.com` dans Search Console et utilise l'outil **Changement d'adresse** vers view-guessr.com (après la 301).
- Vérifie dans Google : tape `site:view-guessr.com` — ça montre ce qui est réellement indexé.

### 3. Construire la marque (ce qui fait remonter "ViewGuessr")
- Crée quelques liens entrants : App Store, fiche TikTok/Insta dans la bio, Product Hunt, Reddit, forums de jeux FR.
- Le logo Google et le classement "marque" apparaissent généralement sous 1 à 3 semaines après la 301 + l'indexation.

## Note
"Guessr" seul restera difficile (terme générique dominé par GeoGuessr). Vise "ViewGuessr" et "View Guessr" — c'est ta marque réelle et atteignable.
