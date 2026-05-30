"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  PlusCircleIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { DateRangeFilter } from "@/components/module/data-view/date-range-filter";
import { FilterPopover, formatFilterDisplay } from "@/components/module/data-view/filter-popover";
import type {
  ActiveFilter,
  BadgeOption,
  DataViewColumn,
  DataViewConfig,
  DataViewFilter,
} from "@/components/module/data-view/types";
import { useDataView } from "@/components/module/data-view/use-data-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type FilterConfig = Extract<DataViewFilter, { kind: "filter" }>;

function formatDate(value: unknown): string {
  if (!value) return "—";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatDateTime(value: unknown): string {
  if (!value) return "—";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
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
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n / 100);
}

function CellValue<T>({ column, value, row }: { column: DataViewColumn<T>; value: unknown; row: T }) {
  switch (column.cellType) {
    case "bold":
      return <span className="font-medium text-foreground">{String(value ?? "—")}</span>;
    case "date":
      return <span className="text-muted-foreground">{formatDate(value)}</span>;
    case "datetime":
      return <span className="text-muted-foreground">{formatDateTime(value)}</span>;
    case "number":
      return <span className="tabular-nums">{formatNumber(value)}</span>;
    case "price":
      return <span className="tabular-nums">{formatPrice(value, column.priceOptions?.currency)}</span>;
    case "badge": {
      const key = String(value ?? "");
      const opt: BadgeOption | undefined = column.badgeOptions?.[key];
      return <Badge variant="outline" className={opt?.color}>{opt?.label ?? key}</Badge>;
    }
    case "status": {
      const bool = Boolean(value);
      const opt = bool ? column.statusOptions?.true : column.statusOptions?.false;
      return <Badge variant="outline" className={opt?.color}>{opt?.label ?? String(bool)}</Badge>;
    }
    case "code":
      return <CodeCell value={value} secret={column.codeOptions?.secret} line={column.codeOptions?.line} />;
    case "id":
      return <IdCell value={value} />;
    case "textarea":
      return <TextareaCell value={value} secret={column.textareaOptions?.secret} maxWidth={column.textareaOptions?.maxWidth} />;
    case "custom":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return column.render ? <>{column.render(value as any, row)}</> : null;
    default:
      return <span className="text-muted-foreground">{String(value ?? "—")}</span>;
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

function IdCell({ value }: { value: unknown }) {
  const [copied, setCopied] = useState(false);
  const str = String(value ?? "");

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [str]);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{str}</span>
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "relative size-3.5 shrink-0 transition-colors",
          copied ? "text-green-600" : "text-muted-foreground hover:text-foreground",
        )}
        aria-label={copied ? "Copied" : "Copy"}
      >
        <CopyIcon
          className={cn(
            "absolute inset-0 size-3.5 transition-all duration-150",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <CheckIcon
          className={cn(
            "absolute inset-0 size-3.5 transition-all duration-150",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </button>
    </span>
  );
}

function CodeCell({ value, secret, line }: { value: unknown; secret?: boolean; line?: number }) {
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
      <code
        className={cn("rounded bg-muted px-1.5 py-0.5 font-mono text-xs", line && "whitespace-pre-wrap break-all")}
        style={line !== undefined ? { display: "-webkit-box", WebkitLineClamp: line, WebkitBoxOrient: "vertical", overflow: "hidden" } : undefined}
      >
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

const chipBase =
  "inline-flex h-6 items-center gap-1.5 rounded-full border pr-2.5 pl-2 text-xs font-medium transition-all duration-200 ease-out";
const chipInactive =
  "border-dashed border-border bg-transparent text-muted-foreground hover:bg-muted";
const chipActive = "border-border bg-background text-foreground";

function InactiveChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(chipBase, chipInactive)}
    >
      <PlusCircleIcon className="size-3.5" />
      {label}
    </button>
  );
}

