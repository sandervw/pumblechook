import { expect, test } from "@playwright/test";
import { ownerMark, projects } from "./support/content";
import { linkTo } from "./support/visitor";

test("UC-13 reading order follows the owner's mark, then projects in sheet order", async ({
  page,
}) => {
  await page.goto("/");
  const spoken = await page.locator("body").ariaSnapshot();

  // Each piece must be spoken after the one before.
  const sequence = [ownerMark.name, ownerMark.bio];
  for (const project of projects) {
    sequence.push(`/url: ${project.liveSiteLink}`, project.logline);
    if (project.repositoryLink) sequence.push(`/url: ${project.repositoryLink}`);
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

  await expect(linkTo(page, ownerMark.profileLink)).toHaveAccessibleName(/github/i);
  for (const project of projects) {
    await expect(linkTo(page, project.liveSiteLink)).toHaveAccessibleName(
      project.name,
    );
    if (!project.repositoryLink) continue;
    const codeLink = linkTo(page, project.repositoryLink);
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
