-- ViewGuessr — Classement quotidien du Défi du jour
-- À exécuter UNE fois dans Supabase (SQL Editor).
-- Table en RLS sans policy : accès uniquement via la clé service_role
-- (route serveur /api/daily-leaderboard). Aucun accès anon.

create extension if not exists pgcrypto;

-- Un score par joueur (client_id) et par jour. Le défi étant à une tentative
-- par jour, la clé primaire (day, client_id) empêche les doublons et permet
-- un upsert idempotent.
create table if not exists public.daily_scores (
  day        date        not null,
  client_id  text        not null,
  name       text        not null,
  score      int         not null,
  created_at timestamptz not null default now(),
  primary key (day, client_id)
);
alter table public.daily_scores enable row level security;

-- Tri rapide du classement du jour (score décroissant).
create index if not exists daily_scores_day_score_idx
  on public.daily_scores (day, score desc);
