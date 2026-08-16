-- =====================================================================
--  ViewGuessr — Configuration Supabase COMPLÈTE (à exécuter UNE fois)
--  Dashboard → SQL Editor → New query → coller → Run.
--
--  Toutes les tables sont en RLS SANS policy : accès UNIQUEMENT via la clé
--  service_role (routes serveur). La clé anon (côté client) n'a aucun accès.
--
--  ⚠️ Ensuite, sur Vercel (Project → Settings → Environment Variables) :
--    SUPABASE_SERVICE_ROLE_KEY = Supabase → Settings → API → service_role
--    IP_HASH_SALT              = une longue chaîne aléatoire secrète
--    STRIPE_WEBHOOK_SECRET     = secret du webhook Stripe (whsec_...)
-- =====================================================================

create extension if not exists pgcrypto;

-- 1) Quota des parties gratuites par IP (anti-contournement)
create table if not exists public.play_quota (
  id          text        primary key,   -- "<hash IP salé>:<YYYY-MM-DD Europe/Paris>"
  solo        integer     not null default 0,
  mp          integer     not null default 0,
  updated_at  timestamptz not null default now()
);
alter table public.play_quota enable row level security;

-- 2) Défi du jour : les mêmes 5 vidéos pour tous, par jour
create table if not exists public.daily_challenge (
  day        date primary key,
  videos     jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.daily_challenge enable row level security;

-- 3) Activité récente (bandeau « activité » de l'accueil)
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

-- 4) Codes d'accès à vie (restauration sécurisée des achats)
create table if not exists public.licenses (
  session_id text primary key,            -- id de session Stripe
  code       text not null unique,        -- code secret remis à l'acheteur
  created_at timestamptz not null default now()
);
alter table public.licenses enable row level security;
create index if not exists licenses_code_idx on public.licenses (code);

-- 5) Classement quotidien du Défi du jour (un score par joueur et par jour)
create table if not exists public.daily_scores (
  day        date        not null,
  client_id  text        not null,
  name       text        not null,
  score      int         not null,
  created_at timestamptz not null default now(),
  primary key (day, client_id)
);
alter table public.daily_scores enable row level security;
create index if not exists daily_scores_day_score_idx
  on public.daily_scores (day, score desc);
