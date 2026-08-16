import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// GET /api/percentile?score=4200 → { percentile, sample }
// Pourcentage des parties des dernières 24 h dont le score est INFÉRIEUR au tien.
export async function GET(req: NextRequest) {
  const score = Math.round(
    Number(new URL(req.url).searchParams.get("score") ?? "0")
  );
  if (!SUPA_URL || !SERVICE_KEY) {
    return NextResponse.json({ percentile: null, sample: 0 });
  }
  try {
    const sinceISO = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const res = await fetch(
      `${SUPA_URL}/rest/v1/recent_activity?select=score&created_at=gte.${encodeURIComponent(
        sinceISO
      )}&limit=2000`,
      {
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
        cache: "no-store",
      }
    );
    const rows = res.ok ? await res.json() : [];
    const scores: number[] = Array.isArray(rows)
      ? rows.map((r: { score?: number }) => Number(r.score) || 0)
      : [];
    const sample = scores.length;
    if (sample === 0) return NextResponse.json({ percentile: null, sample: 0 });
    const below = scores.filter((s) => s < score).length;
    return NextResponse.json({
      percentile: Math.round((below / sample) * 100),
      sample,
    });
  } catch {
    return NextResponse.json({ percentile: null, sample: 0 });
  }
}
