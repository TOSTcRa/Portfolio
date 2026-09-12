# Bold Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a three.js particle-morph hero and seven bespoke per-case animations, plus kinetic section headings, on top of the existing site.

**Architecture:** `ParticleMorph` is a self-contained three.js client component loaded with `next/dynamic` over the existing hero image. `CaseVisual` is a slug switch over seven small Motion components rendered inside `CaseCard`. `KineticHeading` replaces the plain h2 in five sections.

**Tech Stack:** three 0.186 (raw, no R3F), motion 13, existing Next 16 app.

**Spec:** `docs/superpowers/specs/2026-09-12-bold-motion-design.md`

## Global Constraints
Same as the redesign plan: `'use client'` on every animated leaf, reduced motion respected everywhere, no em-dashes, Phosphor icons only, tokens only, commits with the Co-Authored-By line.

## File Structure
```
src/lib/shapes.ts                       shape(name, n): Float32Array, 4 procedural shapes
tests/unit/shapes.test.ts
src/components/hero/ParticleMorph.tsx   three.js scene, 'use client'
src/components/hero/ParticleMorphLoader.tsx  next/dynamic ssr:false wrapper
src/components/sections/HeroVisual.tsx  mounts loader over the image
src/components/visuals/CaseVisual.tsx   slug switch
src/components/visuals/Blackjack.tsx, ShopCatalog.tsx, SecurityScan.tsx, AgencyBlocks.tsx,
  OmniInbox.tsx, DatingMatch.tsx, AdminPanel.tsx
src/components/motion/KineticHeading.tsx
src/components/sections/CaseCard.tsx    uses CaseVisual when no cover
tests/e2e/site.spec.ts                  + visuals and reduced-motion tests
```

### Task 1: Shapes + unit test
- [ ] Write `tests/unit/shapes.test.ts`: for each of `shelves|window|network|shield`, `shape(name, 500)` has length 1500, all finite, bounding box within [-1.6, 1.6].
- [ ] Implement `src/lib/shapes.ts`; run `npx vitest run tests/unit/shapes.test.ts`; commit `feat: procedural particle shapes`.

### Task 2: ParticleMorph
- [ ] Implement `ParticleMorph.tsx` per spec (Points + ShaderMaterial, uniforms uMix/uPointer/uSpread/uTime, cycle timer, pointer handler on the container, scroll spread from `useScroll`, visibility pause, dispose on unmount).
- [ ] `ParticleMorphLoader.tsx` with `dynamic(() => import("./ParticleMorph"), { ssr: false })`, skips when `matchMedia("(prefers-reduced-motion: reduce)")` matches or `!window.WebGLRenderingContext`.
- [ ] Mount in `HeroVisual.tsx` absolutely over the image with a fade-in class; keep the parallax wrapper.
- [ ] Manual check: dev server, desktop and 390 px, both themes. Commit `feat: particle morph hero`.

### Task 3: Case visuals
- [ ] Seven components per spec, each `'use client'`, root `data-visual={slug}`, `useInView` gate, `useReducedMotion` static frame.
- [ ] `CaseVisual.tsx` switch; `CaseCard.tsx` renders `<CaseVisual slug={c.slug} />` when `!c.cover`; move the dating and client-portfolio covers into `gallery` in `cases.ts` so all seven cards use visuals.
- [ ] E2E: `#work [data-visual]` count is 7 and each slug present. Commit `feat: per-case animations`.

### Task 4: Kinetic headings
- [ ] `KineticHeading.tsx` (`as: "h2"`, words/chars, stagger 0.015 s, once). Replace h2 in Services, WorkStack, ReviewsMarquee, HowIWork, Contact.
- [ ] E2E reduced-motion: no `<canvas>` in hero; `document.getAnimations().length === 0` after scrolling the work section. Commit `feat: kinetic section headings`.

### Task 5: Pre-flight and merge
- [ ] Dash/eyebrow/scroll-listener greps, typecheck, lint, unit, e2e, Lighthouse desktop 95+, screenshots at 1440 and 390 in both themes. Commit, merge to master.
