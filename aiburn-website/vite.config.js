import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildCSPHeader, CSP_POLICY, SECURITY_HEADERS } from './security.config.js'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    headers: {
      'Content-Security-Policy-Report-Only': buildCSPHeader(CSP_POLICY, 'report-only'),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  preview: {
    port: 5173,
    headers: SECURITY_HEADERS,
  },
  build: {
    // Ensure no secrets leak into bundle
    rollupOptions: {
      output: {
        // Add integrity checks for production
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]',
      },
    },
  },
})
