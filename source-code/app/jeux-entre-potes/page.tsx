import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/seo/ContentShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faq } from "@/components/seo/Faq";
import { ArticleLd } from "@/components/seo/ArticleLd";

export const metadata: Metadata = {
  title: "Jeux entre potes en ligne (sans inscription)",
  description:
    "Notre sélection de jeux à faire entre potes en ligne, gratuits et sans inscription. Dont ViewGuessr, le jeu où vous devinez les vues de vraies vidéos YouTube en multijoueur.",
  keywords: [
    "jeux entre potes",
    "jeux entre amis en ligne",
    "jeu à faire à distance",
    "jeux en ligne sans inscription",
    "jeux multijoueur navigateur",
    "jeux entre potes en vocal",
    "jeux soirée en ligne",
  ],
  alternates: {
    canonical: "/jeux-entre-potes",
    languages: {
      "fr-FR": "/jeux-entre-potes",
      "en-US": "/en/games-to-play-with-friends",
      "x-default": "/jeux-entre-potes",
    },
  },
  openGraph: {
    title: "Jeux entre potes en ligne (sans inscription) · ViewGuessr",
    description:
      "La sélection des meilleurs jeux à faire entre potes en ligne, sans inscription. Avec ViewGuessr en multijoueur.",
    url: "/jeux-entre-potes",
    type: "article",
  },
};

const GAMES: {
  name: string;
  tag: string;
  href?: string | null;
  internal?: boolean;
  desc: string;
}[] = [
  {
    name: "ViewGuessr",
    tag: "Notre jeu",
    href: "/multiplayer",
    internal: true,
    desc: "Devinez le nombre de vues de vraies vidéos YouTube tendance. Créez un salon, partagez un code à 6 lettres, et départagez-vous sur les mêmes vidéos. Jusqu'à 10 joueurs, en temps réel, sans inscription.",
  },
  {
    name: "Skribbl",
    tag: "Dessin",
    href: null,
    desc: "Un Pictionary en ligne : l'un dessine un mot, les autres devinent le plus vite possible. Idéal en vocal, parties rapides et beaucoup de fous rires.",
  },
  {
    name: "Gartic Phone",
    tag: "Délire",
    href: null,
    desc: "Le téléphone arabe version dessin : une phrase devient un dessin, qui redevient une phrase… Le résultat final est rarement celui prévu.",
  },
  {
    name: "Among Us",
    tag: "Bluff",
    href: null,
    desc: "Démasquez l'imposteur à bord d'un vaisseau. Le jeu de déduction sociale qui marche aussi bien à 4 qu'à 10, et qui crée de vraies trahisons entre amis.",
  },
  {
    name: "GeoGuessr",
    tag: "Géo",
    href: "/c-est-quoi-un-guessr",
    internal: true,
    desc: "Le pionnier du « guessr » : on vous lâche quelque part sur Street View, à vous de deviner où. Le jeu qui a inspiré tout un genre — dont ViewGuessr.",
  },
  {
    name: "Codenames",
    tag: "Mots",
    href: null,
    desc: "Deux équipes, des indices d'un seul mot, et des espions à retrouver dans une grille. Parfait pour les groupes qui aiment réfléchir ensemble.",
  },
];

