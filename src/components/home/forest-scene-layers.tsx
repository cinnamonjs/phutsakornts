import type { HomeTimeline } from './home-timeline'

type ForestSceneLayersProps = Pick<
  HomeTimeline,
  | 'backgroundTwoProgress'
  | 'backgroundTwoY'
  | 'mainBackgroundProgress'
  | 'mainBackgroundExitProgress'
>

export function ForestSceneLayers({
  backgroundTwoProgress,
  backgroundTwoY,
  mainBackgroundProgress,
  mainBackgroundExitProgress,
}: ForestSceneLayersProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-4%] z-0 bg-[url('/assets/background.png')] bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          transform: `translate3d(0, ${-mainBackgroundProgress * 20}px, 0) scale(1.03)`,
          opacity: 1 - mainBackgroundExitProgress,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-1 bg-[#08150e]/35"
        style={{ opacity: 1 - mainBackgroundExitProgress * 0.65 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-2 bg-[url('/assets/background-2.png')] bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          transform: `translate3d(0, ${backgroundTwoY}%, 0) scale(1.04)`,
          filter: `brightness(${1 - backgroundTwoProgress * 0.2}) saturate(${1 - backgroundTwoProgress * 0.12})`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-3 bg-[linear-gradient(to_bottom,transparent_0%,rgb(4_17_15/0.12)_58%,rgb(4_17_15/0.55)_100%)] will-change-transform"
        style={{
          transform: `translate3d(0, ${backgroundTwoY}%, 0)`,
          opacity: backgroundTwoProgress,
        }}
      />
    </>
  )
}
