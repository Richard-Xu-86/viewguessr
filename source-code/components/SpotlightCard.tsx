"use client";

import { ReactNode, useRef } from "react";

// Carte "spotlight" : un halo lumineux suit le curseur (effet moderne façon Linear/Vercel).
// Perf : mise à jour throttlée via requestAnimationFrame, repaint limité à la carte.
export function SpotlightCard({
  children,
  className = "",
  glow = "rgba(239,35,60,0.18)",
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  function onMove(e: React.MouseEvent) {
    if (frame.current !== null) return;
    const x = e.clientX;
    const y = e.clientY;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${x - r.left}px`);
      el.style.setProperty("--my", `${y - r.top}px`);
    });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group/spot relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(300px circle at var(--mx, 50%) var(--my, 0%), ${glow}, transparent 72%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
