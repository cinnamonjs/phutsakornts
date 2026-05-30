import { MousePointerClick } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  label: z.string(),
});

export type ManualTriggerConfig = z.infer<typeof configSchema>;

export const manualTriggerNode = defineNode<ManualTriggerConfig>({
  type: "trigger.manual",
  name: "Manual start",
  category: "trigger",
  icon: <MousePointerClick className="size-4" />,
  description: "Starts when a user runs the workflow manually",
  badge: "Manual",
  inputs: [],
  outputs: [{ id: "out" }],
  configSchema,
  defaultConfig: { label: "Run workflow" },
  configFields: [
    { kind: "text", key: "label", label: "Button label", placeholder: "Run" },
  ],
  keywords: ["trigger", "manual", "button", "start"],
});
