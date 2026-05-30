"use client";

import { type ColorMode, ReactFlowProvider } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityCanvas } from "@/components/module/activity-tree/ui/activity-canvas";
import { AddBranch } from "@/components/module/activity-tree/ui/add-branch";
import { BranchLoader } from "@/components/module/activity-tree/ui/branch-loader";
import {
  type SortOrder,
  useActivityTreeStore,
} from "@/components/module/activity-tree/tree/store";

export function ActivityTree({
  showAddBranch = true,
  colorMode = "system",
}: {
  showAddBranch?: boolean;
  colorMode?: ColorMode;
}) {
  const branches = useActivityTreeStore((s) => s.branches);
  const reset = useActivityTreeStore((s) => s.reset);
  const sortOrder = useActivityTreeStore((s) => s.sortOrder);
  const setSortOrder = useActivityTreeStore((s) => s.setSortOrder);

  return (
    <ReactFlowProvider>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-2 border-b p-3">
          <span className="text-sm font-medium">Activity tree</span>
          <div className="flex items-center gap-2 pr-6">
            <Tabs
              value={sortOrder}
              onValueChange={(v) => setSortOrder(v as SortOrder)}
            >
              <TabsList>
                <TabsTrigger value="asc">Oldest</TabsTrigger>
                <TabsTrigger value="desc">Newest</TabsTrigger>
              </TabsList>
            </Tabs>
            {showAddBranch && <AddBranch />}
            {branches.length > 0 && (
              <Button size="sm" variant="ghost" onClick={reset}>
                Clear
              </Button>
            )}
          </div>
        </div>
        <ActivityCanvas colorMode={colorMode as ColorMode} />
      </div>
      {branches.map((b) => (
        <BranchLoader key={b.id} branch={b} />
      ))}
    </ReactFlowProvider>
  );
}
