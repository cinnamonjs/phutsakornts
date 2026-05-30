import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

type UseCounterReturn = {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: Dispatch<SetStateAction<number>>
}

export function useCounter(initialValue?: number): UseCounterReturn {
  const [count, setCount] = useState(initialValue ?? 0)

  const increment = () => {
    setCount(x => x + 1)
  }

  const decrement = () => {
    setCount(x => x - 1)
  }

  const reset = () => {
    setCount(initialValue ?? 0)
  }

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  }
}
