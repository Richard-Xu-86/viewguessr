"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { Logo, Wordmark } from "@/components/Logo";
import { Button } from "@/components/Buttons";
import { isPro, setPro } from "@/lib/pro";
import { useT, useLocale } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

const PERK_KEYS = ["perk1", "perk2", "perk3", "perk4", "perk5"];

export default function ProPage() {
  const t = useT();
  const { locale } = useLocale();
  const PERKS = PERK_KEYS.map((k) => ({ t: t(`pro.${k}.t`), d: t(`pro.${k}.d`) }));
  const [pro, setProState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [showRestore, setShowRestore] = useState(false);

  useEffect(() => {
    setProState(isPro());
    // Si la détection auto (ProSync) débloque l'accès, on met à jour l'affichage.
    const onChange = () => setProState(isPro());
    window.addEventListener("vg-pro-change", onChange);
    return () => window.removeEventListener("vg-pro-change", onChange);
  }, []);

  async function buy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || t("pro.error"));
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : t("pro.error"));
      setLoading(false);
    }
  }

  async function restore() {
    setRestoring(true);
    setRestoreMsg(null);
    try {
      const res = await fetch("/api/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.active) {
        setPro(true);
        setProState(true);
        setRestoreMsg({ ok: true, text: t("pro.restored") });
      } else {
        setRestoreMsg({
          ok: false,
          text: data.error || t("pro.codeInvalid"),
        });
      }
    } catch {
      setRestoreMsg({ ok: false, text: t("pro.restoreError") });
    } finally {
      setRestoring(false);
    }
  }

  return (
    <>
      <Aurora />
      <main className="relative flex min-h-dvh flex-col">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={34} />
            <Wordmark className="text-lg text-platinum" />
          </Link>
          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <Link href="/" className="text-sm font-semibold text-lavender hover:text-platinum">
              {t("common.back")}
            </Link>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-1 items-center px-5 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid w-full items-center gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr]"
          >
            {/* Colonne pitch */}
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="sticker -rotate-2">{t("pro.badge1")}</span>
                <span className="sticker rotate-1">{t("pro.badge2")}</span>
              </div>

              <h1 className="mt-6 font-display text-5xl font-bold leading-[0.97] tracking-tight text-platinum sm:text-6xl">
                {t("pro.title1")}
                <br />
                <span className="hl-red">{t("pro.title2")}</span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-lavender">
                {t("pro.lead")}
              </p>

              {/* Avantages en grille éditoriale */}
              <div className="mt-8 grid gap-x-8 gap-y-6 border-t-2 border-platinum/15 pt-7 sm:grid-cols-2">
                {PERKS.map((p, i) => (
                  <div key={p.t}>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-crimson">
                        ({String(i + 1).padStart(2, "0")})
                      </span>
                      <h3 className="font-display text-base font-bold text-platinum">
                        {p.t}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-lavender">
                      {p.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne carte d'achat */}
            <div className="relative">
              <span className="sticker absolute -top-3 right-8 z-10 rotate-2 !border-crimson bg-white !text-crimson !shadow-hard-red-sm">
                {t("pro.lifeAccess")}
              </span>

              <div className="relative rounded-2xl border-2 border-platinum bg-white p-8 shadow-hard-red">
                <div className="text-center">
                  <div className="mx-auto mb-4 w-fit">
                    <Logo size={56} />
                  </div>
                  <div className="flex items-end justify-center gap-2">
                    <span className="font-display text-6xl font-bold text-platinum">
                      5,99 $ CA
                    </span>
                    <span className="mb-2 text-sm font-semibold text-lavender">
                      {t("pro.priceOnce")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-lavender">
                    {t("pro.cardDesc")}
                  </p>
                </div>

                {pro ? (
                  <div className="mt-7 rounded-xl border-2 border-platinum/15 bg-[#FAF7F0] px-4 py-4 text-center">
                    <div className="font-display text-lg font-bold text-platinum">
                      {t("pro.alreadyHave")}
                    </div>
                    <Link
                      href="/play/solo"
                      className="mt-2 inline-block text-sm font-bold text-crimson"
                    >
                      {t("pro.playNow")}
                    </Link>
                  </div>
                ) : (
                  <>
                    <Button onClick={buy} disabled={loading} className="mt-7 w-full py-4 text-base">
                      {loading ? t("pro.redirecting") : t("pro.unlock")}
                    </Button>
                    {error && (
                      <p className="mt-3 text-center text-sm text-crimson">{error}</p>
                    )}
                    <p className="mt-3 text-center text-xs text-lavender">
                      {t("pro.secured")}
                    </p>

                    {!showRestore ? (
                      <button
                        onClick={() => setShowRestore(true)}
                        className="mt-4 block w-full text-center text-xs font-semibold text-lavender underline-offset-2 hover:text-platinum hover:underline"
                      >
                        {t("pro.restoreLink")}
                      </button>
                    ) : (
                      <div className="mt-5 border-t-2 border-platinum/10 pt-5">
                        <p className="text-center text-xs text-lavender">
                          {t("pro.restoreHint")}
                        </p>
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="XXXX-XXXX-XXXX"
                          autoCapitalize="characters"
                          className="mt-3 w-full rounded-xl border-2 border-platinum/15 bg-[#FAF7F0] px-4 py-3 text-center font-bold uppercase tracking-[0.15em] text-platinum outline-none focus:border-crimson"
                        />
                        <Button
                          onClick={restore}
                          variant="glass"
                          disabled={
                            restoring ||
                            code.replace(/[^A-Za-z0-9]/g, "").length < 8
                          }
                          className="mt-3 w-full py-3"
                        >
                          {restoring ? t("pro.restoring") : t("pro.restoreBtn")}
                        </Button>
                        {restoreMsg && (
                          <p
                            className={`mt-3 text-center text-sm font-semibold ${
                              restoreMsg.ok ? "text-green-600" : "text-crimson"
                            }`}
                          >
                            {restoreMsg.text}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
