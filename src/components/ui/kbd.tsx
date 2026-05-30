import type { ReactNode } from 'react'

import { cn } from '#/lib/utils'

export interface KbdProps {
  children: ReactNode
  className?: string
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[0.7rem] text-muted-foreground',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
