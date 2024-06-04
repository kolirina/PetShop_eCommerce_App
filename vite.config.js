/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
export default defineConfig({
  base: '/',
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [nodePolyfills()],
  test: {},
  server: {
    proxy: {
      '/api': {
        target: 'https://api.eu-central-1.aws.commercetools.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
