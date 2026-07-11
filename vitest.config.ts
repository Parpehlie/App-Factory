import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['{apps,packages}/*/src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/.expo/**', '**/dist/**', '**/.turbo/**'],
    reporters: 'default',
  },
});
