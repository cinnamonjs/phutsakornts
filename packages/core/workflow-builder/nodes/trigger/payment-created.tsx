import { CreditCard } from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";

const configSchema = z.object({
  event: z.enum(["payment.created", "payment.completed", "payment.failed"]),
  filter: z.string().optional(),
});

export type PaymentCreatedConfig = z.infer<typeof configSchema>;

export const paymentCreatedNode = defineNode<PaymentCreatedConfig>({
  type: "trigger.payment-created",
  name: "Payment event",
  category: "trigger",
  icon: <CreditCard className="size-4" />,
  description: "Starts when a payment event is emitted",
  badge: "Data",
  inputs: [],
  outputs: [{ id: "out" }],
  configSchema,
  defaultConfig: { event: "payment.created" },
  configFields: [
    {
      kind: "select",
      key: "event",
      label: "Event",
      options: [
        { label: "Payment created", value: "payment.created" },
        { label: "Payment completed", value: "payment.completed" },
        { label: "Payment failed", value: "payment.failed" },
      ],
    },
    {
      kind: "text",
      key: "filter",
      label: "Filter expression",
      placeholder: "amount > 1000",
      description: "Optional condition to narrow which events fire",
    },
  ],
  keywords: ["trigger", "payment", "start", "event"],
});
