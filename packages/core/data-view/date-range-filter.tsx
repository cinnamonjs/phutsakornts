"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import {
  DateRangeScrollPicker,
  type DateRange,
} from "@/components/composite/date-range-scroll-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DataViewFilter } from "@/components/module/data-view/types";
import { useTranslations } from "next-intl";

type FilterConfig = Extract<DataViewFilter, { kind: "filter" }>;

type Direction = "asc" | "desc";

interface DateRangeFilterProps {
  filter: FilterConfig;
  onClose: () => void;
}

export function DateRangeFilter({ filter: f, onClose }: DateRangeFilterProps) {
  const t = useTranslations();
  const [direction, setDirection] = useState<Direction>("desc");
  const [range, setRange] = useState<DateRange>();

  const handleApply = () => {
    console.log("date-range-filter", {
      key: f.key,
      direction,
      start: range?.start.toISOString(),
      end: range?.end.toISOString(),
    });
    onClose();
  };

  return (
    <div className="space-y-3 p-3 text-xs">
      <p className="font-medium">
        {t("common.ui.filterBy")}
        <span className="text-muted-foreground">{f.label.toLowerCase()}</span>
      </p>

      <div className="grid grid-cols-2 gap-1.5">
        <DirectionButton
          active={direction === "asc"}
          onClick={() => {
            setDirection("asc");
            console.log("date-range-filter:direction", "asc");
          }}
        >
          <ArrowUpIcon className="size-3.5" />
          {t("common.ui.ascending")}
        </DirectionButton>
        <DirectionButton
          active={direction === "desc"}
          onClick={() => {
            setDirection("desc");
            console.log("date-range-filter:direction", "desc");
          }}
        >
          <ArrowDownIcon className="size-3.5" />
          {t("common.ui.descending")}
        </DirectionButton>
      </div>

      <DateRangeScrollPicker
        value={range}
        onChange={(r) => {
          setRange(r);
          console.log("date-range-filter:range", {
            start: r.start.toISOString(),
            end: r.end.toISOString(),
          });
        }}
      />

      <Button variant="default" size="sm" className="w-full" onClick={handleApply}>
        {t("common.ui.apply")}
      </Button>
    </div>
  );
}

function DirectionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-md border text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
