# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new static, bilingual (uk/en), dark-first portfolio site for Andrii Tantsiura (TOSTcR) with real Freelancehunt cases and reviews, strong but motivated Motion animation, and a Telegram-backed contact form, deployable to the existing Vercel project.

**Architecture:** Next.js 16 App Router with a `[locale]` root segment handled by next-intl. All content lives in typed TypeScript files validated by zod at build time. Server Components render layout; every animated piece is an isolated `'use client'` leaf using Motion. One route handler (`/api/contact`) forwards form submissions to a Telegram bot.

**Tech Stack:** Next.js 16.3, React 19.3, TypeScript, Tailwind v4 (`@tailwindcss/postcss`), next-intl 4.14, motion 13, zod 4, @phosphor-icons/react 2, Geist + Geist Mono via `next/font/google`, Vitest 5, Playwright 1.63, Node 26.

**Spec:** `docs/superpowers/specs/2026-09-12-portfolio-redesign-design.md`

## Global Constraints

- Package manager: `npm`. Node 26 (native TypeScript type stripping is used for `scripts/*.ts`).
- Locales: `uk` (default) and `en`. Routes always prefixed: `/uk/...`, `/en/...`.
- Fonts: Geist (sans) and Geist Mono (mono), subsets `latin` + `cyrillic`. Never Inter.
- Colors: zinc-950 base, zinc-100 text, one accent `--color-accent: #34d399` (dark) / `#059669` (light). No other accent anywhere.
- Corner radius: 6px everywhere (`rounded-md` maps to it).
- Icons: `@phosphor-icons/react` only, `weight="regular"`, size 20 unless stated. No hand-rolled SVG icons.
- Visible text contains zero em-dashes (`—`) and zero en-dashes (`–`). Use `-` or a period.
- All animation via `motion/react` or CSS keyframes. No `window.addEventListener('scroll')`. Everything respects `prefers-reduced-motion` (Motion `useReducedMotion()` or CSS media query).
- Every animated component starts with `'use client'`. Server Components never import from `motion/react`.
- Eyebrow labels (small uppercase mono above a headline): max 2 on the landing page.
- CTA labels: exactly two intents on the landing page. Telegram intent label: uk "Написати в Telegram" / en "Message on Telegram". Work intent label: uk "Дивитись роботи" / en "See work". Reuse verbatim.
- Commits: conventional prefix (`feat:`, `test:`, `chore:`, `docs:`), end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Git identity: `git -c user.name=TOSTcR -c user.email=andrijtantsiura@gmail.com` or set it once with `git config user.name TOSTcR && git config user.email andrijtantsiura@gmail.com` in Task 1.
- Working directory is the repo root `/home/tostcr/Work/freelancehunt/personal` (already a git repo with the spec committed).

## File Structure

```
package.json, next.config.ts, postcss.config.mjs, tsconfig.json, eslint.config.mjs
vitest.config.ts, playwright.config.ts, .env.example, .gitignore
messages/uk.json                 UI strings (nav, hero, sections, form)
messages/en.json
scripts/fetch-profile.ts         build-time fetch of Freelancehunt profile numbers
src/proxy.ts                     next-intl locale routing (Next 16 name for middleware)
src/i18n/routing.ts              defineRouting
src/i18n/navigation.ts           Link, usePathname, useRouter bound to routing
src/i18n/request.ts              getRequestConfig, loads messages/<locale>.json
src/content/schema.ts            zod schemas + TS types: Localized, Case, Review, Profile
src/content/cases.ts             7 cases, uk + en
src/content/reviews.ts           14 reviews, original language
src/content/profile.fallback.json
src/content/profile.generated.json   written by scripts/fetch-profile.ts, committed
src/content/profile.ts           loads generated or fallback, validates
src/content/index.ts             getCases(), getCase(slug), getReviews(), getProfile()
src/lib/contact.ts               contactSchema, RateLimiter, sendTelegram
src/lib/site.ts                  constants: links, name, telegram url
src/app/globals.css              Tailwind v4 theme tokens, dark variant, marquee keyframes
src/app/[locale]/layout.tsx      html/body, fonts, theme script, NextIntlClientProvider
src/app/[locale]/page.tsx        landing: composes sections
src/app/[locale]/work/[slug]/page.tsx
src/app/[locale]/[...rest]/page.tsx   notFound() for unknown paths
src/app/[locale]/not-found.tsx
src/app/api/contact/route.ts
src/components/layout/Nav.tsx (server) + NavClient.tsx (client: theme + locale)
src/components/layout/Footer.tsx
src/components/layout/ThemeScript.tsx
src/components/motion/Reveal.tsx        generic whileInView fade/slide
src/components/motion/MagneticLink.tsx  magnetic CTA
src/components/motion/CountUp.tsx
src/components/motion/PageTransition.tsx
src/components/sections/Hero.tsx + HeroHeadline.tsx (client) + HeroVisual.tsx (client)
src/components/sections/ProofStrip.tsx
src/components/sections/Services.tsx
src/components/sections/WorkStack.tsx (client) + CaseCard.tsx (client)
src/components/sections/ReviewsMarquee.tsx
src/components/sections/HowIWork.tsx
src/components/sections/Contact.tsx + ContactForm.tsx (client)
src/components/ui/Button.tsx            shared button/link styles (server-safe)
public/hero.webp
tests/unit/content.test.ts
tests/unit/contact.test.ts
tests/e2e/site.spec.ts
```

---

### Task 1: Scaffold the project

**Files:**
- Create: everything create-next-app produces, then `.env.example`, `vitest.config.ts`, `playwright.config.ts`
- Modify: `package.json`, `.gitignore`, `tsconfig.json`

**Interfaces:**
- Produces: `npm run dev|build|lint|typecheck|test|test:e2e` scripts; `@/` path alias to `src/`.

- [ ] **Step 1: Scaffold into the existing repo**

The directory already contains `.git`, `.omc/`, and `docs/`. create-next-app refuses non-empty dirs, so scaffold into a temp dir and move files in.

```bash
cd /home/tostcr/Work/freelancehunt/personal
git config user.name TOSTcR && git config user.email andrijtantsiura@gmail.com
npx --yes create-next-app@16.3.5 /tmp/scaffold-portfolio --ts --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*" --use-npm --no-git --yes
cp -r /tmp/scaffold-portfolio/. .
rm -rf /tmp/scaffold-portfolio
rm -f src/app/page.tsx src/app/layout.tsx public/*.svg
ls
```

Expected: `package.json`, `next.config.ts`, `postcss.config.mjs`, `src/app/globals.css`, `eslint.config.mjs`, `tsconfig.json`, `node_modules` present. `src/app/page.tsx` and `src/app/layout.tsx` removed (the locale layout replaces them in Task 4).

- [ ] **Step 2: Install runtime and dev dependencies**

```bash
npm install next-intl@4.14.4 motion@13.2.0 zod@4.6.2 @phosphor-icons/react@2.1.10
npm install -D vitest@5.0.0 @playwright/test@1.63.0
npx playwright install chromium
```

- [ ] **Step 3: Add scripts and configs**

Edit `package.json` `scripts` to exactly:

```json
{
  "prebuild": "node scripts/fetch-profile.ts",
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:e2e": "playwright test"
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000/uk",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
```

Create `.env.example`:

```
# Contact form. Both required for the form to render.
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
# Optional. Lets scripts/fetch-profile.ts refresh numbers at build time.
FREELANCEHUNT_TOKEN=
```

Append to `.gitignore`:

```
test-results/
playwright-report/
.env
.env.local
```

In `tsconfig.json`, make sure `"include"` contains `"scripts/**/*.ts"` and `"tests/**/*.ts"` in addition to the defaults, and `"exclude"` contains `"node_modules"`.

- [ ] **Step 4: Verify the toolchain runs**

```bash
mkdir -p scripts && printf 'console.log("profile: skipped (Task 3)");\n' > scripts/fetch-profile.ts
npm run typecheck && npm run lint && npx vitest run --passWithNoTests
```

Expected: typecheck passes, lint passes (no source files yet beyond scaffold), vitest reports no tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 project with Tailwind, next-intl, motion, vitest, playwright

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Content schema and content files

**Files:**
- Create: `src/content/schema.ts`, `src/content/cases.ts`, `src/content/reviews.ts`, `src/content/profile.fallback.json`, `src/content/profile.ts`, `src/content/index.ts`, `src/lib/site.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces:
  - `type Locale = "uk" | "en"`; `type Localized = Record<Locale, string>`; `type LocalizedText = Record<Locale, string[]>`
  - `type Case`, `type Review`, `type Profile` (shapes below)
  - `getCases(): Case[]` sorted by `order`; `getCase(slug: string): Case | undefined`; `getReviews(): Review[]` newest first; `getProfile(): Profile`
  - `site` constants: `{ name, handle, telegram, email, github, freelancehunt, repo }`

- [ ] **Step 1: Write the failing content tests**

`tests/unit/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getCases, getCase, getReviews, getProfile } from "@/content";
import { caseSchema, reviewSchema, profileSchema } from "@/content/schema";

const DASHES = /[–—]/;

