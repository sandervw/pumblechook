---
name: handoff
description: Current project state, next work, parked questions, and gotchas. Use at the start of every session, and update it when the state or next work changes.
---

# Handoff

Current state and next work. Rewrite this file (`.claude/skills/handoff/SKILL.md`) when stale; never log history.

## State

- Planned, not built. The docs in `docs/` hold every decision; six `mvp` issues hold the work.
- No `package.json` yet. CI runs only the simple-code checks until the scaffold lands.
- The CEO is editing `docs/content.md` (loglines, bio, LinkedIn) and owes reference screenshots in `docs/reference/`.
- Image generation spend is approved up to $10, for the mockup issue only.

## Next

1. Issue 1, scaffold the project. Ask the CEO to connect Workers Builds once it merges.
2. Issue 2, art-method mockups, once the reference screenshots are in `docs/reference/`. Issue 3, words and links, can share its batch.
3. Issues 4 and 5, the wide and tall scenes. Each waits on its branch for the CEO's eye.
4. Issue 6, launch. Needs the CEO's yes for the domain, the redirects, and the public repository.

## Parked

- Sound.
- A page per project.
- A composition for tablets.

## Gotchas

- `gh pr merge` is blocked by `.claude/hooks/require_reviews.py` until the review PASS comments name the head commit. Re-review after every push. The hook also trips on any Bash command that merely contains that text.
- An unquoted `: ` in an agent `description` breaks loading. Agent, skill, and hook changes need a session restart.
- The blackbox-tester can run only what `.claude/project.json` allows. Escape backslashes in its `safeFlags` regexes as `\\`.
- `.astro` files get only the file-length check until the scaffold adds the Astro language pack.
- `docs/reference/` is gitignored; never commit or copy the book's pages.
