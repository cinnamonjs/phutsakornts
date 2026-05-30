import {
  GitBranch,
  type LucideIcon,
  Play,
  Plug,
  Workflow,
  Zap,
} from "lucide-react";
import type { NodeCategory } from "@/components/module/workflow-builder/types";

export interface CategoryMeta {
  label: string;
  Icon: LucideIcon;
}

export const CATEGORY_META: Record<NodeCategory, CategoryMeta> = {
  trigger: { label: "Trigger", Icon: Zap },
  operator: { label: "Operator", Icon: GitBranch },
  action: { label: "Do this", Icon: Play },
  flow: { label: "Flow", Icon: Workflow },
  integration: { label: "Integration", Icon: Plug },
};

export const CATEGORY_ORDER: NodeCategory[] = [
  "trigger",
  "operator",
  "action",
  "flow",
  "integration",
];

export const NODE_WIDTH = 300;
export const NODE_HEIGHT = 104;
