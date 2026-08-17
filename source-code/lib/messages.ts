// Dictionnaire FR/EN de ViewGuessr. Une clé = une chaîne, deux langues.
// Variables interpolées avec {nom} (cf. useT).

export type MsgKey = string;

type Entry = { fr: string; en: string };

export const messages: Record<MsgKey, Entry> = {
  // --- Navigation / commun --------------------------------------------------
  "nav.howto": { fr: "Comment jouer", en: "How to play" },
  "nav.offers": { fr: "Offres", en: "Plans" },
  "nav.defi": { fr: "Défi", en: "Daily" },
  "nav.solo": { fr: "Solo", en: "Solo" },
  "nav.plusmoins": { fr: "Plus ou moins", en: "Higher or Lower" },
  "nav.multi": { fr: "Multijoueur", en: "Multiplayer" },
  "nav.pro": { fr: "Pro", en: "Pro" },

  "common.play": { fr: "Jouer", en: "Play" },
  "common.home": { fr: "Accueil", en: "Home" },
  "common.back": { fr: "← Retour", en: "← Back" },
  "common.backHome": { fr: "← Accueil", en: "← Home" },
  "common.cancel": { fr: "Annuler", en: "Cancel" },
  "common.retry": { fr: "Réessayer", en: "Try again" },
  "common.later": { fr: "Plus tard", en: "Later" },
  "common.replay": { fr: "Rejouer", en: "Play again" },
  "common.views": { fr: "vues", en: "views" },
  "common.points": { fr: "pts", en: "pts" },
  "common.theme": { fr: "Thème", en: "Theme" },
  "common.videoLang": { fr: "Langue des vidéos", en: "Video language" },
  "common.loading": { fr: "Chargement…", en: "Loading…" },
  "common.loadingVideos": { fr: "Chargement des vidéos…", en: "Loading videos…" },
  "common.backToHome": { fr: "Retour à l'accueil", en: "Back to home" },
  "common.oops": { fr: "Aucune vidéo disponible.", en: "No videos available." },

  // Thèmes
  "theme.all": { fr: "Tout", en: "All" },
  "theme.gaming": { fr: "Gaming", en: "Gaming" },
  "theme.music": { fr: "Musique", en: "Music" },
  "theme.sport": { fr: "Sport", en: "Sport" },
  // Langues
  "lang.all": { fr: "Toutes", en: "All" },
  "lang.fr": { fr: "Français", en: "French" },
  "lang.en": { fr: "Anglais", en: "English" },
  "lang.es": { fr: "Espagnol", en: "Spanish" },
  "lang.de": { fr: "Allemand", en: "German" },
  "lang.pt": { fr: "Portugais", en: "Portuguese" },
  "lang.ko": { fr: "Coréen", en: "Korean" },
  "lang.ja": { fr: "Japonais", en: "Japanese" },
  "lang.hi": { fr: "Hindi", en: "Hindi" },

  // --- En-tête / langue -----------------------------------------------------
  "lang.toggle": { fr: "EN", en: "FR" },
  "lang.label": { fr: "Langue", en: "Language" },

  // --- Accueil --------------------------------------------------------------
  "home.badge.live": { fr: "Tendances en direct", en: "Trending live" },
  "home.badge.noSignup": { fr: "Sans inscription", en: "No sign-up" },
  "home.hero.title1": { fr: "Devine", en: "Guess" },
  "home.hero.title2": { fr: "les vues.", en: "the views." },
  "home.hero.q": {
    fr: "Combien de vues fait cette vidéo ?",
    en: "How many views does this video have?",
  },
  "home.hero.desc": {
    fr: "À toi de flairer le carton ou le bide. En solo ou contre tes amis, sur de vraies vidéos YouTube.",
    en: "Sniff out the hit or the flop. Solo or against your friends, on real YouTube videos.",
  },
  "home.hero.playSolo": { fr: "Jouer en solo →", en: "Play solo →" },
  "home.odometer.views": { fr: "vues", en: "views" },
  "home.marquee.label": {
    fr: "En ce moment dans les tendances",
    en: "Trending right now",
  },

  "home.howto.title": { fr: "Trois étapes,", en: "Three steps," },
  "home.howto.titleAccent": { fr: "c'est parti", en: "let's go" },
  "home.howto.sub": {
    fr: "Pas de compte, pas de téléchargement. Tu arrives, tu joues.",
    en: "No account, no download. You show up, you play.",
  },
  "home.step1.title": { fr: "Regarde la vidéo", en: "Watch the video" },
  "home.step1.desc": {
    fr: "Une vraie vidéo YouTube tendance s'affiche : miniature, titre, chaîne. Son compteur de vues est masqué.",
    en: "A real trending YouTube video appears: thumbnail, title, channel. Its view count is hidden.",
  },
  "home.step2.title": { fr: "Devine les vues", en: "Guess the views" },
  "home.step2.desc": {
    fr: "Place le curseur sur le nombre de vues que tu penses être le bon, de 1 000 à 1 milliard.",
    en: "Set the slider to the view count you think is right, from 1,000 to 1 billion.",
  },
  "home.step3.title": { fr: "Marque des points", en: "Score points" },
  "home.step3.desc": {
    fr: "Plus tu es proche, plus tu marques. 5 000 points pour un sans-faute, zéro pour un naufrage.",
    en: "The closer you are, the more you score. 5,000 points for a perfect call, zero for a wipeout.",
  },

  "home.modes.title": { fr: "Quatre façons de jouer", en: "Four ways to play" },
  "home.modes.sub": {
    fr: "Le défi du jour, le solo pour battre ton record, le Plus ou moins en série infinie, ou le multi en temps réel contre tes amis.",
    en: "The daily challenge, solo to beat your record, Higher or Lower in an endless streak, or real-time multiplayer against your friends.",
  },

  "card.defi.title": { fr: "Défi du jour", en: "Daily challenge" },
  "card.defi.desc": {
    fr: "Les mêmes 5 vidéos pour tout le monde, une seule tentative par jour.",
    en: "The same 5 videos for everyone, one attempt per day.",
  },
  "card.defi.tag1": { fr: "1 partie / jour", en: "1 game / day" },
  "card.defi.tag2": { fr: "Score à partager", en: "Score to share" },
  "card.defi.streak": { fr: "série {n} j", en: "{n}-day streak" },
  "card.defi.cta": { fr: "Relever le défi", en: "Take the challenge" },

  "card.solo.title": { fr: "Solo", en: "Solo" },
  "card.solo.desc": {
    fr: "Cinq manches face à toi-même. Choisis le thème et la langue des vidéos, et bats ton record.",
    en: "Five rounds against yourself. Pick the theme and language of the videos, and beat your record.",
  },
  "card.solo.tag1": { fr: "5 manches", en: "5 rounds" },
  "card.solo.tag2": { fr: "Thème & langue au choix", en: "Theme & language of your choice" },
  "card.solo.tag3": { fr: "2 parties offertes / jour", en: "2 free games / day" },
  "card.solo.cta": { fr: "Jouer", en: "Play" },

  "card.pm.title": { fr: "Plus ou moins", en: "Higher or Lower" },
  "card.pm.desc": {
    fr: "Deux vidéos face à face : laquelle fait le plus de vues ? Une erreur et la série s'arrête.",
    en: "Two videos head to head: which has more views? One mistake and the streak ends.",
  },
  "card.pm.tag1": { fr: "Série infinie", en: "Endless streak" },
  "card.pm.tag2": { fr: "Exclusif accès à vie", en: "Lifetime-access exclusive" },
  "card.pm.tag3": { fr: "Record à battre", en: "Record to beat" },
  "card.pm.cta": { fr: "Lancer une série", en: "Start a streak" },

  "card.multi.title": { fr: "Multijoueur", en: "Multiplayer" },
  "card.multi.desc": {
    fr: "Crée un salon, partage le code à 6 lettres, et départagez-vous sur les mêmes vidéos.",
    en: "Create a room, share the 6-letter code, and settle it on the same videos.",
  },
  "card.multi.tag1": { fr: "Jusqu'à 10 joueurs (à vie)", en: "Up to 10 players (lifetime)" },
  "card.multi.tag2": { fr: "Temps réel", en: "Real-time" },
  "card.multi.tag3": { fr: "1 partie offerte / jour", en: "1 free game / day" },
  "card.multi.cta": { fr: "Jouer", en: "Play" },

  "home.offers.title": { fr: "Gratuit, ou", en: "Free, or" },
  "home.offers.titleAccent": { fr: "à vie", en: "for life" },
  "home.offers.sub": {
    fr: "Sans accès à vie, tu joues chaque jour : 2 parties solo et 1 partie multijoueur. Pour 5,99 $ CA une seule fois, tout devient illimité.",
    en: "Without lifetime access, you play every day: 2 solo games and 1 multiplayer game. For CA$5.99 once, everything becomes unlimited.",
  },

  "home.f1.t": { fr: "Vraies vidéos", en: "Real videos" },
  "home.f1.d": {
    fr: "Tendances YouTube en direct, dans 10 pays et 8 langues.",
    en: "Live YouTube trends, across 10 countries and 8 languages.",
  },
  "home.f2.t": { fr: "Multijoueur", en: "Multiplayer" },
  "home.f2.d": {
    fr: "Affronte tes amis en temps réel, classement en direct.",
    en: "Take on your friends in real time, live leaderboard.",
  },
  "home.f3.t": { fr: "Sans inscription", en: "No sign-up" },
  "home.f3.d": {
    fr: "Pas de compte, pas de téléchargement : tu cliques, tu joues.",
    en: "No account, no download: you click, you play.",
  },

  "home.cta.title": { fr: "Prêt à", en: "Ready to" },
  "home.cta.titleAccent": { fr: "deviner", en: "guess" },
  "home.cta.sub": {
    fr: "Lance une partie en un clic. Aucune inscription.",
    en: "Start a game in one click. No sign-up.",
  },
  "home.cta.playNow": { fr: "Jouer maintenant", en: "Play now" },
  "home.cta.createGame": { fr: "Créer une partie", en: "Create a game" },

  "footer.tagline": {
    fr: "Le jeu où tu devines les vues des vraies vidéos YouTube. Solo et multijoueur, sans inscription.",
    en: "The game where you guess the views of real YouTube videos. Solo and multiplayer, no sign-up.",
  },
  "footer.play": { fr: "Jouer", en: "Play" },
  "footer.solo": { fr: "Partie solo", en: "Solo game" },
  "footer.toLife": { fr: "Passer à vie", en: "Go lifetime" },
  "footer.guides": { fr: "Guides", en: "Guides" },
  "footer.betweenFriends": { fr: "Jeux entre potes", en: "Games with friends" },
  "footer.guessr": { fr: "C'est quoi un Guessr ?", en: "What is a Guessr?" },
  "footer.company": { fr: "Société", en: "Company" },
  "footer.contact": { fr: "Contact", en: "Contact" },
  "footer.support": { fr: "Soutenir le projet", en: "Support the project" },
  "footer.editor": { fr: "L'éditeur", en: "The publisher" },
  "footer.legal": { fr: "Légal", en: "Legal" },
  "footer.legalNotice": { fr: "Mentions légales", en: "Legal notice" },
  "footer.privacy": { fr: "Confidentialité", en: "Privacy" },
  "footer.terms": { fr: "CGU & CGV", en: "Terms of use & sale" },
  "footer.rights": { fr: "Tous droits réservés.", en: "All rights reserved." },

  // --- Chrome de jeu --------------------------------------------------------
  "title.solo": { fr: "Partie solo", en: "Solo game" },
  "title.defi": { fr: "Défi du jour", en: "Daily challenge" },
  "title.plusmoins": { fr: "Plus ou moins", en: "Higher or Lower" },
  "title.multi": { fr: "Multijoueur", en: "Multiplayer" },
  "roundintro.round": { fr: "Manche", en: "Round" },
  "roundintro.of": { fr: "sur {total}", en: "of {total}" },
  "slider.yourAnswer": { fr: "Ta réponse", en: "Your guess" },
  "slider.aria": { fr: "Nombre de vues estimé", en: "Estimated view count" },

  // --- Série (streak) ---
  "streak.title": { fr: "Série de {n} jours — clique pour jouer le défi", en: "{n}-day streak — tap to play the daily" },
  "streak.keepToday": { fr: "Joue le défi du jour pour garder ta série 🔥", en: "Play today's challenge to keep your streak 🔥" },
  "streak.freezes": { fr: "❄️ {n} gel{s} : un jour manqué ne casse pas ta série", en: "❄️ {n} freeze{s}: a missed day won't break your streak" },
  "streak.atRiskChip": { fr: "🔥 Série de {n} j en jeu aujourd'hui", en: "🔥 {n}-day streak on the line today" },

  // --- Boucle solo « encore une » ---
  "solo.replaySame": { fr: "Rejouer (même thème)", en: "Play again (same theme)" },
  "solo.changeTheme": { fr: "Changer de thème", en: "Change theme" },
  "solo.vsLastUp": { fr: "+{delta} vs ta dernière partie 📈", en: "+{delta} vs your last game 📈" },
  "solo.vsLastDown": { fr: "{delta} vs ta dernière partie", en: "{delta} vs your last game" },
  "solo.vsLastSame": { fr: "Pile ton score précédent", en: "Exactly your last score" },

  // --- Scoring (libellés) ---------------------------------------------------
  "score.incredible": { fr: "Incroyable 🤯", en: "Incredible 🤯" },
  "score.excellent": { fr: "Excellent 🔥", en: "Excellent 🔥" },
  "score.great": { fr: "Très bien 👏", en: "Great 👏" },
  "score.notbad": { fr: "Pas mal 👍", en: "Not bad 👍" },
  "score.far": { fr: "Loin… 😅", en: "Way off… 😅" },
  "score.wayoff": { fr: "À côté de la plaque 💀", en: "Totally lost 💀" },

  // --- Révélation de manche -------------------------------------------------
  "reveal.realViews": { fr: "Vraies vues", en: "Real views" },
  "reveal.bullseye": { fr: "🎯 Dans le mille", en: "🎯 Bullseye" },
  "reveal.tooHigh": { fr: "↓ Trop haut", en: "↓ Too high" },
  "reveal.tooLow": { fr: "↑ Trop bas", en: "↑ Too low" },
  "reveal.yourAnswer": { fr: "Ta réponse : {v}", en: "Your answer: {v}" },
  "reveal.watch": { fr: "Voir la vidéo sur YouTube ↗", en: "Watch the video on YouTube ↗" },
  "reveal.watchShort": { fr: "Voir sur YouTube ↗", en: "Watch on YouTube ↗" },
  "reveal.next": { fr: "Manche suivante", en: "Next round" },
  "reveal.finalResult": { fr: "Voir le résultat final", en: "See final result" },
  "reveal.myResult": { fr: "Voir mon résultat", en: "See my result" },

  // --- Solo (RoundGame) -----------------------------------------------------
  "solo.ready": { fr: "Prêt à jouer ?", en: "Ready to play?" },
  "solo.intro": {
    fr: "{rounds} manches t'attendent. Choisis un thème, puis devine au mieux le nombre de vues de chaque vidéo.",
    en: "{rounds} rounds await you. Pick a theme, then guess each video's view count as best you can.",
  },
  "solo.remaining": {
    fr: "Il te reste {n} partie{s} gratuite{s} aujourd'hui.",
    en: "You have {n} free game{s} left today.",
  },
  "solo.langHint": {
    fr: "Devine des titres et miniatures venus d'ailleurs.",
    en: "Guess titles and thumbnails from around the world.",
  },
  "solo.start": { fr: "Lancer la partie", en: "Start the game" },
  "solo.limitTitle": { fr: "Limite du jour atteinte", en: "Daily limit reached" },
  "solo.limitMsg": {
    fr: "Tu as utilisé tes 2 parties solo gratuites des dernières 24 h. Reviens demain, ou passe à l'accès à vie pour jouer sans aucune limite.",
    en: "You've used your 2 free solo games in the last 24 h. Come back tomorrow, or go lifetime to play with no limits.",
  },
  "game.over": { fr: "Partie terminée", en: "Game over" },
  "game.newRecord": { fr: "🏆 Nouveau record !", en: "🏆 New record!" },
  "game.outOf": { fr: "sur {max} points", en: "out of {max} points" },
  "game.round": { fr: "Manche {i}/{n}", en: "Round {i}/{n}" },
  "game.yourAnswerShort": { fr: "ta réponse {v}", en: "your guess {v}" },
  "game.validate": { fr: "Valider ma réponse", en: "Submit my guess" },

  // --- Défi du jour ---------------------------------------------------------
  "daily.loader": { fr: "Préparation du défi du jour…", en: "Preparing today's challenge…" },
  "daily.title": { fr: "Défi du jour #{n}", en: "Daily challenge #{n}" },
  "daily.fiveOneTry": { fr: "5 vidéos, une seule tentative", en: "5 videos, one attempt" },
  "daily.intro": {
    fr: "Les mêmes 5 vidéos que tout le monde aujourd'hui. Fais ton meilleur score et partage-le.",
    en: "The same 5 videos as everyone else today. Get your best score and share it.",
  },
  "daily.streak": { fr: "🔥 Série : {n} jour{s}", en: "🔥 Streak: {n} day{s}" },
  "daily.streakRun": {
    fr: "🔥 Série : {n} jour{s} d'affilée",
    en: "🔥 Streak: {n} day{s} in a row",
  },
  "daily.playChallenge": { fr: "Jouer le défi", en: "Play the challenge" },
  "daily.alreadyToday": { fr: "Déjà relevé aujourd'hui !", en: "Already done today!" },
  "daily.finishedTag": { fr: "Défi du jour #{n} · terminé", en: "Daily challenge #{n} · done" },
  "daily.comeBack": {
    fr: "Reviens demain pour le prochain défi et garde ta série en vie.",
    en: "Come back tomorrow for the next challenge and keep your streak alive.",
  },
  "daily.playSolo": { fr: "Jouer en solo", en: "Play solo" },
  "daily.continueSolo": { fr: "Continuer en solo", en: "Continue in solo" },
  "daily.copyScore": { fr: "Copier mon score", en: "Copy my score" },
  "daily.copied": { fr: "Copié ✓", en: "Copied ✓" },

  // --- Classement quotidien -------------------------------------------------
  "lb.title": { fr: "Classement du jour", en: "Today's leaderboard" },
  "lb.players": { fr: "{n} joueur{s}", en: "{n} player{s}" },
  "lb.yourPseudo": { fr: "Ton pseudo", en: "Your nickname" },
  "lb.publish": { fr: "Publier mon score", en: "Publish my score" },
  "lb.youAreFirst": { fr: "1er", en: "1st" },
  "lb.youAreNth": { fr: "{n}e", en: "#{n}" },
  "lb.yourRank": {
    fr: "Tu es {rank}{total} aujourd'hui · {score} pts",
    en: "You're {rank}{total} today · {score} pts",
  },
  "lb.outOf": { fr: " sur {n}", en: " of {n}" },
  "lb.openToday": {
    fr: "Tu ouvres le classement aujourd'hui — reviens voir qui te dépasse !",
    en: "You're opening today's leaderboard — come back to see who passes you!",
  },

  // --- Plus ou moins (solo) -------------------------------------------------
  "pm.badgeLife": { fr: "Accès à vie · illimité", en: "Lifetime access · unlimited" },
  "pm.q": { fr: "Plus", en: "Higher" },
  "pm.qMid": { fr: "ou", en: "or" },
  "pm.qEnd": { fr: "moins ?", en: "Lower?" },
  "pm.explain": {
    fr: "Deux vidéos face à face : la seconde fait-elle plus ou moins de vues que la première ? Une erreur et c'est fini.",
    en: "Two videos head to head: does the second have more or fewer views than the first? One mistake and it's over.",
  },
  "pm.yourRecord": { fr: "Ton record : série de {n}", en: "Your record: streak of {n}" },
  "pm.start": { fr: "Lancer la série", en: "Start the streak" },
  "pm.lockedTitle": { fr: "Réservé à l'accès à vie", en: "Lifetime access only" },
  "pm.lockedMsg": {
    fr: "Le mode Plus ou moins est un avantage exclusif de l'accès à vie : séries infinies illimitées, en solo comme en multijoueur, pour 5,99 $ CA une seule fois.",
    en: "Higher or Lower is a lifetime-access exclusive: unlimited endless streaks, solo and multiplayer, for CA$5.99 once.",
  },
  "pm.record": { fr: "Record {n}", en: "Record {n}" },
  "pm.streak": { fr: "Série {n}", en: "Streak {n}" },
  "pm.more": { fr: "▲ Plus de vues", en: "▲ More views" },
  "pm.less": { fr: "▼ Moins de vues", en: "▼ Fewer views" },
  "pm.question": {
    fr: "La vidéo de droite fait-elle plus ou moins de vues que celle de gauche ?",
    en: "Does the right video have more or fewer views than the left one?",
  },
  "pm.goodSpot": { fr: "✓ Bien vu !", en: "✓ Nice!" },
  "pm.missed": { fr: "✗ Raté…", en: "✗ Missed…" },
  "pm.streakOver": { fr: "Série terminée", en: "Streak over" },
  "pm.streakStats": {
    fr: "bonne{s} réponse{s} d'affilée · record {best}",
    en: "correct answer{s} in a row · record {best}",
  },
  "pm.theAnswer": { fr: "La bonne réponse :", en: "The answer:" },
  "pm.answerBody": {
    fr: "« {title} » fait {right} vues, contre {left} pour la précédente.",
    en: "“{title}” has {right} views, versus {left} for the previous one.",
  },
  "pm.subs": { fr: "abonnés", en: "subscribers" },

  // --- Paywall --------------------------------------------------------------
  "paywall.toLife": { fr: "Passer à vie 5,99 $ CA", en: "Go lifetime CA$5.99" },
  "paywall.renewIn": { fr: "Renouvellement dans", en: "Renews in" },

  // --- Offres (composant) ---------------------------------------------------
  "offers.withoutLife": { fr: "Sans accès à vie", en: "Without lifetime access" },
  "offers.free": { fr: "Gratuit", en: "Free" },
  "offers.leftToday": { fr: "Il te reste aujourd'hui", en: "Left for you today" },
  "offers.solo": { fr: "solo", en: "solo" },
  "offers.multi": { fr: "multijoueur", en: "multiplayer" },
  "offers.youHaveLife": {
    fr: "Tu as l'accès à vie ✦ tu n'as aucune limite.",
    en: "You have lifetime access ✦ no limits for you.",
  },
  "offers.freeRecap": {
    fr: "{solo} parties solo et {mp} partie multijoueur, chaque jour.",
    en: "{solo} solo games and {mp} multiplayer game, every day.",
  },
  "offers.l1": { fr: "{n} parties solo par jour", en: "{n} solo games per day" },
  "offers.l2": {
    fr: "{n} multijoueur/jour (jusqu'à 3 joueurs)",
    en: "{n} multiplayer/day (up to 3 players)",
  },
  "offers.l3": { fr: "Sans inscription, sans publicité intrusive", en: "No sign-up, no intrusive ads" },
  "offers.l4": { fr: "Mode « Plus ou moins » (accès à vie)", en: "Higher or Lower mode (lifetime access)" },
  "offers.playFree": { fr: "Jouer gratuitement", en: "Play for free" },
  "offers.popular": { fr: "Populaire", en: "Popular" },
  "offers.allUnlocked": { fr: "Tout débloqué", en: "Everything unlocked" },
  "offers.lifeAccess": { fr: "Accès à vie", en: "Lifetime access" },
  "offers.once": { fr: "une seule fois", en: "one time only" },
  "offers.p1": { fr: "Mode exclusif « Plus ou moins » (solo & multi)", en: "Exclusive Higher or Lower mode (solo & multi)" },
  "offers.p2": { fr: "Parties solo illimitées", en: "Unlimited solo games" },
  "offers.p3": { fr: "Multijoueur illimité (au lieu de 1 par jour)", en: "Unlimited multiplayer (instead of 1 per day)" },
  "offers.p4": { fr: "Jusqu'à 10 joueurs par partie", en: "Up to 10 players per game" },
  "offers.p5": { fr: "Paiement unique, sans abonnement", en: "One-time payment, no subscription" },
  "offers.p6": { fr: "Tu soutiens un projet indépendant", en: "You support an indie project" },
  "offers.haveLife": { fr: "Tu as déjà l'accès à vie ✦", en: "You already have lifetime access ✦" },
  "offers.getLife": { fr: "Passer à l'accès à vie 5,99 $ CA", en: "Get lifetime access CA$5.99" },

  // --- Activité / percentile ------------------------------------------------
  "activity.games": {
    fr: "{n} partie{s} ces dernières 24 h",
    en: "{n} game{s} in the last 24 h",
  },
  "activity.mode.solo": { fr: "en solo", en: "in solo" },
  "activity.mode.defi": { fr: "au défi du jour", en: "in the daily" },
  "activity.mode.multi": { fr: "en multi", en: "in multiplayer" },
  "activity.mode.hl": { fr: "au Plus ou moins", en: "in Higher or Lower" },
  "percentile.line": {
    fr: "Tu as battu {pct} % des joueurs ces dernières 24 h 🏆",
    en: "You beat {pct}% of players in the last 24 h 🏆",
  },

  // --- Page Pro -------------------------------------------------------------
  "pro.badge1": { fr: "Paiement unique", en: "One-time payment" },
  "pro.badge2": { fr: "Sans abonnement", en: "No subscription" },
  "pro.title1": { fr: "Tout débloquer,", en: "Unlock everything," },
  "pro.title2": { fr: "à vie.", en: "for life." },
  "pro.lead": {
    fr: "Un seul paiement, pour toujours. Tu joues sans limites et tu soutiens un projet indépendant français.",
    en: "One single payment, forever. Play with no limits and support an independent French project.",
  },
  "pro.perk1.t": { fr: "Mode « Plus ou moins »", en: "Higher or Lower mode" },
  "pro.perk1.d": {
    fr: "Le mode exclusif en série infinie : deux vidéos, laquelle fait le plus de vues ? En solo et en multijoueur.",
    en: "The exclusive endless-streak mode: two videos, which has more views? Solo and multiplayer.",
  },
  "pro.perk2.t": { fr: "Solo illimité", en: "Unlimited solo" },
  "pro.perk2.d": {
    fr: "Autant de parties que tu veux, au lieu de 2 par jour.",
    en: "As many games as you want, instead of 2 per day.",
  },
  "pro.perk3.t": { fr: "Multijoueur illimité", en: "Unlimited multiplayer" },
  "pro.perk3.d": {
    fr: "Crée ou rejoins des salons sans compter, au lieu de 1 par jour.",
    en: "Create or join rooms without counting, instead of 1 per day.",
  },
  "pro.perk4.t": { fr: "Jusqu'à 10 joueurs", en: "Up to 10 players" },
  "pro.perk4.d": {
    fr: "Des salons plus grands pour tes soirées, au lieu de 3 joueurs.",
    en: "Bigger rooms for your game nights, instead of 3 players.",
  },
  "pro.perk5.t": { fr: "Paiement unique", en: "One-time payment" },
  "pro.perk5.d": {
    fr: "5,99 $ CA une fois. Pas d'abonnement, pas de petite ligne.",
    en: "CA$5.99 once. No subscription, no fine print.",
  },
  "pro.lifeAccess": { fr: "Accès à vie", en: "Lifetime access" },
  "pro.priceOnce": { fr: "une fois", en: "once" },
  "pro.cardDesc": {
    fr: "Solo et multijoueur illimités, jusqu'à 10 joueurs, et le mode exclusif « Plus ou moins ».",
    en: "Unlimited solo and multiplayer, up to 10 players, and the exclusive Higher or Lower mode.",
  },
  "pro.alreadyHave": { fr: "Tu as déjà l'accès à vie ✦", en: "You already have lifetime access ✦" },
  "pro.playNow": { fr: "Jouer maintenant →", en: "Play now →" },
  "pro.redirecting": { fr: "Redirection…", en: "Redirecting…" },
  "pro.unlock": { fr: "Débloquer à vie · 5,99 $ CA", en: "Unlock for life · CA$5.99" },
  "pro.secured": {
    fr: "Paiement sécurisé par Stripe. Accès reconnu automatiquement sur le même appareil ou réseau.",
    en: "Secure payment via Stripe. Access recognized automatically on the same device or network.",
  },
  "pro.restoreLink": {
    fr: "Accès déjà acheté mais non détecté ? Le restaurer",
    en: "Already purchased but not detected? Restore it",
  },
  "pro.restoreHint": {
    fr: "Entre le code d'accès reçu après ton achat (page de remerciement).",
    en: "Enter the access code you received after purchase (thank-you page).",
  },
  "pro.restoreBtn": { fr: "Restaurer mon accès", en: "Restore my access" },
  "pro.restoring": { fr: "Vérification…", en: "Checking…" },
  "pro.restored": { fr: "Accès restauré ! ✦", en: "Access restored! ✦" },
  "pro.codeInvalid": { fr: "Code invalide ou inconnu.", en: "Invalid or unknown code." },
  "pro.restoreError": { fr: "Erreur, réessaie dans un instant.", en: "Error, try again in a moment." },
  "pro.error": { fr: "Erreur", en: "Error" },

  // --- Multijoueur ----------------------------------------------------------
  "mp.create": { fr: "Créer une partie", en: "Create a game" },
  "mp.join": { fr: "Rejoindre une partie", en: "Join a game" },
  "mp.gameMode": { fr: "Mode de jeu", en: "Game mode" },
  "mp.modeClassic": { fr: "Classique", en: "Classic" },
  "mp.modeClassicSub": { fr: "Devine les vues", en: "Guess the views" },
  "mp.modeHl": { fr: "Plus ou moins", en: "Higher or Lower" },
  "mp.modeHlSub": { fr: "Accès à vie", en: "Lifetime access" },
  "mp.yourName": { fr: "Ton pseudo", en: "Your nickname" },
  "mp.players": { fr: "Joueurs", en: "Players" },
  "mp.rounds": { fr: "Manches", en: "Rounds" },
  "mp.create.btn": { fr: "Créer le salon", en: "Create the room" },
  "mp.join.btn": { fr: "Rejoindre", en: "Join" },
  "mp.code": { fr: "Code de la partie", en: "Game code" },
  "mp.codePlaceholder": { fr: "Code à 6 lettres", en: "6-letter code" },
  "mp.back": { fr: "Retour", en: "Back" },
  "mp.lobby": { fr: "Salon", en: "Lobby" },
  "mp.share": { fr: "Partage ce code", en: "Share this code" },
  "mp.copied": { fr: "Code copié ✓", en: "Code copied ✓" },
  "mp.waitingHost": { fr: "En attente de l'hôte…", en: "Waiting for the host…" },
  "mp.start": { fr: "Lancer la partie", en: "Start the game" },
  "mp.needTwo": { fr: "Il faut au moins 2 joueurs", en: "At least 2 players needed" },
  "mp.chatPlaceholder": { fr: "Écris un message…", en: "Type a message…" },
  "mp.results": { fr: "Résultats", en: "Results" },
  "mp.gameOver": { fr: "Partie terminée", en: "Game over" },
  "mp.youWon": { fr: "🏆 Tu as gagné !", en: "🏆 You won!" },
  "mp.ranking": { fr: "Classement", en: "Leaderboard" },
  "mp.rematch": { fr: "🔄 Rejouer avec les mêmes", en: "🔄 Rematch — same players" },
  "mp.rematching": { fr: "Relance…", en: "Restarting…" },
  "mp.newGame": { fr: "Nouvelle partie", en: "New game" },
  "mp.rematchHint": {
    fr: "L'hôte peut relancer une partie avec les mêmes joueurs — reste ici, tu seras ramené au salon automatiquement.",
    en: "The host can start a rematch with the same players — stay here, you'll be brought back to the lobby automatically.",
  },
  "mp.left": { fr: "{name} a quitté la partie", en: "{name} left the game" },
  "mp.joined": { fr: "{name} a rejoint la partie", en: "{name} joined the game" },
  "mp.bannedName": {
    fr: "Ce pseudo n'est pas autorisé. Choisis-en un autre.",
    en: "This nickname isn't allowed. Pick another one.",
  },

  // --- Page de remerciement (/merci) ---------------------------------------
  "merci.checking": { fr: "Vérification du paiement…", en: "Verifying your payment…" },
  "merci.title": { fr: "Merci ! Tu as l'accès", en: "Thank you! You have" },
  "merci.titleHl": { fr: "à vie", en: "lifetime access" },
  "merci.subtitle": {
    fr: "Tout est débloqué, pour toujours. Bon jeu et bonne chance pour deviner les vues.",
    en: "Everything is unlocked, forever. Have fun, and good luck guessing those views.",
  },
  "merci.codeLabel": { fr: "Ton code d'accès à vie", en: "Your lifetime access code" },
  "merci.copy": { fr: "Copier le code", en: "Copy code" },
  "merci.copied": { fr: "Copié ✓", en: "Copied ✓" },
  "merci.codeHint": {
    fr: "Garde ce code : c'est lui (et non ton e-mail) qui débloque ton accès sur tes autres appareils.",
    en: "Keep this code safe: it is what unlocks your access on other devices, not your email address.",
  },
  "merci.playSolo": { fr: "▶ Jouer en solo", en: "▶ Play solo" },
  "merci.errorTitle": { fr: "Paiement non confirmé", en: "Payment not confirmed" },
  "merci.errorBody": {
    fr: "Si tu viens de payer, patiente quelques secondes et recharge la page. Sinon, tu peux réessayer.",
    en: "If you just paid, wait a few seconds and reload the page. Otherwise, you can try again.",
  },
};
