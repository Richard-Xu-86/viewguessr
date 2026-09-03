// Récupération des vidéos via l'API YouTube Data v3 UNIQUEMENT côté serveur.
// La clé n'est jamais envoyée au client (lue depuis process.env).

import type { YTVideo } from "./types";
import { regionsFor } from "./languages";

const REGIONS = ["FR", "US", "GB", "IN", "BR", "KR", "JP", "DE", "MX", "CA"];

interface YTApiItem {
  id: string;
  snippet: {
    title: string;
    channelId?: string;
    channelTitle: string;
    publishedAt?: string;
    thumbnails: Record<string, { url: string } | undefined>;
  };
  statistics?: { viewCount?: string };
}

interface YTChannelItem {
  id: string;
  snippet?: { thumbnails?: Record<string, { url: string } | undefined> };
  statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchTrending(
  apiKey: string,
  region: string,
  categoryId: string | null
): Promise<YTVideo[]> {
  const params = new URLSearchParams({
    part: "snippet,statistics",
    chart: "mostPopular",
    regionCode: region,
    maxResults: "50",
    key: apiKey,
  });
  if (categoryId) params.set("videoCategoryId", categoryId);

  const url = `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { items?: YTApiItem[] };
  if (!data.items) return [];

  return data.items.flatMap((item): YTVideo[] => {
    const views = Number(item.statistics?.viewCount ?? "");
    if (!Number.isFinite(views) || views <= 0) return [];
    const t = item.snippet.thumbnails;
    const thumb =
      t.maxres?.url ?? t.high?.url ?? t.medium?.url ?? t.default?.url ?? null;
    if (!thumb) return [];
    return [
      {
        id: item.id,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnailURL: thumb,
        viewCount: views,
        publishedAt: item.snippet.publishedAt ?? null,
        channelId: item.snippet.channelId ?? null,
        subscriberCount: null,
        channelThumb: null,
      },
    ];
  });
}

// Enrichit le pool avec le nombre d'abonnés + l'avatar de chaque chaîne.
// 1 appel `channels.list` (coût quota : 1) par lot de 50 chaînes. Best-effort :
// en cas d'échec, les vidéos restent valides sans l'info abonnés.
async function enrichChannels(apiKey: string, pool: YTVideo[]): Promise<void> {
  const ids = [...new Set(pool.map((v) => v.channelId).filter(Boolean))] as string[];
  if (ids.length === 0) return;

  const info = new Map<string, { subs: number | null; thumb: string | null }>();
  const batches: string[][] = [];
  for (let i = 0; i < ids.length; i += 50) batches.push(ids.slice(i, i + 50));

  await Promise.all(
    batches.map(async (batch) => {
      try {
        const params = new URLSearchParams({
          part: "statistics,snippet",
          id: batch.join(","),
          maxResults: "50",
          key: apiKey,
        });
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?${params.toString()}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = (await res.json()) as { items?: YTChannelItem[] };
        for (const c of data.items ?? []) {
          const hidden = c.statistics?.hiddenSubscriberCount === true;
          const subs = Number(c.statistics?.subscriberCount ?? "");
          info.set(c.id, {
            subs: !hidden && Number.isFinite(subs) ? subs : null,
            thumb: c.snippet?.thumbnails?.default?.url ?? null,
          });
        }
      } catch {
        /* best-effort */
      }
    })
  );

  for (const v of pool) {
    const i = v.channelId ? info.get(v.channelId) : undefined;
    if (i) {
      v.subscriberCount = i.subs;
      v.channelThumb = i.thumb;
    }
  }
}

async function poolFor(
  apiKey: string,
  categoryId: string | null,
  langRegions: string[] | null
): Promise<YTVideo[]> {
  // Langue choisie → on interroge SES pays ; sinon mélange de pays variés.
  const regions = langRegions
    ? shuffle(langRegions).slice(0, 3)
    : shuffle(REGIONS).slice(0, 3);
  const batches = await Promise.all(
    regions.map((r) => fetchTrending(apiKey, r, categoryId).catch(() => []))
  );
  const seen = new Set<string>();
  const pool = batches
    .flat()
    .filter((v) => v.viewCount > 1000 && !seen.has(v.id) && seen.add(v.id));
  await enrichChannels(apiKey, pool);
  return pool;
}

// Cache mémoire du pool par (langue, catégorie) : réduit massivement les appels à
// l'API YouTube (protège le quota en cas d'affluence) et sert de repli sur le
// dernier pool connu si l'API échoue → jamais de panne totale des vidéos.
type PoolCache = { pool: YTVideo[]; at: number };
const POOL_TTL_MS = 10 * 60 * 1000; // 10 minutes
const poolCache = new Map<string, PoolCache>();

async function getPool(
  apiKey: string,
  categoryId: string | null,
  langKey: string | null
): Promise<YTVideo[]> {
  const key = `${langKey ?? "all"}:${categoryId ?? "all"}`;
  const cached = poolCache.get(key);
  const now = Date.now();
  if (cached && cached.pool.length > 0 && now - cached.at < POOL_TTL_MS) {
    return cached.pool;
  }
  try {
    const pool = await poolFor(apiKey, categoryId, regionsFor(langKey));
    if (pool.length > 0) {
      poolCache.set(key, { pool, at: now });
      return pool;
    }
    return cached?.pool ?? pool; // pool vide → on garde l'ancien si possible
  } catch {
    return cached?.pool ?? []; // erreur API → dernier pool connu
  }
}

/** Renvoie `count` vidéos uniques.
 *  categoryId nil = tendances générales ; langKey nil = toutes langues. */
export async function fetchVideos(
  count: number,
  categoryId: string | null = null,
  langKey: string | null = null
): Promise<YTVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is missing on the server.");

  let pool = await getPool(apiKey, categoryId, langKey);

  // Replis progressifs : langue seule → catégorie seule → tendances générales.
  if (pool.length < count && categoryId && langKey) {
    pool = await getPool(apiKey, null, langKey);
  }
  if (pool.length < count && categoryId) {
    pool = await getPool(apiKey, categoryId, null);
  }
  if (pool.length < count && (categoryId || langKey)) {
    pool = await getPool(apiKey, null, null);
  }
  if (pool.length === 0) throw new Error("No videos available.");

  return shuffle(pool).slice(0, count);
}
