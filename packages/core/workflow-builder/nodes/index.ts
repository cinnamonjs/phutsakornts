import { nodeRegistry } from "@/components/module/workflow-builder/registry";
import { apiCallNode } from "@/components/module/workflow-builder/nodes/action/api-call";
import { refundNode } from "@/components/module/workflow-builder/nodes/action/refund";
import { routeProviderNode } from "@/components/module/workflow-builder/nodes/action/route-provider";
import { webhookSendNode } from "@/components/module/workflow-builder/nodes/action/webhook-send";
import { delayNode } from "@/components/module/workflow-builder/nodes/flow/delay";
import { mergeNode } from "@/components/module/workflow-builder/nodes/flow/merge";
import { parallelNode } from "@/components/module/workflow-builder/nodes/flow/parallel";
import { retryNode } from "@/components/module/workflow-builder/nodes/flow/retry";
import { stopNode } from "@/components/module/workflow-builder/nodes/flow/stop";
import { conditionNode } from "@/components/module/workflow-builder/nodes/operator/condition";
import { switchNode } from "@/components/module/workflow-builder/nodes/operator/switch";
import { transformNode } from "@/components/module/workflow-builder/nodes/operator/transform";
import { stubNodes } from "@/components/module/workflow-builder/nodes/stubs";
import { manualTriggerNode } from "@/components/module/workflow-builder/nodes/trigger/manual";
import { paymentCreatedNode } from "@/components/module/workflow-builder/nodes/trigger/payment-created";
import { webhookReceivedNode } from "@/components/module/workflow-builder/nodes/trigger/webhook-received";

let registered = false;

export function registerAllNodes(): void {
  if (registered) return;
  registered = true;

  nodeRegistry.register(paymentCreatedNode);
  nodeRegistry.register(webhookReceivedNode);
  nodeRegistry.register(manualTriggerNode);

  nodeRegistry.register(conditionNode);
  nodeRegistry.register(switchNode);
  nodeRegistry.register(transformNode);

  nodeRegistry.register(apiCallNode);
  nodeRegistry.register(webhookSendNode);
  nodeRegistry.register(routeProviderNode);
  nodeRegistry.register(refundNode);

  nodeRegistry.register(retryNode);
  nodeRegistry.register(delayNode);
  nodeRegistry.register(parallelNode);
  nodeRegistry.register(mergeNode);
  nodeRegistry.register(stopNode);

  for (const stub of stubNodes) nodeRegistry.register(stub);
}
