"use client"

import { useCallback, useState } from "react"
import { CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"
import type { BadgeOption, FieldDef, FieldsSectionConfig } from "@/components/module/detail-builder/types"
import { useTranslations } from "next-intl";

function formatDate(value: unknown): string {
  if (!value) return "—"
  const d = new Date(String(value))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function formatDateTime(value: unknown): string {
  if (!value) return "—"
  const d = new Date(String(value))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function CodeValue({ value, secret }: { value: string; secret?: boolean }) {
  const t = useTranslations();
  const [revealed, setRevealed] = useState(!secret)
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [value])

  return (
    <span className="inline-flex items-center gap-1.5">
      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
        {revealed ? value : "••••••••"}
      </code>
      {secret && (
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="text-muted-foreground hover:text-foreground"
        >
          {revealed ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
        </button>
      )}
      <button type="button" onClick={onCopy} className="text-muted-foreground hover:text-foreground">
        <CopyIcon className="size-3.5" />
      </button>
      {copied && <span className="text-xs text-green-600">{t("common.ui.copied")}</span>}
    </span>
  )
}

function FieldValue<TData>({ fieldDef, data }: { fieldDef: FieldDef<TData>; data: TData }) {
  if (fieldDef.render) return <>{fieldDef.render(data)}</>

  const raw = fieldDef.key ? (data as Record<string, unknown>)[fieldDef.key] : undefined

  switch (fieldDef.type) {
    case "bold":
      return <span className="font-medium text-foreground">{String(raw ?? "—")}</span>
      
    case "link":
      return <a href={String(raw ?? "")} className="inline-flex text-foreground hover:decoration-solid underline decoration-dotted">{String(raw ?? "")} <ExternalLink className="mt-1 ml-1 size-3 text-muted-foreground" /></a>

    case "date":
      return <span className="text-foreground">{formatDate(raw)}</span>

    case "datetime":
      return <span className="text-foreground">{formatDateTime(raw)}</span>

    case "code":
      return <CodeValue value={String(raw ?? "")} secret={fieldDef.codeOptions?.secret} />

    case "badge": {
      const key = String(raw ?? "")
      const opt: BadgeOption | undefined = fieldDef.badgeOptions?.[key]
      return (
        <Badge variant="outline" className={opt?.color}>
          {opt?.label ?? key}
        </Badge>
      )
    }

    case "status": {
      const bool = Boolean(raw)
      const opt = bool ? fieldDef.statusOptions?.true : fieldDef.statusOptions?.false
      return (
        <Badge variant="outline" className={opt?.color}>
          {opt?.label ?? String(bool)}
        </Badge>
      )
    }

    default:
      return <span className="text-foreground">{String(raw ?? "—")}</span>
  }
}

export function FieldsSection<TData>({
  section,
  data,
}: {
  section: FieldsSectionConfig<TData>
  data: TData
}) {
  const cols = section.columns ?? 2
  return (
    <div className={cn("grid gap-x-8 gap-y-4", cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {section.fields.map((f, i) => (
        <div key={f.key ?? String(i)} className="flex flex-col items-start">
          <span className="min-w-[80px] shrink-0 text-xs text-muted-foreground">{f.label}</span>
          <span className="text-sm">
            <FieldValue fieldDef={f} data={data} />
          </span>
        </div>
      ))}
    </div>
  )
}
