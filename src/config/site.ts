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
  // Business/buyer contact per the charter (WEBSITE-SYNC v1, 2026-09-15). FLAG for Ryan:
  // confirm hello@getsmartai.ai is provisioned and receiving BEFORE pushing, or it is a
  // dead contact. Recruiter/portfolio surfaces use careerEmail (below), which is live.
  email: 'hello@getsmartai.ai',
  careerEmail: 'ryan.garver.career@gmail.com', // recruiter + resume + case-study contact (live)
  availability: 'Open to work',
  year: '2026',
  location: 'Boise, ID · Remote',

  // legal entity (footer + JSON-LD; brand "Get Smart AI · led by Ryan Garver" leads, LLC is the entity)
  legalEntity: 'Smart Business AI LLC',
  legalLocation: 'Boise, ID',
  dba: 'Get Smart AI, a dba of Smart Business AI LLC', // always show the dba (charter §6.2)

  // domain (short-term)
  domain: 'getsmartai.ai',
  url: 'https://getsmartai.ai',

  // primary nav (no hamburger, wrap rule). Shop is OFF the nav until the FTC flags clear
  // and a CPA confirms kit taxability (charter §3.5; /shop is noindexed until then).
  // Services returns in a later slice. Never point the nav at a 404.
  nav: [
    { href: '/work', label: 'Work', key: 'work' },
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
