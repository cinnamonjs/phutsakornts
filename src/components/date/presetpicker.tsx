import { useId } from 'react'

import { cn } from '#/lib/utils'

export interface DatePickerWithPresetsProps {
  value?: Date
  onDateChange: (date: Date | undefined) => void
  isEndDate?: boolean
  showStartDateProps?: unknown
  showEndDateProps?: unknown
  disableFuture?: boolean
  startDate?: Date
  interval_count?: number
  className?: string
}

const toInputValue = (date?: Date) =>
  date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : ''

export function DatePickerWithPresets({
  value,
  onDateChange,
  className,
}: DatePickerWithPresetsProps) {
  const id = useId()

  return (
    <input
      id={id}
      type="date"
      value={toInputValue(value)}
      onChange={(event) =>
        onDateChange(
          event.target.value ? new Date(event.target.value) : undefined,
        )
      }
      className={cn(
        'rounded-md border border-input bg-background px-2 py-1 text-sm',
        className,
      )}
    />
  )
}
