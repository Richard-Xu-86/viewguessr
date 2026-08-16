"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { Logo, Wordmark } from "@/components/Logo";
import { Button } from "@/components/Buttons";
import { Confetti } from "@/components/Confetti";
import { setPro } from "@/lib/pro";

function MerciInner() {
  const params = useSearchParams();
  const [state, setState] = useState<"checking" | "ok" | "error">("checking");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = params.get("session_id");
    if (!id) {
      setState("error");
      return;
    }
    fetch(`/api/verify?session_id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.paid) {
          setPro(true);
          setCode(typeof d.code === "string" ? d.code : null);
          setState("ok");
        } else {
          setState("error");
        }
      })
      .catch(() => setState("error"));
  }, [params]);

  const formattedCode = code
    ? code.replace(/(.{4})(.{4})(.{4})/, "$1-$2-$3")
    : "";

  return (
    <div className="flex flex-1 items-center justify-center px-5 pb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {state === "ok" && <Confetti />}
        <div className="relative overflow-hidden rounded-2xl glass-strong p-10">
          {state === "checking" && (
            <>
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-black/20 border-t-strawberry" />
              <p className="text-lavender">Vérification du paiement…</p>
            </>
          )}

          {state === "ok" && (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-strawberry to-crimson text-3xl">
                ✦
              </div>
              <h1 className="font-display text-3xl font-bold text-platinum">
                Merci ! Tu as l&apos;accès <span className="hl-red">à vie</span>
              </h1>
              <p className="mt-3 text-lavender">
                Tout est débloqué, pour toujours. Bon jeu et bonne chance pour
                deviner les vues.
              </p>

              {code && (
                <div className="mt-6 rounded-2xl bg-black/[0.04] p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-lavender">
                    Ton code d&apos;accès à vie
                  </div>
                  <div className="mt-1.5 font-display text-2xl font-bold tracking-[0.15em] text-platinum">
                    {formattedCode}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(formattedCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1800);
                    }}
                    className="mt-3 rounded-xl glass px-4 py-2 text-sm font-semibold text-platinum hover:bg-black/10"
                  >
                    {copied ? "Copié ✓" : "Copier le code"}
                  </button>
                  <p className="mt-3 text-xs text-lavender">
                    Garde ce code : c&apos;est lui (et non ton e-mail) qui débloque
                    ton accès sur tes autres appareils.
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/play/solo">
                  <Button className="px-7 py-3.5">▶ Jouer en solo</Button>
                </Link>
                <Link href="/">
                  <Button variant="glass" className="px-7 py-3.5">Accueil</Button>
                </Link>
              </div>
            </>
          )}

          {state === "error" && (
            <>
              <div className="text-5xl">🤔</div>
              <h1 className="mt-4 font-display text-2xl font-bold text-platinum">
                Paiement non confirmé
              </h1>
              <p className="mt-3 text-lavender">
                Si tu viens de payer, patiente quelques secondes et recharge la
                page. Sinon, tu peux réessayer.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/pro">
                  <Button className="px-7 py-3.5">Réessayer</Button>
                </Link>
                <Link href="/">
                  <Button variant="glass" className="px-7 py-3.5">Accueil</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function MerciPage() {
  return (
    <>
      <Aurora />
      <main className="relative flex min-h-dvh flex-col">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2.5 px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={34} />
            <Wordmark className="text-lg text-platinum" />
          </Link>
        </div>
        <Suspense fallback={<div className="flex-1" />}>
          <MerciInner />
        </Suspense>
      </main>
    </>
  );
}
