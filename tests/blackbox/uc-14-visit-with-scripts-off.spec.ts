import { expect, test } from "@playwright/test";
import { ownerMark, projects } from "./support/content";
import { followAndReturn, linkTo, stubOutsideSites } from "./support/visitor";

test.use({ javaScriptEnabled: false });

test("UC-14 with scripts off everything reads and links open", async ({
  page,
  baseURL,
}) => {
  await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
  await page.goto("/");

  await expect(page.getByText(ownerMark.name, { exact: true })).toBeVisible();
  await expect(page.getByText(ownerMark.bio)).toBeVisible();
  await expect(linkTo(page, ownerMark.profileLink)).toBeVisible();
  for (const project of projects) {
    await expect(linkTo(page, project.liveSiteLink)).toHaveText(project.name);
    await expect(page.getByText(project.logline)).toBeVisible();
    if (project.repositoryLink) {
      await expect(linkTo(page, project.repositoryLink)).toBeVisible();
    }
  }

  const firstProject = projects[0];
  const nameLink = linkTo(page, firstProject.liveSiteLink);
  await followAndReturn(page, nameLink, firstProject.liveSiteLink);
});
