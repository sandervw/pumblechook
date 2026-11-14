import { expect, test } from "@playwright/test";
import { partOf, pictureArea, shareOfPaint } from "./support/visitor";

// The large eye, as shares of the picture: left, top, right, bottom.
const LARGE_EYE = [0.03, 0.01, 0.22, 0.34];
const EMPTY_WATER = [0.37, 0.78, 0.38, 0.79];

test.use({ viewport: { width: 1280, height: 800 } });

test("UC-16 an eye stares wide at the pointer, then settles", async ({ page, browser }) => {
  test.slow();
  await page.goto("/");
  const picture = await pictureArea(page);
  const eye = partOf(picture, LARGE_EYE);
  const sheet = await browser.newPage();
  const yellow = () => shareOfPaint(page, sheet, eye, "yellow");

  // At rest the lid hides the top of the eye.
  const atRest = await yellow();

  // Pointed at, the eye opens wide and swells, and does not blink.
  await page.mouse.move(eye.x + eye.width / 2, eye.y + eye.height * 0.7);
  await page.waitForTimeout(1000);
  const staring = await yellow();
  expect(staring, "the eye did not open wide").toBeGreaterThan(atRest * 1.3);
  for (let look = 0; look < 6; look += 1) {
    await page.waitForTimeout(300);
    expect(await yellow(), "the staring eye blinked").toBeGreaterThan(staring * 0.85);
  }

  // Once the pointer leaves, the lid falls back.
  const water = partOf(picture, EMPTY_WATER);
  await page.mouse.move(water.x, water.y);
  await page.waitForTimeout(1500);
  expect(await yellow(), "the eye stayed wide").toBeLessThan(staring * 0.85);
  await sheet.close();
});
