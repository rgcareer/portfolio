# Portfolio Site — Ryan Garver · AI Enablement & Adoption

## What this is
getsmartai.ai → fully-named professional + portfolio site (short-term home, portable to a
personal-brand domain later). Standalone Astro project at Desktop/1-projects/portfolio-site.
Local git, no remote. Deploy is gated.

**Positioning:** AI Enablement & Adoption (NOT RevOps/biz-ops — he's pivoting INTO AI; NOT "AI
engineer"). Validated by Operation Hired: #1 target = AI Enablement Manager (8.87, $140-180K);
target families AI Enablement/Adoption/Transformation/Strategy at $118-190K. Differentiator:
enablement/change-management leader (20+ yrs, teams 15-35) who actually BUILDS AI tools.

## Status (2026-06-23)
- Phase A DONE — Astro foundation + "Ethereal Glass/Console" design system. (bff3b65)
- Phase B DONE — motion: particle bg, ⌘K palette, GSAP entrance, magnetic CTAs, typed console. (b80c54d)
  - PENDING: liquid-metal RG monogram (now have initials).
- Phase C IN PROGRESS —
  - DONE: Work section (index + 4 case studies: MCP, Operation Hired, product pipeline, AI-ops workflow). (38254e9)
  - DONE: /resume (AI-enablement-optimized) + full reposition to Ryan Garver / AI Enablement. (c059215)
  - REMAINING: About page (AI-enablement story), Contact polish, the monogram.
- Phase D — polish + verify (responsive 390px / a11y / perf / reduced-motion).
- Phase E — fresh-context review (reviewer agent).
- Phase F — GATED deploy to getsmartai.ai (Cloudflare Pages). Replaces old contractor page.

## Run / verify
Dev server: `npm run dev` (port 4321) in portfolio-site (bash background). Build: `npm run build`.
Claude_Preview MCP can't reach this dir (outside workspace root) → use bash dev server + Playwright MCP.

## Open confirmations (Ryan)
- LinkedIn: current résumé shows `/in/-rgarver` (leading dash) — confirm vs `/in/rgarver`.
- Phone on the downloadable résumé PDF: include 909.855.9854, or keep public contact = email + LinkedIn only?

## Next
1. About + liquid-metal RG monogram + Contact polish → finish the site.
2. Phase D/E → gated deploy.
3. THEN product-build pipeline. NOTE: cluster "LLM Infrastructure/Ops" was chosen under the OLD
   "AI engineer" framing — revisit; AI-adoption/enablement tools likely fit the new positioning better.

## Sources
Current résumé: ~/Downloads/resume_undefined.md. Operation Hired DB (target roles, certs, story bank,
proof_of_work): "New Skills/operation-hired/database/hired.db" (read-only). Plan:
~/.claude/plans/adaptive-yawning-dragonfly.md. Lessons: tasks/lessons.md.
