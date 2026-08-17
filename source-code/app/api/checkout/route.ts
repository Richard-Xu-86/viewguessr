import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripe(): Stripe | null {
  // Clé LIVE en priorité (STRIPE_SECRET_KEY). La clé de test (STRIPE_KEY_TEST)
  // ne sert que de repli, typiquement en local.
  const key =
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_KEY ||
    process.env.STRIPE_KEY_TEST;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe non configuré (STRIPE_SECRET_KEY manquante)." },
      { status: 500 }
    );
  }

  // Origine de la requête (fonctionne en local comme sur Vercel)
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const origin = `${proto}://${host}`;

  // Hash de l'IP de l'acheteur → détection auto de l'accès sur un autre navigateur
  // du même réseau (via /api/pro-status), sans saisir d'e-mail.
  const xff = req.headers.get("x-forwarded-for");
  const ip = (xff ? xff.split(",")[0] : req.headers.get("x-real-ip") || "0.0.0.0").trim();
  const ipHash = createHash("sha256")
    .update(`${process.env.IP_HASH_SALT || "viewguessr-ip-salt-v1"}:${ip}`)
    .digest("hex")
    .slice(0, 40);

  // Langue de l'acheteur : sert à choisir la langue de l'e-mail contenant le
  // code d'accès (envoyé depuis /api/webhook). "en" par défaut.
  let locale: "fr" | "en" = "en";
  try {
    const body = await req.json();
    if (body?.locale === "fr" || body?.locale === "en") locale = body.locale;
  } catch {
    /* pas de corps JSON : on garde la valeur par défaut */
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata: { locale },
      // Crée un client Stripe (avec l'e-mail) → permet de restaurer l'achat
      // depuis n'importe quel navigateur via /api/restore.
      customer_creation: "always",
      payment_intent_data: { metadata: { ip_hash: ipHash } },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: 399, // 3,99 €
            product_data: {
              name: "ViewGuessr Accès à vie",
              description:
                "Débloque tout, à vie : parties solo illimitées, multijoueur illimité (jusqu'à 10 joueurs), paiement unique.",
              images: [`${origin}/logo.png`],
            },
          },
        },
      ],
      // Récupère l'e-mail de l'acheteur (utile pour le support / futures licences)
      success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pro`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
