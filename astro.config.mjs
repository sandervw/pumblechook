// Astro prints the one page from site/ into dist/.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://pumblechook.com",
  srcDir: "./site",
  output: "static",
});
