import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-packages/asafarim/sidebar/',
  server: {
    port: 3030,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
