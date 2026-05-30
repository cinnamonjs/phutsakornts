"use client";

import { Eye, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface SplitModalShellProps {
  title: string;
  description?: string;
  form: ReactNode;
  preview: ReactNode;
  previewTitle?: string;
  className?: string;
  onClose?: () => void;
}

export function SplitModalShell({
  title,
  description,
  form,
  preview,
  previewTitle = "Preview",
  className,
  onClose,
}: SplitModalShellProps) {
  const router = useRouter();
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) return;
      if (onClose) onClose();
      else router.back();
    },
    [onClose, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleOpenChange]);

  return (
    <Dialog defaultOpen onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "fixed top-2 left-2 z-50 flex h-[calc(100vh-16px)] w-[calc(100vw-16px)] max-h-[calc(100vh-16px)] max-w-none translate-x-0 translate-y-0 flex-col rounded-2xl border border-border bg-background p-0 lg:grid lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:grid-rows-1",
          className,
        )}
      >
        <div className="flex shrink-0 border-b border-border lg:hidden">
          {(
            [
              { id: "form", label: "Form", icon: FileText },
              { id: "preview", label: previewTitle, icon: Eye },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMobileTab(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors",
                mobileTab === id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div
          className={cn(
            "flex flex-col border-border lg:flex lg:border-r",
            mobileTab === "form" ? "flex min-h-0 flex-1" : "hidden",
          )}
        >
          <DialogHeader className="border-b border-border p-6">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="flex min-h-0 flex-1 flex-col p-6">{form}</div>
        </div>

        <div
          className={cn(
            "flex flex-col border-border bg-muted/20 lg:flex",
            mobileTab === "preview" ? "flex min-h-0 flex-1" : "hidden",
          )}
        >
          <div className="hidden border-b border-border p-6 lg:block">
            <h3 className="text-sm font-medium text-muted-foreground">
              {previewTitle}
            </h3>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-6">{preview}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
