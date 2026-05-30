import { StarHalf, Star as StarIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

export interface StarProps {
  filled?: boolean
  half?: boolean
  className?: string
}

export function Star({ filled, half, className }: StarProps) {
  const Icon = half ? StarHalf : StarIcon
  return (
    <Icon
      className={cn(
        'size-5',
        filled || half ? 'fill-current text-amber-400' : 'text-muted-foreground',
        className,
      )}
    />
  )
}
