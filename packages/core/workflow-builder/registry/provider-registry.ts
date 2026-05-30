import type { PaymentProviderAdapter } from "@/components/module/workflow-builder/types";

export class ProviderRegistry {
  private readonly providers = new Map<string, PaymentProviderAdapter>();

  registerProvider(provider: PaymentProviderAdapter): void {
    this.providers.set(provider.id, provider);
  }

  unregisterProvider(id: string): void {
    this.providers.delete(id);
  }

  hasProvider(id: string): boolean {
    return this.providers.has(id);
  }

  getProvider(id: string): PaymentProviderAdapter | undefined {
    return this.providers.get(id);
  }

  listProviders(): PaymentProviderAdapter[] {
    return Array.from(this.providers.values());
  }
}
