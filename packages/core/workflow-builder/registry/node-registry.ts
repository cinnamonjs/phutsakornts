import type {
  AnyNodeDefinition,
  NodeCategory,
  WorkflowNodeDefinition,
} from "@/components/module/workflow-builder/types";

export class NodeRegistry {
  private readonly defs = new Map<string, AnyNodeDefinition>();

  register<TConfig>(def: WorkflowNodeDefinition<TConfig>): void {
    this.defs.set(def.type, def as unknown as AnyNodeDefinition);
  }

  registerMany(defs: AnyNodeDefinition[]): void {
    for (const def of defs) this.defs.set(def.type, def);
  }

  unregister(type: string): void {
    this.defs.delete(type);
  }

  has(type: string): boolean {
    return this.defs.has(type);
  }

  get(type: string): AnyNodeDefinition | undefined {
    return this.defs.get(type);
  }

  list(): AnyNodeDefinition[] {
    return Array.from(this.defs.values());
  }

  byCategory(category: NodeCategory): AnyNodeDefinition[] {
    return this.list().filter((def) => def.category === category);
  }

  categories(): NodeCategory[] {
    const seen = new Set<NodeCategory>();
    for (const def of this.defs.values()) seen.add(def.category);
    return Array.from(seen);
  }
}
