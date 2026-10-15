import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// BASE_PATH: "/" for a root domain, "/<repo-name>/" for GitHub Pages project sites.
const base = process.env.BASE_PATH ?? './';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      // ARTIFACT=1 builds a preview without the service worker (for embedded hosts that do not allow one).
      disable: process.env.ARTIFACT === '1',
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'fonts/*.ttf', 'icons/*.png'],
      manifest: {
        name: 'Insurance English — Business English dla brokera',
        short_name: 'Insurance EN',
        description: 'Business English dla brokera ubezpieczeń majątkowych. Działa offline.',
        lang: 'pl',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f6f3ec',
        theme_color: '#122642',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ttf,webmanifest}'],
        // jsPDF's optional HTML/SVG renderers are never used here; keep them out of the offline cache.
        globIgnores: ['**/html2canvas*', '**/purify*', '**/index.es-*'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  build: { target: 'es2020', chunkSizeWarningLimit: 1500 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
} as any);
