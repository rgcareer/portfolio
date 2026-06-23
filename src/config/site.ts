// Single source of truth. Portable by design — the future move to a
// personal-brand domain is a one-line change here (+ astro.config `site`).
//
// PLACEHOLDERS to confirm with Ryan (marked TODO). The build runs with these;
// swap real values when ready.

export const site = {
  // identity (fully named — this is the named portfolio)
  name: 'Ryan Lastname', // TODO: real full name
  firstName: 'Ryan',
  initials: 'RL', // TODO: monogram for the liquid-metal mark
  role: 'AI / Operations Engineer', // TODO: confirm title
  tagline: 'I build AI systems and operations that ship.',
  blurb:
    'I close the gap between a clever prototype and something that runs — AI tooling, automation, and the operational glue in between.',

  // contact / availability
  email: 'smartbusinessaillc@gmail.com', // TODO: confirm personal vs LLC address
  availability: 'Open to work',
  year: '2026',
  location: 'United States',

  // domain (short-term)
  domain: 'getsmartai.ai',
  url: 'https://getsmartai.ai',

  // links
  links: {
    linkedin: 'https://www.linkedin.com/in/REPLACE', // TODO: real LinkedIn
    github: '', // optional — gated (publishing)
  },
} as const;

export type Site = typeof site;
