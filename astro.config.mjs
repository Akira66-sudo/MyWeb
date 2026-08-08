// @ts-check
// astro.config.mjs
// File konfigurasi utama untuk Astro, mengatur build, adapter (Vercel), integrasi (Tailwind, Sitemap), dan optimasi gambar.
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Dokumentasi Konfigurasi Lengkap: https://astro.build/config
export default defineConfig({
  // URL dasar situs (digunakan untuk sitemap dan canonical URLs)
  site: 'https://zidan-idz.my.id',
  
  // Output mode (static untuk performa tercepat, tidak butuh server aktif)
  output: 'static',
  
  // Adapter Vercel untuk deployment
  adapter: vercel({
    webAnalytics: {
      enabled: true, // Mengaktifkan Vercel Web Analytics
    },
  }),
  
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