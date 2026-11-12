# Architecture

Terms follow [the glossary](glossary.md). Sections 1 and 6 are binding; change them in the same PR as the code that needs it.

## 1. Contexts, shells, and boundaries

A functional core with adapter shells.

| Context (`core/`) | Owns |
|---|---|
| `portfolio/` (core domain) | The portfolio, its projects, loglines, links, and owner's mark, with their rules |

| Upstream | Downstream | What crosses |
|---|---|---|
| Portfolio | `site/` | `parsePortfolio` and the `Portfolio`, `Project`, `OwnerMark`, and `BrokenRule` types, from `core/portfolio/index.ts` |

A shell calls contexts in turn and passes plain values; it makes no rule of its own. A new arrow or a new context changes this section.

| Shell | Runs in | Imports | Does |
|---|---|---|---|
| `site/` | Node, at build time | Astro, core | Parses the content through core and prints the page as static HTML with both compositions |
| `site/scene/` | The visitor's browser | Browser APIs | Draws the pieces and runs the motion |

**Rules.** dependency-cruiser, configured in `.dependency-cruiser.cjs` and run with `npm run boundaries`, enforces the imports: core imports nothing outside `core/` and no package, a context imports no other context, shells import core only through its entry point, and `site/scene/` imports no core. It reads `.ts` files; the architecture reviewer holds `.astro` imports to the same rules. The `core/` block of `.claude/skills/simple-code/eslint.config.mjs` keeps core away from I/O, the clock, randomness, and global state. No `utils`, `helpers`, `manager`, `common`, or `data` modules.

## 2. Data flows

- **Build:** `site/content/portfolio.ts` holds the words and links from the content sheet. The page passes them to `parsePortfolio`; a broken rule fails the build. Astro prints `dist/`.
- **Deploy:** Workers Builds builds every push. `main` deploys to pumblechook.com; every other branch gets a Preview.
- **Visit:** the browser loads the page and the art for its composition. Every link is an anchor in the HTML. Scene scripts then start the motion.
- **Redirect:** redirect rules send every pumblechook.dev URL and `www.pumblechook.com` to `https://pumblechook.com`.
- **Analytics:** Cloudflare Web Analytics counts visits.

## 3. Domain model

- **Portfolio:** an owner's mark and an ordered list of exactly five uniquely named projects, one per arm. The order is the arm order and the keyboard order.
- **Project:** a name, a logline of one to 25 words, a live site link, and an optional repository link.
- **OwnerMark:** a name, a one-line bio, and profile links.
- Every link is an absolute `https` URL.

`parsePortfolio` returns a `Portfolio` or a list of `BrokenRule`.

## 4. Storage

No database and no visitor data. Words and art are files in git.

## 5. Interfaces

- `GET /` returns the scene. Any other path returns the same page.
- Project and profile links open in the same tab.
- With `prefers-reduced-motion: reduce`, nothing moves.
- `public/_headers` sets a Content Security Policy allowing the site's own files and the analytics beacon.

## 6. Folder layout

One folder per context, one public entry point each; the rest is private.

```
core/portfolio/        index.ts (entry), rules and types
site/                  Astro source folder
  pages/index.astro    the one page
  content/             the words and links
  compositions/        Wide.astro, Tall.astro
  scene/               pieces and motion scripts
  art/                 texture sheets and painted pieces
public/                _headers, fonts, icons
mockups/               art-method drafts, never deployed
tests/blackbox/        Playwright specs
tests/integration/     link checks
```

## 7. Security

- No accounts, forms, visitor input, or secrets. Workers Builds holds its deploy token inside Cloudflare.
- Previews are public.
- Security review covers `wrangler.jsonc`, `public/_headers`, `.github/`, and the `.claude/` hooks, settings, and `project.json`.
- Fonts and art are self-hosted. The only third-party script is the analytics beacon.

## 8. Risks

- **Agents cannot judge the look.** Art, motion, and wording wait on their branch for the CEO's yes on the Preview.
- **The art method is unproven.** Three mockups of one image spec, one per art method, go to the CEO; the chosen method is written here before the scene is built.
- **Painted art is heavy.** Each composition loads only its own art; the first load stays under 2 MB.
- **Likeness to the reference book.** No page, character, or composition is copied, traced, or given to an image model.