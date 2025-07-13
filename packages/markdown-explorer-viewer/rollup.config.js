import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  external: ['react', 'react-dom', 'react-router-dom'],
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      outDir: 'dist'
    }),
    postcss({
      modules: true,
      extract: false,
      inject: true
    }),
    copy({
      targets: [
        { src: 'markdown-explorer-viewer-demo.png', dest: 'dist' },
        { src: 'README.md', dest: 'dist' }
      ]
    })
  ]
});
