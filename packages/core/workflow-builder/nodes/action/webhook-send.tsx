import { Send } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  url: z.string(),
  headers: z.record(z.string(), z.string()),
  payload: z.string(),
  signing: z.enum(["none", "hmac-sha256"]),
  secret: z.string().optional(),
  retries: z.number().int().min(0).max(10),
});

export type WebhookSendConfig = z.infer<typeof configSchema>;

export const webhookSendNode = defineNode<WebhookSendConfig>({
  type: "action.webhook-send",
  name: "Send webhook",
  category: "action",
  icon: <Send className="size-4" />,
  description: "Posts a signed JSON payload to a destination",
  badge: "Webhook",
  inputs: [{ id: "in" }],
  outputs: [
    { id: "success", label: "Delivered" },
    { id: "error", label: "Failed" },
  ],
  configSchema,
  defaultConfig: {
    url: "https://example.com/webhooks",
    headers: { "Content-Type": "application/json" },
    payload:
      '{\n  "event": "payment.completed",\n  "data": "{{payment}}"\n}',
    signing: "hmac-sha256",
    secret: "",
    retries: 3,
  },
  configFields: [
    {
      kind: "text",
      key: "url",
      label: "Destination URL",
      placeholder: "https://example.com/webhooks",
    },
    { kind: "keyvalue", key: "headers", label: "Headers" },
    {
      kind: "json",
      key: "payload",
      label: "Payload (JSON)",
      placeholder: '{ "event": "..." }',
      description: "{{path}} tokens are resolved from upstream output",
    },
    {
      kind: "select",
      key: "signing",
      label: "Signing",
      options: [
        { label: "None", value: "none" },
        { label: "HMAC SHA-256", value: "hmac-sha256" },
      ],
    },
    {
      kind: "text",
      key: "secret",
      label: "Signing secret",
      placeholder: "whsec_...",
    },
    { kind: "number", key: "retries", label: "Max retries", placeholder: "3" },
  ],
  keywords: ["action", "webhook", "send", "post", "deliver", "json"],
});
