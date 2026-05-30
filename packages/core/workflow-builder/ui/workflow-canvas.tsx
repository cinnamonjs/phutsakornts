"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  type EdgeTypes,
  MiniMap,
  type NodeTypes,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useShallow } from "zustand/react/shallow";
import { WorkflowEdge } from "@/components/module/workflow-builder/ui/workflow-edge";
import { WorkflowNode } from "@/components/module/workflow-builder/ui/workflow-node";
import { useWorkflowStore } from "@/components/module/workflow-builder/workflow/store";

const nodeTypes: NodeTypes = { workflow: WorkflowNode };
const edgeTypes: EdgeTypes = { workflow: WorkflowEdge };
const defaultEdgeOptions = { type: "workflow" };

export function WorkflowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useWorkflowStore(
      useShallow((s) => ({
        nodes: s.nodes,
        edges: s.edges,
        onNodesChange: s.onNodesChange,
        onEdgesChange: s.onEdgesChange,
        onConnect: s.onConnect,
      })),
    );
  const selectNode = useWorkflowStore((s) => s.selectNode);

  return (
    <div className="group/canvas relative flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        deleteKeyCode={null}
        colorMode="system"
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
