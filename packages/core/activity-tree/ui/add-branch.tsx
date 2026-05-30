"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBalanceList } from "@/service/balance.service";
import { getCustomerList } from "@/service/customer.service";
import type { Balance } from "@/types/balance.type";
import type { Customer } from "@/types/customer.type";
import { useActivityTreeStore } from "@/components/module/activity-tree/tree/store";

function includes(needle: string, ...fields: (string | undefined)[]): boolean {
  if (!needle) return true;
  const q = needle.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

function BalanceList({
  search,
  onPick,
}: {
  search: string;
  onPick: (balance: Balance) => void;
}) {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["activity-tree-picker", "balance"],
      queryFn: ({ pageParam }) =>
        getBalanceList({ startingAfter: pageParam as string | null }),
      initialPageParam: null as string | null,
      getNextPageParam: (last) =>
        last.has_more ? last.data[last.data.length - 1]?.id : undefined,
    });

  const items = (data?.pages.flatMap((p) => p.data) ?? []).filter((b) =>
    includes(search, b.name, b.id, b.currency, b.customer?.email),
  );

  return (
    <PickerList
      isLoading={isLoading}
      empty={items.length === 0}
      hasNextPage={Boolean(hasNextPage)}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
    >
      {items.map((b) => (
        <PickerRow
          key={b.id}
          title={b.name || b.id}
          subtitle={`${b.currency} · ${b.customer?.email ?? b.id}`}
          onClick={() => onPick(b)}
        />
      ))}
    </PickerList>
  );
}

function CustomerList({
  search,
  onPick,
}: {
  search: string;
  onPick: (customer: Customer) => void;
}) {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["activity-tree-picker", "customer"],
      queryFn: ({ pageParam }) =>
        getCustomerList({ startingAfter: pageParam as string | null }),
      initialPageParam: null as string | null,
      getNextPageParam: (last) =>
        last.has_more ? last.data[last.data.length - 1]?.id : undefined,
    });

  const items = (data?.pages.flatMap((p) => p.data) ?? []).filter((c) =>
    includes(search, c.name, c.email, c.id),
  );

  return (
    <PickerList
      isLoading={isLoading}
      empty={items.length === 0}
      hasNextPage={Boolean(hasNextPage)}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
    >
      {items.map((c) => (
        <PickerRow
          key={c.id}
          title={c.name || c.id}
          subtitle={c.email || c.id}
          onClick={() => onPick(c)}
        />
      ))}
    </PickerList>
  );
}

function PickerList({
  isLoading,
  empty,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  children,
}: {
  isLoading: boolean;
  empty: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">
      {isLoading && (
        <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
      )}
      {!isLoading && empty && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No results
        </p>
      )}
      {children}
      {hasNextPage && (
        <Button
          size="sm"
          variant="ghost"
          className="w-full"
          disabled={isFetchingNextPage}
          onClick={onLoadMore}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}

function PickerRow({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted"
    >
      <span className="truncate text-sm font-medium">{title}</span>
      <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
    </button>
  );
}

export function AddBranch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const addBranch = useActivityTreeStore((s) => s.addBranch);

  const pick = (kind: "balance" | "customer", entity: Balance | Customer) => {
    addBranch(kind, entity);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Plus className="size-3.5" data-icon="inline-start" />
        Add branch
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add branch</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="balance" className="mt-2">
          <TabsList>
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
          </TabsList>
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3"
          />
          <TabsContent value="balance">
            <BalanceList
              search={search}
              onPick={(b) => pick("balance", b)}
            />
          </TabsContent>
          <TabsContent value="customer">
            <CustomerList
              search={search}
              onPick={(c) => pick("customer", c)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
