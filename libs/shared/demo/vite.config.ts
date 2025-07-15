import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  return {
    plugins: [react(),
    svgr()],
    base: '/shared',
    resolve: {
      alias: {
        '@asafarim/shared': path.resolve(__dirname, '../src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      copyPublicDir: true,
    },
    server: {
      port: 5173,
      strictPort: true,
    }
  };
});