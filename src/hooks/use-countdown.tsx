import { useEffect, useRef, useState } from 'react'

type CountdownOptions = {
  countStart: number
  intervalMs?: number
  isIncrement?: boolean
  countStop?: number
  autoStart?: boolean
  onStopCount?: () => void
}

type CountdownControllers = {
  startCountdown: () => void
  stopCountdown: () => void
  resetCountdown: () => void
}

export function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
  autoStart = true,
  onStopCount,
}: CountdownOptions): [number, CountdownControllers] {
  const [count, setCount] = useState(countStart)
  const [running, setRunning] = useState(autoStart)
  const onStopCountRef = useRef(onStopCount)
  onStopCountRef.current = onStopCount

  const [stopped, setStopped] = useState(false)

  useEffect(() => {
    if (!running) return

    const id = setInterval(() => {
      setCount(prev => {
        const next = isIncrement ? prev + 1 : prev - 1
        const reached = isIncrement ? next >= countStop : next <= countStop

        if (reached) {
          clearInterval(id)
          setRunning(false)
          setStopped(true)
          return countStop
        }

        return next
      })
    }, intervalMs)

    return () => clearInterval(id)
  }, [running, intervalMs, isIncrement, countStop])

  useEffect(() => {
    if (!stopped) return
    setStopped(false)
    onStopCountRef.current?.()
  }, [stopped])

  const startCountdown = () => setRunning(true)
  const stopCountdown = () => setRunning(false)
  const resetCountdown = () => {
    setRunning(false)
    setCount(countStart)
  }

  return [count, { startCountdown, stopCountdown, resetCountdown }]
}
