---
name: handoff
description: Current project state, next work, parked questions, and gotchas. Use at the start of every session, and update it when the state or next work changes.
---

# Handoff

Current state and next work. Rewrite this file (`.claude/skills/handoff/SKILL.md`) when stale; never log history.

## State

- The page prints both compositions, `site/compositions/Wide.astro` and `Tall.astro`; CSS shows the tall one on screens narrower than 9:10, and only the shown one moves. The build prints every piece, name, logline, and link into static HTML; the scripts in `site/scene/` only move them. CI runs every command in `CLAUDE.md`.
- The CEO signed off the wide scene's look and motion, with every logline always visible, and the tall scene, which shows no loglines. Every `mvp` issue is closed.
- The fonts are Grenze Gotisch SemiBold for names, IM Fell DW Pica for sentences, and Yellowtail for tattoos, hosted in `public/fonts/`.
- The site is live at pumblechook.com, a Custom Domain on the `pumblechook` Worker, with Preview builds on. Redirect rules and proxied `100::` placeholder records send pumblechook.dev, its subdomains, and `www.pumblechook.com` to `https://pumblechook.com/`. Web Analytics injects its beacon automatically. 0-RTT is on for the pumblechook.com zone. The repository is public: code under MIT (`LICENSE-CODE`), art and wording all rights reserved (`LICENSE`).
- The scene's pieces and layouts are in `docs/image-spec.md`; the art method is in `docs/architecture.md`, section 9. In `.claude/launch.json`, `site` runs `astro dev` on port 4321 and `built` runs `npm run preview` on port 8787.
- `docs/content.md` is signed off, and the reference screenshots are in `docs/reference/`.
- Image generation spend is approved up to $10 for the look-adjustments batch (body, weed, bone).

## Next

Nothing is planned. New work starts from the CEO.

## Parked

- Sound.
- A page per project.
- A composition for tablets.

## Gotchas

- `gh pr merge` is blocked by `.claude/hooks/require_reviews.py` until the review PASS comments name the head commit. Re-review after every push. The hook also trips on any Bash command that merely contains that text.
- `.claude/hooks/trim_docs.py` blocks the first commit of any changed Markdown; reread the named docs, then commit again.
- An unquoted `: ` in an agent `description` breaks loading. Agent, skill, and hook changes need a session restart.
- The blackbox-tester can run only what `.claude/project.json` allows. Escape backslashes in its `safeFlags` regexes as `\\`. In a worktree it can neither write specs nor report; run it from the main checkout.
- A missing path under `/_astro/` or `/fonts/` answers with the page and carries their week-long cache header; keep that lifetime short.
- `npm run preview` runs `wrangler dev` on port 8787. It serves nothing after `npm run build` empties `dist/`; restart it after every build.
- The Browser pane pauses all motion while hidden; check motion with a Playwright script instead.
- Arms never hold still, so Playwright's `hover()` and `click()` stall on an arm's link. Reach the arm first with the helper in `tests/blackbox/support/visitor.ts`.
- Chrome reports a wrong box for an `<a>` inside a `<textPath>`; give every link its own `<text>`.
- `eslint-plugin-astro` stays at version 1 until the local Node reaches 24.16.
- `docs/reference/` is gitignored; never commit or copy the book's pages.
- The `image` skill's model rejects every prompt that names Lane Smith; use the prompt wording in `docs/image-spec.md`.
- The image model takes our own images as `input_references`. It ignores `background: transparent`: paint each piece on a plain flat white ground and cut it out. It refuses about seven or more requests at once.
- Chrome paints nothing from defs inside a hidden SVG. Each composition keeps its own defs, and every id starts with the composition's name.
- `getByText` also finds the hidden composition's words; add `.filter({ visible: true })`.
- A Preview answers a plain request for an unknown path with 404; a browser's navigation gets the page.
