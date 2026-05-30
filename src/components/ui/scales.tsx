import { cn } from '#/lib/utils'

export interface ScalesProps {
  orientation?: 'horizontal' | 'vertical' | 'diagonal'
  size?: number
  className?: string
}

export function Scales({
  orientation = 'diagonal',
  size = 8,
  className,
}: ScalesProps) {
  const angle =
    orientation === 'diagonal' ? 45 : orientation === 'vertical' ? 90 : 0
  return (
    <div
      aria-hidden
      className={cn(className)}
      style={{
        backgroundImage: `repeating-linear-gradient(${angle}deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent ${size}px)`,
      }}
    />
  )
}
