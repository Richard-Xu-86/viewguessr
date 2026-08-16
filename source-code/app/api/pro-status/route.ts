import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripe(): Stripe | null {
  const key =
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_KEY ||
    process.env.STRIPE_KEY_TEST;
  if (!key) return null;
  return new Stripe(key);
}

function ipHashOf(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  const ip = (xff ? xff.split(",")[0] : req.headers.get("x-real-ip") || "0.0.0.0").trim();
  return createHash("sha256")
    .update(`${process.env.IP_HASH_SALT || "viewguessr-ip-salt-v1"}:${ip}`)
    .digest("hex")
    .slice(0, 40);
}

// GET /api/pro-status
// Détection AUTOMATIQUE (sans e-mail) de l'accès à vie : on cherche un paiement
// réussi marqué avec la même adresse IP (ex. acheté sur Safari, ouvert sur Chrome
// du même Mac → même IP publique). Source de vérité : Stripe.
export async function GET(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ pro: false });

  try {
    const hash = ipHashOf(req);
    const since = Math.floor(Date.now() / 1000) - 60 * 24 * 3600; // fenêtre : 60 jours
    const result = await stripe.paymentIntents.search({
      query: `status:'succeeded' AND metadata['ip_hash']:'${hash}' AND created>${since}`,
      limit: 1,
    });
    return NextResponse.json({ pro: result.data.length > 0 });
  } catch {
    // Recherche indisponible / erreur → on ne débloque pas (le lien de secours reste).
    return NextResponse.json({ pro: false });
  }
}
