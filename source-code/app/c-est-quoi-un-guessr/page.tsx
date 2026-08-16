import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/seo/ContentShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Faq } from "@/components/seo/Faq";
import { ArticleLd } from "@/components/seo/ArticleLd";

export const metadata: Metadata = {
  title: "C'est quoi un jeu « Guessr » ? (GeoGuessr, ViewGuessr & co)",
  description:
    "Un « guessr », c'est un jeu où l'on devine une donnée cachée à partir d'indices : un lieu, des vues, un prix. Origines du genre, exemples (GeoGuessr, ViewGuessr) et alternatives.",
  keywords: [
    "guessr",
    "c'est quoi un guessr",
    "jeu guessr",
    "jeux comme GeoGuessr",
    "alternative GeoGuessr",
    "GeoGuessr gratuit",
    "ViewGuessr",
    "jeux de devinette en ligne",
  ],
  alternates: {
    canonical: "/c-est-quoi-un-guessr",
    languages: {
      "fr-FR": "/c-est-quoi-un-guessr",
      "en-US": "/en/guessr-games",
      "x-default": "/c-est-quoi-un-guessr",
    },
  },
  openGraph: {
    title: "C'est quoi un jeu « Guessr » ? · ViewGuessr",
    description:
      "Le genre « guessr » expliqué : deviner une donnée cachée à partir d'indices. De GeoGuessr à ViewGuessr.",
    url: "/c-est-quoi-un-guessr",
    type: "article",
  },
};

const FAMILY: {
  name: string;
  what: string;
  desc: string;
  internal?: string;
}[] = [
  {
    name: "GeoGuessr",
    what: "Deviner un lieu",
    desc: "On vous lâche sur Google Street View, n'importe où sur Terre. À partir des panneaux, de la végétation et de l'architecture, vous placez un point sur la carte. Plus c'est proche, plus vous marquez. C'est le jeu qui a popularisé le suffixe « -guessr ».",
  },
  {
    name: "ViewGuessr",
    what: "Deviner des vues",
    desc: "Une vraie vidéo YouTube tendance s'affiche, compteur masqué. Vous estimez son nombre de vues sur une échelle de 1 000 à 1 milliard. L'indice, ici, c'est la miniature, le titre et la chaîne. Solo ou multijoueur.",
    internal: "/",
  },
  {
    name: "Les « Higher or Lower »",
    what: "Plus ou moins",
    desc: "Variante minimaliste du genre : deux éléments côte à côte, lequel a la plus grande valeur (vues, recherches Google, abonnés) ? Une erreur et la série s'arrête. ViewGuessr en propose une version « Plus ou moins ».",
    internal: "/play/plus-moins",
  },
];

