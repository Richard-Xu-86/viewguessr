# ViewGuessr — Handover Package

Everything included in the acquisition of **ViewGuessr** (`view-guessr.com`).
Escrow transaction **#13181166**.

---

## What's in this package

| Folder | Contents |
| --- | --- |
| `source-code/` | Complete source code of the web app (production code currently running on view-guessr.com) |
| `brand-assets/` | All logos and design files, in **PNG + SVG** (vector, fully editable) |

The **domain** `view-guessr.com` is transferred separately, directly inside Vercel.

---

## The product

ViewGuessr is a game where players guess the view count of real trending YouTube videos.

**Game modes**
- **Daily Challenge** — the same 5 videos for everyone, one attempt per day, global leaderboard, streaks with a "streak freeze" mechanic, Wordle-style sharing.
- **Solo** — 5 rounds, selectable theme and video language, instant replay loop, personal best.
- **Higher or Lower** — endless streak mode, two videos head to head (premium-only, drives conversion).
- **Multiplayer** — real-time rooms with a 6-letter code, shareable invite links (one-click join), in-game chat, live leaderboard, rematch, automatic disconnect handling.

**Other**
- Fully bilingual **FR / EN** with automatic browser-language detection.
- Monetization: one-time **lifetime unlock** via Stripe (no subscription).
- No user accounts required — players click and play.
- SEO: sitemap, robots, dynamic OpenGraph/Twitter images, JSON-LD. See `SEO-ACTIONS.md` and `STRATEGIE-SEO.md` in the source folder.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- **Supabase** (PostgREST) — multiplayer, daily challenge, leaderboards, quotas, licenses
- **Stripe** — one-time payment
- **YouTube Data API v3** — proxied server-side (the key is never exposed to the client)
- Deployed on **Vercel**

---

## Setup (about 15 minutes)

### 1. Install
```bash
cd source-code
npm install
```

### 2. Create your own accounts
The previous owner's API keys are **not** included (they are tied to his personal accounts). You will need to create:
- a **Supabase** project — https://supabase.com
- a **YouTube Data API v3** key — https://console.cloud.google.com
- a **Stripe** account — https://stripe.com

### 3. Environment variables
Copy `.env.example` to `.env.local` and fill in your own values:
```bash
cp .env.example .env.local
```
Every variable is documented inside the file.

### 4. Database
In Supabase → **SQL Editor** → **New query**, paste and run:
```
source-code/supabase_setup.sql
```
This creates the whole schema in one run (quotas, daily challenge, activity, licenses, daily leaderboard).

Then run `supabase_schema.sql`-equivalent tables for multiplayer if not present, plus:
```
source-code/supabase_chat.sql          # multiplayer chat
source-code/supabase_daily_leaderboard.sql   # daily leaderboard (if not already created by setup)
```

### 5. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 6. Deploy
Import the repository into **Vercel**, add the same environment variables in
Project → Settings → Environment Variables, then deploy.
Finally, point `view-guessr.com` to the project in Vercel → Domains.

---

## Notes

- The **Stripe webhook** must be configured on the `checkout.session.completed` event, pointing to `https://your-domain/api/webhook`. Put the signing secret in `STRIPE_WEBHOOK_SECRET`.
- `IP_HASH_SALT` must be a long, random, **stable** secret (it powers the free-quota anti-abuse and access detection).
- The YouTube key must be **server-side only** — it is already proxied through `/api/videos`, never exposed to the browser.

---

Any question during the inspection period, just ask — happy to help you get it running.

**Adrien — PENRA**
