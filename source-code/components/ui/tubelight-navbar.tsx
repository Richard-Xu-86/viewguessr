"use client";

// Barre de navigation « tubelight » (inspirée du composant 21st.dev
// ayushmxxn/tubelight-navbar), adaptée à ViewGuessr : Next.js Link,
// framer-motion, couleurs du thème et icônes SVG maison (aucune dépendance
// lucide-react ajoutée). L'onglet actif est surligné par une pastille animée
// surmontée d'un petit « tube » lumineux qui glisse d'un onglet à l'autre.

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icons";

export interface TubelightNavItem {
  name: string;
  /** "/route" ou "#ancre". */
  url: string;
  /** Nom d'icône du composant Icon maison (affichée en version mobile). */
  icon: string;
}

export function NavBar({
  items,
  className = "",
}: {
  items: TubelightNavItem[];
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "");

  // Surlignage automatique selon la section visible (pour les liens d'ancre
  // #comment / #modes / #offres). Les liens de page (/defi…) ne sont surlignés
  // qu'au clic, le temps de la navigation.
  useEffect(() => {
    const anchors = items.filter((i) => i.url.startsWith("#"));
    if (anchors.length === 0 || typeof window === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const it = anchors.find((a) => a.url === `#${e.target.id}`);
            if (it) setActiveTab(it.name);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const a of anchors) {
      const el = document.getElementById(a.url.slice(1));
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [items]);

  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-black/[0.06] bg-white/85 p-1.5 shadow-[0_4px_14px_-6px_rgba(20,23,31,0.18)] backdrop-blur-md ${className}`}
    >
      {items.map((item) => {
        const isActive = activeTab === item.name;
        return (
          <Link
            key={item.name}
            href={item.url}
            onClick={() => setActiveTab(item.name)}
            className={`relative cursor-pointer whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
              isActive ? "text-strawberry" : "text-lavender hover:text-platinum"
            }`}
          >
            <span className="hidden lg:inline">{item.name}</span>
            <span className="lg:hidden">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            {isActive && (
              <motion.div
                layoutId="tubelight"
                className="absolute inset-0 -z-10 rounded-full bg-strawberry/10"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* « Tube » lumineux au-dessus de l'onglet actif. */}
                <div className="absolute -top-1.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-strawberry">
                  <div className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-strawberry/30 blur-md" />
                  <div className="absolute -top-1 h-6 w-8 rounded-full bg-strawberry/20 blur-md" />
                  <div className="absolute left-2 top-0 h-4 w-4 rounded-full bg-strawberry/20 blur-sm" />
                </div>
              </motion.div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
