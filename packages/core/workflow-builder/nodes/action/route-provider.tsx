import { Network } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  providerId: z.string(),
  amount: z.string(),
  currency: z.string(),
});

export type RouteProviderConfig = z.infer<typeof configSchema>;

export const routeProviderNode = defineNode<RouteProviderConfig>({
  type: "action.route-provider",
  name: "Route to provider",
  category: "action",
  icon: <Network className="size-4" />,
  description: "Creates a payment with the selected provider",
  badge: "Payment",
  inputs: [{ id: "in" }],
  outputs: [
    { id: "success", label: "Created" },
    { id: "error", label: "Declined" },
  ],
  configSchema,
  defaultConfig: { providerId: "stripe", amount: "{{payment.amount}}", currency: "USD" },
  configFields: [
    {
      kind: "select",
      key: "providerId",
      label: "Provider",
      options: [
        { label: "Stripe", value: "stripe" },
        { label: "Webhook provider", value: "webhook" },
        { label: "Custom", value: "custom" },
      ],
    },
    { kind: "text", key: "amount", label: "Amount", placeholder: "{{payment.amount}}" },
    { kind: "text", key: "currency", label: "Currency", placeholder: "USD" },
  ],
  keywords: ["action", "route", "provider", "payment", "create"],
});
