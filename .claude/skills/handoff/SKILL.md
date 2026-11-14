---
name: handoff
description: Current project state, next work, parked questions, and gotchas. Use at the start of every session, and update it when the state or next work changes.
---

# Handoff

Current state and next work. Rewrite this file (`.claude/skills/handoff/SKILL.md`) when stale; never log history.

## State

- The page is the wide scene, `site/compositions/Wide.astro`. The build prints every piece, name, logline, and link into static HTML; the scripts in `site/scene/` only move them. CI runs every command in `CLAUDE.md`.
- The CEO signed off the wide scene's look and motion, with every logline always visible. Two `mvp` issues remain: 5 and 6.
- The fonts are Grenze Gotisch SemiBold for names, IM Fell DW Pica for sentences, and Yellowtail for tattoos, hosted in `public/fonts/`.
- The `pumblechook` Worker exists in Cloudflare, with Preview builds on.
- The wide layout is signed off: a kraken in the upper-left corner, with each project's text running along an arm. See `mockups/wide-wireframe.png` and `mockups/image-spec.md`.
- The look of the wide scene is signed off in `mockups/cut-paper/`: cut-paper arms and eyes over painted pieces. The art method is in `docs/architecture.md`, section 9. `mockups/painted-pieces/` is the losing draft. The `mockups` entry in `.claude/launch.json` serves the repository; open `/mockups/cut-paper/`. The `site` entry runs `astro dev` on port 4321.
- `docs/content.md` is signed off, and the reference screenshots are in `docs/reference/`.
- Image generation spend is approved up to $10 for the look-adjustments batch (body, weed, bone).

## Next

1. Issue 5, the tall scene. It waits on its branch for the CEO's eye.
2. Issue 6, launch. Needs the CEO's yes for the domain, the redirects, and the public repository.

## Parked

- Sound.
- A page per project.
- A composition for tablets.

## Gotchas

- `gh pr merge` is blocked by `.claude/hooks/require_reviews.py` until the review PASS comments name the head commit. Re-review after every push. The hook also trips on any Bash command that merely contains that text.
- `.claude/hooks/trim_docs.py` blocks the first commit of any changed Markdown; reread the named docs, then commit again.
- An unquoted `: ` in an agent `description` breaks loading. Agent, skill, and hook changes need a session restart.
- The blackbox-tester can run only what `.claude/project.json` allows. Escape backslashes in its `safeFlags` regexes as `\\`. In a worktree it can neither write specs nor report; run it from the main checkout.
- `npm run preview` runs `wrangler dev` on port 8787. It serves nothing after `npm run build` empties `dist/`; restart it after every build.
- The Browser pane pauses all motion while hidden; check motion with a Playwright script instead.
- Arms never hold still, so Playwright's `hover()` and `click()` stall on an arm's link. Reach the arm first with the helper in `tests/blackbox/support/visitor.ts`.
- Chrome reports a wrong box for an `<a>` inside a `<textPath>`; give every link its own `<text>`.
- `eslint-plugin-astro` stays at version 1 until the local Node reaches 24.16.
- `docs/reference/` is gitignored; never commit or copy the book's pages.
- The `image` skill's model rejects every prompt that names Lane Smith; use the prompt wording in `mockups/image-spec.md`.
- The image model takes our own images as `input_references`. It ignores `background: transparent`: paint each piece on a plain flat white ground and cut it out. It refuses about seven or more requests at once.
- A Preview answers a plain request for an unknown path with 404; a browser's navigation gets the page.