describe("cases", () => {
  it("has at least 7 cases with unique slugs", () => {
    const cases = getCases();
    expect(cases.length).toBeGreaterThanOrEqual(7);
    expect(new Set(cases.map((c) => c.slug)).size).toBe(cases.length);
  });
  it("all cases validate and have both locales", () => {
    for (const c of getCases()) {
      expect(() => caseSchema.parse(c)).not.toThrow();
      expect(c.title.uk.length).toBeGreaterThan(0);
      expect(c.title.en.length).toBeGreaterThan(0);
      expect(c.body.task.uk.length).toBeGreaterThan(0);
      expect(c.body.task.en.length).toBeGreaterThan(0);
    }
  });
  it("is sorted by order ascending", () => {
    const orders = getCases().map((c) => c.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });
  it("getCase returns by slug and undefined for unknown", () => {
    expect(getCase(getCases()[0].slug)).toBeDefined();
    expect(getCase("nope")).toBeUndefined();
  });
  it("contains no em or en dashes in visible text", () => {
    const text = JSON.stringify(getCases());
    expect(DASHES.test(text)).toBe(false);
  });
});

describe("reviews", () => {
  it("has 14 validated reviews, newest first", () => {
    const reviews = getReviews();
    expect(reviews.length).toBe(14);
    for (const r of reviews) expect(() => reviewSchema.parse(r)).not.toThrow();
    const dates = reviews.map((r) => r.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });
  it("contains no em or en dashes", () => {
    expect(DASHES.test(JSON.stringify(getReviews()))).toBe(false);
  });
});

describe("profile", () => {
  it("validates and has sane numbers", () => {
    const p = getProfile();
    expect(() => profileSchema.parse(p)).not.toThrow();
    expect(p.completed).toBeGreaterThanOrEqual(14);
    expect(p.successRate).toBe(100);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: FAIL, cannot resolve `@/content`.

- [ ] **Step 3: Write the schema**

`src/content/schema.ts`:

```ts
import { z } from "zod";

export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];

const noDashes = (s: string) => !/[–—]/.test(s);
const text = z.string().min(1).refine(noDashes, "no em/en dashes in visible text");

export const localizedSchema = z.object({ uk: text, en: text });
export type Localized = z.infer<typeof localizedSchema>;

export const localizedTextSchema = z.object({
  uk: z.array(text).min(1),
  en: z.array(text).min(1),
});
export type LocalizedText = z.infer<typeof localizedTextSchema>;

const imageSchema = z.object({
  src: z.string().startsWith("/"),
  alt: localizedSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ContentImage = z.infer<typeof imageSchema>;

export const caseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().positive(),
  year: z.number().int().min(2020).max(2100),
  clientType: localizedSchema,
  title: localizedSchema,
  summary: localizedSchema,
  stack: z.array(z.string().min(1)).min(1).max(8),
  cover: imageSchema.optional(),
  gallery: z.array(imageSchema).optional(),
  link: z.string().url().optional(),
  budgetUAH: z.tuple([z.number().int().positive(), z.number().int().positive()]).optional(),
  body: z.object({
    task: localizedTextSchema,
    work: localizedTextSchema,
    result: localizedTextSchema,
  }),
});
export type Case = z.infer<typeof caseSchema>;

export const reviewSchema = z.object({
  id: z.number().int().positive(),
  author: text,
  company: z.string().optional(),
  projectName: text,
  quote: text.max(240),
  lang: z.enum(["uk", "ru"]),
  grade: z.number().min(0).max(10),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  url: z.string().url(),
});
export type Review = z.infer<typeof reviewSchema>;

export const profileSchema = z.object({
  completed: z.number().int().nonnegative(),
  successRate: z.number().min(0).max(100),
  averageGrade: z.number().min(0).max(10),
  positiveReviews: z.number().int().nonnegative(),
  available: z.boolean(),
  fetchedAt: z.string(),
});
export type Profile = z.infer<typeof profileSchema>;
```

- [ ] **Step 4: Write site constants**

`src/lib/site.ts`:

```ts
export const site = {
  name: "Andrii Tantsiura",
  handle: "TOSTcR",
  url: "https://tostcr-portfolio.vercel.app",
  telegram: "https://t.me/tostcr",
  email: "andrijtantsiura@gmail.com",
  github: "https://github.com/TOSTcRa",
  freelancehunt: "https://freelancehunt.com/freelancer/TOSTcR.html",
  freelancehuntId: 618668,
  repo: "https://github.com/TOSTcRa/Portfolio",
} as const;
```

- [ ] **Step 5: Write the cases**

`src/content/cases.ts`. Copy verbatim; text is derived from the Freelancehunt reviews and profile. Client names are not shown on cards; case pages name only the client type.

```ts
import type { Case } from "./schema";

export const cases: Case[] = [
  {
    slug: "blackjack-nextjs",
    order: 1,
    year: 2025,
    clientType: { uk: "Продуктова команда", en: "Product team" },
    title: { uk: "Гра Blackjack на Next.js", en: "Blackjack game on Next.js" },
    summary: {
      uk: "Доробка і розширення браузерної гри: логіка раундів, ставки, стан гравця.",
      en: "Extending a browser card game: round logic, bets, player state.",
    },
    stack: ["Next.js", "React", "TypeScript", "Tailwind"],
    budgetUAH: [20000, 25000],
    body: {
      task: {
        uk: ["Замовник мав частково готову гру Blackjack на Next.js і потребував довести її до робочого стану: виправити логіку роздачі, додати ставки і коректний підрахунок результатів раунду."],
        en: ["The client had a half-finished Blackjack game on Next.js and needed it working: fixed dealing logic, betting, and correct round scoring."],
      },
      work: {
        uk: [
          "Розібрав існуючий код, виніс ігрову логіку в окремий чистий модуль з тестами.",
          "Реалізував ставки, split і double, стан гравця між раундами.",
          "Переробив інтерфейс столу: анімації карт, адаптив під мобільні.",
        ],
        en: [
          "Untangled the existing code and moved the game logic into a separate pure module with tests.",
          "Implemented bets, split and double, and player state across rounds.",
          "Rebuilt the table UI: card animations and a mobile layout.",
        ],
      },
      result: {
        uk: ["Гра запущена, правила відповідають класичному Blackjack, оцінка замовника 10 з 10."],
        en: ["The game shipped with classic Blackjack rules. Client rating 10 out of 10."],
      },
    },
  },
  {
    slug: "shop-storefront-catalog",
    order: 2,
    year: 2026,
    clientType: { uk: "Інтернет-магазин", en: "Online shop" },
    title: { uk: "Нова вітрина і каталог для інтернет-магазину", en: "New storefront and catalog for an online shop" },
    summary: {
      uk: "Сім проєктів з одним замовником: вітрина, каталог, кошик, новий функціонал магазину.",
      en: "Seven projects with one client: storefront, catalog, cart, new shop features.",
    },
    stack: ["PHP", "JavaScript", "MySQL", "OpenCart"],
    budgetUAH: [3000, 14000],
    body: {
      task: {
        uk: ["Магазин на PHP з великою кількістю власних доробок. Потрібно було послідовно оновити вітрину, зробити новий каталог, переробити кошик і додати функції, які давно висіли в планах."],
        en: ["A PHP shop with years of custom modifications. The client needed the storefront refreshed, a new catalog, a reworked cart, and features that had been stuck on the backlog."],
      },
      work: {
        uk: [
          "Нова вітрина і головна сторінка без зламу існуючих модулів.",
          "Каталог з фільтрами і швидким пошуком по товарах.",
          "Доробка кошика і оформлення замовлення.",
          "Кілька раундів нового функціоналу за побажаннями замовника.",
        ],
        en: [
          "New storefront and home page without breaking existing modules.",
          "Catalog with filters and fast product search.",
          "Cart and checkout rework.",
          "Several rounds of new features requested by the client.",
        ],
      },
      result: {
        uk: ["Сім завершених проєктів поспіль, кожен з оцінкою 10 з 10. Замовник повертається з новими задачами."],
        en: ["Seven completed projects in a row, each rated 10 out of 10. The client keeps coming back with new work."],
      },
    },
  },
  {
    slug: "site-security-cleanup",
    order: 3,
    year: 2026,
    clientType: { uk: "Власник сайту", en: "Site owner" },
    title: { uk: "Чистка і захист зараженого сайту", en: "Cleaning and hardening a compromised site" },
    summary: {
      uk: "Діагностика зараження, видалення шкідливого коду, закриття дірок і захист від повторення.",
      en: "Diagnosing the infection, removing malicious code, closing the holes, preventing a repeat.",
    },
    stack: ["WordPress", "PHP", "Linux", "Security"],
    budgetUAH: [5000, 5000],
    body: {
      task: {
        uk: ["Сайт замовника був заражений: редиректи, сторонній код у файлах, підозріле навантаження. Потрібно було швидко знайти причину і надійно закрити її."],
        en: ["The client's site was compromised: redirects, injected code in files, suspicious load. It needed a fast diagnosis and a durable fix."],
      },
      work: {
        uk: [
          "Провів діагностику і пояснив замовнику, що саме сталося і що буду робити.",
          "Видалив шкідливий код, оновив вразливі компоненти, змінив доступи.",
          "Налаштував захист від ботів і моніторинг, тримав замовника в курсі на кожному кроці.",
        ],
        en: [
          "Ran the diagnosis and explained to the client what happened and what I would do.",
          "Removed the malicious code, updated vulnerable components, rotated credentials.",
          "Set up bot protection and monitoring, keeping the client informed at every step.",
        ],
      },
      result: {
        uk: ["Сайт чистий і працює, повторних заражень немає. Відгук замовника: професійний підхід, рекомендую."],
        en: ["The site is clean and stable with no reinfection. Client review: professional approach, recommended."],
      },
    },
  },
  {
    slug: "agency-site-improvements",
    order: 4,
    year: 2026,
    clientType: { uk: "Агенція", en: "Agency" },
    title: { uk: "Доробка сайту для агенції, два раунди", en: "Site improvements for an agency, two rounds" },
    summary: {
      uk: "Правки в чужому коді, нові блоки і функції, робота за задачами агенції.",
      en: "Fixes in someone else's code, new blocks and features, working from the agency's task list.",
    },
    stack: ["PHP", "JavaScript", "CSS", "CMS"],
    budgetUAH: [4500, 7000],
    body: {
      task: {
        uk: ["Агенція вела клієнтський сайт і потребувала розробника, який розбереться в існуючому коді і зробить список доробок без переписування всього."],
        en: ["An agency maintaining a client site needed a developer to work inside the existing code and deliver a list of improvements without a rewrite."],
      },
      work: {
        uk: [
          "Перший раунд: виправлення помилок і кілька нових блоків.",
          "Другий раунд: більший обсяг функціоналу, частина зроблена понад список.",
        ],
        en: [
          "Round one: bug fixes and a few new blocks.",
          "Round two: a larger set of features, some delivered beyond the list.",
        ],
      },
      result: {
        uk: ["Обидва раунди завершені, агенція продовжила співпрацю. Оцінки 10 і 9.8."],
        en: ["Both rounds completed and the agency continued the collaboration. Ratings 10 and 9.8."],
      },
    },
  },
  {
    slug: "1c-omnichannel-spec",
    order: 5,
    year: 2026,
    clientType: { uk: "Роздрібна компанія", en: "Retail company" },
    title: { uk: "ТЗ на інтеграцію месенджерів у кастомну 1С", en: "Spec for messenger integration into custom 1C" },
    summary: {
      uk: "Технічне завдання для омніканальної комунікації: месенджери і соцмережі всередині 1С.",
      en: "A technical specification for omnichannel communication: messengers and social networks inside 1C.",
    },
    stack: ["Аналітика", "API", "1C", "Telegram"],
    budgetUAH: [3000, 3000],
    body: {
      task: {
        uk: ["Компанія хотіла отримувати повідомлення з месенджерів і соцмереж прямо у своїй кастомній 1С. Перед розробкою потрібне було чітке ТЗ, за яким зможе працювати будь-який підрядник."],
        en: ["The company wanted messages from messengers and social networks inside their custom 1C system. Before development they needed a clear spec any contractor could build from."],
      },
      work: {
        uk: [
          "Зібрав вимоги, описав сценарії роботи менеджерів.",
          "Описав API кожного каналу, схему даних і обробку помилок.",
          "Оформив ТЗ з етапами і критеріями приймання.",
        ],
        en: [
          "Gathered requirements and described the managers' workflows.",
          "Documented each channel's API, the data model, and error handling.",
          "Delivered the spec with phases and acceptance criteria.",
        ],
      },
      result: {
        uk: ["ТЗ прийняте, оцінка 10 з 10."],
        en: ["Spec accepted, rated 10 out of 10."],
      },
    },
  },
  {
    slug: "dating-platforms-frontend",
    order: 6,
    year: 2025,
    clientType: { uk: "Продуктова команда", en: "Product team" },
    title: { uk: "Фронтенд дейтинг-платформ", en: "Frontend for dating platforms" },
    summary: {
      uk: "Робота в продуктовій команді над flirtfordate.com і bez-kompleksov.com: інтерфейси, адаптив, стабільність.",
      en: "In-house frontend work on flirtfordate.com and bez-kompleksov.com: interfaces, responsive layouts, stability.",
    },
    stack: ["React", "TypeScript", "HTML", "CSS"],
    link: "https://flirtfordate.com/",
    body: {
      task: {
        uk: ["Два дейтинг-сервіси з великою аудиторією потребували стабільного, адаптивного інтерфейсу, який однаково працює на різних пристроях."],
        en: ["Two dating services with a large audience needed a stable, responsive interface that behaves the same across devices."],
      },
      work: {
        uk: [
          "Верстка і логіка інтерфейсів на React і TypeScript.",
          "Адаптив під мобільні, робота з командою над зручністю і доступністю.",
        ],
        en: [
          "Interface markup and logic in React and TypeScript.",
          "Mobile layouts, and collaboration with the team on usability and accessibility.",
        ],
      },
      result: {
        uk: ["Інтерфейси працюють стабільно, залученість користувачів зросла."],
        en: ["The interfaces run reliably and user engagement went up."],
      },
    },
  },
  {
    slug: "client-portfolio-admin",
    order: 7,
    year: 2025,
    clientType: { uk: "Приватний замовник", en: "Private client" },
    title: { uk: "Сайт-портфоліо з адмін-панеллю", en: "Portfolio site with an admin panel" },
    summary: {
      uk: "Сайт за наданим дизайном за 15 днів: адмінка, керування продуктами, редагування розділу про себе.",
      en: "A site from a provided design in 15 days: admin panel, product management, editable about section.",
    },
    stack: ["React", "Node.js", "Express", "MongoDB"],
    link: "https://portfolio-client-o34s.onrender.com/",
    budgetUAH: [1500, 1500],
    body: {
      task: {
        uk: ["Замовник надав дизайн і хотів сайт, яким зможе керувати сам: додавати продукти, змінювати аватар і текст про себе, вставляти посилання на портфоліо."],
        en: ["The client provided a design and wanted a site they could manage themselves: add products, change the avatar and about text, link their portfolio."],
      },
      work: {
        uk: ["Верстка за дизайном, адмін-панель з авторизацією, CRUD для продуктів і завантаження зображень."],
        en: ["Markup from the design, an admin panel with auth, product CRUD, and image upload."],
      },
      result: {
        uk: ["Здано за 15 днів. Зараз сайт живе своїм життям за бажанням замовника."],
        en: ["Delivered in 15 days. The site has since taken on a life of its own, by the client's choice."],
      },
    },
  },
];
```

- [ ] **Step 6: Write the reviews**

`src/content/reviews.ts`. Quotes are trimmed to 240 characters max; original language kept. `url` points at the freelancer's review tab.

```ts
import type { Review } from "./schema";

const REVIEWS_URL = "https://freelancehunt.com/freelancer/TOSTcR.html#reviews";

export const reviews: Review[] = [
  { id: 592949, author: "Никита Бесчастных", projectName: "ТЗ для интеграции омниканальной коммуникации в 1С", quote: "Нормальный, контактный исполнитель. Работа сделана без нареканий.", lang: "ru", grade: 10, publishedAt: "2026-08-27", url: REVIEWS_URL },
  { id: 592124, author: "Taras Lytvyn", projectName: "Безпека сайту", quote: "Андрій швидко та ефективно вирішив проблему з безпекою сайту. Оперативно провів діагностику і розгорнуто пояснив, що не так і що він збирається зробити. Прекрасний професійний підхід, рекомендую!", lang: "uk", grade: 10, publishedAt: "2026-08-17", url: REVIEWS_URL },
  { id: 586911, author: "Евгений К.", projectName: "Проект №4", quote: "Это уже далеко не первый наш совместный проект, и каждый раз вы реализуете все мои задумки несмотря на их сложность.", lang: "ru", grade: 10, publishedAt: "2026-06-11", url: REVIEWS_URL },
  { id: 579404, author: "Евгений К.", projectName: "Реализация нового функционала для интернет-магазина", quote: "Андрей понимает задачи без лишних переписок и длинных ТЗ, сам предлагает интересные решения. Делает всё очень быстро и качественно.", lang: "ru", grade: 10, publishedAt: "2026-03-24", url: REVIEWS_URL },
  { id: 577353, author: "Анна Пивцаева", company: "SOK Agency", projectName: "Допрацювання сайта 2", quote: "Є розуміння питання і як вирішувати задачі в коді, робота вся виконана і навіть трохи більше, рекомендую.", lang: "uk", grade: 9.8, publishedAt: "2026-03-04", url: REVIEWS_URL },
  { id: 575662, author: "Анна Пивцаева", company: "SOK Agency", projectName: "Допрацювання сайта", quote: "Гарна робота, з розумінням справи, продовжуємо роботу.", lang: "uk", grade: 10, publishedAt: "2026-02-17", url: REVIEWS_URL },
  { id: 574393, author: "Евгений К.", projectName: "Разработка каталога для интернет-магазина", quote: "С ним стало возможным реализация проектов, которые давно висели в подвешенном состоянии. Качество работы, отклик на правки и реализация СУПЕР!", lang: "ru", grade: 10, publishedAt: "2026-02-04", url: REVIEWS_URL },
  { id: 570869, author: "Евгений К.", projectName: "Реализация новой витрины для интернет магазина", quote: "Андрей на сложные задачи находит простые решения, потому и обращаемся уже не первый раз. Все четко и по делу.", lang: "ru", grade: 10, publishedAt: "2025-12-27", url: REVIEWS_URL },
  { id: 567788, author: "Евгений К.", projectName: "Доработка сайта", quote: "Все на высоком уровне, быстрые правки и грамотная реализация задуманного.", lang: "ru", grade: 10, publishedAt: "2025-11-28", url: REVIEWS_URL },
  { id: 563874, author: "Dmitro Px", company: "Px000", projectName: "Розробка гри Blackjack на Next.js", quote: "Все зроблено, на вищому рівні.", lang: "uk", grade: 10, publishedAt: "2025-10-26", url: REVIEWS_URL },
  { id: 561115, author: "Евгений К.", projectName: "Доработка корзины", quote: "Отличная работа! Раньше срока и все качественно.", lang: "ru", grade: 10, publishedAt: "2025-10-01", url: REVIEWS_URL },
  { id: 560272, author: "Евгений К.", projectName: "Доработка главной страницы сайта на PHP", quote: "Очень понравилось работать с Андреем, всегда на связи, все делает оперативно и профессионально.", lang: "ru", grade: 10, publishedAt: "2025-09-24", url: REVIEWS_URL },
  { id: 556984, author: "Мария Данцова", projectName: "Частный проект", quote: "Все супер! Будем работать дальше.", lang: "ru", grade: 10, publishedAt: "2025-08-27", url: REVIEWS_URL },
  { id: 556159, author: "Віктор Горда", projectName: "Допрацювання плагіна для WordPress", quote: "Дуже гарний виконавець, зробив все в термін і приємно спілкуватись.", lang: "uk", grade: 10, publishedAt: "2025-08-19", url: REVIEWS_URL },
];
```

- [ ] **Step 7: Write the profile loader and fallback**

`src/content/profile.fallback.json`:

```json
{
  "completed": 14,
  "successRate": 100,
  "averageGrade": 9.98,
  "positiveReviews": 14,
  "available": true,
  "fetchedAt": "2026-09-12T00:00:00.000Z"
}
```

Copy the same content to `src/content/profile.generated.json` (the fetch script overwrites it in Task 3).

`src/content/profile.ts`:

```ts
import { profileSchema, type Profile } from "./schema";
import fallback from "./profile.fallback.json";
import generated from "./profile.generated.json";

export function loadProfile(): Profile {
  const parsed = profileSchema.safeParse(generated);
  return parsed.success ? parsed.data : profileSchema.parse(fallback);
}
```

Check `tsconfig.json` has `"resolveJsonModule": true` (create-next-app sets it).

- [ ] **Step 8: Write the content index**

`src/content/index.ts`:

```ts
import { cases } from "./cases";
import { reviews } from "./reviews";
import { loadProfile } from "./profile";
import { caseSchema, reviewSchema, type Case, type Review, type Profile } from "./schema";

const validatedCases: Case[] = cases
  .map((c) => caseSchema.parse(c))
  .sort((a, b) => a.order - b.order);

const validatedReviews: Review[] = reviews
  .map((r) => reviewSchema.parse(r))
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getCases(): Case[] {
  return validatedCases;
}

export function getCase(slug: string): Case | undefined {
  return validatedCases.find((c) => c.slug === slug);
}

export function getReviews(): Review[] {
  return validatedReviews;
}

export function getProfile(): Profile {
  return loadProfile();
}

export type { Case, Review, Profile };
```

- [ ] **Step 9: Run the tests**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: all 8 tests PASS. If the dash test fails, find the offending character with `grep -nP '[\x{2013}\x{2014}]' src/content/*.ts` and replace it with `-` or a period.

- [ ] **Step 10: Commit**

```bash
git add src/content src/lib/site.ts tests/unit/content.test.ts
git commit -m "feat: typed content model with cases, reviews, and profile

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Build-time profile fetch script

**Files:**
- Create: `scripts/fetch-profile.ts` (replace the placeholder from Task 1)

**Interfaces:**
- Consumes: `profileSchema` from `src/content/schema.ts` (imported via relative path because Node runs this file directly).
- Produces: writes `src/content/profile.generated.json`. Exit code always 0; failures log a warning and keep the existing file.

- [ ] **Step 1: Write the script**

```ts
// Runs in `npm run prebuild` with Node 26 (native type stripping, no bundler).
// Refreshes src/content/profile.generated.json from the Freelancehunt API.
// Never fails the build: on any error the existing file is kept.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(here, "..", "src", "content", "profile.generated.json");
const FREELANCER_ID = 618668;

type ApiResponse = {
  data: {
    attributes: {
      completed_projects: number;
      success_rate: number;
      average_grade: number;
      positive_reviews: number;
      status: { id: number };
    };
  };
};

async function main() {
  const token = process.env.FREELANCEHUNT_TOKEN;
  if (!token) {
    console.log("profile: FREELANCEHUNT_TOKEN not set, keeping committed numbers");
    return;
  }
  const res = await fetch(`https://api.freelancehunt.com/v2/freelancers/${FREELANCER_ID}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as ApiResponse;
  const a = json.data.attributes;
  const profile = {
    completed: a.completed_projects,
    successRate: a.success_rate,
    averageGrade: a.average_grade,
    positiveReviews: a.positive_reviews,
    available: a.status.id === 10,
    fetchedAt: new Date().toISOString(),
  };
  const previous = JSON.parse(readFileSync(target, "utf8"));
  writeFileSync(target, JSON.stringify(profile, null, 2) + "\n");
  console.log(`profile: updated (${previous.completed} -> ${profile.completed} completed)`);
}

main().catch((err) => {
  console.warn(`profile: fetch failed (${err instanceof Error ? err.message : err}), keeping committed numbers`);
});
```

Note: the script intentionally does not import zod or the schema, so it has no module resolution needs beyond Node built-ins. Validation happens at build in `src/content/profile.ts`.

- [ ] **Step 2: Verify both paths**

```bash
node scripts/fetch-profile.ts
FREELANCEHUNT_TOKEN=invalid node scripts/fetch-profile.ts
git status --short src/content/profile.generated.json
```

Expected: first prints "not set, keeping committed numbers"; second prints "fetch failed (HTTP 401), keeping committed numbers"; git shows no change to the generated file.

- [ ] **Step 3: Commit**

```bash
git add scripts/fetch-profile.ts
git commit -m "feat: build-time Freelancehunt profile refresh with safe fallback

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: i18n routing, messages, layout, theme, and an empty landing page

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `src/proxy.ts`, `messages/uk.json`, `messages/en.json`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/[...rest]/page.tsx`, `src/app/[locale]/not-found.tsx`, `src/components/layout/ThemeScript.tsx`, `src/global.d.ts`
- Modify: `next.config.ts`, `src/app/globals.css`
- Test: `tests/e2e/site.spec.ts` (first two tests)

**Interfaces:**
- Produces: `routing` (`locales: ["uk","en"]`, `defaultLocale: "uk"`), `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`; message namespaces `nav`, `hero`, `proof`, `services`, `work`, `reviews`, `process`, `contact`, `footer`, `notFound`; CSS tokens `--color-bg`, `--color-bg-raised`, `--color-fg`, `--color-fg-muted`, `--color-line`, `--color-accent`, `--color-accent-fg`; Tailwind utilities `bg-bg`, `bg-bg-raised`, `text-fg`, `text-fg-muted`, `border-line`, `text-accent`, `bg-accent`, `font-sans`, `font-mono`, `rounded-md` (6px); `dark:` variant driven by `data-theme="dark"` on `<html>`.

- [ ] **Step 1: Write the failing e2e test**

`tests/e2e/site.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("root redirects to a locale", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.url()).toMatch(/\/(uk|en)$/);
});

test("uk and en landing render the hero headline", async ({ page }) => {
  await page.goto("/uk");
  await expect(page.locator("h1")).toContainText("Фронтенд");
  await page.goto("/en");
  await expect(page.locator("h1")).toContainText("Frontend");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test tests/e2e/site.spec.ts`
Expected: FAIL (build fails or 404, since there is no `[locale]` route yet).

- [ ] **Step 3: Write routing files**

`src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uk", "en"],
  defaultLocale: "uk",
  localePrefix: "always",
});
```

`src/i18n/navigation.ts`:

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

`src/i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

`src/proxy.ts`:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
```

`next.config.ts`:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
```

`src/global.d.ts` (typed messages):

```ts
import type uk from "../messages/uk.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof uk;
  }
}
```

- [ ] **Step 4: Write messages**

`messages/uk.json`:

```json
{
  "nav": { "work": "Роботи", "reviews": "Відгуки", "contact": "Контакт", "theme": "Змінити тему", "locale": "Switch to English", "home": "На головну" },
  "hero": {
    "headline1": "Фронтенд і фулстек",
    "headline2": "для магазинів і продуктів.",
    "sub": "Інтерфейси на React і Next.js, магазини на WordPress, OpenCart і Shopify, інтеграції, аналітика і безпека.",
    "ctaTelegram": "Написати в Telegram",
    "ctaWork": "Дивитись роботи",
    "visualAlt": "Абстрактна темна композиція"
  },
  "proof": {
    "completed": "завершених проєктів",
    "successRate": "успішних",
    "averageGrade": "середня оцінка",
    "positiveReviews": "позитивних відгуків",
    "source": "Дані з Freelancehunt"
  },
  "services": {
    "title": "Що роблю найчастіше",
    "items": {
      "shops": { "title": "Магазини і сайти на CMS", "body": "WordPress, OpenCart, Хорошоп, Shopify: доробка, нові модулі, інтеграції, виправлення чужого коду без зламу того, що вже працює." },
      "react": { "title": "Інтерфейси на React і Next.js", "body": "Від верстки до підключення API. Типізований код, адаптив, увага до швидкості." },
      "automation": { "title": "Аналітика і автоматизація", "body": "GA4 і GTM, парсери, телеграм-боти, обмін даними між сервісами." },
      "security": { "title": "Безпека і швидкість", "body": "Чистка заражених сайтів, захист від ботів, пошук причин навантаження на сервер." }
    }
  },
  "work": { "eyebrow": "Вибрані роботи", "title": "Кейси з реальних проєктів", "open": "Відкрити кейс", "task": "Задача", "did": "Що зробив", "result": "Результат", "stack": "Стек", "client": "Клієнт", "year": "Рік", "budget": "Бюджет", "link": "Відкрити сайт", "prev": "Попередній", "next": "Наступний", "all": "Усі роботи", "budgetRange": "{min} - {max} грн", "budgetOne": "{value} грн" },
  "reviews": { "title": "Що кажуть замовники", "source": "Усі відгуки на Freelancehunt", "grade": "Оцінка" },
  "process": {
    "title": "Як я працюю",
    "body": "Спочатку кажу, що саме зроблю і що може піти не так, потім роблю. Якщо задача вирішується простіше і дешевше, ніж здається, скажу про це, а не мовчки візьму бюджет."
  },
  "contact": {
    "eyebrow": "Контакт",
    "title": "Є задача? Напишіть.",
    "available": "Вільний для нових проєктів",
    "busy": "Зараз зайнятий, але пишіть",
    "email": "Пошта",
    "github": "GitHub",
    "freelancehunt": "Freelancehunt",
    "form": {
      "name": "Ім’я",
      "reply": "Пошта або Telegram для відповіді",
      "message": "Що потрібно зробити",
      "send": "Надіслати",
      "sending": "Надсилаю",
      "success": "Отримав. Відповім протягом дня.",
      "error": "Не вдалося надіслати. Напишіть напряму в Telegram.",
      "errName": "Вкажіть ім’я",
      "errReply": "Вкажіть, куди відповісти",
      "errMessage": "Опишіть задачу хоча б у двох реченнях"
    }
  },
  "footer": { "rights": "Андрій Танцюра", "source": "Код сайту" },
  "notFound": { "title": "Такої сторінки немає", "back": "На головну" }
}
```

`messages/en.json`:

```json
{
  "nav": { "work": "Work", "reviews": "Reviews", "contact": "Contact", "theme": "Toggle theme", "locale": "Перейти на українську", "home": "Home" },
  "hero": {
    "headline1": "Frontend and fullstack",
    "headline2": "for shops and products.",
    "sub": "React and Next.js interfaces, WordPress, OpenCart and Shopify shops, integrations, analytics and security.",
    "ctaTelegram": "Message on Telegram",
    "ctaWork": "See work",
    "visualAlt": "Abstract dark composition"
  },
  "proof": {
    "completed": "completed projects",
    "successRate": "success rate",
    "averageGrade": "average grade",
    "positiveReviews": "positive reviews",
    "source": "Numbers from Freelancehunt"
  },
  "services": {
    "title": "What I do most",
    "items": {
      "shops": { "title": "Shops and CMS sites", "body": "WordPress, OpenCart, Horoshop, Shopify: improvements, new modules, integrations, fixing someone else's code without breaking what works." },
      "react": { "title": "React and Next.js interfaces", "body": "From markup to API wiring. Typed code, responsive layouts, attention to speed." },
      "automation": { "title": "Analytics and automation", "body": "GA4 and GTM, scrapers, Telegram bots, data exchange between services." },
      "security": { "title": "Security and performance", "body": "Cleaning compromised sites, bot protection, finding what loads the server." }
    }
  },
  "work": { "eyebrow": "Selected work", "title": "Cases from real projects", "open": "Open case", "task": "Task", "did": "What I did", "result": "Result", "stack": "Stack", "client": "Client", "year": "Year", "budget": "Budget", "link": "Open site", "prev": "Previous", "next": "Next", "all": "All work", "budgetRange": "{min} - {max} UAH", "budgetOne": "{value} UAH" },
  "reviews": { "title": "What clients say", "source": "All reviews on Freelancehunt", "grade": "Grade" },
  "process": {
    "title": "How I work",
    "body": "First I say what exactly I will do and what can go wrong, then I do it. If a task is simpler and cheaper than it looks, I say so instead of quietly taking the budget."
  },
  "contact": {
    "eyebrow": "Contact",
    "title": "Have a task? Write to me.",
    "available": "Open for new projects",
    "busy": "Busy right now, but write anyway",
    "email": "Email",
    "github": "GitHub",
    "freelancehunt": "Freelancehunt",
    "form": {
      "name": "Name",
      "reply": "Email or Telegram for the reply",
      "message": "What needs to be done",
      "send": "Send",
      "sending": "Sending",
      "success": "Got it. I will reply within a day.",
      "error": "Could not send. Message me on Telegram directly.",
      "errName": "Enter your name",
      "errReply": "Tell me where to reply",
      "errMessage": "Describe the task in at least two sentences"
    }
  },
  "footer": { "rights": "Andrii Tantsiura", "source": "Site source" },
  "notFound": { "title": "This page does not exist", "back": "Back home" }
}
```

- [ ] **Step 5: Write the theme tokens**

Replace `src/app/globals.css` entirely:

```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;
  --radius-md: 6px;

  --color-bg: #fafafa;
  --color-bg-raised: #f0f0f1;
  --color-fg: #18181b;
  --color-fg-muted: #52525b;
  --color-line: #e4e4e7;
  --color-accent: #059669;
  --color-accent-fg: #fafafa;
}

[data-theme="dark"] {
  --color-bg: #0b0b0d;
  --color-bg-raised: #141417;
  --color-fg: #f4f4f5;
  --color-fg-muted: #a1a1aa;
  --color-line: #27272a;
  --color-accent: #34d399;
  --color-accent-fg: #0b0b0d;
}

html {
  color-scheme: light;
  scroll-behavior: smooth;
}
html[data-theme="dark"] {
  color-scheme: dark;
}
body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
::selection {
  background: var(--color-accent);
  color: var(--color-accent-fg);
}
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.marquee-track {
  animation: marquee 60s linear infinite;
}
.marquee:hover .marquee-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .marquee-track { animation: none; }
}
```

Tailwind v4 reads `@theme` variables, so `bg-bg`, `text-fg-muted`, `border-line`, `text-accent`, `rounded-md` all resolve. The dark block overrides the same variables at runtime, so utilities need no `dark:` prefix for colors; `dark:` remains available for anything else.

- [ ] **Step 6: Write the theme script and layout**

`src/components/layout/ThemeScript.tsx`:

```tsx
// Runs before paint so the first frame has the right theme. Inline on purpose.
const script = `
(function(){try{var s=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s==="light"||s==="dark"?s:(m?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
```

`src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { site } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "cyrillic"], display: "swap" });

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name}`, template: `%s | ${site.name}` },
    description: t("sub"),
    alternates: { languages: { uk: "/uk", en: "/en" } },
    openGraph: { title: site.name, description: t("sub"), url: `/${locale}`, siteName: site.name, locale },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Write a temporary landing page, catch-all, and not-found**

`src/app/[locale]/page.tsx` (temporary; sections are added in later tasks):

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");
  return (
    <main className="mx-auto max-w-7xl px-4 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">
        {t("headline1")} {t("headline2")}
      </h1>
    </main>
  );
}
```

`src/app/[locale]/[...rest]/page.tsx`:

```tsx
import { notFound } from "next/navigation";

export default function CatchAll() {
  notFound();
}
```

`src/app/[locale]/not-found.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col items-start justify-center gap-6 px-4">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <Link href="/" className="text-accent underline underline-offset-4">
        {t("back")}
      </Link>
    </main>
  );
}
```

- [ ] **Step 8: Build and run the e2e tests**

```bash
npm run typecheck && npm run lint && npx playwright test tests/e2e/site.spec.ts
```

Expected: both tests PASS. If `next build` complains about a missing root layout, confirm `src/app/layout.tsx` does not exist and `src/app/[locale]/layout.tsx` renders `<html>`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: locale routing, messages, theme tokens, root layout

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Navigation, footer, shared button, and motion primitives

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/layout/Nav.tsx`, `src/components/layout/NavClient.tsx`, `src/components/layout/Footer.tsx`, `src/components/motion/Reveal.tsx`, `src/components/motion/MagneticLink.tsx`, `src/components/motion/CountUp.tsx`, `src/components/motion/PageTransition.tsx`
- Modify: `src/app/[locale]/layout.tsx` (mount Nav + Footer)
- Test: `tests/e2e/site.spec.ts` (add nav/theme/locale tests)

