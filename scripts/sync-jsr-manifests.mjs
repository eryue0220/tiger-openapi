import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';
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

async function formatJson(value) {
  return prettier.format(JSON.stringify(value), { parser: 'json' });
}

function resolveWorkspaceConstraint(range, version) {
  if (range === 'workspace:*') {
    return `^${version}`;
  }

  if (range === 'workspace:^') {
    return `^${version}`;
  }

  if (range === 'workspace:~') {
    return `~${version}`;
  }

  if (range.startsWith('workspace:')) {
    return range.replace(/^workspace:/, '');
  }

  return undefined;
}

function resolveWorkspaceImportConstraint(range, version) {
  const workspaceConstraint = resolveWorkspaceConstraint(range, version);
  if (workspaceConstraint) {
    return workspaceConstraint;
  }

  // Keep non-workspace semver ranges in sync too
  // (e.g. "^0.3.3" for tiger-openapi in the CLI package).
  if (typeof range === 'string' && range.length > 0) {
    return range;
  }

  return undefined;
}

function getWorkspaceImports(packageJson, workspaceVersions) {
  const imports = {};
  const sections = ['dependencies', 'optionalDependencies', 'peerDependencies'];

  for (const section of sections) {
    for (const [name, range] of Object.entries(packageJson[section] ?? {})) {
      const version = workspaceVersions.get(name);
      if (!version) {
        continue;
      }

      const constraint = resolveWorkspaceImportConstraint(range, version);
      if (!constraint) {
        continue;
      }

      imports[name] = `npm:${name}@${constraint}`;
    }
  }

  return imports;
}

async function syncManifest(packageDir, workspaceVersions) {
  const packageJsonPath = path.join(packageDir, 'package.json');
  const jsrJsonPath = path.join(packageDir, 'jsr.json');
  const packageJson = readJson(packageJsonPath);

  if (packageJson.private || !existsSync(jsrJsonPath)) {
    return;
  }

  const jsrJson = readJson(jsrJsonPath);
  const jsrName = packageJson.jsrName ?? packageJson.name;
  const nextJsrJson = {
    ...jsrJson,
    name: jsrName,
    version: packageJson.version,
  };
  const workspaceImports = getWorkspaceImports(packageJson, workspaceVersions);
  if (Object.keys(workspaceImports).length > 0) {
    nextJsrJson.imports = {
      ...(nextJsrJson.imports ?? {}),
      ...workspaceImports,
    };
  }

  const current = await formatJson(jsrJson);
  const next = await formatJson(nextJsrJson);

  if (current === next) {
    return;
  }

  if (checkOnly) {
    throw new Error(`JSR manifest out of sync: ${path.relative(rootDir, jsrJsonPath)}`);
  }

  writeFileSync(jsrJsonPath, next);
}

const packageDirs = await getPackageDirs();
const workspaceVersions = new Map();

for (const packageDir of packageDirs) {
  const packageJsonPath = path.join(packageDir, 'package.json');
  if (!existsSync(packageJsonPath)) {
    continue;
  }

  const packageJson = readJson(packageJsonPath);
  if (packageJson.name && packageJson.version) {
    workspaceVersions.set(packageJson.name, packageJson.version);
  }
}

for (const packageDir of packageDirs) {
  await syncManifest(packageDir, workspaceVersions);
}
