"use client";

import {
  Background,
  BackgroundVariant,
  type ColorMode,
  Controls,
  MiniMap,
  type NodeTypes,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useShallow } from "zustand/react/shallow";
import { ActivityNode } from "@/components/module/activity-tree/ui/activity-node";
import { LoadMoreNode } from "@/components/module/activity-tree/ui/load-more-node";
import { useActivityTreeStore } from "@/components/module/activity-tree/tree/store";

const nodeTypes: NodeTypes = {
  balance: ActivityNode,
  customer: ActivityNode,
  transaction: ActivityNode,
  "load-more": LoadMoreNode,
};

export function ActivityCanvas({ colorMode = "system" }: { colorMode?: ColorMode }) {
  const { nodes, edges, onNodesChange, onEdgesChange } = useActivityTreeStore(
    useShallow((s) => ({
      nodes: s.nodes,
      edges: s.edges,
      onNodesChange: s.onNodesChange,
      onEdgesChange: s.onEdgesChange,
    })),
  );
  const selectNode = useActivityTreeStore((s) => s.selectNode);

  return (
    <div className="relative flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        nodesConnectable={false}
        nodesDraggable={false}
        deleteKeyCode={null}
        colorMode={colorMode}
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable className="!rounded-xl" />
      </ReactFlow>
    </div>
  );
}