function ActiveChip({
  label,
  display,
  onOpen,
  onClear,
  trailing,
}: {
  label: string;
  display?: ReactNode;
  onOpen?: () => void;
  onClear: () => void;
  trailing?: ReactNode;
}) {
  return (
    <div className={cn(chipBase, chipActive, "pl-1.5")}>
      <button
        type="button"
        onClick={onClear}
        className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={`Clear ${label}`}
      >
        <XIcon className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-1.5 outline-none"
      >
        <span>{label}</span>
        {display !== undefined && (
          <>
            <span className="text-muted-foreground">|</span>
            <span className="text-primary">{display}</span>
          </>
        )}
        {trailing}
      </button>
    </div>
  );
}

function SortChip({
  config,
  sort,
  onToggle,
  onClear,
}: {
  config: Extract<DataViewFilter, { kind: "sort" }>;
  sort: { key: string; direction: "asc" | "desc" } | null;
  onToggle: (key: string) => void;
  onClear: () => void;
}) {
  const active = sort?.key === config.key;

  if (!active) {
    return <InactiveChip label={config.label} onClick={() => onToggle(config.key)} />;
  }

  return (
    <ActiveChip
      label={config.label}
      display={sort?.direction}
      onOpen={() => onToggle(config.key)}
      onClear={onClear}
    />
  );
}

