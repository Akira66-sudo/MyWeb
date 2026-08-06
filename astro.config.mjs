// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Dokumentasi Konfigurasi: https://astro.build/config
export default defineConfig({
  site: 'https://zidan-idz.my.id',
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  image: {
    domains: ['picsum.photos'],
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});