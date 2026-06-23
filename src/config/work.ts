// Case-study registry. Drives the /work index and each detail page's meta.
// Content curation rule: feature the engineering capability, never the faceless
// product storefronts (KDP/Etsy listings stay unlinked).

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
}

export const work: CaseStudy[] = [
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
    accent: true,
  },
  {
    slug: 'operation-hired',
    title: 'Operation Hired',
    tagline: 'A tool I built to score thousands of job postings and weed out the fakes.',
    role: 'Design + build',
    year: '2026',
    status: '95 tests passing',
    stack: ['Node', 'SQLite', 'Scoring heuristics', 'Vitest'],
    metrics: [
      { label: 'Postings scored', value: '5,905' },
      { label: 'Signals', value: 'fraud · geo · tier' },
      { label: 'Re-score errors', value: '0' },
    ],
    tags: ['Data pipeline', 'Scoring', 'Automation'],
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
  },
];

export const getCase = (slug: string) => work.find((w) => w.slug === slug);
