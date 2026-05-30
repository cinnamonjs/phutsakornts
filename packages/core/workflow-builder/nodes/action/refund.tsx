import { Undo2 } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  paymentId: z.string(),
  amount: z.string().optional(),
  reason: z.string().optional(),
});

export type RefundConfig = z.infer<typeof configSchema>;

export const refundNode = defineNode<RefundConfig>({
  type: "action.refund",
  name: "Refund payment",
  category: "action",
  icon: <Undo2 className="size-4" />,
  description: "Refunds a captured payment",
  badge: "Payment",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  configSchema,
  defaultConfig: { paymentId: "{{payment.id}}", amount: "", reason: "" },
  configFields: [
    { kind: "text", key: "paymentId", label: "Payment ID", placeholder: "{{payment.id}}" },
    { kind: "text", key: "amount", label: "Amount", placeholder: "full" },
    { kind: "textarea", key: "reason", label: "Reason", placeholder: "requested_by_customer" },
  ],
  keywords: ["action", "refund", "payment", "reverse"],
});