**Interfaces:**
- Produces:
  - `buttonClasses(variant: "primary" | "secondary"): string`
  - `<Reveal delay?: number, className?: string>` client wrapper: fade + 24px slide on viewport entry, once.
  - `<MagneticLink href, className, children, external?>`: anchor that pulls toward the cursor within 12px; plain anchor under reduced motion.
  - `<CountUp value: number, decimals?: number, suffix?: string>`: mono span that counts from 0 on first view.
  - `<PageTransition>`: wraps case page content, fades and slides in on mount.
  - `<Nav locale>` server component; `<NavClient>` renders theme toggle + locale switch.

- [ ] **Step 1: Add failing e2e tests**

Append to `tests/e2e/site.spec.ts`:

```ts
test("nav switches locale and keeps the path", async ({ page }) => {
  await page.goto("/uk");
  await page.getByRole("link", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await page.getByRole("link", { name: "Перейти на українську" }).click();
  await expect(page).toHaveURL(/\/uk$/);
});

test("theme toggle flips data-theme and persists", async ({ page }) => {
  await page.goto("/en");
  const html = page.locator("html");
  const before = await html.getAttribute("data-theme");
  await page.getByRole("button", { name: "Toggle theme" }).click();
  const after = await html.getAttribute("data-theme");
  expect(after).not.toBe(before);
  await page.reload();
  expect(await html.getAttribute("data-theme")).toBe(after);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test tests/e2e/site.spec.ts`
