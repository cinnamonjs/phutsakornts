"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useModalOpen } from "./use-modal";

export interface CTAModalAction {
  name: string;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface CTAConfig {
  label: string;
  href?: string;
  modal?: CTAModalAction;
  onClick?: () => void;
  kbd?: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "ghost";
}

export function CTAButton({ config }: { config: CTAConfig }) {
  const router = useRouter();
  const openModal = useModalOpen();

  const trigger = useCallback(() => {
    if (config.modal) {
      openModal(config.modal.name, config.modal.params);
      return;
    }
    if (config.href) {
      router.push(config.href);
      return;
    }
    config.onClick?.();
  }, [router, openModal, config]);

  useEffect(() => {
    if (!config.kbd) return;
    const target = config.kbd.toLowerCase();
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (e.key.toLowerCase() !== target) return;
      e.preventDefault();
      trigger();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [config.kbd, trigger]);

  return (
    <Button variant={config.variant ?? "outline"} size="sm" onClick={trigger}>
      {config.icon ?? (
        <PlusIcon className="size-3.5" data-icon="inline-start" />
      )}
      {config.label}
      {config.kbd && (
        <Kbd className="hidden md:inline-flex">{config.kbd.toUpperCase()}</Kbd>
      )}
    </Button>
  );
}
