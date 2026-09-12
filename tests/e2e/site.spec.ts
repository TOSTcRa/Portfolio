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