Expected: the two new tests FAIL (no such link/button).

- [ ] **Step 3: Write the shared button classes**

`src/components/ui/Button.tsx`:

```ts
const base =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 text-sm font-medium transition-[transform,background-color,color] duration-200 active:scale-[0.98] focus-visible:outline-2";

const variants = {
  primary: "bg-accent text-accent-fg hover:opacity-90",
  secondary: "border border-line bg-transparent text-fg hover:bg-bg-raised",
} as const;

export function buttonClasses(variant: keyof typeof variants): string {
  return `${base} ${variants[variant]}`;
}
```

- [ ] **Step 4: Write motion primitives**

`src/components/motion/Reveal.tsx`:

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

`src/components/motion/MagneticLink.tsx`:

```tsx
"use client";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

type Props = { href: string; className?: string; children: ReactNode; external?: boolean };

// Pulls the element toward the cursor by up to 12px. Feedback: the primary CTA feels "alive".
export function MagneticLink({ href, className, children, external }: Props) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  function onMove(e: PointerEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-12, Math.min(12, dx * 0.25)));
    y.set(Math.max(-12, Math.min(12, dy * 0.25)));
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </motion.a>
  );
}
```

`src/components/motion/CountUp.tsx`:

```tsx
"use client";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = { value: number; decimals?: number; suffix?: string; className?: string };

// Counts from 0 to value once, when first scrolled into view. Hierarchy: draws the eye to proof.
export function CountUp({ value, decimals = 0, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
```

