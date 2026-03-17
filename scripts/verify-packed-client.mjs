import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const packageDir = path.join(rootDir, 'packages', 'client');
const packageJsonPath = path.join(packageDir, 'package.json');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const tarballPath = path.join(packageDir, `${packageJson.name}-${packageJson.version}.tgz`);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'pipe',
    encoding: 'utf8',
    ...options,
  });

  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }

  return result;
}

try {
  rmSync(tarballPath, { force: true });
  run('pnpm', ['--dir', packageDir, 'pack']);

  const tarResult = run('tar', ['-xOf', tarballPath, 'package/dist/index.js']);
  const packedIndexJs = tarResult.stdout ?? '';

  if (packedIndexJs.includes('tiger-openapi-core')) {
    console.log(packedIndexJs);
    throw new Error('Packed tiger-openapi still references tiger-openapi-core.');
  }

  console.log('Packed tiger-openapi does not reference tiger-openapi-core.');
} finally {
  rmSync(tarballPath, { force: true });
}
