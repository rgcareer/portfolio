# getsmartai.ai Revamp: "The Shelf" — Implementation Brief

Date: 2026-09-09 · Direction: **The Shelf** (approved 2026-09-09 by Ryan, see `design-memory.md`) · Register: **brand** (brand-experimental sub-register, MOT 9)

Program plan (phases, budgets, gates): `~/.claude/plans/own-the-portfolio-site-project-cosmic-bubble.md`. This brief is the design contract for phases B1 to B6. Build engine: foundry (`immerse`, `heroes`, `transitions`, cookbook). Executes on Opus 4.8; Sonnet only for scoped migration mechanics in B4.

## 1. Direction summary
- **Concept (one sentence):** A bright showroom where every project is a physical object on a long shelf, framed with its recorded demo and an engraved plaque of verified numbers; the shelf pans sideways as you scroll.
- **Emotional target:** "This person has actually built a lot, and every claim has a number on it." Impressed, then trusting. A hiring manager should feel they are walking a stocked boutique, not a demo reel; a small-business owner should feel this is a professional they could hire.
- **Signature element (protect it):** the panning shelf of objects with engraved plaques, sectioned by lane. Secondary signature: the before/after plaque flip. Nothing types, nothing assembles, nothing glows, no console chrome, no HUD, no custom cursor.
- **Rotation contract:** this direction must never drift toward the three prior builds (green/black console; bone-paper manual; ink/orange immersion). See `design-memory.md` for the off-the-table list.

## 2. Design tokens
```css
:root {
  /* color roles (light, single theme by design: the showroom is lit) */
  --bg: #F7F8FA;            /* showroom white */
  --surface: #FFFFFF;       /* object frames, plaques */
  --surface-2: #EEF0F3;     /* shelf face, recessed panels */
  --line: #D9DDE3;          /* hairlines */
  --shadow-1: 0 1px 2px rgba(21,23,27,.06);
  --shadow-2: 0 12px 32px rgba(21,23,27,.10);   /* max 2 shadow levels */
  --text: #15171B;          /* ink */
  --text-muted: #5B606A;    /* AA on --bg: ~6.4:1 */
  --text-faint: #6F747E;    /* AA on --bg and --surface: ~4.9:1, labels only */

  /* object chips: FILL value + TEXT value (text variants are the only chip values used for type) */
  --chip-cobalt: #2456D6;    --chip-cobalt-text: #1A3FA6;
  --chip-vermilion: #D9441F; --chip-vermilion-text: #A8331A;
  --chip-moss: #3E7A3A;      --chip-moss-text: #2F5E2C;
  --chip-mustard: #D6A419;   --chip-mustard-text: #7A5A05;
  --chip-plum: #6B3A8C;      --chip-plum-text: #5A2F77;
  --accent: var(--chip-cobalt);            /* CTA fill */
  --accent-contrast: #FFFFFF;             /* text on --accent, verify AA in-browser (target >= 4.5:1) */
  --ok: #2F5E2C; --warn: #7A5A05; --danger: #A8331A;

  /* type */
  --font-display: 'Cormorant Garamond', 'Cormorant SC', Georgia, serif;   /* engraved smallcaps voice */
  --font-body: 'Source Serif 4', Georgia, 'Times New Roman', serif;        /* humanist serif text */
  --font-mono: none;   /* deliberately absent: mono was the voice of all three prior builds */
  --track-engraved: 0.22em;   /* letterspacing for smallcaps labels */

  /* scale */
  --fs-display: clamp(2.8rem, 7vw, 6.5rem);
  --fs-h1: clamp(2.2rem, 4.5vw, 3.6rem);
  --fs-h2: clamp(1.5rem, 2.6vw, 2.2rem);
  --fs-plaque: 0.8rem;       /* engraved labels, smallcaps, tracked */
  --fs-body: 1.125rem;       /* 18px; never below 16px */
  --fs-small: 0.9375rem;     /* 15px, non-body meta only */

  /* spacing: 4 8 12 16 24 32 48 64 96 128 */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px;
  --space-8: 32px; --space-12: 48px; --space-16: 64px; --space-24: 96px; --space-32: 128px;
  --container: 1280px; --gutter: clamp(1.25rem, 4vw, 3.5rem);
  --radius: 4px; --radius-frame: 8px;   /* frames only; plaques are square */

  /* motion (see §7) */
  --dur-fast: 160ms; --dur-base: 320ms; --dur-slow: 640ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-settle: cubic-bezier(0.34, 1.56, 0.64, 1);   /* the ONE spring, objects only */
}
```
Dark mode: **single-theme by design**: the showroom is lit; `color-scheme: light`. Reduced-transparency and forced-colors: frames keep borders (`--line`) so structure survives.
Fonts: self-hosted variable woff2 in `public/fonts/`, latin subset, `font-display: swap`, preloaded. Faces are specified here; B2 may swap ONLY within the same voice (true smallcaps serif display, humanist serif text) with Ryan's OK.

