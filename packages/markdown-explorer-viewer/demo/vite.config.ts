import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdownUrlPlugin from './vite-md-plugin'

export default defineConfig(({ mode }) => {

  return {
    plugins: [
      react(),
      markdownUrlPlugin()
    ],
    base: '/markdown-explorer-viewer/',  // Match the path in the built HTML file with trailing slash
    server: {
      port: 3004,
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
