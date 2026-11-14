import { test } from "@playwright/test";
import { projects } from "./support/content";
import { followAndReturn, stubOutsideSites } from "./support/visitor";

for (const project of projects) {
  test(`UC-04 ${project.name} name opens its live site`, async ({
    page,
    baseURL,
  }) => {
    await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
    await page.goto("/");
    const nameLink = page.getByRole("link", { name: project.name, exact: true });

    await nameLink.hover();
    await followAndReturn(page, nameLink, project.liveSiteLink);
  });
}
