import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

import { m } from '#/paraglide/messages'

export const Route = createFileRoute('/docs')({ component: DocsLayout })

function DocsLayout() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto w-full max-w-330 px-6 sm:px-10">
        <header className="flex items-center justify-between border-b border-rule py-6">
          <Link
            to="/"
            className="kicker text-ink-muted transition-colors hover:text-ink"
          >
            {m.home_index()}
          </Link>
          <span className="kicker">{m.docs_kicker()}</span>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
