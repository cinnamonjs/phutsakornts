export function HomeClouds({ opacity }: { opacity: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[4] overflow-hidden mix-blend-screen will-change-opacity"
      style={{ opacity }}
    >
      <div className="absolute -left-[18%] top-[10%] h-[38%] w-[64%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(238,248,226,0.2)_0%,rgba(190,220,196,0.1)_42%,transparent_74%)] blur-3xl motion-safe:animate-[cloud-drift_38s_ease-in-out_infinite_alternate]" />
      <div className="absolute -right-[22%] top-[28%] h-[42%] w-[68%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(227,242,222,0.16)_0%,rgba(163,201,177,0.08)_44%,transparent_74%)] blur-3xl motion-safe:animate-[cloud-drift-reverse_52s_ease-in-out_infinite_alternate]" />
      <div className="absolute -bottom-[20%] left-[18%] h-[36%] w-[72%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(213,234,207,0.12)_0%,rgba(125,170,145,0.08)_38%,transparent_72%)] blur-3xl motion-safe:animate-[cloud-drift-low_46s_ease-in-out_infinite_alternate]" />
    </div>
  )
}
