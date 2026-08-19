"use client";

import { LegalPage, LegalSection } from "@/components/LegalPage";
import { PUBLISHER } from "@/lib/publisher";
import { useLocale } from "@/lib/i18n";

export default function Confidentialite() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const mail = <a href={`mailto:${PUBLISHER.email}`}>{PUBLISHER.email}</a>;

  return (
    <LegalPage
      title={fr ? "Politique de confidentialité" : "Privacy policy"}
      updated={fr ? "août 2026" : "August 2026"}
    >
      {fr ? (
        <>
          <p>
            {PUBLISHER.tradingName} (édité par {PUBLISHER.legalName}) attache de
            l&apos;importance à ta vie privée. Le jeu est conçu pour collecter le
            minimum de données.
          </p>
          <p>
            Responsable du traitement : {PUBLISHER.legalName}, {PUBLISHER.city} {mail}.
          </p>
        </>
      ) : (
        <>
          <p>
            {PUBLISHER.tradingName} is built to collect as little as possible. There are
            no accounts, and most of what the game remembers never leaves your browser.
          </p>
          <p>
            Data controller: {PUBLISHER.legalName}, {PUBLISHER.city} {mail}.
          </p>
        </>
      )}

      <LegalSection title={fr ? "Aucun compte requis" : "No account needed"}>
        {fr ? (
          <p>
            Tu peux jouer sans créer de compte. Aucune adresse e-mail ni mot de passe
            n&apos;est demandé pour jouer.
          </p>
        ) : (
          <p>
            You can play without signing up. No email address or password is required to
            play.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Données stockées sur ton appareil" : "Data kept on your device"}>
        {fr ? (
          <p>
            Ton pseudo, tes préférences et tes meilleurs scores sont enregistrés{" "}
            <strong>localement</strong> dans ton navigateur (localStorage). Ces
            données-là restent sur ton appareil et ne sont pas envoyées à nos serveurs.
          </p>
        ) : (
          <p>
            Your nickname, preferences and personal best scores are stored{" "}
            <strong>locally</strong> in your browser (localStorage). That data stays on
            your device and is never sent to our servers. Clearing your browser storage
            deletes it.
          </p>
        )}
      </LegalSection>

      <LegalSection
        title={fr ? "Adresse IP (anti-triche & accès à vie)" : "IP address (fair play and purchase detection)"}
      >
        {fr ? (
          <p>
            Pour limiter le nombre de parties gratuites par jour et pour reconnaître
            automatiquement un accès à vie déjà acheté, nous transmettons à nos serveurs
            un <strong>identifiant non réversible</strong> dérivé de ton adresse IP (un
            « hash » salé). Nous ne conservons pas ton adresse IP en clair, et cet
            identifiant ne permet pas de remonter jusqu&apos;à toi : il sert uniquement à
            compter les parties et à détecter un achat.
          </p>
        ) : (
          <p>
            To limit free games per day, and to recognise a lifetime purchase you have
            already made, we send our servers a{" "}
            <strong>one-way identifier</strong> derived from your IP address (a salted
            hash). We do not store your IP address itself, and the identifier cannot be
            reversed back to you — it only counts games and detects an existing purchase.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Données de jeu en ligne" : "Online game data"}>
        {fr ? (
          <>
            <p>
              En multijoueur, ton pseudo, tes réponses et ton score sont transmis à notre
              base de données (Supabase) afin de synchroniser la partie entre les joueurs.
            </p>
            <p>
              À la fin d&apos;une partie, ton pseudo et ton score peuvent être enregistrés
              et affichés dans le bandeau d&apos;« activité » public de l&apos;accueil.
              Choisis un pseudo non identifiant si tu ne souhaites pas y figurer. Ces
              données récentes sont conservées de façon limitée (environ 30 jours).
            </p>
          </>
        ) : (
          <>
            <p>
              In multiplayer, your nickname, guesses and score are sent to our database
              (Supabase) so the game can stay in sync between players.
            </p>
            <p>
              When a game ends, your nickname and score may be shown in the public
              activity feed on the home page. Pick a nickname that does not identify you
              if you would rather not appear there. This recent activity is kept for
              around 30 days.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Paiement" : "Payment"}>
        {fr ? (
          <>
            <p>
              Les achats sont gérés par <strong>Stripe</strong>. Les informations
              bancaires sont traitées directement par Stripe ; nous n&apos;y avons jamais
              accès.
            </p>
            <p>
              Lors de l&apos;achat, ton <strong>adresse e-mail</strong> est collectée pour
              t&apos;envoyer ton code d&apos;accès et assurer le support. Elle n&apos;est
              utilisée à aucune autre fin.
            </p>
          </>
        ) : (
          <>
            <p>
              Purchases are handled by <strong>Stripe</strong>. Card details go straight
              to Stripe — we never see or store them.
            </p>
            <p>
              At checkout your <strong>email address</strong> is collected so we can send
              your access code and help you if something goes wrong. It is not used for
              anything else, and we do not send marketing.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title={fr ? "E-mail" : "Email"}>
        {fr ? (
          <p>
            L&apos;e-mail contenant ton code d&apos;accès est envoyé via{" "}
            <strong>Brevo</strong>, qui traite ton adresse pour notre compte uniquement
            afin de délivrer ce message.
          </p>
        ) : (
          <p>
            The email containing your access code is sent through <strong>Brevo</strong>,
            which processes your address on our behalf solely to deliver that message.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Cookies & traceurs" : "Cookies and tracking"}>
        {fr ? (
          <p>
            {PUBLISHER.tradingName} n&apos;utilise pas de cookies publicitaires ni de
            traceurs tiers à des fins de profilage.
          </p>
        ) : (
          <p>
            {PUBLISHER.tradingName} uses no advertising cookies and no third-party
            profiling trackers.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Mesure d'audience" : "Analytics"}>
        {fr ? (
          <p>
            Pour comprendre la fréquentation du site, nous utilisons{" "}
            <strong>Vercel Analytics</strong> : il ne dépose aucun cookie et ne collecte
            que des statistiques anonymes et agrégées, sans permettre de t&apos;identifier.
          </p>
        ) : (
          <p>
            To understand how the site is used we run <strong>Vercel Analytics</strong>.
            It sets no cookies and collects only anonymous, aggregated statistics that
            cannot identify you.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Hébergement et sous-traitants" : "Hosting and processors"}>
        {fr ? (
          <p>
            Le site est hébergé par <strong>Vercel</strong>. Les données de jeu en ligne
            sont stockées chez <strong>Supabase</strong>, les paiements traités par{" "}
            <strong>Stripe</strong> et les e-mails envoyés via <strong>Brevo</strong>. Ces
            prestataires peuvent traiter des données en dehors de ton pays. Nous
            conservons chaque donnée le temps nécessaire à sa finalité.
          </p>
        ) : (
          <p>
            The site is hosted by <strong>Vercel</strong>. Online game data is stored with{" "}
            <strong>Supabase</strong>, payments are processed by <strong>Stripe</strong>,
            and email is sent through <strong>Brevo</strong>. These providers may process
            data outside your country. We keep each piece of data only as long as it is
            needed for its purpose.
          </p>
        )}
      </LegalSection>

      <LegalSection title={fr ? "Tes droits" : "Your rights"}>
        {fr ? (
          <p>
            Tu peux demander l&apos;accès, la rectification ou la suppression de tes
            données. Les données locales peuvent être effacées en vidant le stockage de
            ton navigateur. Pour toute demande : {mail}.
          </p>
        ) : (
          <p>
            You can ask us to access, correct or delete your data. Anything stored
            locally you can remove yourself by clearing your browser storage. For
            anything else, email {mail} and we will respond.
          </p>
        )}
      </LegalSection>
    </LegalPage>
  );
}
