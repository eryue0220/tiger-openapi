import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@tiger-openapi/shared': resolve(rootDir, 'packages/shared/src/index.ts'),
      '@tiger-openapi/http': resolve(rootDir, 'packages/http/src/index.ts'),
      '@tiger-openapi/pb': resolve(rootDir, 'packages/pb/src/index.ts'),
      '@tiger-openapi/stream': resolve(rootDir, 'packages/stream/src/index.ts'),
      '@tiger-openapi/core': resolve(rootDir, 'packages/core/src/index.ts'),
      '@tiger-openapi/node': resolve(rootDir, 'packages/node/src/index.ts'),
      '@tiger-openapi/browser': resolve(rootDir, 'packages/browser/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/**/*.{test,spec}.{ts,tsx}'],
  },
});
