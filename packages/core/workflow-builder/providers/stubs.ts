import { createCustomProvider } from "@/components/module/workflow-builder/providers/custom";
import type { PaymentProviderAdapter } from "@/components/module/workflow-builder/types";

export const stubProviders: PaymentProviderAdapter[] = [
  createCustomProvider({ id: "paypal", name: "PayPal" }),
  createCustomProvider({ id: "omise", name: "Omise" }),
  createCustomProvider({ id: "kbank", name: "KBank" }),
  createCustomProvider({ id: "rabbitmq", name: "RabbitMQ" }),
  createCustomProvider({ id: "redis", name: "Redis" }),
];