`src/components/motion/PageTransition.tsx`:

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Write Nav, NavClient, Footer**

`src/components/layout/NavClient.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Sun, Moon } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";

type Theme = "light" | "dark";

function readTheme(): Theme {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" ? "light" : "dark";
}

export function NavClient() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "uk" ? "en" : "uk";
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => setTheme(readTheme()), []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={pathname}
        locale={other}
        aria-label={t("locale")}
        className="rounded-md px-2 py-1 font-mono text-xs uppercase tracking-wide text-fg-muted hover:text-fg"
      >
        {other}
      </Link>
      <button
        type="button"
        onClick={toggle}
        aria-label={t("theme")}
        className="rounded-md p-2 text-fg-muted hover:bg-bg-raised hover:text-fg"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}
```

`src/components/layout/Nav.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { NavClient } from "./NavClient";

export async function Nav() {
  const t = await getTranslations("nav");
  const items = [
    { href: "/#work", label: t("work") },
    { href: "/#reviews", label: t("reviews") },
    { href: "/#contact", label: t("contact") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight" aria-label={t("home")}>
          {site.handle}
        </Link>
        <div className="flex items-center gap-1 sm:gap-6">
          <ul className="hidden items-center gap-6 text-sm text-fg-muted sm:flex">
            {items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-fg">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <NavClient />
        </div>
      </nav>
    </header>
  );
}
```

`src/components/layout/Footer.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {t("rights")}, {new Date().getFullYear()}
        </p>
        <a href={site.repo} className="hover:text-fg" target="_blank" rel="noopener noreferrer">
          {t("source")}
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Mount Nav and Footer in the layout**

In `src/app/[locale]/layout.tsx`, import `Nav` and `Footer` and change the body to:

```tsx
<body className="flex min-h-dvh flex-col antialiased">
  <NextIntlClientProvider>
    <Nav />
    <div className="flex-1">{children}</div>
    <Footer />
  </NextIntlClientProvider>
</body>
```

- [ ] **Step 7: Run typecheck, lint, e2e**

```bash
npm run typecheck && npm run lint && npx playwright test tests/e2e/site.spec.ts
```

Expected: 4 tests PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: nav with theme and locale switch, footer, motion primitives

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Hero visual asset

**Files:**
- Create: `public/hero.webp`

**Interfaces:**
- Produces: `public/hero.webp`, 1600x2000, dark abstract, under 300 KB.

- [ ] **Step 1: Generate the image**

Use the available image generation tool (`mcp__higgsfield__generate_image`) with this prompt and a 4:5 aspect ratio:

> Abstract minimal composition, near-black charcoal background, soft volumetric layered planes of dark graphite glass with a single thin emerald green light edge, subtle film grain, no text, no people, no faces, no logos, photographic, high detail, cinematic dark studio lighting.

Download the result into the scratchpad directory. If the tool is unavailable, fall back to `https://picsum.photos/seed/tostcr-hero/1600/2000` downloaded with curl, and note in the commit message that the hero visual is a placeholder to be replaced.

- [ ] **Step 2: Convert to WebP at 1600x2000**

`sharp` is already installed as a Next.js dependency:

```bash
node -e '
const sharp=require("sharp");
sharp(process.argv[1]).resize(1600,2000,{fit:"cover"}).webp({quality:78}).toFile("public/hero.webp").then(i=>console.log(i.size))
' /path/to/downloaded/image
ls -la public/hero.webp
```

Expected: file exists and prints a size under 300000 bytes. If larger, lower quality to 70.

- [ ] **Step 3: Commit**

```bash
git add public/hero.webp
git commit -m "feat: hero visual asset

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Hero and proof strip

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/HeroHeadline.tsx`, `src/components/sections/HeroVisual.tsx`, `src/components/sections/ProofStrip.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `buttonClasses`, `MagneticLink`, `CountUp`, `Reveal`, `getProfile`, `site`, messages `hero`, `proof`.
- Produces: `<Hero />` and `<ProofStrip />` server components.

- [ ] **Step 1: Add a failing e2e test**

Append to `tests/e2e/site.spec.ts`:

```ts
test("hero shows both CTAs and proof numbers", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("link", { name: "Message on Telegram" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "See work" })).toBeVisible();
  await expect(page.getByText("completed projects")).toBeVisible();
});
```

Run: `npx playwright test tests/e2e/site.spec.ts -g "hero shows"` and confirm it FAILS.

- [ ] **Step 2: Write HeroHeadline (client, masked line reveal)**

`src/components/sections/HeroHeadline.tsx`:

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

// Storytelling: the two headline lines rise out of a clip mask one after the other.
export function HeroHeadline({ lines }: { lines: [string, string] }) {
  const reduce = useReducedMotion();
  return (
    <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-1">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
```

