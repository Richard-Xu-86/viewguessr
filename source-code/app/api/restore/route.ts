import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function svcHeaders(): Record<string, string> {
  return { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };
}

// POST /api/restore { code }
// Débloque l'accès à vie UNIQUEMENT si le code d'achat (secret, remis à l'achat)
// existe. Connaître l'e-mail d'un acheteur ne suffit plus.
export async function POST(req: NextRequest) {
  if (!SUPA_URL || !SERVICE_KEY) {
    return NextResponse.json(
      { active: false, error: "Restore is unavailable right now." },
      { status: 500 }
    );
  }

  let code = "";
  try {
    const body = await req.json();
    // Normalisation : majuscules, on retire tirets/espaces.
    code = String(body?.code ?? "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  } catch {
    /* corps invalide */
  }
  if (code.length < 8) {
    return NextResponse.json(
      { active: false, error: "Invalid code." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${SUPA_URL}/rest/v1/licenses?code=eq.${encodeURIComponent(code)}&select=code&limit=1`,
      { headers: svcHeaders(), cache: "no-store" }
    );
    const rows = res.ok ? await res.json() : [];
    return NextResponse.json({ active: Array.isArray(rows) && rows.length > 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ active: false, error: message }, { status: 500 });
  }
}
