import type { ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '../lib/utils'

const tag = cva(
  'inline-flex items-center gap-1.5 rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        soft: 'bg-secondary text-secondary-foreground',
        solid: 'bg-primary text-primary-foreground',
        outline: 'border border-rule text-ink',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'soft',
      size: 'md',
    },
  },
)

export interface TagProps extends VariantProps<typeof tag> {
  children: ReactNode
  onRemove?: () => void
  removeLabel?: string
  className?: string
}

export function Tag({
  children,
  variant,
  size,
  onRemove,
  removeLabel = 'Remove',
  className,
}: TagProps) {
  return (
    <span className={cn(tag({ variant, size }), className)}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="-mr-0.5 rounded-sm opacity-60 transition-opacity hover:opacity-100"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  )
}
