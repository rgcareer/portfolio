# Green Light — design handoff (getsmartai.ai revamp)

**Status:** APPROVED at the M-gate feel-gate (Ryan, 2026-09-11). This is the design
authority for B2′ onward. It **supersedes the visual/token sections of
`revamp-handoff.md`** (The Shelf) — The Shelf is set aside, recoverable, not deleted.
The approved mockup lives at `/proto2` (commit `d5d26cc`, standalone, noindex). This
doc is the reference for porting that mockup into the real site.

Program authority (phases, IA, machinery, compliance): `~/.claude/plans/own-the-getsmartai-ai-website-idempotent-cascade.md`.

---

## 1 · Concept

**"Green Light."** Hiring this practice — or buying from it — is the green light a
business (or a hiring manager) has been waiting for. The site is a **deep-pine
editorial-marketing page where forest green is the voltage**: green key words, green
CTAs, green numbers, and one full-bleed green "proof" band. Plain-English voice; every
claim carries a real number. The one non-green accent is a **marker-yellow highlight**
used *only* on real evidence numbers — rare on purpose, so it reads as "look, an actual
measured result," never as decoration.

Lineage: this is the approved **N3 "The Highlighter"** direction pulled toward the
energy of **N1 "The Green Light"** after the feel-gate. What carried over from The
Highlighter: plain-English voice, the highlight-the-evidence idea, zero-library motion.
What changed at the feel-gate (Ryan's four notes, 2026-09-11): **pine ground** (not
stone/charcoal); **forest green exploded** to the dominant accent; **dropped the
editorial serif** (Newsreader) for a marketing display sans; **new logo** (the yellow-
swept "Smart" wordmark is retired).

**Register:** brand (design IS the product). Foundry dials as built: VAR 6 · MOT 6 · DEN 3.

**Dual audience, both served by the same page:**
- SMB owner / client — buys outcomes, distrusts hype and jargon. Green + plain English +
  real numbers reads premium and trustworthy.
- Recruiter / hiring manager — screens capability fast. The site itself (hand-built,
  fast, accessible, backend-having, zero JS bloat) is the proof; the "Hiring?" chip and
  role+outcome case lines are their fast path.

---

## 2 · Brand mark (the logo)

**Wordmark:** `get smart ai` — lowercase, Syne ~680 weight, tight tracking (-0.03em),
followed by a **flat forest-green disc** (the "green light") as a deliberate terminal
punctuation. Tagline `led by Ryan Garver` on a second line in Schibsted Grotesk.

- **Pure CSS, no image.** The disc is a `border-radius:50%` span (`.wm .disc`,
  `width/height: 0.34em`, `background: var(--go)`), so it scales and themes for free.
- Standalone mark (favicon / social): the green disc alone (flat, hard-edged, NO glow,
  NO blur — per N1). A `favicon.svg` = green disc on pine is a B2′ task.
- Accessibility: the visual wordmark is `aria-hidden`; the link/container carries an
  `aria-label="Get Smart AI, led by Ryan Garver"` (topbar) or an `.sr-only` "Get Smart
  AI" (footer). Keep this.
- **Open for iteration:** the disc is a strong v1 mark, not sacred. If a richer mark is
  wanted later, it must stay flat/hard-edged and green; do not add glow, gradient, or a
  monogram (the RG monogram is off the table — v3 legacy).

---

## 3 · Palette + tokens (exact, from `/proto2` `proto2.css`)

Pine is the **primary/default ground**. Values below are the ported target for the real
site's token layer. All pairs AA-verified in-browser (§7).

### Base `:root` (also the light "stone" fallback / alt theme)
```
--stone #EDEDEA  --stone-2 #E3E3DE  --paper #F7F7F4
--ink #191A1C    --ink-soft #45474A --ink-muted #64666A
--line #D6D6D0   --line-strong #C3C3BC
--marker #FFDE4D --marker-edge #F3CE2E     /* yellow evidence highlight */
--pine #123A2D   --pine-deep #0C2A20  --mist #ECF2ED  --go #43D07F
--action #177347 --action-ink #0F5836 --action-deep #0C4A2E   /* green on light */
--mark-ink #191A1C  --mark-h 46%  --mark-pos 86%   /* highlight = low felt-tip stroke on light */
```

