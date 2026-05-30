import type { WorkflowNodeDefinition } from "@/components/module/workflow-builder/types";

export function defineNode<TConfig>(
  def: WorkflowNodeDefinition<TConfig>,
): WorkflowNodeDefinition<TConfig> {
  return def;
}
