import { expect, test } from "@playwright/test";
import { owner, projects } from "./support/content";
import { linkTo } from "./support/visitor";

test("UC-13 reading order follows owner, then projects in sheet order", async ({
  page,
}) => {
  await page.goto("/");
  const spoken = await page.locator("body").ariaSnapshot();

  // Each piece must be spoken after the one before.
  const sequence = [owner.name, owner.bio];
  for (const project of projects) {
    sequence.push(`/url: ${project.liveSite}`, project.logline);
    if (project.repository) sequence.push(`/url: ${project.repository}`);
  }
  let position = -1;
  for (const piece of sequence) {
    const found = spoken.indexOf(piece, position + 1);
    expect(found, `"${piece}" not spoken in order`).toBeGreaterThan(position);
    position = found;
  }
});

test("UC-13 each link is named for where it goes", async ({ page }) => {
  await page.goto("/");

  await expect(linkTo(page, owner.github)).toHaveAccessibleName(/github/i);
  await expect(linkTo(page, owner.linkedin)).toHaveAccessibleName(/linkedin/i);
  for (const project of projects) {
    await expect(linkTo(page, project.liveSite)).toHaveAccessibleName(
      project.name,
    );
    if (!project.repository) continue;
    const codeLink = linkTo(page, project.repository);
    await expect(codeLink).toHaveAccessibleName(new RegExp(project.name));
    await expect(codeLink).toHaveAccessibleName(/code/i);
  }
});

test("UC-13 decorative pieces are passed over in silence", async ({
  page,
}) => {
  await page.goto("/");

  // Any picture a reader announces must carry a name.
  for (const picture of await page.getByRole("img").all()) {
    await expect(picture).toHaveAccessibleName(/\S/);
  }
  for (const link of await page.getByRole("link").all()) {
    await expect(link).toHaveAccessibleName(/\S/);
  }
});
