import { useId } from 'react'

import { cn } from '#/lib/utils'

export interface DateRange {
  start: Date
  end: Date
}

export interface DateRangeScrollPickerProps {
  value?: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

const toInputValue = (date?: Date) =>
  date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : ''

export function DateRangeScrollPicker({
  value,
  onChange,
  className,
}: DateRangeScrollPickerProps) {
  const startId = useId()
  const endId = useId()
  const start = value?.start ?? new Date()
  const end = value?.end ?? new Date()

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        id={startId}
        type="date"
        value={toInputValue(value?.start)}
        onChange={(event) =>
          onChange({ start: new Date(event.target.value), end })
        }
        className="rounded-md border border-input bg-background px-2 py-1 text-sm"
      />
      <span className="text-muted-foreground">–</span>
      <input
        id={endId}
        type="date"
        value={toInputValue(value?.end)}
        onChange={(event) =>
          onChange({ start, end: new Date(event.target.value) })
        }
        className="rounded-md border border-input bg-background px-2 py-1 text-sm"
      />
    </div>
  )
}
