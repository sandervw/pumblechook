import { expect, test, type Locator } from "@playwright/test";
import { ownerMark, projects } from "./support/content";
import { linkTo, pictureArea, stubOutsideSites } from "./support/visitor";

const PHONE = { width: 390, height: 844 };
// Text smaller than this needs a pinch to read on a phone.
const SMALLEST_READABLE = 12;

test.use({ viewport: PHONE, hasTouch: true, isMobile: true });

test("UC-15 the phone gets a tall picture with no sideways scroll", async ({ page }) => {
  await page.goto("/");

  const picture = await pictureArea(page);
  expect(picture.height).toBeGreaterThan(picture.width);
  expect(picture.width).toBeLessThanOrEqual(PHONE.width + 1);
  expect(picture.height).toBeLessThanOrEqual(PHONE.height + 1);
  const sidewaysScroll = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(sidewaysScroll).toBeLessThanOrEqual(0);
});

test("UC-15 every name and link reads without a pinch", async ({ page }) => {
  await page.goto("/");

  const owner = page.getByText(ownerMark.name, { exact: true }).filter({ visible: true });
  await expect(owner).toBeVisible();
  await expect(page.getByText(ownerMark.tag, { exact: true }).filter({ visible: true })).toBeVisible();
  const links = [linkTo(page, ownerMark.profileLink)];
  for (const project of projects) {
    links.push(linkTo(page, project.liveSiteLink));
    if (project.repositoryLink) {
      links.push(linkTo(page, project.repositoryLink));
    }
  }
  for (const link of links) {
    await expectReadable(link);
  }
});

/** Checks a link is on screen and large enough to tap. */
async function expectReadable(link: Locator) {
  await expect(link).toBeVisible();
  const box = await link.boundingBox();
  if (!box) throw new Error(`${await link.textContent()} has no box`);
  expect(box.height, `${await link.textContent()} is too small`).toBeGreaterThanOrEqual(SMALLEST_READABLE);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(PHONE.width);
}

test("UC-15 tapping a live site link opens it", async ({ page, baseURL }) => {
  await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
  await page.goto("/");

  const project = projects[2];
  const nameLink = linkTo(page, project.liveSiteLink);
  await expect(nameLink).toHaveText(project.name);
  // Arms never hold still, so tap where the name is now.
  const box = await nameLink.boundingBox();
  if (!box) throw new Error("the name has no box to tap");
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(new URL(project.liveSiteLink).href);
});
