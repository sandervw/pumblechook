import { expect, test } from "@playwright/test";
import { partOf, pictureArea, shareOfPaint } from "./support/visitor";

const WINDOW = { width: 1280, height: 800 };
// Shares of the picture: left, top, right, bottom.
const UPPER_LEFT_CORNER = [0, 0, 0.29, 0.46];
const OPEN_WATER = [0.3125, 0.75, 0.4375, 0.824];

test.use({ viewport: WINDOW });

test("UC-01 one picture fills the desktop window", async ({ page, browser }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Pumblechook");

  const picture = await pictureArea(page);
  const fillsWidth = Math.abs(picture.width - WINDOW.width) < 1;
  const fillsHeight = Math.abs(picture.height - WINDOW.height) < 1;
  expect(fillsWidth || fillsHeight, "the picture fills neither width nor height").toBe(true);
  expect(picture.width).toBeLessThanOrEqual(WINDOW.width + 1);
  expect(picture.height).toBeLessThanOrEqual(WINDOW.height + 1);

  const sidewaysScroll = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(sidewaysScroll).toBeLessThanOrEqual(0);

  // The creature is rust-red; the open water is not.
  const sheet = await browser.newPage();
  const corner = await shareOfPaint(page, sheet, partOf(picture, UPPER_LEFT_CORNER), "rust");
  const water = await shareOfPaint(page, sheet, partOf(picture, OPEN_WATER), "rust");
  await sheet.close();
  expect(corner, "no creature in the upper-left corner").toBeGreaterThan(0.5);
  expect(water, "the creature also fills the open water").toBeLessThan(0.05);
});
