import { useEffect, useState, type RefObject } from 'react'

export type HomeTimeline = {
  backgroundTwoProgress: number
  backgroundTwoY: number
  indexTwoProgress: number
  indexTwoY: number
  heroExitProgress: number
  mainBackgroundProgress: number
  mainBackgroundExitProgress: number
  indexTwoContentProgress: number
}

export function useHomeTimeline(
  sectionRef: RefObject<HTMLElement | null>,
): HomeTimeline {
  const rawProgress = useScrollProgress(sectionRef)
  const progress = paceScroll(rawProgress)

  const backgroundTwoProgress = range(progress, 0.06, 0.92)
  const indexTwoProgress = range(rawProgress, 0.5, 1)
  const heroExitProgress = range(rawProgress, 0.25, 0.72)
  const mainBackgroundProgress = range(rawProgress, 0.1, 1)
  const mainBackgroundExitProgress = range(rawProgress, 0.64, 0.9)
  const indexTwoContentProgress = range(rawProgress, 0.58, 0.82)

  return {
    backgroundTwoProgress,
    backgroundTwoY: (1 - easeInOut(backgroundTwoProgress)) * 100,
    indexTwoProgress,
    indexTwoY: (1 - easeInOut(indexTwoProgress)) * 100,
    heroExitProgress,
    mainBackgroundProgress,
    mainBackgroundExitProgress,
    indexTwoContentProgress,
  }
}

function range(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)))
}

function paceScroll(value: number) {
  return value <= 0.5 ? value * 1.3 : 0.65 + (value - 0.5) * 0.7
}

function easeInOut(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2
}

function useScrollProgress(sectionRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current
        if (!section) return

        const rect = section.getBoundingClientRect()
        const scrollDistance = Math.max(1, rect.height - window.innerHeight)
        const nextProgress = -rect.top / scrollDistance
        setProgress(Math.min(1, Math.max(0, nextProgress)))
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [sectionRef])

  return progress
}
