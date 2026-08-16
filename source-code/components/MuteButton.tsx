"use client";

import { useEffect, useState } from "react";
import { isMuted, toggleMuted, resumeAudio } from "@/lib/sound";

export function MuteButton() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  return (
    <button
      onClick={() => {
        resumeAudio();
        setMutedState(toggleMuted());
      }}
      aria-label={muted ? "Activer le son" : "Couper le son"}
      title={muted ? "Activer le son" : "Couper le son"}
      className="flex h-9 w-9 items-center justify-center rounded-full glass text-base text-lavender transition-colors hover:text-platinum"
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
