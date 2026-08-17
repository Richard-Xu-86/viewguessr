import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrCreateLicenseCode } from "@/lib/licenses-server";
import { sendLicenseEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

function getStripe(): Stripe | null {
  const key =
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_KEY ||
    process.env.STRIPE_KEY_TEST;
  if (!key) return null;
  return new Stripe(key);
}

// POST /api/webhook — appelé par Stripe à chaque événement.
// On crée la licence dès que le paiement est confirmé, INDÉPENDAMMENT du retour
// de l'acheteur sur /merci (évite « payé mais aucune trace » si l'onglet est fermé).
// Config requise : créer le webhook dans Stripe (événement checkout.session.completed)
// et poser STRIPE_WEBHOOK_SECRET sur Vercel.
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !WEBHOOK_SECRET) {
    // Non configuré → on ignore proprement (aucune régression).
    return NextResponse.json({ received: true, configured: false });
  }

  const sig = req.headers.get("stripe-signature") ?? "";
  const body = await req.text(); // corps BRUT requis pour vérifier la signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        const code = await getOrCreateLicenseCode(session.id);
        // Envoi du code par e-mail : sans ça, un acheteur qui ferme l'onglet
        // n'a AUCUN moyen de récupérer son achat. Best-effort — un échec
        // d'envoi ne doit pas invalider la licence déjà créée.
        const to = session.customer_details?.email ?? null;
        const locale = session.metadata?.locale === "fr" ? "fr" : "en";
        if (code && to) await sendLicenseEmail(to, code, locale);
      }
    }
  } catch {
    /* On répond 200 malgré tout pour éviter les renvois en boucle de Stripe. */
  }

  return NextResponse.json({ received: true });
}
