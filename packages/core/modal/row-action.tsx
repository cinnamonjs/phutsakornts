"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useModalOpen } from "./use-modal";
export type RowActionStatus = "default" | "destructive";

export interface RowActionModalAction {
  name: string;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface RowActionCondition {
  action: "hide" | "show";
  value: boolean;
}

export interface RowActionConfig {
  label: string;
  href?: string;
  modal?: RowActionModalAction;
  onClick?: () => void;
  onConfirm?: () => Promise<void> | void;
  confirmLabel?: string;
  doneLabel?: string;
  status?: RowActionStatus;
  icon?: ReactNode;
  conditional?: RowActionCondition[];
}

function isActionVisible(config: RowActionConfig): boolean {
  if (!config.conditional?.length) return true;
  for (const cond of config.conditional) {
    if (cond.action === "hide" && cond.value) return false;
    if (cond.action === "show" && !cond.value) return false;
  }
  return true;
}

const INLINE_THRESHOLD = 2;
const ARM_TIMEOUT_MS = 3000;
const DONE_HOLD_MS = 900;

function chipClass(status?: RowActionStatus) {
  return cn(
    "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
    status === "destructive"
      ? "text-destructive hover:bg-destructive/10"
      : "text-foreground hover:bg-muted",
  );
}

export function RowActionLink({ config }: { config: RowActionConfig }) {
  const openModal = useModalOpen();
  if (config.modal) {
    return (
      <button
        type="button"
        className={chipClass(config.status)}
        onClick={() => openModal(config.modal!.name, config.modal!.params)}
      >
        {config.icon}
        {config.label}
      </button>
    );
  }
  if (config.onClick) {
    return (
      <button type="button" className={chipClass(config.status)} onClick={config.onClick}>
        {config.icon}
        {config.label}
      </button>
    );
  }
  if (!config.href) return null;
  return (
    <Link href={config.href} className={chipClass(config.status)}>
      {config.icon}
      {config.label}
    </Link>
  );
}

type Stage = "idle" | "armed" | "loading" | "done";

export function RowActionConfirm({ config }: { config: RowActionConfig }) {
  const [stage, setStage] = useState<Stage>("idle");
  const armTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (armTimer.current) clearTimeout(armTimer.current);
      if (doneTimer.current) clearTimeout(doneTimer.current);
    },
    [],
  );

  const handleClick = useCallback(async () => {
    if (!config.onConfirm) return;
    if (stage === "idle") {
      setStage("armed");
      armTimer.current = setTimeout(() => setStage("idle"), ARM_TIMEOUT_MS);
      return;
    }
    if (stage === "armed") {
      if (armTimer.current) clearTimeout(armTimer.current);
      setStage("loading");
      try {
        await config.onConfirm();
        setStage("done");
        doneTimer.current = setTimeout(() => setStage("idle"), DONE_HOLD_MS);
      } catch {
        setStage("idle");
      }
    }
  }, [stage, config]);

  const label =
    stage === "armed"
      ? (config.confirmLabel ?? "Confirm?")
      : stage === "loading"
        ? "…"
        : stage === "done"
          ? (config.doneLabel ?? "Deleted")
          : config.label;

  const icon =
    stage === "armed" || stage === "done" ? (
      <CheckIcon className="size-3.5" />
    ) : (
      config.icon
    );

  return (
    <motion.button
      layout
      type="button"
      onClick={handleClick}
      disabled={stage === "loading"}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        chipClass(config.status),
        "overflow-hidden whitespace-nowrap",
        stage === "armed" && "bg-destructive/10 ring-1 ring-destructive/30",
        stage === "done" && "bg-muted text-muted-foreground",
        stage === "loading" && "opacity-60",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={stage}
          layout="position"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
          className="inline-flex items-center gap-1.5"
        >
          {icon}
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function DropdownLinkItem({ cfg }: { cfg: RowActionConfig }) {
  const openModal = useModalOpen();
  if (cfg.modal) {
    return (
      <DropdownMenuItem
        variant={cfg.status === "destructive" ? "destructive" : "default"}
        onClick={() => openModal(cfg.modal!.name, cfg.modal!.params)}
      >
        {cfg.icon}
        {cfg.label}
      </DropdownMenuItem>
    );
  }
  if (cfg.onClick) {
    return (
      <DropdownMenuItem
        variant={cfg.status === "destructive" ? "destructive" : "default"}
        onClick={cfg.onClick}
      >
        {cfg.icon}
        {cfg.label}
      </DropdownMenuItem>
    );
  }
  return (
    <DropdownMenuItem
      variant={cfg.status === "destructive" ? "destructive" : "default"}
      render={<Link href={cfg.href!} />}
    >
      {cfg.icon}
      {cfg.label}
    </DropdownMenuItem>
  );
}

function renderAction(cfg: RowActionConfig) {
  if (cfg.onConfirm) {
    return <RowActionConfirm key={cfg.label} config={cfg} />;
  }
  return <RowActionLink key={cfg.label} config={cfg} />;
}

export type RowActionsVariant = "default" | "dropdown";

export function RowActionsGroup({
  actions,
  variant = "default",
}: {
  actions: RowActionConfig[];
  variant?: RowActionsVariant;
}) {
  const visible = actions.filter(isActionVisible);
  if (visible.length === 0) return null;

  const confirms = visible.filter((a) => a.onConfirm);
  const links = visible.filter((a) => (a.href || a.modal || a.onClick) && !a.onConfirm);

  if (variant === "default" && links.length <= INLINE_THRESHOLD) {
    return (
      <div className="flex justify-end gap-1">
        {visible.map(renderAction)}
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label = "Row actions">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          {links.map((cfg) => (
            <DropdownLinkItem key={cfg.label} cfg={cfg} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {confirms.map((cfg) => (
        <RowActionConfirm key={cfg.label} config={cfg} />
      ))}
    </div>
  );
}
