import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { PUBLISHER } from "@/lib/publisher";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de ViewGuessr : jeu sans compte, données stockées localement, mode multijoueur, paiement Stripe et tes droits RGPD.",
  alternates: { canonical: "/confidentialite" },
};

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated="juin 2026">
      <p>
        {PUBLISHER.tradingName} (édité par {PUBLISHER.legalName}) attache de
        l&apos;importance à ta vie privée. Le jeu est conçu pour collecter le minimum de données.
      </p>
      <p>
        Responsable du traitement : {PUBLISHER.legalName}, {PUBLISHER.city}{" "}
        <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>.
      </p>

      <LegalSection title="Aucun compte requis">
        <p>
          Tu peux jouer sans créer de compte. Aucune adresse e-mail ni mot de passe
          n&apos;est demandé pour jouer.
        </p>
      </LegalSection>

      <LegalSection title="Données stockées sur ton appareil">
        <p>
          Ton pseudo, tes préférences et tes meilleurs scores sont enregistrés{" "}
          <strong>localement</strong> dans ton navigateur (localStorage). Ces
          données-là restent sur ton appareil et ne sont pas envoyées à nos
          serveurs.
        </p>
      </LegalSection>

      <LegalSection title="Adresse IP (anti-triche & accès à vie)">
        <p>
          Pour limiter le nombre de parties gratuites par jour et pour reconnaître
          automatiquement un accès à vie déjà acheté, nous transmettons à nos
          serveurs un <strong>identifiant non réversible</strong> dérivé de ton
          adresse IP (un «&nbsp;hash&nbsp;» salé). Nous ne conservons pas ton
          adresse IP en clair, et cet identifiant ne permet pas de remonter jusqu&apos;à
          toi&nbsp;: il sert uniquement à compter les parties et à détecter un achat.
        </p>
      </LegalSection>

      <LegalSection title="Données de jeu en ligne">
        <p>
          En multijoueur, ton pseudo, tes réponses et ton score sont transmis à
          notre base de données (Supabase) afin de synchroniser la partie entre les
          joueurs.
        </p>
        <p>
          À la fin d&apos;une partie (solo, défi du jour ou multijoueur), ton pseudo
          et ton score peuvent être enregistrés et affichés dans le bandeau
          d&apos;«&nbsp;activité&nbsp;» public de l&apos;accueil (par exemple
          «&nbsp;Marc, 4&nbsp;230&nbsp;pts&nbsp;»). Choisis un pseudo non identifiant
          si tu ne souhaites pas y figurer. Ces données récentes sont conservées de
          façon limitée (environ 30&nbsp;jours).
        </p>
      </LegalSection>

      <LegalSection title="Paiement">
        <p>
          Les achats (accès à vie) sont gérés par <strong>Stripe</strong>, qui agit
          en tant que prestataire de paiement. Les informations bancaires sont
          traitées directement par Stripe&nbsp;; nous n&apos;y avons jamais accès.
        </p>
        <p>
          Lors de l&apos;achat, ton <strong>adresse e-mail</strong> est collectée par
          Stripe (envoi du reçu, support). Nous y avons accès via Stripe uniquement
          pour le suivi des achats et l&apos;assistance, et ne l&apos;utilisons à
          aucune autre fin.
        </p>
      </LegalSection>

      <LegalSection title="Cookies & traceurs">
        <p>
          ViewGuessr n&apos;utilise pas de cookies publicitaires ni de traceurs
          tiers à des fins de profilage.
        </p>
      </LegalSection>

      <LegalSection title="Mesure d'audience">
        <p>
          Pour comprendre la fréquentation du site (nombre de visites, pages les
          plus consultées), nous utilisons <strong>Vercel Analytics</strong>, un
          outil de mesure d&apos;audience respectueux de la vie privée&nbsp;: il ne
          dépose aucun cookie et ne collecte que des statistiques anonymes et
          agrégées, sans permettre de t&apos;identifier.
        </p>
      </LegalSection>

      <LegalSection title="Hébergement et sous-traitants">
        <p>
          Le site est hébergé par <strong>Vercel</strong> (qui assure aussi la
          mesure d&apos;audience). Les données de jeu en ligne sont stockées chez{" "}
          <strong>Supabase</strong> et les paiements traités par{" "}
          <strong>Stripe</strong>. Ces prestataires peuvent traiter des données en
          dehors de l&apos;Union européenne, dans le cadre de garanties appropriées.
          Nous conservons chaque donnée le temps nécessaire à sa finalité (accès à
          vie tant qu&apos;il est valable, activité récente ~30&nbsp;jours,
          identifiants techniques au jour le jour).
        </p>
      </LegalSection>

      <LegalSection title="Tes droits (RGPD)">
        <p>
          Conformément au RGPD, tu disposes d&apos;un droit d&apos;accès, de
          rectification et de suppression de tes données. Les données locales
          peuvent être effacées en vidant le stockage de ton navigateur. Pour toute
          demande :{" "}
          <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
