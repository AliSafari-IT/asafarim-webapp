import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Provide empty shims for Node.js modules
      'fs/promises': './src/shims/fs-shim.js',
      'fs': './src/shims/fs-shim.js',
      'path': './src/shims/path-shim.js',
      'events': './src/shims/events-shim.js',
      'os': './src/shims/os-shim.js',
      'util': './src/shims/util-shim.js',
      'stream': './src/shims/stream-shim.js',
      // Prevent fsevents from being imported
      'fsevents': './src/shims/empty-shim.js',
      // Use our mock implementation instead of the actual package
      '@asafarim/md-file-explorer': './src/shims/md-file-explorer-shim.js'
    }
  },
  optimizeDeps: {
    exclude: ['fsevents', 'chokidar']
  },
  server: {
    port: 3003,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
