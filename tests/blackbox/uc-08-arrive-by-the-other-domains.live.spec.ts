import { expect, test } from "@playwright/test";
import { pictureArea } from "./support/visitor";

const HOME = "https://pumblechook.com/";
const OTHER_ADDRESSES = ["https://pumblechook.dev", "https://pumblechook.dev/anything", "https://www.pumblechook.com"];

for (const address of OTHER_ADDRESSES) {
  test(`UC-08 ${address} lands on pumblechook.com`, async ({ page }) => {
    await page.goto(address);

    await expect(page).toHaveURL(HOME);
    await expect(page).toHaveTitle("Pumblechook");
    await pictureArea(page);
  });
}
