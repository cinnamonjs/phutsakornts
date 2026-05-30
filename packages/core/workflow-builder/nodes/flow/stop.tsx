import { CircleStop } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  status: z.enum(["success", "failed", "cancelled"]),
  message: z.string().optional(),
});

export type StopConfig = z.infer<typeof configSchema>;

export const stopNode = defineNode<StopConfig>({
  type: "flow.stop",
  name: "End",
  category: "flow",
  icon: <CircleStop className="size-4" />,
  description: "Ends the workflow run",
  badge: "Flow",
  inputs: [{ id: "in" }],
  outputs: [],
  configSchema,
  defaultConfig: { status: "success", message: "" },
  configFields: [
    {
      kind: "select",
      key: "status",
      label: "Final status",
      options: [
        { label: "Success", value: "success" },
        { label: "Failed", value: "failed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    { kind: "textarea", key: "message", label: "Message", placeholder: "Done" },
  ],
  keywords: ["flow", "stop", "end", "terminate", "halt"],
});
