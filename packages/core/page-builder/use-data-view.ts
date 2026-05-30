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
import type { DataViewConfig, DataViewResult, FilterState } from "@/components/module/page-builder/data-view.types";

type PageParam = { startingAfter?: string; endingBefore?: string } | null;

export function useDataView<T extends { id: string }>(
  config: DataViewConfig<T>,
): DataViewResult<T> {
  const [pageIndex, setPageIndex] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>({
    search: {},
    sort: null,
    sortDirection: "desc",
    filters: {},
  });

  const additionalParams = useMemo(() => {
    const params: Record<string, string | number | boolean | undefined | null> =
      {};

    for (const [key, value] of Object.entries(filterState.search)) {
      if (value) params[`search[${key}]`] = value;
    }

    for (const [key, value] of Object.entries(filterState.filters)) {
      if (value) params[`filter[${key}]`] = value;
    }

    if (filterState.sort) {
      params.sort = `${filterState.sort}:${filterState.sortDirection}`;
    }

    if (config.limit) {
      params.limit = config.limit;
    }

    return params;
  }, [filterState, config.limit]);

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
  });

  const pages = query.data?.pages ?? [];
  const currentPage = pages[pageIndex] ?? null;
  const totalCount = currentPage?.count ?? 0;

  const setSearch = useCallback((key: string, value: string) => {
    setFilterState((prev) => ({
      ...prev,
      search: { ...prev.search, [key]: value },
    }));
    setPageIndex(0);
  }, []);

  const setSort = useCallback((key: string) => {
    setFilterState((prev) => {
      if (prev.sort === key) {
        return {
          ...prev,
          sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
        };
      }
      return { ...prev, sort: key, sortDirection: "desc" };
    });
    setPageIndex(0);
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    setFilterState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));
    setPageIndex(0);
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({
      search: {},
      sort: null,
      sortDirection: "desc",
      filters: {},
    });
    setPageIndex(0);
  }, []);

  const goNextPage = useCallback(() => {
    if (pageIndex < pages.length - 1) {
      setPageIndex((i) => i + 1);
    } else if (query.hasNextPage) {
      query.fetchNextPage().then(() => {
        setPageIndex((i) => i + 1);
      });
    }
  }, [pageIndex, pages.length, query]);

  const goPreviousPage = useCallback(() => {
    if (pageIndex > 0) {
      setPageIndex((i) => i - 1);
    }
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
    setFilter,
    clearFilters,
    totalCount,
  };
}
