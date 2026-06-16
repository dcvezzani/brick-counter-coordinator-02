import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import './scripts/load-aidlc-dev-env.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appPort = Number(process.env.PORT || process.env.AIDLC_APP_PORT) || 5173

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: appPort,
    watch: {
      ignored: [path.resolve(__dirname, 'tests/**')],
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules', 'dist', '.claude/**'],
  },
})
