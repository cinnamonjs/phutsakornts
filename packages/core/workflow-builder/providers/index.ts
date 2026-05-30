import { providerRegistry } from "@/components/module/workflow-builder/registry";
import { customProvider } from "@/components/module/workflow-builder/providers/custom";
import { stripeProvider } from "@/components/module/workflow-builder/providers/stripe";
import { stubProviders } from "@/components/module/workflow-builder/providers/stubs";
import { webhookProvider } from "@/components/module/workflow-builder/providers/webhook";

let registered = false;

export function registerAllProviders(): void {
  if (registered) return;
  registered = true;

  providerRegistry.registerProvider(stripeProvider);
  providerRegistry.registerProvider(webhookProvider);
  providerRegistry.registerProvider(customProvider);

  for (const provider of stubProviders) {
    providerRegistry.registerProvider(provider);
  }
}
