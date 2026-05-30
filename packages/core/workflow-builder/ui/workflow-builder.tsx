"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { useEffect } from "react";
import { registerBuiltins } from "@/components/module/workflow-builder/register-builtins";
import { buildDemoWorkflow } from "@/components/module/workflow-builder/ui/demo-workflow";
import { NodeConfigPanel } from "@/components/module/workflow-builder/ui/node-config-panel";
import { NodePalette } from "@/components/module/workflow-builder/ui/node-palette";
import { Toolbar } from "@/components/module/workflow-builder/ui/toolbar";
import { WorkflowCanvas } from "@/components/module/workflow-builder/ui/workflow-canvas";
import { useWorkflowStore } from "@/components/module/workflow-builder/workflow/store";

registerBuiltins();

export function WorkflowBuilder() {
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const empty = useWorkflowStore((s) => s.nodes.length === 0);

  useEffect(() => {
    if (empty) loadWorkflow(buildDemoWorkflow());
  }, [empty, loadWorkflow]);

  return (
    <ReactFlowProvider>
      <div className="flex h-svh flex-col">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <NodePalette />
          <WorkflowCanvas />
          <NodeConfigPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
