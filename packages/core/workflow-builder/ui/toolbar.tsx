"use client";

import { Redo2, Sparkles, Trash2, Undo2, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { buildDemoWorkflow } from "@/components/module/workflow-builder/ui/demo-workflow";
import {
  useCanRedo,
  useCanUndo,
} from "@/components/module/workflow-builder/workflow/use-workflow";
import { useWorkflowStore } from "@/components/module/workflow-builder/workflow/store";

export function Toolbar() {
  const name = useWorkflowStore((s) => s.name);
  const setName = useWorkflowStore((s) => s.setName);
  const published = useWorkflowStore((s) => s.published);
  const setPublished = useWorkflowStore((s) => s.setPublished);
  const dirty = useWorkflowStore((s) => s.dirty);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const relayout = useWorkflowStore((s) => s.relayout);
  const reset = useWorkflowStore((s) => s.reset);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3">
      <Workflow className="size-4 text-muted-foreground" />
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-8 w-56 rounded-lg border-transparent bg-transparent px-2 font-medium hover:bg-muted focus-visible:bg-input/60"
      />
      {dirty && (
        <Badge variant="outline" className="text-[10px]">
          Unsaved
        </Badge>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Undo"
          disabled={!canUndo}
          onClick={undo}
        >
          <Undo2 />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Redo"
          disabled={!canRedo}
          onClick={redo}
        >
          <Redo2 />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button variant="outline" size="sm" onClick={relayout}>
          <Workflow /> Auto layout
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadWorkflow(buildDemoWorkflow())}
        >
          <Sparkles /> Demo
        </Button>
        <Button variant="ghost" size="sm" onClick={reset}>
          <Trash2 /> Clear
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Label className="gap-2 text-xs text-muted-foreground">
          Published
          <Switch checked={published} onCheckedChange={setPublished} />
        </Label>
      </div>
    </header>
  );
}
