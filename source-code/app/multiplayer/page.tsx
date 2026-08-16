"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { GameTopBar } from "@/components/game/GameTopBar";
import { Loader } from "@/components/game/Loader";
import { RoundIntro } from "@/components/game/RoundIntro";
import { Button } from "@/components/Buttons";
import { GuessSlider } from "@/components/GuessSlider";
import { VideoThumb } from "@/components/VideoThumb";
import { CountUp } from "@/components/CountUp";
import { Confetti } from "@/components/Confetti";
import { compactViews, groupedViews } from "@/lib/format";
import { HLCard } from "@/components/game/HigherLower";
import type { GameMode } from "@/lib/useMultiplayer";
import { scoreLabel } from "@/lib/scoring";
import { isMultiplayerConfigured } from "@/lib/supabase";
import { useMultiplayer } from "@/lib/useMultiplayer";
import type { MPPlayer } from "@/lib/types";
import { canPlay } from "@/lib/limits";
import { getActiveGame, clearActiveGame, type ActiveGame } from "@/lib/profile";
import { isPro } from "@/lib/pro";
import { logActivity } from "@/lib/activity";
import { Sound, resumeAudio, vibrate } from "@/lib/sound";
import { PercentileLine } from "@/components/PercentileLine";
import { THEMES } from "@/lib/themes";
import { LANGS } from "@/lib/languages";

// Affiche le pseudo + un petit badge "Pro" si le joueur a l'accès à vie
// (encodé par un suffixe "✦" sur le nom).
function ProName({ name, className = "" }: { name: string; className?: string }) {
  const pro = /✦\s*$/.test(name);
  const clean = name.replace(/\s*✦\s*$/, "");
  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 align-middle ${className}`}>
      <span className="min-w-0 truncate">{clean}</span>
      {pro && (
        <span className="shrink-0 rounded-full border border-platinum bg-crimson px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
          Pro
        </span>
      )}
    </span>
  );
}

// Avatars générés : dégradé de couleur UNIQUE par pseudo (pas d'emoji, aucun
// stockage — déterministe, donc identique pour tous les joueurs).
const AVATAR_GRADIENTS: [string, string][] = [
  ["#EF233C", "#D80032"], // rouge (marque)
  ["#7B2D8E", "#D80032"], // violet → rouge
  ["#F7971E", "#FFB300"], // orange → ambre
  ["#11998E", "#38EF7D"], // teal → vert
  ["#2193B0", "#6DD5ED"], // bleu
  ["#C04848", "#480048"], // grenat → prune
  ["#FF512F", "#DD2476"], // corail → rose
  ["#159957", "#155799"], // vert → bleu
  ["#4E54C8", "#8F94FB"], // indigo
  ["#EB5757", "#F2994A"], // rouge → orange
];

function cleanName(name: string): string {
  return name.replace(/\s*✦\s*$/, "").trim();
}

function initialOf(name: string): string {
  return (cleanName(name)[0] || "?").toUpperCase();
}

function hashName(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function Avatar({
  name,
  className = "h-9 w-9 rounded-xl text-base",
}: {
  name: string;
  className?: string;
}) {
  const key = cleanName(name) || "?";
  const [a, b] = AVATAR_GRADIENTS[hashName(key) % AVATAR_GRADIENTS.length];
  return (
    <span
      className={`inline-flex flex-shrink-0 select-none items-center justify-center font-display font-bold uppercase text-white shadow-sm ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      {initialOf(name)}
    </span>
  );
}

