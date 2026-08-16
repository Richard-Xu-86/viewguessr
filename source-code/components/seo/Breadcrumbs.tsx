import Link from "next/link";

const SITE_URL = "https://view-guessr.com";

export type Crumb = { name: string; href: string };

/**
 * Fil d'Ariane visible + données structurées BreadcrumbList (JSON-LD).
 * Les rich results « breadcrumb » sont toujours supportés par Google (2026),
 * contrairement aux FAQ/HowTo — ça aide l'affichage de l'URL dans les SERP.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-3xl px-5 pt-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-lavender">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.href} className="flex items-center gap-1.5">
              {last ? (
                <span className="text-platinum" aria-current="page">
                  {it.name}
                </span>
              ) : (
                <>
                  <Link href={it.href} className="hover:text-platinum">
                    {it.name}
                  </Link>
                  <span aria-hidden className="text-lavender/50">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
