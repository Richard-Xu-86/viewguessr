-- =====================================================================
--  ViewGuessr — Multiplayer core tables (games / players / guesses)
--
--  RECONSTRUCTED: this file was MISSING from the handover package.
--  supabase_chat.sql refers to "the same model as games/players/guesses",
--  but no file in the package actually created them. Without this file the
--  entire multiplayer mode fails (every room creation / join returns 404).
--
--  Schema derived from lib/types.ts (MPGame / MPPlayer / MPGuess) and the
--  REST calls in lib/supabase.ts.
--
--  Run this in Supabase → SQL Editor → New query → paste → Run.
--  Run it BEFORE supabase_chat.sql (messages.game_id points at games.id).
--
--  These three tables are reached from the BROWSER with the anon key, so —
--  exactly like public.messages — RLS is enabled with open policies.
--  (The service_role key used by /api/cleanup bypasses RLS entirely.)
-- =====================================================================

create extension if not exists pgcrypto;

-- 1) Games — one row per multiplayer room (6-letter code)
create table if not exists public.games (
  id            uuid primary key default gen_random_uuid(),
  code          text        not null,
  host_id       text        not null,
  status        text        not null default 'lobby',  -- lobby | playing | finished
  current_round integer     not null default 0,
  rounds_total  integer     not null default 5,
  videos        jsonb       not null default '[]'::jsonb,
  created_at    timestamptz not null default now()
);
alter table public.games enable row level security;

-- findGame() looks up the most recent room for a code.
create index if not exists games_code_created_idx
  on public.games (code, created_at desc);
-- /api/cleanup scans by status + age.
create index if not exists games_status_created_idx
  on public.games (status, created_at desc);

-- 2) Players — participants of a room.
--    `id` is generated client-side (localStorage "vg_player_id") and upserted
--    with on_conflict=id, so it is the primary key and stays TEXT to match
--    public.messages.player_id.
create table if not exists public.players (
  id          text        primary key,
  game_id     uuid        not null references public.games (id) on delete cascade,
  name        text        not null,
  emoji       text        not null default '🎮',
  score       integer     not null default 0,
  ready_round integer     not null default 0,
  has_left    boolean     not null default false,
  joined_at   timestamptz not null default now()
);
alter table public.players enable row level security;

create index if not exists players_game_idx on public.players (game_id);

-- 3) Guesses — one row per player, per round.
create table if not exists public.guesses (
  id         text        primary key,
  game_id    uuid        not null references public.games (id) on delete cascade,
  player_id  text        not null,
  round      integer     not null,
  guess      bigint      not null,
  points     integer     not null default 0,
  created_at timestamptz not null default now()
);
alter table public.guesses enable row level security;

create index if not exists guesses_game_round_idx
  on public.guesses (game_id, round);

-- ---------------------------------------------------------------------
--  Policies — open, matching the public.messages model.
--  Anyone holding a room code is a legitimate participant; there are no
--  user accounts in this product, so there is no identity to check against.
-- ---------------------------------------------------------------------

-- games: createGame (insert), findGame/getGame (select),
--        updateGame/restartGame/setHost (update)
drop policy if exists "games_select" on public.games;
drop policy if exists "games_insert" on public.games;
drop policy if exists "games_update" on public.games;
create policy "games_select" on public.games for select using (true);
create policy "games_insert" on public.games for insert with check (true);
create policy "games_update" on public.games for update using (true) with check (true);

-- players: joinGame upserts (needs BOTH insert and update), players() selects,
--          updateScore/setReady/leaveGame/rejoinGame/resetPlayers update
drop policy if exists "players_select" on public.players;
drop policy if exists "players_insert" on public.players;
drop policy if exists "players_update" on public.players;
create policy "players_select" on public.players for select using (true);
create policy "players_insert" on public.players for insert with check (true);
create policy "players_update" on public.players for update using (true) with check (true);

-- guesses: submitGuess (insert), guesses() (select), deleteGuesses on rematch (delete)
drop policy if exists "guesses_select" on public.guesses;
drop policy if exists "guesses_insert" on public.guesses;
drop policy if exists "guesses_delete" on public.guesses;
create policy "guesses_select" on public.guesses for select using (true);
create policy "guesses_insert" on public.guesses for insert with check (true);
create policy "guesses_delete" on public.guesses for delete using (true);
