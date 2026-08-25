// Convert case-study figures from PNG to WebP (quality 85), keeping native resolution.
// The 1280px-wide sources are already ~1.6-2x their render slots, so no resize is needed.
// og.png (public/, not public/figures/) is deliberately left as PNG for social-card compatibility.
//
//   npm run figures:webp   # writes a sibling .webp next to each figures/*.png
//
// After running, delete the PNGs and update the src refs (work.ts + the case-study body imgs).

import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', 'figures');

const pngs = (await readdir(dir)).filter((f) => f.endsWith('.png'));
if (!pngs.length) { console.log('No PNGs in public/figures.'); process.exit(0); }

for (const png of pngs) {
  const src = path.join(dir, png);
  const out = src.replace(/\.png$/, '.webp');
  const info = await sharp(src).webp({ quality: 85, effort: 6 }).toFile(out);
  const before = (await sharp(src).metadata()).size ?? 0;
  console.log(`${png} -> ${path.basename(out)}  (${Math.round(before / 1024)}KB -> ${Math.round(info.size / 1024)}KB, ${info.width}x${info.height})`);
}
console.log(`\nDone: ${pngs.length} figures converted.`);
