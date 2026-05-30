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
  codeOptions?: { secret?: boolean };
  textareaOptions?: { secret?: boolean; maxWidth?: number };
  render?: (value: DeepValue<T, K>, row: T) => ReactNode;
}

export type FilterType = "search" | "sort" | "filter";

export interface DataViewFilter {
  key: string;
  label: string;
  type: FilterType;
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
  limit?: number;
  emptyMessage?: string;
}

export interface FilterState {
  search: Record<string, string>;
  sort: string | null;
  sortDirection: "asc" | "desc";
  filters: Record<string, string>;
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
  setSearch: (key: string, value: string) => void;
  setSort: (key: string) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  totalCount: number;
}
