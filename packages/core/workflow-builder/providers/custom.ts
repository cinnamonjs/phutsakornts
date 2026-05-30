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

export interface CustomProviderOptions {
  id: string;
  name: string;
}

export function createCustomProvider(
  options: CustomProviderOptions,
): PaymentProviderAdapter {
  return {
    id: options.id,
    name: options.name,

    async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
      return { id: `cus_${nanoid(12)}`, status: "pending", raw: input };
    },

    async capture(input: CapturePaymentInput): Promise<PaymentResult> {
      return { id: input.paymentId, status: "captured" };
    },

    async refund(input: RefundInput): Promise<RefundResult> {
      return { id: `cur_${nanoid(12)}`, status: "refunded", raw: input };
    },

    async void(input: VoidInput): Promise<VoidResult> {
      return { id: input.paymentId, status: "voided" };
    },

    async webhook(input: WebhookInput): Promise<WebhookResult> {
      return { event: "custom.event", verified: false, data: input.body };
    },

    validate(): ValidationResult {
      return { valid: true };
    },
  };
}

export const customProvider = createCustomProvider({
  id: "custom",
  name: "Custom provider",
});
