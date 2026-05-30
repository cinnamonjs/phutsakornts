import { GitBranch } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  left: z.string(),
  operator: z.enum([
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "contains",
    "exists",
  ]),
  right: z.string().optional(),
});

export type ConditionConfig = z.infer<typeof configSchema>;

export const conditionNode = defineNode<ConditionConfig>({
  type: "operator.condition",
  name: "If / else",
  category: "operator",
  icon: <GitBranch className="size-4" />,
  description: "Branches the workflow on a condition",
  badge: "Conditions",
  inputs: [{ id: "in" }],
  outputs: [
    { id: "true", label: "Is true" },
    { id: "false", label: "Is false" },
  ],
  configSchema,
  defaultConfig: { left: "", operator: "equals", right: "" },
  configFields: [
    { kind: "text", key: "left", label: "Left value", placeholder: "{{amount}}" },
    {
      kind: "select",
      key: "operator",
      label: "Operator",
      options: [
        { label: "Equals", value: "equals" },
        { label: "Not equals", value: "notEquals" },
        { label: "Greater than", value: "greaterThan" },
        { label: "Less than", value: "lessThan" },
        { label: "Contains", value: "contains" },
        { label: "Exists", value: "exists" },
      ],
    },
    { kind: "text", key: "right", label: "Right value", placeholder: "1000" },
  ],
  keywords: ["operator", "condition", "if", "else", "branch", "logic"],
});
