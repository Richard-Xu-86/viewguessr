import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function svcHeaders(prefer?: string): Record<string, string> {
  const h: Record<string, string> = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
  if (prefer) h.Prefer = prefer;
  return h;
}

function parisDay(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isDay(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/** Compte total de lignes via l'en-tête content-range de PostgREST. */
async function countOf(urlStr: string): Promise<number> {
  const res = await fetch(urlStr, {
    headers: { ...svcHeaders("count=exact"), Range: "0-0" },
    cache: "no-store",
  });
  const cr = res.headers.get("content-range"); // ex. "0-0/123" ou "*/0"
  return cr && cr.includes("/") ? Number(cr.split("/")[1]) || 0 : 0;
}

/** Rang d'un score (1 = meilleur) : nombre de scores strictement supérieurs + 1. */
async function rankOf(base: string, day: string, score: number): Promise<number> {
  const gt = await countOf(`${base}?day=eq.${day}&score=gt.${score}&select=client_id`);
  return gt + 1;
}

// GET /api/daily-leaderboard?day=YYYY-MM-DD&cid=XXX
// → { top: [{ rank, name, score, mine }], total, rank }
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const day = isDay(url.searchParams.get("day")) ? url.searchParams.get("day")! : parisDay();
  const cid = (url.searchParams.get("cid") ?? "").slice(0, 64);

  if (!SUPA_URL || !SERVICE_KEY) {
    return NextResponse.json({ top: [], total: 0, rank: null });
  }
  const base = `${SUPA_URL}/rest/v1/daily_scores`;
  try {
    const res = await fetch(
      `${base}?day=eq.${day}&select=client_id,name,score&order=score.desc,created_at.asc&limit=20`,
      { headers: svcHeaders(), cache: "no-store" }
    );
    const rows: { client_id: string; name: string; score: number }[] = res.ok
      ? await res.json()
      : [];
    const total = await countOf(`${base}?day=eq.${day}&select=client_id`);

    let rank: number | null = null;
    if (cid) {
      const meRes = await fetch(
        `${base}?day=eq.${day}&client_id=eq.${encodeURIComponent(cid)}&select=score`,
        { headers: svcHeaders(), cache: "no-store" }
      );
      const meRows: { score: number }[] = meRes.ok ? await meRes.json() : [];
      if (meRows[0]) rank = await rankOf(base, day, meRows[0].score);
    }

    const top = rows.map((r, i) => ({
      rank: i + 1,
      name: r.name,
      score: r.score,
      mine: !!cid && r.client_id === cid,
    }));
    return NextResponse.json({ top, total, rank });
  } catch {
    return NextResponse.json({ top: [], total: 0, rank: null });
  }
}

// POST /api/daily-leaderboard { day, cid, name, score } → publie / met à jour mon score.
export async function POST(req: NextRequest) {
  if (!SUPA_URL || !SERVICE_KEY) return NextResponse.json({ ok: false });
  try {
    const body = await req.json();
    const day = isDay(body?.day) ? body.day : parisDay();
    const cid = String(body?.cid ?? "").slice(0, 64);
    if (!cid) return NextResponse.json({ ok: false });
    const name =
      String(body?.name ?? "Anonyme")
        .replace(/\s*✦\s*$/, "")
        .trim()
        .slice(0, 24) || "Anonyme";
    const score = Math.max(0, Math.min(25000, Math.round(Number(body?.score) || 0)));

    const base = `${SUPA_URL}/rest/v1/daily_scores`;
    await fetch(`${base}?on_conflict=day,client_id`, {
      method: "POST",
      headers: svcHeaders("resolution=merge-duplicates,return=minimal"),
      body: JSON.stringify([{ day, client_id: cid, name, score }]),
    });

    const rank = await rankOf(base, day, score);
    const total = await countOf(`${base}?day=eq.${day}&select=client_id`);
    return NextResponse.json({ ok: true, rank, total });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
