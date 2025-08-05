import { defineConfig } from 'vite'; 
import react from '@vitejs/plugin-react'; 
import { VitePWA } from 'vite-plugin-pwa'; 
 
// https://vitejs.dev/config/ 
export default defineConfig({ 
  plugins: [ 
    react(), 
    VitePWA({ 
      registerType: 'autoUpdate', 
      includeAssets: [ 
        'ResourceHub.png', 
        'favicon.ico', 
        'apple-touch-icon.png', 
        'safari-pinned-tab.svg' 
      ], 
      manifest: { 
        name: 'ResourceHub', 
        short_name: 'ResourceHub', 
        description: 'ResourceHub - A complete resource management solution', 
        theme_color: '#ffffff', 
        background_color: '#ffffff', 
        display: 'standalone', 
        orientation: 'portrait', 
        start_url: '/', 
        id: 'resourcehub-pwa', 
        icons: [ 
          { 
            src: '/pwa-assets/192.png', 
            sizes: '192x192', 
            type: 'image/png', 
            purpose: 'any' 
          }, 
          { 
            src: '/pwa-assets/512.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'any' 
          }, 
          { 
            src: '/pwa-assets/192-maskable.png', 
            sizes: '192x192', 
            type: 'image/png', 
            purpose: 'maskable' 
          }, 
          { 
            src: '/pwa-assets/512-maskable.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'maskable' 
          } 
        ] 
      }, 
      devOptions: { 
        enabled: true, 
        type: 'module' 
      }, 
      workbox: { 
        globDirectory: 'dist',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif}'], 
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // Increasing to 3 MB
        runtimeCaching: [ 
          { 
            urlPattern: /https:\/\/fonts\.googleapis\.com\/.*/i, 
            handler: 'CacheFirst', 
            options: { 
              cacheName: 'google-fonts-cache', 
              expiration: { 
                maxEntries: 10, 
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year 
              }, 
              cacheableResponse: { 
                statuses: [0, 200] 
              } 
            } 
          } 
        ] 
      } 
    }) 
  ], 
  optimizeDeps: { 
    exclude: ['lucide-react'], 
  }, 
  server: { 
    host: 'localhost', 
    // Don't specify port so it can flexibly use what's available 
  }, 
  base: '/', 
}); 
