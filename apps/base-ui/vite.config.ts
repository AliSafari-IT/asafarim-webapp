import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig((config) => {
  return {
    plugins: [react()],
    base: config.mode === 'production' ? '/docs' : '/',
    server: {
      port: 3000,
      open: true
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@data': resolve(__dirname, './src/data'),
      },
    },
  };
}) 