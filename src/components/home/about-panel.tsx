import { ArrowUpRight } from 'lucide-react'

import { GITHUB_URL } from './constants'

type AboutPanelProps = {
  indexTwoContentProgress: number
  indexTwoProgress: number
  indexTwoY: number
}

export function AboutPanel({
  indexTwoContentProgress,
  indexTwoProgress,
  indexTwoY,
}: AboutPanelProps) {
  return (
    <section
      className="absolute inset-0 z-20 bg-[#04110f] will-change-transform"
      aria-labelledby="about-heading"
      style={{
        transform: `translate3d(0, ${indexTwoY}%, 0)`,
        boxShadow:
          indexTwoProgress > 0 ? '0 -2rem 5rem rgba(2, 10, 8, 0.34)' : 'none',
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
              Phutsakorn Thunwattanakul is a frontend developer crafting modern
              UI/UX and polished digital products.
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
  )
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
