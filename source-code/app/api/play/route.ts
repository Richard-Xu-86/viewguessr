import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Limites quotidiennes gratuites (doivent rester alignées avec lib/limits.ts).
const FREE_LIMITS: Record<"solo" | "mp", number> = { solo: 2, mp: 1 };

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// Clé SERVICE_ROLE (jamais exposée au client) → contourne la RLS pour écrire le quota.
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SALT = process.env.IP_HASH_SALT || SERVICE_KEY || "viewguessr-salt";

/** Date du jour en Europe/Paris (YYYY-MM-DD) — le quota se réinitialise à minuit local. */
function parisDay(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function clientIP(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "0.0.0.0";
}

function svcHeaders(prefer?: string): HeadersInit {
  const h: Record<string, string> = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
  if (prefer) h.Prefer = prefer;
  return h;
}

export async function POST(req: NextRequest) {
  let mode: "solo" | "mp" = "solo";
  let pro = false;
  let peek = false;
  try {
    const body = await req.json();
    if (body?.mode === "mp") mode = "mp";
    pro = Boolean(body?.pro);
    peek = Boolean(body?.peek);
  } catch {
    /* corps vide → solo par défaut */
  }

  const limit = FREE_LIMITS[mode];

  // Détenteurs de l'accès à vie : aucun quota.
  if (pro) return NextResponse.json({ allowed: true, remaining: null });

  // Suivi serveur non configuré (clé/URL absentes) → on laisse passer (aucune régression).
  if (!SUPA_URL || !SERVICE_KEY) {
    return NextResponse.json({ allowed: true, remaining: null, enforced: false });
  }

  try {
    const ip = clientIP(req);
    // On ne stocke jamais l'IP en clair : seulement un hash salé (respect de la vie privée).
    const ipHash = createHash("sha256")
      .update(`${SALT}:${ip}`)
      .digest("hex")
      .slice(0, 32);
    const id = `${ipHash}:${parisDay()}`;
    const base = `${SUPA_URL}/rest/v1/play_quota`;

    // Compteur actuel pour ce mode aujourd'hui.
    const getRes = await fetch(
      `${base}?id=eq.${encodeURIComponent(id)}&select=solo,mp`,
      { headers: svcHeaders(), cache: "no-store" }
    );
    const rows = getRes.ok ? await getRes.json() : [];
    const current: number =
      Array.isArray(rows) && rows[0] ? Number(rows[0][mode]) || 0 : 0;

    if (current >= limit) {
      return NextResponse.json({ allowed: false, remaining: 0 });
    }

    // Peek : vérification SANS consommer (utilisé par le lobby multijoueur).
    if (peek) {
      return NextResponse.json({
        allowed: true,
        remaining: Math.max(0, limit - current),
      });
    }

    // Incrémente (upsert sur id ; ne touche que la colonne du mode joué).
    const next = current + 1;
    await fetch(`${base}?on_conflict=id`, {
      method: "POST",
      headers: svcHeaders("resolution=merge-duplicates,return=minimal"),
      body: JSON.stringify([
        { id, [mode]: next, updated_at: new Date().toISOString() },
      ]),
    });

    return NextResponse.json({ allowed: true, remaining: Math.max(0, limit - next) });
  } catch {
    // Erreur serveur → fail-open (on ne casse jamais le jeu).
    return NextResponse.json({ allowed: true, remaining: null, enforced: false });
  }
}
