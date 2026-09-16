// Generates public/og.png (1200x630) in the Open Book register from an inline SVG.
// Run: node scripts/generate-og.mjs
// Fonts: librsvg renders system faces reliably, so the OG uses a serif for the
// ledger numerals (evokes Zilla Slab) and a system sans for the wordmark. The
// site itself uses the real self-hosted Familjen Grotesk + Zilla Slab.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FDFBF8"/>
  <!-- signature sun patch, hard-edged, top-right -->
  <path d="M 900 0 L 1200 0 L 1200 300 L 840 300 Z" fill="#FFD9B0" opacity="0.9"/>
  <!-- wordmark -->
  <text x="80" y="108" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="#1B1B1F" letter-spacing="-0.5">get smart ai</text>
  <text x="80" y="140" font-family="Helvetica, Arial, sans-serif" font-size="21" fill="#6E6A63">led by Ryan Garver</text>
  <!-- headline -->
  <text x="80" y="300" font-family="Helvetica, Arial, sans-serif" font-size="66" font-weight="700" fill="#1B1B1F" letter-spacing="-1.5">Practical AI for small</text>
  <text x="80" y="376" font-family="Helvetica, Arial, sans-serif" font-size="66" font-weight="700" fill="#1B1B1F" letter-spacing="-1.5">business, in plain sight.</text>
  <!-- ledger motif: two published-price lines with dotted leaders -->
  <text x="80" y="470" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="600" fill="#1B1B1F">The diagnostic</text>
  <line x1="330" y1="463" x2="980" y2="463" stroke="#C9C2B6" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>
  <text x="1120" y="470" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#6E1F2E" text-anchor="end">from $750</text>
  <text x="80" y="522" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="600" fill="#1B1B1F">Automation builds</text>
  <line x1="380" y1="515" x2="980" y2="515" stroke="#C9C2B6" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>
  <text x="1120" y="522" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#6E1F2E" text-anchor="end">from $2,000</text>
  <!-- footer line -->
  <line x1="80" y1="575" x2="1120" y2="575" stroke="#E6E1D9" stroke-width="1.5"/>
  <text x="80" y="608" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#6E6A63">getsmartai.ai · Boise, Idaho · every price published, every number real</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('wrote', out);
