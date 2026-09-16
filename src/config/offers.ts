// Single source of truth for the priced menu. AUTHORITY: the business-OS charter
// (smart-business-ai/business-os/00-positioning-and-brand-charter.md §3), reached via
// WEBSITE-SYNC.md (v1, 2026-09-15). The charter governs SUBSTANCE (prices, guarantee,
// what may be claimed); Open Book governs LOOK. Copy adopted verbatim from the
// marketing seat's site-copy-drafts.md §3/§4/§10; prices are the charter's, not reworded.
//
// Locked decisions (2026-09-15): no monitoring line ("$0/mo you own it" + optional
// office hours only); websites is NOT in the primary ledger (its own
// /consulting/web-design sub-page); the $199 kit sits UNDER the ledger, never the
// headline. Copy discipline (binding): every number real or absent; no em/en dashes;
// each line names one concrete mechanism; never write the category contrast.

export interface Offer {
  key: string;
  name: string;
  price: number;          // numeric floor, for JSON-LD PriceSpecification.minPrice
  priceLabel: string;     // display, verbatim from the charter
  startHere?: boolean;    // the explicit funnel entry (the diagnostic)
  flagship?: boolean;     // the top line (the enablement program)
  mechanism: string;      // one concrete sub-line
  href: string;
}

// The primary ledger, in the marketing seat's drafted order (site-copy-drafts §3):
// diagnostic (start here) -> automation -> training -> keep it running -> enablement (flagship).
export const offers: Offer[] = [
  {
    key: 'diagnostic',
    name: 'The diagnostic',
    price: 750,
    priceLabel: '$750',
    startHere: true,
    mechanism:
      'Your own numbers, counted with you, plus one working automation installed on the tools you already pay for. Delivered on a set date.',
    href: '/#start',
  },
  {
    key: 'automation',
    name: 'Automation build',
    price: 2000,
    priceLabel: '$2,000',
    mechanism:
      'One fix from your list, built and running in your accounts. One integration. A handoff doc.',
    href: '/#rates',
  },
  {
    key: 'training',
    name: 'Team training',
    price: 900,
    priceLabel: '$900',
    mechanism:
      'One live session on your real workflow. Your team keeps the SOP and the prompt sheet.',
    href: '/#rates',
  },
  {
    key: 'keep-running',
    name: 'Keep it running',
    price: 0,
    priceLabel: '$0/mo',
    mechanism:
      'You own it outright: code, credentials, and documents live in your accounts. A written handoff and a named backup contractor. If you want me on call, office hours are from $1,500/mo, scoped in your SOW.',
    href: '/#rates',
  },
  {
    key: 'enablement',
    name: 'Enablement program',
    price: 2500,
    priceLabel: '$2,500 to $5,000',
    flagship: true,
    mechanism:
      'A 60 to 90 day arc: the builds from your list, about four live sessions, the SOP and prompt library you keep, and office hours. Quoted in the diagnostic.',
    href: '/#rates',
  },
];

// The kit sits UNDER the ledger, never the headline price (charter §3.5). /shop is
// blocked until the FTC flags clear + a CPA confirms taxability (Ryan-GUI gate), so the
// kit is MENTIONED here but not linked to a live store yet.
export const kit = {
  name: 'The follow-up kit',
  price: 199,
  priceLabel: '$199',
  line:
    'There is also a $199 kit: the nine-PDF Contractor AI Follow-Up Revenue Kit, the first working object if you want to see one thing work before you spend $750.',
};

// Websites are a real offering but NOT on the primary ledger (charter §3.5; locked
// 2026-09-15). Its own /consulting/web-design sub-page ships in a later slice.
export const websitesOffer = {
  name: 'Website',
  price: 1500,
  priceLabel: 'from $1,500',
  line: 'A sample of the work. An on-ramp, not the main event.',
  href: '/consulting/web-design',
};

export const offerCopy = {
  // The guarantee, stated as mechanics (charter §3.3; site-copy-drafts §4). Reused
  // verbatim in /terms. 30-day void window + 90-day full credit.
  guaranteeFull:
    'The diagnostic is invoiced when it is delivered, not before. If you decide inside 30 days that it was not worth it, the invoice is voided. Nothing was taken. And the $750 is credited in full against any build you sign within 90 days. You decide, not me.',
  guaranteeShort:
    'Invoiced on delivery, voided if you decide inside 30 days it was not worth it, and credited in full against any build within 90 days.',
  // Pricing basis + why the floors are low (charter §3.2; site-copy-drafts §3).
  pricingBasis: 'Fixed fee, scoped after the diagnostic. No hourly, no retainer required.',
  floorsLow:
    'Solo practice. No sales team, no account managers. The person who quotes the work does the work.',
  sampleLine:
    'A redacted sample diagnostic is available on request, so you can see exactly what you are buying before you book.',
};

// Continuity + cost-of-ownership (charter §6.3; site-copy-drafts §10) - the bus-factor answer.
export const continuity: { k: string; v: string }[] = [
  { k: 'Where the code and logins live', v: 'Your accounts' },
  { k: 'If I am ever unreachable', v: 'Written handoff, named backup' },
  { k: 'To move on, whenever you want', v: 'No lock-in' },
  { k: 'Monthly cost to keep it running', v: '$0, you own it' },
];

// Data-handling line (charter §6.5; site-copy-drafts §10). NOTE: the phrasing is "ask
// me about a BAA," NOT "BAA available" - Legal has not confirmed a BAA can be offered.
// Do not change to "available" without Legal + Ryan.
export const dataHandling =
  'What I connect to, I connect to with your accounts and paid, commercial tiers that do not train on your data. What I never touch, I will tell you up front. The contract is with Smart Business AI LLC. Ask me about a BAA.';
