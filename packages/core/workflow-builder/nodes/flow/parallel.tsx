import { GitFork } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  waitForAll: z.boolean(),
});

export type ParallelConfig = z.infer<typeof configSchema>;

export const parallelNode = defineNode<ParallelConfig>({
  type: "flow.parallel",
  name: "Parallel",
  category: "flow",
  icon: <GitFork className="size-4" />,
  description: "Runs multiple branches at the same time",
  badge: "Flow",
  inputs: [{ id: "in" }],
  outputs: [
    { id: "a", label: "Branch A" },
    { id: "b", label: "Branch B" },
  ],
  configSchema,
  defaultConfig: { waitForAll: true },
  configFields: [
    { kind: "switch", key: "waitForAll", label: "Wait for all branches" },
  ],
  keywords: ["flow", "parallel", "fork", "split", "concurrent"],
});
