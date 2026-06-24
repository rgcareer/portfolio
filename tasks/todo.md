# Portfolio Site — Ryan Garver · AI Enablement & Adoption

## What this is
getsmartai.ai → fully-named professional + portfolio site (short-term home, portable to a
personal-brand domain later). Standalone Astro project at Desktop/1-projects/portfolio-site.
Local git, no remote. Deploy is gated.

**Positioning:** AI Enablement & Adoption (NOT RevOps/biz-ops; NOT "AI engineer"). Validated by
Operation Hired: #1 target = AI Enablement Manager ($118-190K). Differentiator: enablement/
change-management leader (20+ yrs, teams 15-35) who also BUILDS AI tools.

## Status (2026-06-23) — SITE COMPLETE, only gated deploy remains
- Phase A DONE — Astro + "Ethereal Glass/Console" design system.
- Phase B DONE — motion: particle bg, ⌘K palette, GSAP entrance, magnetic, typed console.
- Phase C DONE — Home, Work (index + 4 case studies), Résumé (web + ATS PDF), About, Contact.
- Phase D DONE — responsive (390px), reduced-motion, keyboard, no-JS robustness, a11y, console clean.
- Phase E DONE — fresh-context review passed; fixes applied (cert name → "Claude Certified
  Architect (Anthropic)", contact <dl>, monogram removed).
- WOW pass DONE — living gradient backdrop (drifting glow orbs) + scroll parallax (hero lift/fade,
  bg drift); both reduced-motion gated.
- **Phase F PENDING (gated) — deploy to getsmartai.ai via Cloudflare Pages.** Needs Ryan's explicit
  go + account/publishing steps. Replaces the old contractor page.

## Latest commit: e1b779e (git log in portfolio-site). All work committed, local-only.

## Run / verify
Dev: `npm run dev` (port 4321) in portfolio-site (bash bg). Build: `npm run build`. Verify via
bash dev server + Playwright MCP (Claude_Preview MCP can't reach this dir — outside workspace root).

## Open confirmations / notes for Ryan
- "Claude Certified Architect (Anthropic)" listed under résumé "Currently developing" (real cert,
  launched 2026-03-12; he's studying for it). On the visible web page only — not an earned claim.
- Phone (909.855.9854) is in the résumé PDF/print ONLY, never on the public web page.
- package.json `description` still says old "AI/Operations engineer" — non-rendered metadata; left as-is.

## Next (when Ryan is ready)
1. Phase F: deploy to getsmartai.ai (Cloudflare Pages). GATED — money/accounts/public.
2. THEN product-build pipeline. NOTE: cluster "LLM Infrastructure/Ops" was chosen under the OLD
   "AI engineer" framing — revisit; AI-adoption/enablement tools fit the new positioning better.

## Sources
Résumé: ~/Downloads/resume_undefined.md. Operation Hired DB + humanizer:
"New Skills/operation-hired/{database/hired.db, server/services/humanizer.js}". Plan:
~/.claude/plans/adaptive-yawning-dragonfly.md. Lessons: tasks/lessons.md.