### Pine theme = the default ground (`:root[data-theme="pine"]`, `color-scheme: dark`)
```
--stone #0F3327  --stone-2 #0B291F  --paper #164034   /* pine grounds */
--ink #EAF1EA    --ink-soft #B0C7BB --ink-muted #85A192
--line #24493B   --line-strong #356451
--mark-ink #17140E  --mark-h 1.12em  --mark-pos 50%   /* highlight = FULL glyph height on dark (readability fix) */
--go #5FE39A          /* luminous green: display key words + numbers on pine */
--action #2ECC77      /* bright green CTA fill */   --btn-text #06210F   /* near-black on the button */
--action-ink #6FE3A2  /* green links/text on pine */ --action-deep #25B268 /* CTA hover */
--band-bg #21C06C     /* THE green explosion: full-bleed proof band */
--band-ink #06210F    /* near-black ink on the bright band */  --band-muted #0A4227
```

**Green shade note (Ryan default):** the accents are bright emerald because that is how
green "explodes" on a dark pine ground (a true dark forest green would vanish). Ryan can
push **deeper/richer** or **brighter** at B2′ — it is a token tweak; re-run the AA table
after any shift.

**Yellow role (Ryan default):** keep the touch of yellow, evidence numbers ONLY. Do not
sprinkle it on headings. (Alternative Ryan floated: go 100% green, drop yellow — a
one-line change if he decides that at B2′.)

**Grounds:** pine is default. Charcoal/stone themes existed in the mockup only as a
proto compare switcher — **strip the switcher at B2′.** Keep the token architecture
(`:root` + `[data-theme]`) if a light theme is wanted later; otherwise pine-only is fine.

---

## 4 · Type

- **Display: Syne** (variable, 400–800; self-hosted `syne-latin-wght.woff2`, latin
  subset). Weights in use: hero **720**, section heads **660**, service names **640**,
  band claim **640**, verdict **640**. Tight tracking (−0.02 to −0.03em) at display sizes.
  Geometric, confident, a little odd-width = marketing, not editorial.
- **Body / UI: Schibsted Grotesk** (variable, 400–900; self-hosted
  `schibsted-grotesk-latin-wght.woff2`). Body 1.125rem / line-height 1.6; labels 500–580.
- **No serif anywhere.** Grotesk throughout — that is what killed the "too editorial"
  read. Do not reintroduce Newsreader/Cormorant/Source-Serif (all off the table here).
- **Scale (clamp):** `--fs-display: clamp(2.85rem,7.4vw,6.4rem)` · `--fs-h1:
  clamp(2.1rem,4.4vw,3.5rem)` · `--fs-h2: clamp(1.55rem,3vw,2.5rem)` · `--fs-lead:
  clamp(1.14rem,1.5vw,1.45rem)` · body 1.125rem · small .9375rem · eyebrow .8125rem.

---

## 5 · The two signature mechanics (must port verbatim in behavior)

### A · Green underline sweep — `.usweep` (primary emphasis motion)
Green key phrase whose underline **draws in** on entrance/scroll. Uses the same
background-tiling trick as the highlight so it survives wrapped lines:
```
.usweep { color: var(--go);
  background-image: linear-gradient(var(--go), var(--go));
  background-repeat: no-repeat; background-position: 0 100%;
  background-size: 100% calc(0.08em + 0.05em * var(--band-intensity));
  -webkit-box-decoration-break: clone; box-decoration-break: clone;
  padding-bottom: 0.04em; }
/* JS-armed sweep: background-size 0% -> 100% */
.js .usweep[data-sweep] { background-size: 0% ...; transition: background-size var(--sweep-dur) var(--ease-sweep); }
.js .usweep[data-sweep].is-swept { background-size: 100% ...; }
```
Used on hero key phrases ("pays for itself", "plain English").

