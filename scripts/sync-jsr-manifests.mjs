import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const packagesDir = path.join(rootDir, 'packages');
const checkOnly = process.argv.includes('--check');

async function getPackageDirs() {
  const entries = await readdir(packagesDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(packagesDir, entry.name))
    .sort();
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function syncManifest(packageDir) {
  const packageJsonPath = path.join(packageDir, 'package.json');
  const jsrJsonPath = path.join(packageDir, 'jsr.json');
  const packageJson = readJson(packageJsonPath);

  if (packageJson.private) {
    return;
  }

  const jsrJson = readJson(jsrJsonPath);
  const jsrName = packageJson.jsrName ?? packageJson.name;
  const nextJsrJson = {
    ...jsrJson,
    name: jsrName,
    version: packageJson.version,
  };

  const current = formatJson(jsrJson);
  const next = formatJson(nextJsrJson);

  if (current === next) {
    return;
  }

  if (checkOnly) {
    throw new Error(`JSR manifest out of sync: ${path.relative(rootDir, jsrJsonPath)}`);
  }

  writeFileSync(jsrJsonPath, next);
}

const packageDirs = await getPackageDirs();

for (const packageDir of packageDirs) {
  syncManifest(packageDir);
}
