"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useT } from "@/lib/i18n";

export function Loader({ label }: { label?: string }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <Logo size={64} />
      </motion.div>
      <p className="text-sm font-medium text-lavender">
        {label ?? t("common.loadingVideos")}
      </p>
    </div>
  );
}
