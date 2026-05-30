import { createElement, type ReactNode } from "react";
import type { CursorFetcher, CursorPaginatedResponse } from "@/lib/cursor-wrapper";
import {
  type CTAConfig,
  CTAButton,
  type RowActionConfig,
  type RowActionsVariant,
  RowActionsGroup,
} from "@/components/module/modal";
import { defaultOperators } from "@/components/module/data-view/filter-operators";
import type {
  BadgeOption,
  CellType,
  DataViewColumn,
  DataViewConfig,
  DataViewFilter,
  DeepPath,
  DeepValue,
  FilterDataType,
  FilterOperator,
  FilterState,
  ParamValue,
  PrimaryAction,
  SelectOption,
  SelectionConfig,
} from "@/components/module/data-view/types";

export class ColumnBuilder<T, K extends DeepPath<T> = DeepPath<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private column: Partial<DataViewColumn<T, any>> = {};

  constructor(key: K, label: string) {
    this.column.key = key;
    this.column.label = label;
    this.column.cellType = "text";
  }

  private withType(type: CellType): this {
    this.column.cellType = type;
    return this;
  }

  bold(): this { return this.withType("bold"); }
  date(): this { return this.withType("date"); }
  datetime(): this { return this.withType("datetime"); }
  number(): this { return this.withType("number"); }

  price(options?: { currency?: string }): this {
    this.column.priceOptions = options;
    return this.withType("price");
  }

  badge(options: Record<string, BadgeOption>): this {
    this.column.badgeOptions = options;
    return this.withType("badge");
  }

  status(options: { true: BadgeOption; false: BadgeOption }): this {
    this.column.statusOptions = options;
    return this.withType("status");
  }

  code(options?: { secret?: boolean }): this {
    this.column.codeOptions = options;
    return this.withType("code");
  }

  id(): this {
    return this.withType("id");
  }

  textarea(options?: { secret?: boolean; maxWidth?: number }): this {
    this.column.textareaOptions = options;
    return this.withType("textarea");
  }

  custom(render: (value: DeepValue<T, K>, row: T) => ReactNode): this {
    this.column.render = render as (value: unknown, row: T) => ReactNode;
    return this.withType("custom");
  }

  hidden(): this { this.column.hidden = true; return this; }
  width(w: string): this { this.column.width = w; return this; }
  align(a: "left" | "center" | "right"): this { this.column.align = a; return this; }

  build(): DataViewColumn<T, K> {
    return this.column as DataViewColumn<T, K>;
  }
}

export class FilterBuilder {
  private key: string;
  private label: string;
  private dataType: FilterDataType = "text";
  private operators?: FilterOperator[];
  private defaultOp?: string;
  private options?: SelectOption[];
  private currency?: string;

  constructor(key: string, label: string) {
    this.key = key;
    this.label = label;
  }

  text(): this { this.dataType = "text"; return this; }
  number(): this { this.dataType = "number"; return this; }
  amount(currency?: string): this { this.dataType = "amount"; this.currency = currency; return this; }
  date(): this { this.dataType = "date"; return this; }
  range(): this { this.dataType = "daterange"; return this; }
  boolean(): this { this.dataType = "boolean"; return this; }

  select(options: SelectOption[]): this {
    this.dataType = "select";
    this.options = options;
    return this;
  }

  multi(options: SelectOption[]): this {
    this.dataType = "multiselect";
    this.options = options;
    return this;
  }

  withOperators(operators: FilterOperator[]): this {
    this.operators = operators;
    return this;
  }

  withDefaultOp(op: string): this {
    this.defaultOp = op;
    return this;
  }

  build(): DataViewFilter {
    return {
      kind: "filter",
      key: this.key,
      label: this.label,
      dataType: this.dataType,
      operators: this.operators ?? defaultOperators(this.dataType),
      defaultOp: this.defaultOp,
      options: this.options,
      currency: this.currency,
    };
  }
}

export function filter(key: string, label: string): FilterBuilder {
  return new FilterBuilder(key, label);
}

export function sort(key: string, label: string): DataViewFilter {
  return { kind: "sort", key, label };
}

export class DataViewBuilder<T extends { id: string }> {
  private config: Partial<DataViewConfig<T>> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withColumns(columns: Array<DataViewColumn<T, any> | ColumnBuilder<T, any>>): this {
    this.config.columns = columns.map((c) =>
      c instanceof ColumnBuilder ? c.build() : c,
    );
    return this;
  }

  withFetcher(fetcher: CursorFetcher<T>): this {
    this.config.fetcher = fetcher;
    return this;
  }

  withSearchable(searchable: boolean = true): this {
    this.config.searchable = searchable;
    return this;
  }

  withQueryKey(key: string): this {
    this.config.queryKey = key;
    return this;
  }

  withFilters(filters: Array<DataViewFilter | FilterBuilder>): this {
    this.config.filters = filters.map((f) =>
      f instanceof FilterBuilder ? f.build() : f,
    );
    return this;
  }

  withRowHref(fn: (row: T) => string): this {
    this.config.rowHref = fn;
    return this;
  }

  withRowActions(fn: (row: T) => ReactNode): this {
    this.config.rowActions = fn;
    return this;
  }

  withHeaderActions(actions: ReactNode): this {
    this.config.headerActions = actions;
    return this;
  }

  withPrimaryAction(action: PrimaryAction): this {
    this.config.primaryAction = action;
    return this;
  }

  withCTA(label: string, opts: Omit<CTAConfig, "label">): this {
    const cta: CTAConfig = { label, ...opts };
    this.config.headerActions = createElement(CTAButton, { config: cta });
    return this;
  }

  withRowActionLinks(fn: (row: T) => RowActionConfig[], variant?: RowActionsVariant): this {
    this.config.rowActions = (row) =>
      createElement(RowActionsGroup, { actions: fn(row), variant });
    return this;
  }

  withRefreshShortcut(key: string): this {
    this.config.refreshShortcut = key;
    return this;
  }

  withMaxVisibleFilters(n: number): this {
    this.config.maxVisibleFilters = n;
    return this;
  }

  withSerializeParams(
    fn: (state: FilterState) => Record<string, ParamValue | undefined | null>,
  ): this {
    this.config.serializeParams = fn;
    return this;
  }

  withSelection(config: SelectionConfig<T>): this {
    this.config.selectionConfig = config;
    return this;
  }

  withInitialData(data: CursorPaginatedResponse<T> | undefined): this {
    this.config.initialData = data;
    return this;
  }

  withLimit(limit: number): this {
    this.config.limit = limit;
    return this;
  }

  withEmptyMessage(message: string): this {
    this.config.emptyMessage = message;
    return this;
  }

  build(): DataViewConfig<T> {
    return this.config as DataViewConfig<T>;
  }
}

export function createDataView<T extends { id: string }>(): DataViewBuilder<T> {
  return new DataViewBuilder<T>();
}

export function col<T, K extends DeepPath<T> = DeepPath<T>>(key: K, label: string): ColumnBuilder<T, K> {
  return new ColumnBuilder<T, K>(key, label);
}
