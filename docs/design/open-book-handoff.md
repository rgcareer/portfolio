# Home / sitewide system — Implementation Brief ("OPEN BOOK")
Date: 2026-09-12 · Direction: **Open Book** (D1 ledger + D2 Daylight graft; approved by Ryan
2026-09-12 at the artifact feel-gate, see design-memory entry) · Register: **brand**

**THE design authority for the positioning reset.** Supersedes `green-light-handoff.md` and every
visual/token section of earlier handoffs. IA/offers/machinery/compliance still come from
`~/.claude/plans/own-the-getsmartai-ai-website-idempotent-cascade.md` (§3.2/3.3/3.4/3.9); the
positioning brief lives in `~/.claude/plans/read-claude-plans-getsmartai-positioning-polished-firefly.md`
(Deliverable A). Approved reference artifact (the look to match): scratchpad `open-book.html`,
published at https://claude.ai/code/artifact/2507caef-bc8f-4500-b617-9d655c5a67b3.

## 1. Direction summary
- **Concept:** radical financial transparency AS the brand — the site is set like a beautifully
  typeset statement of account: offers as ledger line items with dotted leaders and published
  prices, proof as double-ruled totals, warmed by one hard-edged "sun patch" of daylight.
- **Emotional target:** SMB owner feels RELIEF ("someone who talks about AI the way my
  accountant talks about money; I can see exactly what it costs"); recruiter feels RESPECT
  (rigor, numeracy, restraint, craft).
- **Signature element (protect it):** **the line item** — name · dotted leader · real figure,
  everywhere a claim or price appears. Secondary motif: the single sun patch (the Daylight
  graft). Nothing else competes with these two.

## 2. Design tokens
```css
:root {
  color-scheme: light;
  /* color roles */
  --ground:        #FDFBF8;  /* page bg — warm near-white; NOT cream/bone */
  --surface:       #FDFBF8;  /* cards/surfaces are the ground; separation = rules, not fills */
  --ink:           #1B1B1F;  /* text */
  --muted:         #6E6A63;  /* secondary text (AA 5.1:1 on ground) */
  --burgundy:      #6E1F2E;  /* THE accent: prices, numerals, kickers, CTAs, links */
  --burgundy-deep: #571825;  /* hover/active of the accent */
  --on-burgundy:   #FFFDFB;  /* text on burgundy */
  --hairline:      #E6E1D9;  /* 1px rules, borders */
  --dot:           #C9C2B6;  /* dotted leaders, secondary rules */
  --blush:         #F7F0EC;  /* full-bleed proof-band tint (the only section fill) */
  --sun:           #FFD9B0;  /* sun patch fill — decorative only */
  /* type */
  --font-display: "Familjen Grotesk", "Helvetica Neue", Arial, sans-serif; /* display + body + UI */
  --font-slab:    "Zilla Slab", "Rockwell", Georgia, serif;                /* labels, numerals, ledger voice */
  /* scale */
  --fs-h1: clamp(42px, 7vw, 74px);      /* 700, ls -0.022em, lh 1.02, balance */
  --fs-h2: clamp(28px, 4vw, 40px);      /* 700, ls -0.015em */
  --fs-figure: clamp(46px, 6vw, 66px);  /* slab 700, tabular-nums */
  --fs-body: 17px;                      /* lh 1.55 */
  --fs-lead: 19px;
  --fs-small: 15.5px;  --fs-caption: 13.5px;
  --fs-kicker: 13px;   /* slab 600, caps, ls 0.18em */
  --fs-eyebrow: 12px;  /* display 600, caps, ls 0.15em */
  /* spacing scale: 4 8 12 16 24 32 48 64 84(section) 96 */
  --sect-pad: 84px;    /* 64px ≤680px */
  /* radius & borders: 3px buttons · 999px chips/pills · everything else square */
  /* shadows: NONE (flat; separation is rules + the blush band) */
  /* motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-enter: 700ms; --dur-tally: 900ms; --dur-fast: 160ms;
}
```
Dark mode: **single-theme light by design** — "no black boxes / daylight" is the positioning made
literal; the site declares `color-scheme: light` and paints every surface explicitly. Numerals use
`font-variant-numeric: tabular-nums` wherever figures appear.

**Fonts (site build):** self-host Familjen Grotesk (400/500/600/700 + 400 italic) and Zilla Slab
(500/600/700 + 500 italic) via @fontsource, latin subset, preloaded — CSP allows no third-party
origins. (The artifact used Google CDN; the site must not.)

## 3. Layout rules
- Content column `max-width: 940px`, side padding 28px, left-aligned throughout (nothing
  centered; the ledger reads like a document).
- Section rhythm: `--sect-pad` top/bottom; hero 84px top / 96px bottom (64/76 mobile).
- Hero pattern: eyebrow → H1 (max 13ch, balance) → lead sub (max 56ch) → ledger-voice line
  (slab, burgundy) → CTA row (primary btn + arrow link) → recruiter chip. ONE sun patch
  absolutely positioned upper-right behind the H1, `z-index 0`, content above.
- Density: medium; the rate card and proof sections may run denser, the principal and close
  sections airier. Never grid-of-cards; the page is a column of ruled sections.
- Section anatomy: kicker (slab caps burgundy) → H2 → intro (muted, max 54ch) → content.

## 4. Component specs
- **Primary button `.btn`** — anatomy: solid burgundy, `--on-burgundy` text, 600/16px, 14px 24px
  padding, radius 3px. Content: verb phrases ≤4 words ("Start with a diagnostic").
  States: default burgundy · hover `--burgundy-deep` + translateY(-1px) · focus-visible 2px
  burgundy outline, 3px offset · active translateY(0), deep · disabled: none on this site
  (links/forms only submit when valid; if ever needed: 50% opacity + no transform) · loading:
  none (static site) · empty/error: n/a for buttons.
- **Arrow link `.link-arrow`** — ink text 600, 2px burgundy underline, "→" suffix.
  States: hover text→burgundy · focus-visible outline as above · active deep.
- **Recruiter chip `.chip`** — pill (999px), 1px hairline border, 13.5px muted text + burgundy
  600 link, subtle white-tint fill. One per hero, never repeated mid-page.
  States: link hover underline · focus-visible outline on the link.
- **Line item `.line-item`** (THE signature) — anatomy: top hairline rule; row = name (display
  600/20px, nowrap) + leader (flex-1, 2px dotted `--dot`, baseline-aligned) + price (slab
  600/24px burgundy, tabular, `from` prefix in 13px muted display); sub-line (15.5px muted, max
  56ch). Ledger closes with a bottom hairline + an italic slab footnote.
  States: static by default · linked variant: name→burgundy on hover, focus-visible outline on
  the row link · ≤680px: leader hidden, price right-aligned via margin-left auto, row wraps.
- **Proof total `.total`** — slab figure (`--fs-figure`, burgundy, tabular) over a **5px double
  ink rule**, label below (15px ink, max 24ch). Lives only on the blush band. Figures are SSR'd
  real values with `data-count`; states: pre-tally (real value visible) / tallied. Never a stat
  card, never boxed.
- **Kicker `.kicker`** — slab 600 13px caps 0.18em burgundy; encodes the ledger's section
  labels ("The rate card", "The proof", "The principal", "The next line item"). No states.
- **Ledger-voice line `.ledger-voice`** — slab 500 17.5px burgundy; used for the one
  trust-mechanics sentence per surface ("Every price on this site is published. Every number is
  real."). Max one per surface. No states.
- **Sun patch `.sun-patch`** — decorative div, `aria-hidden`, `clip-path: polygon(16% 0,
  100% 0, 84% 100%, 0 100%)`, fill `--sun`, size ~min(480px,58vw) × min(320px,44vw),
  positioned upper-right of the hero, `pointer-events: none`. **Rule: ONE per surface,
  hero-class moments only. Edges always hard (no blur, no gradient, no opacity fade). May sit
  under high-contrast ink text; never under muted/small text.** States: drifting (48s
  ease-in-out alternate translateX) / static under reduced-motion.
- **Header/nav** — wordmark "get smart ai" (display 700 19px, ls -0.01em) + "led by Ryan
  Garver" (12.5px muted) stacked; right nav links 14.5px 500 muted → hover burgundy.
  ≤680px: nav collapses per the site's existing mobile-nav pattern (no hamburger; wrap rule
  from the program plan holds — resolve layout at /proto, flag if it fights).
- **Footer** — top hairline; LLC line + legal links, 13.5px muted → hover burgundy.

## 5. Responsive matrix
| Breakpoint | What changes |
|---|---|
| ≤680 | section pad 64px; hero 64/76; leaders hidden, prices right-align, li rows wrap; totals stack 1-col (gap 34px); nav per site mobile pattern; sun patch scales via vw mins; body stays 17px |
| 681–1024 | full layout; H1/figures mid-clamp; totals 3-col |
| >1024 | clamps max out (H1 74px, figures 66px); column capped 940px |
All: zero horizontal overflow at 375/390 (hard gate); touch targets ≥44px; `overflow-x: clip` on body as belt-and-suspenders, patches must not force it.

## 6. Accessibility requirements
- Contrast (computed from tokens; **re-verify in-browser at /proto**, per the standing gate):
  ink/ground **16.4:1** · burgundy/ground **10.5:1** · muted/ground **5.1:1** ·
  on-burgundy/burgundy **11.0:1** · ink/sun **12.9:1** · burgundy/blush **9.8:1** ·
  ink/blush **~14:1**. Muted is the floor — never set muted below 15px, never place muted or
  small text on the sun patch.
- Focus: `:focus-visible { outline: 2px solid var(--burgundy); outline-offset: 3px }` sitewide;
  never removed without replacement.
- Touch ≥44px on all interactive elements; body ≥16px (17px base).
- Reduced-motion: sun-patch drift OFF (static) · entrance choreography OFF (elements at rest) ·
  tally OFF (real value already SSR'd) · leader draw OFF (dots fully visible) · hover
  transforms may remain (discrete).
- Landmarks: `header` + `nav[aria-label]` + `main` + `footer`; one H1; H2 per section; decorative
  patches/leaders `aria-hidden`.

## 7. Motion spec
- **What animates and why:** (1) one entrance choreography on the hero (eyebrow→H1→sub→
  ledger-voice→CTAs→chip, 90ms stagger, `--dur-enter` `--ease-out`) — the page "sets" like a
  document; (2) proof figures tally once on first view (`--dur-tally`, cubic ease-out; final
  value SSR'd in markup) — the sum being totted up; (3) leaders draw left→right on first view
  (clip-path inset reveal, 800ms) — the line being ruled; (4) sun patch drifts (48s alternate)
  — daylight moving. That is the whole budget.
- **What never animates:** layout position of text, colors of body copy, anything on scroll
  beyond first-view reveals, parallax, cursors, preloaders, page wipes, typed text.
- **Stack: zero-library** — WAAPI `element.animate()` + CSS keyframes + IntersectionObserver.
  No GSAP, no Lenis, native scroll. **No-FOUC contract (2026-07-02 lesson): elements are fully
  visible in CSS at rest; JS animates FROM offset TO rest with explicit keyframes
  (`fill: "backwards"` or fromTo) — never a CSS `opacity: 0` base, never `gsap.from`-style
  current-value capture.** Reduced-motion: per §6.

## 8. Content & copy
- **Voice:** plain-spoken, numerate, unhurried. **Forbidden tone: hype** (urgency, superlatives,
  AI-mystique). House rules hold: no em/en dashes anywhere (`rg "—|–" dist/` = 0), no
  "not just X but Y", no antithesis constructions, humanizer backstop.
- **Approved working copy (from the gated artifact — keep unless Ryan revises):**
  - H1: "AI that pays for itself. Here's the math."
  - Lead: "Consulting, automation builds, team training, websites, and ready-made kits for
    businesses that run without an engineering department."
  - Ledger-voice: "Every price on this site is published. Every number is real."
  - CTAs: "Start with a diagnostic" / "See the work →"
  - Chip: "Hiring for AI enablement? The work and résumé are one click away →"
  - Rate card: The diagnostic from $750 · Automation builds from $2,000 · Websites from $1,500
    ("This one is the sample.") · Team training from $900 · The follow-up kit $199; footnote
    "Retainers exist. They're offered after an engagement, never sold cold."
  - Proof totals (real, re-verify at build): 14,851 postings scored · 616 tests passing ·
    0 re-score errors; case line: Operation Hired, solo, $0 per posting.
  - Principal (voice block, NO photo — Ryan's call): "I'm Ryan Garver. I run this practice to
    keep my AI enablement work current and measurable. When I say a tool pays for itself, it's
    because I built it, ran it, and kept the receipts. If you're hiring for AI enablement, the
    same work is on the shelf with the numbers attached."
  - Close: "Tell me what's slow." / "I'll tell you what it costs to fix. An intake form, three
    fields, no sales call." / "Start the conversation"
- The five recruiter counter-signals are hard requirements on the home hero (name at hero,
  recruiter chip, applied-proof framing, role+outcome case lines, outcome-verb hero).

## 9. Success criteria (checkable by the implementer)
- [ ] Screenshot matches the approved artifact's look: line items + leaders + burgundy figures
      + one hard-edged sun patch present (the two signatures)
- [ ] All §4 states implemented and reachable (tab through: btn, links, chip, nav, footer)
- [ ] §6 contrast pairs verified in-browser (computed, not asserted)
- [ ] Zero console errors; reduced-motion + no-JS paths exercised (everything readable, real
      numbers visible without JS)
- [ ] 375/390: zero horizontal overflow; leaders hidden; prices aligned; targets ≥44px
- [ ] `rg "—|–"` on the built output = 0; tabular-nums active on every figure column

## 10. Verification gate
foundry `references/preflight.md` full box-run + fresh-context `design-reviewer` agent (Tier 2
public-facing surface). Evidence per `~/.claude/rules/verification.md`: rendered screenshots
(desktop + 390), computed contrast, console capture — archived to `tasks/process-capture/`.

## 11. Out of scope — do not invent
Build exactly this brief. No new colors (burgundy is the ONLY accent; no second accent ever),
no gradients, no shadows, no cards, no dark sections, no extra sun patches, no icon set, no
illustration, no monospace, no serif beyond Zilla Slab's specified roles, no motion beyond §7.
The formal brand mark is an OPEN item (wordmark-only for now; a mark exploration needs Ryan's
separate go — do not sneak one in). A gap in this brief is a question to Ryan, never an
invitation to improvise.