- [ ] **Step 3: Write HeroVisual (client, scale-in + scroll parallax)**

`src/components/sections/HeroVisual.tsx`:

```tsx
"use client";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function HeroVisual({ alt }: { alt: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);

  return (
    <motion.div
      ref={ref}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-bg-raised"
      initial={reduce ? false : { opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <Image src="/hero.webp" alt={alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Write Hero (server)**

`src/components/sections/Hero.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { buttonClasses } from "@/components/ui/Button";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { HeroHeadline } from "./HeroHeadline";
import { HeroVisual } from "./HeroVisual";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-16 lg:grid-cols-12 lg:pt-24">
      <div className="flex flex-col gap-8 lg:col-span-7">
        <HeroHeadline lines={[t("headline1"), t("headline2")]} />
        <p className="max-w-[60ch] text-base leading-relaxed text-fg-muted sm:text-lg">{t("sub")}</p>
        <div className="flex flex-wrap gap-3">
          <MagneticLink href={site.telegram} external className={buttonClasses("primary")}>
            {t("ctaTelegram")}
          </MagneticLink>
          <a href="#work" className={buttonClasses("secondary")}>
            {t("ctaWork")}
          </a>
        </div>
      </div>
      <div className="lg:col-span-5">
        <HeroVisual alt={t("visualAlt")} />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write ProofStrip (server + CountUp)**

`src/components/sections/ProofStrip.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import { site } from "@/lib/site";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

export async function ProofStrip() {
  const t = await getTranslations("proof");
  const p = getProfile();
  const items = [
    { value: p.completed, label: t("completed") },
    { value: p.successRate, suffix: "%", label: t("successRate") },
    { value: p.averageGrade, decimals: 2, label: t("averageGrade") },
    { value: p.positiveReviews, label: t("positiveReviews") },
  ];
  return (
    <section className="border-y border-line bg-bg-raised">
      <Reveal className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.label} className="flex flex-col gap-1">
            <CountUp value={i.value} decimals={i.decimals} suffix={i.suffix} className="font-mono text-3xl font-medium tabular-nums sm:text-4xl" />
            <span className="text-sm text-fg-muted">{i.label}</span>
          </div>
        ))}
        <a
          href={site.freelancehunt}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 text-xs text-fg-muted underline underline-offset-4 hover:text-fg lg:col-span-4"
        >
          {t("source")}
        </a>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 6: Mount in the landing page**

Replace `src/app/[locale]/page.tsx`:

```tsx
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <Hero />
      <ProofStrip />
    </main>
  );
}
```

- [ ] **Step 7: Verify**

```bash
npm run typecheck && npm run lint && npx playwright test tests/e2e/site.spec.ts
```

Expected: 5 tests PASS. Also run `npm run dev`, open `http://localhost:3000/uk`, and confirm: headline animates in two lines, image scales in, Telegram button pulls toward the cursor, numbers count up when scrolled into view. Check both themes with the toggle.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: hero with masked headline reveal, parallax visual, proof strip

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Services and How-I-work sections

