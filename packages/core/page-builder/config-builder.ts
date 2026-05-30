import { type ComponentType, createElement, type ReactNode } from "react";
import type { DataViewConfig } from "@/components/module/data-view";
import { CTAButton, type CTAConfig } from "@/components/module/modal";
import type {
  PageConfig,
  StatCard,
  TabConfig,
} from "@/components/module/page-builder/types";

export class TabConfigBuilder {
  private tab: Partial<TabConfig> = {};

  constructor(key: string, label: string, component?: ComponentType) {
    this.tab.key = key;
    this.tab.label = label;
    if (component) this.tab.component = component;
  }

  asDefault(): this {
    this.tab.isDefault = true;
    return this;
  }

  withWrapper(wrapper: ComponentType<{ children: ReactNode }>): this {
    this.tab.wrapper = wrapper;
    return this;
  }

  withClassName(className: string): this {
    this.tab.className = className;
    return this;
  }

  withDataView<T extends { id: string }>(dataView: DataViewConfig<T>): this {
    this.tab.dataView = dataView;
    return this;
  }

  withStats(stats: StatCard[] | ReactNode): this {
    this.tab.stats = stats;
    return this;
  }

  withActions(actions: ReactNode): this {
    this.tab.actions = actions;
    return this;
  }

  withCTA(label: string, opts: Omit<CTAConfig, "label">): this {
    this.tab.actions = createElement(CTAButton, { config: { label, ...opts } });
    return this;
  }

  build(): TabConfig {
    return this.tab as TabConfig;
  }
}

export class PageConfigBuilder {
  private config: Partial<PageConfig> = {};

  constructor(id: string) {
    this.config.id = id;
  }

  withTitle(title: string): this {
    this.config.title = title;
    return this;
  }

  withDescription(description: string): this {
    this.config.description = description;
    return this;
  }

  withActions(actions: ReactNode): this {
    this.config.actions = actions;
    return this;
  }

  withCTA(label: string, opts: Omit<CTAConfig, "label">): this {
    this.config.actions = createElement(CTAButton, {
      config: { label, ...opts },
    });
    return this;
  }

  withContent(content: ComponentType): this {
    this.config.content = content;
    return this;
  }

  withDataView<T extends { id: string }>(dataView: DataViewConfig<T>): this {
    this.config.dataView = dataView;
    return this;
  }

  withWrapper(wrapper: ComponentType<{ children: ReactNode }>): this {
    this.config.wrapper = wrapper;
    return this;
  }

  withClassName(className: string): this {
    this.config.className = className;
    return this;
  }

  withTabsVariant(variant: "default" | "line"): this {
    this.config.tabsVariant = variant;
    return this;
  }

  withStats(stats: StatCard[] | ReactNode): this {
    this.config.stats = stats;
    return this;
  }

  addTab(tabOrBuilder: TabConfig | TabConfigBuilder): this {
    if (!this.config.tabs) {
      this.config.tabs = [];
    }
    const tab =
      tabOrBuilder instanceof TabConfigBuilder
        ? tabOrBuilder.build()
        : tabOrBuilder;
    this.config.tabs.push(tab);
    return this;
  }

  withTabs(tabs: Array<TabConfig | TabConfigBuilder>): this {
    this.config.tabs = tabs.map((t) =>
      t instanceof TabConfigBuilder ? t.build() : t,
    );
    return this;
  }

  build(): PageConfig {
    return this.config as PageConfig;
  }
}

export function createPage(id: string): PageConfigBuilder {
  return new PageConfigBuilder(id);
}

export function createTab(
  key: string,
  label: string,
  component?: ComponentType,
): TabConfigBuilder {
  return new TabConfigBuilder(key, label, component);
}
