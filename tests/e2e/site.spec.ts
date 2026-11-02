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

test("nav switches locale, keeps the path and the theme", async ({ page }) => {
  await page.goto("/uk");
  await page.getByRole("button", { name: "Змінити тему" }).click();
  const chosen = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("link", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", chosen!);
  await page.getByRole("link", { name: "Перейти на українську" }).click();
  await expect(page).toHaveURL(/\/uk$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", chosen!);
});

test("theme toggle flips data-theme and persists", async ({ page }) => {
  // Clicking before hydration does nothing, so wait for the page to settle first.
  await page.goto("/en", { waitUntil: "networkidle" });
  const html = page.locator("html");
  const before = (await html.getAttribute("data-theme")) ?? "";
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(html).not.toHaveAttribute("data-theme", before);
  const after = await html.getAttribute("data-theme");
  await page.reload();
  expect(await html.getAttribute("data-theme")).toBe(after);
});

test("hero shows both CTAs and proof numbers", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("link", { name: "Message on Telegram" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "See work" })).toBeVisible();
  await expect(page.getByText("completed projects")).toBeVisible();
});

test("services and how-i-work render", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "What I do most" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How I work" })).toBeVisible();
});

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

test("reviews marquee renders 16 quotes plus a hidden duplicate set", async ({ page }) => {
  await page.goto("/en#reviews");
  expect(await page.locator("#reviews [data-review]").count()).toBe(16);
  expect(await page.locator("#reviews figure").count()).toBe(32);
});

test("contact section shows links; form is complete when rendered", async ({ page }) => {
  await page.goto("/en#contact");
  await expect(page.getByRole("heading", { name: "Have a task? Write to me." })).toBeVisible();
  await expect(page.locator("#contact a[href='https://t.me/tostcr']")).toBeVisible();
  // The form renders only when Telegram env vars were present at build time.
  const forms = await page.locator("#contact form").count();
  if (forms === 1) {
    for (const id of ["name", "reply", "message"]) await expect(page.locator(`#contact form #${id}`)).toBeVisible();
  } else {
    expect(forms).toBe(0);
  }
});

test("every case card has its own animated visual", async ({ page }) => {
  await page.goto("/en#work");
  const slugs = ["comarch-edi-baf", "auto-parts-shop-seo", "blackjack-nextjs", "shop-storefront-catalog", "site-security-cleanup", "agency-site-improvements", "1c-omnichannel-spec", "dating-platforms-frontend", "client-portfolio-admin"];
  for (const slug of slugs) {
    await expect(page.locator(`#work [data-visual='${slug}']`)).toHaveCount(1);
  }
});

test("reduced motion: no hero canvas and no running animations in work", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/en#work");
  await page.waitForTimeout(1500);
  expect(await page.locator("canvas").count()).toBe(0);
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
  expect(running).toBe(0);
  await ctx.close();
});
