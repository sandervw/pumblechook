import { expect, test } from "@playwright/test";

test("UC-17 robots.txt lets every crawler in and names the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  const body = await response.text();
  expect(body).toContain("User-agent: *");
  expect(body).not.toMatch(/Disallow: \S/);
  expect(body).toContain("Sitemap: https://pumblechook.com/sitemap.xml");
});

test("UC-17 sitemap.xml lists the one page", async ({ request }) => {
  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");
  const body = await response.text();
  expect(body.match(/<loc>[^<]*<\/loc>/g)).toEqual(["<loc>https://pumblechook.com/</loc>"]);
});
