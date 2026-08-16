"use client";

import { useEffect, useRef, useState } from "react";
import { groupedViews } from "@/lib/format";

// Compteur animé (count-up) pour révéler le nombre de vues / un score.
export function CountUp({
  to,
  duration = 1100,
  className = "",
  format = groupedViews,
}: {
  to: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [to, duration]);

  return <span className={className}>{format(value)}</span>;
}
