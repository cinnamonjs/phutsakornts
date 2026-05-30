"use client";

import { isValidElement, useState, type ReactNode } from "react";
import { DataViewModule } from "@/components/module/data-view";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PageConfig, StatCard, TabConfig } from "@/components/module/page-builder/types";

function isStatCardArray(v: unknown): v is StatCard[] {
  return Array.isArray(v) && v.every((x) => x && typeof x === "object" && "status" in x && "count" in x);
}

function StatsRow({ stats }: { stats: StatCard[] | ReactNode }) {
  if (isStatCardArray(stats)) {
    const total = stats.find((s) => s.status === "total")?.count ?? stats.reduce((acc, s) => acc + s.count, 0);
    return (
      <div className="flex gap-3 w-full">
        {stats.map((s) => (
          <div key={s.status} className="w-full rounded-lg border pb-3 p-4">
            <p className="text-xs text-muted-foreground capitalize">{s.status?.split("_")?.join(" ")}</p>
            <div className="flex tracking-tight items-baseline gap-1">
              <span className="text-lg font-semibold tracking-tight">{s.count}</span>
              {s.status !== "total" && <span className="text-sm text-muted-foreground">({total > 0 ? (s.count / total * 100).toFixed(1) : "0.0"}%)</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (isValidElement(stats) || typeof stats === "string" || typeof stats === "number") {
    return <>{stats}</>;
  }
  return null;
}

function TabPanel({ tab }: { tab: TabConfig }) {
  const Content = tab.component;
  const Wrapper = tab.wrapper;

  const inner = (
    <div className="space-y-4">
      {tab.stats ? <StatsRow stats={tab.stats} /> : null}
      {tab.dataView ? (
        <DataViewModule config={tab.dataView} />
      ) : Content ? (
        <Content />
      ) : null}
    </div>
  );

  if (Wrapper) {
    return <Wrapper>{inner}</Wrapper>;
  }

  return inner;
}

function PageTabs({
  tabs,
  variant = "line",
}: {
  tabs: TabConfig[];
  variant?: "default" | "line";
}) {
  const defaultTab = tabs.find((t) => t.isDefault) ?? tabs[0];
  const [activeKey, setActiveKey] = useState(defaultTab?.key ?? "");
  const activeTab = tabs.find((t) => t.key === activeKey);

  return (
    <Tabs value={activeKey} onValueChange={setActiveKey}>
      <div className="flex items-center justify-between gap-2 border-b">
        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList
            variant={variant}
            className="w-max justify-start border-b-0"
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {activeTab?.actions && (
          <div className="flex shrink-0 gap-2 pb-1">{activeTab.actions}</div>
        )}
      </div>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.key}
          value={tab.key}
          className={cn("pt-4", tab.className)}
        >
          <TabPanel tab={tab} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function PageLayout({ config }: { config: PageConfig }) {
  const Wrapper = config.wrapper;
  const Content = config.content;

  const body = (
    <div className={cn("mx-auto max-w-7xl space-y-6 p-6 pt-8", config.className)}>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            {config.title}
          </h1>
          {config.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {config.description}
            </p>
          )}
        </div>
        {config.actions && <div className="flex gap-2">{config.actions}</div>}
      </div>
      {config.tabs && config.tabs.length > 0 ? (
        <PageTabs tabs={config.tabs} variant={config.tabsVariant ?? "line"} />
      ) : (
        <div className="space-y-4">
          {config.stats ? <StatsRow stats={config.stats} /> : null}
          {config.dataView ? (
            <DataViewModule config={config.dataView} />
          ) : Content ? (
            <Content />
          ) : null}
        </div>
      )}
    </div>
  );

  if (Wrapper) {
    return <Wrapper>{body}</Wrapper>;
  }

  return body;
}