export default function MultiplayerPage() {
  const mp = useMultiplayer();

  // Nettoyage opportuniste : à l'ouverture du multijoueur, on demande au serveur
  // de purger les vieilles parties terminées. Best-effort, ignoré si ça échoue —
  // ça ne bloque jamais le jeu.
  useEffect(() => {
    fetch("/api/cleanup", { method: "POST" }).catch(() => {});
  }, []);

  // Quitter : confirmation uniquement si une partie est réellement EN COURS
  // (manche jouée). Dans le lobby ou sur l'écran de fin, on quitte directement.
  function handleLeave() {
    const inProgress =
      mp.phase === "guessing" ||
      mp.phase === "waitingOthers" ||
      mp.phase === "roundResult";
    if (inProgress && !window.confirm("Quitter la partie en cours ?")) return;
    mp.leave();
  }

  if (!isMultiplayerConfigured) {
    return (
      <>
        <Aurora />
        <main className="min-h-dvh">
          <GameTopBar title="Multijoueur" />
          <div className="mx-auto max-w-md px-4 py-24 text-center">
            <p className="text-lavender">
              Le multijoueur n'est pas configuré (variables Supabase manquantes).
            </p>
            <Link href="/" className="mt-4 inline-block text-sm text-strawberry">
              Retour à l'accueil
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Aurora />
      <main className="min-h-dvh pb-16">
        <GameTopBar
          title="Multijoueur"
          right={
            mp.game && (
              <button
                onClick={handleLeave}
                className="rounded-full glass px-3 py-1 text-sm font-semibold text-lavender hover:text-platinum"
              >
                Quitter
              </button>
            )
          }
        />

        {/* Notification de départ d'un joueur */}
        <AnimatePresence>
          {mp.notice && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4"
            >
              <div className="pointer-events-auto rounded-full glass-strong px-4 py-2.5 text-sm font-semibold text-platinum shadow-card">
                {mp.notice}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-auto max-w-5xl px-4 py-4">
          <AnimatePresence mode="wait">
            {mp.phase === "idle" && <Setup key="idle" mp={mp} />}
            {mp.phase === "connecting" && (
              <Loader key="connecting" label="Connexion à la partie…" />
            )}
            {mp.phase === "error" && <ErrorView key="error" mp={mp} />}
            {mp.phase === "lobby" && <Lobby key="lobby" mp={mp} />}
            {(mp.phase === "guessing" ||
              mp.phase === "waitingOthers" ||
              mp.phase === "roundResult") && <Playing key="playing" mp={mp} />}
            {mp.phase === "finished" && <Finished key="finished" mp={mp} />}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}

type MP = ReturnType<typeof useMultiplayer>;

function Setup({ mp }: { mp: MP }) {
  const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
  const [code, setCode] = useState("");
  const [rounds, setRounds] = useState(5);
  const [theme, setTheme] = useState("all");
  const [lang, setLang] = useState("all");
  const [gmode, setGmode] = useState<GameMode>("classic");
  const [maxAllowed, setMaxAllowed] = useState(3);
  const [players, setPlayers] = useState(3);
  const [limited, setLimited] = useState(false);
  const [proUser, setProUser] = useState(false);
  const [active, setActive] = useState<ActiveGame | null>(null);
  // Code reçu via un lien d'invitation (?code=XXXXXX). `inviteCode` sert à l'affichage ;
  // `autoJoinCode` n'est posé QUE si un pseudo existait déjà au chargement → jointure auto.
  const [inviteCode, setInviteCode] = useState("");
  const [autoJoinCode, setAutoJoinCode] = useState("");
  const autoJoinTried = useRef(false);

  useEffect(() => {
    setLimited(!canPlay("mp"));
    setActive(getActiveGame());
    setProUser(isPro());
    const m = isPro() ? 10 : 3;
    setMaxAllowed(m);
    setPlayers(m);

    // Lien d'invitation : on lit le code dans l'URL, on ouvre l'écran « Rejoindre »
    // pré-rempli, puis on nettoie l'URL (évite de re-déclencher au rafraîchissement).
    try {
      const c = (new URLSearchParams(window.location.search).get("code") || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);
      if (c) {
        const savedName =
          (window.localStorage.getItem("vg_player_name") || "").trim();
        setInviteCode(c);
        setCode(c);
        setMode("join");
        // Pseudo déjà connu → on rejoint automatiquement. Sinon, l'invité saisit
        // d'abord son pseudo (pas d'auto-join pendant la frappe).
        if (savedName) setAutoJoinCode(c);
        window.history.replaceState({}, "", "/multiplayer");
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Jointure AUTOMATIQUE : uniquement quand un pseudo existait déjà (autoJoinCode posé),
  // dès que l'état du pseudo est hydraté. Une seule tentative (garde-fou ref).
  useEffect(() => {
    if (!autoJoinCode || autoJoinTried.current) return;
    if (mp.playerName.trim()) {
      autoJoinTried.current = true;
      mp.joinGame(autoJoinCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoJoinCode, mp.playerName]);

  // NB : on ne bloque PLUS tout l'écran quand la limite gratuite est atteinte.
  // Rejoindre la partie d'un hôte Pro est illimité → l'écran « Rejoindre » reste
  // toujours accessible. Seule la CRÉATION d'une partie est gated (voir plus bas).
  const createLocked = limited && !proUser;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-md flex-col justify-center space-y-6 py-4"
    >
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-platinum">
          Multi<span className="hl-red">joueur</span>
        </h1>
        <p className="mt-2 text-lavender">
          Affronte tes amis sur les mêmes vidéos, en temps réel.
        </p>
      </div>

      {active && (
        <div className="rounded-2xl border border-strawberry/40 bg-strawberry/[0.07] p-4 text-center">
          <div className="text-sm font-semibold text-platinum">
            Partie en cours ·{" "}
            <span className="font-bold tracking-wider text-crimson">
              {active.code}
            </span>
          </div>
          <div className="mt-3 flex justify-center gap-2">
            <Button onClick={() => mp.resume(active)} className="px-5 py-2.5 text-sm">
              Reprendre
            </Button>
            <Button
              variant="glass"
              onClick={() => {
                clearActiveGame();
                setActive(null);
              }}
              className="px-5 py-2.5 text-sm"
            >
              Abandonner
            </Button>
          </div>
        </div>
      )}

      {/* Profil */}
      <div className="rounded-3xl glass-strong p-5">
        <div className="flex items-center gap-4">
          <Avatar
            name={mp.playerName || "?"}
            className="h-16 w-16 rounded-2xl text-2xl"
          />
          <div className="flex-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-lavender">
              Ton pseudo
            </label>
            <input
              value={mp.playerName}
              onChange={(e) => mp.setPlayerName(e.target.value)}
              placeholder="Ton nom de joueur"
              maxLength={16}
              className="mt-1.5 w-full rounded-xl bg-black/[0.05] px-4 py-3 font-semibold text-platinum outline-none ring-1 ring-black/10 focus:ring-strawberry"
            />
          </div>
        </div>
      </div>

      {mode === "menu" && (
        <div className="grid gap-3">
          <Button onClick={() => setMode("create")} className="py-4 text-lg">
            Créer une partie
          </Button>
          <Button
            variant="glass"
            onClick={() => setMode("join")}
            className="py-4 text-lg"
          >
            Rejoindre avec un code
          </Button>
        </div>
      )}

      {/* Création bloquée (gratuit + quota épuisé) : on propose de rejoindre (illimité)
          ou de passer à l'accès à vie pour héberger sans limite. */}
      {mode === "create" && createLocked && (
        <div className="rounded-3xl glass-strong p-6 text-center">
          <h2 className="font-display text-xl font-bold text-platinum">
            Limite du jour atteinte
          </h2>
          <p className="mt-2 text-sm text-lavender">
            Tu as déjà créé ta partie multijoueur gratuite des dernières 24 h. Tu peux
            toujours <strong className="text-platinum">rejoindre</strong> la partie d&apos;un
            ami avec un code — c&apos;est illimité. Pour héberger tes propres parties sans
            limite, passe à l&apos;accès à vie.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button onClick={() => setMode("join")} className="w-full py-3">
              Rejoindre avec un code
            </Button>
            <Link href="/pro">
              <Button variant="glass" className="w-full py-3">
                Passer à vie · 3,99 €
              </Button>
            </Link>
            <button
              onClick={() => setMode("menu")}
              className="mt-1 text-sm text-lavender transition-colors hover:text-platinum"
            >
              Retour
            </button>
          </div>
        </div>
      )}

      {mode === "create" && !createLocked && (
        <div className="rounded-3xl glass-strong p-5">
          <div className="text-sm font-semibold text-platinum">Mode de jeu</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setGmode("classic")}
              className={`rounded-xl border-2 px-3 py-3 text-left transition ${
                gmode === "classic"
                  ? "border-platinum bg-crimson text-white shadow-hard-sm"
                  : "border-platinum/15 bg-white text-lavender hover:border-platinum/40"
              }`}
            >
              <span className="block text-sm font-bold">Classique</span>
              <span className={`block text-[11px] font-medium ${gmode === "classic" ? "text-white/80" : ""}`}>
                Devine les vues au curseur
              </span>
            </button>
            {proUser ? (
              <button
                onClick={() => setGmode("hl")}
                className={`rounded-xl border-2 px-3 py-3 text-left transition ${
                  gmode === "hl"
                    ? "border-platinum bg-crimson text-white shadow-hard-sm"
                    : "border-platinum/15 bg-white text-lavender hover:border-platinum/40"
                }`}
              >
                <span className="block text-sm font-bold">Plus ou moins</span>
                <span className={`block text-[11px] font-medium ${gmode === "hl" ? "text-white/80" : ""}`}>
                  Deux vidéos, laquelle fait plus ?
                </span>
              </button>
            ) : (
              <Link
                href="/pro"
                className="rounded-xl border-2 border-dashed border-platinum/25 bg-[#FAF7F0] px-3 py-3 text-left transition hover:border-crimson/50"
              >
                <span className="block text-sm font-bold text-platinum">
                  Plus ou moins 🔒
                </span>
                <span className="block text-[11px] font-medium text-lavender">
                  Réservé à l&apos;accès à vie → le débloquer
                </span>
              </Link>
            )}
          </div>

          <div className="mt-4 text-sm font-semibold text-platinum">
            Nombre de manches
          </div>
          <div className="mt-3 flex gap-2">
            {[3, 5, 7, 10].map((r) => (
              <button
                key={r}
                onClick={() => setRounds(r)}
                className={`flex-1 rounded-xl border-2 py-3 font-bold transition ${
                  rounds === r
                    ? "border-platinum bg-crimson text-white shadow-hard-sm"
                    : "border-platinum/15 bg-white text-lavender hover:border-platinum/40"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm font-semibold text-platinum">Thème</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={`rounded-xl border-2 py-2.5 text-sm font-bold transition ${
                  theme === t.key
                    ? "border-platinum bg-crimson text-white shadow-hard-sm"
                    : "border-platinum/15 bg-white text-lavender hover:border-platinum/40"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm font-semibold text-platinum">
            Langue des vidéos
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={`rounded-xl border-2 py-2 text-[13px] font-bold transition ${
                  lang === l.key
                    ? "border-platinum bg-crimson text-white shadow-hard-sm"
                    : "border-platinum/15 bg-white text-lavender hover:border-platinum/40"
                }`}
              >
                <span className="mr-1">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm font-semibold text-platinum">
            Nombre de joueurs
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-black/[0.05] px-3 py-2.5">
            <button
              onClick={() => setPlayers((p) => Math.max(2, p - 1))}
              disabled={players <= 2}
              aria-label="Moins de joueurs"
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-black/[0.06] text-2xl font-bold text-platinum transition hover:bg-black/10 disabled:opacity-30"
            >
              −
            </button>
            <div className="text-center">
              <div className="font-display text-3xl font-bold tabular-nums text-platinum">
                {players}
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-lavender">
                joueurs
              </div>
            </div>
            <button
              onClick={() => setPlayers((p) => Math.min(maxAllowed, p + 1))}
              disabled={players >= maxAllowed}
              aria-label="Plus de joueurs"
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-black/[0.06] text-2xl font-bold text-platinum transition hover:bg-black/10 disabled:opacity-30"
            >
              +
            </button>
          </div>
          <div className="mt-2 text-center text-xs text-lavender">
            {maxAllowed === 3
              ? "Jusqu'à 3 joueurs · 10 avec l'accès à vie"
              : "Jusqu'à 10 joueurs"}
          </div>

          <Button
            onClick={() =>
              mp.createGame(
                rounds,
                THEMES.find((t) => t.key === theme)?.cat ?? "all",
                players,
                lang,
                gmode
              )
            }
            className="mt-4 w-full py-4 text-lg"
          >
            Créer la partie
          </Button>
          <button
            onClick={() => setMode("menu")}
            className="mt-3 w-full text-sm font-semibold text-lavender hover:text-platinum"
          >
            ← Retour
          </button>
        </div>
      )}

      {mode === "join" && (
        <div className="rounded-3xl glass-strong p-5">
          {inviteCode && (
            <div className="mb-3 rounded-xl border-2 border-crimson/30 bg-strawberry/10 px-4 py-2.5 text-center text-sm font-semibold text-crimson">
              🎉 Tu as été invité ! Entre ton pseudo plus haut pour rejoindre.
            </div>
          )}
          <div className="text-sm font-semibold text-platinum">
            Code de la partie
          </div>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            maxLength={6}
            className="mt-3 w-full rounded-xl bg-black/[0.05] px-4 py-4 text-center text-2xl font-black tracking-[0.4em] text-platinum outline-none ring-1 ring-black/10 focus:ring-strawberry"
          />
          <Button
            onClick={() => mp.joinGame(code)}
            disabled={code.length < 4}
            className="mt-5 w-full py-4 text-lg"
          >
            Rejoindre
          </Button>
          <button
            onClick={() => setMode("menu")}
            className="mt-3 w-full text-sm font-semibold text-lavender hover:text-platinum"
          >
            ← Retour
          </button>
        </div>
      )}
    </motion.div>
  );
}

function ErrorView({ mp }: { mp: MP }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-4 py-24 text-center"
    >
      <p className="max-w-sm text-lavender">{mp.errorMsg}</p>
      <Button onClick={mp.leave} className="px-6 py-3">
        Retour
      </Button>
    </motion.div>
  );
}

function Lobby({ mp }: { mp: MP }) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const code = mp.game?.code ?? "";

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  // Lien d'invitation : en cliquant dessus, l'invité rejoint automatiquement.
  function inviteLink(): string {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/multiplayer?code=${code}`;
  }

  async function shareLink() {
    const url = inviteLink();
    // Partage natif (mobile) si dispo, sinon copie dans le presse-papier.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "ViewGuessr",
          text: "Rejoins ma partie ViewGuessr 👀",
          url,
        });
        return;
      } catch {
        /* partage annulé → on tente la copie */
      }
    }
    navigator.clipboard?.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1600);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto grid w-full max-w-4xl gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"
    >
      <div className="space-y-6">
      {/* Code de la partie */}
      <div className="relative overflow-hidden rounded-2xl glass-strong p-7 text-center">
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender">
            Code de la partie
          </div>
          {mp.isHL && (
            <div className="sticker mx-auto mt-2 w-fit -rotate-1">
              Mode Plus ou moins
            </div>
          )}
          <button onClick={copy} className="mt-2 block w-full" aria-label="Copier le code">
            <span className="font-display text-6xl font-bold tracking-[0.15em] text-crimson">
              {code}
            </span>
          </button>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-2 text-sm font-semibold text-platinum transition hover:bg-black/10"
            >
              {copied ? "Copié ✓" : "Copier le code"}
            </button>
            <button
              onClick={shareLink}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-platinum bg-crimson px-5 py-2 text-sm font-semibold text-white shadow-hard-sm transition hover:opacity-90"
            >
              {linkCopied ? "Lien copié ✓" : "🔗 Lien d'invitation"}
            </button>
          </div>
          <div className="mt-3 text-xs text-lavender">
            Partage le code, ou le lien : tes amis rejoignent en un clic
          </div>
        </div>
      </div>

      {/* Joueurs */}
      <div className="rounded-3xl glass p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-platinum">
            Joueurs ({mp.activePlayers.length}/{mp.maxPlayers})
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-lavender">
            <span className="h-2 w-2 animate-pulseGlow rounded-full bg-strawberry" />
            Salon ouvert
          </span>
        </div>
        <div className="space-y-2">
          {mp.activePlayers.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9, x: -12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="flex items-center gap-3 rounded-2xl bg-black/[0.04] px-4 py-3"
            >
              <Avatar name={p.name} />
              <span className="font-semibold text-platinum"><ProName name={p.name} /></span>
              {p.id === mp.game?.host_id && (
                <span className="ml-auto rounded-full bg-strawberry/20 px-2.5 py-0.5 text-xs font-bold text-strawberry">
                  Hôte
                </span>
              )}
            </motion.div>
          ))}

          {/* Emplacement en attente (caché quand le lobby est plein) */}
          {mp.activePlayers.length < mp.maxPlayers && (
            <motion.div
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-black/15 px-4 py-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-lavender">
                +
              </span>
              <span className="text-sm font-medium text-lavender">
                En attente d&apos;un joueur…
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {mp.isHost ? (
        <div className="space-y-2">
          <Button
            onClick={mp.startGame}
            disabled={mp.activePlayers.length < 2}
            className="w-full py-4 text-lg"
          >
            Lancer la partie
          </Button>
          {mp.activePlayers.length < 2 && (
            <p className="text-center text-sm text-lavender">
              Il faut au moins 2 joueurs pour lancer la partie.
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3 rounded-2xl glass px-4 py-4 text-center text-lavender">
          <span className="h-2 w-2 animate-pulseGlow rounded-full bg-strawberry" />
          En attente du lancement par l&apos;hôte…
        </div>
      )}
      </div>

      <div className="lg:sticky lg:top-20">
        <LobbyChat mp={mp} />
      </div>
    </motion.div>
  );
}

// Chat en temps réel du lobby (synchro via le polling, comme le reste du multi).
function LobbyChat({ mp }: { mp: MP }) {
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mp.messages.length]);

  function send() {
    const t = text.trim();
    if (!t) return;
    mp.sendMessage(t);
    setText("");
  }

  return (
    <div className="rounded-3xl glass p-4">
      <div className="mb-2 text-sm font-semibold text-platinum">
        Discussion du salon
      </div>
      <div
        ref={scrollRef}
        className="h-64 space-y-2 overflow-y-auto pr-1 lg:h-[55vh]"
      >
        {mp.messages.length === 0 ? (
          <div className="py-6 text-center text-xs text-lavender">
            Dis bonjour à tes adversaires 👋
          </div>
        ) : (
          mp.messages.map((m) => {
            const mine = m.player_id === mp.playerId;
            return (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}
              >
                <Avatar
                  name={m.name}
                  className="h-7 w-7 flex-shrink-0 rounded-lg text-xs"
                />
                <div
                  className={`max-w-[78%] rounded-2xl border-2 px-3 py-2 text-sm ${
                    mine
                      ? "border-platinum bg-crimson text-white"
                      : "border-platinum/10 bg-[#FAF7F0] text-platinum"
                  }`}
                >
                  {!mine && (
                    <div className="mb-0.5 text-[11px] font-semibold text-lavender">
                      <ProName name={m.name} />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words">{m.text}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
          maxLength={200}
          placeholder="Écris un message…"
          className="min-w-0 flex-1 rounded-xl bg-black/[0.05] px-3 py-2.5 text-sm text-platinum outline-none ring-1 ring-black/10 focus:ring-strawberry"
        />
        <Button onClick={send} disabled={!text.trim()} className="px-4 py-2.5 text-sm">
          Envoyer
        </Button>
      </div>
    </div>
  );
}

// Chat flottant repliable, disponible PENDANT la partie pour tous les joueurs.
// Réutilise les mêmes messages que le lobby (synchro par polling). Une pastille
// indique les messages non lus quand le panneau est fermé.
function GameChat({ mp }: { mp: MP }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const seenRef = useRef(0);
  const [unread, setUnread] = useState(0);

  // Suivi des non-lus + auto-scroll quand le panneau est ouvert.
  useEffect(() => {
    if (open) {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
      seenRef.current = mp.messages.length;
      setUnread(0);
    } else {
      setUnread(Math.max(0, mp.messages.length - seenRef.current));
    }
  }, [mp.messages.length, open]);

  function send() {
    const t = text.trim();
    if (!t) return;
    mp.sendMessage(t);
    setText("");
  }

  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end">
      {open && (
        <div className="mb-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border-2 border-platinum/15 bg-[#FAF7F0] shadow-hard">
          <div className="flex items-center justify-between border-b-2 border-platinum/10 bg-white px-3 py-2">
            <span className="text-sm font-semibold text-platinum">Discussion</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le chat"
              className="text-lavender transition-colors hover:text-platinum"
            >
              ✕
            </button>
          </div>
          <div ref={scrollRef} className="h-64 space-y-2 overflow-y-auto px-3 py-2">
            {mp.messages.length === 0 ? (
              <div className="py-6 text-center text-xs text-lavender">
                Aucun message pour l&apos;instant.
              </div>
            ) : (
              mp.messages.map((m) => {
                const mine = m.player_id === mp.playerId;
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar
                      name={m.name}
                      className="h-6 w-6 flex-shrink-0 rounded-lg text-[10px]"
                    />
                    <div
                      className={`max-w-[80%] rounded-2xl border-2 px-2.5 py-1.5 text-sm ${
                        mine
                          ? "border-platinum bg-crimson text-white"
                          : "border-platinum/10 bg-white text-platinum"
                      }`}
                    >
                      {!mine && (
                        <div className="mb-0.5 text-[10px] font-semibold text-lavender">
                          <ProName name={m.name} />
                        </div>
                      )}
                      <div className="whitespace-pre-wrap break-words">{m.text}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex gap-2 border-t-2 border-platinum/10 bg-white px-2 py-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
              maxLength={200}
              placeholder="Écris un message…"
              className="min-w-0 flex-1 rounded-xl bg-black/[0.05] px-3 py-2 text-sm text-platinum outline-none ring-1 ring-black/10 focus:ring-strawberry"
            />
            <Button onClick={send} disabled={!text.trim()} className="px-3 py-2 text-sm">
              Envoyer
            </Button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Discussion"
        className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-platinum bg-crimson text-xl shadow-hard-sm transition-transform hover:scale-105"
      >
        💬
        {!open && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border-2 border-platinum bg-white px-1 text-[11px] font-bold text-crimson">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    </div>
  );
}

function Scoreboard({ mp }: { mp: MP }) {
  return (
    <div className="rounded-2xl glass p-3">
      <div className="space-y-1.5">
        {[...mp.activePlayers]
          .sort((a, b) => b.score - a.score)
          .map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm"
              style={{
                background:
                  p.id === mp.playerId ? "rgba(239,35,60,0.12)" : "transparent",
              }}
            >
              <span className="w-5 text-center font-bold text-lavender">
                {i + 1}
              </span>
              <Avatar name={p.name} className="h-6 w-6 rounded-md text-xs" />
              <span className="flex-1 truncate font-semibold text-platinum">
                <ProName name={p.name} />
              </span>
              <span className="font-extrabold tabular-nums text-platinum">
                {p.score}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function Playing({ mp }: { mp: MP }) {
  const total = mp.game?.rounds_total ?? 0;
  const answeredIds = new Set(mp.roundGuesses.map((g) => g.player_id));

  // Intro de manche (façon app) à chaque nouveau round.
  const [introRound, setIntroRound] = useState(0);
  useEffect(() => {
    if (mp.phase === "guessing" && mp.currentRound > 0) {
      setIntroRound(mp.currentRound);
      const r = mp.currentRound;
      const t = setTimeout(() => setIntroRound((cur) => (cur === r ? 0 : cur)), 1100);
      return () => clearTimeout(t);
    }
    setIntroRound(0);
  }, [mp.currentRound, mp.phase]);

  // Chronomètre de 45 s par manche validation automatique à 0.
  const [timeLeft, setTimeLeft] = useState(45);
  const endRef = useRef(0);
  useEffect(() => {
    if (mp.phase !== "guessing") return;
    endRef.current = Date.now() + 45_000;
    setTimeLeft(45);
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(id);
        // Temps écoulé : en « Plus ou moins », aucun choix = 0 point.
        if (mp.isHL) mp.submitChoice(null);
        else mp.submitGuess();
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mp.phase, mp.currentRound]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="relative mx-auto max-w-2xl space-y-3"
    >
      {/* Intro de manche */}
      <AnimatePresence>
        {introRound > 0 && mp.phase === "guessing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-ink/95 backdrop-blur"
          >
            <RoundIntro round={mp.currentRound} total={total} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cover "passage au round suivant" */}
      <AnimatePresence>
        {mp.advancing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-space-deep/90 backdrop-blur"
          >
            <Loader label="Manche suivante…" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full glass px-3 py-1 text-sm font-semibold text-lavender">
          Manche {mp.currentRound}/{total}
        </span>
        <div className="flex items-center gap-2">
          {mp.phase === "guessing" && (
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
                timeLeft <= 10 ? "bg-crimson text-white" : "glass text-platinum"
              }`}
            >
              {timeLeft}s
            </span>
          )}
          <span className="rounded-full border-2 border-platinum bg-crimson px-3 py-1 text-sm font-bold text-white tabular-nums">
            {mp.phase === "waitingOthers" ? "•••" : mp.myScore}
          </span>
        </div>
      </div>

      {mp.phase === "guessing" && (mp.isHL ? mp.hlPair : mp.currentVideo) && (
        <>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#EF233C,#D80032)" }}
              animate={{ width: `${(timeLeft / 45) * 100}%` }}
              transition={{ ease: "linear", duration: 0.25 }}
            />
          </div>

          {mp.isHL && mp.hlPair ? (
            <>
              <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                <HLCard video={mp.hlPair.left} views="shown" />
                <div className="flex items-center justify-center">
                  <span className="flex h-12 w-12 rotate-3 items-center justify-center rounded-full border-2 border-platinum bg-white font-display text-lg font-bold text-platinum shadow-hard-sm">
                    VS
                  </span>
                </div>
                <HLCard video={mp.hlPair.right} views="hidden">
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        resumeAudio();
                        Sound.validate();
                        vibrate(12);
                        mp.submitChoice("higher");
                      }}
                      className="w-full py-3"
                    >
                      ▲ Plus de vues
                    </Button>
                    <Button
                      variant="glass"
                      onClick={() => {
                        resumeAudio();
                        Sound.validate();
                        vibrate(12);
                        mp.submitChoice("lower");
                      }}
                      className="w-full py-3"
                    >
                      ▼ Moins de vues
                    </Button>
                  </div>
                </HLCard>
              </div>
              <p className="text-center text-xs font-semibold text-lavender">
                La vidéo de droite fait-elle plus ou moins de vues que celle de
                gauche&nbsp;? +1 000 pts par bonne réponse.
              </p>
            </>
          ) : (
            mp.currentVideo && (
              <>
                <VideoThumb video={mp.currentVideo} showQuestion />
                <div className="rounded-3xl glass-strong p-5">
                  <GuessSlider value={mp.guess} onChange={mp.setGuess} />
                  <Button
                    onClick={() => {
                      resumeAudio();
                      Sound.validate();
                      vibrate(12);
                      mp.submitGuess();
                    }}
                    className="mt-4 w-full py-3.5 text-lg"
                  >
                    Valider ma réponse
                  </Button>
                </div>
              </>
            )
          )}
        </>
      )}

      {mp.phase === "waitingOthers" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 13 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-platinum bg-crimson text-3xl text-white shadow-hard-sm"
            >
              ✓
            </motion.div>
            <div className="font-display text-2xl font-bold text-platinum">
              Réponse envoyée !
            </div>
            <div className="mt-1 text-lavender">
              On attend que tout le monde réponde…{" "}
              <span className="font-semibold text-platinum">
                {mp.answeredCount}/{mp.activePlayers.length}
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-sm space-y-2">
            {mp.activePlayers.map((p) => {
              const done = answeredIds.has(p.id);
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${
                    done ? "glass" : "bg-black/[0.02]"
                  }`}
                >
                  <Avatar name={p.name} className="h-8 w-8 rounded-lg text-sm" />
                  <span className="flex-1 truncate font-semibold text-platinum">
                    <ProName name={p.name} />
                  </span>
                  {done ? (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-strawberry"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-strawberry/20 text-xs">
                        ✓
                      </span>
                      A répondu
                    </motion.span>
                  ) : (
                    <motion.span
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 1.3, repeat: Infinity }}
                      className="text-sm text-lavender"
                    >
                      Réfléchit…
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-lavender">
            Les résultats s&apos;afficheront en même temps pour tout le monde
          </p>
        </motion.div>
      )}

      {mp.phase === "roundResult" && mp.currentVideo && (
        <RoundResult mp={mp} />
      )}

      {/* Chat flottant disponible pendant toute la partie, pour tous les joueurs. */}
      <GameChat mp={mp} />
    </motion.div>
  );
}

function RoundResult({ mp }: { mp: MP }) {
  // En « Plus ou moins », la vidéo révélée est celle de DROITE de la paire.
  const video = mp.isHL && mp.hlPair ? mp.hlPair.right : mp.currentVideo!;
  const hlAnswer =
    mp.isHL && mp.hlPair
      ? mp.hlPair.right.viewCount >= mp.hlPair.left.viewCount
        ? "higher"
        : "lower"
      : null;
  const everyoneReady = mp.readyCount >= mp.activePlayers.length && mp.activePlayers.length > 0;

  // Petit temps de suspense synchronisé avant de dévoiler le nombre de vues.
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    resumeAudio();
    Sound.drumroll();
    const t = setTimeout(() => setReveal(true), 1100);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!reveal) return;
    Sound.result(mp.lastPoints);
    vibrate(mp.lastPoints >= 4500 ? [0, 40, 50, 90] : 12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal]);

  // Tri des réponses de la manche pour affichage. Dédupe défensif par joueur :
  // on ne garde qu'UNE réponse par player_id (la meilleure), pour qu'aucun pseudo
  // n'apparaisse en double même si des guesses résiduels traînaient.
  const bestByPlayer = new Map<string, (typeof mp.roundGuesses)[number]>();
  for (const g of mp.roundGuesses) {
    const cur = bestByPlayer.get(g.player_id);
    if (!cur || g.points > cur.points) bestByPlayer.set(g.player_id, g);
  }
  const rows = [...bestByPlayer.values()]
    .map((g) => ({
      g,
      player: mp.activePlayers.find((p) => p.id === g.player_id),
    }))
    .sort((a, b) => b.g.points - a.g.points);

  return (
    <div className="space-y-3">
      {reveal && mp.lastPoints >= 4500 && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none fixed inset-0 z-50 bg-strawberry"
        />
      )}
      <VideoThumb video={video} />

      <div className="relative overflow-hidden rounded-3xl glass-strong p-4 text-center">
        {reveal && mp.lastPoints >= 4500 && <Confetti count={18} />}
        <div className="text-xs font-semibold uppercase tracking-widest text-lavender">
          {reveal ? "Vraies vues" : "Révélation…"}
        </div>
        {reveal ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
          >
            <div className="mt-1 font-display text-3xl font-bold text-platinum sm:text-4xl">
              <CountUp to={video.viewCount} />
            </div>
            {hlAnswer && mp.hlPair && (
              <div className="mt-2 text-sm font-bold text-platinum">
                C&apos;était {hlAnswer === "higher" ? "▲ PLUS" : "▼ MOINS"}{" "}
                <span className="font-medium text-lavender">
                  (contre {groupedViews(mp.hlPair.left.viewCount)} vues)
                </span>
              </div>
            )}
            <div className="mt-3 inline-block rounded-xl border-2 border-platinum bg-crimson px-4 py-1.5 text-sm font-bold text-white shadow-hard-sm">
              {mp.isHL
                ? mp.lastPoints > 0
                  ? "+1 000 pts · Bonne réponse !"
                  : "+0 pt · Raté…"
                : `+${mp.lastPoints} pts · ${scoreLabel(mp.lastPoints)}`}
            </div>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.98, 1.04, 0.98] }}
            transition={{ duration: 1.1, repeat: Infinity }}
            className="mt-1 font-display text-5xl font-bold text-platinum"
          >
            ?
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {reveal && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="rounded-3xl glass p-4">
              <div className="mb-2 text-sm font-semibold text-platinum">
                Résultats de la manche
              </div>
              <div className="space-y-1.5">
                {rows.map(({ g, player }, i) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-center gap-2 rounded-lg bg-black/[0.04] px-3 py-2 text-sm"
                  >
                    <span className="w-4 text-center font-bold text-lavender">{i + 1}</span>
                    <Avatar name={player?.name ?? "?"} className="h-6 w-6 rounded-md text-xs" />
                    <span className="flex-1 truncate font-semibold text-platinum">
      <ProName name={player?.name ?? "Joueur"} />
                    </span>
                    <span className="text-xs font-semibold text-lavender">
                      {mp.isHL
                        ? g.guess === 1
                          ? "▲ Plus"
                          : g.guess === 0
                            ? "▼ Moins"
                            : "—"
                        : compactViews(g.guess)}
                    </span>
                    <span className="w-12 text-right font-extrabold tabular-nums text-strawberry">
                      +{g.points}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <Scoreboard mp={mp} />

            {mp.iAmReady ? (
              <div className="rounded-2xl glass px-4 py-4 text-center">
                <div className="font-semibold text-platinum">
                  En attente des autres… {mp.readyCount}/{mp.activePlayers.length} prêts
                </div>
                <div className="mt-2 flex justify-center gap-2">
                  {mp.activePlayers.map((p, i) => (
                    <div
                      key={p.id}
                      className={`h-3 w-3 rounded-full ${
                        i < mp.readyCount ? "bg-strawberry" : "bg-black/[0.04]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Button onClick={mp.confirmReady} className="w-full py-3.5 text-lg">
                Je suis prêt ({mp.readyCount}/{mp.activePlayers.length})
              </Button>
            )}

            {everyoneReady && (
              <div className="text-center text-sm text-lavender">
                Tout le monde est prêt c&apos;est parti !
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Couleurs et hauteurs de marche selon le rang (or / argent / bronze).
const PODIUM = {
  1: { h: "h-28", grad: "from-[#F7CE46] to-[#E0A100]", ring: "ring-[#F7CE46]" },
  2: { h: "h-20", grad: "from-[#CBD2DC] to-[#9AA3B2]", ring: "ring-[#CBD2DC]" },
  3: { h: "h-16", grad: "from-[#E0A56B] to-[#B97E45]", ring: "ring-[#E0A56B]" },
} as const;

function PodiumCol({
  player,
  rank,
  delay,
}: {
  player: MPPlayer;
  rank: 1 | 2 | 3;
  delay: number;
}) {
  const cfg = PODIUM[rank];
  const winner = rank === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 20 }}
      className="flex w-1/3 max-w-[130px] flex-col items-center"
    >
      <Avatar
        name={player.name}
        className={`${winner ? "h-14 w-14 text-xl" : "h-11 w-11 text-base"} rounded-2xl ring-2 ${cfg.ring}`}
      />
      <div className="mt-2 w-full truncate text-center text-sm font-semibold text-platinum">
        <ProName name={player.name} />
      </div>
      <div className="text-xs font-bold tabular-nums text-strawberry">
        {player.score.toLocaleString("fr-FR")}
      </div>
      <div
        className={`mt-2 flex ${cfg.h} w-full items-start justify-center rounded-t-2xl bg-gradient-to-b ${cfg.grad} pt-2 font-display text-2xl font-black text-white shadow-card`}
      >
        {rank}
      </div>
    </motion.div>
  );
}

function Finished({ mp }: { mp: MP }) {
  // Journalise mon résultat + fanfare, une seule fois.
  useEffect(() => {
    logActivity(mp.playerName || "Un joueur", mp.myScore, "multi");
    resumeAudio();
    const order = [...mp.activePlayers].sort((a, b) => b.score - a.score);
    const won = order[0]?.id === mp.playerId && order.length > 1;
    if (won) Sound.win();
    else Sound.result(2600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ranked = [...mp.activePlayers].sort((a, b) => b.score - a.score);
  const iWon = ranked[0]?.id === mp.playerId && ranked.length > 1;
  const top3 = ranked.slice(0, 3);
  // Affichage du podium : 2e à gauche, 1er au centre, 3e à droite.
  const cols: { player?: MPPlayer; rank: 1 | 2 | 3 }[] = [
    { player: top3[1], rank: 2 },
    { player: top3[0], rank: 1 },
    { player: top3[2], rank: 3 },
  ];
  const delayOf = (rank: number) => (rank === 1 ? 0.45 : rank === 2 ? 0.3 : 0.15);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="relative mx-auto max-w-md"
    >
      {iWon && <Confetti />}
      <div className="text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-strawberry">
          Résultats
        </div>
        <h1 className="mt-1 font-display text-4xl font-bold text-platinum">
          Partie terminée
        </h1>
        {iWon && (
          <div className="sticker mx-auto mt-3 w-fit -rotate-2 !border-crimson !text-crimson !shadow-hard-red-sm">
            🏆 Tu as gagné !
          </div>
        )}
      </div>

      <PercentileLine score={mp.myScore} className="mt-4" />

      {/* Podium */}
      <div className="mt-8 flex items-end justify-center gap-2 sm:gap-3">
        {cols.map((c, idx) =>
          c.player ? (
            <PodiumCol
              key={c.player.id}
              player={c.player}
              rank={c.rank}
              delay={delayOf(c.rank)}
            />
          ) : (
            <div key={`empty-${idx}`} className="w-1/3 max-w-[130px]" />
          )
        )}
      </div>

      {/* Classement complet */}
      <div className="mt-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-lavender">
          Classement
        </div>
        <div className="space-y-2">
          {ranked.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.07 }}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                p.id === mp.playerId
                  ? "glass-strong ring-2 ring-strawberry"
                  : "glass"
              }`}
            >
              <span className="w-6 text-center text-base font-black text-lavender">
                {i + 1}
              </span>
              <Avatar name={p.name} className="h-9 w-9 rounded-xl text-base" />
              <span className="flex-1 truncate font-semibold text-platinum">
                <ProName name={p.name} />
              </span>
              <span className="font-extrabold tabular-nums text-platinum">
                {p.score.toLocaleString("fr-FR")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rejouer avec les mêmes joueurs (rematch) : l'hôte relance, le groupe reste
          ensemble et revient au lobby. Les autres voient l'info en attendant. */}
      {mp.isHost ? (
        <div className="mt-7 flex flex-col items-center gap-3">
          <Button
            onClick={mp.rematch}
            disabled={mp.advancing || mp.activePlayers.length < 2}
            className="w-full max-w-xs py-3.5 text-lg"
          >
            {mp.advancing ? "Relance…" : "🔄 Rejouer avec les mêmes"}
          </Button>
          <div className="flex justify-center gap-3">
            <Button onClick={mp.leave} variant="glass" className="px-6 py-3">
              Nouvelle partie
            </Button>
            <Link href="/">
              <Button variant="glass" className="px-6 py-3">
                Accueil
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-7 flex flex-col items-center gap-3">
          <p className="text-center text-sm text-lavender">
            L&apos;hôte peut relancer une partie avec les mêmes joueurs — reste ici, tu
            seras ramené au salon automatiquement.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={mp.leave} variant="glass" className="px-6 py-3">
              Nouvelle partie
            </Button>
            <Link href="/">
              <Button variant="glass" className="px-6 py-3">
                Accueil
              </Button>
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}