**Files:**
- Create: `src/components/sections/Services.tsx`, `src/components/sections/HowIWork.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `Reveal`, messages `services`, `process`; icons `Storefront`, `Code`, `Robot`, `ShieldCheck` from `@phosphor-icons/react`.
- Produces: `<Services />`, `<HowIWork />`.

- [ ] **Step 1: Add a failing e2e test**

Append to `tests/e2e/site.spec.ts`:

```ts
test("services and how-i-work render", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "What I do most" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How I work" })).toBeVisible();
});
```

Run: `npx playwright test tests/e2e/site.spec.ts -g "services"` and confirm it FAILS.

- [ ] **Step 2: Write Services (2 + 2 asymmetric grid with tinted cells)**

Phosphor icons are client components internally but render fine from a Server Component as leaf elements. If the build complains, add `"use client"` to a tiny wrapper; do not add it to `Services.tsx` itself.

`src/components/sections/Services.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import { Storefront, Code, Robot, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/motion/Reveal";

const items = [
  { key: "shops", Icon: Storefront, span: "lg:col-span-7", tinted: true },
  { key: "react", Icon: Code, span: "lg:col-span-5", tinted: false },
  { key: "automation", Icon: Robot, span: "lg:col-span-5", tinted: false },
  { key: "security", Icon: ShieldCheck, span: "lg:col-span-7", tinted: true },
] as const;

export async function Services() {
  const t = await getTranslations("services");
  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {items.map((item, i) => (
          <Reveal key={item.key} delay={i * 0.06} className={item.span}>
            <article
              className={`flex h-full flex-col gap-4 rounded-md border border-line p-6 ${item.tinted ? "bg-bg-raised" : "bg-transparent"}`}
            >
              <item.Icon size={24} className="text-accent" />
              <h3 className="text-lg font-medium">{t(`items.${item.key}.title`)}</h3>
              <p className="max-w-[60ch] text-sm leading-relaxed text-fg-muted">{t(`items.${item.key}.body`)}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write HowIWork**

`src/components/sections/HowIWork.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";

export async function HowIWork() {
  const t = await getTranslations("process");
  return (
    <section className="border-t border-line">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-24">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h2>
        <p className="max-w-[65ch] text-lg leading-relaxed text-fg-muted">{t("body")}</p>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Mount in page.tsx**

Add `<Services />` after `<ProofStrip />` and `<HowIWork />` after it (WorkStack and Reviews are inserted between them in Tasks 9 and 10).

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck && npm run lint && npx playwright test tests/e2e/site.spec.ts
git add -A
git commit -m "feat: services grid and how-i-work section

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Expected: 6 tests PASS before the commit.

---

### Task 9: Selected work sticky-stack and case pages

**Files:**
- Create: `src/components/sections/WorkStack.tsx`, `src/components/sections/CaseCard.tsx`, `src/app/[locale]/work/[slug]/page.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `getCases`, `getCase`, `Case`, `Locale`, `Link`, `PageTransition`, `buttonClasses`, messages `work`.
- Produces: `<WorkStack cases locale />` client section; case route with `generateStaticParams` for every locale × slug.

- [ ] **Step 1: Add failing e2e tests**

Append to `tests/e2e/site.spec.ts`:

```ts
test("work section lists cases and case pages resolve", async ({ page, request }) => {
  await page.goto("/en#work");
  await expect(page.getByRole("heading", { name: "Cases from real projects" })).toBeVisible();
  const links = page.locator("#work a[href*='/work/']");
  expect(await links.count()).toBeGreaterThanOrEqual(7);
  const hrefs = await links.evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
  const res = await request.get("/en/work/does-not-exist");
  expect(res.status()).toBe(404);
});

test("reduced motion renders work as a plain list", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/en#work");
  await expect(page.locator("#work [data-stack='list']")).toBeVisible();
  await ctx.close();
});
```

Run: `npx playwright test tests/e2e/site.spec.ts -g "work"` and confirm both FAIL.

- [ ] **Step 2: Write CaseCard (client, sticky with scroll-driven scale)**

`src/components/sections/CaseCard.tsx`:

```tsx
"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import type { Case, Locale } from "@/content/schema";

type Props = { c: Case; locale: Locale; index: number; total: number; openLabel: string; sticky: boolean };

// Sticky-stack: each card pins at top-24 and, as the next card slides over it,
// shrinks to 0.94 and dims. State transition: the reader sees "this one is done, next one".
export function CaseCard({ c, locale, index, total, openLabel, sticky }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.5]);

  const inner = (
    <article className="grid h-full grid-cols-1 gap-6 rounded-md border border-line bg-bg-raised p-6 sm:p-8 lg:grid-cols-12 lg:gap-10">
      <div className="flex flex-col justify-between gap-6 lg:col-span-6">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs text-fg-muted">
            {c.clientType[locale]}, {c.year}
          </span>
          <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{c.title[locale]}</h3>
          <p className="max-w-[55ch] text-fg-muted">{c.summary[locale]}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2">
            {c.stack.map((s) => (
              <li key={s} className="rounded-md border border-line px-2 py-1 font-mono text-xs text-fg-muted">
                {s}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1 text-sm text-accent">
            {openLabel} <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-md lg:col-span-6">
        {c.cover ? (
          <Image src={c.cover.src} alt={c.cover.alt[locale]} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-end bg-bg p-6">
            <span className="font-mono text-5xl font-medium leading-none tracking-tight text-fg-muted/40 sm:text-7xl">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </article>
  );

  if (!sticky) {
    return (
      <Link href={`/work/${c.slug}`} className="block">
        {inner}
      </Link>
    );
  }

  return (
    <div ref={ref} className="sticky top-24" style={{ zIndex: index + 1 }}>
      <motion.div style={{ scale, opacity, transformOrigin: "center top" }}>
        <Link href={`/work/${c.slug}`} className="block">
          {inner}
        </Link>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 3: Write WorkStack (client)**

`src/components/sections/WorkStack.tsx`:

```tsx
"use client";
import { useReducedMotion } from "motion/react";
import type { Case, Locale } from "@/content/schema";
import { CaseCard } from "./CaseCard";

type Props = { cases: Case[]; locale: Locale; eyebrow: string; title: string; openLabel: string };

export function WorkStack({ cases, locale, eyebrow, title, openLabel }: Props) {
  const reduce = useReducedMotion();
  const sticky = !reduce;
  return (
    <section id="work" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-24">
      <div className="mb-12 flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{eyebrow}</span>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      <div data-stack={sticky ? "sticky" : "list"} className={sticky ? "flex flex-col gap-[20vh] pb-[20vh]" : "flex flex-col gap-6"}>
        {cases.map((c, i) => (
          <CaseCard key={c.slug} c={c} locale={locale} index={i} total={cases.length} openLabel={openLabel} sticky={sticky} />
        ))}
      </div>
    </section>
  );
}
```

Notes: this is the first eyebrow on the page (the second and last one is in Contact). `gap-[20vh]` gives each card scroll room to slide over the previous one.

- [ ] **Step 4: Mount in page.tsx**

In `src/app/[locale]/page.tsx`, import `getCases`, `getTranslations`, `WorkStack`, and `type Locale`, then place between `<Services />` and `<HowIWork />`:

```tsx
const t = await getTranslations("work");
// ...
<WorkStack cases={getCases()} locale={locale as Locale} eyebrow={t("eyebrow")} title={t("title")} openLabel={t("open")} />
```

- [ ] **Step 5: Write the case page**

`src/app/[locale]/work/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getCase, getCases } from "@/content";
import type { Locale } from "@/content/schema";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { buttonClasses } from "@/components/ui/Button";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCases().map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  const l = locale as Locale;
  return { title: c.title[l], description: c.summary[l] };
}

export default async function CasePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const c = getCase(slug);
  if (!c) notFound();
  const t = await getTranslations("work");
  const all = getCases();
  const idx = all.findIndex((x) => x.slug === c.slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  const budget = c.budgetUAH
    ? c.budgetUAH[0] === c.budgetUAH[1]
      ? t("budgetOne", { value: c.budgetUAH[0].toLocaleString(locale) })
      : t("budgetRange", { min: c.budgetUAH[0].toLocaleString(locale), max: c.budgetUAH[1].toLocaleString(locale) })
    : null;

  const sections = [
    { label: t("task"), paras: c.body.task[l] },
    { label: t("did"), paras: c.body.work[l] },
    { label: t("result"), paras: c.body.result[l] },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <PageTransition>
        <Link href="/#work" className="mb-10 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
          <ArrowLeft size={16} /> {t("all")}
        </Link>
        <h1 className="max-w-[20ch] text-4xl font-semibold tracking-tight sm:text-5xl">{c.title[l]}</h1>
        <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-line py-6 font-mono text-sm sm:grid-cols-4">
          <div>
            <dt className="text-fg-muted">{t("client")}</dt>
            <dd>{c.clientType[l]}</dd>
          </div>
          <div>
            <dt className="text-fg-muted">{t("year")}</dt>
            <dd>{c.year}</dd>
          </div>
          <div>
            <dt className="text-fg-muted">{t("stack")}</dt>
            <dd>{c.stack.join(", ")}</dd>
          </div>
          {budget && (
            <div>
              <dt className="text-fg-muted">{t("budget")}</dt>
              <dd>{budget}</dd>
            </div>
          )}
        </dl>

        {c.gallery && c.gallery.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {c.gallery.map((img) => (
              <div key={img.src} className="relative aspect-video overflow-hidden rounded-md border border-line">
                <Image src={img.src} alt={img.alt[l]} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {sections.map((s) => (
            <section key={s.label} className="lg:col-span-8 lg:col-start-3">
              <h2 className="mb-3 text-xl font-medium">{s.label}</h2>
              <div className="flex max-w-[65ch] flex-col gap-3 text-fg-muted">
                {s.paras.map((p) => (
                  <p key={p} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {c.link && (
            <a href={c.link} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary")}>
              {t("link")} <ArrowUpRight size={16} />
            </a>
          )}
          <a href={site.telegram} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary")}>
            {(await getTranslations("hero"))("ctaTelegram")}
          </a>
        </div>

        <nav className="mt-16 flex items-center justify-between border-t border-line pt-6 text-sm">
          <Link href={`/work/${prev.slug}`} className="inline-flex items-center gap-2 text-fg-muted hover:text-fg">
            <ArrowLeft size={16} /> {t("prev")}
          </Link>
          <Link href={`/work/${next.slug}`} className="inline-flex items-center gap-2 text-fg-muted hover:text-fg">
            {t("next")} <ArrowRight size={16} />
          </Link>
        </nav>
      </PageTransition>
    </main>
  );
}
```

- [ ] **Step 6: Verify**

```bash
npm run typecheck && npm run lint && npx playwright test tests/e2e/site.spec.ts
```

Expected: 8 tests PASS. Then in `npm run dev`, scroll through the work section: cards should pin below the nav and the covered card should shrink and dim as the next one arrives. On a phone-width viewport (DevTools 390px) cards must still stack cleanly with no horizontal overflow.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: sticky-stack work section and case pages

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Reviews marquee

**Files:**
- Create: `src/components/sections/ReviewsMarquee.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `getReviews`, `Review`, messages `reviews`, CSS `.marquee`, `.marquee-track`.
- Produces: `<ReviewsMarquee />` server component (CSS-driven, no JS).

- [ ] **Step 1: Add a failing e2e test**

Append to `tests/e2e/site.spec.ts`:

```ts
test("reviews marquee renders 14 quotes plus a hidden duplicate set", async ({ page }) => {
  await page.goto("/en#reviews");
  expect(await page.locator("#reviews [data-review]").count()).toBe(14);
  expect(await page.locator("#reviews figure").count()).toBe(28);
});
```

Run and confirm it FAILS.

- [ ] **Step 2: Write the component**

`src/components/sections/ReviewsMarquee.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import { Star } from "@phosphor-icons/react/dist/ssr";
import { getReviews, type Review } from "@/content";
import { site } from "@/lib/site";

function Card({ r, hidden }: { r: Review; hidden: boolean }) {
  return (
    <figure
      data-review={hidden ? undefined : r.id}
      aria-hidden={hidden || undefined}
      lang={r.lang}
      className="flex w-[320px] shrink-0 flex-col justify-between gap-4 rounded-md border border-line bg-bg-raised p-5 sm:w-[380px]"
    >
      <blockquote className="line-clamp-3 text-sm leading-relaxed">
        <span aria-hidden>&ldquo;</span>
        {r.quote}
        <span aria-hidden>&rdquo;</span>
      </blockquote>
      <figcaption className="flex items-end justify-between gap-3 text-xs text-fg-muted">
        <span>
          <span className="block text-fg">{r.author}{r.company ? `, ${r.company}` : ""}</span>
          <span className="line-clamp-1">{r.projectName}</span>
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-accent">
          <Star size={12} weight="fill" /> {r.grade}
        </span>
      </figcaption>
    </figure>
  );
}

export async function ReviewsMarquee() {
  const t = await getTranslations("reviews");
  const reviews = getReviews();
  return (
    <section id="reviews" className="scroll-mt-16 border-t border-line py-24">
      <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-4 px-4">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h2>
        <a href={site.freelancehunt} target="_blank" rel="noopener noreferrer" className="text-sm text-fg-muted underline underline-offset-4 hover:text-fg">
          {t("source")}
        </a>
      </div>
      <div className="marquee overflow-hidden">
        <div className="marquee-track flex w-max gap-4 px-4">
          {reviews.map((r) => (
            <Card key={r.id} r={r} hidden={false} />
          ))}
          {reviews.map((r) => (
            <Card key={`dup-${r.id}`} r={r} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
```

The duplicated set has no `data-review` attribute and is `aria-hidden`, so screen readers hear each quote once while the CSS loop stays seamless.

- [ ] **Step 3: Mount in page.tsx**

Insert `<ReviewsMarquee />` between `<WorkStack ... />` and `<HowIWork />`.

- [ ] **Step 4: Verify and commit**

```bash
npm run typecheck && npm run lint && npx playwright test tests/e2e/site.spec.ts
git add -A
git commit -m "feat: reviews marquee

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Expected: 9 tests PASS. Visually: the strip scrolls left continuously, pauses on hover, and is static with reduced motion.

---

### Task 11: Contact library and route handler

**Files:**
- Create: `src/lib/contact.ts`, `src/app/api/contact/route.ts`
- Test: `tests/unit/contact.test.ts`

**Interfaces:**
- Produces:
  - `contactSchema`: zod object `{ name: string(2..80), reply: string(3..120), message: string(20..2000), website: string().max(0) }` (`website` is the honeypot; must be empty).
  - `class RateLimiter { constructor(limit: number, windowMs: number); hit(key: string, now?: number): boolean }` returns `true` when allowed.
  - `sendTelegram(input: { token: string; chatId: string; text: string; fetchImpl?: typeof fetch }): Promise<void>` throws on non-2xx.
  - `formatMessage(data: ContactInput, meta: { locale?: string; ip?: string }): string`
  - `POST /api/contact` returns 200 `{ok:true}`, 400 `{ok:false, error:"invalid"}`, 429 `{ok:false, error:"rate_limited"}`, 503 `{ok:false, error:"disabled"}`, 502 `{ok:false, error:"upstream"}`.

- [ ] **Step 1: Write the failing tests**

`tests/unit/contact.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { contactSchema, RateLimiter, sendTelegram, formatMessage } from "@/lib/contact";

const valid = { name: "Ольга", reply: "@olha", message: "Потрібно доробити каталог у магазині на OpenCart. Є дизайн.", website: "" };

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });
  it("rejects a short message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });
});

describe("RateLimiter", () => {
  it("allows up to limit within the window, then blocks, then resets", () => {
    const rl = new RateLimiter(2, 1000);
    expect(rl.hit("a", 0)).toBe(true);
    expect(rl.hit("a", 10)).toBe(true);
    expect(rl.hit("a", 20)).toBe(false);
    expect(rl.hit("b", 20)).toBe(true);
    expect(rl.hit("a", 1001)).toBe(true);
  });
});

describe("sendTelegram", () => {
  it("posts to the bot API and resolves on 200", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    await sendTelegram({ token: "T", chatId: "C", text: "hello", fetchImpl });
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.telegram.org/botT/sendMessage");
    expect(JSON.parse(init.body as string)).toMatchObject({ chat_id: "C", text: "hello" });
  });
  it("throws on non-2xx", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 500 }));
    await expect(sendTelegram({ token: "T", chatId: "C", text: "x", fetchImpl })).rejects.toThrow();
  });
});

describe("formatMessage", () => {
  it("includes all fields and meta", () => {
    const text = formatMessage(valid, { locale: "uk", ip: "1.2.3.4" });
    expect(text).toContain("Ольга");
    expect(text).toContain("@olha");
    expect(text).toContain("OpenCart");
    expect(text).toContain("uk");
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/contact.test.ts`
Expected: FAIL, cannot resolve `@/lib/contact`.

- [ ] **Step 3: Write the library**

`src/lib/contact.ts`:

```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  reply: z.string().trim().min(3).max(120),
  message: z.string().trim().min(20).max(2000),
  website: z.string().max(0), // honeypot: bots fill it, humans never see it
});
export type ContactInput = z.infer<typeof contactSchema>;

export class RateLimiter {
  private hits = new Map<string, number[]>();
  constructor(private limit: number, private windowMs: number) {}

  hit(key: string, now: number = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}

export function formatMessage(data: ContactInput, meta: { locale?: string; ip?: string }): string {
  return [
    "New message from the portfolio site",
    `Name: ${data.name}`,
    `Reply to: ${data.reply}`,
    `Locale: ${meta.locale ?? "?"}  IP: ${meta.ip ?? "?"}`,
    "",
    data.message,
  ].join("\n");
}

export async function sendTelegram(input: { token: string; chatId: string; text: string; fetchImpl?: typeof fetch }): Promise<void> {
  const f = input.fetchImpl ?? fetch;
  const res = await f(`https://api.telegram.org/bot${input.token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: input.chatId, text: input.text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}`);
}

export function contactEnabled(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}
```

- [ ] **Step 4: Run the unit tests**

Run: `npx vitest run tests/unit/contact.test.ts`
Expected: 7 tests PASS.

- [ ] **Step 5: Write the route handler**

`src/app/api/contact/route.ts`:

```ts
import { NextResponse } from "next/server";
import { contactSchema, contactEnabled, formatMessage, RateLimiter, sendTelegram } from "@/lib/contact";

const limiter = new RateLimiter(5, 60 * 60 * 1000);

export async function POST(req: Request) {
  if (!contactEnabled()) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 503 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!limiter.hit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const locale = req.headers.get("x-locale") ?? undefined;
  try {
    await sendTelegram({
      token: process.env.TELEGRAM_BOT_TOKEN!,
      chatId: process.env.TELEGRAM_CHAT_ID!,
      text: formatMessage(parsed.data, { locale, ip }),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6: Smoke the route**

```bash
npm run build && (npm run start &) && sleep 3
curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/contact -H 'content-type: application/json' -d '{}'
pkill -f "next start"
```

Expected: `503` (env not set, so the route reports disabled). This proves the handler is wired.

- [ ] **Step 7: Commit**

```bash
git add src/lib/contact.ts src/app/api/contact/route.ts tests/unit/contact.test.ts
git commit -m "feat: contact route forwarding to Telegram with validation and rate limit

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Contact section and form

**Files:**
- Create: `src/components/sections/Contact.tsx`, `src/components/sections/ContactForm.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `contactEnabled`, `getProfile`, `site`, `buttonClasses`, `Reveal`, messages `contact`; icons `TelegramLogo`, `EnvelopeSimple`, `GithubLogo`, `Briefcase`.
- Produces: `<Contact />` server section; `<ContactForm />` client form with idle/submitting/success/error states.

- [ ] **Step 1: Add failing e2e tests**

Append to `tests/e2e/site.spec.ts`:

```ts
test("contact section shows links; form hidden without Telegram env", async ({ page }) => {
  await page.goto("/en#contact");
  await expect(page.getByRole("heading", { name: "Have a task? Write to me." })).toBeVisible();
  await expect(page.locator("#contact a[href='https://t.me/tostcr']")).toBeVisible();
  await expect(page.locator("#contact form")).toHaveCount(0);
});
```

Run and confirm it FAILS. (The Playwright web server runs without `.env`, so the form is expected to be absent in CI. Manual form testing happens in Step 6.)

- [ ] **Step 2: Write ContactForm (client)**

`src/components/sections/ContactForm.tsx`:

```tsx
"use client";
import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { buttonClasses } from "@/components/ui/Button";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "reply" | "message", string>>;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function validate(fd: FormData): Errors {
    const e: Errors = {};
    if (String(fd.get("name") ?? "").trim().length < 2) e.name = t("errName");
    if (String(fd.get("reply") ?? "").trim().length < 3) e.reply = t("errReply");
    if (String(fd.get("message") ?? "").trim().length < 20) e.message = t("errMessage");
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "x-locale": locale },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full rounded-md border border-line bg-bg px-3 py-2 text-fg placeholder:text-fg-muted/70 focus-visible:border-accent";
  const label = "text-sm text-fg-muted";
  const err = "text-xs text-red-500";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.p
          key="ok"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md border border-line bg-bg-raised p-6 text-fg"
          role="status"
        >
          {t("success")}
        </motion.p>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={label}>{t("name")}</label>
            <input id="name" name="name" autoComplete="name" className={field} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-err" : undefined} />
            {errors.name && <p id="name-err" className={err}>{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="reply" className={label}>{t("reply")}</label>
            <input id="reply" name="reply" autoComplete="email" className={field} aria-invalid={Boolean(errors.reply)} aria-describedby={errors.reply ? "reply-err" : undefined} />
            {errors.reply && <p id="reply-err" className={err}>{errors.reply}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className={label}>{t("message")}</label>
            <textarea id="message" name="message" rows={5} className={field} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-err" : undefined} />
            {errors.message && <p id="message-err" className={err}>{errors.message}</p>}
          </div>
          <div className="absolute -left-[9999px] top-0" aria-hidden>
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={status === "submitting"} className={`${buttonClasses("primary")} disabled:opacity-60`}>
              {status === "submitting" ? t("sending") : t("send")}
            </button>
            {status === "error" && (
              <p role="alert" className="text-sm text-fg-muted">
                {t("error")}{" "}
                <a href={site.telegram} className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              </p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Write Contact (server)**

`src/components/sections/Contact.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import { TelegramLogo, EnvelopeSimple, GithubLogo, Briefcase } from "@phosphor-icons/react/dist/ssr";
import { getProfile } from "@/content";
import { contactEnabled } from "@/lib/contact";
import { site } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "./ContactForm";

export async function Contact() {
  const t = await getTranslations("contact");
  const tHero = await getTranslations("hero");
  const p = getProfile();
  const links = [
    { href: site.telegram, label: tHero("ctaTelegram"), Icon: TelegramLogo, primary: true },
    { href: `mailto:${site.email}`, label: site.email, Icon: EnvelopeSimple, primary: false },
    { href: site.github, label: t("github"), Icon: GithubLogo, primary: false },
    { href: site.freelancehunt, label: t("freelancehunt"), Icon: Briefcase, primary: false },
  ];
  return (
    <section id="contact" className="scroll-mt-16 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-6 lg:col-span-5">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{t("eyebrow")}</span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="text-sm text-fg-muted">{p.available ? t("available") : t("busy")}</p>
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 ${l.primary ? "text-fg" : "text-fg-muted hover:text-fg"}`}
                >
                  <l.Icon size={20} className={l.primary ? "text-accent" : undefined} />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        {contactEnabled() && (
          <Reveal delay={0.1} className="relative lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </Reveal>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount in page.tsx**

Add `<Contact />` after `<HowIWork />`. The final section order in `page.tsx` is: Hero, ProofStrip, Services, WorkStack, ReviewsMarquee, HowIWork, Contact.

- [ ] **Step 5: Verify tests**

```bash
npm run typecheck && npm run lint && npm test && npx playwright test tests/e2e/site.spec.ts
```

Expected: unit 15 PASS, e2e 10 PASS.

- [ ] **Step 6: Manual form test with a real bot**

Create `.env.local` with `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (the user provides these; if not yet available, skip and note it in the final report). Run `npm run dev`, submit the form with a short message (validation error must show under the field), then a valid message (success state replaces the form and the message arrives in Telegram).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: contact section with Telegram-backed form

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Pre-flight, Lighthouse, and deploy readiness

**Files:**
- Modify: whatever the checks flag; `README.md` (create)

- [ ] **Step 1: Run the design pre-flight mechanically**

```bash
# em/en dashes in anything user-visible
grep -rnP '[\x{2013}\x{2014}]' src messages && echo "FAIL: dashes" || echo "ok: no dashes"
# eyebrow count (max 2 on landing)
grep -rn "uppercase tracking" src/components/sections | wc -l
# no scroll listeners
grep -rn "addEventListener(\"scroll\"\|addEventListener('scroll'" src && echo "FAIL" || echo "ok: no scroll listeners"
# every motion import is in a client file
for f in $(grep -rl "from \"motion/react\"" src); do head -1 "$f" | grep -q "use client" || echo "FAIL: $f lacks 'use client'"; done
```

Expected: no dashes, eyebrow count 2, no scroll listeners, no FAIL lines. Fix anything flagged.

- [ ] **Step 2: Visual checks in both themes and at 390px**

Run `npm run dev` and check `/uk` and `/en`, light and dark, desktop and 390px wide:
- Hero fits in the first viewport on a 1440x900 desktop: headline two lines, CTAs visible.
- Nav on one line, 64px.
- No horizontal scroll at 390px.
- Button text readable in both themes (accent on dark body text, off-white on light accent).
- Work cards stack cleanly; reviews marquee scrolls; count-up fires once.

- [ ] **Step 3: Lighthouse**

```bash
npm run build && (npm run start &) && sleep 3
npx --yes lighthouse http://localhost:3000/uk --preset=desktop --output=json --output-path=/tmp/lh-desktop.json --chrome-flags="--headless" --quiet
npx --yes lighthouse http://localhost:3000/uk --output=json --output-path=/tmp/lh-mobile.json --chrome-flags="--headless" --quiet
node -e 'for (const f of ["/tmp/lh-desktop.json","/tmp/lh-mobile.json"]) { const r=require(f).categories; console.log(f, Object.values(r).map(c=>c.title+": "+Math.round(c.score*100)).join(", ")); }'
pkill -f "next start"
```

Expected: every category 95 or above on both. If Performance is below, the usual fixes are: confirm `priority` on the hero image, confirm `sizes` on all images, and lazy-load nothing above the fold.

- [ ] **Step 4: Write the README**

`README.md`:

```md
# tostcr portfolio

Personal site of Andrii Tantsiura (TOSTcR). Next.js 16, Tailwind v4, next-intl, Motion.

## Run

    npm install
    cp .env.example .env.local   # fill in Telegram values to enable the contact form
    npm run dev

## Content

- Cases: `src/content/cases.ts`
- Reviews: `src/content/reviews.ts`
- Profile numbers: refreshed at build by `scripts/fetch-profile.ts` when `FREELANCEHUNT_TOKEN` is set; otherwise `src/content/profile.generated.json` is used as is.
- UI strings: `messages/uk.json`, `messages/en.json`

## Checks

    npm run typecheck && npm run lint && npm test && npm run test:e2e

## Deploy

Vercel, root directory `/`. Set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and optionally `FREELANCEHUNT_TOKEN` in the project environment.
```

- [ ] **Step 5: Final full run and commit**

```bash
npm run typecheck && npm run lint && npm test && npm run test:e2e
git add -A
git commit -m "docs: README and pre-flight fixes

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 6: Report**

Report to the user: what was built, the checks and their results (Lighthouse numbers in a table), the three inputs still needed (Telegram bot values, screenshots for shop cases, any NDA cases to drop), and the deploy step (connect the repo to the existing Vercel project or run `npx vercel --prod`).
