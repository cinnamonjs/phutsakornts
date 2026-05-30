"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { ArrowDownLeft, ArrowUpRight, User, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NODE_WIDTH } from "@/components/module/activity-tree/tree/constants";
import type { ActivityNode as ActivityNodeType } from "@/components/module/activity-tree/tree/types";
import { useActivityTreeStore } from "@/components/module/activity-tree/tree/store";

function scaled(amount: number, factor: number): string {
  return (amount / (factor || 1)).toFixed(2);
}

const handleClass =
  "!size-2.5 !border-2 !border-background !bg-muted-foreground";

export function ActivityNode({ id, data }: NodeProps<ActivityNodeType>) {
  const selected = useActivityTreeStore((s) => s.selectedNodeId === id);

  const isTransaction = data.kind === "transaction";

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
      {isTransaction && (
        <Handle type="target" position={Position.Top} className={handleClass} />
      )}

      {data.kind === "balance" && (
        <div className="flex items-start gap-2.5 p-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Wallet className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {data.balance.name || data.balance.id}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {data.balance.currency} balance
            </p>
            <div className="mt-1 flex gap-3 text-xs tabular-nums">
              <span>
                avail{" "}
                {scaled(data.balance.available, data.balance.scaling_factor)}
              </span>
              <span className="text-muted-foreground">
                hold {scaled(data.balance.hold, data.balance.scaling_factor)}
              </span>
            </div>
          </div>
        </div>
      )}

      {data.kind === "customer" && (
        <div className="flex items-start gap-2.5 p-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <User className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">
              {data.customer.name || data.customer.id}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {data.customer.email}
            </p>
          </div>
        </div>
      )}

      {data.kind === "transaction" && (
        <div className="flex items-start gap-2.5 p-3">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              data.tx.amount < 0
                ? "bg-destructive/10 text-destructive"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            )}
          >
            {data.tx.amount < 0 ? (
              <ArrowUpRight className="size-4" />
            ) : (
              <ArrowDownLeft className="size-4" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-xs font-medium tabular-nums">
                {scaled(data.tx.amount, data.tx.scaling_factor)}{" "}
                {data.tx.currency}
              </p>
              {data.tx.event_type && (
                <Badge variant="outline" className="text-[10px]">
                  {data.tx.event_type}
                </Badge>
              )}
            </div>
            <p className="truncate text-[11px] text-muted-foreground">
              {data.tx.state} · {new Date(data.tx.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="size-2! border-2! border-background! bg-primary!"
      />
    </div>
  );
}
