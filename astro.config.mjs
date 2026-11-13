import { defineConfig } from "astro/config";

/** Astro prints the one page from site/ into dist/. */
export default defineConfig({
  site: "https://pumblechook.com",
  srcDir: "./site",
  output: "static",
});
