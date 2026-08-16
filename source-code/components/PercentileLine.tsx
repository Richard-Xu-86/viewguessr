"use client";

import { useEffect, useState } from "react";
import { fetchPercentile } from "@/lib/activity";
import { useT } from "@/lib/i18n";

/** « Tu as battu X % des joueurs ». Ne s'affiche que si l'échantillon est suffisant. */
export function PercentileLine({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const t = useT();
  const [pct, setPct] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPercentile(score).then((r) => {
      if (alive && r && r.percentile !== null && r.sample >= 5) {
        setPct(r.percentile);
      }
    });
    return () => {
      alive = false;
    };
  }, [score]);

  if (pct === null) return null;

  return (
    <div
      className={`mx-auto w-fit rounded-full bg-strawberry/10 px-4 py-1.5 text-sm font-bold text-crimson ${className}`}
    >
      {t("percentile.line", { pct })}
    </div>
  );
}
