// Case-study registry. Drives the /work index and each detail page's meta.
// Content curation rule: feature the engineering capability, never the faceless
// product storefronts (KDP/Etsy listings stay unlinked).

export interface CaseFigure {
  /** Screenshot plate (path under /public). */
  src?: string;
  alt?: string;
  /** Intrinsic pixel dimensions — set on every `src` so the browser reserves space (no CLS). */
  width?: number;
  height?: number;
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
  metrics: { label: string; value: string; note?: string }[];
  tags: string[];
  accent?: boolean; // featured (homepage hero)
  links?: { label: string; href: string }[]; // external links (live demo / source / npm)
  flip?: { before: string; after: string }; // before/after "the default way" vs "the built way" (home casebook + /work). <= 140 chars each, no em/en dashes. Migrated from proto/_data.ts at B2'.
  figure: CaseFigure;
}

export const work: CaseStudy[] = [
  {
    slug: 'operation-hired',
    title: 'Operation Hired',
    tagline: 'A job-search intelligence system: it scores thousands of postings and weeds out the fakes.',
    role: 'Design + build',
    year: '2026',
    status: '616 tests passing',
    stack: ['Node', 'SQLite', 'Scoring heuristics', 'Vitest'],
    metrics: [
      { label: 'Postings scored', value: '14,851', note: 'running total, as of July 2026' },
      { label: 'Signals', value: 'fraud · geo · tier' },
      { label: 'Re-score errors', value: '0', note: 'on the 5,905-row re-score pass, June 2026' },
    ],
    tags: ['Data pipeline', 'Scoring', 'Automation'],
    accent: true,
    flip: {
      before: 'You read job posts one by one, and reposts and ghost listings burn hours you never get back.',
      after: 'A scorer reads 14,851 at once, checks each against its source, and surfaces only the real ones.',
    },
    figure: {
      src: '/figures/operation-hired-dashboard.webp',
      alt: 'Operation Hired dashboard: pipeline funnel, scoring distribution, and discovery charts',
      width: 1600, height: 626,
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
    tags: ['LLM eval', 'AI testing', 'No-code'],    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/evalcard' },
      { label: 'Source', href: 'https://github.com/rgcareer/evalcard' },
    ],
    flip: {
      before: 'You eyeball a few model outputs, call it good, and ship with no record of what you checked.',
      after: 'Write cases in plain English, get a report card and a ship, fix-first, or do-not-ship brief.',
    },
    figure: {
      src: '/figures/evalcard-report-card.webp',
      alt: 'evalcard report card: per-case pass and fail, rubric scores, and a ship-decision brief',
      width: 1280, height: 2239,
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
    tags: ['AI adoption', 'Decision tool', 'Enablement'],    links: [
      { label: 'Live demo', href: 'https://should-i-automate-this.smartbusinessaillc.workers.dev' },
      { label: 'Source', href: 'https://github.com/rgcareer/should-i-automate-this' },
    ],
    flip: {
      before: 'You automate on a hunch, then learn in production which tasks a model quietly gets wrong.',
      after: 'Answer a few questions, get a tier and a stop-test that talks you out of the wrong ones first.',
    },
    figure: {
      src: '/figures/should-i-automate-verdict.webp',
      alt: 'Should I Automate This verdict: a tiered recommendation with a concrete stop-test',
      width: 1280, height: 1741,
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
    tags: ['Customer success', 'Prompts', 'Enablement'],    links: [
      { label: 'Live demo', href: 'https://cs-prompt-field-kit.smartbusinessaillc.workers.dev' },
      { label: 'Source', href: 'https://github.com/rgcareer/cs-prompt-field-kit' },
    ],
    figure: {
      src: '/figures/cs-prompt-field-kit.webp',
      alt: 'CS Prompt Field Kit index: filterable cards, each with a five-element prompt teardown',
      width: 1280, height: 2681,
      caption: 'A kit a CS team opens on the job. Each prompt is torn down into its five moving parts, so people learn the shape underneath the copy.',
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
    tags: ['MCP', 'Enablement', 'No-code'],    links: [
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

  // ---- Reliability, cost, and evaluation (2026): public tools that each ship their raw data + a one-command, offline re-derivation of every number ----
  {
    slug: 'llm-cost-autopilot',
    title: 'LLM Cost Autopilot',
    tagline: 'A cost auditor that prices real Claude traffic against the vendor rate table and reports, in dollars with a confidence interval, what prompt caching actually saved.',
    role: 'Design + build',
    year: '2026',
    status: 'public · 83 tests · reproducible',
    stack: ['TypeScript', 'Node', 'citty', 'Vitest', 'Built with Claude Code'],
    metrics: [
      { label: 'bill saved by caching', value: '84.7%', note: 'audited over 10,703 real Claude API calls, 85 of my own sessions, Aug to Sep 2026; the saving is Anthropic\'s prompt caching, priced and measured here (95% CI 83.2 to 86.0)' },
      { label: 'actually billed', value: '$3,959.81', note: 'against a $25,863.40 no-cache counterfactual: the same traffic with every input token at the fresh rate' },
      { label: 'real API calls priced', value: '10,703', note: '10,669 of them (99.7%) read from cache' },
    ],
    tags: ['LLM', 'FinOps', 'Cost', 'Prompt caching'],
    links: [
      { label: 'Source', href: 'https://github.com/rgcareer/portfolio-builds/tree/main/packages/llm-cost-autopilot' },
    ],
    figure: {
      specimen: [
        '$ llm-cost headline',
        'Across 10703 real Claude API calls in 85 of my own Claude',
        'Code sessions (2026-08-16 to 2026-09-15), prompt caching cut',
        'the bill from $25863.40 to $3959.81 actually billed: 84.7%',
        'saved (session-level bootstrap 95% CI 83.2-86.0%); 10669 of',
        '10703 calls (99.7%) read from cache.',
      ],
      caption: 'The tool\'s own headline command against my Claude Code traffic (numbers verbatim, trimmed to fit). It refuses to print a number when no run exists, rather than fall back to a placeholder.',
    },
  },
  {
    slug: 'model-regress',
    title: 'model-regress',
    tagline: 'An eval harness that tells you whether a model swap is a real regression or just the model disagreeing with itself, with the statistics to back the call.',
    role: 'Design + build',
    year: '2026',
    status: 'public · 74 tests · reproducible',
    stack: ['TypeScript', 'Node', 'Claude API (Anthropic SDK)', 'Vitest', 'Built with Claude Code'],
    metrics: [
      { label: 'pass-rate gap, measured', value: '75 pts', note: 'Sonnet 5 (38/40) vs Haiku 4.5 (8/40) on a frozen 40-item golden set, Sep 2026; paired 95% CI 57.5 to 85.8, against a same-model repeat disagreement of 4/40' },
      { label: 'run API spend', value: '$0.24', note: 'the paired run; a separate $0.12 pilot that surfaced an underspecified prompt is disclosed and withdrawn, not hidden' },
      { label: 'min detectable effect', value: '~20 pts', note: 'the published power analysis: at n=40, catching a 5-point regression would need about 628 items, and the protocol says so out loud' },
    ],
    tags: ['LLM eval', 'MLOps', 'Statistics', 'Regression testing'],
    links: [
      { label: 'Source', href: 'https://github.com/rgcareer/portfolio-builds/tree/main/packages/model-regress' },
    ],
    figure: {
      specimen: [
        '$ model-regress estimate --all',
        'A (claude-sonnet-5):  expected $0.0869, 40 calls',
        'B (claude-haiku-4-5): expected $0.0434, 40 calls',
        'A-repeat (sonnet-5):  expected $0.0869, 40 calls  # noise ceiling',
        '',
        '$ model-regress power --n 40 --discordant 0.2',
        'MDE at n=40, power 0.8: 19.81 pp  (5 pp -> need n=628)',
      ],
      caption: 'Cost and statistical power computed before any model is called. The A-vs-A-repeat run measures how much the model disagrees with itself, so a real regression can be told apart from run-to-run noise.',
    },
  },
  {
    slug: 'agent-forensics',
    title: 'Agent Forensics',
    tagline: 'Post-mortem tooling that turns a Claude Code transcript into a redacted record and points at the exact turn where a run broke.',
    role: 'Design + build',
    year: '2026',
    status: 'public · 68 tests · reproducible',
    stack: ['TypeScript', 'Node', 'citty', 'Vitest', 'Built with Claude Code'],
    metrics: [
      { label: 'sessions with a breakdown', value: '50.8%', note: '96 of 189 of my own Claude Code sessions, 36,480 tool calls, Jul to Sep 2026; 95% Wilson CI 43.7 to 57.8' },
      { label: 'sessions analyzed', value: '189', note: 'the most frequent signature was TIMEOUT, in 62 of them' },
      { label: 'tool-call error rate', value: '2.5%', note: '896 of 36,480 calls; 95% Wilson CI 2.3 to 2.6' },
    ],
    tags: ['Agent tooling', 'Observability', 'Forensics'],
    links: [
      { label: 'Source', href: 'https://github.com/rgcareer/portfolio-builds/tree/main/packages/agent-forensics' },
    ],
    figure: {
      specimen: [
        '$ agent-forensics headline',
        'Across 189 of my own Claude Code sessions (2026-07-20 to',
        '2026-09-16; 36480 tool calls), 96 (50.8%, 95% Wilson CI',
        '43.7-57.8%) contain at least one pre-registered breakdown',
        'signature; the most frequent is TIMEOUT (62 sessions);',
        '896 tool calls (2.5%) returned an error.',
      ],
      caption: 'The record holds only counts, durations, and HMAC hashes; no prompt, tool output, or file path can enter it by construction. The redaction is verifiable in the committed data, not asserted.',
    },
  },
];

export const getCase = (slug: string) => work.find((w) => w.slug === slug);