export default function Page() {
  return (
    <ContentShell locale="fr" altHref="/en/guessr-games">
      <ArticleLd
        path="/c-est-quoi-un-guessr"
        locale="fr"
        headline="C'est quoi un jeu « Guessr » ?"
        description="Définition du genre « guessr » : deviner une donnée cachée à partir d'indices. Origines, exemples (GeoGuessr, ViewGuessr) et alternatives."
      />
      <Breadcrumbs
        items={[
          { name: "Accueil", href: "/" },
          { name: "Guides", href: "/jeux-entre-potes" },
          { name: "C'est quoi un Guessr", href: "/c-est-quoi-un-guessr" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-5 py-8">
        <span className="sticker rotate-1">Guide · le genre « guessr »</span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-platinum sm:text-5xl">
          C'est quoi un jeu <span className="hl-red">« Guessr »</span>&nbsp;?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-lavender">
          Un <strong className="text-platinum">« guessr »</strong> (de l'anglais
          <em className="font-accent"> to guess</em>, deviner) désigne un type de
          jeu où l'on doit <strong className="text-platinum">estimer une donnée
          cachée à partir d'indices</strong>&nbsp;: un lieu, un nombre de vues, un
          prix, une date. Pas de bonne réponse unique à trouver au hasard — un bon
          score récompense la justesse de votre estimation.
        </p>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          D'où vient le mot « guessr »
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          Le terme vient de <strong className="text-platinum">GeoGuessr</strong>,
          sorti en 2013, qui demandait de deviner un lieu à partir d'une vue Street
          View. Le succès du jeu a transformé son suffixe «&nbsp;-guessr&nbsp;» en
          véritable nom de genre&nbsp;: aujourd'hui, on appelle «&nbsp;guessr&nbsp;»
          toute déclinaison du même principe appliquée à une autre donnée. Deviner
          un lieu, deviner des vues, deviner un prix&nbsp;: même mécanique, à chaque
          fois un curseur ou une carte, et un score de proximité.
        </p>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          La famille des guessr
        </h2>
        <div className="mt-8 space-y-5">
          {FAMILY.map((g) => (
            <div key={g.name} className="card-ink rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-platinum">
                  {g.name}
                </h3>
                <span className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2 py-0.5 text-[11px] font-bold text-platinum">
                  {g.what}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-lavender">{g.desc}</p>
              {g.internal && (
                <Link
                  href={g.internal}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-crimson hover:underline"
                >
                  Jouer maintenant <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          Qu'est-ce qui fait un bon guessr
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          Trois ingrédients reviennent toujours. Des{" "}
          <strong className="text-platinum">données réelles et vérifiables</strong>
          {" "}— sur ViewGuessr, ce sont les vraies vues YouTube du moment, pas des
          chiffres inventés. Un{" "}
          <strong className="text-platinum">système de score à la proximité</strong>,
          qui récompense l'intuition plutôt que la chance. Et une{" "}
          <strong className="text-platinum">prise en main immédiate</strong>&nbsp;:
          on comprend la règle en une manche. Les meilleurs guessr ajoutent un mode
          multijoueur, parce que comparer ses estimations avec des amis double le
          plaisir.
        </p>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
          Une alternative à GeoGuessr ?
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-lavender">
          Si vous cherchez un guessr gratuit, sans inscription et jouable entre
          amis, <Link href="/" className="font-semibold text-crimson hover:underline">ViewGuessr</Link>{" "}
          applique exactement la recette de GeoGuessr à un terrain que tout le monde
          connaît&nbsp;: YouTube. Même sensation de «&nbsp;j'en étais
          pas loin&nbsp;!&nbsp;», mais en quelques secondes par manche et sans créer
          de compte. C'est aussi un bon point de départ pour{" "}
          <Link
            href="/jeux-entre-potes"
            className="font-semibold text-crimson hover:underline"
          >
            jouer entre potes en ligne
          </Link>
          .
        </p>

        <div className="mt-10 card-ink rounded-2xl p-7 text-center">
          <h2 className="font-display text-2xl font-bold text-platinum">
            Essaie le guessr des vues YouTube
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-lavender">
            Une vidéo, un curseur, ton intuition. Gratuit et sans inscription.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/play/solo" className="btn-ink px-7 py-3.5">
              Jouer maintenant
            </Link>
            <Link href="/multiplayer" className="btn-paper px-7 py-3.5">
              Défier des amis
            </Link>
          </div>
        </div>
      </article>

      <Faq
        heading="Questions fréquentes sur les guessr"
        items={[
          {
            q: "Que veut dire « guessr » ?",
            a: "« Guessr » vient du verbe anglais to guess (deviner). C'est devenu le nom d'un genre de jeu où l'on estime une donnée cachée à partir d'indices — un lieu, un nombre de vues, un prix — avec un score basé sur la proximité de la bonne réponse.",
          },
          {
            q: "Quels jeux ressemblent à GeoGuessr ?",
            a: "GeoGuessr (deviner un lieu), ViewGuessr (deviner les vues d'une vidéo YouTube) et les jeux « Higher or Lower » (plus ou moins) partagent la même mécanique. ViewGuessr en est une alternative gratuite, sans inscription et jouable en multijoueur.",
          },
          {
            q: "ViewGuessr est-il gratuit comme GeoGuessr ?",
            a: "ViewGuessr est gratuit et se joue sans inscription, avec des parties quotidiennes offertes. Un accès à vie optionnel à 3,99 € (paiement unique) débloque les modes et le multijoueur illimités.",
          },
          {
            q: "Faut-il un compte pour jouer à un guessr ?",
            a: "Cela dépend du jeu. ViewGuessr ne demande aucun compte ni téléchargement : vous arrivez sur le site et vous jouez immédiatement, en solo ou via un code de partie en multijoueur.",
          },
        ]}
      />
    </ContentShell>
  );
}
