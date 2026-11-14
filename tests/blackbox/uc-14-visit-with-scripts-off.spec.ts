import { expect, test } from "@playwright/test";
import { owner, projects } from "./support/content";
import { followAndReturn, linkTo, stubOutsideSites } from "./support/visitor";

test.use({ javaScriptEnabled: false });

test("UC-14 with scripts off everything reads and links open", async ({
  page,
  baseURL,
}) => {
  await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
  await page.goto("/");

  await expect(page.getByText(owner.name, { exact: true })).toBeVisible();
  await expect(page.getByText(owner.bio)).toBeVisible();
  await expect(linkTo(page, owner.github)).toBeVisible();
  for (const project of projects) {
    await expect(linkTo(page, project.liveSite)).toHaveText(project.name);
    await expect(page.getByText(project.logline)).toBeVisible();
    if (project.repository) {
      await expect(linkTo(page, project.repository)).toBeVisible();
    }
  }

  const firstProject = projects[0];
  const nameLink = linkTo(page, firstProject.liveSite);
  await followAndReturn(page, nameLink, firstProject.liveSite);
});
