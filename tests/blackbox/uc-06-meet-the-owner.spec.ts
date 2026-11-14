import { expect, test } from "@playwright/test";
import { owner } from "./support/content";
import { followAndReturn, linkTo, stubOutsideSites } from "./support/visitor";

test("UC-06 owner's name, bio, and profile links", async ({
  page,
  baseURL,
}) => {
  await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
  await page.goto("/");

  await expect(page.getByText(owner.name, { exact: true })).toBeVisible();
  // The bio is shown in quotation marks.
  await expect(page.getByText(owner.bio)).toBeVisible();

  const github = linkTo(page, owner.github);
  const linkedin = linkTo(page, owner.linkedin);
  await expect(github).toHaveCount(1);
  await expect(linkedin).toHaveCount(1);

  await followAndReturn(page, github, owner.github);
  await followAndReturn(page, linkedin, owner.linkedin);
});
