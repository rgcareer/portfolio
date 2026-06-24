# getsmartai.ai — Ryan Garver

Personal portfolio for **Ryan Garver** — AI Enablement &amp; Adoption.

Built from scratch with Astro. A fast, static, accessible site with a custom "console"
design system, a ⌘K command palette, GSAP motion, and a mouse-reactive canvas background.
Not a template.

## Stack
- [Astro](https://astro.build) — static output
- Vanilla CSS design tokens (Geist + Geist Mono)
- GSAP — entrance choreography + scroll parallax
- Canvas particle field; deployed on Cloudflare Pages

## Develop
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output → dist/
```

## Notes
- Keyboard-navigable command palette (⌘K / Ctrl+K), full `prefers-reduced-motion`
  fallbacks, and content that renders with JavaScript disabled.
- Case studies live in `src/pages/work/`; all identity/content config in `src/config/`.
