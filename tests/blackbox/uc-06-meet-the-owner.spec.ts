import { expect, test } from "@playwright/test";
import { ownerMark } from "./support/content";
import { followAndReturn, linkTo, stubOutsideSites } from "./support/visitor";

test("UC-06 owner's name, bio, and profile link", async ({
  page,
  baseURL,
}) => {
  await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
  await page.goto("/");

  await expect(page.getByText(ownerMark.name, { exact: true })).toBeVisible();
  // The bio is shown in quotation marks.
  await expect(page.getByText(ownerMark.bio)).toBeVisible();

  const github = linkTo(page, ownerMark.profileLink);
  await expect(github).toHaveCount(1);

  await followAndReturn(page, github, ownerMark.profileLink);
});
