import { useEffect, useRef } from 'react'

import { AboutPanel } from './about-panel'
import { ForestSceneLayers } from './forest-scene-layers'
import { HomeClouds } from './home-clouds'
import { HomeHero, HomeScrollPrompt } from './home-hero'
import { HomeNavbar } from './home-navbar'
import { useHomeTimeline } from './home-timeline'
import { getLocale } from '#/paraglide/runtime'

export function HomePage() {
  const locale = getLocale()
  const storyRef = useRef<HTMLElement>(null)
  const timeline = useHomeTimeline(storyRef)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#04110f] text-paper">
      <section
        ref={storyRef}
        className="relative h-[240vh]"
        aria-label="Scroll from Index 01 to Index 02"
      >
        <div
          id="about"
          className="pointer-events-none absolute top-1/2 h-px w-px scroll-mt-0"
          aria-hidden="true"
        />

        <div className="sticky top-0 h-screen overflow-hidden bg-[#04110f]">
          <ForestSceneLayers {...timeline} />
          <HomeClouds
            opacity={Math.max(0, 1 - timeline.backgroundTwoProgress * 1.15)}
          />

          <div className="absolute inset-0 z-10 mx-auto flex w-full flex-col px-6 sm:px-10">
            <HomeNavbar locale={locale} />
            <HomeHero heroExitProgress={timeline.heroExitProgress} />
            <HomeScrollPrompt />
          </div>

          <AboutPanel
            indexTwoContentProgress={timeline.indexTwoContentProgress}
            indexTwoProgress={timeline.indexTwoProgress}
            indexTwoY={timeline.indexTwoY}
          />
        </div>
      </section>
    </main>
  )
}
