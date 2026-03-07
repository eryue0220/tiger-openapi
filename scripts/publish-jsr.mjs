import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const packagesDir = path.join(rootDir, 'packages');
const dryRun = process.argv.includes('--dry-run');

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

function getDependencyNames(packageJson, workspacePackageNames) {
  return ['dependencies', 'optionalDependencies', 'peerDependencies']
    .flatMap((field) => Object.keys(packageJson[field] ?? {}))
    .filter((dependencyName) => workspacePackageNames.has(dependencyName));
}

function sortPackagesForPublish(packages) {
  const packagesByName = new Map(packages.map((pkg) => [pkg.packageJson.name, pkg]));
  const visited = new Set();
  const visiting = new Set();
  const ordered = [];

  function visit(packageName) {
    if (visited.has(packageName)) {
      return;
    }

    if (visiting.has(packageName)) {
      throw new Error(`Circular workspace dependency detected for ${packageName}`);
    }

    const pkg = packagesByName.get(packageName);
    if (!pkg) {
      return;
    }

    visiting.add(packageName);
    for (const dependencyName of pkg.workspaceDependencies) {
      visit(dependencyName);
    }
    visiting.delete(packageName);
    visited.add(packageName);
    ordered.push(pkg);
  }

  for (const pkg of packages) {
    visit(pkg.packageJson.name);
  }

  return ordered;
}

function publishPackage(pkg) {
  const args = ['dlx', 'jsr', 'publish'];
  if (dryRun) {
    args.push('--dry-run');
  }

  const result = spawnSync('pnpm', args, {
    cwd: pkg.packageDir,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const packageDirs = await getPackageDirs();
const packages = packageDirs
  .map((packageDir) => {
    const packageJsonPath = path.join(packageDir, 'package.json');
    const jsrJsonPath = path.join(packageDir, 'jsr.json');

    if (!existsSync(jsrJsonPath)) {
      return undefined;
    }

    const packageJson = readJson(packageJsonPath);
    if (packageJson.private) {
      return undefined;
    }

    return {
      packageDir,
      packageJson,
    };
  })
  .filter(Boolean);
const workspacePackageNames = new Set(packages.map((pkg) => pkg.packageJson.name));
const publishablePackages = packages.map((pkg) => ({
  ...pkg,
  workspaceDependencies: getDependencyNames(pkg.packageJson, workspacePackageNames),
}));

for (const pkg of sortPackagesForPublish(publishablePackages)) {
  publishPackage(pkg);
}
