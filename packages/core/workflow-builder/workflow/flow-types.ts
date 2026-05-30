import type { Edge, Node } from "@xyflow/react";

export interface WorkflowNodeData extends Record<string, unknown> {
  type: string;
  config: Record<string, unknown>;
}

export type WFNode = Node<WorkflowNodeData>;
export type WFEdge = Edge;
