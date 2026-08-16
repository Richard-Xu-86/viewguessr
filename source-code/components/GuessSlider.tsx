"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sound, vibrate, resumeAudio } from "@/lib/sound";
import { useT, useLocale, compactViewsL, groupedViewsL } from "@/lib/i18n";

const MIN_LOG = 3; // 1 000
const MAX_LOG = 10; // 10 000 000 000
const STEPS = 1000;

function valueToSlider(value: number): number {
  const log = Math.log10(Math.max(1000, value));
  const clamped = Math.min(MAX_LOG, Math.max(MIN_LOG, log));
  return ((clamped - MIN_LOG) / (MAX_LOG - MIN_LOG)) * STEPS;
}

function sliderToValue(slider: number): number {
  const log = MIN_LOG + (slider / STEPS) * (MAX_LOG - MIN_LOG);
  const raw = Math.pow(10, log);
  // Arrondi "joli" selon l'ordre de grandeur
  if (raw >= 1_000_000) return Math.round(raw / 100_000) * 100_000;
  if (raw >= 100_000) return Math.round(raw / 10_000) * 10_000;
  if (raw >= 10_000) return Math.round(raw / 1_000) * 1_000;
  return Math.round(raw / 100) * 100;
}

export function GuessSlider({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const t = useT();
  const { locale } = useLocale();
  const slider = valueToSlider(value);
  const pct = (slider / STEPS) * 100;

  const magRef = useRef(-1);
  const [bump, setBump] = useState(0);

  function handle(v: number) {
    const mag = Math.floor(Math.log10(Math.max(1, v)));
    if (mag !== magRef.current) {
      magRef.current = mag;
      resumeAudio();
      Sound.tick();
      vibrate(6);
      setBump((b) => b + 1);
    }
    onChange(v);
  }

  return (
    <div className="w-full select-none">
      <div className="mb-4 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender">
          {t("slider.yourAnswer")}
        </div>
        <motion.div
          key={bump}
          animate={{ scale: [1, 1.14, 1] }}
          transition={{ duration: 0.28 }}
          className="mt-1 font-display text-3xl font-bold tabular-nums text-platinum sm:text-4xl"
        >
          {groupedViewsL(value, locale)}
        </motion.div>
        <div className="mt-0.5 text-sm font-medium text-lavender">
          ≈ {compactViewsL(value, locale)} {t("common.views")}
        </div>
      </div>

      <div className="relative px-1">
        {/* Piste */}
        <div className="pointer-events-none absolute left-1 right-1 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg,#EF233C,#D80032)",
            }}
          />
        </div>
        <input
          type="range"
          className="vg-range relative"
          min={0}
          max={STEPS}
          step={1}
          value={slider}
          disabled={disabled}
          aria-label={t("slider.aria")}
          aria-valuemin={1000}
          aria-valuemax={10_000_000_000}
          aria-valuenow={value}
          aria-valuetext={`${groupedViewsL(value, locale)} ${t("common.views")}`}
          onChange={(e) => handle(sliderToValue(Number(e.target.value)))}
        />
      </div>

      {/* Labels positionnés sur leurs vraies positions logarithmiques (7 décades). */}
      <div className="relative mt-2 h-4 px-1 text-[11px] font-medium text-lavender/70">
        <span className="absolute left-1">1 k</span>
        <span className="absolute -translate-x-1/2" style={{ left: "42.857%" }}>
          1 M
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: "85.714%" }}>
          1 Md
        </span>
        <span className="absolute right-1">10 Md</span>
      </div>
    </div>
  );
}
