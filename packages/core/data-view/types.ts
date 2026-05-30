import type { ReactNode } from "react";
import type {
  CursorFetcher,
  CursorPaginatedResponse,
} from "@/lib/cursor-wrapper";

export type DeepPath<T, Depth extends number[] = []> = Depth["length"] extends 4
  ? never
  : {
      [K in keyof T & string]: NonNullable<T[K]> extends object
        ? NonNullable<T[K]> extends unknown[]
          ? K
          : K | `${K}.${DeepPath<NonNullable<T[K]>, [...Depth, 0]>}`
        : K;
    }[keyof T & string];

export type DeepValue<T, K extends string> = K extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? DeepValue<NonNullable<T[Head]>, Tail>
    : unknown
  : K extends keyof T
  ? T[K]
  : unknown;

export type CellType =
  | "text"
  | "bold"
  | "date"
  | "datetime"
  | "number"
  | "price"
  | "badge"
  | "status"
  | "code"
  | "id"
  | "textarea"
  | "custom";

export interface BadgeOption {
  color: string;
  label: string;
}

export interface DataViewColumn<T, K extends DeepPath<T> = DeepPath<T>> {
  key: K;
  label: string;
  cellType: CellType;
  hidden?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  badgeOptions?: Record<string, BadgeOption>;
  statusOptions?: {
    true: BadgeOption;
    false: BadgeOption;
  };
  priceOptions?: { currency?: string };
  codeOptions?: { secret?: boolean; line?: number };
  textareaOptions?: { secret?: boolean; maxWidth?: number };
  render?: (value: DeepValue<T, K>, row: T) => ReactNode;
}

export type FilterDataType =
  | "text"
  | "number"
  | "amount"
  | "date"
  | "daterange"
  | "select"
  | "multiselect"
  | "boolean";

export type FilterInputKind =
  | "none"
  | "text"
  | "number"
  | "numberrange"
  | "date"
  | "daterange"
  | "duration"
  | "select"
  | "multiselect";

export interface FilterOperator {
  id: string;
  label: string;
  inputKind: FilterInputKind;
}

export interface SelectOption {
  value: string;
  label: string;
}

export type DataViewFilter =
  | { kind: "sort"; key: string; label: string }
  | {
      kind: "filter";
      key: string;
      label: string;
      dataType: FilterDataType;
      operators: FilterOperator[];
      defaultOp?: string;
      options?: SelectOption[];
      currency?: string;
    };

export interface ActiveFilter {
  op: string;
  value: string | string[];
  display: string;
}

export interface FilterState {
  search: string;
  sort: { key: string; direction: "asc" | "desc" } | null;
  filters: Record<string, ActiveFilter>;
}

export type ParamValue = string | number | boolean;

export interface SelectionConfig<T> {
  enabled?: boolean;
  onSelectionChange?: (rows: T[]) => void;
}

export interface PrimaryAction {
  label: string;
  onClick: () => void;
  shortcut?: string;
  icon?: ReactNode;
}

export interface DataViewConfig<T extends { id: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: DataViewColumn<T, any>[];
  fetcher: CursorFetcher<T>;
  queryKey: string;
  filters?: DataViewFilter[];
  rowHref?: (row: T) => string;
  rowActions?: (row: T) => ReactNode;
  headerActions?: ReactNode;
  primaryAction?: PrimaryAction;
  refreshShortcut?: string;
  maxVisibleFilters?: number;
  serializeParams?: (state: FilterState) => Record<string, ParamValue | undefined | null>;
  selectionConfig?: SelectionConfig<T>;
  initialData?: CursorPaginatedResponse<T>;
  limit?: number;
  emptyMessage?: string;
  searchable?: boolean;
}

export interface DataViewResult<T extends { id: string }> {
  pages: CursorPaginatedResponse<T>[];
  currentPage: CursorPaginatedResponse<T> | null;
  pageIndex: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goNextPage: () => void;
  goPreviousPage: () => void;
  refetch: () => void;
  filterState: FilterState;
  setSearch: (value: string) => void;
  setSort: (key: string) => void;
  setSortExplicit: (key: string, desc: boolean) => void;
  clearSort: () => void;
  setFilter: (key: string, filter: ActiveFilter) => void;
  clearFilter: (key: string) => void;
  clearFilters: () => void;
  totalCount: number;
}
