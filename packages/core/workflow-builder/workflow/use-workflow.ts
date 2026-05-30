import { nodeRegistry } from "@/components/module/workflow-builder/registry";
import type { AnyNodeDefinition } from "@/components/module/workflow-builder/types";
import type { WFNode } from "@/components/module/workflow-builder/workflow/flow-types";
import { useWorkflowStore } from "@/components/module/workflow-builder/workflow/store";

export function useSelectedNode(): WFNode | null {
  return useWorkflowStore((s) => {
    if (!s.selectedNodeId) return null;
    return s.nodes.find((n) => n.id === s.selectedNodeId) ?? null;
  });
}

export function useNodeDefinition(type?: string): AnyNodeDefinition | undefined {
  if (!type) return undefined;
  return nodeRegistry.get(type);
}

export function useCanUndo(): boolean {
  return useWorkflowStore((s) => s.past.length > 0);
}

export function useCanRedo(): boolean {
  return useWorkflowStore((s) => s.future.length > 0);
}
