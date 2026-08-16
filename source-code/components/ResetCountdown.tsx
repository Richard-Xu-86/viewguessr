"use client";

import { useEffect, useRef, useState } from "react";
import { msUntilReset } from "@/lib/limits";

function fmt(ms: number): string {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)} h ${p(m)} min ${p(s)} s`;
}

// Compte à rebours live jusqu'au renouvellement quotidien des parties gratuites
// (minuit local). Au passage de minuit, signale aux autres composants (ex. Offers)
// de rafraîchir le nombre de parties restantes via l'événement « vg-day-reset ».
export function ResetCountdown({
  prefix = "Renouvellement dans",
  className = "",
}: {
  prefix?: string;
  className?: string;
}) {
  const [ms, setMs] = useState<number | null>(null);
  const prev = useRef<number>(Infinity);

  useEffect(() => {
    const tick = () => {
      const next = msUntilReset();
      // Le compteur remonte d'un coup → on vient de passer minuit.
      if (next > prev.current + 1500) {
        window.dispatchEvent(new Event("vg-day-reset"));
      }
      prev.current = next;
      setMs(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (ms === null) return null; // rendu client uniquement (évite tout décalage d'hydratation)

  return (
    <span className={className}>
      {prefix}{" "}
      <span className="font-semibold tabular-nums text-platinum">{fmt(ms)}</span>
    </span>
  );
}
