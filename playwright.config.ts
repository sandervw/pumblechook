import { defineConfig } from "@playwright/test";

const LOCAL_ADDRESS = "http://localhost:8787";
const LIVE_SPECS = "**/*.live.spec.ts";

/** Black-box tests: local runs the built site, live runs production. */
export default defineConfig({
  testDir: "tests/blackbox",
  forbidOnly: Boolean(process.env.CI),
  reporter: "list",
  projects: [
    { name: "local", testIgnore: LIVE_SPECS, use: { baseURL: LOCAL_ADDRESS } },
    { name: "live", testMatch: LIVE_SPECS, use: { baseURL: "https://pumblechook.com" } },
  ],
  webServer: {
    command: "npm run preview",
    url: LOCAL_ADDRESS,
    reuseExistingServer: !process.env.CI,
  },
});
