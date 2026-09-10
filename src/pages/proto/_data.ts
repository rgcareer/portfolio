// B1 proto object data. Real metrics/figures copied verbatim from `src/config/work.ts`
// (single source of truth for the live site); the `flip` copy is authored here for the
// motion gate and migrates into `work.ts` (as a `flip?` field) at B2. Underscore prefix
// keeps this out of the route table. Every string here is dash-free by design.
//
// Flagship = Should I Automate This? (Ryan, 2026-09-10): leads with AI-adoption judgment,
// the on-message signal for the AI Enablement / Adoption roles. Operation Hired stays on
// the shelf as strong build proof, just not leading.

export type ChipKey = 'cobalt' | 'moss' | 'vermilion';

export interface ProtoObject {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  status: string;
  tier: 'flagship' | 'standard';
  chip: ChipKey;
  metrics: { label: string; value: string }[];
  figure: { src: string; alt: string; width: number; height: number };
  flip: { before: string; after: string }; // <= 140 chars each, no em/en dashes
  caseHref?: string; // present on the object that owns the view-transition target
}

// Order left to right on the shelf: flagship first.
export const objects: ProtoObject[] = [
  {
    slug: 'should-i-automate-this',
    title: 'Should I Automate This?',
    tagline: 'A decision tool that tells you whether to hand a task to AI, and hands you a stop-test instead of hype.',
    role: 'Design + build',
    year: '2026',
    status: 'public, 28 tests',
    tier: 'flagship',
    chip: 'moss',
    metrics: [
      { label: 'Tests passing', value: '28 / 28' },
      { label: 'Calibration goldens', value: '10 / 10' },
      { label: 'Output', value: 'tiered verdict' },
    ],
    figure: {
      src: '/figures/should-i-automate-verdict.webp',
      alt: 'Should I Automate This verdict: a tiered recommendation with a concrete stop-test',
      width: 1280,
      height: 1741,
    },
    flip: {
      before: 'You automate on a hunch, then learn in production which tasks a model quietly gets wrong.',
      after: 'Answer a few questions, get a tier and a stop-test that talks you out of the wrong ones first.',
    },
    caseHref: '/proto/should-i-automate-this',
  },
  {
    slug: 'evalcard',
    title: 'evalcard',
    tagline: 'A no-code eval harness: write test cases in plain English, get a report card and a ship decision.',
    role: 'Design + build',
    year: '2026',
    status: 'public, MIT, 30 tests',
    tier: 'standard',
    chip: 'vermilion',
    metrics: [
      { label: 'Tests passing', value: '30 / 30' },
      { label: 'Judge honesty', value: 'capped at 0.80' },
      { label: 'Output', value: 'report card + brief' },
    ],
    figure: {
      src: '/figures/evalcard-report-card.webp',
      alt: 'evalcard report card: per-case pass and fail, rubric scores, and a ship-decision brief',
      width: 1280,
      height: 2239,
    },
    flip: {
      before: 'You eyeball a few model outputs, call it good, and ship with no record of what you checked.',
      after: 'Write cases in plain English, get a report card and a ship, fix-first, or do-not-ship brief.',
    },
  },
  {
    slug: 'operation-hired',
    title: 'Operation Hired',
    tagline: 'A tool I built to score thousands of job postings and weed out the fakes.',
    role: 'Design + build',
    year: '2026',
    status: '616 tests passing',
    tier: 'standard',
    chip: 'cobalt',
    metrics: [
      { label: 'Postings scored', value: '14,851' },
      { label: 'Signals', value: 'fraud, geo, tier' },
      { label: 'Re-score errors', value: '0' },
    ],
    figure: {
      src: '/figures/operation-hired-dashboard.webp',
      alt: 'Operation Hired dashboard: pipeline funnel, scoring distribution, and discovery charts',
      width: 1600,
      height: 626,
    },
    flip: {
      before: 'You read job posts one by one, and reposts and ghost listings burn hours you never get back.',
      after: 'A scorer reads 14,851 at once, checks each against its source, and surfaces only the real ones.',
    },
  },
];

export const flagship = objects[0];
