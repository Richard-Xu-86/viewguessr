import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrCreateLicenseCode } from "@/lib/licenses-server";

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

// GET /api/verify?session_id=cs_...
export async function GET(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }
  const id = new URL(req.url).searchParams.get("session_id");
  if (!id) {
    return NextResponse.json(
      { paid: false, error: "session_id is missing" },
      { status: 400 }
    );
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    const paid = session.payment_status === "paid";
    const code = paid ? await getOrCreateLicenseCode(id) : null;
    return NextResponse.json({
      paid,
      email: session.customer_details?.email ?? null,
      code,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ paid: false, error: message }, { status: 500 });
  }
}
