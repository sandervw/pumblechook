import { expect, test } from "@playwright/test";
import { projects } from "./support/content";

test("UC-02 five arms each carry one project from the sheet", async ({
  page,
}) => {
  await page.goto("/");

  for (const project of projects) {
    const nameLink = page.getByRole("link", { name: project.name, exact: true });
    await expect(nameLink).toHaveCount(1);
    await nameLink.focus();
    await expect(nameLink).toBeFocused();
    await expect(nameLink).toBeVisible();
    await expect(page.getByText(project.name, { exact: true })).toHaveCount(1);
  }

  const names = new Set(projects.map((project) => project.name));
  expect(names.size).toBe(5);
});
