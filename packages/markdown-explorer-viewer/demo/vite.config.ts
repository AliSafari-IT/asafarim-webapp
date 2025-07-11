import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    base: isProd ? '/markdown-explorer-viewer/' : '/',  // Match the path in the built HTML file
    server: {
      port: 3003,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  }
})
