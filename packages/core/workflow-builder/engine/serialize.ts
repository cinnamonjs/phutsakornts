import { nanoid } from "nanoid";
import type {
  Workflow,
  WorkflowEdge,
  WorkflowNode,
} from "@/components/module/workflow-builder/types";
import { workflowSchema } from "@/components/module/workflow-builder/workflow/schema";
import type {
  WFEdge,
  WFNode,
} from "@/components/module/workflow-builder/workflow/flow-types";

interface ToWorkflowParams {
  nodes: WFNode[];
  edges: WFEdge[];
  name: string;
  published: boolean;
  id?: string;
  createdAt?: string;
}

export function toWorkflow(params: ToWorkflowParams): Workflow {
  const now = new Date().toISOString();
  const nodes: WorkflowNode[] = params.nodes.map((n) => ({
    id: n.id,
    type: n.data.type,
    position: n.position,
    config: n.data.config,
  }));
  const edges: WorkflowEdge[] = params.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: e.targetHandle ?? undefined,
    label: typeof e.label === "string" ? e.label : undefined,
  }));
  return {
    nodes,
    edges,
    metadata: {
      id: params.id ?? nanoid(),
      name: params.name,
      version: "1.0.0",
      published: params.published,
      createdAt: params.createdAt ?? now,
      updatedAt: now,
    },
  };
}

export function serializeWorkflow(workflow: Workflow): string {
  return JSON.stringify(workflow, null, 2);
}

export function deserializeWorkflow(input: string | unknown): Workflow {
  const raw = typeof input === "string" ? JSON.parse(input) : input;
  return workflowSchema.parse(raw);
}
