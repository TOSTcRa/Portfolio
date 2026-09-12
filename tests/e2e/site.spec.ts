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
