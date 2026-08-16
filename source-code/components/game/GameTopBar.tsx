"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MuteButton } from "@/components/MuteButton";
import { LanguageToggle } from "@/components/LanguageToggle";
import { StreakBadge } from "@/components/StreakBadge";
import { useT } from "@/lib/i18n";

export function GameTopBar({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="sticky top-0 z-30 border-b-2 border-platinum/10 bg-ink/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-lavender transition-colors hover:text-platinum"
          aria-label={t("common.backToHome")}
        >
          <Logo size={30} />
          <span className="hidden sm:inline">{title}</span>
        </Link>
        <div className="flex items-center gap-3">
          {right}
          <StreakBadge className="hidden sm:flex" />
          <LanguageToggle />
          <MuteButton />
        </div>
      </div>
    </div>
  );
}
