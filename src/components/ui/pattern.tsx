import { cn } from "#/lib/utils.ts";

export const CrossPattern = ({ className }: { className?: string }) => <div className="size-full overflow-hidden absolute">
  <div
    className={cn("absolute inset-1 rounded-lg border border-rule", className)} style={{
      opacity: 0.8,
      background: `
    repeating-linear-gradient(
      -45deg,
      var(--ink),
      var(--ink) 5px,
      var(--paper) 5px,
      var(--paper) 25px
    )
  `,
    }} /></div>

export const GridPattern = ({ className }: { className?: string }) =>
  <div className="size-full overflow-hidden absolute">
    <div
      className={cn("absolute inset-1 border border-rule rounded-lg", className)}
      style={{
        backgroundImage: `
        linear-gradient(to right, var(--ink) 1px, transparent 1px),
        linear-gradient(to bottom, var(--ink) 1px, transparent 1px)
      `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 0",
        maskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
        WebkitMaskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  </div>

export const CircleRing = ({ className }: { className?: string }) => <div className={cn("absolute inset-1 border border-rule rounded-lg bg-ink opacity-80", className)} style={{
  backgroundColor: "var(--paper)",
  backgroundImage:
    "repeating-radial-gradient(circle at 0 0, transparent 0, var(--paper) 10px), repeating-linear-gradient(color-mix(in srgb, var(--ink) 35%, transparent), var(--ink))",
}} />

export const SquarePattern = ({ className }: { className?: string }) => <div className={cn("absolute inset-1 border border-rule rounded-lg bg-ink opacity-80", className)} style={{
  opacity: 0.8,
  backgroundColor: "var(--paper)",
  backgroundSize: "10px 10px",
  backgroundImage:
    "repeating-linear-gradient(45deg, var(--ink) 0, var(--ink) 1px, var(--paper) 0, var(--paper) 50%)",
}} />

export const DiamondPattern = ({ className }: { className?: string }) => <div className={cn("absolute inset-1 border border-rule rounded-lg bg-ink opacity-80", className)} style={{
  opacity: 0.8,
  backgroundColor: "var(--paper)",
  backgroundImage: `
    linear-gradient(30deg, var(--ink) 12%, transparent 12.5%, transparent 87%, var(--ink) 87.5%, var(--ink)),
    linear-gradient(150deg, var(--ink) 12%, transparent 12.5%, transparent 87%, var(--ink) 87.5%, var(--ink)),
    linear-gradient(30deg, var(--ink) 12%, transparent 12.5%, transparent 87%, var(--ink) 87.5%, var(--ink)),
    linear-gradient(150deg, var(--ink) 12%, transparent 12.5%, transparent 87%, var(--ink) 87.5%, var(--ink)),
    linear-gradient(60deg, color-mix(in srgb, var(--ink) 47%, transparent) 25%, transparent 25.5%, transparent 75%, color-mix(in srgb, var(--ink) 47%, transparent) 75%, color-mix(in srgb, var(--ink) 47%, transparent)),
    linear-gradient(60deg, color-mix(in srgb, var(--ink) 47%, transparent) 25%, transparent 25.5%, transparent 75%, color-mix(in srgb, var(--ink) 47%, transparent) 75%, color-mix(in srgb, var(--ink) 47%, transparent))
  `,
  backgroundSize: "20px 35px",
  backgroundPosition:
    "0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px",
}} />