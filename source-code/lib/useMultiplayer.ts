"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MPGame, MPGuess, MPMessage, MPPlayer, YTVideo } from "./types";
import { SupabaseService, generateCode } from "./supabase";
import { points as scorePoints } from "./scoring";
import { isPro } from "./pro";
import { recordPlay } from "./limits";
import { serverAllowPlay, serverCheckPlay } from "./serverLimits";
import { setActiveGame, clearActiveGame, type ActiveGame } from "./profile";
import { containsBannedWord, censorText } from "./moderation";

export type Phase =
  | "idle"
  | "connecting"
  | "lobby"
  | "guessing"
  | "waitingOthers"
  | "roundResult"
  | "finished"
  | "error";

export type GameMode = "classic" | "hl";

// Mode « Plus ou moins » multijoueur SANS migration DB : un marqueur est ajouté
// en fin de tableau `videos` (jamais lu par le mode classique, qui n'indexe que
// videos[0..rounds_total-1]). En HL, la manche r compare videos[r-1] et videos[r]
// (chaîne de N+1 vidéos pour N manches). Points : 1000 par bonne réponse.
export const HL_MARKER_ID = "__hl__";
export const HL_POINTS = 1000;

function hlMarker(): YTVideo {
  return { id: HL_MARKER_ID, title: "", channel: "", thumbnailURL: "", viewCount: 0 };
}

function gameIsHL(g: MPGame | null): boolean {
  return !!g && g.videos[g.videos.length - 1]?.id === HL_MARKER_ID;
}

