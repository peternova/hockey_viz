/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// The project doesn't install Node's type definitions (they'd leak into the
// browser code), so declare the one bit of `process` used here.
declare const process: { env: Record<string, string | undefined> };

/** Build date plus the commit when built on GitHub, for the install page. */
const VERSION = `${new Date().toISOString().slice(0, 10)} (${process.env.GITHUB_SHA?.slice(0, 7) ?? 'local build'})`;

export default defineConfig({
  // Relative paths, so the same build works at peternova.github.io/hockey_viz/,
  // under `vite preview` and from any other folder.
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(VERSION),
  },
  plugins: [
    react(),
    VitePWA({
      // A new version waits until the user taps "Reload", so nobody loses a
      // half-drawn play to an automatic refresh. Registered from PwaStatus.tsx.
      registerType: 'prompt',
      injectRegister: false,
      includeManifestIcons: false, // the icons are already picked up by globPatterns below
      manifest: {
        name: 'Hockey IQ',
        short_name: 'Hockey IQ',
        description:
          'Field hockey positions, plays, rules and terms as animations you can pause and step through, plus a tactics board.',
        lang: 'en-AU',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#f6f7f4',
        theme_color: '#1f6f43',
        categories: ['education', 'sports'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        // Everything the app needs is precached, so every page works with no signal.
        globPatterns: ['**/*.{js,css,html,svg,png}'], // plus the manifest, which the plugin adds itself
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
