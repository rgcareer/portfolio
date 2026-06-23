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
    "I've spent about twenty years helping people get comfortable with new technology, across retail, enterprise tech, and SaaS. These days that work is all about AI, and I build the tools as well as run the rollouts.",

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
