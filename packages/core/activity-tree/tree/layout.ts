import dagre from "dagre";
import {
  NODE_HEIGHT,
  NODE_WIDTH,
} from "@/components/module/activity-tree/tree/constants";
import type {
  ActivityEdge,
  ActivityNode,
} from "@/components/module/activity-tree/tree/types";

export function layoutTree(
  nodes: ActivityNode[],
  edges: ActivityEdge[],
): ActivityNode[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "TB", ranksep: 48, nodesep: 80 });

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
