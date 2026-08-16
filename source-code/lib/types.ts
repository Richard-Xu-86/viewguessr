// Types partagés miroir des modèles de l'app iOS.

export interface YTVideo {
  id: string;
  title: string;
  channel: string;
  thumbnailURL: string;
  viewCount: number;
  publishedAt?: string | null;
  /** Id de la chaîne YouTube (pour l'enrichissement abonnés). */
  channelId?: string | null;
  /** Nombre d'abonnés de la chaîne (null si masqué par la chaîne). */
  subscriberCount?: number | null;
  /** Avatar de la chaîne (88 px). */
  channelThumb?: string | null;
}

export interface RoundResult {
  video: YTVideo;
  guess: number;
  points: number;
}

// --- Multijoueur (tables Supabase) ---

export interface MPGame {
  id: string;
  code: string;
  host_id: string;
  status: "lobby" | "playing" | "finished";
  current_round: number;
  rounds_total: number;
  videos: YTVideo[];
  created_at?: string;
}

export interface MPPlayer {
  id: string;
  game_id: string;
  name: string;
  emoji: string;
  score: number;
  ready_round: number;
  has_left?: boolean;
  joined_at?: string;
}

export interface MPGuess {
  id: string;
  game_id: string;
  player_id: string;
  round: number;
  guess: number;
  points: number;
  created_at?: string;
}

export interface MPMessage {
  id: string;
  game_id: string;
  player_id: string;
  name: string;
  text: string;
  created_at?: string;
}
