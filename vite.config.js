/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
export default defineConfig({
  base: '/',
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  plugins: [nodePolyfills()],
  test: {},
});
