import { NextRequest, NextResponse } from "next/server";
import { fetchVideos } from "@/lib/youtube-server";
import { isLangKey } from "@/lib/languages";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/videos?count=5&category=10&lang=fr
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const count = Math.min(20, Math.max(1, Number(searchParams.get("count") ?? "5")));
  const category = searchParams.get("category");
  const langRaw = searchParams.get("lang");
  const lang = isLangKey(langRaw) && langRaw !== "all" ? langRaw : null;

  try {
    const videos = await fetchVideos(
      count,
      category && category !== "all" ? category : null,
      lang
    );
    return NextResponse.json({ videos });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
