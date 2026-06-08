import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],

      // ── Web App Manifest ──────────────────────────────────────────
      manifest: {
        name: "CCU Alert — Community Crisis Unit",
        short_name: "CCU Alert",
        description: "Real-time security alerts for Nigerian communities",
        theme_color: "#006400",
        background_color: "#006400",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        categories: ["utilities", "security", "news"],
        icons: [
          { src: "icons/icon-72x72.png",   sizes: "72x72",   type: "image/png" },
          { src: "icons/icon-96x96.png",   sizes: "96x96",   type: "image/png" },
          { src: "icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "icons/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
        screenshots: [
          { src: "screenshots/mobile.png", sizes: "390x844", type: "image/png", form_factor: "narrow"  },
          { src: "screenshots/desktop.png",sizes: "1280x800",type: "image/png", form_factor: "wide"    },
        ],
      },

      // ── Service Worker (Workbox) ───────────────────────────────────
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],

        // Cache strategies
        runtimeCaching: [
          {
            // Firebase API calls — network first, fall back to cache
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "firebase-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            // Anthropic AI API — network only (no caching for security)
            urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i,
            handler: "NetworkOnly",
          },
          {
            // Static assets — cache first
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },

      devOptions: { enabled: true },
    }),
  ],

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:   ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/firestore", "firebase/auth", "firebase/messaging"],
        },
      },
    },
  },
});
