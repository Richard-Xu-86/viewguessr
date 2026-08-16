"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

// Carte avec inclinaison 3D suivant la souris.
// Perf : transform UNIQUEMENT (composité par le GPU), aucun repaint.
// On throttle les mises à jour via requestAnimationFrame et on coupe sur tactile.
export function TiltCard({
  children,
  className = "",
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), {
    stiffness: 150,
    damping: 18,
    mass: 0.4,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), {
    stiffness: 150,
    damping: 18,
    mass: 0.4,
  });

  function onMove(e: React.PointerEvent) {
    if (e.pointerType === "touch") return; // pas de tilt au doigt
    if (frame.current !== null) return; // throttle ~1/frame
    const el = ref.current;
    if (!el) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const r = el.getBoundingClientRect();
      mx.set((clientX - r.left) / r.width);
      my.set((clientY - r.top) / r.height);
    });
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative [perspective:1000px] ${className}`}
    >
      {children}
    </motion.div>
  );
}
