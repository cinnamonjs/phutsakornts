import { registerAllNodes } from "@/components/module/workflow-builder/nodes";
import { registerAllProviders } from "@/components/module/workflow-builder/providers";

let done = false;

export function registerBuiltins(): void {
  if (done) return;
  done = true;
  registerAllNodes();
  registerAllProviders();
}
