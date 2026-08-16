-- ViewGuessr — Défi du jour + Activité en direct
-- À exécuter UNE fois dans Supabase (SQL Editor).
-- Les deux tables sont en RLS sans policy : accès uniquement via la clé
-- service_role (routes serveur /api/daily et /api/activity). Aucun accès anon.

create extension if not exists pgcrypto;

-- 1) Défi du jour : un seul set de vidéos partagé par TOUS les joueurs, par jour.
create table if not exists public.daily_challenge (
  day        date primary key,
  videos     jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.daily_challenge enable row level security;

-- 2) Activité récente : parties terminées (preuve sociale sur l'accueil).
create table if not exists public.recent_activity (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  score      int  not null,
  mode       text not null,
  created_at timestamptz not null default now()
);
alter table public.recent_activity enable row level security;

create index if not exists recent_activity_created_idx
  on public.recent_activity (created_at desc);
