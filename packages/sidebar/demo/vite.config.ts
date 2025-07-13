import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  
  return {
    plugins: [react()],
    base: isProd ? '/sidebar-demo/' : '/',  // Match the path in the built HTML file
    server: {
      port: 3009,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
})
