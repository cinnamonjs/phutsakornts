import { RefreshCw } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  maxAttempts: z.number().int().min(1).max(20),
  backoff: z.enum(["fixed", "exponential"]),
  delayMs: z.number().int().min(0),
});

export type RetryConfig = z.infer<typeof configSchema>;

export const retryNode = defineNode<RetryConfig>({
  type: "flow.retry",
  name: "Retry",
  category: "flow",
  icon: <RefreshCw className="size-4" />,
  description: "Retries the downstream branch on failure",
  badge: "Flow",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  configSchema,
  defaultConfig: { maxAttempts: 3, backoff: "exponential", delayMs: 1000 },
  configFields: [
    { kind: "number", key: "maxAttempts", label: "Max attempts", placeholder: "3" },
    {
      kind: "select",
      key: "backoff",
      label: "Backoff",
      options: [
        { label: "Fixed", value: "fixed" },
        { label: "Exponential", value: "exponential" },
      ],
    },
    { kind: "number", key: "delayMs", label: "Base delay (ms)", placeholder: "1000" },
  ],
  keywords: ["flow", "retry", "backoff", "attempt"],
});
