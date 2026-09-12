# tostcr portfolio

Personal site of Andrii Tantsiura (TOSTcR). Next.js 16, Tailwind v4, next-intl, Motion.

## Run

    npm install
    cp .env.example .env.local   # fill in Telegram values to enable the contact form
    npm run dev

## Content

- Cases: `src/content/cases.ts`
- Reviews: `src/content/reviews.ts`
- Profile numbers: refreshed at build by `scripts/fetch-profile.mts` when `FREELANCEHUNT_TOKEN` is set; otherwise `src/content/profile.generated.json` is used as is.
- UI strings: `messages/uk.json`, `messages/en.json`
- Hero image: `public/hero.webp`

## Checks

    npm run typecheck && npm run lint && npm test && npm run test:e2e

## Deploy

Vercel, root directory `/`. Set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and optionally `FREELANCEHUNT_TOKEN` in the project environment. The contact form is rendered only when both Telegram variables are present at build time.
