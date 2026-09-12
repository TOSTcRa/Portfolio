# Bold motion layer: particle hero and per-case animations

Date: 2026-09-12. Extends the portfolio redesign spec. Approved in chat.

## Goal
Make the site visibly creative: a live 3D particle object in the hero that morphs between four
shapes standing for the four service areas, and a bespoke looping animation for each of the seven
cases instead of the numbered placeholder. Keep readability, accessibility and reduced-motion
behaviour intact.

## Hero: ParticleMorph
- Plain three.js (no react-three-fiber), loaded with `next/dynamic({ ssr: false })` inside the
  existing HeroVisual box. The current `hero.webp` stays as the first frame and fallback, so LCP
  is unchanged. The canvas fades in over the image when ready.
- ~12 000 points on desktop, 5 000 when `innerWidth < 768`. `THREE.Points` + `ShaderMaterial`
  with per-vertex attributes `posA`, `posB` and a uniform `uMix`; the CPU swaps target buffers each
  cycle. Additive blending, accent color from the CSS token (`--color-accent`), size attenuation.
- Shapes, all procedural (function `shape(name, n): Float32Array`):
  1. `shelves`: 3 x 3 x 3 lattice of small boxes (shops and CMS)
  2. `window`: flat rounded-rectangle grid, 4 x 3 tiles with a header bar (interfaces)
  3. `network`: Fibonacci sphere surface plus 40 brighter hub points (automation and bots)
  4. `shield`: 2D shield silhouette sampled by rejection, extruded 0.3 (security)
- Cycle: hold 3 s, morph 1.2 s with ease-in-out cubic, order 1 to 4 and repeat.
- Cursor: uniform `uPointer` (normalized), particles within radius 0.6 are pushed away by up to
  0.25 units; spring back. Scroll: uniform `uSpread` from 0 to 1 over the hero's scroll progress
  moves points outward along their normal and fades alpha.
- Idle: slow Y rotation 0.15 rad/s.
- Fallbacks: `prefers-reduced-motion`, missing WebGL, or `document.hidden` at mount: no canvas.
  Tab hidden later: pause the render loop. Cleanup disposes geometry, material, renderer.

## Cases: CaseVisual
`CaseVisual({ slug })` client component switching on slug; each variant is a DOM + Motion loop
inside the card's 16:10 box. Plays only when in view (`useInView`, amount 0.4), restarts on
re-entry, static end frame under reduced motion. Each loop is 4 to 6 s and uses `repeat: Infinity`
with `repeatDelay`. Data attribute `data-visual="<slug>"` on the root for tests.
1. `blackjack-nextjs`: deck at the right, 4 cards slide out with stagger and flip (`rotateY`
   180 to 0), two chips drop with a bounce.
2. `shop-storefront-catalog`: 8 product tiles in a 4 x 2 grid; every cycle a filter pill lights
   up and tiles reorder with `layout`; cart badge counts 0 to 3.
3. `site-security-cleanup`: 6 x 4 grid of file blocks, 5 red; a vertical scan line sweeps left
   to right and each red block turns emerald as the line passes; a lock icon closes at the end.
4. `agency-site-improvements`: a wireframe page; header, hero, two columns, footer blocks fly in
   one by one from random offsets and snap into place.
5. `1c-omnichannel-spec`: four channel dots on the left (Telegram, Viber, Instagram, Facebook as
   plain circles with initials), message pills travel along curves into one inbox list on the right.
6. `dating-platforms-frontend`: two profile cards; the top one swipes right, the next one
   appears, then both slide together and a heart pulses.
7. `client-portfolio-admin`: an admin sidebar with a primary button; the button presses, a new
   product tile grows into a grid, the avatar circle swaps color.
All visuals use only the existing tokens (bg, bg-raised, line, fg-muted, accent) plus one red
`#f87171` for the security "infected" state. Icons from Phosphor only.

## Headings
`KineticHeading` client component: splits text into words and characters, reveals with a
character stagger (`y: 100% -> 0` inside overflow-hidden spans) on first view. Used for the
h2 of Services, Work, Reviews, How I Work, Contact.

## Tests
- Unit: `shape()` returns exactly `n * 3` finite numbers for all four shapes.
- E2E: every case card has `[data-visual="<slug>"]`; with `reducedMotion: "reduce"` the hero has
  no `<canvas>` and case visuals are present but static (no running animations: check
  `getAnimations().length === 0` on the work section).
- Manual: both themes, 390 px width, Lighthouse desktop 95+.

## Out of scope
react-three-fiber, GLTF assets, custom cursors, sound.
