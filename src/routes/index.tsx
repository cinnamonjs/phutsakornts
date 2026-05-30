import { createFileRoute } from '@tanstack/react-router'

import { cn } from '#/lib/utils'
import { m } from '#/paraglide/messages'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const locale = getLocale()

  return (
    <main className="specimen-grid relative min-h-screen bg-paper text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-6 sm:px-10">
        <header className="reveal flex items-center justify-between border-b border-rule py-6">
          <span className="kicker text-ink-muted">{m.home_kicker()}</span>
          <span className="kicker flex items-center gap-2.5">
            <span
              className={cn(locale === 'en' ? 'text-ink' : 'text-ink-muted')}
            >
              EN
            </span>
            <span className="text-rule-strong">/</span>
            <span
              className={cn(locale === 'th' ? 'text-ink' : 'text-ink-muted')}
            >
              TH
            </span>
          </span>
        </header>

        <section className="relative flex flex-1 flex-col justify-center py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-[64%] hidden w-px bg-rule lg:block"
          />
          <h1
            className="reveal max-w-[14ch] text-[clamp(3.5rem,14vw,12.5rem)] font-extrabold leading-[0.84] tracking-[-0.035em]"
            style={{ animationDelay: '80ms' }}
          >
            {m.home_headline()}
          </h1>
          <p
            className="reveal mt-10 max-w-[32ch] text-lg leading-relaxed text-ink-muted sm:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            {m.home_subline()}
          </p>
        </section>

        <footer className="flex items-center justify-between border-t border-rule py-6">
          <span className="kicker text-ink-muted">{m.home_index()}</span>
          <span className="kicker text-ink-muted">Hanken Grotesk</span>
        </footer>
      </div>
    </main>
  )
}
