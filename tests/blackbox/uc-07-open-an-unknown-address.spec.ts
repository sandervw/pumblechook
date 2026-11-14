import { expect, test } from "@playwright/test";
import { owner, projects } from "./support/content";

for (const extraPath of ["/squid", "/deep/sea/anything"]) {
  test(`UC-07 ${extraPath} shows the same scene as the root`, async ({
    page,
  }) => {
    await page.goto("/");
    const rootTitle = await page.title();
    const rootWords = await page.locator("body").innerText();

    await page.goto(extraPath);
    await expect(page).toHaveTitle(rootTitle);
    expect(await page.locator("body").innerText()).toBe(rootWords);
    await expect(page.getByText(owner.name, { exact: true })).toBeVisible();
    for (const project of projects) {
      const nameLink = page.getByRole("link", {
        name: project.name,
        exact: true,
      });
      await expect(nameLink).toBeVisible();
    }
  });
}
