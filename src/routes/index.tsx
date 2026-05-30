import { Link, createFileRoute } from '@tanstack/react-router'

import { cn } from '#/lib/utils'
import { m } from '#/paraglide/messages'
import { getLocale } from '#/paraglide/runtime'
import { HandwriteText } from '#/components/ui/hand-write.tsx';
import { useLayoutEffect, useRef, useState } from 'react';
import { generateGoldenSquare, type GoldenSquare } from '#/components/ui/generate-golden.tsx';
import { Button } from '#/components/ui/button.tsx';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { CircleRing, CrossPattern, DiamondPattern, GridPattern, SquarePattern } from '#/components/ui/pattern.tsx';

export const Route = createFileRoute('/')({ component: Home })

const FONT_MAP = {
  th: "https://fonts.gstatic.com/s/sriracha/v16/0nkrC9D4IuYBgWcI9ObY.ttf",
  en: "https://fonts.gstatic.com/s/playwriteie/v11/fC1zPYtWYWnH0hvndYd6GCGWXCAxfsUebXFMyzioBpI.ttf"
}
function Home() {
  const locale = getLocale()
  const divRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [squares, setSquares] = useState<GoldenSquare[]>([])

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) return

    const update = () => {
      if (!divRef.current) return

      setSquares(
        generateGoldenSquare({
          divRef,
          count: 20,
        }),
      )
    }

    update()

    const observer = new ResizeObserver(update)

    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <div ref={containerRef} className="mx-auto flex min-h-screen w-full flex-col px-6 sm:px-10">
        <header className="reveal flex items-center justify-between border-b border-rule py-6">
          <span className="kicker text-ink-muted">{m.home_kicker()}</span>
          <div className="flex items-center gap-6">
            <Link
              to="/docs"
              className="kicker text-ink-muted transition-colors hover:text-ink"
            >
              {m.nav_docs()}
            </Link>
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
          </div>
        </header>

        <section className="relative flex flex-1 flex-col justify-center pb-24">
          <div ref={divRef} className="flex absolute border-collapse inset-0">
            {squares.map((s, index) => (
              <div
                key={index}
                aria-hidden
                className={cn("absolute border-rule", index === 0 && "border-r")}
                style={{
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                }}
              >
                {(index % 4 == 0 && index !== 0) ? <CrossPattern className={index > 4 ? "inset-0.5 rounded-sm" : undefined} /> : null}
                {index % 4 == 1 ? <GridPattern className={index > 4 ? "inset-0.5 rounded-sm" : undefined} /> : null}
                {index % 4 == 2 ? <CircleRing className={index > 4 ? "inset-0.5 rounded-sm" : undefined} /> : null}
                {index === 3 ? <SquarePattern className={index > 4 ? "inset-0.5 rounded-sm" : undefined} /> : null}
                {index % 4 == 3 ? <DiamondPattern className={index > 4 ? "inset-0.5 rounded-sm" : undefined} /> : null}
              </div>
            ))}
          </div>
          <div>
            <HandwriteText text={m.home_headline()} fontSize={64} fontUrl={FONT_MAP[locale]} className="reveal w-xl h-[12ch] -ml-4" />
          </div>
          <p
            className="reveal max-w-[32ch] text-lg text-ink-muted sm:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            {m.home_subline()}
          </p>
          <div className="reveal mt-3">
            <Button variant="outline" className="group border-2 rounded-full px-6">
              {m.nav_docs()}
              <span className="relative inline-flex size-4 items-center justify-center overflow-hidden">
                <ChevronRight className="absolute transition-all duration-300 group-hover:translate-x-4 group-hover:opacity-0" />
                <ArrowRight className="absolute -translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </Button>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-rule py-6">
          <span className="kicker text-ink-muted">{m.home_index()}</span>
          <span className="kicker text-ink-muted">Phutsakorn thunwattanakul</span>
        </footer>
      </div>
    </main>
  )
}
