"use client";

import { LegalPage, LegalSection } from "@/components/LegalPage";
import { PUBLISHER, publisherLocation } from "@/lib/publisher";
import { useLocale } from "@/lib/i18n";

const UPDATED_EN = "August 2026";
const UPDATED_FR = "août 2026";

export default function MentionsLegales() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  return (
    <LegalPage
      title={fr ? "Mentions légales" : "Legal notice"}
      updated={fr ? UPDATED_FR : UPDATED_EN}
    >
      <LegalSection title={fr ? "Éditeur du site" : "Publisher"}>
        {fr ? (
          <>
            <p>
              Le site {PUBLISHER.tradingName} est édité par{" "}
              <strong>{PUBLISHER.legalName}</strong> ({PUBLISHER.entityType}).
            </p>
            <p>Siège : {publisherLocation()}.</p>
            <p>
              Contact : <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>.
            </p>
            <p>Directeur de la publication : {PUBLISHER.publicationDirector}.</p>
          </>
        ) : (
          <>
            <p>
              {PUBLISHER.tradingName} is published by{" "}
              <strong>{PUBLISHER.legalName}</strong>, a sole proprietorship based in{" "}
              {publisherLocation()}.
            </p>
            <p>
              Contact: <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Hébergement" : "Hosting"}>
        {fr ? (
          <>
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave
              #4133, Walnut, CA 91789, États-Unis vercel.com.
            </p>
            <p>
              La base de données du mode multijoueur est fournie par{" "}
              <strong>Supabase</strong>.
            </p>
          </>
        ) : (
          <>
            <p>
              This site is hosted by <strong>Vercel Inc.</strong>, 340 S Lemon Ave
              #4133, Walnut, CA 91789, United States vercel.com.
            </p>
            <p>
              The multiplayer database is provided by <strong>Supabase</strong>.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Propriété intellectuelle" : "Intellectual property"}>
        {fr ? (
          <>
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
          </>
        ) : (
          <>
            <p>
              The {PUBLISHER.tradingName} name, logo, design and code are the property
              of {PUBLISHER.legalName}. Reproduction without permission is not
              permitted.
            </p>
            <p>
              Videos, thumbnails, titles and view counts shown in the game come from the
              YouTube Data API v3 and remain the property of their respective rights
              holders. {PUBLISHER.tradingName} is not affiliated with, endorsed by, or
              sponsored by YouTube or Google.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Paiements" : "Payments"}>
        {fr ? (
          <p>
            Les paiements (accès à vie) sont traités par <strong>Stripe</strong>.{" "}
            {PUBLISHER.tradingName} ne stocke aucune donnée bancaire.
          </p>
        ) : (
          <p>
            Payments for lifetime access are processed by <strong>Stripe</strong>.{" "}
            {PUBLISHER.tradingName} never sees or stores your card details.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Responsabilité" : "Liability"}>
        {fr ? (
          <p>
            L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des
            informations et la disponibilité du service, sans garantie. Le service
            dépend de l&apos;API YouTube, dont la disponibilité peut varier.
          </p>
        ) : (
          <p>
            We make reasonable efforts to keep the information accurate and the service
            available, but neither is guaranteed. The game depends on the YouTube API,
            whose availability is outside our control.
          </p>
        )}
      </LegalSection>
    </LegalPage>
  );
}
