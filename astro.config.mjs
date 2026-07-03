import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Portable: the canonical URL lives here AND in src/config/site.ts.
// Moving to a personal-brand domain later = change both in one place.
export default defineConfig({
  site: 'https://getsmartai.ai',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [sitemap()],
});
