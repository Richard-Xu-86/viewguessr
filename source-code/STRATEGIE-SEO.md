# Stratégie SEO ViewGuessr — plan professionnel

> Objectif : faire de **ViewGuessr** une référence du **« guessr »** et du **jeu en ligne entre potes**, sur Google et sur le web en général (FR + EN).
> Document de référence — mis à jour le 14 juin 2026. Complète et remplace `SEO-ACTIONS.md`.

---

## 1. Résumé exécutif

ViewGuessr a une base technique SEO déjà solide (métadonnées propres, OpenGraph/Twitter, JSON-LD, sitemap, robots, Search Console vérifié). Les deux vrais freins ne sont **pas** techniques :

1. **Manque d'autorité** : domaine récent, presque aucun lien entrant, marque inconnue de Google.
2. **Manque de contenu indexable** : avant ce chantier, le site n'était qu'une landing + des pages de jeu. Rien ne « capturait » les recherches réelles des internautes.

Ce chantier agit sur les deux. La partie **code** (livrée, à déployer) ajoute du contenu qui se positionne et renforce la compréhension de la marque. La partie **hors-code** (ce document) construit l'autorité — c'est 70 % du travail restant, et il se fait surtout à la main.

**La règle d'or** : le SEO d'un site jeune se gagne avec du **contenu utile** + des **liens entrants** + de la **patience** (1 à 3 mois pour voir bouger les positions de marque, 3 à 6 mois pour le reste).

---

## 2. Diagnostic / audit

### Ce qui va déjà bien
- `view-guessr.com` : canonical, `metadataBase`, sitemap, robots, JSON-LD (WebSite + Organization PENRA + VideoGame), vérification GSC en place.
- Métadonnées par page (titre, description, canonical) sur les pages de jeu.
- Bon socle de performance (DA « print » sans flou, `content-visibility`, polices preconnect).
- OG/Twitter images dynamiques à la racine → héritées par toutes les pages.

### Ce qui bloque
| Problème | Impact | Action |
|---|---|---|
| **Concurrent** `viewguesser.com` (sans tiret) — PAS à Adrien : jeu rival, même concept « deviner les vues YouTube » en FR, nom quasi identique | Confusion de marque possible + concurrence directe sur tes requêtes FR | Le **dépasser** (autorité + contenu), pas le rediriger. **Verrouiller** la marque « ViewGuessr » / view-guessr.com partout |
| Domaine récent, ~0 backlink | Aucune autorité → rien ne se positionne, même la marque | Netlinking (cf. §7) |
| Peu de contenu ciblant des requêtes | Aucune porte d'entrée depuis la recherche | **Pages de contenu** (livrées, cf. §3) |
| Pas de version EN indexable | 0 trafic international alors que « guessr » est un terme anglophone | **Pages /en + hreflang** (livrées) |
| Marque absente des annuaires/communautés | Pas de notoriété ni de liens | Soumissions + communautés (cf. §7) |

