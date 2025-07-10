import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Deploy to root path to verify GitHub Pages is working
  server: {
    port: 3030,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
