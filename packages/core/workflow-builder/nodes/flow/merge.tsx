import { GitMerge } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  strategy: z.enum(["first", "all", "concat"]),
});

export type MergeConfig = z.infer<typeof configSchema>;

export const mergeNode = defineNode<MergeConfig>({
  type: "flow.merge",
  name: "Merge",
  category: "flow",
  icon: <GitMerge className="size-4" />,
  description: "Joins multiple branches back into one",
  badge: "Flow",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  configSchema,
  defaultConfig: { strategy: "all" },
  configFields: [
    {
      kind: "select",
      key: "strategy",
      label: "Strategy",
      options: [
        { label: "First to arrive", value: "first" },
        { label: "Wait for all", value: "all" },
        { label: "Concatenate", value: "concat" },
      ],
    },
  ],
  keywords: ["flow", "merge", "join", "combine"],
});
