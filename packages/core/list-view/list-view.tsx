"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  ListIcon,
} from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type ListViewMode = "card" | "list";

export type ListViewPage<T> = { data: T[]; has_more?: boolean };

export type ListViewQuery<T> = {
  data?: { pages: ListViewPage<T>[] } | undefined;
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
};

export type ListViewProps<T> = {
  query: ListViewQuery<T>;
  title: string;
  emptyMessage: string;
  renderCard: (items: T[]) => ReactNode;
  renderList: (items: T[]) => ReactNode;
  previewLimit?: number;
  skeletonCount?: number;
  defaultView?: ListViewMode;
  toolbarRight?: ReactNode;
};

export function ListView<T>({
  query,
  title,
  emptyMessage,
  renderCard,
  renderList,
  previewLimit = 5,
  skeletonCount = 3,
  defaultView = "card",
  toolbarRight,
}: ListViewProps<T>) {
  const t = useTranslations();
  const [view, setView] = useState<ListViewMode>(defaultView);
  const [dialogOpen, setDialogOpen] = useState(false);

  const firstPage = query.data?.pages[0];
  const items = firstPage?.data ?? [];
  const preview = items.slice(0, previewLimit);
  const showMore = items.length > previewLimit || firstPage?.has_more === true;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ViewToggle value={view} onChange={setView} />
        {toolbarRight}
      </div>

      {query.isLoading ? (
        <SkeletonList view={view} count={skeletonCount} />
      ) : items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : view === "card" ? (
        renderCard(preview)
      ) : (
        renderList(preview)
      )}

      {showMore && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setDialogOpen(true)}
        >{t("admin.listView.viewAll")}</Button>
      )}

      {dialogOpen && (
        <FullDialog
          query={query}
          view={view}
          title={title}
          renderCard={renderCard}
          renderList={renderList}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}

function ViewToggle({
  value,
  onChange,
}: {
  value: ListViewMode;
  onChange: (v: ListViewMode) => void;
}) {
  return (
    <div className="flex items-center rounded-4xl gap-0 border p-0.5">
      <button
        type="button"
        onClick={() => onChange("card")}
        className={cn(
          "rounded p-1 pl-2 pr-1 transition-colors rounded-l-2xl",
          value === "card"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-label = "Card view"
      >
        <LayoutGridIcon className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "rounded p-1 pl-1 pr-2 transition-colors rounded-r-2xl",
          value === "list"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-label = "List view"
      >
        <ListIcon className="size-3.5" />
      </button>
    </div>
  );
}

function SkeletonList({ view, count }: { view: ListViewMode; count: number }) {
  return (
    <div
      className={
        view === "card" ? "grid grid-cols-1 gap-3 sm:grid-cols-2" : "space-y-2"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function FullDialog<T>({
  query,
  view,
  title,
  renderCard,
  renderList,
  open,
  onClose,
}: {
  query: ListViewQuery<T>;
  view: ListViewMode;
  title: string;
  renderCard: (items: T[]) => ReactNode;
  renderList: (items: T[]) => ReactNode;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const [pageIndex, setPageIndex] = useState(0);
  const pages = query.data?.pages ?? [];
  const items = pages[pageIndex]?.data ?? [];
  const hasPrev = pageIndex > 0;
  const hasNext = query.hasNextPage || pageIndex < pages.length - 1;

  const goNext = useCallback(() => {
    if (pageIndex < pages.length - 1) {
      setPageIndex((i) => i + 1);
    } else if (query.hasNextPage) {
      query.fetchNextPage().then(() => setPageIndex((i) => i + 1));
    }
  }, [pageIndex, pages.length, query]);

  const goPrev = useCallback(() => {
    if (pageIndex > 0) setPageIndex((i) => i - 1);
  }, [pageIndex]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto">
          {view === "card" ? renderCard(items) : renderList(items)}
          {(hasPrev || hasNext) && (
            <div className="flex items-center justify-between border-t pt-3">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasPrev}
                onClick={goPrev}
              >
                <ChevronLeftIcon className="size-4" data-icon="inline-start" />{t("common.ui.previous")}</Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasNext || query.isFetchingNextPage}
                onClick={goNext}
              >{t("common.ui.next")}<ChevronRightIcon className="size-4" data-icon="inline-end" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
