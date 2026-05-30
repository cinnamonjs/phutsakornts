"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ActiveFilter, DataViewFilter, FilterOperator } from "@/components/module/data-view/types";
import { useTranslations } from "next-intl";

const DURATION_UNITS = [
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
];

type FilterConfig = Extract<DataViewFilter, { kind: "filter" }>;

function formatAmount(value: string | number, currency?: string): string {
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  if (!currency) return n.toLocaleString();
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}

export function formatFilterDisplay(f: FilterConfig, active: ActiveFilter): string {
  const op = f.operators.find((o) => o.id === active.op);
  const v = active.value;
  const arr = Array.isArray(v) ? v : [v];

  if (op?.inputKind === "none") return op.label;

  switch (f.dataType) {
    case "text": {
      if (op?.id === "contains") return String(v);
      if (op?.id === "equals") return `Exactly ${v}`;
      return `${op?.label ?? ""} ${v}`.trim();
    }
    case "number": {
      if (op?.id === "eq") return `Exactly ${v}`;
      if (op?.id === "between") return `${arr[0]}–${arr[1]}`;
      return `${op?.label ?? ""} ${v}`.trim();
    }
    case "amount": {
      if (op?.id === "between") {
        return `${formatAmount(arr[0] ?? "", f.currency)}–${formatAmount(arr[1] ?? "", f.currency)}`;
      }
      const amt = formatAmount(String(v), f.currency);
      if (op?.id === "eq") return `Exactly ${amt}`;
      return `${op?.label ?? ""} ${amt}`.trim();
    }
    case "date": {
      if (op?.id === "in_last") {
        const [n, unit] = String(v).split(" ");
        return `in last ${n} ${unit}`;
      }
      if (op?.id === "between") return `${arr[0]} – ${arr[1]}`;
      return `${op?.label ?? ""} ${v}`.trim();
    }
    case "daterange":
      return `${arr[0] ?? ""} – ${arr[1] ?? ""}`.trim();
    case "boolean":
      return op?.id === "is_true" ? "Yes" : "No";
    case "select": {
      const label = f.options?.find((o) => o.value === v)?.label ?? String(v);
      return `${op?.label ?? "is"} ${label}`;
    }
    case "multiselect": {
      const labels = arr.map((x) => f.options?.find((o) => o.value === x)?.label ?? x);
      return `${op?.label ?? ""} ${labels.join(", ")}`.trim();
    }
  }
}

