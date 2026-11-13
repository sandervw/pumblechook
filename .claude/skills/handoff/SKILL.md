---
name: handoff
description: Current project state, next work, parked questions, and gotchas. Use at the start of every session, and update it when the state or next work changes.
---

# Handoff

Current state and next work. Rewrite this file (`.claude/skills/handoff/SKILL.md`) when stale; never log history.

## State

- The scaffold is built. Astro prints one bare page from `site/`, and `core/portfolio/index.ts` holds the portfolio types. CI runs every command in `CLAUDE.md`.
- Five `mvp` issues hold the remaining work: 2 to 6.
- No `pumblechook` Worker exists in Cloudflare until the CEO imports the repository (see `docs/ceo-todo.md`).
- `docs/content.md` is signed off, and the reference screenshots are in `docs/reference/`.
- Image generation spend is approved up to $10, for the mockup issue only.

## Next

1. Issues 2 and 3 in one batch: the art-method mockups, and the words and links.
2. Issues 4 and 5, the wide and tall scenes. Each waits on its branch for the CEO's eye.
3. Issue 6, launch. Needs the CEO's yes for the domain, the redirects, and the public repository.

## Parked

- Sound.
- A page per project.
- A composition for tablets.

## Gotchas

- `gh pr merge` is blocked by `.claude/hooks/require_reviews.py` until the review PASS comments name the head commit. Re-review after every push. The hook also trips on any Bash command that merely contains that text.
- `.claude/hooks/trim_docs.py` blocks the first commit of any changed Markdown; reread the named docs, then commit again.
- An unquoted `: ` in an agent `description` breaks loading. Agent, skill, and hook changes need a session restart.
- The blackbox-tester can run only what `.claude/project.json` allows. Escape backslashes in its `safeFlags` regexes as `\\`.
- `npm run preview` runs `wrangler dev` on port 8787.
- `eslint-plugin-astro` stays at version 1 until the local Node reaches 24.16.
- `docs/reference/` is gitignored; never commit or copy the book's pages.
