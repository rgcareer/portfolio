// Single source of truth for the rate card. Consumed by the home ledger, the
// /services pages, /shop, and /terms (the guarantee wording must match verbatim
// wherever it appears - one fact, not four copies). Council authority:
// tasks/research/competitive-council-2026-09-15.md + open-book-handoff.md s0.
//
// Copy discipline (binding): every number real or absent; no multiplier /
// percentage / hours-saved / payback claim; each line names one concrete
// mechanism with a time and a place; plain English; no em/en dashes.

export interface Offer {
  key: string;
  name: string;
  price: number;          // numeric, for JSON-LD PriceSpecification.minPrice
  priceLabel: string;     // display, e.g. "$750"
  from: boolean;          // show the "from" prefix (scoped after diagnosis)
  startHere?: boolean;    // the explicit funnel entry (the diagnostic)
  mechanism: string;      // the sub-line: one concrete mechanism, a time and a place
  href: string;           // its /services child (Slice 3)
}

export const offers: Offer[] = [
  {
    key: 'diagnostic',
    name: 'The diagnostic',
    price: 750,
    priceLabel: '$750',
    from: true,
    startHere: true,
    mechanism:
      'I spend a day inside your business and find the three places work leaks out: the call that went to voicemail at 6:40 on a Friday, the quote still sitting in drafts, the recall nobody sent. You get a written fix list with a price next to each line.',
    href: '/services/ai-consulting',
  },
  {
    key: 'automation',
    name: 'Automation builds',
    price: 2000,
    priceLabel: '$2,000',
    from: true,
    mechanism:
      'The missed call at 6:40 gets a text back by 6:41. The report that eats your Friday builds itself overnight. Built, tested, and handed over running, with the instructions.',
    href: '/services/automation',
  },
  {
    key: 'websites',
    name: 'Websites',
    price: 1500,
    priceLabel: '$1,500',
    from: true,
    mechanism:
      'A site that answers the phone when you cannot: it books the job and sends the quote while you are on a ladder. Live in two weeks. This one is the sample.',
    href: '/services/web-design',
  },
  {
    key: 'training',
    name: 'Team training',
    price: 900,
    priceLabel: '$900',
    from: true,
    mechanism:
      'A working session with your people and your actual tools. They leave already using it on Monday, not holding a manual they will never open.',
    href: '/services/training',
  },
  {
    key: 'kit',
    name: 'The follow-up kit',
    price: 199,
    priceLabel: '$199',
    from: false,
    mechanism:
      'The follow-up scripts, templates, and the setup guide, ready to install yourself this weekend. The one thing on this list you can start without me.',
    href: '/shop',
  },
];

export const offerCopy = {
  // The guarantee, stated as mechanics (addendum s0.F). Reused verbatim in /terms.
  guaranteeShort: 'You decide if it was worth it. If it was not, you do not pay.',
  guaranteeFull:
    'You decide whether the diagnostic was worth the fee. If it was not, you do not pay it, no argument. And the $750 comes off the price of any build you start within 90 days, so the diagnosis is free the moment you go ahead.',
  // Why the floors are low (addendum s0.I) - turns the price-as-quality worry into proof.
  pricingBasis:
    'The prices are low because the overhead is: one person, no sales team, no account managers. You are paying for the work, not the org chart.',
  // Retainers: mentioned, never marketed.
  retainerNote: 'Retainers exist. They are offered after an engagement, never sold cold.',
};

// Continuity + cost-of-ownership (addendum s0.G) - answers the bus-factor objection.
export const continuity: { k: string; v: string }[] = [
  { k: 'Where the code and logins live', v: 'Your accounts' },
  { k: 'If I am ever unavailable', v: 'Written handoff, named backup' },
  { k: 'Transition, if you leave', v: '30 days, no lock-in' },
  { k: 'Monthly cost to keep it running', v: '$0, you own it' },
];

// Data-handling line (addendum s0.H) - without it the dental/medical vertical cannot convert.
export const dataHandling =
  'You name what I connect to, and I never move your customer data anywhere you have not approved. A BAA is available for dental and medical work. Every engagement is with Smart Business AI LLC on the contract.';
