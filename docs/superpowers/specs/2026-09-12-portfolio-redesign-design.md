# Portfolio redesign: tostcr-portfolio.vercel.app

Date: 2026-09-12
Status: approved in chat, pending spec review

## 1. Goal

Replace the current portfolio (Next.js + Supabase, broken images, outdated "Frontend & 3D" positioning)
with a new static site that reflects what Andrii actually does now: frontend and fullstack work for
e-commerce and product clients, backed by 13 real 10/10 reviews on Freelancehunt.

Audience: (a) Ukrainian clients arriving from Freelancehunt, (b) English-speaking clients and hiring
managers. Success: a visitor understands in 10 seconds what Andrii does, sees proof (cases + reviews),
and has one obvious way to contact him.

## 2. Design read and dials (design-taste-frontend)

Reading this as: developer portfolio for freelance clients and hiring managers, with a dark,
restrained, type-driven language, leaning toward Tailwind v4 + Geist + Motion with deliberate,
motivated choreography.

- DESIGN_VARIANCE: 7 (asymmetric, left-aligned, generous empty zones; collapses to one column < 768px)
- MOTION_INTENSITY: 8 (user explicitly asked for strong animation; every animation must be motivated)
- VISUAL_DENSITY: 3

Aesthetic: "dark tech", honest native CSS + Tailwind. No design-system package.
Fonts: Geist (text) + Geist Mono (labels, numbers, tags) via `next/font`. Not Inter.
Palette: zinc-950 base, zinc-100 text, one accent: desaturated emerald (`#34d399` family, used at
< 80% saturation). Light theme uses the same tokens inverted. Theme follows `prefers-color-scheme`,
with a manual toggle in the nav. Corner radius: one scale, 6px, everywhere.
Icons: `@phosphor-icons/react`, strokeWidth 1.5, only family in the tree.
Zero em-dashes anywhere in visible text.

## 3. Stack

- Next.js 15, App Router, TypeScript strict, React Server Components by default.
- Tailwind v4 via `@tailwindcss/postcss`.
- `next-intl` for i18n. Routes: `/uk/...` and `/en/...`. Root `/` redirects to the best match by
  `Accept-Language`, default `uk`.
- Motion (`motion/react`) for all animation. No GSAP, no Three.js. Motion components are isolated
  `'use client'` leaves; server components render static layout.
