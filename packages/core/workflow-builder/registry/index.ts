import { NodeRegistry } from "@/components/module/workflow-builder/registry/node-registry";
import { ProviderRegistry } from "@/components/module/workflow-builder/registry/provider-registry";

export { NodeRegistry } from "@/components/module/workflow-builder/registry/node-registry";
export { ProviderRegistry } from "@/components/module/workflow-builder/registry/provider-registry";

export const nodeRegistry = new NodeRegistry();
export const providerRegistry = new ProviderRegistry();
