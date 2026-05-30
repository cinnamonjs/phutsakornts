import type { ComponentType, ReactNode } from "react"
import type { QueryKey } from "@tanstack/react-query"
import type { DataViewConfig } from "@/components/module/data-view"
import type { DeepPath } from "@/components/module/data-view/types"

export type FieldType = "text" | "bold" | "link" | "date" | "datetime" | "code" | "badge" | "status" | "custom"

export interface BadgeOption {
  color: string
  label: string
}

export interface FieldDef<TData> {
  label: string
  key?: keyof TData & string
  type?: FieldType
  render?: (data: TData) => ReactNode
  badgeOptions?: Record<string, BadgeOption>
  statusOptions?: { true: BadgeOption; false: BadgeOption }
  codeOptions?: { secret?: boolean }
}

export interface PanelFieldDef<TData> {
  label: string
  value: DeepPath<TData> | ((data: TData) => ReactNode)
  copyable?: boolean
}

export interface PanelGroup<TData> {
  title: string
  fields: PanelFieldDef<TData>[]
}

export interface DetailHeaderConfig<TData> {
  back?: { href?: string; label: string }
  title: (data: TData) => string
  subtitle?: (data: TData) => string
  actions?: (data: TData) => ReactNode
}

export type SectionAction<TData> = ReactNode | ((data: TData) => ReactNode)

export interface FieldsSectionConfig<TData> {
  type: "fields"
  key: string
  title: string
  action?: SectionAction<TData>
  fields: FieldDef<TData>[]
  columns?: 1 | 2
  collapsible?: boolean
  defaultOpen?: boolean
}

export interface CursorSectionConfig<TData, TItem extends { id: string }> {
  type: "cursor"
  key: string
  title: string
  action?: SectionAction<TData>
  dataView: DataViewConfig<TItem> | ((data: TData) => DataViewConfig<TItem>)
  collapsible?: boolean
  defaultOpen?: boolean
}

export interface CustomSectionConfig<TData> {
  type: "custom"
  key: string
  title: string
  action?: SectionAction<TData>
  component: ComponentType<{ data: TData }>
  collapsible?: boolean
  defaultOpen?: boolean
}

// CursorSectionConfig's TItem is invariant (appears in both input and output
// positions of dataView's DataViewConfig), so it can't be widened by
// covariance — use `any` here so a section over any concrete row type
// (e.g. CursorSectionConfig<Balance, BalanceTransaction>) is assignable to
// the heterogeneous SectionConfig<TData>[] stored on DetailConfig. Row stays
// strictly typed inside the cursorSection() factory call and is invisible
// to the parent detail consumer, which only forwards dataView to <DataView>.
export type SectionConfig<TData> =
  | FieldsSectionConfig<TData>
  // biome-ignore lint/suspicious/noExplicitAny: see note above
  | CursorSectionConfig<TData, any>
  | CustomSectionConfig<TData>

export interface ModalAction<TData> {
  name: string
  params?: (data: TData) => Record<string, string | number | boolean | undefined>
}

export interface CTAConfig<TData> {
  label: string
  onClick?: (data: TData) => void
  href?: (data: TData) => string
  modal?: ModalAction<TData>
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost"
  hidden?: (data: TData) => boolean
}

export type DropdownVariant = "default" | "destructive"

export interface DropdownItemConfig<TData> {
  label: string
  onClick?: (data: TData) => void
  href?: (data: TData) => string
  modal?: ModalAction<TData>
  variant?: DropdownVariant
  destructive?: boolean
  hidden?: (data: TData) => boolean
}

export interface DropdownGroupConfig<TData> {
  label?: string
  variant?: DropdownVariant
  items: DropdownItemConfig<TData>[]
}

export type DropdownEntry<TData> = DropdownItemConfig<TData> | DropdownGroupConfig<TData>

export interface DetailConfig<TData> {
  queryKey: (id: string) => QueryKey
  fetchById: (id: string) => Promise<TData | null>
  header: DetailHeaderConfig<TData>
  cta?: CTAConfig<TData>[]
  dropdown?: DropdownEntry<TData>[]
  panel?: PanelGroup<TData>[]
  sections: SectionConfig<TData>[]
}
