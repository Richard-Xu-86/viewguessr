// Client REST minimal pour Supabase (PostgREST) miroir de SupabaseService.swift.
// Aucune dépendance externe. Utilise la clé publishable (RLS activée côté Supabase).

import type { MPGame, MPGuess, MPMessage, MPPlayer, YTVideo } from "./types";

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isMultiplayerConfigured = Boolean(URL_BASE && ANON_KEY);

function restURL(path: string): string {
  return `${URL_BASE}/rest/v1/${path}`;
}

function headers(prefer?: string): HeadersInit {
  const h: Record<string, string> = {
    apikey: ANON_KEY,
    "Content-Type": "application/json",
  };
  // Les clés legacy (JWT, "ey...") exigent aussi Authorization.
  if (ANON_KEY.startsWith("ey")) h["Authorization"] = `Bearer ${ANON_KEY}`;
  if (prefer) h["Prefer"] = prefer;
  return h;
}

async function req<T>(
  path: string,
  init: RequestInit & { prefer?: string } = {}
): Promise<T> {
  const { prefer, ...rest } = init;
  const res = await fetch(restURL(path), {
    ...rest,
    headers: headers(prefer),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export const SupabaseService = {
  newId: uuid,

  // --- Games ---

  async createGame(
    code: string,
    hostId: string,
    rounds: number,
    videos: YTVideo[]
  ): Promise<MPGame> {
    const payload = [
      {
        code,
        host_id: hostId,
        status: "lobby",
        current_round: 0,
        rounds_total: rounds,
        videos,
      },
    ];
    const rows = await req<MPGame[]>("games", {
      method: "POST",
      body: JSON.stringify(payload),
      prefer: "return=representation",
    });
    if (!rows?.[0]) throw new Error("Could not create the game.");
    return rows[0];
  },

  async findGame(code: string): Promise<MPGame> {
    const rows = await req<MPGame[]>(
      `games?code=eq.${code.toUpperCase()}&select=*&order=created_at.desc&limit=1`
    );
    if (!rows?.[0]) throw new Error("Game not found. Check the code!");
    return rows[0];
  },

  async getGame(id: string): Promise<MPGame> {
    const rows = await req<MPGame[]>(`games?id=eq.${id}&select=*`);
    if (!rows?.[0]) throw new Error("Game not found.");
    return rows[0];
  },

  async updateGame(
    id: string,
    fields: { status?: string; current_round?: number }
  ): Promise<void> {
    await req<void>(`games?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    });
  },

  /** Rematch : réinjecte un nouveau set de vidéos et renvoie la partie au lobby. */
  async restartGame(id: string, videos: YTVideo[]): Promise<void> {
    await req<void>(`games?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ videos, status: "lobby", current_round: 0 }),
    });
  },

  /** Rematch : remet à zéro le score et l'état « prêt » de tous les joueurs d'une partie. */
  async resetPlayers(gameId: string): Promise<void> {
    await req<void>(`players?game_id=eq.${gameId}`, {
      method: "PATCH",
      body: JSON.stringify({ score: 0, ready_round: 0 }),
    });
  },

  // --- Players ---

  async joinGame(
    gameId: string,
    playerId: string,
    name: string,
    emoji: string
  ): Promise<MPPlayer> {
    // Upsert sur la clé `id` : si la ligne du joueur existe déjà (même navigateur
    // qui rejoue), on la réécrit proprement pour cette partie au lieu de créer un
    // doublon ou de provoquer un conflit de clé primaire.
    const payload = [
      {
        id: playerId,
        game_id: gameId,
        name,
        emoji,
        score: 0,
        ready_round: 0,
        has_left: false,
      },
    ];
    const rows = await req<MPPlayer[]>("players?on_conflict=id", {
      method: "POST",
      body: JSON.stringify(payload),
      prefer: "resolution=merge-duplicates,return=representation",
    });
    if (!rows?.[0]) throw new Error("Could not join the game.");
    return rows[0];
  },

  async players(gameId: string): Promise<MPPlayer[]> {
    return req<MPPlayer[]>(
      `players?game_id=eq.${gameId}&select=*&order=score.desc`
    );
  },

  async updateScore(playerId: string, score: number): Promise<void> {
    await req<void>(`players?id=eq.${playerId}`, {
      method: "PATCH",
      body: JSON.stringify({ score }),
    });
  },

  async setReady(playerId: string, round: number): Promise<void> {
    await req<void>(`players?id=eq.${playerId}`, {
      method: "PATCH",
      body: JSON.stringify({ ready_round: round }),
    });
  },

  /** Marque un joueur comme parti (sans supprimer sa ligne). */
  async leaveGame(playerId: string): Promise<void> {
    await req<void>(`players?id=eq.${playerId}`, {
      method: "PATCH",
      body: JSON.stringify({ has_left: true }),
    });
  },

  /** Reprise : le joueur réapparaît dans la partie (annule has_left). */
  async rejoinGame(playerId: string): Promise<void> {
    await req<void>(`players?id=eq.${playerId}`, {
      method: "PATCH",
      body: JSON.stringify({ has_left: false }),
    });
  },

  /** Transfère le rôle d'hôte (migration quand l'hôte quitte). */
  async setHost(gameId: string, hostId: string): Promise<void> {
    await req<void>(`games?id=eq.${gameId}`, {
      method: "PATCH",
      body: JSON.stringify({ host_id: hostId }),
    });
  },

  // --- Guesses ---

  async submitGuess(g: MPGuess): Promise<void> {
    await req<void>("guesses", {
      method: "POST",
      body: JSON.stringify([
        {
          id: g.id,
          game_id: g.game_id,
          player_id: g.player_id,
          round: g.round,
          guess: g.guess,
          points: g.points,
        },
      ]),
    });
  },

  async guesses(gameId: string, round: number): Promise<MPGuess[]> {
    return req<MPGuess[]>(
      `guesses?game_id=eq.${gameId}&round=eq.${round}&select=*`
    );
  },

  /** Rematch : on purge les réponses de la partie précédente (même game_id réutilisé)
   *  pour éviter que d'anciens guesses ne polluent les manches rejouées (doublons). */
  async deleteGuesses(gameId: string): Promise<void> {
    await req<void>(`guesses?game_id=eq.${gameId}`, { method: "DELETE" });
  },

  // --- Chat (lobby) ---

  async sendMessage(m: MPMessage): Promise<void> {
    await req<void>("messages", {
      method: "POST",
      body: JSON.stringify([
        {
          id: m.id,
          game_id: m.game_id,
          player_id: m.player_id,
          name: m.name,
          text: m.text,
        },
      ]),
    });
  },

  async messages(gameId: string): Promise<MPMessage[]> {
    return req<MPMessage[]>(
      `messages?game_id=eq.${gameId}&select=*&order=created_at.asc&limit=100`
    );
  },
};