### B · Yellow evidence highlight — `.mark` (rare, numbers only)
A felt-tip marker stroke behind ink text, **evidence numbers only**. Theme-aware height
is load-bearing (the readability fix): **dark grounds use full glyph height**
(`--mark-h: 1.12em; --mark-pos: 50%`) so no letter tops vanish into the dark; light uses
a low stroke (`46%/86%`). Tiles across wrapped lines via `box-decoration-break: clone`
on a `background-image` gradient (NOT an absolute pseudo-element — that breaks on wrap).
`--mark-ink` (dark) is the text color on yellow in every theme.

### C · Green key word — `.gw` (static emphasis, no motion)
`.gw { color: var(--go); }` — solid luminous-green words in headings, service outcomes,
verdict, close. The everyday emphasis mechanic; green leads, `.mark` is the rare accent.

**Discipline:** `.usweep` = hero moment; `.mark` = real numbers only; `.gw` = everything
else emphasized. Never yellow on a heading. Never green-behind-text (green-on-pine =
invisible; green is a TEXT color here, yellow is the only BEHIND-text highlight).

---

## 6 · Components (state tables — port these)

**Primary button `.btn`** — pill, Schibsted 580.
| state | fill | text | note |
|---|---|---|---|
| rest | `--action` #2ECC77 | `--btn-text` #06210F | 0.85em 1.5em, radius 999px |
| hover | `--action-deep` #25B268 | #06210F | + magnetic pull (pointer:fine only, ≤8px) |
| active | `--action-deep` | #06210F | translateY(1px) scale(.99) |
| focus | rest | rest | `:focus-visible` 2px `--action-ink` outline, offset 3px |
| coarse pointer | rest | rest | NO magnetic pull (`will-change:auto`) |

**Quiet link `.link-quiet`** — text + `--line-strong` underline; hover underline → `--ink`.
**Green link `.link-green` / `.hire`** — `--action-ink`; hover shows/keeps the green underline.
**Intake input `.intake input`** — `--paper` fill, 1.5px `--line-strong` border, radius 999px;
placeholder `--ink-muted`; focus border `--action-ink`. Native `<select>` for the intent
dropdown (mobile-first). Full-width single column < 560px.
**Nav (real site, B2′):** 7 items — Services · Work · Shop · Notes · Résumé · About ·
Contact — wordmark left. No hamburger (wrap rule). Pine ground, `--ink` links, `--go`
current/hover accent. Recreate the "Hiring for AI enablement? See the work" chip near the
top-right (recruiter fast path, `--action-ink` underline).

---

## 7 · Accessibility / AA (computed in-browser on `/proto2`, pine)

