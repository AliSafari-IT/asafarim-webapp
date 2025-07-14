import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  
  return {
    plugins: [react()],
    base: isProd ? '/project-card/' : '/',  // Match the repository name for GitHub Pages
    server: {
      port: 3008,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@asafarim/shared': path.resolve(__dirname, '../../../libs/shared/src')
      }
    },
    workspace: {
      root: resolve(__dirname, '../../../libs/shared/src'),
      packages: ['../../../libs/shared/src']
    }
  };
})
 