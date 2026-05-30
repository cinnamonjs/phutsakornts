"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { nodeRegistry } from "@/components/module/workflow-builder/registry";
import {
  CATEGORY_META,
  NODE_WIDTH,
} from "@/components/module/workflow-builder/workflow/constants";
import type { WFNode } from "@/components/module/workflow-builder/workflow/flow-types";
import { useWorkflowStore } from "@/components/module/workflow-builder/workflow/store";

export function WorkflowNode({ id, data }: NodeProps<WFNode>) {
  const def = nodeRegistry.get(data.type);
  const selected = useWorkflowStore((s) => s.selectedNodeId === id);

  if (!def) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-background px-3 py-2 text-sm text-destructive">
        <HelpCircle className="size-4" /> Unknown node: {data.type}
      </div>
    );
  }

  const meta = CATEGORY_META[def.category];
  const outputs = def.outputs;

  return (
    <div
      style={{ width: NODE_WIDTH }}
      className={cn(
        "rounded-2xl border bg-background shadow-sm transition-shadow",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border hover:shadow-md",
      )}
    >
      {def.inputs.map((port) => (
        <Handle
          key={port.id}
          id={port.id}
          type="target"
          position={Position.Top}
          className="!size-2.5 !border-2 !border-background !bg-muted-foreground"
        />
      ))}

      <div className="flex items-start gap-2.5 p-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          {def.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium">{def.name}</p>
            {def.badge && (
              <Badge variant="outline" className="text-[10px]">
                {def.badge}
              </Badge>
            )}
          </div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {meta.label}
          </p>
        </div>
      </div>

      {outputs.length > 0 && (
        <div className="flex items-center justify-around gap-2 border-t px-3 py-1.5">
          {outputs.map((port) => (
            <span
              key={port.id}
              className="text-[11px] text-muted-foreground"
            >
              {port.label ?? "Out"}
            </span>
          ))}
        </div>
      )}

      {outputs.map((port, i) => (
        <Handle
          key={port.id}
          id={port.id}
          type="source"
          position={Position.Bottom}
          style={{ left: `${((i + 1) / (outputs.length + 1)) * 100}%` }}
          className="!size-2.5 !border-2 !border-background !bg-primary"
        />
      ))}
    </div>
  );
}
