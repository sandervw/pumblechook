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
