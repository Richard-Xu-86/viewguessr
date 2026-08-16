"use client";

import { Aurora } from "@/components/Aurora";
import { RoundGame } from "@/components/game/RoundGame";
import { DEFAULT_ROUNDS } from "@/lib/scoring";
import { useT } from "@/lib/i18n";

export default function SoloPage() {
  const t = useT();
  return (
    <>
      <Aurora />
      <RoundGame
        rounds={DEFAULT_ROUNDS}
        title={t("title.solo")}
        statsKey="best_general"
      />
    </>
  );
}
