"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { Logo, Wordmark } from "@/components/Logo";
import { Button } from "@/components/Buttons";

export default function NotFound() {
  return (
    <>
      <Aurora />
      <main className="relative flex min-h-dvh flex-col">
        {/* Logo en haut */}
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2.5 px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={34} />
            <Wordmark className="text-lg text-platinum" />
          </Link>
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
                  0 vue
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
            Cette page n&apos;a fait{" "}
            <span className="hl-red">aucune vue</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-4 max-w-md text-lavender"
          >
            La vidéo que tu cherches est introuvable elle a peut-être été
            supprimée, ou le lien est cassé. Mais il reste plein de vues à
            deviner.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link href="/">
              <Button className="px-7 py-3.5 text-base">Retour à l&apos;accueil</Button>
            </Link>
            <Link href="/play/solo">
              <Button variant="glass" className="px-7 py-3.5 text-base">
                ▶ Jouer en solo
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
