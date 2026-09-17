// Copy lint: grep the RENDERED site text (dist/*.html) for AI-writing tells, so a copy
// change can be checked in one command the way the dash gate greps dist for em/en dashes.
//
//   npm run build && npm run copy:lint      # scans dist/ (default)
//   node scripts/copy-lint.mjs <dir>        # scan another built dir
//
// REPORT-ONLY BY DESIGN. It prints every hit with context and exits 1 if any are found,
// so it CAN gate a build, but it is meant as a review aid on OUR OWN copy, never a hard
// filter on third-party text. Rationale: OH's own submissionLint deliberately keeps
// word-level banned lists OUT of its hard gate because a banned-word gate carries a
// documented ~61% false-positive rate on non-native English writing (Liang 2023). So a
// hit here means "a human should look," not "this is wrong." Tune the lists freely.
//
// Rule sources (copied with attribution, NOT imported cross-repo):
//   - operation-hired/server/services/humanizer.js  (AI_PHRASE_SWAPS, SUPERLATIVE_SWAPS)
//   - operation-hired/server/services/coverLetter.js (the "not just X, but Y" ban)
//   - ~/.claude/skills/humanizer/SKILL.md            (§12 overused-word vocabulary)
//   - ~/.claude/skills/seo-audit/references/ai-writing-detection.md

import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(root, process.argv[2] ?? 'dist');

// Pages intentionally written AS AI-slop (a foil/demo of bad marketing copy), excluded
// from the scan so they do not drown the real hits.
const SKIP_PATHS = ['consulting/web-design/examples/generic-ai'];

// Single-word / hyphenated AI-tell vocabulary (word-boundary, case-insensitive). Kept to
// high-signal tells unlikely to be legitimate in plain small-business copy.
const VOCAB = [
  'delve', 'tapestry', 'testament', 'robust', 'showcase', 'showcases', 'showcasing',
  'underscore', 'underscores', 'garner', 'garners', 'pivotal', 'meticulous', 'meticulously',
  'intricate', 'renowned', 'boasts', 'vibrant', 'bustling', 'nestled', 'realm', 'realms',
  'seamless', 'seamlessly', 'leverage', 'leverages', 'leveraging', 'elevate', 'elevates',
  'empower', 'empowers', 'empowering', 'unlock', 'unlocks', 'unleash',
  'foster', 'fosters', 'fostering', 'cutting-edge', 'game-changer', 'game-changing',
  'groundbreaking', 'transformative', 'world-class', 'best-in-class', 'state-of-the-art',
  'plethora', 'myriad', 'moreover', 'furthermore', 'notably', 'ever-evolving', 'ever-changing',
  'fast-paced', 'unparalleled', 'unmatched', 'supercharge', 'supercharged',
];

// Phrase / construction patterns (fillers, the antithesis tells, and the dash backstop).
const PHRASES = [
  { name: 'filler opener', re: /\bit'?s important to note that\b/gi },
  { name: 'filler opener', re: /\bit is important to note that\b/gi },
  { name: 'filler opener', re: /\bit'?s worth noting that\b/gi },
  { name: 'filler opener', re: /\bin today'?s (?:fast-paced|digital|modern|rapidly evolving|ever-changing) world\b/gi },
  { name: 'filler opener', re: /\bat the end of the day\b/gi },
  { name: 'filler opener', re: /\bneedless to say\b/gi },
  { name: 'filler opener', re: /\bit goes without saying\b/gi },
  { name: '"not just X, but Y"', re: /\bnot just\b[^.?!]{1,50}?,?\s+but\b/gi },
  { name: '"not only X but also Y"', re: /\bnot only\b[^.?!]{1,50}?\bbut also\b/gi },
  { name: '"it\'s not X, it\'s Y"', re: /\bit'?s not\b[^.?!]{1,50}?,?\s+it'?s\b/gi },
  { name: '"harness the power/potential"', re: /\bharness(?:es|ing)?\s+the\s+(?:power|potential|full)\b/gi },
  { name: 'em/en dash', re: /[—–]/g },
];

const decode = (s) =>
  s
    .replace(/&#39;|&rsquo;|&apos;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rarr;|&#8594;/g, '->')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&hellip;/g, '...');

// Rendered visible text only: drop scripts (incl. JSON-LD), styles, comments, then tags.
const visibleText = (html) =>
  decode(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim();

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const vocabRe = new RegExp(`\\b(${VOCAB.join('|')})\\b`, 'gi');
const ctx = (text, i, len) => text.slice(Math.max(0, i - 32), i + len + 32).replace(/\s+/g, ' ').trim();

let files;
try {
  files = await walk(distDir);
} catch {
  console.error(`copy-lint: cannot read ${distDir}. Run \`npm run build\` first.`);
  process.exit(2);
}
if (!files.length) { console.error(`copy-lint: no .html in ${distDir}.`); process.exit(2); }

const hits = [];
for (const file of files.sort()) {
  if (SKIP_PATHS.some((s) => file.includes(s))) continue;
  const text = visibleText(await readFile(file, 'utf8'));
  const rel = path.relative(root, file);
  for (const m of text.matchAll(vocabRe)) hits.push({ rel, kind: `word: ${m[0].toLowerCase()}`, ctx: ctx(text, m.index, m[0].length) });
  for (const { name, re } of PHRASES) for (const m of text.matchAll(re)) hits.push({ rel, kind: name, ctx: ctx(text, m.index, m[0].length) });
}

if (!hits.length) {
  console.log(`copy-lint: clean. Scanned ${files.length} page(s) in ${path.relative(root, distDir) || '.'}.`);
  process.exit(0);
}

const byFile = new Map();
for (const h of hits) (byFile.get(h.rel) ?? byFile.set(h.rel, []).get(h.rel)).push(h);
console.log(`copy-lint: ${hits.length} hit(s) across ${byFile.size} page(s). Each is a "look at this," not an auto-fail.\n`);
for (const [rel, list] of byFile) {
  console.log(rel);
  for (const h of list) console.log(`  [${h.kind}]  ...${h.ctx}...`);
  console.log('');
}
process.exit(1);
