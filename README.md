# getsmartai.ai — Ryan Garver

Personal portfolio for **Ryan Garver** (AI Enablement & Adoption). Live at
[getsmartai.ai](https://getsmartai.ai). Custom-built, not a template.

## Stack
- **[Astro 6](https://astro.build)** — static output (SSG), MPA with native cross-document View Transitions (`@view-transition` in CSS, no router component) for SPA-feel page wipes. Node >= 22.12.
- **Design system** — "Open Book": warm near-white ground, banker's burgundy accent, one hard-edged sun patch, ledger geometry; a single warm light theme (no dark mode). Hand-rolled CSS tokens in `src/styles/`, no CSS framework.
- **Fonts** — self-hosted latin-subset woff2: Familjen Grotesk (display + body) and Zilla Slab (slab labels + figures). In `public/fonts/`.
- **Motion** — zero-library `src/scripts/motion.ts`: rAF count-up (tally), IntersectionObserver + CSS `animation-timeline` reveals, a vanilla WebGL2 daylight field, magnetic CTAs. The home carries a desktop-only level-2 scroll immersion (gated). No third-party motion libs (the CSP blocks CDNs).
- **Chrome** — chapter rail (home), back-to-top, magnetic CTAs, copy-to-clipboard email, on-brand 404, native page-transition wipe. Full `prefers-reduced-motion` / no-JS / touch fallbacks (content is never gated on JS).

## Architecture
- `src/config/site.ts` — single source of truth for identity, email, links, domain.
- `src/config/work.ts` — typed `CaseStudy[]` registry driving the `/work` index, per-page meta, and "next project" cycling. Adding a case study = one array entry + one `src/pages/work/<slug>.astro` file rendered through `src/layouts/CaseStudy.astro`.

## Develop
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output -> dist/
npm run preview  # serve the build locally
```

## Deploy
Auto-deploys on every push to `main`: **Cloudflare Worker** static-assets deploy
(`wrangler.toml [assets]`, `not_found_handling = "404-page"`), not Cloudflare Pages.

> **Security headers / CSP live in a Cloudflare dashboard Transform Rule**, not the
> repo. `public/_headers` is a Pages-only feature and is **ignored** by this Worker
> deploy — it is kept as a non-authoritative spec with a warning banner. The strict
> CSP blocks all third-party origins, so everything (fonts, scripts, icons) is
> self-hosted or inline.

## Ship gate (before every push)
- `npm run build` green
- `rg "—|–" dist -g '!*.pdf'` = 0 (no stray em/en dashes in shipped prose)
- Real-browser verify after deploy: `document.fonts` all `loaded` (not `error`),
  zero console errors, links + mailto resolve. A `curl` 200 does **not** enforce CSP —
  only a browser does.
