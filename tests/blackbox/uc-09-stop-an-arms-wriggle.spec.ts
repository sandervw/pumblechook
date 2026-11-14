import { expect, test } from "@playwright/test";
import { projects } from "./support/content";
import { partOf, pictureArea } from "./support/visitor";

// Empty water between two arms, as shares of the picture.
const EMPTY_WATER = [0.37, 0.78, 0.38, 0.79];
const REACHED_ARM = 2;

test.use({ viewport: { width: 1280, height: 800 } });

test("UC-09 an arm rests under the pointer and wriggles after", async ({ page }) => {
  test.slow();
  await page.goto("/");
  const picture = await pictureArea(page);
  // A logline runs along its arm and moves with it.
  const loglines = projects.map((project) => page.getByText(project.logline));
  const placeArms = () => Promise.all(loglines.map((logline) => logline.boundingBox()));

  // Every arm wriggles on its own.
  const atFirst = await placeArms();
  await page.waitForTimeout(10_000);
  const afterWatching = await placeArms();
  atFirst.forEach((place, arm) => {
    expect(afterWatching[arm], `arm ${arm} did not wriggle`).not.toEqual(place);
  });

  // The arm under the pointer rests; the others keep moving.
  const nameLink = page.getByRole("link", { name: projects[REACHED_ARM].name, exact: true });
  const box = await nameLink.boundingBox();
  if (!box) throw new Error("the name link has no box to point at");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(3000);
  const atRest = await placeArms();
  await page.waitForTimeout(2000);
  const stillAtRest = await placeArms();
  atRest.forEach((place, arm) => {
    if (arm === REACHED_ARM) {
      expect(stillAtRest[arm], "the reached arm did not rest").toEqual(place);
    } else {
      expect(stillAtRest[arm], `arm ${arm} stopped too`).not.toEqual(place);
    }
  });

  // Off the arm, on empty water, it wriggles again.
  const water = partOf(picture, EMPTY_WATER);
  await page.mouse.move(water.x, water.y);
  await expect
    .poll(async () => (await placeArms())[REACHED_ARM], { timeout: 5000 })
    .not.toEqual(atRest[REACHED_ARM]);
});
