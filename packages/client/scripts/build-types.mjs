import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');

execFileSync(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  [
    'exec',
    'tsc',
    '-p',
    'tsconfig.bundle.json',
    '--emitDeclarationOnly',
    '--declaration',
    '--declarationMap',
    '--outDir',
    'dist/types',
  ],
  { cwd: packageRoot, stdio: 'inherit' }
);

mkdirSync(distDir, { recursive: true });

writeFileSync(
  path.join(distDir, 'index.d.ts'),
  "export * from './types/client/src/index.js';\n",
  'utf8'
);

writeFileSync(
  path.join(distDir, 'browser.d.ts'),
  "export * from './types/client/src/browser.js';\n",
  'utf8'
);
