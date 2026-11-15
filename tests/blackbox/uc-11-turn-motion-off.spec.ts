import { expect, test } from "@playwright/test";
import { ownerMark, projects } from "./support/content";
import { followAndReturn, linkTo, pictureArea, stubOutsideSites } from "./support/visitor";

test.use({ viewport: { width: 1280, height: 800 }, contextOptions: { reducedMotion: "reduce" } });

test("UC-11 with motion off nothing moves and all still reads", async ({ page, baseURL }) => {
  test.slow();
  await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  // Touch nothing for 30 seconds: every look is the same.
  const atFirst = await page.screenshot();
  for (const seconds of [10, 20, 30]) {
    await page.waitForTimeout(10_000);
    expect((await page.screenshot()).equals(atFirst), `the scene moved within ${seconds} seconds`).toBe(true);
  }

  // Rest the pointer on an arm: still nothing moves.
  const firstProject = projects[0];
  const nameLink = page.getByRole("link", { name: firstProject.name, exact: true });
  await nameLink.hover();
  await page.waitForTimeout(500);
  const pointedAt = await page.screenshot();
  await page.waitForTimeout(3000);
  expect((await page.screenshot()).equals(pointedAt), "the scene moved under the pointer").toBe(true);

  // Rest the pointer on the large eye: still nothing moves.
  const picture = await pictureArea(page);
  await page.mouse.move(picture.x + picture.width * 0.125, picture.y + picture.height * 0.22);
  await page.waitForTimeout(500);
  const staredAt = await page.screenshot();
  await page.waitForTimeout(2000);
  expect((await page.screenshot()).equals(staredAt), "the eye moved under the pointer").toBe(true);

  // Every name, logline, and link still reads and opens.
  await expect(page.getByText(ownerMark.name, { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(linkTo(page, ownerMark.profileLink)).toBeVisible();
  for (const project of projects) {
    await expect(linkTo(page, project.liveSiteLink)).toHaveText(project.name);
    await expect(page.getByText(project.logline)).toBeVisible();
    if (project.repositoryLink) {
      await expect(linkTo(page, project.repositoryLink)).toBeVisible();
    }
  }
  await followAndReturn(page, nameLink, firstProject.liveSiteLink);
});
