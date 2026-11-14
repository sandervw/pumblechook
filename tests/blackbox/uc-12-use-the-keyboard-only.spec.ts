import { expect, test, type Page } from "@playwright/test";
import { owner, projects } from "./support/content";
import { stubOutsideSites } from "./support/visitor";

interface TabStop {
  address: string;
  focusedLook: Buffer;
  area: { x: number; y: number; width: number; height: number };
}

const normalise = (address: string) => new URL(address).href;

/** Presses Tab through the whole page, noting each stop. */
async function tabThroughPage(page: Page): Promise<TabStop[]> {
  const stops: TabStop[] = [];
  for (let presses = 0; presses < 80; presses += 1) {
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    if ((await focused.count()) === 0) break;
    const address = normalise((await focused.getAttribute("href")) ?? "about:blank");
    if (stops.some((stop) => stop.address === address)) break;
    const box = await focused.boundingBox();
    if (!box) throw new Error(`focused link has no box: ${address}`);
    const area = {
      x: Math.max(0, box.x - 6),
      y: Math.max(0, box.y - 6),
      width: box.width + 12,
      height: box.height + 12,
    };
    await expectProjectReadable(page, address);
    const focusedLook = await page.screenshot({ clip: area });
    stops.push({ address, focusedLook, area });
  }
  return stops;
}

/** Checks the focused project's name and logline are readable. */
async function expectProjectReadable(page: Page, address: string) {
  const project = projects.find(
    (candidate) =>
      normalise(candidate.liveSite) === address ||
      (candidate.repository && normalise(candidate.repository) === address),
  );
  if (!project) return;
  const nameLink = page.getByRole("link", { name: project.name, exact: true });
  await expect(nameLink).toBeVisible();
  await expect(page.getByText(project.logline)).toBeVisible();
}

test("UC-12 Tab visits every link in sheet order with a mark", async ({
  page,
}) => {
  await page.goto("/");
  const stops = await tabThroughPage(page);
  const visited = stops.map((stop) => stop.address);

  const liveSites = projects.map((project) => normalise(project.liveSite));
  const repositories = projects
    .flatMap((project) => (project.repository ? [project.repository] : []))
    .map(normalise);
  const profiles = [owner.github, owner.linkedin].map(normalise);
  for (const address of [...liveSites, ...repositories, ...profiles]) {
    expect(visited).toContain(address);
  }

  // Projects come in the order of the content sheet.
  const projectOrder = visited.filter((address) => liveSites.includes(address));
  expect(projectOrder).toEqual(liveSites);

  // Unfocused, each link looks different from focused.
  await page.reload();
  for (const stop of stops) {
    const restingLook = await page.screenshot({ clip: stop.area });
    expect(
      restingLook.equals(stop.focusedLook),
      `no visible focus mark on ${stop.address}`,
    ).toBe(false);
  }
});

test("UC-12 Enter on a focused link opens it", async ({ page, baseURL }) => {
  await stubOutsideSites(page, baseURL ?? "http://localhost:8787");
  await page.goto("/");
  const firstProject = projects[0];
  const nameLink = page.getByRole("link", { name: firstProject.name, exact: true });

  for (let presses = 0; presses < 80; presses += 1) {
    await page.keyboard.press("Tab");
    if (await nameLink.evaluate((link) => link === document.activeElement)) {
      break;
    }
  }
  await expect(nameLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(normalise(firstProject.liveSite));
});
