"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";

// Carton d'intro de manche (façon app iOS) : "MANCHE n / sur N" avec un pop.
export function RoundIntro({ round, total }: { round: number; total: number }) {
  const t = useT();
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
      className="text-center"
    >
      <div className="sticker -rotate-2 uppercase tracking-[0.2em]">
        {t("roundintro.round")}
      </div>
      <div className="mt-2 font-display text-7xl font-bold text-crimson sm:text-8xl">
        {round}
      </div>
      <div className="text-sm font-bold text-lavender">{t("roundintro.of", { total })}</div>
    </motion.div>
  );
}
