import { Split } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  expression: z.string(),
  cases: z.string(),
});

export type SwitchConfig = z.infer<typeof configSchema>;

export const switchNode = defineNode<SwitchConfig>({
  type: "operator.switch",
  name: "Switch",
  category: "operator",
  icon: <Split className="size-4" />,
  description: "Routes to a branch by matching a value",
  badge: "Conditions",
  inputs: [{ id: "in" }],
  outputs: [
    { id: "match", label: "Match" },
    { id: "default", label: "Default" },
  ],
  configSchema,
  defaultConfig: { expression: "{{status}}", cases: "succeeded,failed" },
  configFields: [
    {
      kind: "text",
      key: "expression",
      label: "Expression",
      placeholder: "{{status}}",
    },
    {
      kind: "text",
      key: "cases",
      label: "Cases",
      placeholder: "succeeded,failed",
      description: "Comma-separated values to match",
    },
  ],
  keywords: ["operator", "switch", "route", "match"],
});
