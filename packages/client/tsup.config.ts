import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsup';

const coreSourceEntry = path.resolve(
  fileURLToPath(new URL('../core/src/index.ts', import.meta.url))
);

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
  noExternal: [/tiger-openapi-/],
  esbuildOptions(options) {
    options.alias = {
      ...(options.alias ?? {}),
      'tiger-openapi-core': coreSourceEntry,
    };
  },
});
