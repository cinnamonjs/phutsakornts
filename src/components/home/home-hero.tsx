import { ArrowDown, ArrowUpRight, Github } from 'lucide-react'

import { PlaywriteTegakiText } from '#/components/ui/playwrite-tegaki'
import { m } from '#/paraglide/messages'
import { GITHUB_URL } from './constants'

export function HomeHero({ heroExitProgress }: { heroExitProgress: number }) {
  return (
    <div
      className="relative flex flex-1 items-center justify-center px-2 py-20 text-center will-change-transform sm:py-28"
      style={{
        transform: `translate3d(0, ${-heroExitProgress * 48}px, 0)`,
        opacity: 1 - heroExitProgress,
      }}
    >
      <div
        className="reveal flex max-w-[95vw] flex-col items-center"
        style={{ animationDelay: '120ms' }}
      >
        <p className="mb-6 font-sora text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-paper/70">
          {m.home_index()}
        </p>
        <h1 className="font-display max-w-none whitespace-nowrap text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.94] tracking-[-0.06em] text-paper drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)] max-[640px]:max-w-[12ch] max-[640px]:whitespace-normal">
          <PlaywriteTegakiText
            text={m.home_headline()}
            className="font-display"
          />
        </h1>
        <p className="mt-8 max-w-[35ch] text-balance font-sora text-lg leading-relaxed text-paper/80 drop-shadow-[0_2px_14px_rgba(0,0,0,0.3)] sm:text-xl">
          {m.home_subline()}
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-3 font-sora text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-paper backdrop-blur-md transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <Github aria-hidden="true" className="size-4" />
          GitHub
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
      </div>
    </div>
  )
}

export function HomeScrollPrompt() {
  return (
    <div className="flex items-center justify-between border-t border-white/20 py-5 font-sora text-paper/65">
      <a
        href="#about"
        className="mx-auto hidden items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-white sm:flex"
      >
        Scroll to explore <ArrowDown aria-hidden="true" className="size-3.5" />
      </a>
    </div>
  )
}
