# Use cases

Black-box test script for Pumblechook. A tester needs only a browser, the content sheet (`docs/content.md`), and this folder. Every use case is written from the actor's side: what they do, and what they see or get back. UC IDs are stable; never renumber them.

Each use case reads: `**UC-NN Title.** Steps: ... Expected: ...`

Actors: **Visitor** (anyone with a browser; no account, no sign-in).

Words used here: the **scene** is the whole picture; the **creature** is its central sea animal; an **arm** is one of its limbs; a **dweller** is any smaller animal in the scene; **reaching an arm** means pointing at it with a mouse, tapping it, or moving keyboard focus to it. A **desktop window** is 1280 by 800; a **phone screen** is 390 by 844.

| Area | File | UC IDs |
|---|---|---|
| Visiting | [visiting.md](visiting.md) | UC-01 to UC-08, UC-17 |
| Motion | [motion.md](motion.md) | UC-09 to UC-11, UC-16 |
| Access | [access.md](access.md) | UC-12 to UC-15 |

UC-08 runs against the live site only. Every other use case runs against a local build.

## Not covered

- Whether the scene looks painted, textured, and uneven, and whether any surface is flat colour. The CEO judges this on the Preview.
- Whether the motion feels right. The CEO judges this on the Preview.
- Whether every link answers without a sign-in. The integration test in `tests/integration/` covers it.
- Visit counting. The visitor cannot observe it.
