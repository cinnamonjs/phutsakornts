"use client"

import { DataViewModule } from "@/components/module/data-view"
import type { CursorSectionConfig } from "@/components/module/detail-builder/types"

export function CursorSection<TData>({
  section,
  data,
}: {
  section: CursorSectionConfig<TData, { id: string }>
  data: TData
}) {
  const config = typeof section.dataView === "function" ? section.dataView(data) : section.dataView
  return <DataViewModule config={config} />
}
