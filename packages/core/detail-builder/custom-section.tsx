"use client"

import type { CustomSectionConfig } from "@/components/module/detail-builder/types"

export function CustomSection<TData>({
  section,
  data,
}: {
  section: CustomSectionConfig<TData>
  data: TData
}) {
  const Component = section.component
  return <Component data={data} />
}
