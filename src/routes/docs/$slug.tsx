import { Link, createFileRoute } from '@tanstack/react-router'

import { CodeBlock } from '#/components/docs/code-block'
import { categoryLabel, findEntry } from '#/components/docs/registry'
import { UsageTabs } from '#/components/docs/usage-tabs'
import { cn } from '#/lib/utils'
import { m } from '#/paraglide/messages'

export const Route = createFileRoute('/docs/$slug')({ component: DocsDetail })

function DocsDetail() {
  const { slug } = Route.useParams()
  const entry = findEntry(slug)

  if (!entry) {
    return (
      <main className="py-24">
        <Link
          to="/docs"
          className="kicker text-ink-muted transition-colors hover:text-ink"
        >
          {m.docs_back()}
        </Link>
        <p className="mt-6 text-2xl">{slug}</p>
      </main>
    )
  }

  return (
    <main className="py-12">
      <Link
        to="/docs"
        className="kicker text-ink-muted transition-colors hover:text-ink"
      >
        {m.docs_back()}
      </Link>

      <header className="reveal mt-6 border-b border-rule pb-8">
        <div className="kicker text-ink-muted">
          {categoryLabel(entry.category)()}
        </div>
        <h1 className="mt-3 text-5xl font-extrabold tracking-[-0.03em]">
          {entry.name}
        </h1>
        <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-ink-muted">
          {entry.description()}
        </p>
      </header>

      {entry.variants?.length ? (
        <section className="py-10">
          <h2 className="kicker text-ink-muted">{m.docs_variants()}</h2>
          <div
            className={cn(
              'mt-6 grid grid-cols-1 gap-px bg-rule',
              !entry.variants.some((variant) => variant.code) &&
                'md:grid-cols-2',
            )}
          >
            {entry.variants.map((variant) => (
              <div key={variant.name} className="bg-paper p-6">
                <div className="kicker text-ink-muted">{variant.name}</div>
                {variant.code ? (
                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="flex min-h-32 items-center justify-center overflow-auto rounded-md border border-rule p-6">
                      {variant.node}
                    </div>
                    <CodeBlock
                      code={variant.code}
                      filename={variant.codeFile}
                    />
                  </div>
                ) : (
                  <div className="mt-6 flex min-h-24 items-center justify-center">
                    {variant.node}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {entry.dependencies?.length ? (
        <section className="border-t border-rule py-10">
          <h2 className="kicker text-ink-muted">{m.docs_dependencies()}</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {entry.dependencies.map((dep) => (
              <li
                key={dep}
                className="border border-rule bg-secondary px-3 py-1 font-mono text-sm text-ink-muted"
              >
                {dep}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border-t border-rule py-10">
        <h2 className="kicker text-ink-muted">{m.docs_usage()}</h2>
        <UsageTabs
          install={entry.install}
          usage={entry.usage}
          sources={entry.sources}
        />
      </section>
    </main>
  )
}
