import type { ComponentType, ReactNode } from "react";
import type { ZodType } from "zod";

export type NodeCategory =
  | "trigger"
  | "operator"
  | "action"
  | "flow"
  | "integration";

export interface Port {
  id: string;
  label?: string;
  type?: string;
}

export type NodeFieldOption = { label: string; value: string };

export type NodeField =
  | {
      kind: "text";
      key: string;
      label: string;
      placeholder?: string;
      description?: string;
    }
  | {
      kind: "textarea";
      key: string;
      label: string;
      placeholder?: string;
      description?: string;
    }
  | {
      kind: "json";
      key: string;
      label: string;
      placeholder?: string;
      description?: string;
    }
  | {
      kind: "number";
      key: string;
      label: string;
      placeholder?: string;
      description?: string;
    }
  | {
      kind: "select";
      key: string;
      label: string;
      options: NodeFieldOption[];
      description?: string;
    }
  | { kind: "switch"; key: string; label: string; description?: string }
  | { kind: "keyvalue"; key: string; label: string; description?: string };

export interface NodeComponentProps<TConfig = unknown> {
  id: string;
  config: TConfig;
  selected: boolean;
  definition: WorkflowNodeDefinition<TConfig>;
}

export interface ExecutionContext {
  workflowId: string;
  input: Record<string, unknown>;
  results: Record<string, unknown>;
  signal?: AbortSignal;
}

export type Executor<TConfig = unknown> = (
  config: TConfig,
  ctx: ExecutionContext,
) => Promise<unknown>;

export interface WorkflowNodeDefinition<TConfig = unknown> {
  type: string;
  name: string;
  category: NodeCategory;
  icon: ReactNode;
  description?: string;
  badge?: string;
  inputs: Port[];
  outputs: Port[];
  configSchema: ZodType<TConfig>;
  defaultConfig: TConfig;
  configFields: NodeField[];
  component?: ComponentType<NodeComponentProps<TConfig>>;
  execute?: Executor<TConfig>;
  keywords?: string[];
}

export type AnyNodeDefinition = WorkflowNodeDefinition<Record<string, unknown>>;

export interface CreatePaymentInput {
  amount: number;
  currency: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

export interface CapturePaymentInput {
  paymentId: string;
  amount?: number;
}

export interface RefundInput {
  paymentId: string;
  amount?: number;
  reason?: string;
}

export interface VoidInput {
  paymentId: string;
}

export interface WebhookInput {
  headers: Record<string, string>;
  body: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  raw?: unknown;
}

export interface RefundResult {
  id: string;
  status: string;
  raw?: unknown;
}

export interface VoidResult {
  id: string;
  status: string;
  raw?: unknown;
}

export interface WebhookResult {
  event: string;
  verified: boolean;
  data?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface PaymentProviderAdapter {
  id: string;
  name: string;
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
  capture(input: CapturePaymentInput): Promise<PaymentResult>;
  refund(input: RefundInput): Promise<RefundResult>;
  void(input: VoidInput): Promise<VoidResult>;
  webhook(input: WebhookInput): Promise<WebhookResult>;
  validate(config: unknown): ValidationResult;
}

export interface WorkflowNodePosition {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: WorkflowNodePosition;
  config: Record<string, unknown>;
  label?: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface WorkflowMetadata {
  id: string;
  name: string;
  version: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: WorkflowMetadata;
}
