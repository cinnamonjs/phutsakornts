"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { nodeRegistry } from "@/components/module/workflow-builder/registry";
import type { AnyNodeDefinition } from "@/components/module/workflow-builder/types";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
} from "@/components/module/workflow-builder/workflow/constants";

interface NodeMenuProps {
  onPick: (type: string) => void;
  className?: string;
}

function matches(def: AnyNodeDefinition, q: string): boolean {
  if (!q) return true;
  const hay = [def.name, def.description, def.badge, ...(def.keywords ?? [])]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function NodeMenu({ onPick, className }: NodeMenuProps) {
  const [query, setQuery] = useState("");
  const all = useMemo(() => nodeRegistry.list(), []);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORY_ORDER.map((category) => ({
      category,
      defs: all.filter((d) => d.category === category && matches(d, q)),
    })).filter((g) => g.defs.length > 0);
  }, [all, query]);

  return (
    <div className={className}>
      <div className="relative p-2">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search nodes…"
          className="h-9 rounded-lg pl-9"
        />
      </div>
      <ScrollArea className="h-[min(60vh,28rem)]">
        <div className="flex flex-col gap-3 p-2 pt-0">
          {grouped.map(({ category, defs }) => {
            const meta = CATEGORY_META[category];
            const Icon = meta.Icon;
            return (
              <div key={category} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 px-1 py-1 text-xs font-medium text-muted-foreground">
                  <Icon className="size-3.5" />
                  {meta.label}
                </div>
                {defs.map((def) => (
                  <button
                    key={def.type}
                    type="button"
                    onClick={() => onPick(def.type)}
                    className="flex w-full items-start gap-2.5 rounded-lg border border-transparent px-2 py-2 text-left transition-colors hover:border-border hover:bg-muted"
                  >
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                      {def.icon}
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        {def.name}
                        {def.badge && (
                          <Badge variant="outline" className="text-[10px]">
                            {def.badge}
                          </Badge>
                        )}
                      </span>
                      {def.description && (
                        <span className="line-clamp-2 text-xs text-muted-foreground">
                          {def.description}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
          {grouped.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No nodes match “{query}”.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
