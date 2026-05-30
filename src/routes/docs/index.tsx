import { Link, createFileRoute } from '@tanstack/react-router'

import {
  categories,
  categoryLabel,
  docsByCategory,
} from '#/components/docs/registry'
import { m } from '#/paraglide/messages'

export const Route = createFileRoute('/docs/')({ component: DocsIndex })

function DocsIndex() {
  return (
    <main>
      <section className="reveal py-16 sm:py-24">
        <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.03em]">
          {m.docs_headline()}
        </h1>
        <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-muted">
          {m.docs_subline()}
        </p>
      </section>

      {categories.map((category) => (
        <section key={category} className="border-t border-rule py-12">
          <h2 className="kicker text-ink-muted">{categoryLabel(category)()}</h2>
          <div className="mt-6 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {docsByCategory(category).map((entry) => (
              <Link
                key={entry.slug}
                to="/docs/$slug"
                params={{ slug: entry.slug }}
                className="group bg-paper p-6 transition-colors hover:bg-secondary"
              >
                <div className="kicker text-ink-muted">{entry.slug}</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight">
                  {entry.name}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {entry.description()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className="flex items-center justify-between border-t border-rule py-6">
        <span className="kicker text-ink-muted">{m.docs_kicker()}</span>
        <span className="kicker text-ink-muted">@phutsakorn/ui</span>
      </footer>
    </main>
  )
}
