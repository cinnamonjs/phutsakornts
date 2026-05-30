import { Globe } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string(),
  headers: z.record(z.string(), z.string()),
  body: z.string().optional(),
  auth: z.enum(["none", "bearer", "basic"]),
  token: z.string().optional(),
});

export type ApiCallConfig = z.infer<typeof configSchema>;

export const apiCallNode = defineNode<ApiCallConfig>({
  type: "action.api-call",
  name: "Call API",
  category: "action",
  icon: <Globe className="size-4" />,
  description: "Sends an HTTP request with a JSON body",
  badge: "API",
  inputs: [{ id: "in" }],
  outputs: [
    { id: "success", label: "Success" },
    { id: "error", label: "Error" },
  ],
  configSchema,
  defaultConfig: {
    method: "POST",
    url: "https://api.example.com/v1/resource",
    headers: { "Content-Type": "application/json" },
    body: '{\n  "amount": "{{payment.amount}}"\n}',
    auth: "bearer",
    token: "",
  },
  configFields: [
    {
      kind: "select",
      key: "method",
      label: "Method",
      options: [
        { label: "GET", value: "GET" },
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
        { label: "PATCH", value: "PATCH" },
        { label: "DELETE", value: "DELETE" },
      ],
    },
    { kind: "text", key: "url", label: "URL", placeholder: "https://..." },
    { kind: "keyvalue", key: "headers", label: "Headers" },
    {
      kind: "select",
      key: "auth",
      label: "Auth",
      options: [
        { label: "None", value: "none" },
        { label: "Bearer token", value: "bearer" },
        { label: "Basic", value: "basic" },
      ],
    },
    {
      kind: "text",
      key: "token",
      label: "Token / credentials",
      placeholder: "{{secrets.api_key}}",
    },
    {
      kind: "json",
      key: "body",
      label: "Request body (JSON)",
      placeholder: '{ "key": "value" }',
      description: "{{path}} tokens are resolved from upstream output",
    },
  ],
  keywords: ["action", "api", "http", "request", "rest", "call"],
});
