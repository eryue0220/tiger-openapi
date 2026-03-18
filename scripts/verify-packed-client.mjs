import fs from 'node:fs';
import path from 'node:path';

const filesToCheck = [
  path.resolve('packages/client/dist/index.js'),
  path.resolve('packages/client/dist/browser.js'),
];

for (const file of filesToCheck) {
  const content = fs.readFileSync(file, 'utf-8');
  console.log('content::', content);

  if (content.includes('tiger-openapi-core')) {
    throw new Error(
      `Packed tiger-openapi still references tiger-openapi-core in ${path.relative(process.cwd(), file)}.`
    );
  }
}

console.log('✅ tiger-openapi bundle is clean');
