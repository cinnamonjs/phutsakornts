"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getBalanceTxList,
  getCustomerBalanceTxList,
} from "@/service/balance.service";
import type { Branch } from "@/components/module/activity-tree/tree/types";
import { useActivityTreeStore } from "@/components/module/activity-tree/tree/store";

export function BranchLoader({ branch }: { branch: Branch }) {
  const syncBranch = useActivityTreeStore((s) => s.syncBranch);
  const registerBranchFetcher = useActivityTreeStore(
    (s) => s.registerBranchFetcher,
  );
  const sortOrder = useActivityTreeStore((s) => s.sortOrder);

  const fetcher =
    branch.kind === "balance"
      ? getBalanceTxList(branch.entity.id)
      : getCustomerBalanceTxList(branch.entity.id);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["activity-tree", branch.kind, branch.entity.id, sortOrder],
      queryFn: ({ pageParam }) =>
        fetcher({
          startingAfter: pageParam as string | null,
          additionalParams: { "filter[created_date]": sortOrder },
        }),
      initialPageParam: null as string | null,
      getNextPageParam: (last) =>
        last.has_more ? last.data[last.data.length - 1]?.id : undefined,
    });

  useEffect(() => {
    const txs = data?.pages.flatMap((p) => p.data) ?? [];
    syncBranch(branch.id, txs, Boolean(hasNextPage));
  }, [data, hasNextPage, branch.id, syncBranch]);

  useEffect(() => {
    registerBranchFetcher(branch.id, {
      fetchNextPage: () => fetchNextPage(),
      isFetching: isFetchingNextPage,
    });
  }, [branch.id, fetchNextPage, isFetchingNextPage, registerBranchFetcher]);

  return null;
}
