import { expect, test } from "@playwright/test";

test("the page loads", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Pumblechook");
});

test("the browser keeps the art, scripts, and fonts for a week", async ({ page }) => {
  const kept: (string | undefined)[] = [];
  page.on("response", (response) => {
    if (/\/(_astro|fonts)\//.test(response.url())) {
      kept.push(response.headers()["cache-control"]);
    }
  });

  await page.goto("/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  expect(kept.length).toBeGreaterThan(0);
  expect(new Set(kept)).toEqual(new Set(["public, max-age=604800"]));
});
