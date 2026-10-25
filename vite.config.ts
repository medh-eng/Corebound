import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  base: process.env.COREBOUND_BASE ?? '/Corebound/',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        viewer: resolve(__dirname, 'viewer.html'),
      },
    },
  },
  test: { include: ['tests/**/*.test.ts'] },
});
