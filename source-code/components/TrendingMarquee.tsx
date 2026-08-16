"use client";

import { useEffect, useState } from "react";
import { YTVideo } from "@/lib/types";

// Version basse résolution des miniatures YouTube (décoratif) → moins de bande passante.
function lightThumb(url: string): string {
  return url.replace(
    /\/(maxresdefault|sddefault|hqdefault|mqdefault|default)\.jpg/,
    "/mqdefault.jpg"
  );
}

// Une vignette. Quand sa vidéo change, l'image se ré-affiche en fondu (animate-fadein).
// Aucune translation → aucune saccade. Fond dégradé permanent + repli si l'image échoue.
function Tile({ video }: { video?: YTVideo }) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    setOk(true);
  }, [video?.id]);
  const showImg = Boolean(video?.thumbnailURL) && ok;
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-black/[0.06] bg-gradient-to-br from-strawberry/30 to-crimson/25 shadow-sm">
      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={video!.id}
          src={lightThumb(video!.thumbnailURL)}
          alt=""
          className="h-full w-full animate-fadein object-cover"
          decoding="async"
          onError={() => setOk(false)}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <span className="font-display text-xl font-bold text-white sm:text-2xl">?</span>
      </div>
    </div>
  );
}

const COUNT = 12; // 2 rangées de 6 sur grand écran

// « Mur de tendances » : une grille de miniatures dont UNE change en fondu à
// intervalle régulier. Pas de défilement → fluide et stable sur tous les navigateurs.
export function TrendingMarquee() {
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [slots, setSlots] = useState<number[]>([]);

  // Chargement (avec quelques tentatives si l'API renvoie vide).
  useEffect(() => {
    let alive = true;
    async function load(attempt = 0) {
      try {
        const r = await fetch("/api/videos?count=20");
        const d = await r.json();
        if (alive && Array.isArray(d.videos) && d.videos.length) {
          setVideos(d.videos);
        } else if (alive && attempt < 2) {
          setTimeout(() => load(attempt + 1), 1500);
        }
      } catch {
        if (alive && attempt < 2) setTimeout(() => load(attempt + 1), 1500);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  // Remplissage initial des cases.
  useEffect(() => {
    if (!videos.length) return;
    setSlots(Array.from({ length: COUNT }, (_, i) => i % videos.length));
  }, [videos]);

  // Toutes les 1,7 s : une case prend une nouvelle vidéo (pas déjà affichée) → fondu.
  useEffect(() => {
    if (videos.length < 2 || slots.length === 0) return;
    const id = setInterval(() => {
      setSlots((cur) => {
        const next = [...cur];
        const slot = Math.floor(Math.random() * next.length);
        const shown = new Set(next);
        let v = Math.floor(Math.random() * videos.length);
        let tries = 0;
        while (shown.has(v) && tries < 12) {
          v = Math.floor(Math.random() * videos.length);
          tries++;
        }
        next[slot] = v;
        return next;
      });
    }, 1700);
    return () => clearInterval(id);
  }, [videos, slots.length]);

  const display = slots.length ? slots : Array.from({ length: COUNT }, () => -1);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3 px-5 sm:grid-cols-4 lg:grid-cols-6">
      {display.map((vi, i) => (
        <Tile key={i} video={vi >= 0 && videos[vi] ? videos[vi] : undefined} />
      ))}
    </div>
  );
}
