import { createFileRoute, notFound } from '@tanstack/react-router'

import { HomePage } from '#/components/home/home-page'
import { locales } from '#/paraglide/runtime'

export const Route = createFileRoute('/$locale')({
  beforeLoad: ({ params }) => {
    const locale = params.locale as (typeof locales)[number]

    if (!locales.includes(locale)) {
      throw notFound()
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  },
  component: HomePage,
})
