import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { PUBLISHER, publisherLocation } from "@/lib/publisher";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales de ${PUBLISHER.tradingName} : éditeur, hébergement, propriété intellectuelle et contact.`,
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="août 2026">
      <LegalSection title="Éditeur du site">
        <p>
          Le site {PUBLISHER.tradingName} est édité par{" "}
          <strong>{PUBLISHER.legalName}</strong> ({PUBLISHER.entityType}).
        </p>
        {PUBLISHER.registrationNumber && (
          <p>
            {PUBLISHER.registrationLabel} : {PUBLISHER.registrationNumber}.
          </p>
        )}
        {PUBLISHER.activityCode && <p>Code d&apos;activité : {PUBLISHER.activityCode}.</p>}
        <p>Siège : {publisherLocation()}.</p>
        {PUBLISHER.vatNote && <p>TVA : {PUBLISHER.vatNote}.</p>}
        <p>
          Contact : <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>.
        </p>
        <p>Directeur de la publication : {PUBLISHER.publicationDirector}.</p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave
          #4133, Walnut, CA 91789, États-Unis vercel.com.
        </p>
        <p>
          La base de données du mode multijoueur est fournie par{" "}
          <strong>Supabase</strong>.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          La marque, le logo, le design et le code de {PUBLISHER.tradingName} sont
          la propriété de {PUBLISHER.legalName}. Toute reproduction sans
          autorisation est interdite.
        </p>
        <p>
          Les vidéos, miniatures, titres et nombres de vues affichés proviennent de
          l&apos;API YouTube Data v3 et restent la propriété de leurs ayants droit
          respectifs. {PUBLISHER.tradingName} n&apos;est ni affilié ni approuvé par
          YouTube ou Google.
        </p>
      </LegalSection>

      <LegalSection title="Paiements">
        <p>
          Les paiements (accès à vie) sont traités par <strong>Stripe</strong>.{" "}
          {PUBLISHER.tradingName} ne stocke aucune donnée bancaire.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des
          informations et la disponibilité du service, sans garantie. Le service
          dépend de l&apos;API YouTube, dont la disponibilité peut varier.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
