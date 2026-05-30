"use client"

import { Fragment, useState, type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { DetailConfig, DropdownEntry, DropdownGroupConfig, DropdownItemConfig, DropdownVariant, SectionConfig } from "@/components/module/detail-builder/types"
import { CursorSection } from "@/components/module/detail-builder/cursor-section"
import { CustomSection } from "@/components/module/detail-builder/custom-section"
import { DetailPanel } from "@/components/module/detail-builder/detail-panel"
import { Scales } from "@/components/ui/scales"
import { FieldsSection } from "@/components/module/detail-builder/fields-section"
import { useRouter } from "next/navigation"
import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModalOpen } from "@/components/module/modal/use-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function isDropdownGroup<TData>(entry: DropdownEntry<TData>): entry is DropdownGroupConfig<TData> {
  return Array.isArray((entry as DropdownGroupConfig<TData>).items)
}

function resolveItemVariant<TData>(item: DropdownItemConfig<TData>, fallback: DropdownVariant): DropdownVariant {
  return item.variant ?? (item.destructive ? "destructive" : fallback)
}

function normalizeDropdown<TData>(entries: DropdownEntry<TData>[]): DropdownGroupConfig<TData>[] {
  const groups: DropdownGroupConfig<TData>[] = []
  for (const entry of entries) {
    if (isDropdownGroup(entry)) {
      groups.push(entry)
      continue
    }
    const variant = entry.variant ?? (entry.destructive ? "destructive" : "default")
    const last = groups[groups.length - 1]
    if (last && !last.label && (last.variant ?? "default") === variant) {
      last.items.push(entry)
    } else {
      groups.push({ variant, items: [entry] })
    }
  }
  return groups
}

function SectionCard({
  title,
  action,
  collapsible = true,
  defaultOpen = true,
  children,
}: {
  title: string
  action?: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const expanded = collapsible ? open : true

  return (
    <div className="rounded-lg">
      <div className="flex items-center justify-between border-b-2 px-5 py-3">
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={expanded}
            className="group flex flex-1 items-center gap-2 text-left"
          >
            <ChevronDownIcon
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
                expanded ? "rotate-0" : "-rotate-90",
              )}
            />
            <h2 className="text-sm font-semibold transition-colors group-hover:text-foreground/80">
              {title}
            </h2>
          </button>
        ) : (
          <h2 className="text-sm font-semibold">{title}</h2>
        )}
        {action && (
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {action}
          </div>
        )}
      </div>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
        aria-hidden={!expanded}
      >
        <div className="overflow-hidden">
          <div className="px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

function SectionItem<TData>({ section, data }: { section: SectionConfig<TData>; data: TData }) {
  const action = typeof section.action === "function" ? section.action(data) : section.action
  return (
    <SectionCard
      title={section.title}
      action={action}
      collapsible={section.collapsible ?? true}
      defaultOpen={section.defaultOpen ?? true}
    >
      {section.type === "fields" && <FieldsSection section={section} data={data} />}
      {section.type === "cursor" && <CursorSection section={section} data={data} />}
      {section.type === "custom" && <CustomSection section={section} data={data} />}
    </SectionCard>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col lg:flex-row lg:h-full">
        <div className="flex-1 space-y-4 p-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
        <div className="w-full space-y-4 border-t p-4 lg:w-64 lg:border-t-0 lg:border-l">
          <Skeleton className="h-5 w-16" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton size="sm" className="w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DetailLayout<TData>({
  id,
  config,
  className,
}: {
  id: string
  config: DetailConfig<TData>
  className?: string
}) {
  const { data, isLoading } = useQuery({
    queryKey: config.queryKey(id),
    queryFn: () => config.fetchById(id),
    staleTime: 5 * 60 * 1000,
  })
  
  const router = useRouter()
  const openModal = useModalOpen()

  if (isLoading || !data) return <DetailSkeleton />

  return (
    <div className={cn("mx-auto w-full mt-4 max-w-7xl", className)}>
      <div className="flex flex-col lg:flex-row lg:h-full lg:min-h-0">
        <main className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-6">
            <div className="flex items-start justify-between">
              <div className="ml-6">
                {config.header.back && (
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:bg-muted px-2 -ml-2 rounded-xl mb-3"
                    onClick={() => config.header.back!.href ? router.push(config.header.back!.href) : router.back()}
                  >
                    {`< ${config.header.back.label}`}
                  </button>
                )}
                <h1 className="font-heading text-2xl font-bold tracking-tight">
                  {config.header.title(data)}
                </h1>
                {config.header.subtitle && (
                  <p className="mt-1 text-xs flex-none w-fit text-muted-foreground/50 rounded-lg border px-2 border-dashed">
                    {config.header.subtitle(data)}
                  </p>
                )}
              </div>
              <div className="flex mt-auto items-center gap-2">
                {config.header.actions?.(data)}
                {config.cta?.filter((cta) => !cta.hidden?.(data)).map((cta) => (
                  <Button
                    key={cta.label}
                    variant={cta.variant ?? "default"}
                    size="sm"
                    onClick={() => {
                      if (cta.modal) {
                        openModal(cta.modal.name, cta.modal.params?.(data));
                        return;
                      }
                      if (cta.href) {
                        router.push(cta.href(data));
                        return;
                      }
                      cta.onClick?.(data);
                    }}
                  >
                    {cta.label}
                  </Button>
                ))}
                {config.dropdown && config.dropdown.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" size="sm">
                      <MoreHorizontalIcon className="size-4" />
                    </Button>} />
                    <DropdownMenuContent align="end">
                      {normalizeDropdown(config.dropdown).map((group, gi) => (
                        <Fragment key={group.label ?? `g-${gi}`}>
                          {gi > 0 && <DropdownMenuSeparator />}
                          <DropdownMenuGroup>
                            {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
                            {group.items.filter((item) => !item.hidden?.(data)).map((item) => {
                              const variant = resolveItemVariant(item, group.variant ?? "default")
                              return (
                                <DropdownMenuItem
                                  key={item.label}
                                  onClick={() => {
                                    if (item.modal) {
                                      openModal(item.modal.name, item.modal.params?.(data));
                                      return;
                                    }
                                    if (item.href) {
                                      router.push(item.href(data));
                                      return;
                                    }
                                    item.onClick?.(data);
                                  }}
                                  className={variant === "destructive" ? "text-destructive focus:text-destructive" : undefined}
                                >
                                  {item.label}
                                </DropdownMenuItem>
                              )
                            })}
                          </DropdownMenuGroup>
                        </Fragment>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <div className="flex space-x-3 pl-4 max-lg:flex-col">
              <div className="flex-1">
                {config.sections.map((section) => (
                  <SectionItem key={section.key} section={section} data={data} />
                ))}
              </div>
              <div className="relative w-6">
                <Scales orientation="diagonal" size={8} className="w-6 mt-2 h-full border-x border-border" />
              </div>
               <div>
                {config.panel && config.panel.length > 0 && (
                  <DetailPanel groups={config.panel} data={data} />
                )}
               </div>
            </div>
          </div>
        </main>
        
      </div>
    </div>
  )
}
