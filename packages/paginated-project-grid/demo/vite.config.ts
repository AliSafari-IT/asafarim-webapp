import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  
  return {
    plugins: [react()],
    base: isProd ? '/paginated-project-grid/' : '/',  // Match the repository name for GitHub Pages
    server: {
      port: 3007,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
})
 