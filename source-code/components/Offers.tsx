"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isPro } from "@/lib/pro";
import { remaining, FREE_LIMITS } from "@/lib/limits";
import { ResetCountdown } from "@/components/ResetCountdown";
import { useT } from "@/lib/i18n";

// Ligne d'avantage (incluse ou non).
function Line({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm">
      <span
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          ok ? "bg-strawberry/15 text-crimson" : "bg-black/[0.06] text-lavender"
        }`}
      >
        {ok ? "✓" : "✕"}
      </span>
      <span className={ok ? "text-platinum" : "text-lavender"}>{children}</span>
    </li>
  );
}

// Comparatif clair « Gratuit vs Accès à vie » avec compteurs de parties restantes
// en direct pour les joueurs sans accès à vie.
export function Offers() {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const [pro, setPro] = useState(false);
  const [soloLeft, setSoloLeft] = useState(FREE_LIMITS.solo);
  const [mpLeft, setMpLeft] = useState(FREE_LIMITS.mp);

  useEffect(() => {
    const refresh = () => {
      setPro(isPro());
      setSoloLeft(remaining("solo"));
      setMpLeft(remaining("mp"));
    };
    refresh();
    setMounted(true);
    window.addEventListener("vg-pro-change", refresh);
    window.addEventListener("vg-day-reset", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("vg-pro-change", refresh);
      window.removeEventListener("vg-day-reset", refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const showQuota = mounted && !pro;

  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-2">
      {/* GRATUIT */}
      <div className="card-ink flex flex-col rounded-2xl p-7 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender">
              {t("offers.withoutLife")}
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-platinum">
              {t("offers.free")}
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-platinum">0 $</div>
        </div>

        {/* Compteur de parties restantes aujourd'hui (en direct) */}
        <div className="mt-5 rounded-xl border-2 border-platinum/10 bg-[#FAF7F0] p-4">
          {showQuota ? (
            <>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-lavender">
                {t("offers.leftToday")}
              </div>
              <div className="mt-2 flex gap-2">
                <span className="flex-1 rounded-xl bg-ink-soft px-3 py-2 text-center">
                  <span className="block font-display text-2xl font-bold text-platinum tabular-nums">
                    {soloLeft}
                    <span className="text-base text-lavender">/{FREE_LIMITS.solo}</span>
                  </span>
                  <span className="text-[11px] font-medium text-lavender">{t("offers.solo")}</span>
                </span>
                <span className="flex-1 rounded-xl bg-ink-soft px-3 py-2 text-center">
                  <span className="block font-display text-2xl font-bold text-platinum tabular-nums">
                    {mpLeft}
                    <span className="text-base text-lavender">/{FREE_LIMITS.mp}</span>
                  </span>
                  <span className="text-[11px] font-medium text-lavender">{t("offers.multi")}</span>
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-lavender/70">
                <span className="inline-block h-1.5 w-1.5 animate-pulseGlow rounded-full bg-strawberry" />
                <ResetCountdown prefix={t("paywall.renewIn")} />
              </div>
            </>
          ) : pro && mounted ? (
            <div className="text-sm font-semibold text-platinum">
              {t("offers.youHaveLife")}
            </div>
          ) : (
            <div className="text-sm text-lavender">
              {t("offers.freeRecap", { solo: FREE_LIMITS.solo, mp: FREE_LIMITS.mp })}
            </div>
          )}
        </div>

        <ul className="mt-6 space-y-3">
          <Line ok>{t("offers.l1", { n: FREE_LIMITS.solo })}</Line>
          <Line ok>{t("offers.l2", { n: FREE_LIMITS.mp })}</Line>
          <Line ok>{t("offers.l3")}</Line>
          <Line ok={false}>{t("offers.l4")}</Line>
        </ul>

        <Link href="/play/solo" className="btn-paper mt-7 w-full px-5 py-3.5 text-sm">
          {t("offers.playFree")}
        </Link>
      </div>

      {/* ACCÈS À VIE */}
      <div className="relative flex flex-col rounded-2xl border-2 border-platinum bg-white p-7 shadow-hard-red sm:p-8">
        <span className="sticker absolute -top-3 right-6 rotate-2 !border-crimson bg-white !text-crimson !shadow-hard-red-sm">
          {t("offers.popular")}
        </span>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-strawberry">
            {t("offers.allUnlocked")}
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-platinum">
            {t("offers.lifeAccess")}
          </div>
        </div>
        <div className="mt-2 flex items-end gap-2">
          <span className="font-display text-4xl font-bold text-platinum">5,99 $ CA</span>
          <span className="mb-1.5 text-sm text-lavender">{t("offers.once")}</span>
        </div>

        <ul className="mt-6 space-y-3">
          <Line ok>{t("offers.p1")}</Line>
          <Line ok>{t("offers.p2")}</Line>
          <Line ok>{t("offers.p3")}</Line>
          <Line ok>{t("offers.p4")}</Line>
          <Line ok>{t("offers.p5")}</Line>
          <Line ok>{t("offers.p6")}</Line>
        </ul>

        <Link href="/pro" className="btn-ink mt-7 w-full px-5 py-3.5 text-sm">
          {pro && mounted ? t("offers.haveLife") : t("offers.getLife")}
        </Link>
      </div>
    </div>
  );
}
