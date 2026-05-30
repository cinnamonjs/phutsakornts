import type { Edge, Node } from "@xyflow/react";
import type { Balance, BalanceTransaction } from "@/types/balance.type";
import type { Customer } from "@/types/customer.type";

export type BranchKind = "balance" | "customer";

export type Branch =
  | { id: string; kind: "balance"; entity: Balance }
  | { id: string; kind: "customer"; entity: Customer };

export type ActivityNodeData =
  | { kind: "balance"; branchId: string; balance: Balance }
  | { kind: "customer"; branchId: string; customer: Customer }
  | { kind: "transaction"; branchId: string; tx: BalanceTransaction }
  | { kind: "load-more"; branchId: string };

export type ActivityNode = Node<ActivityNodeData>;
export type ActivityEdge = Edge;

export interface BranchFetcher {
  fetchNextPage: () => void;
  isFetching: boolean;
}
