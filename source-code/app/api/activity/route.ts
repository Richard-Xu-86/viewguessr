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

// GET /api/activity → { todayCount, recent[] } (parties des dernières 24 h).
export async function GET() {
  if (!SUPA_URL || !SERVICE_KEY) {
    return NextResponse.json({ todayCount: 0, recent: [] });
  }
  const base = `${SUPA_URL}/rest/v1/recent_activity`;
  try {
    const sinceISO = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const [recentRes, countRes] = await Promise.all([
      fetch(`${base}?select=name,score,mode,created_at&order=created_at.desc&limit=8`, {
        headers: svcHeaders(),
        cache: "no-store",
      }),
      fetch(`${base}?select=id&created_at=gte.${encodeURIComponent(sinceISO)}`, {
        headers: { ...svcHeaders("count=exact"), Range: "0-0" },
        cache: "no-store",
      }),
    ]);
    const recent = recentRes.ok ? await recentRes.json() : [];
    let todayCount = 0;
    const cr = countRes.headers.get("content-range"); // ex. "0-0/123" ou "*/0"
    if (cr && cr.includes("/")) todayCount = Number(cr.split("/")[1]) || 0;
    return NextResponse.json({ todayCount, recent });
  } catch {
    return NextResponse.json({ todayCount: 0, recent: [] });
  }
}

// POST /api/activity → journalise une partie terminée.
export async function POST(req: NextRequest) {
  if (!SUPA_URL || !SERVICE_KEY) return NextResponse.json({ ok: false });
  try {
    const body = await req.json();
    const name =
      String(body?.name ?? "Un joueur")
        .replace(/\s*✦\s*$/, "")
        .trim()
        .slice(0, 24) || "Un joueur";
    const score = Math.max(0, Math.min(25000, Math.round(Number(body?.score) || 0)));
    const mode = ["solo", "defi", "multi", "hl"].includes(body?.mode) ? body.mode : "solo";

    await fetch(`${SUPA_URL}/rest/v1/recent_activity`, {
      method: "POST",
      headers: svcHeaders("return=minimal"),
      body: JSON.stringify([{ name, score, mode }]),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
