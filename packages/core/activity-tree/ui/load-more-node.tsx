"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActivityNode as ActivityNodeType } from "@/components/module/activity-tree/tree/types";
import { useActivityTreeStore } from "@/components/module/activity-tree/tree/store";

export function LoadMoreNode({ data }: NodeProps<ActivityNodeType>) {
  const branchId = data.branchId;
  const loadMore = useActivityTreeStore((s) => s.loadMore);
  const isFetching = useActivityTreeStore(
    (s) => s.branchFetchers[branchId]?.isFetching ?? false,
  );

  return (
    <div className="flex justify-center">
      <Handle
        type="target"
        position={Position.Top}
        className="size-2.5! border-2! border-background! bg-muted-foreground!"
      />
      <Button
        size="sm"
        variant="outline"
        disabled={isFetching}
        onClick={() => loadMore(branchId)}
      >
        {isFetching ? (
          <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
        ) : (
          <Plus className="size-3.5" data-icon="inline-start" />
        )}
        Load more
      </Button>
    </div>
  );
}
