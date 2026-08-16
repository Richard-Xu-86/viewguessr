import Link from "next/link";

type Locale = "fr" | "en";

/**
 * Coquille serveur pour les pages de contenu SEO (guides, pages éditoriales).
 * 100 % rendue côté serveur → entièrement indexable, sans dépendance au
 * système i18n client. La DA « print » du site est réutilisée (papier crème,
 * encre, ombres dures, stickers).
 */
export function ContentShell({
  locale,
  altHref,
  children,
}: {
  locale: Locale;
  /** URL de la même page dans l'autre langue (pour le sélecteur FR/EN). */
  altHref?: string;
  children: React.ReactNode;
}) {
  const fr = locale === "fr";
  const homeHref = fr ? "/" : "/en";
  const playHref = "/play/solo";
  const multiHref = "/multiplayer";

  const t = {
    play: fr ? "Jouer" : "Play",
    solo: fr ? "Solo" : "Solo",
    multi: fr ? "Multijoueur" : "Multiplayer",
    guides: fr ? "Guides" : "Guides",
    betweenFriends: fr ? "Jeux entre potes" : "Games with friends",
    guessr: fr ? "C'est quoi un Guessr ?" : "What is a Guessr?",
    legal: fr ? "Mentions légales" : "Legal",
    privacy: fr ? "Confidentialité" : "Privacy",
    tagline: fr
      ? "Le jeu où tu devines les vues des vraies vidéos YouTube. Solo et multijoueur, sans inscription."
      : "The game where you guess the real view counts of YouTube videos. Solo and multiplayer, no sign-up.",
    rights: fr ? "Tous droits réservés." : "All rights reserved.",
    altLabel: fr ? "EN" : "FR",
  };

  return (
    <main className="relative min-h-dvh">
      {/* Fond papier crème à pointillés (rendu serveur, sans JS). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(rgba(21,23,31,0.06) 1px, transparent 1px) 0 0 / 22px 22px, #FAF7F0",
        }}
      />

      {/* En-tête */}
      <header className="sticky top-0 z-40 border-b-2 border-platinum/10 bg-[#FAF7F0]/95">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href={homeHref} className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="ViewGuessr"
              width={34}
              height={34}
              className="select-none"
              style={{ width: 34, height: 34 }}
            />
            <span className="font-display text-xl font-bold tracking-tight text-platinum">
              View<span className="text-strawberry">Guessr</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            {altHref && (
              <Link
                href={altHref}
                hrefLang={fr ? "en" : "fr"}
                className="rounded-lg border-2 border-platinum px-2.5 py-1 text-xs font-bold text-platinum hover:bg-white"
              >
                {t.altLabel}
              </Link>
            )}
            <Link href={playHref} className="btn-ink px-5 py-2 text-sm">
              {t.play}
            </Link>
          </div>
        </div>
      </header>

      {children}

      {/* Pied de page */}
      <footer className="border-t-2 border-platinum/10 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Link href={homeHref} className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="ViewGuessr"
                  width={30}
                  height={30}
                  style={{ width: 30, height: 30 }}
                />
                <span className="font-display text-lg font-bold tracking-tight text-platinum">
                  View<span className="text-strawberry">Guessr</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-lavender">
                {t.tagline}
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold text-platinum">{t.play}</div>
              <ul className="mt-3 space-y-2 text-sm text-lavender">
                <li>
                  <Link href={playHref} className="hover:text-platinum">
                    {t.solo}
                  </Link>
                </li>
                <li>
                  <Link href={multiHref} className="hover:text-platinum">
                    {t.multi}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-platinum">{t.guides}</div>
              <ul className="mt-3 space-y-2 text-sm text-lavender">
                <li>
                  <Link
                    href={fr ? "/jeux-entre-potes" : "/en/games-to-play-with-friends"}
                    className="hover:text-platinum"
                  >
                    {t.betweenFriends}
                  </Link>
                </li>
                <li>
                  <Link
                    href={fr ? "/c-est-quoi-un-guessr" : "/en/guessr-games"}
                    className="hover:text-platinum"
                  >
                    {t.guessr}
                  </Link>
                </li>
                <li>
                  <Link href="/mentions-legales" className="hover:text-platinum">
                    {t.legal}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-platinum/10 pt-6">
            <p className="text-xs text-lavender/70">
              © {new Date().getFullYear()} PENRA · ViewGuessr. {t.rights}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
