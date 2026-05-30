"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type InfiniteData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import type { CursorPaginatedResponse } from "@/lib/cursor-wrapper";
import {
  createInfiniteQueryFn,
  getNextPageParam,
  getPreviousPageParam,
} from "@/lib/cursor-wrapper";
import { defaultSerializeParams } from "@/components/module/data-view/serialize";
import type {
  ActiveFilter,
  DataViewConfig,
  DataViewResult,
  FilterState,
} from "./types";

type PageParam = { startingAfter?: string; endingBefore?: string } | null;

export function useDataView<T extends { id: string }>(
  config: DataViewConfig<T>,
): DataViewResult<T> {
  const [pageIndex, setPageIndex] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>({
    search: "",
    sort: null,
    filters: {},
  });

  const additionalParams = useMemo(() => {
    const encode = config.serializeParams ?? defaultSerializeParams;
    const params = { ...encode(filterState) };
    if (config.limit) params.limit = config.limit;
    return params;
  }, [filterState, config.limit, config.serializeParams]);

  const query = useInfiniteQuery<
    CursorPaginatedResponse<T>,
    Error,
    InfiniteData<CursorPaginatedResponse<T>>,
    unknown[],
    PageParam
  >({
    queryKey: [config.queryKey, additionalParams],
    queryFn: createInfiniteQueryFn(config.fetcher, additionalParams),
    initialPageParam: null,
    getNextPageParam,
    getPreviousPageParam,
    initialData: config.initialData
      ? { pages: [config.initialData], pageParams: [null] }
      : undefined,
  });

  const pages = query.data?.pages ?? [];
  const currentPage = pages[pageIndex] ?? null;
  const totalCount = currentPage?.count ?? 0;

  const setSearch = useCallback((value: string) => {
    setFilterState((prev) => ({ ...prev, search: value }));
    setPageIndex(0);
  }, []);

  const setSort = useCallback((key: string) => {
    setFilterState((prev) => {
      if (prev.sort?.key === key) {
        return {
          ...prev,
          sort: { key, direction: prev.sort.direction === "asc" ? "desc" : "asc" },
        };
      }
      return { ...prev, sort: { key, direction: "desc" } };
    });
    setPageIndex(0);
  }, []);

  const setSortExplicit = useCallback((key: string, desc: boolean) => {
    setFilterState((prev) => ({
      ...prev,
      sort: key ? { key, direction: desc ? "desc" : "asc" } : null,
    }));
    setPageIndex(0);
  }, []);

  const clearSort = useCallback(() => {
    setFilterState((prev) => ({ ...prev, sort: null }));
    setPageIndex(0);
  }, []);

  const setFilter = useCallback((key: string, filter: ActiveFilter) => {
    setFilterState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: filter },
    }));
    setPageIndex(0);
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilterState((prev) => {
      if (!(key in prev.filters)) return prev;
      const next = { ...prev.filters };
      delete next[key];
      return { ...prev, filters: next };
    });
    setPageIndex(0);
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({ search: "", sort: null, filters: {} });
    setPageIndex(0);
  }, []);

  const goNextPage = useCallback(() => {
    if (pageIndex < pages.length - 1) {
      setPageIndex((i) => i + 1);
    } else if (query.hasNextPage) {
      query.fetchNextPage().then(() => setPageIndex((i) => i + 1));
    }
  }, [pageIndex, pages.length, query]);

  const goPreviousPage = useCallback(() => {
    if (pageIndex > 0) setPageIndex((i) => i - 1);
  }, [pageIndex]);

  return {
    pages,
    currentPage,
    pageIndex,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchingPreviousPage: query.isFetchingPreviousPage,
    hasNextPage: query.hasNextPage || pageIndex < pages.length - 1,
    hasPreviousPage: pageIndex > 0,
    goNextPage,
    goPreviousPage,
    refetch: query.refetch,
    filterState,
    setSearch,
    setSort,
    setSortExplicit,
    clearSort,
    setFilter,
    clearFilter,
    clearFilters,
    totalCount,
  };
}
