"use client"

import { useState } from "react"
import { CheckIcon, ChevronRightIcon, CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PanelFieldDef, PanelGroup } from "@/components/module/detail-builder/types"
import { useTranslations } from "next-intl";

function resolveRawString<TData>(fieldDef: PanelFieldDef<TData>, data: TData): string | null {
  if (typeof fieldDef.value === "function") return null
  const raw = (fieldDef.value as string).split(".").reduce(
    (acc: unknown, key) => (acc != null && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
    data as unknown,
  )
  return raw != null ? String(raw) : null
}

function PanelFieldValue<TData>({
  fieldDef,
  data,
}: {
  fieldDef: PanelFieldDef<TData>
  data: TData
}) {
  if (typeof fieldDef.value === "function") {
    return <>{fieldDef.value(data)}</>
  }
  const raw = resolveRawString(fieldDef, data)
  if (raw == null) return <span className="text-muted-foreground">—</span>
  return <span>{raw}</span>
}

function CopyableValue<TData>({ fieldDef, data, copyText }: { fieldDef: PanelFieldDef<TData>; data: TData; copyText: string }) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(copyText)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="group/copy -mx-1.5 flex w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left transition-colors hover:bg-muted"
      aria-label={t("common.ui.copy")}
    >
      <span className="flex-1"><PanelFieldValue fieldDef={fieldDef} data={data} /></span>
      <span className="opacity-0 transition-opacity group-hover/copy:opacity-100 text-muted-foreground">
        {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
      </span>
    </button>
  )
}

function PanelGroupSection<TData>({
  group,
  data,
}: {
  group: PanelGroup<TData>
  data: TData
}) {
  return (
    <div>
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {group.title}
      </h3>
      <div className="space-y-3">
        {group.fields.map((f, i) => {
          const copyText = f.copyable ? resolveRawString(f, data) : null
          return (
            <div key={typeof f.value === "string" ? f.value : String(i)}>
              <p className="text-xs text-muted-foreground">{f.label}</p>
              <div className="mt-0.5 text-sm">
                {copyText
                  ? <CopyableValue fieldDef={f} data={data} copyText={copyText} />
                  : <PanelFieldValue fieldDef={f} data={data} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DetailPanel<TData>({
  groups,
  data,
}: {
  groups: PanelGroup<TData>[]
  data: TData
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(true)

  return (
    <aside
      className={cn(
        "shrink-0 overflow-hidden bg-background w-full",
        "lg:transition-[width] lg:duration-200",
        open ? "lg:w-64" : "lg:w-10",
      )}
    >
      <div
        className={cn(
          "flex items-center px-3 py-3",
          open ? "justify-between border-b-2" : "lg:justify-center",
        )}
      >
        <span className={cn("text-sm font-semibold", !open && "lg:hidden")}>{t("common.ui.details")}</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="hidden lg:flex text-muted-foreground transition-colors hover:text-foreground"
          aria-label={open ? "Collapse panel" : "Expand panel"}
        >
          <ChevronRightIcon
            className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
          />
        </button>
      </div>
      <div className={cn("space-y-5 overflow-y-auto p-4", !open && "lg:hidden")}>
        {groups.map((group, i) => (
          <div key={group.title}>
            {i > 0 && <div className="mb-5 border-t" />}
            <PanelGroupSection group={group} data={data} />
          </div>
        ))}
      </div>
    </aside>
  )
}
