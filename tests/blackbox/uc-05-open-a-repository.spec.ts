import { expect, test } from "@playwright/test";
import { ownerMark, projects } from "./support/content";
import { followAndReturn, linkTo, reachArm, stubOutsideSites } from "./support/visitor";

const publicProjects = projects.filter((project) => project.repositoryLink);

for (const project of publicProjects) {
  test(`UC-05 ${project.name} offers its repository link`, async ({
    page,
    baseURL,
  }) => {
    await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
    await page.goto("/");
    const address = project.repositoryLink ?? "";
    const codeLink = linkTo(page, address);

    await reachArm(page, page.getByRole("link", { name: project.name, exact: true }));
    await expect(codeLink).toHaveCount(1);
    await expect(codeLink).toBeVisible();
    await expect(codeLink).toHaveText("(code)");
    await followAndReturn(page, codeLink, address);
  });
}

test("UC-05 private projects offer no repository link", async ({ page }) => {
  await page.goto("/");
  const codeLinks = page.getByRole("link").filter({ hasText: "(code)" });
  await expect(codeLinks).toHaveCount(publicProjects.length);

  // Every repository-looking link belongs to a public project.
  const allowed = publicProjects.map((project) => project.repositoryLink);
  for (const link of await page.getByRole("link").all()) {
    const address = (await link.getAttribute("href")) ?? "";
    if (address.startsWith(`${ownerMark.profileLink}/`)) {
      expect(allowed).toContain(address);
    }
  }
});
