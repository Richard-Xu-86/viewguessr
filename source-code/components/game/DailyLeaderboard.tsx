"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getName, setName as saveName } from "@/lib/profile";
import {
  fetchDailyLeaderboard,
  submitDailyScore,
  type LBData,
} from "@/lib/leaderboard";
import { Button } from "@/components/Buttons";
import { useT, useLocale, intlLocale } from "@/lib/i18n";

// Classement du jour affiché en fin de Défi. Publie le score (pseudo demandé
// si inconnu), puis montre le top 20 + le rang du joueur. Best-effort : si le
// classement est indisponible (Supabase non configuré), le bloc reste discret.
export function DailyLeaderboard({ day, score }: { day: string; score: number }) {
  const t = useT();
  const { locale } = useLocale();
  const [pseudo, setPseudo] = useState("");
  const [hasName, setHasName] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<LBData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getName().replace(/\s*✦\s*$/, "").trim();
    setPseudo(existing);
    setHasName(!!existing);
    (async () => {
      if (existing) {
        await submitDailyScore(day, existing, score);
        setSubmitted(true);
      }
      setData(await fetchDailyLeaderboard(day));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function publish() {
    const n = pseudo.trim().slice(0, 24);
    if (!n) return;
    saveName(n);
    setHasName(true);
    setSubmitted(true);
    setLoading(true);
    await submitDailyScore(day, n, score);
    setData(await fetchDailyLeaderboard(day));
    setLoading(false);
  }

  return (
    <div className="mt-6 rounded-2xl glass p-4 text-left">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-lavender">
          {t("lb.title")}
        </div>
        {data && data.total > 0 && (
          <div className="text-xs font-semibold text-lavender">
            {t("lb.players", { n: data.total, s: data.total > 1 ? "s" : "" })}
          </div>
        )}
      </div>

      {/* Saisie du pseudo si inconnu */}
      {!hasName && !submitted && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") publish();
            }}
            placeholder={t("lb.yourPseudo")}
            maxLength={24}
            className="flex-1 rounded-xl border-2 border-platinum/15 bg-[#FAF7F0] px-4 py-2.5 text-sm font-semibold text-platinum outline-none focus:border-crimson"
          />
          <Button
            onClick={publish}
            disabled={pseudo.trim().length === 0}
            className="px-5 py-2.5 text-sm"
          >
            {t("lb.publish")}
          </Button>
        </div>
      )}

      {/* Mon rang */}
      {submitted && data?.rank != null && (
        <div className="mt-3 rounded-xl border-2 border-crimson/30 bg-strawberry/10 px-4 py-2.5 text-sm font-bold text-crimson">
          {t("lb.yourRank", {
            rank: data.rank === 1 ? t("lb.youAreFirst") : t("lb.youAreNth", { n: data.rank }),
            total: data.total > 0 ? t("lb.outOf", { n: data.total }) : "",
            score: score.toLocaleString(intlLocale(locale)),
          })}
        </div>
      )}

      {/* Top 20 */}
      {loading ? (
        <div className="mt-4 py-4 text-center text-sm text-lavender">{t("common.loading")}</div>
      ) : (
        data &&
        data.top.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {data.top.map((e, i) => (
              <motion.div
                key={`${e.rank}-${e.name}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                  e.mine ? "glass-strong ring-2 ring-strawberry" : ""
                }`}
              >
                <span
                  className={`w-6 text-center text-sm font-black ${
                    e.rank === 1
                      ? "text-crimson"
                      : e.rank <= 3
                        ? "text-platinum"
                        : "text-lavender"
                  }`}
                >
                  {e.rank}
                </span>
                <span className="flex-1 truncate text-sm font-semibold text-platinum">
                  {e.name}
                </span>
                <span className="font-extrabold tabular-nums text-platinum">
                  {e.score.toLocaleString(intlLocale(locale))}
                </span>
              </motion.div>
            ))}
          </div>
        )
      )}

      {!loading && data && data.top.length === 0 && submitted && (
        <div className="mt-3 text-sm text-lavender">
          {t("lb.openToday")}
        </div>
      )}
    </div>
  );
}
