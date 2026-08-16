export type QA = { q: string; a: string };

/**
 * FAQ visible (accordéon natif <details>, sans JS) + données structurées
 * FAQPage. Note 2026 : Google a retiré les rich results FAQ, mais le contenu
 * FAQ visible reste précieux pour les featured snippets, les AI Overviews et
 * les autres moteurs (Bing). Le JSON-LD est conservé (sans danger, utile hors
 * Google). Le vrai gain SEO ici, c'est le TEXTE visible répondant aux
 * questions réelles des internautes.
 */
export function Faq({ heading, items }: { heading: string; items: QA[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <h2 className="font-display text-2xl font-bold tracking-tight text-platinum sm:text-3xl">
        {heading}
      </h2>
      <div className="mt-6 divide-y-2 divide-platinum/10 border-y-2 border-platinum/10">
        {items.map((it) => (
          <details key={it.q} className="group py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold text-platinum marker:content-['']">
              {it.q}
              <span className="shrink-0 text-crimson transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed text-lavender">{it.a}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
