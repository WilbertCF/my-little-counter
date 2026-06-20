import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/my-little-counter/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My Little Counter',
        short_name: 'Counter',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        start_url: '/my-little-counter/',
        icons: [
          { src: '/my-little-counter/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/my-little-counter/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})