import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { PUBLISHER } from "@/lib/publisher";

export const metadata: Metadata = {
  title: "CGU & CGV",
  description:
    "Conditions générales d'utilisation et de vente de ViewGuessr : accès gratuit, offre « accès à vie » à 5,99 $ CA en paiement unique, droit de rétractation et responsabilité.",
  alternates: { canonical: "/cgu" },
};

export default function CGU() {
  return (
    <LegalPage title="Conditions générales (CGU & CGV)" updated="juin 2026">
      <LegalSection title="1. Objet">
        <p>
          Les présentes conditions régissent l&apos;utilisation du jeu{" "}
          {PUBLISHER.tradingName}, édité par{" "}
          <strong>{PUBLISHER.legalName}</strong>, ainsi que la vente de
          l&apos;accès « à vie ».
        </p>
      </LegalSection>

      <LegalSection title="2. Accès au service">
        <p>
          ViewGuessr est accessible gratuitement, sans inscription. Une offre
          payante facultative (« accès à vie ») débloque des fonctionnalités
          supplémentaires.
        </p>
      </LegalSection>

      <LegalSection title="3. Offre « à vie » et prix">
        <p>
          L&apos;accès à vie est proposé au prix indiqué sur la page d&apos;achat (à
          ce jour 5,99 $ CA), par <strong>paiement unique</strong>, sans
          abonnement. Le paiement est opéré par Stripe.
        </p>
        <p>
          « À vie » s&apos;entend pour la durée d&apos;existence du service.{" "}
          {PUBLISHER.legalName} ne peut garantir une disponibilité perpétuelle en cas d&apos;arrêt du service
          ou de l&apos;API YouTube.
        </p>
      </LegalSection>

      <LegalSection title="4. Droit de rétractation">
        <p>
          Conformément à l&apos;article L221-28 du Code de la consommation, pour un
          contenu numérique fourni immédiatement, tu reconnais renoncer à ton droit
          de rétractation dès que l&apos;accès est débloqué. Pour toute question ou
          réclamation :{" "}
          <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="5. Utilisation correcte">
        <p>
          Tu t&apos;engages à ne pas perturber le service, à ne pas tenter
          d&apos;accéder aux systèmes de façon non autorisée, et à respecter les
          autres joueurs en multijoueur.
        </p>
      </LegalSection>

      <LegalSection title="6. Contenus tiers">
        <p>
          Les vidéos et données proviennent de l&apos;API YouTube. ViewGuessr
          n&apos;est pas affilié à YouTube/Google et n&apos;est pas responsable de
          ces contenus.
        </p>
      </LegalSection>

      <LegalSection title="7. Responsabilité">
        <p>
          Le service est fourni « en l&apos;état ». La responsabilité de{" "}
          {PUBLISHER.legalName} ne saurait être engagée pour une indisponibilité temporaire ou une
          interruption indépendante de sa volonté.
        </p>
      </LegalSection>

      <LegalSection title="8. Médiation de la consommation">
        <p>
          En cas de litige, tu dois d&apos;abord nous contacter à{" "}
          <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a> afin
          de rechercher une solution amiable. À défaut d&apos;accord, et conformément
          aux articles L611-1 et suivants du Code de la consommation, tu peux
          recourir gratuitement à un médiateur de la consommation&nbsp;; ses
          coordonnées te sont communiquées sur demande à cette même adresse.
        </p>
      </LegalSection>

      <LegalSection title="9. Droit applicable">
        <p>
          Les présentes conditions sont soumises à {PUBLISHER.governingLaw}. En cas de
          litige, une solution amiable sera recherchée avant toute action
          judiciaire.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
