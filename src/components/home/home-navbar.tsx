import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { m } from '#/paraglide/messages'
import { setLocale } from '#/paraglide/runtime'

export function HomeNavbar({ locale }: { locale: string }) {
  return (
    <header
      className={cn(
        'reveal relative z-10 isolate mt-4 flex min-h-10 items-center justify-between overflow-hidden rounded-[1.15rem] bg-[rgba(16,33,23,0.52)] py-0.5 pl-4 pr-1.5 font-sora shadow-[0_1rem_2rem_rgba(3,18,10,0.25),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150',
        'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[rgba(255,255,255,0.035)] before:content-[""]',
        'bg-[radial-gradient(circle_at_98%_-16%,rgb(255_255_255/30%)_0,rgb(255_255_255/12%)_18%,transparent_42%),radial-gradient(circle_at_74%_120%,rgb(255_255_255/7%)_0,transparent_34%),repeating-linear-gradient(115deg,rgb(255_255_255/3.5%)_0_1px,transparent_1px_3px),repeating-linear-gradient(25deg,rgb(0_0_0/9%)_0_1px,transparent_1px_4px)]',
        'bg-size-[cover,cover,4px_4px,7px_7px] [background-blend-mode:screen,screen,soft-light,multiply]',
      )}
    >
      <Link
        to="/"
        className="relative z-2 shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-paper opacity-90 transition-colors hover:opacity-100 max-[480px]:max-w-34 max-[480px]:truncate max-[480px]:text-[0.62rem]"
      >
        {m.home_kicker()}
      </Link>
      <nav
        aria-label="Primary navigation"
        className="relative z-2 flex items-center gap-1.5 max-[480px]:gap-0.5"
      >
        <span
          className="flex items-center gap-px rounded-full border border-[rgb(255_255_255/0.15)] bg-[rgb(0_0_0/0.2)] p-0.5"
          aria-label={m.language_label()}
        >
          <LanguageButton
            language="en"
            locale={locale}
            onSelect={() => setLocale('en')}
          />
          <span
            className="select-none text-[0.56rem] text-paper/30"
            aria-hidden="true"
          >
            /
          </span>
          <LanguageButton
            language="th"
            locale={locale}
            onSelect={() => setLocale('th')}
          />
        </span>
      </nav>
    </header>
  )
}

function LanguageButton({
  language,
  locale,
  onSelect,
}: {
  language: 'en' | 'th'
  locale: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'min-w-8 rounded-full border border-transparent px-2 py-1 text-[0.56rem] font-bold tracking-[0.12em] text-paper opacity-90 transition-colors hover:border-[rgb(255_255_255/0.25)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/50 max-[480px]:min-w-7 max-[480px]:px-1.5',
        locale === language && 'bg-paper text-ink',
      )}
      aria-pressed={locale === language}
      onClick={onSelect}
    >
      {language.toUpperCase()}
    </button>
  )
}
