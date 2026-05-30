"use client";

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
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export interface ModalShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onClose?: () => void;
}

const SIZE_CLASS: Record<NonNullable<ModalShellProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "top-2 left-2 w-[calc(100vw-16px)] max-w-none h-[calc(100vh-16px)] max-h-[calc(100vh-16px)] translate-x-0 translate-y-0",
};

export function ModalShell({
  title,
  description,
  children,
  className,
  size = "md",
  onClose,
}: ModalShellProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) return;
      if (onClose) onClose();
      else router.back();
    },
    [onClose, router],
  );

  if (isDesktop) return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn(SIZE_CLASS[size], "p-0", className)}>
        <DialogHeader className="p-6 pb-1">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription className="mt-0">{description}</DialogDescription>}
        </DialogHeader>
        <div className="relative h-1 bg-muted mt-1" />
        <div className="flex-1 flex flex-col min-h-0 px-6 pt-4 pb-2.5">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className={cn(className)}>
        <DrawerHeader className="pt-0 pl-6 pb-2 gap-0 md:gap-0.5">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription className="mt-0">{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="relative h-1 bg-muted mt-1" />
        <div className="flex-1 flex flex-col min-h-0 px-6 pt-4 pb-2.5">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}