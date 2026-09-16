// Single source of truth. Portable by design — the future move to a
// personal-brand domain is a one-line change here (+ astro.config `site`).
//
// PLACEHOLDERS to confirm with Ryan (marked TODO). The build runs with these;
// swap real values when ready.

export const site = {
  // identity (fully named — this is the named portfolio)
  name: 'Ryan Garver', // the PERSON: Person JSON-LD, author, résumé headline. Do not use for brand.
  // Visible BRAND wrapper (browser-tab titles, og:site_name, brand aria-label). Ryan's call
  // (2026-09-16): lead with "Get Smart AI" now (business-first); switch this to "Ryan Garver"
  // (personal brand) once traffic picks up and there is a marketing budget to build the name.
  // One-line flip when that day comes. `name` stays the person regardless.
  brand: 'Get Smart AI',
  firstName: 'Ryan',
  initials: 'RG',
  role: 'AI Enablement & Adoption',
  tagline: 'I help teams adopt AI, and I build a lot of it myself.',
  blurb:
    "I've spent my career helping people get comfortable with new technology, across retail, enterprise tech, and SaaS. These days that work is all about AI, and I build the tools as well as run the rollouts.",

  // contact / availability
  // Business/buyer contact per the charter (WEBSITE-SYNC v1, 2026-09-15).
  // STATUS (2026-09-16, Ryan): hello@getsmartai.ai RECEIVES (inbound routing is live). The
  // site's contact path is inbound only (mailto target + form recipient), so this is NOT a
  // dead contact and does NOT block a push. Sending/replying FROM this address is not set up
  // yet; until it is, Ryan replies to buyers from smartbusinessaillc@gmail.com. (Follow-up,
  // non-blocking: provision send-from-hello@ with SPF/DKIM/DMARC before outreach so replies
  // are on-domain.) Recruiter/portfolio surfaces use careerEmail (below), which is live.
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
  // Services live under /consulting (namespace decided 2026-09-15). Never point at a 404.
  nav: [
    { href: '/work', label: 'Work', key: 'work' },
    { href: '/consulting', label: 'Consulting', key: 'consulting' },
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