## 3. Layout rules
- **Grid:** 12-col fluid inside `--container`; shelves break out full-bleed. Objects sit on a shelf track with `--space-12` gaps; object widths by tier: flagship 560px, standard 400px, specimen 320px (desktop), all `max-width: 100%`.
- **Section rhythm:** `--space-24` between sections desktop, `--space-16` mobile; shelves are pinned scenes and carry their own internal rhythm.
- **Hero pattern:** editorial statement over the FIRST shelf edge (the shelf is visible from the first paint): display line ≤ 2 lines, one sentence of body, one primary CTA + one quiet link. ≤ 4 text elements. No scrim, no video, no canvas.
- **Density dial:** DEN 3 (airy). Plaques are the only dense element and stay ≤ 4 lines. Catalogue page (/work) may rise to DEN 5 with a list view.
- **Shelf sections (home, in order):** Adoption & enablement · Evaluation & trust · Agents & MCP · Operations & pipelines. Each shelf: 2 to 4 objects, ≤ 4 viewport widths of track.

## 4. Component specs
- **Shelf** — anatomy: section heading (engraved smallcaps lane name + one-line body), pinned viewport, horizontal track of Objects, shelf face (`--surface-2` band under objects), progress rule (thin `--line` bar that fills as the track pans). Variants: home (pinned pan), catalogue (vertical list, no pan), consulting ("what I build for businesses"). Content rules: lane name ≤ 3 words; ≤ 4 objects per shelf; track ≤ 4vw.
  States: default (objects settled) / hover (n/a) / focus-visible (focus ring on the focused Object; track scrolls the focused Object into view) / active (n/a) / disabled (n/a) / loading (poster images only, no skeleton) / empty (never rendered empty; a lane with 0 objects is omitted at build) / error (n/a).
