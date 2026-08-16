"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Révélation au scroll, réutilisable.
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.6, ease: [0.21, 0.5, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
