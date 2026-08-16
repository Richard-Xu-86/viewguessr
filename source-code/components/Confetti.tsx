"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#EF233C", "#D80032", "#EDF2F4", "#8D99AE"];

// Confettis légers en CSS/Framer déclenchés sur une victoire / gros score.
export function Confetti({ count = 28 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 1.2,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: "110%", opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}
