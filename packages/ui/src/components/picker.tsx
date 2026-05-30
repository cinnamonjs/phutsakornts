import { cva } from 'class-variance-authority'

import { cn } from '../lib/utils'

export interface PickerOption {
  value: string
  label: string
}

const item = cva(
  'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      active: {
        true: 'bg-paper text-ink shadow-sm',
        false: 'text-ink-muted hover:text-ink',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

export interface PickerProps {
  options: PickerOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function Picker({ options, value, onChange, className }: PickerProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex gap-1 rounded-md border border-rule bg-secondary p-1',
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange?.(option.value)}
          className={item({ active: value === option.value })}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
