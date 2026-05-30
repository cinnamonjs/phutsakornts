import { Braces } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  mapping: z.string(),
  mode: z.enum(["merge", "replace"]),
});

export type TransformConfig = z.infer<typeof configSchema>;

export const transformNode = defineNode<TransformConfig>({
  type: "operator.transform",
  name: "Transform JSON",
  category: "operator",
  icon: <Braces className="size-4" />,
  description: "Reshapes payload JSON into a new structure",
  badge: "Transform",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  configSchema,
  defaultConfig: {
    mapping: '{\n  "id": "{{payment.id}}",\n  "amount": "{{payment.amount}}"\n}',
    mode: "replace",
  },
  configFields: [
    {
      kind: "json",
      key: "mapping",
      label: "Mapping template",
      placeholder: '{ "id": "{{payment.id}}" }',
      description: "JSON template; {{path}} tokens are resolved from input",
    },
    {
      kind: "select",
      key: "mode",
      label: "Output mode",
      options: [
        { label: "Replace payload", value: "replace" },
        { label: "Merge with payload", value: "merge" },
      ],
    },
  ],
  keywords: ["operator", "transform", "json", "map", "reshape"],
});
