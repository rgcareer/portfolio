// Generate a real, downloadable, ATS-clean résumé PDF from the /resume page.
//
// It serves the built dist/ with `astro preview`, drives headless Chromium to
// print /resume to Letter-size PDF (Playwright's page.pdf() emulates print media,
// so the @media print block in resume.astro is what renders), and writes it to
// public/resume.pdf so the next build ships it as a static asset.
//
// Run AFTER a build, and re-run whenever resume.astro or site.ts changes:
//   npm run build && npm run resume:pdf && npm run build
//
// (The second build copies the fresh public/resume.pdf into dist/.)

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4331;
const OUT = path.join(root, 'public', 'resume.pdf');

if (!existsSync(path.join(root, 'dist', 'resume', 'index.html'))) {
  console.error('dist/resume/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

const preview = spawn('node', ['node_modules/.bin/astro', 'preview', '--port', String(PORT)], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
});

const waitForServer = () =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('preview server did not start in 30s')), 30000);
    const onData = (buf) => {
      if (/localhost:\d+/.test(buf.toString())) {
        clearTimeout(t);
        preview.stdout.off('data', onData);
        setTimeout(resolve, 400); // small grace for the listener to bind
      }
    };
    preview.stdout.on('data', onData);
    preview.stderr.on('data', (b) => process.stderr.write(b));
  });

const cleanup = () => {
  try { preview.kill('SIGTERM'); } catch {}
};

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}/resume`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: OUT,
    format: 'Letter',
    printBackground: false,
    margin: { top: '0.55in', right: '0.6in', bottom: '0.55in', left: '0.6in' },
  });
  await browser.close();
  console.log(`Wrote ${path.relative(root, OUT)}`);
} catch (err) {
  console.error('PDF generation failed:', err.message);
  cleanup();
  process.exit(1);
} finally {
  cleanup();
}
