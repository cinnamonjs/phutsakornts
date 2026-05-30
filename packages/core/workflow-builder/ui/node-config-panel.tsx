"use client";

import { Copy, MousePointerClick, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ConfigField } from "@/components/module/workflow-builder/ui/config-field";
import { nodeRegistry } from "@/components/module/workflow-builder/registry";
import {
  useNodeDefinition,
  useSelectedNode,
} from "@/components/module/workflow-builder/workflow/use-workflow";
import { useWorkflowStore } from "@/components/module/workflow-builder/workflow/store";

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
      <MousePointerClick className="size-6 text-muted-foreground" />
      <p className="text-sm font-medium">No node selected</p>
      <p className="text-xs text-muted-foreground">
        Pick a node on the canvas to configure it.
      </p>
    </div>
  );
}

export function NodeConfigPanel() {
  const node = useSelectedNode();
  const definition = useNodeDefinition(node?.data.type);
  const setNodeConfig = useWorkflowStore((s) => s.setNodeConfig);
  const changeNodeType = useWorkflowStore((s) => s.changeNodeType);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const duplicateNode = useWorkflowStore((s) => s.duplicateNode);

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l bg-background">
      {!node || !definition ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex items-start gap-2.5 border-b px-4 py-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              {definition.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{definition.name}</p>
              {definition.description && (
                <p className="text-xs text-muted-foreground">
                  {definition.description}
                </p>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-1.5">
                <Label className="opacity-80">Node type</Label>
                <Select
                  value={node.data.type}
                  onValueChange={(type) => {
                    if (type) changeNodeType(node.id, type);
                  }}
                >
                  <SelectTrigger className="w-full rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeRegistry.list().map((def) => (
                      <SelectItem key={def.type} value={def.type}>
                        {def.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {definition.configFields.length > 0 && <Separator />}

              {definition.configFields.map((field) => (
                <ConfigField
                  key={field.key}
                  field={field}
                  value={node.data.config[field.key]}
                  onChange={(value) =>
                    setNodeConfig(node.id, {
                      ...node.data.config,
                      [field.key]: value,
                    })
                  }
                />
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center gap-2 border-t p-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => duplicateNode(node.id)}
            >
              <Copy /> Duplicate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => deleteNode(node.id)}
            >
              <Trash2 /> Delete
            </Button>
          </div>
        </>
      )}
    </aside>
  );
}
