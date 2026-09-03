"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { Logo, Wordmark } from "@/components/Logo";
import { Button } from "@/components/Buttons";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const t = useT();
  return (
    <>
      <Aurora />
      <main className="relative flex min-h-dvh flex-col">
        {/* Logo en haut + bascule de langue */}
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2.5 px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={34} />
            <Wordmark className="text-lg text-platinum" />
          </Link>
          <LanguageToggle />
        </div>

        {/* Contenu centré */}
        <div className="flex flex-1 flex-col items-center justify-center px-5 pb-20 text-center">
          {/* Miniature mystère "404" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 16 }}
            className="relative mb-8 w-full max-w-sm"
          >
            <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-br from-strawberry/25 to-crimson/15 blur-2xl" />
            <div className="overflow-hidden rounded-2xl glass-strong p-4">
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-black/50">
                <span className="font-display text-7xl font-bold text-crimson sm:text-8xl">
                  404
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-strawberry backdrop-blur">
                  {t("nf.badge")}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-display text-3xl font-bold text-platinum sm:text-4xl"
          >
            {t("nf.title1")} <span className="hl-red">{t("nf.title2")}</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-4 max-w-md text-lavender"
          >
            {t("nf.body")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link href="/">
              <Button className="px-7 py-3.5 text-base">{t("common.backToHome")}</Button>
            </Link>
            <Link href="/play/solo">
              <Button variant="glass" className="px-7 py-3.5 text-base">
                {t("nf.playSolo")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
