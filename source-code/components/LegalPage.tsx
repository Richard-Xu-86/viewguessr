import Link from "next/link";
import { ReactNode } from "react";
import { Aurora } from "@/components/Aurora";
import { Logo, Wordmark } from "@/components/Logo";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Aurora />
      <main className="relative min-h-dvh">
        <header className="border-b border-black/[0.06] bg-ink/95">
          <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={34} />
              <Wordmark className="text-lg text-platinum" />
            </Link>
            <Link href="/" className="text-sm font-medium text-lavender hover:text-platinum">
              ← Accueil
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 py-12">
          <h1 className="font-display text-4xl font-bold text-platinum">{title}</h1>
          {updated && (
            <p className="mt-2 text-sm text-lavender">Dernière mise à jour : {updated}</p>
          )}
          <div className="legal mt-8 space-y-6 text-[15px] leading-relaxed text-lavender">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-display text-xl font-bold text-platinum">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
