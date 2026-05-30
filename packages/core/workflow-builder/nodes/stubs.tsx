import {
  AlertTriangle,
  Bell,
  CalendarClock,
  Code2,
  Database,
  Equal,
  GitPullRequestArrow,
  Landmark,
  type LucideIcon,
  Percent,
  Radio,
  Repeat,
  Search,
  Sigma,
  Terminal,
  Wallet,
  Webhook,
} from "lucide-react";
import { z } from "zod";
import { defineNode } from "@/components/module/workflow-builder/nodes/define";
import type {
  NodeCategory,
  Port,
  WorkflowNodeDefinition,
} from "@/components/module/workflow-builder/types";

interface StubSpec {
  type: string;
  name: string;
  category: NodeCategory;
  Icon: LucideIcon;
  badge?: string;
  inputs?: Port[];
  outputs?: Port[];
}

const singleIn: Port[] = [{ id: "in" }];
const singleOut: Port[] = [{ id: "out" }];

function makeStub(
  spec: StubSpec,
): WorkflowNodeDefinition<Record<string, unknown>> {
  const { Icon } = spec;
  return defineNode<Record<string, unknown>>({
    type: spec.type,
    name: spec.name,
    category: spec.category,
    icon: <Icon className="size-4" />,
    badge: spec.badge,
    description: "Not configured yet",
    inputs: spec.inputs ?? singleIn,
    outputs: spec.outputs ?? singleOut,
    configSchema: z.record(z.string(), z.unknown()),
    defaultConfig: {},
    configFields: [],
    keywords: [spec.category, spec.name.toLowerCase()],
  });
}

export const stubNodes: WorkflowNodeDefinition<Record<string, unknown>>[] = [
  makeStub({ type: "trigger.cron", name: "Schedule", category: "trigger", Icon: CalendarClock, badge: "Cron", inputs: [] }),
  makeStub({ type: "trigger.api", name: "API trigger", category: "trigger", Icon: Radio, badge: "API", inputs: [] }),

  makeStub({ type: "operator.and-or", name: "AND / OR", category: "operator", Icon: GitPullRequestArrow, badge: "Logic" }),
  makeStub({ type: "operator.compare", name: "Compare", category: "operator", Icon: Equal, badge: "Logic" }),
  makeStub({ type: "operator.exists", name: "Exists", category: "operator", Icon: Search, badge: "Logic" }),
  makeStub({
    type: "operator.percentage-split",
    name: "Percentage split",
    category: "operator",
    Icon: Percent,
    badge: "Routing",
    outputs: [
      { id: "a", label: "Split A" },
      { id: "b", label: "Split B" },
    ],
  }),
  makeStub({ type: "operator.formula", name: "Formula", category: "operator", Icon: Sigma, badge: "Compute" }),

  makeStub({ type: "action.capture", name: "Capture", category: "action", Icon: Wallet, badge: "Payment" }),
  makeStub({ type: "action.notify", name: "Notify", category: "action", Icon: Bell, badge: "Comms" }),
  makeStub({ type: "action.execute-script", name: "Execute script", category: "action", Icon: Terminal, badge: "Script" }),
  makeStub({ type: "action.emit-event", name: "Emit event", category: "action", Icon: Radio, badge: "Event" }),
  makeStub({ type: "action.queue-publish", name: "Queue publish", category: "action", Icon: Database, badge: "Queue" }),

  makeStub({
    type: "flow.wait-webhook",
    name: "Wait for webhook",
    category: "flow",
    Icon: Webhook,
    badge: "Flow",
  }),
  makeStub({ type: "flow.wait-event", name: "Wait for event", category: "flow", Icon: Radio, badge: "Flow" }),
  makeStub({
    type: "flow.loop",
    name: "Loop",
    category: "flow",
    Icon: Repeat,
    badge: "Flow",
    outputs: [
      { id: "each", label: "Each" },
      { id: "done", label: "Done" },
    ],
  }),
  makeStub({
    type: "flow.error-handler",
    name: "Error handler",
    category: "flow",
    Icon: AlertTriangle,
    badge: "Flow",
    outputs: [
      { id: "out", label: "Recovered" },
      { id: "error", label: "On error" },
    ],
  }),

  makeStub({ type: "integration.paypal", name: "PayPal", category: "integration", Icon: Wallet, badge: "Provider" }),
  makeStub({ type: "integration.omise", name: "Omise", category: "integration", Icon: Wallet, badge: "Provider" }),
  makeStub({ type: "integration.kbank", name: "KBank", category: "integration", Icon: Landmark, badge: "Provider" }),
  makeStub({ type: "integration.rabbitmq", name: "RabbitMQ", category: "integration", Icon: Database, badge: "Queue" }),
  makeStub({ type: "integration.redis", name: "Redis", category: "integration", Icon: Database, badge: "Cache" }),
  makeStub({ type: "integration.custom", name: "Custom provider", category: "integration", Icon: Code2, badge: "Provider" }),
];
