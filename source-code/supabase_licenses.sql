-- ViewGuessr — codes d'accès à vie (restauration sécurisée)
-- À exécuter UNE fois dans Supabase (SQL Editor).
-- RLS sans policy : accès uniquement via la clé service_role
-- (routes serveur /api/verify et /api/restore). Aucun accès anon.

create table if not exists public.licenses (
  session_id text primary key,
  code       text not null unique,
  created_at timestamptz not null default now()
);
alter table public.licenses enable row level security;

create index if not exists licenses_code_idx on public.licenses (code);
