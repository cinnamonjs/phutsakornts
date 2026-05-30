import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { nodeRegistry } from "@/components/module/workflow-builder/registry";
import type { Workflow } from "@/components/module/workflow-builder/types";
import { layoutWorkflow } from "@/components/module/workflow-builder/workflow/layout";
import type {
  WFEdge,
  WFNode,
} from "@/components/module/workflow-builder/workflow/flow-types";

interface Snapshot {
  nodes: WFNode[];
  edges: WFEdge[];
}

interface WorkflowState extends Snapshot {
  selectedNodeId: string | null;
  name: string;
  published: boolean;
  dirty: boolean;
  past: Snapshot[];
  future: Snapshot[];
  clipboard: Snapshot | null;
}

interface WorkflowActions {
  onNodesChange: (changes: NodeChange<WFNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<WFEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string, position?: { x: number; y: number }) => string | null;
  insertOnEdge: (edgeId: string, type: string) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  changeNodeType: (id: string, type: string) => void;
  setNodeConfig: (id: string, config: Record<string, unknown>) => void;
  selectNode: (id: string | null) => void;
  copySelection: () => void;
  paste: () => void;
  undo: () => void;
  redo: () => void;
  relayout: () => void;
  loadWorkflow: (workflow: Workflow) => void;
  reset: () => void;
  setName: (name: string) => void;
  setPublished: (published: boolean) => void;
}

export type WorkflowStore = WorkflowState & WorkflowActions;

function makeNode(type: string, position: { x: number; y: number }): WFNode | null {
  const def = nodeRegistry.get(type);
  if (!def) return null;
  return {
    id: nanoid(),
    type: "workflow",
    position,
    data: {
      type,
      config: structuredClone(def.defaultConfig) as Record<string, unknown>,
    },
  };
}

function edgeLabel(sourceType: string, sourceHandle?: string | null): string | undefined {
  if (!sourceHandle) return undefined;
  const def = nodeRegistry.get(sourceType);
  return def?.outputs.find((p) => p.id === sourceHandle)?.label;
}

const initialMetadataName = "Untitled workflow";