### Réalité du marché (recherche concurrentielle)
- **Concurrent direct FR — à connaître** : `viewguesser.com` (« Devine les vues YouTube — Le Jeu d'Intuition Ultime ») vise exactement ta requête principale, en français, avec un nom quasi identique (guess**er** vs guess**r**). C'est ton rival n°1 à dépasser, et la raison pour laquelle **verrouiller ta marque** (écrire « ViewGuessr » + le domaine partout) est critique : sans ça, Google peut confondre les deux.
- **« guess the youtube views »** est déjà occupé par des jeux *higher or lower* : `moreorless.io`, `thumbnailgame.com`, `theyoutubegame.net`, `higherorlowergame.com`. **Angle différenciant de ViewGuessr** : on devine le **nombre exact** (curseur), sur de **vraies vidéos tendance**, avec un **multijoueur entre amis par code**. À marteler partout.
- **« jeux entre potes »** (FR) est dominé par des listicles (Topito, Bilboquet, GeeksByGirls) et des plateformes (Poki, Skribbl, Among Us). On ne « bat » pas ces listicles frontalement : on **s'y fait inclure** (outreach) et on capte la longue traîne avec notre propre page.
- **« guessr » seul** restera dominé par GeoGuessr. On ne vise pas la position 1 dessus : on vise **« c'est quoi un guessr », « alternative geoguessr », « jeux comme geoguessr »** — atteignables et qualifiés.

---

## 3. Ce qui a été implémenté dans le code (à déployer)

> Tous ces fichiers sont dans `viewguessr-web/`. Rien n'a été supprimé ; les ajouts sont additifs. À déployer depuis ton Mac (push → Vercel).

**Nouvelles pages de contenu (rendu serveur = 100 % indexable, DA « print » respectée) :**

| URL | Cible principale | Équivalent |
|---|---|---|
| `/jeux-entre-potes` | jeux entre potes / amis en ligne sans inscription | `/en/games-to-play-with-friends` |
| `/c-est-quoi-un-guessr` | guessr, alternative GeoGuessr | `/en/guessr-games` |
| `/en` | viewguessr, guess the youtube views game | `/` |
| `/en/games-to-play-with-friends` | games to play with friends online | `/jeux-entre-potes` |
| `/en/guessr-games` | guessr games, geoguessr alternative | `/c-est-quoi-un-guessr` |

**Données structurées (composants réutilisables dans `components/seo/`) :**
- `Breadcrumbs.tsx` — fil d'Ariane visible + `BreadcrumbList` (rich result **toujours supporté** par Google).
- `Faq.tsx` — FAQ visible (accordéon, sans JS) + `FAQPage`.
- `ArticleLd.tsx` — schéma `Article` reliant chaque guide à l'éditeur PENRA.
- `JsonLd.tsx` enrichi : le jeu déclare désormais `playMode` (solo + multi), `numberOfPlayers` (1–10), `genre`.

**Référencement multilingue :**
- `hreflang` FR ⇄ EN sur chaque paire de pages + sur l'accueil (`app/layout.tsx`).
- `sitemap.ts` mis à jour : nouvelles pages + balises `hreflang` (`xhtml:link`).

**Maillage interne :**
- Colonne « Guides » ajoutée au footer de l'accueil (liens localisés FR/EN).
- Liens croisés entre les guides et les pages de jeu.

> ⚠️ **Note d'expert (2026)** : Google a retiré les *rich results* **FAQ** (7 mai 2026) et **HowTo** (2023–2024). On garde le JSON-LD FAQ (sans danger, utile pour Bing et les *AI Overviews*), mais **le vrai gain vient du texte FAQ visible** — c'est lui qui nourrit les featured snippets et les réponses IA. On n'a donc pas sur-investi dans du HowTo décoratif.

---

## 4. Recherche de mots-clés

Priorités : **P0** = marque (à sécuriser d'abord), **P1** = atteignable et qualifié, **P2/P3** = ambitieux ou longue traîne.

### Français
| Mot-clé | Intention | Page cible | Concurrence | Priorité |
|---|---|---|---|---|
| viewguessr / view guessr | marque | `/` | faible | **P0** |
| jeu deviner vues youtube | transac | `/` , `/play/solo` | faible | **P1** |
| c'est quoi un guessr | info | `/c-est-quoi-un-guessr` | faible | **P1** |
| jeux comme geoguessr / alternative geoguessr | info/transac | `/c-est-quoi-un-guessr` | moyenne | **P1** |
| jeux entre potes en ligne | transac | `/jeux-entre-potes` | forte | **P1** |
| jeux entre amis sans inscription | transac | `/jeux-entre-potes` | moyenne | **P1** |
| jeu youtube gratuit en ligne | transac | `/` | moyenne | P2 |
| jeux à faire à distance entre amis | info | `/jeux-entre-potes` | forte | P2 |
| jeu multijoueur navigateur | transac | `/multiplayer` | forte | P3 |

### Anglais
| Mot-clé | Intention | Page cible | Concurrence | Priorité |
|---|---|---|---|---|
| viewguessr | marque | `/en` | faible | **P0** |
| guess the youtube views (game) | transac | `/en` | moyenne | **P1** |
| guessr games / what is a guessr | info | `/en/guessr-games` | faible | **P1** |
| geoguessr alternative (free) | info/transac | `/en/guessr-games` | moyenne | **P1** |
| youtube views game | transac | `/en` | moyenne | P2 |
| games to play with friends online | transac | `/en/games-to-play-with-friends` | très forte | P2 |
| online games no sign up | transac | `/en/games-to-play-with-friends` | forte | P2 |

---

## 5. Plan de contenu / calendrier éditorial

Le contenu déjà livré couvre les piliers. Pour devenir une **référence**, il faut publier régulièrement des articles « data » qui attirent des liens et captent du volume, puis renvoient vers le jeu (maillage interne).

**Cadence cible : 1 article toutes les 2 semaines** (réaliste en solo). Chaque article : 800–1 500 mots, 1 FAQ, 2–3 liens internes vers les pages de jeu.

| # | Article (FR) | Cible | Pourquoi |
|---|---|---|---|
| 1 | Top 20 des vidéos YouTube les plus vues de tous les temps | volume élevé, evergreen | Aimant à liens + renvoie vers le jeu |
| 2 | Les YouTubeurs français avec le plus de vues | volume FR | Topical, partageable |
| 3 | Les meilleurs jeux à jouer sur Discord entre amis | audience Discord | Capte la cible « entre potes » |
| 4 | MrBeast en chiffres : ses vidéos les plus vues | tendance | Les concurrents rankent dessus |

| # | Article (EN) | Cible | Pourquoi |
|---|---|---|---|
| 1 | Most viewed YouTube videos of all time | gros volume | Aimant à liens international |
| 2 | Best games to play with friends on Discord | audience Discord | Longue traîne « with friends » |
| 3 | Higher or Lower: YouTube views — how to get good | niche concurrents | Capte leur trafic |

> Astuce : les articles « les plus vues » se mettent à jour facilement et restent pertinents des années. Ce sont les meilleurs investissements long terme.

---

## 6. SEO technique — checklist d'actions (toi)

**Priorité n°1 — être indexé vite et verrouiller ta marque**
> Correction : `viewguesser.com` n'appartient **pas** à Adrien — c'est un **concurrent** (même concept FR), pas une ancienne version. **Aucune 301 possible.** L'enjeu n'est donc pas de rediriger, mais de se faire indexer et de **dépasser** le concurrent.
- [ ] Déployer (cf. ci-dessous), puis GSC → soumettre le sitemap + demander l'indexation des pages clés.
- [ ] **Verrouiller la marque** : partout (bios réseaux, annuaires, posts), écrire exactement « ViewGuessr » + le lien `view-guessr.com`. Plus le couple nom+domaine est répété sur le web, plus Google l'associe à toi et te distingue de « viewguesser ».
- [ ] **Dépasser le concurrent** = course à l'autorité → le netlinking (§7) devient la priorité absolue, pas une option.
- [ ] Jauger l'adversaire : compare `site:viewguesser.com` et `site:view-guessr.com` dans Google (nombre de pages indexées de chaque côté).

**Déploiement & indexation**
- [ ] Déployer ce chantier (push → Vercel).
- [ ] GSC → soumettre `https://view-guessr.com/sitemap.xml`.
- [ ] GSC → **Inspection d'URL** → « Demander une indexation » pour : `/`, `/en`, `/jeux-entre-potes`, `/c-est-quoi-un-guessr`, `/en/games-to-play-with-friends`, `/en/guessr-games`, `/defi`, `/multiplayer`.
- [ ] Vérifier `site:view-guessr.com` dans Google (ce qui est réellement indexé).
- [ ] Tester 2–3 pages dans le **Test des résultats enrichis** (breadcrumb + données du jeu).

**Hygiène continue**
- [ ] Vérifier Core Web Vitals dans GSC (onglet « Signaux web essentiels ») une fois indexé.
- [ ] Quand les réseaux sociaux existeront, ajouter `sameAs` (URLs TikTok/Insta/X) dans `JsonLd.tsx` (Organization) — ça renforce l'entité de marque.
- [ ] (Confort) Images OG dédiées par page de contenu (actuellement l'OG racine est hérité — suffisant pour démarrer).

---

## 7. Off-site / netlinking — construire l'autorité

C'est **le** levier qui manque. Objectif : 15–30 liens/citations de qualité en 3 mois. Jamais d'achat de liens, jamais de spam.

### A. Soumissions & annuaires (rapides, gros ROI)
- [ ] **alternativeto.net** : ajouter ViewGuessr comme alternative à **GeoGuessr** et aux jeux *higher or lower*. (lien + trafic qualifié)
- [ ] **Product Hunt** : préparer un lancement propre (visuel, GIF de gameplay, tagline). Effet « pic » de trafic + backlink durable.
- [ ] **Plateformes de jeux web** : itch.io, CrazyGames, GameDistribution, Newgrounds — soumettre la version web.
- [ ] **Annuaires indie** : BetaList, Indie Hackers (post de lancement), SaaSHub.
- [ ] **Awwwards / Land-book** (la DA print est jolie → vitrine + lien).

### B. Communautés (valeur d'abord, lien ensuite)
- [ ] **Reddit** : r/InternetIsBeautiful, r/WebGames, r/playmygame, r/GeoGuessr (poster en tant qu'« alternative YouTube »). Lire les règles, apporter de la valeur, pas de spam.
- [ ] **FR** : forums/Discord de gamers, communautés Epitech/écoles, r/france (avec parcimonie et contexte).
- [ ] **Discord** : serveurs « jeux entre potes » — partager le mode multi par code.

### C. Outreach listicles (le plus rentable en FR)
Les articles « jeux entre potes » se classent déjà très bien. **But : s'y faire ajouter.** Cibles repérées : Topito, Bilboquet Magazine, GeeksByGirls, TechRadar FR.

> **Template email (à adapter) :**
> Objet : Une idée de jeu pour votre article « [titre exact] »
> Bonjour [prénom], j'ai lu votre article sur les jeux à faire entre amis en ligne — super sélection. Je développe **ViewGuessr**, un petit jeu gratuit et sans inscription où l'on devine les vues de vraies vidéos YouTube (solo ou multijoueur par code, jusqu'à 10 joueurs). Ça pourrait coller à votre liste si vous la mettez à jour : view-guessr.com. Quoi qu'il en soit, merci pour l'article ! [Prénom]

### D. Tes propres propriétés (gratuit, immédiat)
- [ ] Lien view-guessr.com dans les **bios** TikTok / Instagram / X.
- [ ] Lien dans le **README GitHub** du dépôt (si public) et profil.
- [ ] Signature email / Epitech.

---

## 8. Réseaux sociaux & partage

### Boucle virale « partage de score » (gros levier — à coder)
Recommandation produit : à la fin d'une partie (surtout **/defi**, le même défi pour tous), ajouter un bouton **« Partager mon score »** qui copie un texte + un lien `view-guessr.com/defi` et génère une **image OG dynamique** avec le score. Chaque partage = signal social + visite + backlink potentiel. C'est le mécanisme qui a fait exploser Wordle/GeoGuessr.

### Contenu social
- [ ] **TikTok / Shorts / Reels** : tu as déjà le studio `penra-video` qui génère des promos. Publier **régulièrement** (2–3/sem.), lien en bio. C'est ta meilleure source de notoriété de marque → qui nourrit ensuite les recherches « viewguessr » sur Google.
- [ ] **X/Twitter** : compte de marque, poster les scores marrants, les vidéos les plus surprenantes.
- [ ] Optimiser l'aperçu de partage (déjà en place : OG/Twitter large image) — vérifier le rendu via le validateur de partage.

---

## 9. Mesure / KPI

| Indicateur | Outil | Cadence | Cible 3 mois |
|---|---|---|---|
| Pages indexées | `site:view-guessr.com` + GSC | hebdo | toutes les pages clés |
| Impressions / clics | GSC (Performances) | hebdo | tendance ↗ nette |
| Position « viewguessr » / « view guessr » | GSC + recherche manuelle | hebdo | **top 1–3** |
| Position « c'est quoi un guessr » / « guessr games » | GSC | mensuel | **top 10** |
| Trafic & rétention | Vercel Analytics (déjà installé) | hebdo | ↗ |
| Backlinks / domaines référents | GSC (Liens) | mensuel | 15–30 liens |

> Revue **mensuelle** : 30 min pour regarder GSC (requêtes qui montent), ajuster les titres/descriptions des pages qui ont des impressions mais peu de clics, et choisir le prochain article.

---

## 10. Roadmap priorisée

**Semaine 1 — débloquer (critique)**
1. 301 `viewguesser.com` → `view-guessr.com` + Changement d'adresse GSC.
2. Déployer ce chantier.
3. Soumettre le sitemap + demander l'indexation des 8 pages clés.
4. Ajouter les liens en bio TikTok/Insta/X.

**Mois 1 — amorcer l'autorité**
5. alternativeto.net + itch.io/CrazyGames + 1 lancement Product Hunt.
6. 3 posts communautés (Reddit/Discord), avec valeur.
7. 5 emails d'outreach listicles FR.
8. Publier 2 articles (1 FR « vidéos les plus vues », 1 EN équivalent).

**Mois 2–3 — transformer en référence**
9. Coder la boucle « partage de score » (+ OG dynamique du défi).
10. 1 article / 2 semaines (calendrier §5).
11. Cadence TikTok régulière.
12. Revue mensuelle GSC + itérations sur titres/descriptions.

---

### En une phrase
Le code livré ouvre les portes ; **la 301 + le netlinking + la régularité du contenu et des vidéos** sont ce qui fera de ViewGuessr une référence. Le SEO récompense la constance bien plus que les coups d'éclat.
