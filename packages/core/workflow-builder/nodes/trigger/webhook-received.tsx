import { Webhook } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  path: z.string(),
  method: z.enum(["POST", "GET", "PUT"]),
  secret: z.string().optional(),
});

export type WebhookReceivedConfig = z.infer<typeof configSchema>;

export const webhookReceivedNode = defineNode<WebhookReceivedConfig>({
  type: "trigger.webhook-received",
  name: "Webhook received",
  category: "trigger",
  icon: <Webhook className="size-4" />,
  description: "Starts when an inbound webhook hits the endpoint",
  badge: "Webhook",
  inputs: [],
  outputs: [{ id: "out" }],
  configSchema,
  defaultConfig: { path: "/hooks/incoming", method: "POST" },
  configFields: [
    {
      kind: "text",
      key: "path",
      label: "Endpoint path",
      placeholder: "/hooks/incoming",
    },
    {
      kind: "select",
      key: "method",
      label: "Method",
      options: [
        { label: "POST", value: "POST" },
        { label: "GET", value: "GET" },
        { label: "PUT", value: "PUT" },
      ],
    },
    {
      kind: "text",
      key: "secret",
      label: "Signing secret",
      placeholder: "whsec_...",
      description: "Used to verify the inbound signature",
    },
  ],
  keywords: ["trigger", "webhook", "inbound", "http"],
});