All real text pairs pass AA (≥4.5); large display pairs far exceed it.
| pair | ratio |
|---|---|
| hero h1 (#EAF1EA) on pine | 11.99 |
| green word `.gw`/`.usweep` (#5FE39A) on pine | 8.5 |
| lead (#B0C7BB) on pine | 7.7 |
| eyebrow/muted (#85A192) on pine | 4.93 |
| CTA text (#06210F) on `--action` green | 8.13 |
| band claim ink (#06210F) on band green | 7.16 |
| band muted label (#0A4227) on band green | 4.84 |
| verdict green / hire link on pine | 8.5 / 7.7 |
| yellow evidence `.mark` (dark text on #FFDE4D) | ≈11 (bg is a background-image; measure by eye/known value, not `getComputedStyle().backgroundColor`) |

Other gates held on the mockup: **console clean · 0px horizontal overflow at 390px ·
no-JS renders everything (highlights painted, blocks visible) · reduced-motion renders
instantly (no transitions) · keyboard focus visible.** Enforce all of these per surface.

---

## 8 · Motion (zero external libraries — this IS the brand)

Native scroll + CSS transitions + `IntersectionObserver` + a touch of WAAPI. **No GSAP,
no Lenis, no smooth-scroll hijack.** Runtime shape (from `proto2.ts`, to be rebuilt clean
as the real motion utility at B2′, dials/switcher stripped):
- reduced-motion / `data-reduce` guard first — if set, do nothing (CSS already shows all).
- hero entrance: reveal `[data-hero-in]` (opacity/translateY), then the "annotation pass"
  sweeps hero `.usweep[data-sweep]` after ~480ms.
- scroll reveals: `IntersectionObserver` adds `is-in` to `[data-in]` blocks and sweeps any
  marks they hold (staggered). No-IO fallback reveals all.
- magnetic primary buttons: pointer:fine only.
- **try/catch boot that reveals everything on error** — a motion bug must never hide
  content. Keep this fail-safe.
- No-FOUC: `.js` hides `[data-in]/[data-hero-in]` pre-reveal; `<noscript>` + no-JS show all.

---

## 9 · What B2′ builds (and the fast path to "let Ryan look")

Ryan's ask at this gate was literally "let's take a look at how it looks" — so the
**first milestone in the fresh session is the real HOME rendered in Green Light**, then
screenshot + gate, before the deeper machinery.

- **System/shell:** port the tokens above into the real token layer (replace dark-v3 in
  `BaseLayout.astro` / global styles); self-host Syne + Schibsted; real nav(7) + footer;
  the clean zero-library motion utility (WAAPI sweep/entrance + shared reduced-motion
  branch); 404 ("empty" per contract, restyled Green Light); marketing components
  (green-word headings, `.usweep`, `.mark`, pine/green band, service rows, product cards,
  intake form styles). Strip the proto dials + ground switcher.
- **Home:** the mockup's five beats become the real home — annotation-pass hero → services
  teaser (published prices, green outcomes) → full-bleed green proof band → annotated
  casebook teaser → inline intake close. Migrate `/proto2` copy; pull services/prices from
  the plan §3.3; pull the flagship object from `src/pages/proto/_data.ts` (single source).
- **Screenshot the real home (desktop + 390px), gate with Ryan.** THEN continue to the
  Worker/forms machinery (that is B3′ in the plan; do not block the first look on it).

**Defer (not B2′):** the Cloudflare Worker + intake/subscribe/counter/redirects (B3′,
needs Ryan's KV/ESP/email gate); `/work` casebook + case studies (B4′); services/shop/
legal pages (B5′). Do NOT build fake form backends — the intake form is styled/markup only
until the Worker phase.

---

## 10 · Do NOT invent (leave to no implementer's taste)

- No serif. No Newsreader/Cormorant/Source-Serif/Fraunces. Syne + Schibsted only.
- No yellow on headings; `.mark` = real numbers only. No green *behind* text.
- No third-party JS/CSS/fonts/assets — dashboard CSP blocks all third-party origins
  browser-side. Self-hosted, inline, same-origin only. No GSAP/Lenis.
- No glow/blur/gradient on the disc or anywhere (foundry: no gradient text, no AI-purple).
- No em-dashes or en-dashes anywhere (`rg "—|–" dist/` must be 0). Hyphen/comma/colon/
  parens/line-break instead.
- No dashboard/stat-card grids for numbers — numbers live INSIDE sentences.
- No echoes of the four prior builds (see design-memory OFF THE TABLE) or The Shelf's
  showroom-white / Cormorant / objects-on-shelves world.
- Mobile is a hard gate on every surface: 0 overflow at 375/390, ≥44px targets, ≥16px
  body, native select for the intent dropdown.

---

## 11 · Files (mockup reference → real targets)

- `src/pages/proto2.astro` · `src/layouts/Proto2Layout.astro` · `src/styles/proto2.css` ·
  `src/scripts/proto2.ts` — the approved mockup (commit `d5d26cc`). Reference, then port;
  `/proto` + `/proto2` are both deleted at B4′ per the plan.
- Fonts vendored: `public/fonts/syne-latin-wght.woff2`,
  `public/fonts/schibsted-grotesk-latin-wght.woff2`.
- Real shell to port INTO: `src/layouts/BaseLayout.astro`, the global stylesheet,
  `src/config/site.ts` (nav), `src/pages/index.astro`, `astro.config.*` (sitemap filter
  already excludes `/proto`).
