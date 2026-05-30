import {
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { layoutTree } from "@/components/module/activity-tree/tree/layout";
import type {
  ActivityEdge,
  ActivityNode,
  Branch,
  BranchFetcher,
  BranchKind,
} from "@/components/module/activity-tree/tree/types";
import type { Balance, BalanceTransaction } from "@/types/balance.type";
import type { Customer } from "@/types/customer.type";

export type SortOrder = "asc" | "desc";

interface ActivityTreeState {
  branches: Branch[];
  nodes: ActivityNode[];
  edges: ActivityEdge[];
  selectedNodeId: string | null;
  branchFetchers: Record<string, BranchFetcher>;
  sortOrder: SortOrder;
}

interface ActivityTreeActions {
  onNodesChange: (changes: NodeChange<ActivityNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<ActivityEdge>[]) => void;
  addBranch: (kind: BranchKind, entity: Balance | Customer) => void;
  removeBranch: (branchId: string) => void;
  syncBranch: (
    branchId: string,
    txs: BalanceTransaction[],
    hasMore: boolean,
  ) => void;
  registerBranchFetcher: (branchId: string, fetcher: BranchFetcher) => void;
  loadMore: (branchId: string) => void;
  selectNode: (id: string | null) => void;
  setSortOrder: (order: SortOrder) => void;
  relayout: () => void;
  reset: () => void;
}

export type ActivityTreeStore = ActivityTreeState & ActivityTreeActions;

function buildBranch(
  branch: Branch,
  txs: BalanceTransaction[],
  hasMore: boolean,
): { nodes: ActivityNode[]; edges: ActivityEdge[] } {
  const rootId = `${branch.id}:root`;
  const rootNode: ActivityNode =
    branch.kind === "balance"
      ? {
          id: rootId,
          type: "balance",
          position: { x: 0, y: 0 },
          data: { kind: "balance", branchId: branch.id, balance: branch.entity },
        }
      : {
          id: rootId,
          type: "customer",
          position: { x: 0, y: 0 },
          data: {
            kind: "customer",
            branchId: branch.id,
            customer: branch.entity,
          },
        };

  const nodes: ActivityNode[] = [rootNode];
  const edges: ActivityEdge[] = [];
  let prevId = rootId;

  for (const tx of txs) {
    const id = `${branch.id}:tx:${tx.id}`;
    nodes.push({
      id,
      type: "transaction",
      position: { x: 0, y: 0 },
      data: { kind: "transaction", branchId: branch.id, tx },
    });
    edges.push({ id: `${branch.id}:edge:${prevId}->${id}`, source: prevId, target: id });
    prevId = id;
  }

  if (hasMore) {
    const id = `${branch.id}:more`;
    nodes.push({
      id,
      type: "load-more",
      position: { x: 0, y: 0 },
      data: { kind: "load-more", branchId: branch.id },
    });
    edges.push({ id: `${branch.id}:edge:${prevId}->${id}`, source: prevId, target: id });
  }

  return { nodes, edges };
}

export const useActivityTreeStore = create<ActivityTreeStore>((set, get) => ({
  branches: [],
  nodes: [],
  edges: [],
  selectedNodeId: null,
  branchFetchers: {},
  sortOrder: "asc",

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  addBranch: (kind, entity) => {
    const branch = { id: nanoid(), kind, entity } as Branch;
    set({ branches: [...get().branches, branch] });
  },

  removeBranch: (branchId) => {
    const { branches, nodes, edges, selectedNodeId, branchFetchers } = get();
    const keepNodes = nodes.filter((n) => n.data.branchId !== branchId);
    const keepEdges = edges.filter((e) => !e.id.startsWith(`${branchId}:`));
    const { [branchId]: _removed, ...restFetchers } = branchFetchers;
    set({
      branches: branches.filter((b) => b.id !== branchId),
      nodes: layoutTree(keepNodes, keepEdges),
      edges: keepEdges,
      branchFetchers: restFetchers,
      selectedNodeId: keepNodes.some((n) => n.id === selectedNodeId)
        ? selectedNodeId
        : null,
    });
  },

  syncBranch: (branchId, txs, hasMore) => {
    const branch = get().branches.find((b) => b.id === branchId);
    if (!branch) return;
    const keepNodes = get().nodes.filter((n) => n.data.branchId !== branchId);
    const keepEdges = get().edges.filter((e) => !e.id.startsWith(`${branchId}:`));
    const built = buildBranch(branch, txs, hasMore);
    const nextEdges = [...keepEdges, ...built.edges];
    set({
      nodes: layoutTree([...keepNodes, ...built.nodes], nextEdges),
      edges: nextEdges,
    });
  },

  registerBranchFetcher: (branchId, fetcher) => {
    set({ branchFetchers: { ...get().branchFetchers, [branchId]: fetcher } });
  },

  loadMore: (branchId) => {
    get().branchFetchers[branchId]?.fetchNextPage();
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  setSortOrder: (order) => set({ sortOrder: order }),

  relayout: () => {
    set({ nodes: layoutTree(get().nodes, get().edges) });
  },

  reset: () =>
    set({
      branches: [],
      nodes: [],
      edges: [],
      selectedNodeId: null,
      branchFetchers: {},
      sortOrder: "asc",
    }),
}));
