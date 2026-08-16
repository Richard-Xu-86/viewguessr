# ViewGuessr Web

Version web jouable de **ViewGuessr**, le jeu où l'on devine le nombre de vues de vraies vidéos YouTube. Même direction artistique que l'application iOS (palette « Monochrome Red », Liquid Glass), et même backend Supabase pour le multijoueur.

## Modes de jeu

- **Solo** 5 manches, jusqu'à 5 000 points par manche.
- **Thèmes** Tendances, Musique, Gaming, Sport.
- **Multijoueur** crée une partie avec un code, affronte tes amis sur les mêmes vidéos, classement en temps réel.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- API YouTube Data v3 (proxyfiée côté serveur via une route API la clé n'est jamais exposée au client)
- Supabase (PostgREST) pour le multijoueur

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigne tes clés
npm run dev
```

Ouvre http://localhost:3000

## Variables d'environnement

| Variable | Description |
| --- | --- |
| `YOUTUBE_API_KEY` | Clé API YouTube Data v3 (**côté serveur uniquement**) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publishable Supabase (RLS activée) |

## Déploiement

Optimisé pour [Vercel](https://vercel.com/). Importer le dépôt, renseigner les
trois variables d'environnement ci-dessus, puis déployer.

## Schéma Supabase

Tables `games`, `players`, `guesses` identiques à l'application iOS
(voir `../ViewGuessr/supabase_schema.sql`). La colonne `players.ready_round`
gère la synchronisation « prêt » entre les manches.
