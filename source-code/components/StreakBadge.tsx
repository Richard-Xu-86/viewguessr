"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { streakInfo, type StreakInfo } from "@/lib/daily";
import { useT } from "@/lib/i18n";

// Badge de série affiché dans les en-têtes. Met en avant le défi du jour :
// 🔥 + nombre de jours, état « à risque » (pas encore joué aujourd'hui), et
// le nombre de gels disponibles. Ne s'affiche pas tant qu'aucune série n'existe.
export function StreakBadge({ className = "" }: { className?: string }) {
  const t = useT();
  const [info, setInfo] = useState<StreakInfo | null>(null);

  useEffect(() => {
    const refresh = () => setInfo(streakInfo());
    refresh();
    window.addEventListener("vg-streak-change", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("vg-streak-change", refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  if (!info || info.current <= 0) return null;

  const atRisk = info.atRisk;
  const title = atRisk
    ? t("streak.keepToday")
    : t("streak.title", { n: info.current });

  return (
    <Link
      href="/defi"
      title={title}
      aria-label={title}
      className={`flex h-9 items-center gap-1.5 rounded-full border-2 px-3 text-sm font-bold tabular-nums transition ${
        atRisk
          ? "animate-pulseGlow border-crimson bg-strawberry/10 text-crimson"
          : "border-platinum/15 bg-white text-platinum hover:border-platinum/40"
      } ${className}`}
    >
      <span aria-hidden>🔥</span>
      <span>{info.current}</span>
      {info.freezes > 0 && (
        <span className="ml-0.5 text-xs font-semibold text-lavender" aria-hidden>
          ❄️{info.freezes}
        </span>
      )}
    </Link>
  );
}
