// Case-study registry. Drives the /work index, the homepage plates, and each
// detail page's meta. Content curation rule: feature the engineering capability,
// never the faceless product storefronts (KDP/Etsy listings stay unlinked).

export interface CaseFigure {
  /** Screenshot plate (path under /public). */
  src?: string;
  alt?: string;
  /** Typeset specimen plate (real excerpt, used when no screenshot exists). */
  specimen?: string[];
  caption: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  status: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  tags: string[];
  accent?: boolean; // featured
  figure: CaseFigure;
}

export const work: CaseStudy[] = [
  {
    slug: 'operation-hired',
    title: 'Operation Hired',
    tagline: 'A tool I built to score thousands of job postings and weed out the fakes.',
    role: 'Design + build',
    year: '2026',
    status: '139 tests passing',
    stack: ['Node', 'SQLite', 'Scoring heuristics', 'Vitest'],
    metrics: [
      { label: 'Postings scored', value: '9,644' },
      { label: 'Signals', value: 'fraud · geo · tier' },
      { label: 'Re-score errors', value: '0' },
    ],
    tags: ['Data pipeline', 'Scoring', 'Automation'],
    accent: true,
    figure: {
      src: '/figures/operation-hired-dashboard.png',
      alt: 'Operation Hired dashboard: pipeline funnel, scoring distribution, and discovery charts',
      caption: 'Mission-control view. Every posting re-verified against its source before it surfaces.',
    },
  },
  {
    slug: 'competitor-intel-mcp',
    title: 'Competitor-Intel MCP',
    tagline: 'An MCP server that sells competitor data to AI agents instead of people.',
    role: 'Design + build',
    year: '2026',
    status: 'v1 · self-test passing',
    stack: ['Python (stdlib)', 'MCP / JSON-RPC 2.0', 'REST', 'Apify', 'Docker'],
    metrics: [
      { label: 'Dependencies', value: 'zero' },
      { label: 'Official APIs', value: 'Yelp · Places · Meta' },
      { label: 'MCP servers monetized', value: '<5%' },
    ],
    tags: ['MCP', 'Agent economy', 'APIs'],
    figure: {
      specimen: [
        '$ tools/list',
        '> competitor_snapshot   reviews, rating, hours',
        '> price_position        menu / service pricing',
        '> ad_activity           Meta ad library pull',
        '> report                one-call briefing (paid)',
      ],
      caption: 'The tool surface an agent sees. Python stdlib only; JSON-RPC 2.0 over stdio.',
    },
  },
  {
    slug: 'product-generation-pipeline',
    title: 'AI product-generation pipeline',
    tagline: 'One script that turns a short spec into a whole catalog of finished products.',
    role: 'Design + build',
    year: '2026',
    status: 'shipping',
    stack: ['Python', 'openpyxl', 'PDF generation', 'Parametric design'],
    metrics: [
      { label: 'From one script', value: '50+ variants' },
      { label: 'Per product', value: 'interior · cover · copy' },
      { label: 'Build cost', value: '$0' },
    ],
    tags: ['Automation', 'Generative', 'Content'],
    figure: {
      specimen: [
        'spec.yaml',
        '├── interiors/   50+ print-ready PDFs',
        '├── covers/      sized per trim + spine',
        '├── copy/        titles, descriptions, keywords',
        '└── manifest.csv one row per finished product',
      ],
      caption: 'One spec in, a catalog out. Every artifact print-ready on the first pass.',
    },
  },
  {
    slug: 'ai-ops-workflow',
    title: 'AI-ops workflow system',
    tagline: 'A set of rules and review agents that keep an AI coding assistant honest.',
    role: 'Design + build',
    year: '2026',
    status: 'in production use',
    stack: ['Claude Code', 'Hooks', 'Multi-agent orchestration', 'JS'],
    metrics: [
      { label: 'Review', value: 'adversarial fan-out' },
      { label: 'Safety', value: 'guard hooks' },
      { label: '"Done" =', value: 'evidence, not claim' },
    ],
    tags: ['Agents', 'Orchestration', 'Reliability'],
    figure: {
      specimen: [
        'RULE  no loop without a written stop condition',
        'RULE  never mark done without verification output',
        'GATE  destructive commands require human approval',
        'REVIEW  fresh-context agent, adversarial by default',
      ],
      caption: 'Operating rules, mechanically enforced. The assistant proves its work.',
    },
  },
];

export const getCase = (slug: string) => work.find((w) => w.slug === slug);
