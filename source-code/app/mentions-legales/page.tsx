import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de ViewGuessr : éditeur PENRA (Adrien Pennetier, Strasbourg), hébergement, propriété intellectuelle et contact.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="juin 2026">
      <LegalSection title="Éditeur du site">
        <p>
          Le site ViewGuessr est édité par <strong>PENRA</strong>, entreprise
          individuelle représentée par <strong>Adrien Pennetier</strong>.
        </p>
        <p>Dénomination : ADRIEN PENNETIER nom commercial : PENRA.</p>
        <p>SIREN : 989&nbsp;816&nbsp;947 SIRET du siège : 989&nbsp;816&nbsp;947&nbsp;00018.</p>
        <p>Code APE/NAF : 62.01Z (programmation informatique).</p>
        <p>Siège social : Strasbourg (67), France.</p>
        <p>TVA : non applicable, article 293&nbsp;B du CGI (franchise en base de TVA).</p>
        <p>
          Contact :{" "}
          <a href="mailto:penra.contact@gmail.com">penra.contact@gmail.com</a>.
        </p>
        <p>Directeur de la publication : Adrien Pennetier.</p>
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
          La marque, le logo, le design et le code de ViewGuessr sont la propriété
          de PENRA. Toute reproduction sans autorisation est interdite.
        </p>
        <p>
          Les vidéos, miniatures, titres et nombres de vues affichés proviennent de
          l&apos;API YouTube Data v3 et restent la propriété de leurs ayants droit
          respectifs. ViewGuessr n&apos;est ni affilié ni approuvé par YouTube ou
          Google.
        </p>
      </LegalSection>

      <LegalSection title="Paiements">
        <p>
          Les paiements (accès à vie) sont traités par <strong>Stripe</strong>.
          ViewGuessr ne stocke aucune donnée bancaire.
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
