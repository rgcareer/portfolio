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
  accent?: boolean; // featured (homepage hero)
  home?: boolean; // render as a homepage scroll panel
  links?: { label: string; href: string }[]; // external links (live demo / source / npm)
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
    home: true,
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
    home: true,
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
    home: true,
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

  // ---- Portfolio Projects Sprint (2026): four shipped AI-enablement tools + the method behind them ----
  {
    slug: 'evalcard',
    title: 'evalcard',
    tagline: 'A no-code eval harness: write test cases in plain English, get a report card and a ship / fix-first / do-not-ship brief.',
    role: 'Design + build',
    year: '2026',
    status: 'public · MIT · 30 tests',
    stack: ['TypeScript', 'Node', 'Claude API (Anthropic SDK)', 'Vitest', 'Built with Claude Code'],
    metrics: [
      { label: 'Tests passing', value: '30 / 30' },
      { label: 'Judge honesty', value: 'capped at 0.80' },
      { label: 'Output', value: 'report card + brief' },
    ],
    tags: ['LLM eval', 'AI testing', 'No-code'],
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/evalcard' },
      { label: 'Source', href: 'https://github.com/rgcareer/evalcard' },
    ],
    figure: {
      src: '/figures/evalcard-report-card.png',
      alt: 'evalcard report card: per-case pass and fail, rubric scores, and a ship-decision brief',
      caption: 'The report card an operator reads. Every judge score is labelled [SIMULATED] and capped, because a same-model judge is not an independent reviewer.',
    },
  },
  {
    slug: 'should-i-automate-this',
    title: 'Should I Automate This?',
    tagline: 'A decision tool that tells you whether to hand a task to AI, and hands you a stop-test instead of hype.',
    role: 'Design + build',
    year: '2026',
    status: 'public · 28 tests',
    stack: ['TypeScript', 'Vite', 'Calibrated router', 'Built with Claude Code'],
    metrics: [
      { label: 'Tests passing', value: '28 / 28' },
      { label: 'Calibration goldens', value: '10 / 10' },
      { label: 'Output', value: 'tiered verdict' },
    ],
    tags: ['AI adoption', 'Decision tool', 'Enablement'],
    links: [
      { label: 'Live demo', href: 'https://should-i-automate-this.smartbusinessaillc.workers.dev' },
      { label: 'Source', href: 'https://github.com/rgcareer/should-i-automate-this' },
    ],
    figure: {
      src: '/figures/should-i-automate-verdict.png',
      alt: 'Should I Automate This verdict: a tiered recommendation with a concrete stop-test',
      caption: 'Answer a few questions, get a tier and a stop-test. It will talk you out of automating the wrong thing, which is the honest half of enablement.',
    },
  },
  {
    slug: 'cs-prompt-field-kit',
    title: 'CS Prompt Field Kit',
    tagline: 'Copy-ready prompts for customer-success work, each with a five-element teardown you can actually trust.',
    role: 'Design + build',
    year: '2026',
    status: 'public · 18 cards',
    stack: ['Astro', 'TypeScript', 'Built with Claude Code'],
    metrics: [
      { label: 'Prompt cards', value: '18' },
      { label: 'Each card', value: '5-element teardown' },
      { label: 'Filter by', value: 'CS job to be done' },
    ],
    tags: ['Customer success', 'Prompts', 'Enablement'],
    links: [
      { label: 'Live demo', href: 'https://cs-prompt-field-kit.smartbusinessaillc.workers.dev' },
      { label: 'Source', href: 'https://github.com/rgcareer/cs-prompt-field-kit' },
    ],
    figure: {
      src: '/figures/cs-prompt-field-kit.png',
      alt: 'CS Prompt Field Kit index: filterable cards, each with a five-element prompt teardown',
      caption: 'A kit a CS team opens on the job. Each prompt is torn down into its five moving parts, so people learn the shape, not just the copy.',
    },
  },
  {
    slug: 'sop-mcp',
    title: 'sop-mcp',
    tagline: 'Point any MCP client at a folder of markdown SOPs and FAQs, and your team can search and cite its handbook. Two-minute, no-code install.',
    role: 'Design + build',
    year: '2026',
    status: 'public · npm · 24 tests',
    stack: ['TypeScript', 'MCP (Model Context Protocol) SDK', 'stdio', 'Vitest', 'Built with Claude Code'],
    metrics: [
      { label: 'Tests + stdio', value: '24 + 11' },
      { label: 'Install', value: 'two minutes' },
      { label: 'Tools', value: 'search · get · list' },
    ],
    tags: ['MCP', 'Enablement', 'No-code'],
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/sop-mcp' },
      { label: 'Source', href: 'https://github.com/rgcareer/sop-mcp' },
    ],
    figure: {
      specimen: [
        '$ tools/list',
        '> search_handbook   keyword + heading match, cited excerpts',
        '> get_document      one SOP or FAQ by name',
        '> list_documents    the whole handbook, catalogued',
        '',
        '# point it at a folder of .md SOPs;',
        '# Claude Desktop can now answer from them, with citations.',
      ],
      caption: 'The tool surface a non-technical admin turns on. stdio only, read-only, no database. Path traversal is impossible by design, not by string-filtering.',
    },
  },
  {
    slug: 'victoria-reliability-layer',
    title: 'Victoria 4.0',
    tagline: 'A reliability layer for LLM work: tier routing, human-gated loops, computed confidence, and claim ledgers, so an agent knows where it might be wrong.',
    role: 'Author + operator',
    year: '2026',
    status: 'methodology · worked example shipped',
    stack: ['Methodology', 'Multi-agent', 'Claude', 'Governance'],
    metrics: [
      { label: 'Claim ledger', value: '30 claims' },
      { label: 'Research fan-out', value: '6 agents' },
      { label: 'Faked improvements', value: '0' },
    ],
    tags: ['Reliability', 'Governance', 'AI enablement'],
    home: true,
    figure: {
      specimen: [
        'ROUTER   complexity 3 · stakes 2-3 · external 2',
        '         artifact 3 · recurrence 2 · ambiguity 2',
        'TOTAL    >= 14   ->   DECOMPOSE (never one giant loop)',
        '',
        'LOOP     no loop without a written stop test',
        'LABEL    [SIMULATED] caps confidence at 0.80',
        '         [EXTERNAL]  a human owns the call',
      ],
      caption: 'The router that decides how much process a task earns. Everything below ran under these rules.',
    },
  },
];

export const getCase = (slug: string) => work.find((w) => w.slug === slug);
