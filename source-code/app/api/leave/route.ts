import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Marque un joueur comme « parti » (has_left=true) quand son onglet/navigateur se
// ferme. Appelée via navigator.sendBeacon depuis le client (pas d'en-tête auth
// possible à la fermeture → on passe par cette route serveur qui détient la clé).
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export async function POST(req: NextRequest) {
  if (!SUPA_URL || !KEY) return NextResponse.json({ ok: false });
  try {
    // sendBeacon envoie un Blob → on lit le corps en texte puis on parse.
    const raw = await req.text();
    let body: { gameId?: string; playerId?: string } = {};
    try {
      body = JSON.parse(raw || "{}");
    } catch {
      /* corps vide/invalide */
    }
    const gameId = String(body.gameId ?? "");
    const playerId = String(body.playerId ?? "");
    // Validation simple (UUID) pour éviter toute injection dans le filtre PostgREST.
    const isUuid = (s: string) =>
      /^[0-9a-fA-F-]{10,40}$/.test(s);
    if (!isUuid(gameId) || !isUuid(playerId)) {
      return NextResponse.json({ ok: false });
    }

    await fetch(
      `${SUPA_URL}/rest/v1/players?id=eq.${playerId}&game_id=eq.${gameId}`,
      {
        method: "PATCH",
        headers: {
          apikey: KEY,
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ has_left: true }),
        cache: "no-store",
      }
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
