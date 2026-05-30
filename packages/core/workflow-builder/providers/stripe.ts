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

interface StripeConfig {
  secretKey?: string;
  webhookSecret?: string;
}

export const stripeProvider: PaymentProviderAdapter = {
  id: "stripe",
  name: "Stripe",

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    return { id: `pi_${nanoid(12)}`, status: "requires_capture", raw: input };
  },

  async capture(input: CapturePaymentInput): Promise<PaymentResult> {
    return { id: input.paymentId, status: "succeeded" };
  },

  async refund(input: RefundInput): Promise<RefundResult> {
    return { id: `re_${nanoid(12)}`, status: "succeeded", raw: input };
  },

  async void(input: VoidInput): Promise<VoidResult> {
    return { id: input.paymentId, status: "canceled" };
  },

  async webhook(input: WebhookInput): Promise<WebhookResult> {
    return { event: "payment_intent.succeeded", verified: true, data: input.body };
  },

  validate(config: unknown): ValidationResult {
    const cfg = (config ?? {}) as StripeConfig;
    if (!cfg.secretKey) {
      return { valid: false, errors: ["secretKey is required"] };
    }
    return { valid: true };
  },
};
