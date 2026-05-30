import { Clock } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  duration: z.number().int().min(0),
  unit: z.enum(["seconds", "minutes", "hours", "days"]),
});

export type DelayConfig = z.infer<typeof configSchema>;

export const delayNode = defineNode<DelayConfig>({
  type: "flow.delay",
  name: "Delay",
  category: "flow",
  icon: <Clock className="size-4" />,
  description: "Pauses the workflow for a fixed duration",
  badge: "Flow",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  configSchema,
  defaultConfig: { duration: 5, unit: "minutes" },
  configFields: [
    { kind: "number", key: "duration", label: "Duration", placeholder: "5" },
    {
      kind: "select",
      key: "unit",
      label: "Unit",
      options: [
        { label: "Seconds", value: "seconds" },
        { label: "Minutes", value: "minutes" },
        { label: "Hours", value: "hours" },
        { label: "Days", value: "days" },
      ],
    },
  ],
  keywords: ["flow", "delay", "wait", "pause", "sleep"],
});