- **Object** — anatomy: frame (`--surface`, `--radius-frame`, `--shadow-1`, rises to `--shadow-2` on hover), media (recorded demo `<video>` poster-first or a specimen plate for headless tools), chip (24px circle, the object's color), Plaque. Variants: flagship / standard / specimen. Content rules: media 16:10; video ≤ 8s loop, muted, `playsinline`, poster is the LCP candidate on first shelf; specimen plate = up to 6 lines of real output text, never a fake screenshot.
  States: default / hover (frame lifts 4px, shadow-2, chip glows to its text variant, cursor-proximity light shift on the frame highlight) / focus-visible (2px `--accent` ring, 3px offset, plus the hover lift) / active (lift returns to 0 over --dur-fast) / disabled (n/a) / loading (poster shown, video swaps in when `canplay`) / empty (n/a) / error (video fails → poster stays, no message).
- **Plaque** — anatomy: engraved title (smallcaps, tracked), one line of role/year, up to 3 verified metrics (`label value` pairs), a "Case study" link. Content rules: metrics come from `work.ts`; a placeholder-shaped value fails the build (existing econ-table regex idiom).
  States: default / hover (title tracks out by 0.02em) / focus-visible (ring on the link only) / active / disabled / loading / empty (a Plaque with 0 metrics renders title + link only) / error (n/a).
- **PlaqueFlip** — anatomy: a two-face panel inside the Plaque: face A "The default way" (2 lines), face B "The built way" (2 lines), a 24px+ toggle button labeled "Flip". Behavior: click/Enter/Space flips; both faces are in the DOM; `aria-pressed` on the button; the hidden face is `inert`. Content rules: each face ≤ 140 characters, real copy from `work.ts` (`flip: {before, after}`), objects without flip copy render no toggle.
  States: default (face A) / hover (button underline) / focus-visible (ring) / active (flip runs) / disabled (n/a) / loading (n/a) / empty (no flip copy → component absent) / error (n/a).
- **VisitorPlaque** — anatomy: a wall plaque near the contact section: "Visitors since launch" + number. Data: `GET /api/stats`; renders **nothing** until a real number arrives (fetch error or 0 → element absent, not "0", not a dash). Number formatted with thousands separators.
  States: default (number) / hover (n/a) / focus (n/a) / loading (absent) / empty (absent) / error (absent).
- **Nav** — anatomy: wordmark "Ryan Garver" (engraved smallcaps), links Work · Notes · About · Résumé · Contact, a "Consulting" quiet link in the footer only (not primary nav). Sticky, `--bg` with hairline. `aria-current="page"`. Targets ≥ 24×24 CSS px; ≥ 44px on touch.
  States: default / hover (underline grows from left, --dur-fast) / focus-visible (ring) / active (n/a) / current (underline persistent, weight unchanged) / mobile (single row that wraps; no hamburger, no JS dependency).
- **Button** — variants: primary (`--accent` fill, `--accent-contrast` text), quiet (text link with engraved underline). Magnetic on pointer:fine only (≤ 12px pull, MOT ≥ 6 recipe).
  States: default / hover (primary darkens to `--chip-cobalt-text`; quiet underline thickens) / focus-visible (ring) / active (scale .98) / disabled (never used on marketing surfaces) / loading (n/a).
- **Preloader (composed opening)** — anatomy: showroom curtain in `--bg`, the wordmark, a thin rule that fills as fonts and first-shelf posters decode. Gates (heroes.md): masks real work only; ≤ 2.5s uncached, sessionStorage skip ≤ 400ms; hero text is in the DOM from first paint; never a spinner; reduced motion resolves instantly; `<noscript>` hides it.
  States: default (running) / done (curtain lifts with the ease-out family while the hero entrance begins) / skipped (repeat visit) / reduced (absent).
- **CaseStudy header** — anatomy: the Object's frame arrives via shared-element view transition (`transition:name` = slug) and becomes the page header; Plaque expands into the metrics block; lane chip persists. Existing sticky meta rail pattern is retired.
  States: default / transition (450ms cross-doc) / no-VT-support (instant swap).
- **LaneFilter (/work)** — anatomy: 4 lane toggles + "All"; filters the catalogue list without page reload; state in URL hash. Targets ≥ 24px.
  States: default / hover / focus-visible / active (pressed, chip-filled) / empty (a lane with no objects shows "Nothing stocked in this lane yet.").
- **404 slot** — anatomy: one empty Object frame on a shelf with a Plaque reading "This slot is empty." and two links (Back to the shelf · See the work). Served at 404 status (wrangler `not_found_handling` stays).

## 5. Responsive matrix
| Breakpoint | What changes |
|---|---|
| ≤640 | Shelves are vertical stacks (no pan, no pin); objects full-width; plaque flip button ≥ 44px; nav wraps to one full row; hero display type at the clamp floor; video posters only until tap; no cursor effects; touch scroll-snap on the catalogue strip only |
| 641–1024 | Vertical shelves persist up to 860px; from 861px the pan engages with 2 objects visible per viewport; nav single row; container gutters grow |
| >1024 | Full showroom: pinned pan, 2.5 to 3 objects per viewport, cursor-proximity light, magnetic CTAs, spring settle, shared-element transitions |

## 6. Accessibility requirements
- **Contrast pairs (AA at text sizes; verify every one in-browser at B2, on-paper estimates in parentheses):** `--text` on `--bg` (≈16:1) · `--text` on `--surface` (≈17:1) · `--text-muted` on `--bg` (≈6.4:1) · `--text-faint` on `--surface-2` (≈4.6:1, labels only) · `--accent-contrast` on `--accent` (≈5.8:1) · each `--chip-*-text` on `--surface` (cobalt ≈7.3, vermilion ≈5.2, moss ≈6.6, mustard ≈5.8, plum ≈7.6). Chip FILL values are never used for text.
- **Focus:** `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }` sitewide; inside a chip-colored surface the ring uses `--text`. Never `outline: none` without replacement.
- **Targets:** ≥ 24×24 CSS px everywhere (WCAG 2.2 2.5.8); ≥ 44px on touch surfaces. Body ≥ 18px; nothing under 15px; plaque labels 12.8px are smallcaps with 0.22em tracking and are decorative duplicates of accessible text? **No: plaque labels are the accessible text**, so they render at 0.8rem = 12.8px only for the tracked smallcaps label line and always pair with an 18px value line. Screen-reader name of an Object = plaque title.
- **Focus not obscured (2.4.11):** sticky nav height is exposed as `--nav-h`; every focusable and every anchor target gets `scroll-margin-top: calc(var(--nav-h) + 16px)`; Lenis anchor offset uses the same value.
- **Horizontal pan:** keyboard Tab moves between Objects and scrolls the track; Arrow keys inside a shelf move object-to-object; the page root never scrolls horizontally (`scrollWidth <= clientWidth` asserted at every breakpoint); a "Skip this shelf" link precedes each pinned shelf.
- **prefers-reduced-motion:** pans become vertical stacks, springs and lifts become none, plaque flip is an instant swap, preloader resolves instantly, Lenis is destroyed, view transitions fall back to instant, cursor-proximity light disabled, sound toggle hidden. Same content, theater removed. One shared branch gates everything.
- **No-JS:** the vertical showroom renders completely; flip shows both faces stacked; video shows posters.
- **Landmarks:** `header > nav`, `main`, one `h1` per page, shelves are `section` with `aria-labelledby` the lane heading, footer `contentinfo`. Skip link first in DOM.
- **Media:** every video has a poster and an `aria-label` describing the demo; no autoplay with sound, ever.

## 7. Motion spec
- **Composed opening (why: masks font + first-shelf poster decode, and it is the brand entrance):** rule fills with real progress → curtain lifts 600ms `--ease-out` → hero entrance starts 200ms before the curtain clears: display line 600ms, structure (shelf edge, rule) +240ms, meta staggers 80ms apart. One timeline. Reduced: absent.
- **Shelf pan (why: the shelf's geometry reads left to right; it is the one thesis pin per page):** pinned wrapper translates the track with `scrub: true` (no easing; scroll is the timeline), ≤ 4 viewport widths, one ScrollTrigger per shelf, never two triggers on the pinned element. Reduced/≤860px: no pin, vertical stack.
- **Object settle (why: objects are physical; they land):** on shelf enter, objects translate up 24px → 0 with `--ease-settle` 500ms, stagger 90ms; the ONE spring on the page class. Reduced: none.
- **Plaque engrave (why: the label is carved):** split-text characters fade in with a 12ms stagger, 450ms total. Reduced: none.
- **Cursor-proximity light (why: the object is under a lamp):** frame highlight lerps 0.15 per frame toward the pointer; pointer:fine only; no OS-cursor replacement. Reduced/touch: absent.
- **Hover lift:** 4px translate + shadow-2, `--dur-base`. **Magnetic CTA:** ≤ 12px pull, `--dur-base`, pointer:fine only.
- **Plaque flip:** 3D flip 400ms `--ease-out` with both faces in DOM. Reduced: instant.
- **Shared-element route transition:** Object frame → case-study header, 450ms; Astro `<ClientRouter>` + `transition:name`; scroll restored to top; focus moved to the `h1`. No wipe, no cover.
- **What never animates:** body text, nav, plaques' metric values (no count-ups), the visitor number (no count-up: it is a fact, not a flourish), backgrounds.
- **Infrastructure:** Lenis under the Single Ticker Lock (gsap ticker drives Lenis; `lagSmoothing(0)`); `lenis.destroy()` under reduced motion; motion JS ≤ 90KB gz.
- **Sound (dial, default off):** optional room-tone toggle in the footer, persistent, honest label "Sound off"; dies under reduced motion. Decide keep/drop at B1.

## 8. Content & copy
- **Voice:** plain, specific, unhurried; forbidden tone: salesy hype. No em/en dashes anywhere. No "not X but Y". No rule-of-three padding. Evidence over assertion: every claim carries a number or a link.
- **Identity:** root pages use "Ryan Garver"; /consulting uses "Ryan" only, with E-E-A-T anchored on Smart Business AI LLC.
- **Hero (home):** display line "Everything I have built, with the numbers on the plaque." · body "I help teams adopt AI, and I build a lot of it myself. Each object on these shelves is a real tool with real results." · primary CTA "Walk the shelves" (scrolls to shelf 1) · quiet link "Read the résumé".
- **Shelf headings:** "Adoption & enablement" · "Evaluation & trust" · "Agents & MCP" · "Operations & pipelines"; one line of body each, written in B3 from the lane's objects.
- **Plaque link:** "Case study". **Flip button:** "Flip". **Flip faces:** written per object in `work.ts` (`flip.before`, `flip.after`), ≤ 140 characters each.
- **Visitor plaque:** "Visitors since launch" + number. **404:** "This slot is empty." + "The object you asked for was never stocked here." · links "Back to the shelf" · "See the work".
- **Consulting hero:** "Smart Business AI" · "Practical AI adoption for teams without an engineering department." · principal line "Led by Ryan" (first name only).
- **Empty lane (/work):** "Nothing stocked in this lane yet."

## 9. Success criteria
- [ ] Screenshot of the home showroom matches §1: shelf of objects with engraved plaques, panning, no console/HUD/glow/mono anywhere
- [ ] All §4 states implemented and reachable by keyboard
- [ ] §6 contrast pairs verified in-browser with computed colors, not asserted
- [ ] Zero console errors; reduced-motion path exercised and screenshotted (vertical shelf); no-JS page renders completely
- [ ] `document.documentElement.scrollWidth <= clientWidth` at 375, 768, 1024, 1440
- [ ] Motion JS ≤ 90KB gz; LCP ≤ 2.5s on a real element; preloader ≤ 2.5s uncached and ≤ 400ms repeat
- [ ] VisitorPlaque absent until `/api/stats` returns a real number

## 10. Verification gate
foundry `references/preflight.md` full box-run (including immersive and compliance boxes) + fresh-context review via the `design-reviewer` agent and the `reviewer` agent for the Tier 2+ showcase surface. Evidence per `~/.claude/rules/verification.md`: rendered screenshots, computed-style assertions, build output. Motion evidence via Playwright sampling (the in-app pane freezes CSS timelines).

## 11. Out of scope — do not invent
Build exactly this brief. No new sections, effects, chrome, readouts, cursors, canvases, gradients, glass, terminal motifs, typed text, stamps, or "while I'm here" additions. A gap in this brief is a question to Ryan (or a TODO in the phase handoff), never an invitation to improvise design. Anything on the off-the-table list in `design-memory.md` is a preflight failure.
