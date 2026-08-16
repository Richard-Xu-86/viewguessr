"use client";

import { useEffect, useState } from "react";
import { YTVideo } from "@/lib/types";
import { TiltCard } from "./TiltCard";

// Aperçu façon "vraie manche" dans le hero : miniature mystère + barre de réponse.
// DA « print » : bordure encre + ombre dure, sticker incliné, zéro flou.
export function HeroPreview() {
  const [video, setVideo] = useState<YTVideo | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/videos?count=1")
      .then((r) => r.json())
      .then((d) => {
        if (alive && d.videos?.[0]) setVideo(d.videos[0]);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="relative [perspective:1200px]">
      {/* Sticker au-dessus de la carte */}
      <span className="sticker absolute -top-3 left-6 z-10 -rotate-3 bg-white">
        Manche 1/5
      </span>

      <TiltCard className="rounded-2xl" max={7}>
        <div className="card-ink rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-sm font-bold text-platinum">
              <span className="h-2.5 w-2.5 animate-pulseGlow rounded-full bg-strawberry" />
              En direct
            </div>
            <span className="rounded-md border border-platinum/20 bg-[#FAF7F0] px-2.5 py-1 text-xs font-bold text-platinum">
              Tendances YouTube
            </span>
          </div>

          {/* Miniature mystère */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-platinum bg-black/60">
            {video?.thumbnailURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={video.thumbnailURL}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-strawberry/40 to-crimson/30" />
            )}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-5xl font-bold text-white drop-shadow-lg">
                ?
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/70">
                combien de vues ?
              </span>
            </div>
          </div>

          {/* Barre de réponse (statique, décorative) */}
          <div className="mt-4 rounded-xl border-2 border-platinum/15 bg-[#FAF7F0] p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-lavender">
              <span>1 k</span>
              <span className="font-display text-base font-bold text-platinum">
                1,2 M
              </span>
              <span>1 Md</span>
            </div>
            <div className="relative h-2 rounded-full border border-platinum/20 bg-white">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-strawberry to-crimson"
                style={{ width: "46%" }}
              />
              <div
                className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-platinum bg-white shadow-hard-sm"
                style={{ left: "46%", marginLeft: -12 }}
              />
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
