import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
  outDir: 'dist',
  tsconfig: './tsconfig.bundle.json',
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  noExternal: [/^tiger-openapi$/],
});
