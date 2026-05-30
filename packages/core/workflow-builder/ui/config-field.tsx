"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { NodeField } from "@/components/module/workflow-builder/types";

interface ConfigFieldProps {
  field: NodeField;
  value: unknown;
  onChange: (value: unknown) => void;
}

function asString(value: unknown): string {
  return value == null ? "" : String(value);
}

function KeyValueEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (value: Record<string, string>) => void;
}) {
  const record =
    value && typeof value === "object" ? (value as Record<string, string>) : {};
  const entries = Object.entries(record);

  const emit = (next: [string, string][]) => {
    const obj: Record<string, string> = {};
    for (const [k, v] of next) if (k) obj[k] = v;
    onChange(obj);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {entries.map(([k, v], i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input
            value={k}
            placeholder="key"
            className="h-8 flex-1"
            onChange={(e) => {
              const next = [...entries];
              next[i] = [e.target.value, v];
              emit(next);
            }}
          />
          <Input
            value={v}
            placeholder="value"
            className="h-8 flex-1"
            onChange={(e) => {
              const next = [...entries];
              next[i] = [k, e.target.value];
              emit(next);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => emit(entries.filter((_, idx) => idx !== i))}
          >
            <X />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => emit([...entries, ["", ""]])}
      >
        <Plus /> Add pair
      </Button>
    </div>
  );
}

function Control({ field, value, onChange }: ConfigFieldProps) {
  switch (field.kind) {
    case "text":
      return (
        <Input
          value={asString(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          value={asString(value)}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(e.target.value === "" ? undefined : Number(e.target.value))
          }
        />
      );
    case "textarea":
    case "json":
      return (
        <Textarea
          value={asString(value)}
          placeholder={field.placeholder}
          className={field.kind === "json" ? "font-mono text-xs" : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "select":
      return (
        <Select
          value={asString(value)}
          onValueChange={(v) => onChange(v)}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "switch":
      return (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(c) => onChange(c)}
        />
      );
    case "keyvalue":
      return <KeyValueEditor value={value} onChange={onChange} />;
  }
}

export function ConfigField({ field, value, onChange }: ConfigFieldProps) {
  const inline = field.kind === "switch";
  return (
    <div
      className={
        inline
          ? "flex items-center justify-between gap-3"
          : "flex flex-col gap-1.5"
      }
    >
      <div className={inline ? "flex flex-col gap-0.5" : undefined}>
        <Label className="opacity-80">{field.label}</Label>
        {field.description && (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        )}
      </div>
      <Control field={field} value={value} onChange={onChange} />
    </div>
  );
}
