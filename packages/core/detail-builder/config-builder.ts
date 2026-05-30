import type { ComponentType, ReactNode } from "react"
import type { QueryKey } from "@tanstack/react-query"
import type { DataViewConfig } from "@/components/module/data-view"
import type { DeepPath } from "@/components/module/data-view/types"
import type {
  BadgeOption,
  CTAConfig,
  CursorSectionConfig,
  CustomSectionConfig,
  DetailConfig,
  DetailHeaderConfig,
  DropdownEntry,
  DropdownItemConfig,
  FieldDef,
  FieldsSectionConfig,
  FieldType,
  PanelFieldDef,
  PanelGroup,
  SectionAction,
  SectionConfig,
} from "@/components/module/detail-builder/types"

export function field<TData>(
  label: string,
  key: keyof TData & string,
  options?: {
    type?: FieldType
    badgeOptions?: Record<string, BadgeOption>
    statusOptions?: { true: BadgeOption; false: BadgeOption }
    codeOptions?: { secret?: boolean }
  },
): FieldDef<TData> {
  return { label, key, type: options?.type ?? "text", ...options }
}

export function customField<TData>(
  label: string,
  render: (data: TData) => ReactNode,
): FieldDef<TData> {
  return { label, type: "custom", render }
}

export function panelField<TData>(
  label: string,
  value: DeepPath<TData> | ((data: TData) => ReactNode),
  options?: { copyable?: boolean },
): PanelFieldDef<TData> {
  return { label, value, ...options }
}

export function panelGroup<TData>(
  title: string,
  fields: PanelFieldDef<TData>[],
): PanelGroup<TData> {
  return { title, fields }
}

export function dropdownGroup<TData>(
  label: string,
  items: DropdownItemConfig<TData>[],
): DropdownEntry<TData> {
  return { label, items }
}

export function fieldsSection<TData>(
  key: string,
  title: string,
  fields: FieldDef<TData>[],
  options?: { action?: SectionAction<TData>; columns?: 1 | 2; collapsible?: boolean; defaultOpen?: boolean },
): FieldsSectionConfig<TData> {
  return { type: "fields", key, title, fields, ...options }
}

export function cursorSection<TData, TItem extends { id: string }>(
  key: string,
  title: string,
  dataView: DataViewConfig<TItem> | ((data: TData) => DataViewConfig<TItem>),
  options?: { action?: SectionAction<TData>; collapsible?: boolean; defaultOpen?: boolean },
): CursorSectionConfig<TData, TItem> {
  return { type: "cursor", key, title, dataView, ...options }
}

export function customSection<TData>(
  key: string,
  title: string,
  component: ComponentType<{ data: TData }>,
  options?: { action?: SectionAction<TData>; collapsible?: boolean; defaultOpen?: boolean },
): CustomSectionConfig<TData> {
  return { type: "custom", key, title, component, ...options }
}

export class DetailBuilder<TData> {
  private config: Partial<DetailConfig<TData>> = {}

  withQueryKey(fn: (id: string) => QueryKey): this {
    this.config.queryKey = fn
    return this
  }

  withFetch(fn: (id: string) => Promise<TData | null>): this {
    this.config.fetchById = fn
    return this
  }

  withHeader(config: DetailHeaderConfig<TData>): this {
    this.config.header = config
    return this
  }

  withCTA(items: CTAConfig<TData>[]): this {
    this.config.cta = items
    return this
  }

  withDropdown(items: DropdownEntry<TData>[]): this {
    this.config.dropdown = items
    return this
  }

  withPanel(groups: PanelGroup<TData>[]): this {
    this.config.panel = groups
    return this
  }

  addSection(section: SectionConfig<TData>): this {
    if (!this.config.sections) this.config.sections = []
    this.config.sections.push(section)
    return this
  }

  withSections(sections: SectionConfig<TData>[]): this {
    this.config.sections = sections
    return this
  }

  build(): DetailConfig<TData> {
    return this.config as DetailConfig<TData>
  }
}

export function createDetail<TData>(): DetailBuilder<TData> {
  return new DetailBuilder<TData>()
}
