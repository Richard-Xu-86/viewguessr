import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Nettoyage des parties multijoueur terminées pour ne pas encombrer la base.
// - Parties « finished » de plus d'1 h (personne ne regarde plus l'écran de fin).
// - Lobbies / parties « lobby » ou « playing » manifestement abandonnés (> 12 h).
// On supprime d'abord les lignes enfants (messages, guesses, players) puis la
// partie elle-même. Tout est best-effort : une erreur ne fait jamais planter.

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const REST = `${SUPA_URL}/rest/v1`;

function svcHeaders(prefer?: string): Record<string, string> {
  const h: Record<string, string> = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
  if (prefer) h.Prefer = prefer;
  return h;
}

async function selectIds(query: string): Promise<string[]> {
  try {
    const res = await fetch(`${REST}/games?select=id&${query}&limit=300`, {
      headers: svcHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const rows: { id: string }[] = await res.json();
    return rows.map((r) => r.id).filter(Boolean);
  } catch {
    return [];
  }
}

async function delByGameIds(table: string, ids: string[]): Promise<void> {
  for (let i = 0; i < ids.length; i += 100) {
    const list = ids.slice(i, i + 100).join(",");
    try {
      await fetch(`${REST}/${table}?game_id=in.(${list})`, {
        method: "DELETE",
        headers: svcHeaders("return=minimal"),
        cache: "no-store",
      });
    } catch {
      /* best-effort : table absente ou réseau, on continue */
    }
  }
}

async function deleteAll(table: string, query: string): Promise<void> {
  try {
    await fetch(`${REST}/${table}?${query}`, {
      method: "DELETE",
      headers: svcHeaders("return=minimal"),
      cache: "no-store",
    });
  } catch {
    /* best-effort */
  }
}

async function cleanup(): Promise<{ ok: boolean; deletedGames: number }> {
  if (!SUPA_URL || !SERVICE_KEY) return { ok: false, deletedGames: 0 };
  const now = Date.now();
  const finishedISO = new Date(now - 60 * 60 * 1000).toISOString(); // > 1 h
  const staleISO = new Date(now - 12 * 60 * 60 * 1000).toISOString(); // > 12 h
  const msgISO = new Date(now - 6 * 60 * 60 * 1000).toISOString(); // chat > 6 h
  const enc = encodeURIComponent;

  // 1) Parties à supprimer : finies > 1 h, ou abandonnées > 12 h. On retire
  //    d'abord leurs lignes enfants, puis la partie elle-même.
  const [finishedOld, staleOld] = await Promise.all([
    selectIds(`status=eq.finished&created_at=lt.${enc(finishedISO)}`),
    selectIds(`status=in.(lobby,playing)&created_at=lt.${enc(staleISO)}`),
  ]);
  const gameIds = Array.from(new Set([...finishedOld, ...staleOld]));
  if (gameIds.length > 0) {
    await delByGameIds("messages", gameIds);
    await delByGameIds("guesses", gameIds);
    await delByGameIds("players", gameIds);
    for (let i = 0; i < gameIds.length; i += 100) {
      const list = gameIds.slice(i, i + 100).join(",");
      try {
        await fetch(`${REST}/games?id=in.(${list})`, {
          method: "DELETE",
          headers: svcHeaders("return=minimal"),
          cache: "no-store",
        });
      } catch {
        /* best-effort */
      }
    }
  }

  // 2) Messages de chat = éphémères : utiles seulement pendant la session (en
  //    lobby). On purge ceux des parties DÉJÀ terminées, et tout message de plus
  //    de 6 h (lobby mort / partie supprimée). On GARDE ceux des lobbys et des
  //    parties en cours encore récents.
  const finishedAll = await selectIds(`status=eq.finished`);
  if (finishedAll.length > 0) await delByGameIds("messages", finishedAll);
  await deleteAll("messages", `created_at=lt.${enc(msgISO)}`);

  return { ok: true, deletedGames: gameIds.length };
}

export async function POST() {
  try {
    return NextResponse.json(await cleanup());
  } catch {
    return NextResponse.json({ ok: false, deleted: 0 });
  }
}

// GET autorisé aussi (pratique pour un déclenchement manuel / cron).
export async function GET() {
  try {
    return NextResponse.json(await cleanup());
  } catch {
    return NextResponse.json({ ok: false, deleted: 0 });
  }
}
