import { nodeRegistry } from "@/components/module/workflow-builder/registry";
import type { Workflow } from "@/components/module/workflow-builder/types";

function config(type: string): Record<string, unknown> {
  const def = nodeRegistry.get(type);
  return def ? structuredClone(def.defaultConfig as Record<string, unknown>) : {};
}

export function buildDemoWorkflow(): Workflow {
  const now = new Date().toISOString();
  const at = { x: 0, y: 0 };

  const nodes = [
    { id: "trigger", type: "trigger.payment-created" },
    { id: "guard", type: "operator.condition" },
    { id: "route", type: "action.route-provider" },
    { id: "settle", type: "flow.delay" },
    { id: "refund", type: "action.refund" },
    { id: "stop", type: "flow.stop" },
  ].map((n) => ({
    id: n.id,
    type: n.type,
    position: at,
    config: config(n.type),
  }));

  const edges = [
    { id: "e1", source: "trigger", target: "guard", sourceHandle: "out" },
    { id: "e2", source: "guard", target: "route", sourceHandle: "true", label: "Is true" },
    { id: "e3", source: "guard", target: "stop", sourceHandle: "false", label: "Is false" },
    { id: "e4", source: "route", target: "settle", sourceHandle: "success", label: "Created" },
    { id: "e5", source: "route", target: "refund", sourceHandle: "error", label: "Declined" },
    { id: "e6", source: "settle", target: "stop", sourceHandle: "out" },
  ];

  return {
    nodes,
    edges,
    metadata: {
      id: "demo",
      name: "Payment routing demo",
      version: "1.0.0",
      published: false,
      createdAt: now,
      updatedAt: now,
    },
  };
}
