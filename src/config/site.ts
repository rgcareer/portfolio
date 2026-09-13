// Single source of truth. Portable by design — the future move to a
// personal-brand domain is a one-line change here (+ astro.config `site`).
//
// PLACEHOLDERS to confirm with Ryan (marked TODO). The build runs with these;
// swap real values when ready.

export const site = {
  // identity (fully named — this is the named portfolio)
  name: 'Ryan Garver',
  firstName: 'Ryan',
  initials: 'RG',
  role: 'AI Enablement & Adoption',
  tagline: 'I help teams adopt AI, and I build a lot of it myself.',
  blurb:
    "I've spent my career helping people get comfortable with new technology, across retail, enterprise tech, and SaaS. These days that work is all about AI, and I build the tools as well as run the rollouts.",

  // contact / availability
  email: 'ryan.garver.career@gmail.com', // dedicated career email (current résumé). Business surfaces move to ryan@getsmartai.ai at B3' (domain-email gate).
  availability: 'Open to work',
  year: '2026',
  location: 'Boise, ID · Remote',

  // legal entity (footer + JSON-LD; brand "Get Smart AI · led by Ryan Garver" leads, LLC is the entity)
  legalEntity: 'Smart Business AI LLC',
  legalLocation: 'Boise, ID',

  // domain (short-term)
  domain: 'getsmartai.ai',
  url: 'https://getsmartai.ai',

  // primary nav (7, at the ceiling but within it; no hamburger, wrap rule). Services + Shop are B5' pages.
  nav: [
    { href: '/services', label: 'Services', key: 'services' },
    { href: '/work', label: 'Work', key: 'work' },
    { href: '/shop', label: 'Shop', key: 'shop' },
    { href: '/notes', label: 'Notes', key: 'notes' },
    { href: '/resume', label: 'Résumé', key: 'resume' },
    { href: '/about', label: 'About', key: 'about' },
    { href: '/contact', label: 'Contact', key: 'contact' },
  ],

  // links
  links: {
    linkedin: 'https://www.linkedin.com/in/ryan-garver-ai', // custom URL changed 2026-06-19; old /in/-rgarver is dead (no redirect)
    github: 'https://github.com/rgcareer', // profile hosting evalcard / sop-mcp / should-i-automate-this / cs-prompt-field-kit
  },
} as const;

export type Site = typeof site;
