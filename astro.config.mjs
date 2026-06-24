// @ts-check
import { defineConfig } from "astro/config";

// Served from a GitHub Pages PROJECT path: https://gerrrt.github.io/dotfiles-web/
// `site` + `base` make all internal links and assets resolve under the subpath.
// If you later move to a custom domain or a user site (gerrrt.github.io), set
// `base: '/'` and update `site` accordingly.
export default defineConfig({
  site: "https://gerrrt.github.io",
  base: "/dotfiles-web",
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
});
