import { Link, createFileRoute } from '@tanstack/react-router'

import { PlaywriteTegakiText } from '#/components/ui/playwrite-tegaki'
import { cn } from '#/lib/utils'
import { m } from '#/paraglide/messages'
import { getLocale, setLocale } from '#/paraglide/runtime'
import { ArrowDown, ArrowUpRight, Github } from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'

export const Route = createFileRoute('/')({ component: Home })

const GITHUB_URL = 'https://github.com/cinnamonjs'

function Home() {
  const locale = getLocale()
  const storyRef = useRef<HTMLElement>(null)
  const rawProgress = useScrollProgress(storyRef)
  const progress = paceScroll(rawProgress)

  const backgroundTwoProgress = range(progress, 0.06, 0.92)
  const indexTwoProgress = range(rawProgress, 0.5, 1)
  const heroExitProgress = range(rawProgress, 0.25, 0.72)
  const mainBackgroundExitProgress = range(rawProgress, 0.64, 0.9)
  const indexTwoContentProgress = range(rawProgress, 0.58, 0.82)
  const backgroundTwoY = (1 - easeInOut(backgroundTwoProgress)) * 100
  const indexTwoY = (1 - easeInOut(indexTwoProgress)) * 100

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#04110f] text-paper">
      <section
        ref={storyRef}
        className="relative h-[240vh]"
        aria-label="Scroll from Index 01 to Index 02"
      >
        <div
          id="about"
          className="pointer-events-none absolute top-1/2 h-px w-px scroll-mt-0"
          aria-hidden="true"
        />

        <div className="sticky top-0 h-screen overflow-hidden bg-[#04110f]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[4%] z-0 bg-[url('/assets/background.png')] bg-cover bg-center bg-no-repeat will-change-transform"
            style={{
              transform: `translate3d(0, ${-mainBackgroundExitProgress * 8}%, 0) scale(1.03)`,
              opacity: 1 - mainBackgroundExitProgress,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] bg-[#08150e]/35"
            style={{ opacity: 1 - mainBackgroundExitProgress * 0.65 }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2] bg-[url('/assets/background-2.png')] bg-cover bg-center bg-no-repeat will-change-transform"
            style={{
              transform: `translate3d(0, ${backgroundTwoY}%, 0) scale(1.04)`,
              filter: `brightness(${1 - backgroundTwoProgress * 0.2}) saturate(${1 - backgroundTwoProgress * 0.12})`,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(to_bottom,transparent_0%,rgb(4_17_15_/_0.12)_58%,rgb(4_17_15_/_0.55)_100%)] will-change-transform"
            style={{
              transform: `translate3d(0, ${backgroundTwoY}%, 0)`,
              opacity: backgroundTwoProgress,
            }}
          />

          <div className="absolute inset-0 z-10 mx-auto flex w-full flex-col px-6 will-change-transform sm:px-10">
            <header
              className={cn(
                'reveal relative z-10 isolate mt-4 flex min-h-10 items-center justify-between overflow-hidden rounded-[1.15rem] bg-[rgba(16,33,23,0.52)] py-0.5 pl-4 pr-1.5 font-sora shadow-[0_1rem_2rem_rgba(3,18,10,0.25),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150',
                'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[rgba(255,255,255,0.035)] before:content-[""]',
                '[background-image:radial-gradient(circle_at_98%_-16%,rgb(255_255_255_/_30%)_0,rgb(255_255_255_/_12%)_18%,transparent_42%),radial-gradient(circle_at_74%_120%,rgb(255_255_255_/_7%)_0,transparent_34%),repeating-linear-gradient(115deg,rgb(255_255_255_/_3.5%)_0_1px,transparent_1px_3px),repeating-linear-gradient(25deg,rgb(0_0_0_/_9%)_0_1px,transparent_1px_4px)]',
                '[background-size:cover,cover,4px_4px,7px_7px] [background-blend-mode:screen,screen,soft-light,multiply]',
              )}
            >
              <Link
                to="/"
                className="relative z-[2] shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-paper opacity-90 transition-colors hover:opacity-100 max-[480px]:max-w-[8.5rem] max-[480px]:truncate max-[480px]:text-[0.62rem]"
              >
                {m.home_kicker()}
              </Link>
              <nav
                aria-label="Primary navigation"
                className="relative z-[2] flex items-center gap-1.5 max-[480px]:gap-0.5"
              >
                <Link
                  to="/docs"
                  className="rounded-full px-2.5 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-paper opacity-90 transition-colors hover:bg-[rgb(255_255_255_/_0.1)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/50 max-[480px]:px-1.5 max-[480px]:text-[0.56rem]"
                >
                  {m.nav_docs()}
                </Link>
                <span
                  className="flex items-center gap-px rounded-full border border-[rgb(255_255_255_/_0.15)] bg-[rgb(0_0_0_/_0.2)] p-0.5"
                  aria-label={m.language_label()}
                >
                  <button
                    type="button"
                    className={cn(
                      'min-w-8 rounded-full border border-transparent px-2 py-1 text-[0.56rem] font-bold tracking-[0.12em] text-paper opacity-90 transition-colors hover:border-[rgb(255_255_255_/_0.25)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/50 max-[480px]:min-w-7 max-[480px]:px-1.5',
                      locale === 'en' && 'bg-paper text-ink',
                    )}
                    aria-pressed={locale === 'en'}
                    onClick={() => setLocale('en')}
                  >
                    EN
                  </button>
                  <span
                    className="select-none text-[0.56rem] text-paper/30"
                    aria-hidden="true"
                  >
                    /
                  </span>
                  <button
                    type="button"
                    className={cn(
                      'min-w-8 rounded-full border border-transparent px-2 py-1 text-[0.56rem] font-bold tracking-[0.12em] text-paper opacity-90 transition-colors hover:border-[rgb(255_255_255_/_0.25)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/50 max-[480px]:min-w-7 max-[480px]:px-1.5',
                      locale === 'th' && 'bg-paper text-ink',
                    )}
                    aria-pressed={locale === 'th'}
                    onClick={() => setLocale('th')}
                  >
                    TH
                  </button>
                </span>
              </nav>
            </header>

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

            <div className="flex items-center justify-between border-t border-white/20 py-5 font-sora text-paper/65">
              <a
                href="#about"
                className="mx-auto hidden items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-white sm:flex"
              >
                Scroll to explore{' '}
                <ArrowDown aria-hidden="true" className="size-3.5" />
              </a>
            </div>
          </div>

          <section
            className="absolute inset-0 z-20 bg-[#04110f] will-change-transform"
            aria-labelledby="about-heading"
            style={{
              transform: `translate3d(0, ${indexTwoY}%, 0)`,
              boxShadow:
                indexTwoProgress > 0
                  ? '0 -2rem 5rem rgba(2, 10, 8, 0.34)'
                  : 'none',
            }}
          >
            <div
              className="mx-auto flex min-h-screen w-full max-w-384 flex-col justify-between px-6 py-8 will-change-transform sm:px-10 sm:py-10 lg:px-16"
              style={{
                transform: `translate3d(0, ${(1 - indexTwoContentProgress) * 24}px, 0)`,
                opacity: 0.35 + indexTwoContentProgress * 0.65,
              }}
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-5 font-sora text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/55">
                <span>Index 02</span>
                <span>Personal profile</span>
              </div>

              <div className="grid items-end gap-12 pb-10 pt-16 md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-20">
                <div>
                  <p className="mb-6 font-sora text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#b8c8b1]/65">
                    About the maker
                  </p>
                  <h2
                    id="about-heading"
                    className="max-w-[12ch] text-balance font-sora text-[clamp(2.8rem,6vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white"
                  >
                    Interfaces that feel calm, clear, and alive.
                  </h2>
                  <p className="mt-8 max-w-[48ch] font-sora text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                    Phutsakorn Thunwattanakul is a frontend developer crafting
                    modern UI/UX and polished digital products.
                  </p>
                </div>

                <div className="font-sora">
                  <dl className="divide-y divide-white/15 border-y border-white/15">
                    <ProfileRow label="Role" value="Frontend Developer" />
                    <ProfileRow
                      label="Focus"
                      value="UI/UX · Design systems · Motion"
                    />
                    <ProfileRow
                      label="Toolkit"
                      value="React · TypeScript · Tailwind"
                    />
                  </dl>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-8 flex items-center justify-between rounded-[1.15rem] bg-white px-5 py-4 text-[#07110b] transition-colors hover:bg-[#dbe5d7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#04110f]"
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.18em]">
                      View GitHub profile
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-white/15 pt-5 font-sora text-white/45">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em]">
                  Selected profile
                </span>
                <span className="font-display text-2xl text-white/80 sm:text-3xl">
                  Phutsakorn
                </span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function range(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)))
}

function paceScroll(value: number) {
  return value <= 0.5 ? value * 1.3 : 0.65 + (value - 0.5) * 0.7
}

function easeInOut(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2
}

function useScrollProgress(sectionRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current
        if (!section) return
        const rect = section.getBoundingClientRect()
        const scrollDistance = Math.max(1, rect.height - window.innerHeight)
        const nextProgress = -rect.top / scrollDistance
        setProgress(Math.min(1, Math.max(0, nextProgress)))
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [sectionRef])

  return progress
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-4 py-5">
      <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/35">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-white/75">{value}</dd>
    </div>
  )
}
