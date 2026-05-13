import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/register': 'http://localhost:3000',
      '/login':    'http://localhost:3000',
      '/notes':    'http://localhost:3000',
      '/savedRoutes': 'http://localhost:3000',
      '/trips':    'http://localhost:3000',
    },
  },
})
