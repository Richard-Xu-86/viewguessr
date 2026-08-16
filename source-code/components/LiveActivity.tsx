"use client";

import { useEffect, useState } from "react";
import { fetchActivity, type ActivityItem } from "@/lib/activity";
import { useT, useLocale, intlLocale } from "@/lib/i18n";

/** Bandeau « activité en direct » : parties récentes + scores qui défilent.
 *  N'affiche rien tant qu'il n'y a aucune activité réelle (pas de faux chiffres). */
export function LiveActivity() {
  const t = useT();
  const { locale } = useLocale();
  const [count, setCount] = useState(0);
  const [recent, setRecent] = useState<ActivityItem[]>([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchActivity().then((a) => {
      if (alive && a) {
        setCount(a.todayCount);
        setRecent(Array.isArray(a.recent) ? a.recent : []);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (recent.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % recent.length), 3200);
    return () => clearInterval(id);
  }, [recent.length]);

  if (count <= 0 && recent.length === 0) return null;

  const item = recent.length ? recent[i % recent.length] : null;

  return (
    <div className="inline-flex max-w-full items-center gap-2.5 rounded-full glass px-4 py-2 text-sm">
      <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-strawberry/70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-strawberry" />
      </span>
      {count > 0 && (
        <span className="flex-shrink-0 font-semibold text-platinum">
          {t("activity.games", {
            n: count.toLocaleString(intlLocale(locale)),
            s: count > 1 ? "s" : "",
          })}
        </span>
      )}
      {item && (
        <span className="hidden min-w-0 truncate text-lavender sm:inline">
          · {item.score.toLocaleString(intlLocale(locale))} {t("common.points")}{" "}
          {t(`activity.mode.${item.mode}`)}
        </span>
      )}
    </div>
  );
}
