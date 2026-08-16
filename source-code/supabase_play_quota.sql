-- ============================================================
--  ViewGuessr — Limite des parties gratuites par IP
--  (anti-contournement : changer de navigateur ne réinitialise plus le quota)
--
--  À exécuter UNE fois dans Supabase :
--    Dashboard → SQL Editor → New query → coller → Run.
--  Projet : « ViewGuessr » (ref uuirfqyelueynulewsgn).
--
--  ⚠️ Ensuite, ajoute la variable d'environnement sur Vercel :
--    SUPABASE_SERVICE_ROLE_KEY = (Supabase → Project Settings → API → service_role)
--    (optionnel) IP_HASH_SALT = une chaîne aléatoire de ton choix
-- ============================================================

create table if not exists public.play_quota (
  id          text        primary key,    -- "<hash IP salé>:<YYYY-MM-DD Europe/Paris>"
  solo        integer     not null default 0,
  mp          integer     not null default 0,
  updated_at  timestamptz not null default now()
);

-- RLS activée SANS aucune policy : seules les requêtes avec la clé « service_role »
-- (utilisée uniquement par la route serveur /api/play) peuvent lire/écrire.
-- Les clients (clé anon) n'ont AUCUN accès → impossible de trafiquer son propre quota.
alter table public.play_quota enable row level security;

-- (Optionnel) Purge des lignes de plus de 7 jours, à lancer de temps en temps :
--   delete from public.play_quota where updated_at < now() - interval '7 days';
