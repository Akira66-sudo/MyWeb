// @ts-check
// astro.config.mjs
// File konfigurasi utama untuk Astro, mengatur build, adapter (Netlify), integrasi (Tailwind, Sitemap), dan optimasi gambar.
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Dokumentasi Konfigurasi Lengkap: https://astro.build/config
export default defineConfig({
  // URL dasar situs (digunakan untuk sitemap dan canonical URLs)
  site: 'https://zidan-idz.my.id',
  
  // Output mode (static = default Astro 5, hybrid sudah digabung ke static)
  output: 'static',
  
  // Adapter Netlify untuk deployment
  adapter: netlify(),
  
  image: {
    // Domain gambar eksternal yang diizinkan untuk dioptimasi oleh komponen <Image /> Astro
    domains: ['picsum.photos', 'raw.githubusercontent.com', 'images.unsplash.com'],
  },
  
  // Integrasi Sitemap otomatis (SEO)
  integrations: [sitemap()],
  
  vite: {
    // Konfigurasi Vite (Bundler default Astro). Tailwind CSS (v4+) kini terintegrasi langsung melalui Vite plugin
    plugins: [tailwindcss()]
  }
});