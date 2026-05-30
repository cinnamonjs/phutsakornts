"use client";

import { NodeMenu } from "@/components/module/workflow-builder/ui/node-menu";
import { useWorkflowStore } from "@/components/module/workflow-builder/workflow/store";

export function NodePalette() {
  const addNode = useWorkflowStore((s) => s.addNode);
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-background">
      <div className="border-b px-3 py-3">
        <h2 className="text-sm font-medium">Add node</h2>
        <p className="text-xs text-muted-foreground">
          Click to drop it onto the canvas
        </p>
      </div>
      <NodeMenu className="flex flex-1 flex-col" onPick={(type) => addNode(type)} />
    </aside>
  );
}