async function fetchVideos(
  count: number,
  category?: string | null,
  lang?: string | null
): Promise<YTVideo[]> {
  const params = new URLSearchParams({ count: String(count) });
  if (category && category !== "all") params.set("category", category);
  if (lang && lang !== "all") params.set("lang", lang);
  const res = await fetch(`/api/videos?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.videos?.length) {
    throw new Error(data.error ?? "Aucune vidéo disponible.");
  }
  return data.videos as YTVideo[];
}

/** Décompte d'une partie multi : UNE seule fois par partie (au lancement, pas en
 *  lobby). Marqueur persistant → résiste au rechargement / à la reconnexion. */
function consumeMpPlayOnce(gameId: string): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem("vg_mp_played_game") === gameId) return;
  window.localStorage.setItem("vg_mp_played_game", gameId);
  recordPlay("mp");
  void serverAllowPlay("mp");
}

export function useMultiplayer() {
  // Identité du joueur STABLE par navigateur (persistée). Indispensable à la
  // reconnexion : sans ça, un simple rechargement génère une nouvelle identité →
  // une 2e ligne joueur (doublon) au lieu de réactiver l'existante.
  const playerIdRef = useRef<string>("");
  if (!playerIdRef.current) {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("vg_player_id");
      playerIdRef.current = stored ?? SupabaseService.newId();
      if (!stored) window.localStorage.setItem("vg_player_id", playerIdRef.current);
    } else {
      playerIdRef.current = SupabaseService.newId();
    }
  }
  const playerId = playerIdRef.current;

  // Suivi des joueurs actifs au tick précédent (pour détecter les départs/arrivées).
  const prevActiveRef = useRef<Map<string, string>>(new Map());
  // Vrai une fois le premier tick de polling passé (pour ne pas notifier au démarrage).
  const seededRef = useRef(false);
  // Dernière manche pour laquelle CE joueur a déjà soumis (anti double-validation).
  const submittedRoundRef = useRef(0);
  // Manche pour laquelle l'hôte a déclenché l'avancement de secours (anti-doublon).
  const forcedAdvanceRef = useRef(0);
  // Horodatage d'entrée en phase « roundResult » pour la manche courante (garde-fou
  // : l'hôte fait avancer la partie après un délai même si un joueur ne se déclare
  // jamais « prêt »). { round, at } ; remis à zéro à chaque changement de manche.
  const resultSinceRef = useRef<{ round: number; at: number }>({ round: 0, at: 0 });

  // Délai (ms) au-delà duquel l'hôte avance la manche même si tous ne sont pas prêts.
  const ROUND_RESULT_TIMEOUT_MS = 30_000;

  const [phase, setPhase] = useState<Phase>("idle");
  const [game, setGame] = useState<MPGame | null>(null);
  const [players, setPlayers] = useState<MPPlayer[]>([]);
  const [roundGuesses, setRoundGuesses] = useState<MPGuess[]>([]);
  const [guess, setGuess] = useState(1_000_000);
  const [lastPoints, setLastPoints] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const [iAmReady, setIAmReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  /** Message éphémère ("X a quitté la partie"). */
  const [notice, setNotice] = useState<string | null>(null);
  /** Messages du chat de lobby. */
  const [messages, setMessages] = useState<MPMessage[]>([]);

  const [playerName, setPlayerNameState] = useState("");
  const [playerEmoji, setPlayerEmojiState] = useState("🎮");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPlayerNameState(window.localStorage.getItem("vg_player_name") ?? "");
    setPlayerEmojiState(window.localStorage.getItem("vg_player_emoji") ?? "🎮");
  }, []);

  const setPlayerName = (n: string) => {
    setPlayerNameState(n);
    if (typeof window !== "undefined") window.localStorage.setItem("vg_player_name", n);
  };
  const setPlayerEmoji = (e: string) => {
    setPlayerEmojiState(e);
    if (typeof window !== "undefined") window.localStorage.setItem("vg_player_emoji", e);
  };

  const isHost = !!game && game.host_id === playerId;
  const currentRound = game?.current_round ?? 0;
  const isHL = gameIsHL(game);

  const currentVideo = useMemo<YTVideo | null>(() => {
    if (!game || game.current_round <= 0) return null;
    return game.videos[game.current_round - 1] ?? null;
  }, [game]);

  // Paire de la manche courante en mode « Plus ou moins » :
  // gauche = vidéo r-1 (vues révélées), droite = vidéo r (à deviner).
  const hlPair = useMemo<{ left: YTVideo; right: YTVideo } | null>(() => {
    if (!game || !isHL || game.current_round <= 0) return null;
    const left = game.videos[game.current_round - 1];
    const right = game.videos[game.current_round];
    if (!left || !right || right.id === HL_MARKER_ID) return null;
    return { left, right };
  }, [game, isHL]);

  // Joueurs encore présents (ceux qui n'ont pas quitté).
  const activePlayers = players.filter((p) => !p.has_left);
  const activeIds = new Set(activePlayers.map((p) => p.id));

  const myScore = players.find((p) => p.id === playerId)?.score ?? 0;
  // Compte les JOUEURS actifs distincts ayant répondu (dé-dup par player_id : une
  // éventuelle ligne en double ne doit pas débloquer la manche trop tôt).
  const answeredCount = new Set(
    roundGuesses.filter((g) => activeIds.has(g.player_id)).map((g) => g.player_id)
  ).size;
  const readyCount = activePlayers.filter((p) => p.ready_round >= currentRound).length;

  // Taille max du lobby. Plafond autorisé selon l'hôte (✦ = accès à vie) : 3 (gratuit) / 10 (à vie).
  // Le nombre EXACT choisi par l'hôte à la création est stocké dans son champ « emoji »
  // (inutilisé à l'affichage depuis le passage aux avatars-initiales) → aucune migration DB.
  const hostPlayer = players.find((p) => p.id === game?.host_id);
  const hostIsPro = hostPlayer ? /✦\s*$/.test(hostPlayer.name) : isPro();
  const allowedMax = hostIsPro ? 10 : 3;
  const hostCap = Number.parseInt(hostPlayer?.emoji ?? "", 10);
  const maxPlayers =
    Number.isFinite(hostCap) && hostCap >= 2 && hostCap <= allowedMax
      ? hostCap
      : allowedMax;

  function flashNotice(msg: string) {
    setNotice(msg);
    window.setTimeout(() => setNotice((n) => (n === msg ? null : n)), 3500);
  }

  // Suffixe "✦" pour marquer les membres "accès à vie" (badge affiché côté UI).
  const decoratedName = (fallback: string) => {
    const base = playerName.trim() || fallback;
    return isPro() ? `${base} ✦` : base;
  };

  // Décompte de la partie multi UNIQUEMENT quand on entre réellement en jeu
  // (lancement de la partie ou arrivée en cours), jamais en restant dans le lobby.
  // IMPORTANT : rejoindre la partie d'un hôte Pro ne consomme RIEN (illimité pour
  // tout le monde). On attend que les joueurs soient chargés pour connaître l'hôte.
  useEffect(() => {
    if (!game) return;
    if (
      phase !== "guessing" &&
      phase !== "waitingOthers" &&
      phase !== "roundResult"
    ) {
      return;
    }
    if (players.length === 0) return; // hôte pas encore connu : on attend
    if (hostIsPro) return; // partie d'un Pro → gratuit et illimité
    consumeMpPlayOnce(game.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, game?.id, players.length, hostIsPro]);

  // --- Création / Join ---

  const createGame = useCallback(
    async (
      rounds: number,
      category?: string | null,
      maxPlayers?: number,
      lang?: string | null,
      mode: GameMode = "classic"
    ) => {
      if (containsBannedWord(playerName)) {
        setErrorMsg("Ce pseudo n'est pas autorisé. Choisis-en un autre.");
        setPhase("error");
        return;
      }
      // Le mode « Plus ou moins » est un avantage de l'accès à vie (côté hôte).
      if (mode === "hl" && !isPro()) {
        setErrorMsg(
          "Le mode Plus ou moins est réservé à l'accès à vie. Débloque-le pour 3,99 € une seule fois."
        );
        setPhase("error");
        return;
      }
      setPhase("connecting");
      setErrorMsg("");
      setMessages([]);
      // On NE décompte PAS à la création du lobby : on vérifie seulement (peek) qu'il
      // reste une partie multi disponible aujourd'hui.
      if (!(await serverCheckPlay("mp"))) {
        setErrorMsg(
          "Tu as déjà joué ta partie multijoueur gratuite aujourd'hui. Reviens demain, ou passe à l'accès à vie."
        );
        setPhase("error");
        return;
      }
      try {
        // HL : N manches = chaîne de N+1 vidéos + marqueur de mode en fin de tableau.
        const fetched = await fetchVideos(
          mode === "hl" ? rounds + 1 : rounds,
          category,
          lang
        );
        const videos = mode === "hl" ? [...fetched, hlMarker()] : fetched;
        const code = generateCode();
        const g = await SupabaseService.createGame(code, playerId, rounds, videos);
        // Plafond autorisé (3 gratuit / 10 à vie) ; on borne le choix de l'hôte et on
        // le stocke dans son champ « emoji » (lu par les joueurs qui rejoignent).
        const allowed = isPro() ? 10 : 3;
        const cap = Math.min(Math.max(maxPlayers ?? allowed, 2), allowed);
        await SupabaseService.joinGame(
          g.id,
          playerId,
          decoratedName("Hôte"),
          String(cap)
        );
        setActiveGame({ gameId: g.id, code, playerId });
        setGame(g);
        setPhase("lobby");
        // Décompte volontairement DIFFÉRÉ au lancement de la partie (voir l'effet plus haut).
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : "Erreur");
        setPhase("error");
      }
    },
    [playerId, playerName, playerEmoji]
  );

  const joinGame = useCallback(
    async (code: string) => {
      if (containsBannedWord(playerName)) {
        setErrorMsg("Ce pseudo n'est pas autorisé. Choisis-en un autre.");
        setPhase("error");
        return;
      }
      setPhase("connecting");
      setErrorMsg("");
      setMessages([]);
      try {
        const g = await SupabaseService.findGame(code);
        if (g.status === "finished") {
          setErrorMsg("Cette partie est déjà terminée.");
          setPhase("error");
          return;
        }
        const existing = await SupabaseService.players(g.id);

        // Reconnexion : si j'ai DÉJÀ une ligne dans cette partie, je la réactive
        // (has_left=false) au lieu d'en créer une seconde. Aucune nouvelle partie
        // gratuite n'est décomptée dans ce cas.
        const mine = existing.find((p) => p.id === playerId);
        if (mine) {
          await SupabaseService.rejoinGame(playerId).catch(() => {});
          setActiveGame({ gameId: g.id, code, playerId });
          setGame(g);
          setPhase(g.status === "lobby" ? "lobby" : "guessing");
          return;
        }

        // Statut Pro de l'hôte. Rejoindre la partie d'un hôte « accès à vie » est
        // ILLIMITÉ et GRATUIT pour TOUS les joueurs (même gratuits) : aucune partie
        // gratuite n'est décomptée. Cela rend l'achat plus intéressant — les amis du
        // Pro peuvent toujours le rejoindre — tout en gardant la limite côté gratuit
        // pour héberger/créer sa propre partie.
        const hostP = existing.find((p) => p.id === g.host_id);
        const hostIsPro = hostP ? /✦\s*$/.test(hostP.name) : false;

        // Hôte NON-Pro : on vérifie (peek) le quota gratuit SANS le consommer.
        // Hôte Pro : aucune limite, on saute la vérification.
        if (!hostIsPro && !(await serverCheckPlay("mp"))) {
          setErrorMsg(
            "Tu as déjà joué ta partie multijoueur gratuite aujourd'hui. Reviens demain, ou passe à l'accès à vie."
          );
          setPhase("error");
          return;
        }
        // Taille max du lobby = nombre choisi par l'hôte (stocké dans son « emoji »),
        // borné par son plafond (3 gratuit / 10 à vie, via le suffixe « ✦ » du pseudo).
        const activeCount = existing.filter((p) => !p.has_left).length;
        const allowed = hostIsPro ? 10 : 3;
        const hostCap = Number.parseInt(hostP?.emoji ?? "", 10);
        const cap =
          Number.isFinite(hostCap) && hostCap >= 2 && hostCap <= allowed
            ? hostCap
            : allowed;
        if (activeCount >= cap) {
          setErrorMsg(`Cette partie est complète (${cap} joueurs maximum).`);
          setPhase("error");
          return;
        }
        await SupabaseService.joinGame(
          g.id,
          playerId,
          decoratedName("Joueur"),
          playerEmoji
        );
        setActiveGame({ gameId: g.id, code, playerId });
        setGame(g);
        // Rejoint le lobby, ou arrive directement au round courant si la partie a commencé.
        setPhase(g.status === "lobby" ? "lobby" : "guessing");
        // Décompte différé : il se fait à l'entrée en jeu (effet plus haut), pas ici.
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : "Erreur");
        setPhase("error");
      }
    },
    [playerId, playerName, playerEmoji]
  );

  // Reprise d'une partie quittée/rafraîchie : on réutilise l'identité stockée.
  const resume = useCallback(async (active: ActiveGame) => {
    setPhase("connecting");
    setErrorMsg("");
    setMessages([]);
    try {
      const g = await SupabaseService.getGame(active.gameId);
      if (!g || g.status === "finished") {
        clearActiveGame();
        setErrorMsg("Ta partie précédente est terminée ou introuvable.");
        setPhase("error");
        return;
      }
      playerIdRef.current = active.playerId; // on reprend l'identité du joueur
      await SupabaseService.rejoinGame(active.playerId).catch(() => {});
      setGame(g);
      setPhase(g.status === "lobby" ? "lobby" : "guessing");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Erreur");
      setPhase("error");
    }
  }, []);

  const startGame = useCallback(async () => {
    if (!game || !isHost) return;
    // Minimum 2 joueurs pour lancer une partie.
    if (activePlayers.length < 2) return;
    await SupabaseService.updateGame(game.id, { status: "playing", current_round: 1 });
  }, [game, isHost, activePlayers.length]);

  // Rematch : l'hôte relance une partie AVEC LES MÊMES joueurs, sans recréer de
  // salon (on réutilise la même ligne `games` → aucune partie gratuite re-décomptée,
  // le groupe reste ensemble). Nouvelles vidéos, scores remis à zéro, retour au lobby.
  // Le polling ramène automatiquement tous les autres joueurs au lobby.
  const rematch = useCallback(async () => {
    if (!game || !isHost) return;
    setAdvancing(true);
    try {
      const wasHL = isHL;
      const rounds = game.rounds_total;
      const fetched = await fetchVideos(wasHL ? rounds + 1 : rounds);
      const videos = wasHL ? [...fetched, hlMarker()] : fetched;
      await SupabaseService.resetPlayers(game.id);
      // IMPORTANT : on purge les réponses de la partie précédente, sinon les anciens
      // guesses (même game_id) réapparaissent à la manche rejouée → pseudos en double.
      await SupabaseService.deleteGuesses(game.id);
      await SupabaseService.restartGame(game.id, videos);
      submittedRoundRef.current = 0;
      forcedAdvanceRef.current = 0;
      resultSinceRef.current = { round: 0, at: 0 };
      setRoundGuesses([]);
      setIAmReady(false);
      setLastPoints(0);
      setGuess(1_000_000);
      setMessages([]);
      setActiveGame({ gameId: game.id, code: game.code, playerId });
      setGame({ ...game, videos, status: "lobby", current_round: 0 });
      setPhase("lobby");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Erreur");
      setPhase("error");
    } finally {
      setAdvancing(false);
    }
  }, [game, isHost, isHL, playerId]);

  const submitGuess = useCallback(async () => {
    if (!game || !currentVideo) return;
    // Anti double-validation : le timer à 0 ET le clic « Valider » peuvent appeler
    // submitGuess. On n'accepte qu'une soumission par manche, et seulement en phase
    // « guessing ».
    if (phase !== "guessing") return;
    if (submittedRoundRef.current === game.current_round) return;
    submittedRoundRef.current = game.current_round;
    const pts = scorePoints(guess, currentVideo.viewCount);
    setLastPoints(pts);
    const g: MPGuess = {
      id: SupabaseService.newId(),
      game_id: game.id,
      player_id: playerId,
      round: game.current_round,
      guess,
      points: pts,
    };
    setPhase("waitingOthers");
    try {
      await SupabaseService.submitGuess(g);
      await SupabaseService.updateScore(playerId, myScore + pts);
    } catch (e) {
      // Échec réseau : on autorise une nouvelle tentative pour cette manche.
      submittedRoundRef.current = 0;
      setErrorMsg(e instanceof Error ? e.message : "Erreur");
      setPhase("error");
    }
  }, [game, currentVideo, guess, playerId, myScore, phase]);

  // Soumission « Plus ou moins » : choice null = temps écoulé (0 point).
  const submitChoice = useCallback(
    async (choice: "higher" | "lower" | null) => {
      if (!game || !hlPair) return;
      if (phase !== "guessing") return;
      if (submittedRoundRef.current === game.current_round) return;
      submittedRoundRef.current = game.current_round;
      const correct =
        choice === "higher"
          ? hlPair.right.viewCount >= hlPair.left.viewCount
          : choice === "lower"
            ? hlPair.right.viewCount <= hlPair.left.viewCount
            : false;
      const pts = correct ? HL_POINTS : 0;
      setLastPoints(pts);
      const g: MPGuess = {
        id: SupabaseService.newId(),
        game_id: game.id,
        player_id: playerId,
        round: game.current_round,
        // Encodage du choix dans la colonne numérique existante : 1=plus, 0=moins, -1=aucun.
        guess: choice === "higher" ? 1 : choice === "lower" ? 0 : -1,
        points: pts,
      };
      setPhase("waitingOthers");
      try {
        await SupabaseService.submitGuess(g);
        await SupabaseService.updateScore(playerId, myScore + pts);
      } catch (e) {
        submittedRoundRef.current = 0;
        setErrorMsg(e instanceof Error ? e.message : "Erreur");
        setPhase("error");
      }
    },
    [game, hlPair, playerId, myScore, phase]
  );

  const confirmReady = useCallback(async () => {
    if (!game) return;
    setIAmReady(true);
    try {
      await SupabaseService.setReady(playerId, game.current_round);
    } catch {
      /* on réessaie au prochain tick */
    }
  }, [game, playerId]);

  const sendMessage = useCallback(
    (text: string) => {
      const t = censorText(text.trim().slice(0, 200));
      if (!t || !game) return;
      const msg: MPMessage = {
        id: SupabaseService.newId(),
        game_id: game.id,
        player_id: playerId,
        name: decoratedName("Joueur"),
        text: t,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, msg]); // affichage optimiste immédiat
      void SupabaseService.sendMessage(msg);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [game, playerId, playerName]
  );

  const leave = useCallback(() => {
    clearActiveGame();
    const g = game;
    const me = playerId;
    if (g) {
      // Si je suis l'hôte, je transmets le rôle à un autre joueur encore présent.
      const successor = players
        .filter((p) => !p.has_left && p.id !== me)
        .sort((a, b) => (a.id < b.id ? -1 : 1))[0];
      void (async () => {
        try {
          if (g.host_id === me && successor) {
            await SupabaseService.setHost(g.id, successor.id);
          }
          await SupabaseService.leaveGame(me);
        } catch {
          /* best effort */
        }
      })();
    }
    prevActiveRef.current = new Map();
    seededRef.current = false;
    submittedRoundRef.current = 0;
    forcedAdvanceRef.current = 0;
    resultSinceRef.current = { round: 0, at: 0 };
    setGame(null);
    setPlayers([]);
    setRoundGuesses([]);
    setMessages([]);
    setAdvancing(false);
    setIAmReady(false);
    setNotice(null);
    setPhase("idle");
  }, [game, players, playerId]);

  // --- Polling (état partagé) ---

  const refreshRef = useRef<() => Promise<void>>(async () => {});

  refreshRef.current = async () => {
    if (!game) return;
    try {
      const fresh = await SupabaseService.getGame(game.id);
      const freshPlayers = await SupabaseService.players(game.id);
      const oldRound = game.current_round;
      setPlayers(freshPlayers);
      setGame(fresh);

      // Chat (temps réel via polling) — disponible en lobby ET pendant la partie.
      if (fresh.status === "lobby" || fresh.status === "playing") {
        try {
          const msgs = await SupabaseService.messages(fresh.id);
          setMessages((prev) => {
            const byId = new Map<string, MPMessage>();
            for (const m of msgs) byId.set(m.id, m);
            for (const m of prev) if (!byId.has(m.id)) byId.set(m.id, m);
            return [...byId.values()].sort((a, b) =>
              (a.created_at ?? "") < (b.created_at ?? "") ? -1 : 1
            );
          });
        } catch {
          /* silencieux : on réessaie au prochain tick */
        }
      }

      const freshActive = freshPlayers.filter((p) => !p.has_left);
      const freshActiveIds = new Set(freshActive.map((p) => p.id));

      // Notifications départs/arrivées depuis le tick précédent.
      // On ne notifie pas au tout premier tick (seeding) ni pour soi-même.
      const prev = prevActiveRef.current;
      if (seededRef.current) {
        for (const [id, name] of prev) {
          if (!freshActiveIds.has(id) && id !== playerId) {
            flashNotice(`${name} a quitté la partie`);
          }
        }
        for (const p of freshActive) {
          if (!prev.has(p.id) && p.id !== playerId) {
            flashNotice(`${p.name} a rejoint la partie`);
          }
        }
      }
      prevActiveRef.current = new Map(freshActive.map((p) => [p.id, p.name]));
      seededRef.current = true;

      // Migration d'hôte : si l'hôte est parti, le 1er joueur actif (ordre stable) reprend la main.
      const successor = [...freshActive].sort((a, b) => (a.id < b.id ? -1 : 1))[0];
      const hostInactive = !freshActiveIds.has(fresh.host_id);
      if (hostInactive && successor && successor.id === playerId) {
        try {
          await SupabaseService.setHost(fresh.id, playerId);
        } catch {
          /* réessai au prochain tick */
        }
      }
      // Hôte effectif pour ce tick (pour ne pas bloquer l'avancement le temps de la migration).
      const hostNow =
        fresh.host_id === playerId ||
        (hostInactive && successor?.id === playerId);

      // Rematch détecté : l'hôte a renvoyé la partie au lobby depuis un état de jeu
      // ou de fin → on ramène ce joueur au lobby et on réarme l'état de manche.
      if (
        fresh.status === "lobby" &&
        (phase === "finished" ||
          phase === "roundResult" ||
          phase === "waitingOthers" ||
          phase === "guessing")
      ) {
        setRoundGuesses([]);
        setIAmReady(false);
        setAdvancing(false);
        setLastPoints(0);
        setGuess(1_000_000);
        submittedRoundRef.current = 0;
        forcedAdvanceRef.current = 0;
        resultSinceRef.current = { round: 0, at: 0 };
        setActiveGame({ gameId: fresh.id, code: fresh.code, playerId });
        setPhase("lobby");
        return;
      }

      if (fresh.status === "finished") {
        if (phase !== "finished") {
          clearActiveGame();
          setAdvancing(false);
          setPhase("finished");
        }
        return;
      }

      if (fresh.status === "playing") {
        let newPhase: Phase = phase;

        if (fresh.current_round !== oldRound) {
          // Nouveau round
          setGuess(1_000_000);
          setRoundGuesses([]);
          setIAmReady(false);
          setAdvancing(false);
          submittedRoundRef.current = 0; // autorise la soumission de la nouvelle manche
          resultSinceRef.current = { round: 0, at: 0 }; // réarme le garde-fou
          newPhase = "guessing";
        } else if (phase === "lobby") {
          newPhase = "guessing";
        }

        if (newPhase === "waitingOthers" || newPhase === "roundResult") {
          const gs = await SupabaseService.guesses(fresh.id, fresh.current_round);
          setRoundGuesses(gs);
          // Dé-dup par joueur : une éventuelle ligne en double ne doit pas
          // débloquer la manche avant que tous les ACTIFS aient réellement répondu.
          const answeredActive = new Set(
            gs
              .filter((g) => freshActiveIds.has(g.player_id))
              .map((g) => g.player_id)
          ).size;

          // 1) Montrer le résultat uniquement quand tous les joueurs ACTIFS ont répondu.
          if (
            answeredActive >= freshActive.length &&
            freshActive.length > 0 &&
            newPhase === "waitingOthers"
          ) {
            newPhase = "roundResult";
          }

          if (newPhase === "roundResult") {
            // Mémorise l'instant d'entrée en « roundResult » pour cette manche
            // (sert au garde-fou d'avancement automatique côté hôte).
            if (resultSinceRef.current.round !== fresh.current_round) {
              resultSinceRef.current = { round: fresh.current_round, at: Date.now() };
            }

            const everyoneReady =
              freshActive.length > 0 &&
              freshActive.every((pl) => pl.ready_round >= fresh.current_round);
            // Garde-fou : si un joueur ne clique jamais « prêt », l'hôte avance
            // quand même après ROUND_RESULT_TIMEOUT_MS (une fois par manche).
            const timedOut =
              Date.now() - resultSinceRef.current.at >= ROUND_RESULT_TIMEOUT_MS &&
              forcedAdvanceRef.current !== fresh.current_round;

            // 2) Passer à la manche suivante : quand tous les ACTIFS sont prêts,
            //    ou (garde-fou) à l'expiration du délai côté hôte.
            if (hostNow && (everyoneReady || timedOut)) {
              if (timedOut) forcedAdvanceRef.current = fresh.current_round;
              setAdvancing(true);
              if (fresh.current_round < fresh.rounds_total) {
                await SupabaseService.updateGame(fresh.id, {
                  current_round: fresh.current_round + 1,
                });
              } else {
                await SupabaseService.updateGame(fresh.id, { status: "finished" });
              }
            }
          }
        }

        if (newPhase !== phase) setPhase(newPhase);
      }
    } catch {
      /* silencieux : on réessaie au prochain tick */
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      refreshRef.current();
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Déconnexion AUTOMATIQUE à la fermeture de l'onglet / du navigateur / au départ
  // de la page. On prévient le serveur via sendBeacon (fiable même pendant l'unload)
  // pour marquer ce joueur « parti » → les autres ne l'attendent plus (ni pour
  // répondre, ni pour se déclarer prêt). Au refresh, la reprise annule ce « parti ».
  const leaveBeaconRef = useRef<() => void>(() => {});
  leaveBeaconRef.current = () => {
    if (!game) return;
    // Uniquement quand on est réellement dans une partie (lobby ou en jeu).
    if (
      phase !== "lobby" &&
      phase !== "guessing" &&
      phase !== "waitingOthers" &&
      phase !== "roundResult"
    ) {
      return;
    }
    try {
      const payload = JSON.stringify({ gameId: game.id, playerId });
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/leave",
          new Blob([payload], { type: "application/json" })
        );
      } else {
        // Repli : fetch « keepalive » survit à la fermeture de la page.
        void fetch("/api/leave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* best effort */
    }
  };

  useEffect(() => {
    const handler = () => leaveBeaconRef.current();
    // pagehide couvre fermeture d'onglet, navigation et fermeture du navigateur
    // (mobile inclus) ; beforeunload renforce côté desktop.
    window.addEventListener("pagehide", handler);
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("pagehide", handler);
      window.removeEventListener("beforeunload", handler);
    };
  }, []);

  return {
    playerId,
    phase,
    game,
    players,
    activePlayers,
    roundGuesses,
    guess,
    setGuess,
    lastPoints,
    advancing,
    iAmReady,
    errorMsg,
    notice,
    isHost,
    currentRound,
    currentVideo,
    isHL,
    hlPair,
    submitChoice,
    myScore,
    answeredCount,
    readyCount,
    maxPlayers,
    playerName,
    setPlayerName,
    playerEmoji,
    setPlayerEmoji,
    createGame,
    joinGame,
    resume,
    startGame,
    rematch,
    submitGuess,
    confirmReady,
    leave,
    messages,
    sendMessage,
  };
}
