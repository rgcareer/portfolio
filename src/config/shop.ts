// Shop registry. The buy control renders ONLY when a real checkout URL exists
// (substance guard: never a fake "Buy" state). Until Ryan supplies the Stripe
// Payment Link / Etsy URL, the page shows an honest "available on request" state.
// Kept minimal by design; the practice sells engagements, the kit is the shelf item.

export interface Product {
  key: string;
  name: string;
  priceLabel: string;
  price: number;
  summary: string;
  inside: string[];
  buyUrl?: string; // set to the real Stripe/Etsy URL to reveal the buy button
}

export const products: Product[] = [
  {
    key: 'follow-up-kit',
    name: 'The follow-up kit',
    priceLabel: '$199',
    price: 199,
    summary:
      'The scripts, templates, and setup guide for catching the calls, quotes, and follow-ups that fall through. Install it yourself this weekend. One time, no subscription.',
    inside: [
      'Copy-paste follow-up scripts for the missed call, the cold quote, and the no-show',
      'Setup walkthrough for the tools you already run',
      'The checklist I use on a paid build, so you can do the simple parts yourself',
    ],
    buyUrl: undefined, // Ryan: paste the real checkout URL here to turn on the buy button
  },
];
