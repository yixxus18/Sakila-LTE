import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true
  },
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://24.199.119.80',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
