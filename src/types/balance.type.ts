export interface Balance {
  id: string
  name?: string
  amount?: number
  currency?: string
}

export interface BalanceTransaction {
  id: string
  amount?: number
  description?: string
  created?: number
}
