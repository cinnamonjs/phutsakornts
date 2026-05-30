import type { CursorFetcher } from '#/lib/cursor-wrapper'
import type { BalanceTransaction } from '#/types/balance.type'
import type { Customer } from '#/types/customer.type'

export const getCustomerList: CursorFetcher<Customer> = async () => ({
  data: [],
  has_more: false,
})

export async function getCustomerBalanceTxList(
  _id: string,
): Promise<BalanceTransaction[]> {
  return []
}
