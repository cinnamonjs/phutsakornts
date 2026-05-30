"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  FilterIcon,
  RefreshCwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  BadgeOption,
  DataViewColumn,
  DataViewConfig,
  DataViewFilter,
  DataViewResult,
} from "@/components/module/page-builder/data-view.types";
import { useDataView } from "@/components/module/page-builder/use-data-view";
import { useTranslations } from "next-intl";

function getDeepValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce(
    (acc, key) => (acc != null && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
    obj,
  );
}

function formatDate(value: unknown): string {
  if (!value) return "—";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value: unknown): string {
  if (!value) return "—";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(value: unknown): string {
  if (value == null) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString();
}

function formatPrice(value: unknown, currency = "USD"): string {
  if (value == null) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(n / 100);
}

function CellValue<T>({
  column,
  value,
  row,
}: {
  column: DataViewColumn<T>;
  value: unknown;
  row: T;
}) {
  switch (column.cellType) {
    case "bold":
      return (
        <span className="font-medium text-foreground">
          {String(value ?? "—")}
        </span>
      );

    case "date":
      return <span className="text-muted-foreground">{formatDate(value)}</span>;

    case "datetime":
      return (
        <span className="text-muted-foreground">{formatDateTime(value)}</span>
      );

    case "number":
      return (
        <span className="tabular-nums">{formatNumber(value)}</span>
      );

    case "price":
      return (
        <span className="tabular-nums">
          {formatPrice(value, column.priceOptions?.currency)}
        </span>
      );

    case "badge": {
      const key = String(value ?? "");
      const opt: BadgeOption | undefined = column.badgeOptions?.[key];
      return (
        <Badge
          variant="outline"
          className={opt?.color}
        >
          {opt?.label ?? key}
        </Badge>
      );
    }

    case "status": {
      const bool = Boolean(value);
      const opt = bool
        ? column.statusOptions?.true
        : column.statusOptions?.false;
      return (
        <Badge variant="outline" className={opt?.color}>
          {opt?.label ?? String(bool)}
        </Badge>
      );
    }

    case "code":
      return <CodeCell value={value} secret={column.codeOptions?.secret} />;
    case "textarea":
      return <TextareaCell value={value} secret={column.textareaOptions?.secret} maxWidth={column.textareaOptions?.maxWidth} />;

    case "custom":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return column.render ? <>{column.render(value as any, row)}</> : null;

    default:
      return (
        <span className="text-muted-foreground">{String(value ?? "—")}</span>
      );
  }
}

function TextareaCell({ value, secret, maxWidth }: { value: unknown; secret?: boolean; maxWidth?: number }) {
  const t = useTranslations();
  const [revealed, setRevealed] = useState(!secret);
  const [copied, setCopied] = useState(false);
  const str = String(value ?? "");

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [str]);

  return (
    <span className="inline-flex items-start gap-1.5">
      <span
        className="break-all text-xs text-muted-foreground"
        style={maxWidth !== undefined ? { maxWidth } : undefined}
      >
        {revealed ? str : "••••••••"}
      </span>
      {secret && (
        <button type="button" onClick={() => setRevealed((r) => !r)} className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground">
          {revealed ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
        </button>
      )}
      <button type="button" onClick={onCopy} className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground">
        <CopyIcon className="size-3.5" />
      </button>
      {copied && <span className="text-xs text-green-600">{t("common.ui.copied")}</span>}
    </span>
  );
}

function CodeCell({
  value,
  secret,
}: {
  value: unknown;
  secret?: boolean;
}) {
  const t = useTranslations();
  const [revealed, setRevealed] = useState(!secret);
  const [copied, setCopied] = useState(false);
  const str = String(value ?? "");

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [str]);

  return (
    <span className="inline-flex items-center gap-1.5">
      <code className="rounded bg-muted px-1.5 py-0.5  text-xs">
        {revealed ? str : "••••••••"}
      </code>
      {secret && (
        <button type="button" onClick={() => setRevealed((r) => !r)} className="text-muted-foreground hover:text-foreground">
          {revealed ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
        </button>
      )}
      <button type="button" onClick={onCopy} className="text-muted-foreground hover:text-foreground">
        <CopyIcon className="size-3.5" />
      </button>
      {copied && <span className="text-xs text-green-600">{t("common.ui.copied")}</span>}
    </span>
  );
}

function SearchFilter({
  config,
  value,
  onChange,
}: {
  config: DataViewFilter;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleChange = useCallback(
    (v: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(config.key, v), 350);
    },
    [config.key, onChange],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <Button
        variant={value ? "secondary" : "outline"}
        size="sm"
        onClick={() => setOpen((o) => !o)}
      >
        <SearchIcon className="size-3.5" data-icon="inline-start" />
        {config.label}
        {value && (
          <button
            type="button"
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
            onClick={(e) => {
              e.stopPropagation();
              onChange(config.key, "");
            }}
          >
            <XIcon className="size-3" />
          </button>
        )}
      </Button>
      {open && (
        <div className="absolute top-full left-0 z-10 mt-1 rounded-lg border bg-popover p-2 shadow-md">
          <input
            type="text"
            defaultValue={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={`Search ${config.label.toLowerCase()}...`}
            className="h-8 w-48 rounded-md border bg-transparent px-2 text-sm outline-none focus:border-ring"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}

function SortFilter({
  config,
  active,
  direction,
  onSort,
}: {
  config: DataViewFilter;
  active: boolean;
  direction: "asc" | "desc";
  onSort: (key: string) => void;
}) {
  return (
    <Button
      variant={active ? "secondary" : "outline"}
      size="sm"
      onClick={() => onSort(config.key)}
    >
      {active && direction === "asc" ? (
        <ArrowUpIcon className="size-3.5" data-icon="inline-start" />
      ) : active && direction === "desc" ? (
        <ArrowDownIcon className="size-3.5" data-icon="inline-start" />
      ) : (
        <FilterIcon className="size-3.5" data-icon="inline-start" />
      )}
      {config.label}
    </Button>
  );
}

function FilterBar<T extends { id: string }>({
  config,
  view,
}: {
  config: DataViewConfig<T>;
  view: DataViewResult<T>;
}) {
  if (!config.filters?.length && !config.headerActions) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {view.totalCount} {view.totalCount === 1 ? "item" : "items"}
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {config.filters?.map((f) =>
            f.type === "sort" ? (
              <SortFilter
                key={f.key}
                config={f}
                active={view.filterState.sort === f.key}
                direction={view.filterState.sortDirection}
                onSort={view.setSort}
              />
            ) : (
              <SearchFilter
                key={f.key}
                config={f}
                value={
                  f.type === "search"
                    ? (view.filterState.search[f.key] ?? "")
                    : (view.filterState.filters[f.key] ?? "")
                }
                onChange={f.type === "search" ? view.setSearch : view.setFilter}
              />
            ),
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => view.refetch()}
          disabled={view.isLoading}
        >
          <RefreshCwIcon className="size-3.5" />
        </Button>
        {config.headerActions}
      </div>
    </div>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm text-muted-foreground">
        {message ?? "No data found"}
      </p>
    </div>
  );
}

function PaginationBar<T extends { id: string }>({
  view,
}: {
  view: DataViewResult<T>;
}) {
  const t = useTranslations();
  const showPagination = view.hasPreviousPage || view.hasNextPage;
  if (!showPagination) return null;

  return (
    <div className="flex items-center justify-between border-t pt-3">
      <Button
        variant="outline"
        size="sm"
        disabled={!view.hasPreviousPage || view.isFetchingPreviousPage}
        onClick={view.goPreviousPage}
      >
        <ChevronLeftIcon className="size-4" data-icon="inline-start" />{t("common.ui.previous")}</Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!view.hasNextPage || view.isFetchingNextPage}
        onClick={view.goNextPage}
      >{t("common.ui.next")}<ChevronRightIcon className="size-4" data-icon="inline-end" />
      </Button>
    </div>
  );
}

export function DataView<T extends { id: string }>({
  config,
}: {
  config: DataViewConfig<T>;
}) {
  const t = useTranslations();
  const view = useDataView(config);
  const visibleColumns = config.columns.filter((c) => !c.hidden);
  const data = view.currentPage?.data ?? [];
  const hasActions = !!config.rowActions;

  return (
    <div className="space-y-3">
      <FilterBar config={config} view={view} />

      {view.isLoading ? (
        <TableSkeleton columns={visibleColumns.length} />
      ) : data.length === 0 ? (
        <EmptyState message={config.emptyMessage} />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                    )}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
                {hasActions && (
                  <th className="w-12 px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">{t("common.ui.actions")}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const rowContent = (
                  <>
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-2.5",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                        )}
                      >
                        <CellValue
                          column={col}
                          value={getDeepValue(row, col.key)}
                          row={row}
                        />
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-4 py-2.5 text-right">
                        {config.rowActions!(row)}
                      </td>
                    )}
                  </>
                );

                if (config.rowHref) {
                  return (
                    <tr
                      key={row.id}
                      className="group border-b last:border-b-0 hover:bg-muted/30"
                    >
                      {rowContent}
                    </tr>
                  );
                }

                return (
                  <tr
                    key={row.id}
                    className="border-b last:border-b-0 hover:bg-muted/30"
                  >
                    {rowContent}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <PaginationBar view={view} />
    </div>
  );
}
