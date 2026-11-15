import { expect, type Locator, type Page } from "@playwright/test";

/** Answers every outside request with a stub page. */
export async function stubOutsideSites(page: Page, siteAddress: string) {
  const siteHost = new URL(siteAddress).host;
  await page.context().route(
    (address) => address.host !== siteHost,
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Outside</title><p>Outside site</p>",
      }),
  );
}

/** Finds the link a visitor would follow to an address. */
export function linkTo(page: Page, address: string): Locator {
  return page.getByRole("link").and(page.locator(`[href="${address}"]`));
}

/** Follows a link in the same tab, then comes back. */
export async function followAndReturn(
  page: Page,
  link: Locator,
  address: string,
) {
  const sceneAddress = page.url();
  await link.click();
  await expect(page).toHaveURL(new URL(address).href);
  await page.goBack();
  await expect(page).toHaveURL(sceneAddress);
}

/** Counts the words a visitor would read. */
export function countWords(words: string): number {
  return words.trim().split(/\s+/).length;
}

/** A rectangle of the window, in pixels. */
export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A paint a visitor can tell apart by eye. */
export type Paint = "rust" | "yellow" | "cream";

/** Points at a link's arm, then waits for the arm to rest. */
export async function reachArm(page: Page, link: Locator) {
  const box = await link.boundingBox();
  if (!box) throw new Error("the link has no box to point at");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(async () => {
    const before = await link.boundingBox();
    await page.waitForTimeout(300);
    expect(await link.boundingBox()).toEqual(before);
  }).toPass({ timeout: 5000 });
}

/** Finds the one picture shown and the area it fills. */
export async function pictureArea(page: Page): Promise<Area> {
  const picture = page.locator("svg:visible");
  await expect(picture).toHaveCount(1);
  const box = await picture.boundingBox();
  if (!box) throw new Error("the picture has no box");
  return box;
}

/** Returns part of the picture, given as shares of its size. */
export function partOf(picture: Area, [left, top, right, bottom]: readonly number[]): Area {
  return {
    x: picture.x + picture.width * left,
    y: picture.y + picture.height * top,
    width: picture.width * (right - left),
    height: picture.height * (bottom - top),
  };
}

/** Returns the share of an area painted in one paint. */
export async function shareOfPaint(page: Page, sheet: Page, area: Area, paint: Paint): Promise<number> {
  const shot = await page.screenshot({ clip: area });
  return sheet.evaluate(
    async ([encoded, wanted]) => {
      const picture = new Image();
      picture.src = `data:image/png;base64,${encoded}`;
      await picture.decode();
      const canvas = document.createElement("canvas");
      canvas.width = picture.width;
      canvas.height = picture.height;
      const brush = canvas.getContext("2d");
      if (!brush) throw new Error("the sheet cannot be drawn on");
      brush.drawImage(picture, 0, 0);
      const pixels = brush.getImageData(0, 0, canvas.width, canvas.height).data;
      const tests = {
        rust: (red: number, green: number, blue: number) => red > 110 && red > green * 1.5 && blue < 110,
        yellow: (red: number, green: number, blue: number) => red > 140 && green > red * 0.65 && blue < 100,
        cream: (red: number, green: number, blue: number) => red > 185 && green > 175 && blue > 110,
      };
      const colours = Array.from({ length: pixels.length / 4 }, (_, pixel) => pixels.subarray(pixel * 4, pixel * 4 + 3));
      const matches = colours.filter(([red, green, blue]) => tests[wanted](red, green, blue));
      return matches.length / colours.length;
    },
    [shot.toString("base64"), paint] as const,
  );
}
