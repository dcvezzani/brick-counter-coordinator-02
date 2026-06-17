import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import './scripts/load-aidlc-dev-env.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appPort = Number(process.env.PORT || process.env.AIDLC_APP_PORT) || 5173
const apiPort = Number(process.env.API_PORT || process.env.AIDLC_API_PORT) || 3001

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: appPort,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: true,
      },
    },
    watch: {
      ignored: [path.resolve(__dirname, 'tests/**')],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, 'tests/setup.js')],
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules', 'dist', '.claude/**'],
  },
})
