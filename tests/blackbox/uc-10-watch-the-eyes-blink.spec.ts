import { expect, test } from "@playwright/test";
import { partOf, pictureArea, shareOfPaint } from "./support/visitor";

const WATCH_TIME = 30_000;
// Shares of the picture: left, top, right, bottom.
const LARGE_EYE = [0.0625, 0.176, 0.1875, 0.278];
const FISH_WATER = [0.734, 0.417, 0.893, 0.58];

/** Watches a paint until it dips and comes back. */
async function seesBlink(samplePaint: () => Promise<number>, dip: number): Promise<boolean> {
  const started = Date.now();
  let fullest = 0;
  let closed = false;
  while (Date.now() - started < WATCH_TIME) {
    const share = await samplePaint();
    fullest = Math.max(fullest, share);
    closed = closed || share < fullest * dip;
    if (closed && share > fullest * 0.97) return true;
  }
  return false;
}

test("UC-10 the creature's eyes close and reopen", async ({ page, browser }) => {
  test.slow();
  await page.goto("/");
  const eye = partOf(await pictureArea(page), LARGE_EYE);
  const sheet = await browser.newPage();

  // The open eye is yellow; its lid is not.
  expect(await shareOfPaint(page, sheet, eye, "yellow")).toBeGreaterThan(0.5);
  const blinked = await seesBlink(() => shareOfPaint(page, sheet, eye, "yellow"), 0.5);
  await sheet.close();
  expect(blinked, "the creature's eye never closed and reopened").toBe(true);
});

test.describe("still fish", () => {
  // Fish hold still with scripts off, so a blink shows alone.
  test.use({ javaScriptEnabled: false, viewport: { width: 1920, height: 1080 } });

  test("UC-10 a dweller's eyes close and reopen", async ({ page, browser }) => {
    test.slow();
    await page.goto("/");
    const water = partOf(await pictureArea(page), FISH_WATER);
    const sheet = await browser.newPage();

    // A fish's eye is cream; its lid is lime like its body.
    expect(await shareOfPaint(page, sheet, water, "cream")).toBeGreaterThan(0);
    const blinked = await seesBlink(() => shareOfPaint(page, sheet, water, "cream"), 0.93);
    await sheet.close();
    expect(blinked, "no fish's eye closed and reopened").toBe(true);
  });
});
