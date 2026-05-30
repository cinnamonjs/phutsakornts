import dagre from "dagre";
import {
  NODE_HEIGHT,
  NODE_WIDTH,
} from "@/components/module/workflow-builder/workflow/constants";
import type {
  WFEdge,
  WFNode,
} from "@/components/module/workflow-builder/workflow/flow-types";

export function layoutWorkflow(nodes: WFNode[], edges: WFEdge[]): WFNode[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "TB", ranksep: 64, nodesep: 48 });

  for (const node of nodes) {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target);
  }

  dagre.layout(graph);

  return nodes.map((node) => {
    const positioned = graph.node(node.id);
    if (!positioned) return node;
    return {
      ...node,
      position: {
        x: positioned.x - NODE_WIDTH / 2,
        y: positioned.y - NODE_HEIGHT / 2,
      },
    };
  });
}
