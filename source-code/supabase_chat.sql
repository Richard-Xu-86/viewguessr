-- ViewGuessr — Chat de lobby multijoueur
-- À exécuter UNE fois dans Supabase (SQL Editor).
-- Même modèle que games/players/guesses : accès via la clé anon (côté client),
-- RLS activée avec policies ouvertes (lecture + insertion).

create extension if not exists pgcrypto;

create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  game_id    uuid not null,
  player_id  text not null,
  name       text not null,
  text       text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "messages_select" on public.messages for select using (true);
create policy "messages_insert" on public.messages for insert with check (true);

create index if not exists messages_game_created_idx
  on public.messages (game_id, created_at);
