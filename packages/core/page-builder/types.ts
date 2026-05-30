import type { ComponentType, ReactNode } from "react";
import type { DataViewConfig } from "@/components/module/data-view";

export interface StatCard {
  status: string;
  count: number;
}

export interface TabConfig {
  key: string;
  label: string;
  component?: ComponentType;
  dataView?: DataViewConfig<any>;
  isDefault?: boolean;
  wrapper?: ComponentType<{ children: ReactNode }>;
  className?: string;
  stats?: StatCard[] | ReactNode;
  actions?: ReactNode;
}

export interface PageConfig {
  id: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  tabs?: TabConfig[];
  content?: ComponentType;
  dataView?: DataViewConfig<any>;
  wrapper?: ComponentType<{ children: ReactNode }>;
  className?: string;
  tabsVariant?: "default" | "line";
  stats?: StatCard[] | ReactNode;
}
