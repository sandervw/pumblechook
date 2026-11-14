import { expect, test } from "@playwright/test";
import { projects } from "./support/content";
import { countWords, reachArm } from "./support/visitor";

for (const project of projects) {
  test(`UC-03 ${project.name} logline reads word for word`, async ({
    page,
  }) => {
    await page.goto("/");
    const nameLink = page.getByRole("link", { name: project.name, exact: true });
    // The repository link may follow the logline closely.
    const logline = page.getByText(project.logline);

    // Reach the arm by pointing at it.
    await reachArm(page, nameLink);
    await expect(nameLink).toBeVisible();
    await expect(logline).toBeVisible();
    expect(countWords(project.logline)).toBeLessThanOrEqual(25);

    // Words stay readable while the arm stays reached.
    await page.waitForTimeout(2000);
    await expect(nameLink).toBeVisible();
    await expect(logline).toBeVisible();

    // Reach the arm by keyboard focus.
    await nameLink.focus();
    await page.waitForTimeout(2000);
    await expect(nameLink).toBeVisible();
    await expect(logline).toBeVisible();
  });
}
