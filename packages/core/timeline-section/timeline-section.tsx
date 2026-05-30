"use client";

import { type ComponentType, Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TimelineStep = {
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  spacingAfter?: string;
};

export type TimelineSectionProps = {
  steps: TimelineStep[];
  children?: ReactNode;
  topConnector?: string;
  bottomConnector?: string;
  defaultSpacing?: string;
};

const CONNECTOR_BASE = "my-0.5 w-px border-l border-dashed border-border";

export function TimelineSection({
  steps,
  children,
  topConnector = "h-3",
  bottomConnector = "h-1",
  defaultSpacing = "min-h-6 flex-1",
}: TimelineSectionProps) {
  const lastIndex = steps.length - 1;

  return (
    <div className="flex gap-3 mt-2">
      <div className="flex shrink-0 flex-col items-center pt-3">
        <div className={cn(CONNECTOR_BASE, topConnector)} />
        {steps.map((step, i) => {
          const key = `step-${i}`;
          const Icon = step.icon;
          const isLast = i === lastIndex;
          const connector = isLast
            ? bottomConnector
            : (step.spacingAfter ?? defaultSpacing);
          return (
            <Fragment key={key}>
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full",
                  step.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-3.5" />
              </div>
              <div className={cn(CONNECTOR_BASE, connector)} />
            </Fragment>
          );
        })}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
