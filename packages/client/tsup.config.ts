import { defineConfig } from 'tsup';

const alias = {
  'tiger-openapi-core': '../core/src/index.ts',
  'tiger-openapi-http': '../http/src/index.ts',
  'tiger-openapi-pb': '../pb/src/index.ts',
  'tiger-openapi-shared': '../shared/src/index.ts',
  'tiger-openapi-stream': '../stream/src/index.ts',
};

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    browser: 'src/browser.ts',
  },
  outDir: 'dist',
  tsconfig: './tsconfig.bundle.json',
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  alias,
  noExternal: [/tiger-openapi-/],
});