- Content in typed TypeScript files under `src/content/`, validated with `zod` at build.
- Images in `public/` and `src/content/images/`, served through `next/image`.
- Contact form: route handler `POST /api/contact` that forwards to a Telegram bot. Env vars
  `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. If either is missing at build, the form is not rendered;
  only the direct links remain.
- Deploy: Vercel, same project and domain as today.

## 4. Information architecture

```
/[locale]                 landing (single long page, anchored sections)
/[locale]/work/[slug]     case study page
/api/contact              POST only
```

Nav (one line, 64px): Work, Reviews, Contact, language switch (UA/EN), theme toggle.
Nav labels are anchors on the landing page and real links from case pages.

## 5. Landing page sections and their motion

Each section uses a different layout family. Eyebrow labels: at most two on the whole page.

### 5.1 Hero (asymmetric split)
Left 7/12: headline, subtext, CTAs. Right 5/12: portrait photo.
- Headline (2 lines max): UA "Фронтенд і фулстек для магазинів і продуктів." / EN "Frontend and
  fullstack for shops and products."
- Subtext ≤ 20 words, from the Freelancehunt CV: React/Next.js interfaces, WordPress/OpenCart/Shopify
  shops, integrations, security.
- CTAs: primary "Написати в Telegram" / "Message on Telegram"; secondary "Дивитись роботи" /
  "See work". These are the only two CTA intents on the page; the same labels are reused everywhere.
- Motion: headline reveals line by line through a clip mask with stagger (storytelling). Portrait
  fades and scales in from 1.04 to 1. Primary CTA is magnetic (pull toward cursor via
  `useMotionValue`, feedback).
- Portrait: user provides a photo. Until then, a labeled placeholder slot; the Freelancehunt avatar
  is 225px and too small for production.

### 5.2 Proof strip (numbers, full width, under hero)
Four numbers from the Freelancehunt profile: completed projects, success rate, average grade,
positive reviews. Fetched at build time from `api.freelancehunt.com/v2/freelancers/618668` with a
static fallback (14 / 100% / 9.98 / 13) if the request fails. Mono font.
- Motion: count-up from 0 on first viewport entry (hierarchy: draws the eye to proof). Once.

### 5.3 What I do (2 + 2 asymmetric grid, not three equal cards)
Four blocks mirroring the profile text: Shops and CMS; React and Next.js interfaces; Analytics and
automation; Security and performance. Each: short title, ≤ 25-word body, tag row in mono.
Background variation: two cells tinted zinc-900, two plain, so the grid has rhythm.
- Motion: stagger reveal on scroll (`whileInView`, once).

### 5.4 Selected work (sticky-stack)
Case cards pinned and stacked as the user scrolls. Built with CSS `position: sticky` plus Motion
`useScroll` + `useTransform` for the scale/opacity of the card behind. No scroll listeners.
Card: title, client type, one-line task, stack tags, screenshot when available. Cards without a
screenshot render a typographic composition (large mono title on tinted background), never a
broken or fake image. Whole card links to the case page.
Under reduced motion the stack becomes a plain vertical list.
Cases (initial set, order by impact):
1. Blackjack game on Next.js (Px000, 22 000 UAH)
2. New storefront and catalog for an online shop (repeat client, 4 projects, 6 000-14 000 UAH)
3. Site security cleanup and hardening (tilyouknow, 5 000 UAH)
4. Shop feature development, two rounds (SOK Agency, 4 500 + 7 000 UAH)
5. Technical spec for omnichannel messaging in custom 1C (Euroshina-Kiev, 3 000 UAH)
6. Dating platform frontend: flirtfordate.com and bez-kompleksov.com (employment, 2024-2025)
7. Client portfolio site with admin panel (freelance, 1 500 UAH)
Budgets are shown on case pages only, as a range, never on cards. NDA: user marks any case to drop.

### 5.5 Reviews (single marquee)
Horizontal marquee of review cards, the only marquee on the page. Each card: quote cut to ≤ 3 lines,
client name and project name, link to the review on Freelancehunt. Data: 13 reviews from the API,
stored statically in `src/content/reviews.ts` with original language preserved (UA or RU quotes are
shown as written; the EN site shows the same quotes with a one-line "translated" toggle later, out
of scope for v1: v1 shows original text on both locales).
- Motion: continuous marquee, pauses on hover, static row under reduced motion.

### 5.6 How I work (vertical stack, text only)
The three sentences from the profile: say what I will do and what can go wrong, then do it; if the
task is simpler and cheaper than it looks, I say so. One headline, one paragraph, max-width 65ch.
No motion beyond a fade.

### 5.7 Contact (split: links left, form right)
Left: Telegram (primary), email, GitHub, Freelancehunt, availability line "Open for new projects"
driven by the profile status at build time.
Right: form with name, contact (email or Telegram), message. Label above input, error below.
States: idle, submitting (button shows spinner text), success (inline confirmation replaces form),
error (inline message, form stays filled). Honeypot field + rate limit (5/hour/IP in memory) on the
route handler.

### 5.8 Footer
Name, year, link to source repo, language switch.

## 6. Case page `/[locale]/work/[slug]`

Layout: title, meta row (client type, year, stack), then sections: Task, What I did, Result, and a
link if public. Optional image gallery (next/image, 16:9). Prev/next case links at the bottom.
Motion: shared-element transition of the card title into the page title via Motion `layoutId`
where both render on the client; page content fades in. Reduced motion: no transition.

Case content lives in `src/content/cases/<slug>.<locale>.mdx` or in one TS object per case with
`uk` and `en` fields. Decision: one TS object per case (typed, no MDX pipeline). Long text is a
string array of paragraphs.

## 7. Content model

```ts
type Case = {
  slug: string;
  order: number;
  year: number;
  clientType: LocalizedString;        // "Online shop", "Agency", "Product team"
  title: LocalizedString;
  summary: LocalizedString;           // one line on the card
  stack: string[];
  cover?: { src: string; alt: LocalizedString };
  gallery?: Image[];
  link?: string;
  budgetUAH?: [number, number];
  body: { task: LocalizedText; work: LocalizedText; result: LocalizedText };
};

type Review = {
  id: number;
  author: string; company?: string; projectName: string;
  quote: string; lang: "uk" | "ru";
  grade: number; publishedAt: string; url: string;
};

type Profile = { completed: number; successRate: number; averageGrade: number;
                 positiveReviews: number; available: boolean; fetchedAt: string };
```

`zod` schemas validate all three at build; a failing schema fails the build.

## 8. Data flow

- Build time: `scripts/fetch-profile.ts` calls the Freelancehunt API (public endpoint, token optional)
  and writes `src/content/profile.generated.json`. Failure keeps the committed fallback file.
- Runtime: fully static except `/api/contact`.
- The reviews are not refetched at build; they are curated in the repo so quotes can be trimmed.

## 9. Error handling

- Missing Telegram env: form hidden, no runtime error.
- Telegram API failure: route returns 502 with a generic message; the form shows the direct Telegram
  link as the fallback.
- Missing case cover: typographic card. Missing portrait: placeholder slot flagged in the build log.
- Unknown slug: `notFound()`.

## 10. Testing

- `tsc --noEmit`, ESLint.
- Vitest: content schemas pass; case slugs unique; every case has both locales; contact route
  rejects honeypot, rate-limits, and forwards a valid payload (Telegram fetch mocked).
- Playwright: `/uk` and `/en` render hero + nav; each case page returns 200; language switch keeps
  the current path; reduced-motion mode renders the work section as a list.
- Lighthouse on the deployed preview: 95+ on all four categories, mobile.
- Manual: both themes checked; pre-flight checklist from the design skill run before handoff.

## 11. Out of scope

Blog, admin panel, CMS, 3D, the old GitHub toy projects, analytics, review translation toggle.

## 12. Open content items the user provides later

1. Portrait photo (min 1200px on the long side).
2. Screenshots or URLs for shop cases; permission to name clients or keep them anonymous.
3. Telegram bot token and chat id for the contact form.
4. Which cases, if any, are under NDA.