interface ValueInputProps {
  operator: FilterOperator;
  filter: FilterConfig;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

function ValueInput({ operator, filter: f, value, onChange }: ValueInputProps) {
  const t = useTranslations();
  const arr = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  switch (operator.inputKind) {
    case "none":
      return null;

    case "text":
      return (
        <input
          type="text"
          value={Array.isArray(value) ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("common.ui.value")}
          className="h-9 w-full rounded-md border bg-transparent px-3 text-xs outline-none focus:border-ring"
        />
      );

    case "number":
      return (
        <input
          type="number"
          value={Array.isArray(value) ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="h-9 w-full rounded-md border bg-transparent px-3 text-xs outline-none focus:border-ring"
        />
      );

    case "numberrange":
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={arr[0] ?? ""}
            onChange={(e) => onChange([e.target.value, arr[1] ?? ""])}
            placeholder="min"
            className="h-9 w-full rounded-md border bg-transparent px-3 text-xs outline-none focus:border-ring"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            value={arr[1] ?? ""}
            onChange={(e) => onChange([arr[0] ?? "", e.target.value])}
            placeholder="max"
            className="h-9 w-full rounded-md border bg-transparent px-3 text-xs outline-none focus:border-ring"
          />
        </div>
      );

    case "date":
      return (
        <input
          type="date"
          value={Array.isArray(value) ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full rounded-md border bg-transparent px-3 text-xs outline-none focus:border-ring"
        />
      );

    case "daterange":
      return (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={arr[0] ?? ""}
            onChange={(e) => onChange([e.target.value, arr[1] ?? ""])}
            className="h-9 w-full rounded-md border bg-transparent px-3 text-xs outline-none focus:border-ring"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="date"
            value={arr[1] ?? ""}
            onChange={(e) => onChange([arr[0] ?? "", e.target.value])}
            className="h-9 w-full rounded-md border bg-transparent px-3 text-xs outline-none focus:border-ring"
          />
        </div>
      );

    case "duration": {
      const [n = "", unit = "days"] = (Array.isArray(value) ? [] : String(value).split(" "));
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={n}
            onChange={(e) => onChange(`${e.target.value} ${unit}`.trim())}
            placeholder="0"
            className="h-9 w-20 rounded-md border bg-transparent px-3 text-xs outline-none focus:border-ring"
          />
          <Select
            value={unit}
            onValueChange={(v) => onChange(`${n} ${v ?? "days"}`.trim())}
          >
            <SelectTrigger size="sm" className="h-9 flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_UNITS.map((u) => (
                <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    case "select":
      return (
        <Select
          value={Array.isArray(value) ? "" : value}
          onValueChange={(v) => onChange(v ?? "")}
        >
          <SelectTrigger size="sm" className="h-9 w-full">
            <SelectValue placeholder={t("common.ui.choose")} />
          </SelectTrigger>
          <SelectContent>
            {f.options?.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multiselect": {
      const selected = new Set(arr);
      const toggle = (v: string) => {
        const next = new Set(selected);
        if (next.has(v)) next.delete(v);
        else next.add(v);
        onChange(Array.from(next));
      };
      return (
        <div className="flex max-h-52 flex-col gap-1.5 overflow-y-auto rounded-md border p-2">
          {f.options?.map((o) => (
            <label key={o.value} className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 hover:bg-muted">
              <Checkbox
                checked={selected.has(o.value)}
                onCheckedChange={() => toggle(o.value)}
              />
              <span className="text-xs">{o.label}</span>
            </label>
          ))}
        </div>
      );
    }
  }
}

interface FilterPopoverProps {
  filter: FilterConfig;
  active: ActiveFilter | null;
  onApply: (active: ActiveFilter) => void;
  onClose: () => void;
  className?: string;
}

export function FilterPopover({
  filter: f,
  active,
  onApply,
  onClose,
  className,
}: FilterPopoverProps) {
  const t = useTranslations();
  const initialOp = active?.op ?? f.defaultOp ?? f.operators[0]?.id;
  const [opId, setOpId] = useState<string>(initialOp);
  const [value, setValue] = useState<string | string[]>(active?.value ?? "");
  const op = useMemo(() => f.operators.find((o) => o.id === opId) ?? f.operators[0], [f.operators, opId]);

  useEffect(() => {
    if (op?.inputKind === "none") return;
    if (active && active.op === opId) return;
    if (op?.inputKind === "multiselect" || op?.inputKind === "numberrange" || op?.inputKind === "daterange") {
      setValue((v) => (Array.isArray(v) ? v : []));
    } else {
      setValue((v) => (Array.isArray(v) ? "" : v));
    }
  }, [opId, op, active]);

  const handleApply = useCallback(() => {
    if (!op) return;
    const isEmpty =
      op.inputKind !== "none" &&
      (value === "" || value == null ||
        (Array.isArray(value) && value.every((v) => !v)));
    if (isEmpty) return;

    const finalValue: string | string[] = op.inputKind === "none" ? "" : value;
    onApply({
      op: op.id,
      value: finalValue,
      display: formatFilterDisplay(f, { op: op.id, value: finalValue, display: "" }),
    });
    onClose();
  }, [op, value, onApply, onClose, f]);

  return (
    <div
      className={cn(
        "w-72 space-y-3 rounded-lg border bg-popover p-3 text-xs shadow-md",
        className,
      )}
    >
      <p className="font-medium">{t("common.ui.filterBy")}<span className="text-muted-foreground">{f.label.toLowerCase()}</span>
      </p>
      <Select 
        items={f.operators.map((o) => ({
          label: o.label,
          value: o.id,
        }))}
        value={opId} 
        onValueChange={(v) => v && setOpId(v)}
      >
        <SelectTrigger size="sm" className="h-9 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {f.operators.map((o) => (
            <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {op?.inputKind !== "none" && (
        <ValueInput operator={op!} filter={f} value={value} onChange={setValue} />
      )}
      <Button
        variant="default"
        size="sm"
        className="w-full"
        onClick={handleApply}
      >{t("common.ui.apply")}</Button>
    </div>
  );
}