export const useWorkflowStore = create<WorkflowStore>((set, get) => {
  const commit = () => {
    const { nodes, edges, past } = get();
    set({
      past: [...past, { nodes, edges }],
      future: [],
      dirty: true,
    });
  };

  return {
    nodes: [],
    edges: [],
    selectedNodeId: null,
    name: initialMetadataName,
    published: false,
    dirty: false,
    past: [],
    future: [],
    clipboard: null,

    onNodesChange: (changes) => {
      set({ nodes: applyNodeChanges(changes, get().nodes) });
    },

    onEdgesChange: (changes) => {
      set({ edges: applyEdgeChanges(changes, get().edges) });
    },

    onConnect: (connection) => {
      const source = get().nodes.find((n) => n.id === connection.source);
      const label = source
        ? edgeLabel(source.data.type, connection.sourceHandle)
        : undefined;
      commit();
      set({
        edges: addEdge(
          { ...connection, id: nanoid(), label, type: "workflow" },
          get().edges,
        ),
      });
    },

    addNode: (type, position) => {
      const node = makeNode(type, position ?? { x: 0, y: 0 });
      if (!node) return null;
      commit();
      set({ nodes: [...get().nodes, node] });
      get().relayout();
      return node.id;
    },

    insertOnEdge: (edgeId, type) => {
      const { edges, nodes } = get();
      const edge = edges.find((e) => e.id === edgeId);
      if (!edge) return;
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);
      if (!source || !target) return;
      const node = makeNode(type, {
        x: (source.position.x + target.position.x) / 2,
        y: (source.position.y + target.position.y) / 2,
      });
      if (!node) return;
      commit();
      const remaining = edges.filter((e) => e.id !== edgeId);
      const inserted: WFEdge[] = [
        {
          id: nanoid(),
          source: edge.source,
          target: node.id,
          sourceHandle: edge.sourceHandle,
          label: edge.label,
          type: "workflow",
        },
        { id: nanoid(), source: node.id, target: edge.target, type: "workflow" },
      ];
      set({ nodes: [...nodes, node], edges: [...remaining, ...inserted] });
      get().relayout();
    },

    deleteNode: (id) => {
      const { nodes, edges, selectedNodeId } = get();
      const incoming = edges.filter((e) => e.target === id);
      const outgoing = edges.filter((e) => e.source === id);
      const bridged: WFEdge[] = [];
      for (const inEdge of incoming) {
        for (const outEdge of outgoing) {
          bridged.push({
            id: nanoid(),
            source: inEdge.source,
            target: outEdge.target,
            sourceHandle: inEdge.sourceHandle,
            label: inEdge.label,
            type: "workflow",
          });
        }
      }
      commit();
      set({
        nodes: nodes.filter((n) => n.id !== id),
        edges: [
          ...edges.filter((e) => e.source !== id && e.target !== id),
          ...bridged,
        ],
        selectedNodeId: selectedNodeId === id ? null : selectedNodeId,
      });
      get().relayout();
    },

    duplicateNode: (id) => {
      const node = get().nodes.find((n) => n.id === id);
      if (!node) return;
      commit();
      const clone: WFNode = {
        id: nanoid(),
        type: "workflow",
        position: { x: node.position.x + 40, y: node.position.y + 40 },
        data: {
          type: node.data.type,
          config: structuredClone(node.data.config),
        },
      };
      set({ nodes: [...get().nodes, clone] });
    },

    changeNodeType: (id, type) => {
      const def = nodeRegistry.get(type);
      if (!def) return;
      commit();
      set({
        nodes: get().nodes.map((n) =>
          n.id === id
            ? {
                ...n,
                data: {
                  type,
                  config: structuredClone(def.defaultConfig) as Record<
                    string,
                    unknown
                  >,
                },
              }
            : n,
        ),
      });
    },

    setNodeConfig: (id, config) => {
      set({
        dirty: true,
        nodes: get().nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, config } } : n,
        ),
      });
    },

    selectNode: (id) => set({ selectedNodeId: id }),

    copySelection: () => {
      const { nodes, selectedNodeId } = get();
      if (!selectedNodeId) return;
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (!node) return;
      set({ clipboard: { nodes: [node], edges: [] } });
    },

    paste: () => {
      const { clipboard } = get();
      if (!clipboard || clipboard.nodes.length === 0) return;
      commit();
      const clones = clipboard.nodes.map<WFNode>((n) => ({
        id: nanoid(),
        type: "workflow",
        position: { x: n.position.x + 48, y: n.position.y + 48 },
        data: { type: n.data.type, config: structuredClone(n.data.config) },
      }));
      set({ nodes: [...get().nodes, ...clones] });
    },

    undo: () => {
      const { past, future, nodes, edges } = get();
      const previous = past[past.length - 1];
      if (!previous) return;
      set({
        past: past.slice(0, -1),
        future: [{ nodes, edges }, ...future],
        nodes: previous.nodes,
        edges: previous.edges,
        dirty: true,
      });
    },

    redo: () => {
      const { past, future, nodes, edges } = get();
      const next = future[0];
      if (!next) return;
      set({
        past: [...past, { nodes, edges }],
        future: future.slice(1),
        nodes: next.nodes,
        edges: next.edges,
        dirty: true,
      });
    },

    relayout: () => {
      set({ nodes: layoutWorkflow(get().nodes, get().edges) });
    },

    loadWorkflow: (workflow) => {
      const nodes = workflow.nodes.map<WFNode>((n) => ({
        id: n.id,
        type: "workflow",
        position: n.position,
        data: { type: n.type, config: n.config },
      }));
      const edges = workflow.edges.map<WFEdge>((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        label: e.label,
        type: "workflow",
      }));
      set({
        nodes: layoutWorkflow(nodes, edges),
        edges,
        name: workflow.metadata.name,
        published: workflow.metadata.published,
        selectedNodeId: null,
        past: [],
        future: [],
        dirty: false,
      });
    },

    reset: () =>
      set({
        nodes: [],
        edges: [],
        selectedNodeId: null,
        name: initialMetadataName,
        published: false,
        past: [],
        future: [],
        clipboard: null,
        dirty: false,
      }),

    setName: (name) => set({ name, dirty: true }),
    setPublished: (published) => set({ published, dirty: true }),
  };
});
