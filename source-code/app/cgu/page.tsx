"use client";

import { LegalPage, LegalSection } from "@/components/LegalPage";
import { PUBLISHER } from "@/lib/publisher";
import { useLocale } from "@/lib/i18n";

const PRICE_EN = "CA$5.99";
const PRICE_FR = "5,99 $ CA";

export default function CGU() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const mail = <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>;

  return (
    <LegalPage
      title={fr ? "Conditions générales" : "Terms of Service"}
      updated={fr ? "août 2026" : "August 2026"}
    >
      <LegalSection title={fr ? "1. Objet" : "1. Who we are"}>
        {fr ? (
          <p>
            Les présentes conditions régissent l&apos;utilisation du jeu{" "}
            {PUBLISHER.tradingName}, édité par <strong>{PUBLISHER.legalName}</strong>,
            ainsi que la vente de l&apos;accès à vie.
          </p>
        ) : (
          <p>
            These terms govern your use of {PUBLISHER.tradingName}, operated by{" "}
            <strong>{PUBLISHER.legalName}</strong>, and the sale of lifetime access. By
            playing, you agree to them.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "2. Accès au service" : "2. Playing the game"}>
        {fr ? (
          <p>
            {PUBLISHER.tradingName} est accessible gratuitement, sans inscription. Une
            offre payante facultative (« accès à vie ») débloque des fonctionnalités
            supplémentaires.
          </p>
        ) : (
          <p>
            {PUBLISHER.tradingName} is free to play and needs no account. An optional
            one-time purchase unlocks additional features. Free play is limited to a
            set number of games per day.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "3. Accès à vie et prix" : "3. Lifetime access and price"}>
        {fr ? (
          <>
            <p>
              L&apos;accès à vie est proposé au prix indiqué sur la page d&apos;achat (à
              ce jour {PRICE_FR}), par <strong>paiement unique</strong>, sans
              abonnement. Le paiement est opéré par Stripe.
            </p>
            <p>
              « À vie » s&apos;entend pour la durée d&apos;existence du service.{" "}
              {PUBLISHER.legalName} ne peut garantir une disponibilité perpétuelle en cas
              d&apos;arrêt du service ou de l&apos;API YouTube.
            </p>
          </>
        ) : (
          <>
            <p>
              Lifetime access costs the price shown on the purchase page (currently{" "}
              {PRICE_EN}) as a <strong>single payment</strong>. There is no
              subscription and no recurring charge. Payment is handled by Stripe.
            </p>
            <p>
              "Lifetime" means for as long as the service exists. We cannot guarantee it
              runs forever — if {PUBLISHER.tradingName} shuts down, or the YouTube API
              becomes unavailable, the service may end.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title={fr ? "4. Livraison et remboursement" : "4. Delivery and refunds"}>
        {fr ? (
          <>
            <p>
              L&apos;accès est débloqué immédiatement après le paiement. Un code
              d&apos;accès personnel s&apos;affiche à l&apos;écran et t&apos;est envoyé
              par e-mail : c&apos;est lui qui permet de retrouver ton accès sur un autre
              appareil. Conserve-le.
            </p>
            <p>
              S&apos;agissant d&apos;un contenu numérique livré immédiatement, les ventes
              sont définitives une fois le code délivré. Si quelque chose ne fonctionne
              pas — code non reçu, accès non débloqué — écris-nous à {mail} et nous
              réglerons le problème ou procéderons au remboursement.
            </p>
          </>
        ) : (
          <>
            <p>
              Access unlocks immediately after payment. A personal access code is shown
              on screen and sent to you by email — that code is what restores your access
              on another browser or device, so keep it.
            </p>
            <p>
              Because this is digital content delivered instantly, sales are final once
              the code has been issued. If something goes wrong — the code never arrived,
              or access will not unlock — email {mail} and we will fix it or refund you.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title={fr ? "5. Utilisation correcte" : "5. Acceptable use"}>
        {fr ? (
          <p>
            Tu t&apos;engages à ne pas perturber le service, à ne pas tenter
            d&apos;accéder aux systèmes de façon non autorisée, et à respecter les autres
            joueurs en multijoueur.
          </p>
        ) : (
          <p>
            Do not disrupt the service, attempt unauthorised access to our systems, or
            abuse other players in multiplayer. We may block access that does.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "6. Contenus tiers" : "6. Third-party content"}>
        {fr ? (
          <p>
            Les vidéos et données proviennent de l&apos;API YouTube.{" "}
            {PUBLISHER.tradingName} n&apos;est pas affilié à YouTube/Google et n&apos;est
            pas responsable de ces contenus.
          </p>
        ) : (
          <p>
            Videos and view data come from the YouTube API. {PUBLISHER.tradingName} is
            not affiliated with YouTube or Google and is not responsible for that
            content.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "7. Responsabilité" : "7. Liability"}>
        {fr ? (
          <p>
            Le service est fourni « en l&apos;état ». La responsabilité de{" "}
            {PUBLISHER.legalName} ne saurait être engagée pour une indisponibilité
            temporaire ou une interruption indépendante de sa volonté.
          </p>
        ) : (
          <p>
            The service is provided "as is". {PUBLISHER.legalName} is not liable for
            temporary unavailability or interruptions outside our control. Nothing here
            limits liability that cannot be limited by law.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "8. Modification des conditions" : "8. Changes to these terms"}>
        {fr ? (
          <p>
            Ces conditions peuvent évoluer. La version en vigueur est celle publiée sur
            cette page, avec sa date de mise à jour.
          </p>
        ) : (
          <p>
            These terms may change. The version in force is the one published on this
            page, with the update date shown above.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "9. Droit applicable" : "9. Governing law"}>
        {fr ? (
          <p>
            Les présentes conditions sont soumises à {PUBLISHER.governingLaw}. En cas de
            litige, contacte-nous d&apos;abord à {mail} : nous chercherons une solution
            amiable avant toute action judiciaire.
          </p>
        ) : (
          <p>
            These terms are governed by the laws of the Province of Ontario, Canada. If
            something goes wrong, contact us first at {mail} — we would rather resolve it
            directly than formally.
          </p>
        )}
      </LegalSection>
    </LegalPage>
  );
}