function FilterChip({
  config,
  active,
  onApply,
  onClear,
}: {
  config: FilterConfig;
  active: ActiveFilter | null;
  onApply: (f: ActiveFilter) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const display = active ? formatFilterDisplay(config, active) : undefined;
  const isRange = config.dataType === "daterange";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {active ? (
        <div className={cn(chipBase, chipActive, "pl-1.5")}>
          <button
            type="button"
            onClick={onClear}
            className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Clear ${config.label}`}
          >
            <XIcon className="size-3.5" />
          </button>
          <PopoverTrigger
            render={
              <button type="button" className="inline-flex items-center gap-1.5 outline-none">
                <span>{config.label}</span>
                {display !== undefined && (
                  <>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-primary">{display}</span>
                  </>
                )}
                <ChevronDownIcon className="size-3.5 opacity-60" />
              </button>
            }
          />
        </div>
      ) : (
        <PopoverTrigger
          render={<InactiveChip label={config.label} onClick={() => setOpen(true)} />}
        />
      )}
      <PopoverContent
        align="start"
        className={cn("gap-0 p-0", isRange ? "w-[420px]" : "w-72")}
      >
        {isRange ? (
          <DateRangeFilter filter={config} onClose={() => setOpen(false)} />
        ) : (
          <FilterPopover
            filter={config}
            active={active}
            onApply={onApply}
            onClose={() => setOpen(false)}
            className="border-0 shadow-none"
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function MoreFiltersButton({
  filters,
  onSelect,
}: {
  filters: DataViewFilter[];
  onSelect: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  if (filters.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<InactiveChip label = "More filters"onClick={() => setOpen(true)} />}
      />
      <PopoverContent align="start" className="w-60 gap-1 p-1">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => { onSelect(f.key); setOpen(false); }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-primary hover:bg-muted"
          >
            <PlusCircleIcon className="size-4" />
            {f.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function ColumnToggle({
  table,
  columnVisibility,
}: {
  table: ReturnType<typeof useReactTable<unknown>>;
  columnVisibility: VisibilityState;
}) {
  const t = useTranslations();
  const hideable = table.getAllColumns().filter((c) => c.getCanHide());
  if (hideable.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="outline" size="sm">
          <SlidersHorizontalIcon className="size-3.5" data-icon="inline-start" /><span className="max-lg:hidden">{t("common.ui.columns")}</span><ChevronDownIcon className="size-3.5 opacity-60" data-icon="inline-end" />
        </Button>
      } />
      <DropdownMenuContent align="end" className="w-40">
        {hideable.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={columnVisibility[column.id] !== false}
            onCheckedChange={(v) => column.toggleVisibility(!!v)}
          >
            {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm text-muted-foreground">{message ?? "No data found"}</p>
    </div>
  );
}

function useGlobalShortcut(key: string | undefined, handler: () => void) {
  useEffect(() => {
    if (!key) return;
    const target = key.toLowerCase();
    const listener = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key.toLowerCase() !== target) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [key, handler]);
}

function isActive(
  f: DataViewFilter,
  state: { search: string; sort: { key: string } | null; filters: Record<string, unknown> },
): boolean {
  if (f.kind === "sort") return state.sort?.key === f.key;
  return f.key in state.filters;
}

export function DataViewModule<T extends { id: string }>({ config }: { config: DataViewConfig<T> }) {
  const t = useTranslations();
  const router = useRouter();
  const view = useDataView(config);
  const data = view.currentPage?.data ?? [];
  const refreshShortcut = config.refreshShortcut ?? "r";
  const primaryAction = config.primaryAction;
  const maxVisible = config.maxVisibleFilters ?? 3;

  const refetch = useCallback(() => view.refetch(), [view]);
  const triggerPrimary = useCallback(() => primaryAction?.onClick(), [primaryAction]);

  useGlobalShortcut(refreshShortcut, refetch);
  useGlobalShortcut(primaryAction?.shortcut, triggerPrimary);

  const [extraActive, setExtraActive] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    Object.fromEntries(config.columns.filter((c) => c.hidden).map((c) => [c.key, false])),
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filters = config.filters ?? [];
  const { visible, overflow } = useMemo(() => {
    const active = filters.filter((f) => isActive(f, view.filterState));
    const inactive = filters.filter((f) => !isActive(f, view.filterState));
    const remainingSlots = Math.max(0, maxVisible - active.length);
    const promotedKeys = new Set([
      ...inactive.slice(0, remainingSlots).map((f) => f.key),
      ...extraActive,
    ]);
    const visibleInactive = inactive.filter((f) => promotedKeys.has(f.key));
    const overflowList = inactive.filter((f) => !promotedKeys.has(f.key));
    const visibleList: DataViewFilter[] = [];
    for (const f of filters) {
      if (active.includes(f) || visibleInactive.includes(f)) visibleList.push(f);
    }
    return { visible: visibleList, overflow: overflowList };
  }, [filters, view.filterState, maxVisible, extraActive]);

  const promote = useCallback((key: string) => {
    setExtraActive((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, []);

  const tableSorting: SortingState = view.filterState.sort
    ? [{ id: view.filterState.sort.key, desc: view.filterState.sort.direction === "desc" }]
    : [];

  const columnDefs = useState<ColumnDef<T, unknown>[]>(() => {
    const defs: ColumnDef<T, unknown>[] = [];

    if (config.selectionConfig?.enabled) {
      defs.push({
        id: "_select",
        enableHiding: false,
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
      });
    }

    for (const col of config.columns) {
      defs.push({
        id: col.key,
        accessorKey: col.key,
        header: col.label,
        enableHiding: true,
        enableSorting: true,
        cell: ({ getValue, row }) => (
          <CellValue column={col} value={getValue()} row={row.original} />
        ),
        meta: { align: col.align, width: col.width },
      });
    }

    if (config.rowActions) {
      defs.push({
        id: "_actions",
        header: () => <span className="sr-only">{t("common.ui.actions")}</span>,
        enableHiding: false,
        enableSorting: false,
        cell: ({ row }) => <>{config.rowActions!(row.original)}</>,
      });
    }

    return defs;
  })[0];

  const table = useReactTable({
    data,
    columns: columnDefs,
    state: { sorting: tableSorting, columnVisibility, rowSelection },
    getRowId: (row) => row.id,
    manualSorting: true,
    enableRowSelection: config.selectionConfig?.enabled ?? false,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(tableSorting) : updater;
      if (next.length > 0) {
        view.setSortExplicit(next[0].id, next[0].desc);
      } else {
        view.clearSort();
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
      config.selectionConfig?.onSelectionChange?.(
        Object.keys(next).filter((k) => next[k]).map((k) => data.find((r) => r.id === k)).filter((r): r is T => r !== undefined),
      );
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const visibleLeafColumns = table.getVisibleLeafColumns();

  const renderChip = (f: DataViewFilter) => {
    if (f.kind === "sort") {
      return (
        <SortChip
          key={f.key}
          config={f}
          sort={view.filterState.sort}
          onToggle={view.setSort}
          onClear={view.clearSort}
        />
      );
    }
    return (
      <FilterChip
        key={f.key}
        config={f}
        active={view.filterState.filters[f.key] ?? null}
        onApply={(a) => view.setFilter(f.key, a)}
        onClear={() => view.clearFilter(f.key)}
      />
    );
  };

  const hasSearch = config.searchable ?? false;

  return (
    <div className="space-y-3">
      {hasSearch && (
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={view.filterState.search}
            onChange={(e) => view.setSearch(e.target.value)}
            placeholder="Search..."
            className="h-8 max-w-lg w-full rounded-md border bg-transparent pl-9 pr-3 text-sm outline-none focus:border-ring"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="shrink-0 text-sm text-muted-foreground">
            Total {view.totalCount} item
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {visible.map(renderChip)}
            <MoreFiltersButton
              filters={overflow}
              onSelect={promote}
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={view.isLoading}
            aria-label={t("common.ui.refresh")}
          >
            <RefreshCwIcon className="size-3.5" data-icon="inline-start" />
            <Kbd>{refreshShortcut.toUpperCase()}</Kbd>
          </Button>
          <ColumnToggle
            table={table as ReturnType<typeof useReactTable<unknown>>}
            columnVisibility={columnVisibility}
          />
          {primaryAction && (
            <Button variant="outline" size="sm" onClick={triggerPrimary}>
              {primaryAction.icon ?? <PlusIcon className="size-3.5" data-icon="inline-start" />}
              {primaryAction.label}
              {primaryAction.shortcut && <Kbd>{primaryAction.shortcut.toUpperCase()}</Kbd>}
            </Button>
          )}
          {config.headerActions}
        </div>
      </div>

      {!view.isLoading && data.length === 0 ? (
        <EmptyState message={config.emptyMessage} />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as { align?: string; width?: string } | undefined;
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground",
                          meta?.align === "center" && "text-center",
                          meta?.align === "right" && "text-right",
                          canSort && !view.isLoading && "cursor-pointer select-none",
                        )}
                        style={meta?.width ? { width: meta.width } : undefined}
                        onClick={canSort && !view.isLoading ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            sorted === "asc" ? (
                              <ArrowUpIcon className="size-3 text-foreground" />
                            ) : sorted === "desc" ? (
                              <ArrowDownIcon className="size-3 text-foreground" />
                            ) : (
                              <ChevronsUpDownIcon className="size-3 opacity-30" />
                            )
                          )}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {view.isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    {visibleLeafColumns.map((col) => (
                      <td key={col.id} className="px-4 py-2.5">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
                : table.getRowModel().rows.map((row) => {
                  const href = config.rowHref?.(row.original);
                  return (
                    <tr
                      key={row.id}
                      onClick={
                        href
                          ? (e) => {
                            if ((e.target as HTMLElement).closest(
                              "a,button,input,label,select,textarea,[role='checkbox'],[role='menuitem']",
                            ))
                              return;
                            if (e.metaKey || e.ctrlKey) {
                              window.open(href, "_blank");
                              return;
                            }
                            router.push(href);
                          }
                          : undefined
                      }
                      onKeyDown={
                        href
                          ? (e) => {
                            if (e.key === "Enter" && e.currentTarget === e.target) {
                              router.push(href);
                            }
                          }
                          : undefined
                      }
                      role={href ? "link" : undefined}
                      tabIndex={href ? 0 : undefined}
                      className={cn(
                        "border-b last:border-b-0 hover:bg-muted/30",
                        href && "cursor-pointer",
                        row.getIsSelected() && "bg-muted/50",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const meta = cell.column.columnDef.meta as { align?: string } | undefined;
                        return (
                          <td
                            key={cell.id}
                            className={cn(
                              "px-4 py-2.5",
                              meta?.align === "center" && "text-center",
                              meta?.align === "right" && "text-right",
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {(view.hasPreviousPage || view.hasNextPage) && (
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
      )}
    </div>
  );
}
