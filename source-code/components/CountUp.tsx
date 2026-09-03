"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, groupedViewsL } from "@/lib/i18n";

// Compteur animé (count-up) pour révéler le nombre de vues / un score.
// Sans `format`, le groupage des milliers suit la langue active (EN par défaut).
export function CountUp({
  to,
  duration = 1100,
  className = "",
  format,
}: {
  to: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const { locale } = useLocale();
  const fmt = format ?? ((n: number) => groupedViewsL(n, locale));
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

  return <span className={className}>{fmt(value)}</span>;
}
