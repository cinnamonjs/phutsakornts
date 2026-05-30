import type { CursorFetcher } from '#/lib/cursor-wrapper'
import type { Balance, BalanceTransaction } from '#/types/balance.type'

export const getBalanceList: CursorFetcher<Balance> = async () => ({
  data: [],
  has_more: false,
})

export async function getBalanceTxList(
  _id: string,
): Promise<BalanceTransaction[]> {
  return []
}
