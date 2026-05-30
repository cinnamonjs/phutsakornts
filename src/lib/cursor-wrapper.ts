export interface CursorPaginatedResponse<T> {
  data: T[]
  has_more: boolean
}

export interface CursorPageParam {
  startingAfter?: string
  endingBefore?: string
}

export type CursorFetcher<T> = (
  params: CursorPageParam,
) => Promise<CursorPaginatedResponse<T>>

export function createInfiniteQueryFn<T>(fetcher: CursorFetcher<T>) {
  return ({ pageParam }: { pageParam: CursorPageParam | null }) =>
    fetcher(pageParam ?? {})
}

function entityId(item: unknown): string | undefined {
  return (item as { id?: string } | undefined)?.id
}

export function getNextPageParam<T>(
  lastPage: CursorPaginatedResponse<T>,
): CursorPageParam | undefined {
  if (!lastPage.has_more) return undefined
  const id = entityId(lastPage.data[lastPage.data.length - 1])
  return id ? { startingAfter: id } : undefined
}

export function getPreviousPageParam<T>(
  firstPage: CursorPaginatedResponse<T>,
): CursorPageParam | undefined {
  const id = entityId(firstPage.data[0])
  return id ? { endingBefore: id } : undefined
}
