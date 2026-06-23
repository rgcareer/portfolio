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
  tagline: 'I help organizations actually adopt AI — and I build the tools that make it stick.',
  blurb:
    'Twenty years leading teams and change management, now all-in on AI: I turn complex capabilities into workflows non-technical people actually use — and I build the products that prove it.',

  // contact / availability
  email: 'ryan.garver.career@gmail.com', // dedicated career email (current résumé)
  availability: 'Open to work',
  year: '2026',
  location: 'Boise, ID · Remote',

  // domain (short-term)
  domain: 'getsmartai.ai',
  url: 'https://getsmartai.ai',

  // links
  links: {
    linkedin: 'https://www.linkedin.com/in/-rgarver', // leading dash is intentional (confirmed)
    github: '', // optional — gated (publishing)
  },
} as const;

export type Site = typeof site;
