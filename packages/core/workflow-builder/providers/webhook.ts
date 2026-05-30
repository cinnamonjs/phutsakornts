import { nanoid } from "nanoid";
import type {
  CapturePaymentInput,
  CreatePaymentInput,
  PaymentProviderAdapter,
  PaymentResult,
  RefundInput,
  RefundResult,
  ValidationResult,
  VoidInput,
  VoidResult,
  WebhookInput,
  WebhookResult,
} from "@/components/module/workflow-builder/types";

interface WebhookProviderConfig {
  endpoint?: string;
}

export const webhookProvider: PaymentProviderAdapter = {
  id: "webhook",
  name: "Webhook provider",

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    return { id: `wh_${nanoid(12)}`, status: "pending", raw: input };
  },

  async capture(input: CapturePaymentInput): Promise<PaymentResult> {
    return { id: input.paymentId, status: "captured" };
  },

  async refund(input: RefundInput): Promise<RefundResult> {
    return { id: `whr_${nanoid(12)}`, status: "refunded", raw: input };
  },

  async void(input: VoidInput): Promise<VoidResult> {
    return { id: input.paymentId, status: "voided" };
  },

  async webhook(input: WebhookInput): Promise<WebhookResult> {
    return { event: "generic.event", verified: true, data: input.body };
  },

  validate(config: unknown): ValidationResult {
    const cfg = (config ?? {}) as WebhookProviderConfig;
    if (!cfg.endpoint) {
      return { valid: false, errors: ["endpoint is required"] };
    }
    return { valid: true };
  },
};
