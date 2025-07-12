import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdownUrlPlugin from './vite-md-plugin'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      markdownUrlPlugin()
    ],
    base: isProd ? '/markdown-explorer-viewer/' : '/',  // Match the path in the built HTML file
    server: {
      port: 3003,
      open: true,
      // Handle SPA routing with proper history fallback
      historyApiFallback: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  }
})
