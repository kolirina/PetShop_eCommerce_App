/// <reference types="vitest" />
import { defineConfig } from 'vite';
export default defineConfig({
  base: '/',
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  test: {},
});
