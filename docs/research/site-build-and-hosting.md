# Site build and hosting

## Question

What builds the one page, and what serves it at pumblechook.com with pumblechook.dev redirecting?

## Recommendation

Astro builds static files; a Cloudflare Worker with static assets serves them; a redirect rule on the pumblechook.dev zone forwards to the .com. Astro is a printing press: it runs once at build time and ships plain HTML, so every link works before any script loads. Cloudflare already holds both domains, and static requests there are free.

## Comparison: build

| | Astro (static output) | Vite with plain TypeScript | Hand-written HTML |
|---|---|---|---|
| Fits the need | Page rendered from the project list at build time; components for the two compositions | Page drawn by script in the browser, or project list duplicated in HTML | Works for five projects; rules checked by eye |
| Connected libraries | Vite inside; TypeScript; any animation library | TypeScript; any animation library | None |
| Development flow | `astro dev` hot reload | `vite` hot reload | Reload by hand |
| Cost | Free | Free | Free |
| Maintenance and license | MIT; large team; version 6 current | MIT | Nothing to update |
| Reversibility | Medium: `.astro` templates are close to HTML | High | High |
| Rules out | Nothing needed here | Links in the HTML without script, unless duplicated | Build-time checks on loglines and links |

## Comparison: hosting

| | Workers static assets | Cloudflare Pages | GitHub Pages |
|---|---|---|---|
| Fits the need | Yes | Yes | Yes |
| Connected services | Both domains already in the account; per-branch preview URLs | Same account; branch previews | Needs DNS pointed away from Cloudflare features |
| Development flow | `wrangler deploy`; `wrangler preview` per branch | `wrangler pages deploy` | Push to a branch |
| Cost | Static requests free | Static requests free | Free |
| Maintenance | Where Cloudflare puts new work | Still works; no longer the focus | Stable |
| Reversibility | High: output is a folder of files | High | High |
| Rules out | Nothing | Newer Workers features | Preview URL per branch |

## Per option

**Astro**

- A fully static Astro site needs no adapter on Cloudflare: build, then `wrangler deploy` with `assets.directory` set to `./dist`. [Astro deploy guide](https://docs.astro.build/en/guides/deploy/cloudflare/).
- The simple-code checker covers `.ts` fully; `.astro` templates get the file-length check only, so logic stays in `.ts` files.
- The owner's Wordleaves project already uses Astro.

**Workers static assets**

- Cloudflare recommends Workers static assets over Pages for new projects. [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/).
- Requests for static assets are free. [Migrate from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/).
- Each branch can get a Preview URL; the free plan allows 100 Previews per Worker, and Preview URLs are public unless Cloudflare Access is added. [Previews](https://developers.cloudflare.com/workers/previews/).
- A Custom Domain matches one exact hostname, so `www` needs its own redirect. [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

**The .dev redirect**

- A Single Redirect rule on the pumblechook.dev zone forwards every URL to pumblechook.com. It needs a proxied DNS record on the source hostname; `192.0.2.0` or `100::` serves as the placeholder address. [Redirects](https://developers.cloudflare.com/rules/url-forwarding/), [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
- Redirect rule limits on the free plan were not checked; one or two rules are needed.

**GitHub Pages**

- No per-branch preview, which the CEO needs to review the look before a merge.
