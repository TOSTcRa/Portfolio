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

test("reviews marquee renders 14 quotes plus a hidden duplicate set", async ({ page }) => {
  await page.goto("/en#reviews");
  expect(await page.locator("#reviews [data-review]").count()).toBe(14);
  expect(await page.locator("#reviews figure").count()).toBe(28);
});

test("contact section shows links; form hidden without Telegram env", async ({ page }) => {
  await page.goto("/en#contact");
  await expect(page.getByRole("heading", { name: "Have a task? Write to me." })).toBeVisible();
  await expect(page.locator("#contact a[href='https://t.me/tostcr']")).toBeVisible();
  await expect(page.locator("#contact form")).toHaveCount(0);
});
