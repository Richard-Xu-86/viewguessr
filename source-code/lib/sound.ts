"use client";

// Effets sonores SYNTHÉTISÉS via la Web Audio API — aucun fichier audio à charger.
// + bascule muet (persistée) + retour haptique (vibration) sur mobile.

let ctx: AudioContext | null = null;
const MUTE_KEY = "vg_muted";

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Amorce l'audio : reprend le contexte ET joue un buffer silencieux. Safari
 *  (surtout sur Mac) garde le contexte « suspended » et ne le débloque vraiment
 *  qu'après la lecture d'un son DANS un geste utilisateur — d'où ce buffer muet
 *  joué une seule fois au tout premier geste. */
let primed = false;
function unlock(c: AudioContext): void {
  if (c.state === "suspended") void c.resume();
  if (primed) return;
  primed = true;
  try {
    const buf = c.createBuffer(1, 1, 22050);
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(c.destination);
    src.start(0);
  } catch {
    /* ignore */
  }
}

/** À appeler sur un geste utilisateur (clic) pour débloquer l'audio. */
export function resumeAudio(): void {
  bindUnlock();
  const c = getCtx();
  if (c) unlock(c);
}

// Débloque l'audio dès la 1re interaction sur la page (politique « autoplay » des
// navigateurs) : on amorce le contexte au tout premier geste, quel qu'il soit,
// pour que le son parte ensuite de façon fiable — Safari desktop compris.
let unlockBound = false;
function bindUnlock(): void {
  if (unlockBound || typeof window === "undefined") return;
  unlockBound = true;
  const handler = () => {
    const c = getCtx();
    if (c) unlock(c);
  };
  for (const ev of [
    "pointerdown",
    "touchstart",
    "touchend",
    "mousedown",
    "click",
    "keydown",
  ]) {
    window.addEventListener(ev, handler, { passive: true });
  }
}
if (typeof window !== "undefined") bindUnlock();

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MUTE_KEY) === "1";
}
export function setMuted(m: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUTE_KEY, m ? "1" : "0");
}
export function toggleMuted(): boolean {
  const m = !isMuted();
  setMuted(m);
  return m;
}

interface ToneOpts {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  slideTo?: number;
}

function tone(o: ToneOpts): void {
  const c = getCtx();
  if (!c || isMuted()) return;
  if (c.state === "suspended") void c.resume();
  const t0 = c.currentTime + (o.delay ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.freq, t0);
  if (o.slideTo) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.slideTo), t0 + o.dur);
  }
  const peak = o.gain ?? 0.14;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.03);
}

export const Sound = {
  click() {
    tone({ freq: 330, dur: 0.06, type: "triangle", gain: 0.07 });
  },
  tick() {
    tone({ freq: 880, dur: 0.035, type: "square", gain: 0.045 });
  },
  validate() {
    tone({ freq: 480, dur: 0.08, type: "triangle", gain: 0.1 });
    tone({ freq: 720, dur: 0.1, type: "triangle", gain: 0.08, delay: 0.06 });
  },
  /** Petit roulement pendant le décompte des vues. */
  drumroll() {
    for (let i = 0; i < 9; i++) {
      tone({
        freq: 240 + i * 18,
        dur: 0.045,
        type: "square",
        gain: 0.045,
        delay: i * 0.055,
      });
    }
  },
  /** Chime selon le palier du score de la manche. */
  result(points: number) {
    if (points >= 4500) return Sound.bullseye();
    if (points >= 3000) {
      [523, 659, 784].forEach((f, i) =>
        tone({ freq: f, dur: 0.18, type: "triangle", gain: 0.12, delay: i * 0.08 })
      );
      return;
    }
    if (points >= 1500) {
      tone({ freq: 392, dur: 0.16, type: "triangle", gain: 0.1 });
      tone({ freq: 523, dur: 0.18, type: "triangle", gain: 0.09, delay: 0.09 });
      return;
    }
    tone({ freq: 240, dur: 0.28, type: "sawtooth", gain: 0.07, slideTo: 130 });
  },
  /** Réussite quasi parfaite. */
  bullseye() {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone({ freq: f, dur: 0.22, type: "triangle", gain: 0.14, delay: i * 0.07 })
    );
    tone({ freq: 1568, dur: 0.45, type: "sine", gain: 0.1, delay: 0.3 });
  },
  /** Fanfare de victoire (fin de partie). */
  win() {
    [659, 784, 988, 1319].forEach((f, i) =>
      tone({ freq: f, dur: 0.24, type: "triangle", gain: 0.14, delay: i * 0.1 })
    );
  },
};

/** Vibration courte (mobile). Silencieuse si muet ou non supporté. */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator === "undefined" || isMuted()) return;
  const nav = navigator as Navigator & {
    vibrate?: (p: number | number[]) => boolean;
  };
  if (typeof nav.vibrate === "function") {
    try {
      nav.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}
