# Design QA

## Comparison target

- Source visual truth paths: `F:\phutsakornts\public\assets\background.png`, `F:\phutsakornts\public\assets\background-2.png`, and `C:\Users\User\AppData\Local\Temp\codex-clipboard-b310d8cc-8048-4d01-b44c-9dafaa5e61c7.png`
- Implementation: `http://localhost:3000/` and `http://localhost:3000/#about`, captured in the Codex in-app browser
- Viewport: 1188 x 912 CSS px; devicePixelRatio 1
- Source pixels: background 1536 x 1024; navbar reference 454 x 58
- Implementation scroll size: 1188 x 2645 CSS px
- Density normalization: the supplied background remains a cover image; the navbar is compared as a focused component region
- States checked: daylight hero, controlled Tegaki playback in the reduced-motion browser, manual scroll transition, and dark profile anchor state

## Evidence

### Full-view comparison

The first viewport preserves the supplied flora background, compact glass island, centered Playwrite IE headline, Sora description, and GitHub action. The full sequence now runs inside one 400vh sticky scene: `background.png` stays pinned beneath the composition, `background-2.png` rises from below, and Index 02 starts rising at 50% scroll. During the late phase, the original background fades and shifts upward while the Index 01 content makes a small upward exit; the sequence ends on a full-screen Index 02.

### Focused region comparison

The navbar keeps the compact island silhouette with no visible outer border, an 18px radius, translucent forest tint, backdrop blur, CSS-only grain, and a restrained upper-right highlight. The dark profile keeps a legible two-column hierarchy, visible forest detail, thin rules, and a high-contrast GitHub action.

## Required fidelity surfaces

- Fonts and typography: Playwrite IE is visible in the hero and signature. TegakiRenderer uses a controlled 3.2-second timeline so the requested writing sequence remains visible in this preview, then crossfades to the complete Playwrite text. Sora carries supporting text and profile UI.
- Spacing and layout rhythm: the daylight hero remains centered and the night profile uses a stable sticky viewport with a large editorial statement and compact definition list.
- Colors and visual tokens: forest greens shift toward a cool near-black night palette through scroll-linked opacity, brightness, and saturation changes.
- Image quality and asset fidelity: `public/assets/background.png` remains the Index 01 image and the user-supplied `public/assets/background-2.png` is used for the transition. Both remain full-bleed source assets with no generated texture replacement.
- Copy and content: the profile uses the existing name, role, homepage description, repository link, and a toolkit evidenced by the project dependencies.

## Interaction checks

- The hero headline visibly draws even while the preview browser reports `prefers-reduced-motion: reduce`, and resolves to the complete title.
- From 0–50%, Index 01 remains pinned and its background does not move while `background-2.png` rises from the bottom beneath the foreground copy.
- At 50%, Index 02 begins rising from the bottom. `background-2.png` continues upward behind it; after 58%, the Index 01 copy shifts upward by 48px and fades, and after 64% the original background starts its upward fade.
- At 100%, Index 02 fills the viewport over a solid `#04110f` surface.
- “Scroll to explore” reaches `#about` and the dark profile is fully readable at that anchor.
- Both GitHub actions point to `https://github.com/cinnamonjs/phutsakornts` in a new tab.
- Docs and EN/TH controls remain present.

## Findings

No actionable P0, P1, or P2 visual findings remain. The existing TanStack root-route not-found warning is unrelated to the homepage design and does not affect this flow.

## Comparison history

- Initial Tegaki finding: reduced-motion froze the renderer at time zero, so the requested writing sequence was never visible.
- First fix: rendered a static motion-preference fallback, which restored the title but still did not satisfy the requested animation.
- Final fix: moved TegakiRenderer to a controlled requestAnimationFrame timeline, making the outline visibly draw from the first letter through the full Playwrite IE title in the current preview.
- Initial parallax finding: `overflow-x-hidden` created an unintended scroll container, breaking the sticky scene; the first motion implementation also remained at its initial opacity in the reduced-motion preview.
- Fix: switched the page wrapper to `overflow-x-clip` and moved scroll progress to a requestAnimationFrame-backed viewport calculation with a static reduced-motion state.
- Post-fix evidence: the browser shows the complete daylight headline, a functional profile anchor, a pinned night-forest viewport, readable profile content, and preserved forest detail.

## Implementation checklist

- [x] Tegaki headline no longer disappears.
- [x] Controlled Tegaki timeline is visibly animated in the current preview.
- [x] Daylight hero and glass island are preserved.
- [x] Index 01 headline, description, and CTA participate in the parallax transition.
- [x] User-supplied `background-2.png` rises from the bottom while the original background remains pinned underneath.
- [x] Index 02 begins rising at 50% while `background-2.png` continues moving.
- [x] Original background and Index 01 content exit only during the late transition phase.
- [x] Index 02 is a solid `#04110f` section with no background image.
- [x] Scroll-linked light-to-night forest transition is implemented.
- [x] Background parallax travels farther than profile copy.
- [x] Dark personal profile is responsive and readable.
- [x] Scroll-to-profile and GitHub links work.
- [x] Browser preview visually verified.

## Follow-up polish

- P3: replace or extend the profile facts when the user provides additional verified biography, experience, or contact details.

final result: passed
