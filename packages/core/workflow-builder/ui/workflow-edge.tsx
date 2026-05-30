"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NodeMenu } from "@/components/module/workflow-builder/ui/node-menu";
import { useWorkflowStore } from "@/components/module/workflow-builder/workflow/store";

export function WorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  markerEnd,
}: EdgeProps) {
  const [open, setOpen] = useState(false);
  const insertOnEdge = useWorkflowStore((s) => s.insertOnEdge);

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          className="nodrag nopan pointer-events-auto absolute flex items-center gap-1"
        >
          {label && (
            <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">
              {label}
            </span>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className="flex size-5 items-center justify-center rounded-full border bg-background text-muted-foreground opacity-0 transition hover:border-primary hover:text-primary group-hover/canvas:opacity-100 data-[popup-open]:opacity-100"
              aria-label="Insert node"
            >
              <Plus className="size-3" />
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
              <NodeMenu
                onPick={(type) => {
                  insertOnEdge(id, type);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
