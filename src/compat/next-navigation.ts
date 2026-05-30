import { useRouter as useTanstackRouter, useRouterState } from '@tanstack/react-router'

type NavigateFn = (opts: { to: string; replace?: boolean }) => void

export function useRouter() {
  const router = useTanstackRouter()
  const navigate = router.navigate as unknown as NavigateFn
  return {
    push: (href: string) => navigate({ to: href }),
    replace: (href: string) => navigate({ to: href, replace: true }),
    back: () => router.history.back(),
    forward: () => router.history.forward(),
    refresh: () => router.invalidate(),
    prefetch: () => undefined,
  }
}

export function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname })
}

export function useSearchParams() {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr })
  return new URLSearchParams(searchStr)
}
