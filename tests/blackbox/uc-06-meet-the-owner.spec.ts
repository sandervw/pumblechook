import { expect, test } from "@playwright/test";
import { ownerMark } from "./support/content";
import { followAndReturn, linkTo, stubOutsideSites } from "./support/visitor";

test("UC-06 owner's name, tag, and profile link", async ({
  page,
  baseURL,
}) => {
  await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
  await page.goto("/");

  const name = page.getByText(ownerMark.name, { exact: true }).filter({ visible: true });
  const tag = page.getByText(ownerMark.tag, { exact: true }).filter({ visible: true });
  await expect(name).toBeVisible();
  await expect(tag).toBeVisible();
  // The tag follows the name on the same line.
  const nameBox = await name.boundingBox();
  const tagBox = await tag.boundingBox();
  if (!nameBox || !tagBox) throw new Error("the name or tag has no box");
  expect(tagBox.x).toBeGreaterThan(nameBox.x + nameBox.width * 0.9);
  expect(tagBox.y).toBeLessThan(nameBox.y + nameBox.height);

  const github = linkTo(page, ownerMark.profileLink);
  await expect(github).toHaveCount(1);

  await followAndReturn(page, github, ownerMark.profileLink);
});
