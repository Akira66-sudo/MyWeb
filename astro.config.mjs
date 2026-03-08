// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Dokumentasi Konfigurasi: https://astro.build/config
export default defineConfig({
  site: 'https://zidan-idz.my.id',
  output: 'server',
  adapter: netlify(),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});