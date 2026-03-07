import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();

const entrypoints = [
  { js: 'dist/index.js', dts: './index.d.ts' },
  { js: 'dist/browser.js', dts: './browser.d.ts' },
];

for (const entrypoint of entrypoints) {
  const jsPath = path.join(rootDir, entrypoint.js);
  const banner = `// @ts-self-types="${entrypoint.dts}"\n`;
  const source = readFileSync(jsPath, 'utf8');

  if (source.startsWith(banner)) {
    continue;
  }

  const nextSource = source.startsWith('// @ts-self-types=')
    ? source.replace(/^\/\/ @ts-self-types=.*\n/, banner)
    : `${banner}${source}`;

  writeFileSync(jsPath, nextSource);
}
