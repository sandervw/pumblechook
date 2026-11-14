# Pumblechook

A one-page portfolio painted like a picture-book collage: a deep-sea diver's dream with one central sea creature and a project on each of five arms.

**[pumblechook.com](https://pumblechook.com)**

## What it shows

Five projects, each with a logline and a link to its live site, plus a link to its repository when that is public. The owner's name and profile link sit inside the picture.

## How it is built

- [Astro](https://astro.build/) prints the page as static HTML.
- [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) serves it.
- The scene is drawn and animated in the browser; every link works with scripts off and with motion off.

## Develop

Needs Node 24 and Python 3.10 or newer.

```bash
npm ci
npm run dev
```

| Task | Command |
|---|---|
| Build | `npm run build` |
| Black-box tests | `npx playwright test` |
| Integration tests | `npm run test:integration` |
| Boundary check | `npm run boundaries` |
| Simple-code checks | `python .claude/skills/simple-code/scripts/check_code.py .` |

## Docs

- [Vision](docs/vision.md)
- [Architecture](docs/architecture.md)
- [Glossary](docs/glossary.md)
- [Content sheet](docs/content.md)
- [Use cases](docs/use-cases/README.md)
