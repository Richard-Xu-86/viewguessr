import { NextResponse } from "next/server";
import { fetchVideos } from "@/lib/youtube-server";
import type { YTVideo } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const DAILY_ROUNDS = 5;

function parisDay(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function svcHeaders(prefer?: string): Record<string, string> {
  const h: Record<string, string> = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
  if (prefer) h.Prefer = prefer;
  return h;
}

// GET /api/daily → les 5 mêmes vidéos pour tout le monde aujourd'hui.
export async function GET() {
  const day = parisDay();

  // Sans Supabase configuré : repli sur un set frais (non partagé) pour ne rien casser.
  if (!SUPA_URL || !SERVICE_KEY) {
    try {
      const videos = await fetchVideos(DAILY_ROUNDS);
      return NextResponse.json({ day, videos, shared: false });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Défi indisponible." },
        { status: 502 }
      );
    }
  }

  const base = `${SUPA_URL}/rest/v1/daily_challenge`;
  try {
    // 1) Déjà généré aujourd'hui ?
    const getRes = await fetch(`${base}?day=eq.${day}&select=videos`, {
      headers: svcHeaders(),
      cache: "no-store",
    });
    const rows = getRes.ok ? await getRes.json() : [];
    if (Array.isArray(rows) && rows[0]?.videos?.length) {
      return NextResponse.json({ day, videos: rows[0].videos as YTVideo[], shared: true });
    }

    // 2) Génère et stocke (ignore-duplicates : le 1er écrivain gagne en cas de course).
    const fresh = await fetchVideos(DAILY_ROUNDS);
    await fetch(`${base}?on_conflict=day`, {
      method: "POST",
      headers: svcHeaders("resolution=ignore-duplicates,return=minimal"),
      body: JSON.stringify([{ day, videos: fresh }]),
    });

    // 3) Relit le set autoritatif (au cas où une autre requête a écrit avant nous).
    const get2 = await fetch(`${base}?day=eq.${day}&select=videos`, {
      headers: svcHeaders(),
      cache: "no-store",
    });
    const rows2 = get2.ok ? await get2.json() : [];
    const stored =
      Array.isArray(rows2) && rows2[0]?.videos?.length
        ? (rows2[0].videos as YTVideo[])
        : fresh;
    return NextResponse.json({ day, videos: stored, shared: true });
  } catch {
    // Repli ultime : set frais (le défi reste jouable même si la base est indisponible).
    try {
      const videos = await fetchVideos(DAILY_ROUNDS);
      return NextResponse.json({ day, videos, shared: false });
    } catch {
      return NextResponse.json({ error: "Défi indisponible." }, { status: 502 });
    }
  }
}