export default function Page() {
  return (
    <ContentShell locale="fr" altHref="/en/games-to-play-with-friends">
      <ArticleLd
        path="/jeux-entre-potes"
        locale="fr"
        headline="Jeux à faire entre potes en ligne (sans inscription)"
        description="Notre sélection des meilleurs jeux à faire entre potes en ligne, gratuits et sans inscription, dont ViewGuessr en multijoueur."
      />
      <Breadcrumbs
        items={[
          { name: "Accueil", href: "/" },
          { name: "Guides", href: "/jeux-entre-potes" },
          { name: "Jeux entre potes", href: "/jeux-entre-potes" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-5 py-8">
        <span className="sticker -rotate-2">Guide · soirées entre amis</span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-platinum sm:text-5xl">
          Jeux à faire <span className="hl-red">entre potes</span> en ligne
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-lavender">
          Une soirée à distance, un appel vocal qui s'éternise, ou juste l'envie
          de se chambrer&nbsp;: voici les meilleurs jeux à faire entre potes en
          ligne, <strong className="text-platinum">gratuits et sans
          inscription</strong>. On commence par le nôtre — ViewGuessr — puis on
          vous donne une sélection honnête de valeurs sûres pour animer un groupe.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/multiplayer" className="btn-ink px-6 py-3">
            Créer une partie multijoueur
          </Link>
          <Link href="/" className="btn-paper px-6 py-3">
            Découvrir ViewGuessr
          </Link>
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          ViewGuessr&nbsp;: deviner les vues, ensemble
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          <Link href="/" className="font-semibold text-crimson hover:underline">
            ViewGuessr
          </Link>{" "}
          est un jeu où l'on devine le nombre de vues de vraies vidéos YouTube
          tendance. En multijoueur, c'est un excellent jeu de groupe&nbsp;: l'hôte
          crée un salon, choisit un thème (gaming, musique, sport…) et une langue,
          puis partage un <strong className="text-platinum">code à 6 lettres</strong>.
          Tout le monde tombe sur les mêmes vidéos, place son curseur, et le plus
          proche du vrai chiffre marque le plus de points. Le classement se met à
          jour en direct, jusqu'à 10 joueurs.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-lavender">
          Pas de compte, pas de téléchargement, pas d'application à installer&nbsp;:
          un lien, un code, et la partie démarre. C'est ce qui en fait un jeu idéal
          quand vous êtes déjà en vocal sur Discord et que vous voulez lancer
          quelque chose en dix secondes.
        </p>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          Notre sélection de jeux entre potes
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          Six jeux qui marchent à coup sûr en groupe, du plus calme au plus
          chaotique. Tous se jouent dans le navigateur ou en quelques clics.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {GAMES.map((g) => (
            <div key={g.name} className="card-ink rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-platinum">
                  {g.name}
                </h3>
                <span className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2 py-0.5 text-[11px] font-bold text-platinum">
                  {g.tag}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-lavender">{g.desc}</p>
              {g.internal && g.href && (
                <Link
                  href={g.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-crimson hover:underline"
                >
                  {g.name === "ViewGuessr" ? "Créer une partie" : "En savoir plus"}
                  <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          Comment bien jouer entre potes à distance
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          Le secret d'une bonne soirée jeux en ligne tient en trois choses.
          D'abord, <strong className="text-platinum">un vocal partagé</strong>
          {" "}(Discord, appel de groupe) — la moitié du plaisir vient des
          réactions. Ensuite, des <strong className="text-platinum">parties
          courtes</strong>&nbsp;: mieux vaut enchaîner cinq manches rapides que
          subir une partie d'une heure. Enfin, des règles que tout le monde
          comprend en dix secondes — c'est exactement pour ça qu'un jeu sans
          inscription comme ViewGuessr fonctionne si bien&nbsp;: personne n'attend,
          tout le monde joue.
        </p>

        <div className="mt-10 card-ink rounded-2xl p-7 text-center">
          <h2 className="font-display text-2xl font-bold text-platinum">
            Prêt à lancer une partie&nbsp;?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-lavender">
            Crée un salon, partage le code, et affronte tes potes sur de vraies
            vidéos YouTube. Gratuit, sans inscription.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/multiplayer" className="btn-ink px-7 py-3.5">
              Jouer en multijoueur
            </Link>
            <Link href="/play/solo" className="btn-paper px-7 py-3.5">
              Essayer en solo
            </Link>
          </div>
        </div>
      </article>

      <Faq
        heading="Questions fréquentes"
        items={[
          {
            q: "Quel jeu jouer entre potes en ligne sans rien installer ?",
            a: "ViewGuessr se joue directement dans le navigateur, sans compte ni téléchargement : l'hôte crée un salon et partage un code à 6 lettres. Skribbl, Gartic Phone et Codenames fonctionnent aussi sans installation.",
          },
          {
            q: "Combien de joueurs peuvent jouer ensemble sur ViewGuessr ?",
            a: "Jusqu'à 10 joueurs dans une même partie multijoueur. Une partie multijoueur gratuite par jour est incluse ; l'accès à vie (5,99 $ CA une seule fois) débloque le multijoueur illimité.",
          },
          {
            q: "Ces jeux sont-ils gratuits ?",
            a: "Oui. ViewGuessr est gratuit (avec des parties quotidiennes offertes), tout comme Skribbl, Gartic Phone et Among Us. Aucun n'exige d'abonnement pour jouer entre amis.",
          },
          {
            q: "Peut-on jouer en même temps qu'un appel Discord ?",
            a: "Absolument. ViewGuessr étant un jeu de navigateur léger, vous pouvez rester en vocal sur Discord et partager le code de partie dans le salon textuel pour que tout le monde rejoigne.",
          },
        ]}
      />
    </ContentShell>
  );
}
