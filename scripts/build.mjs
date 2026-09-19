// 把插件编译成 WebAssembly Component 并放进 dist/。
import { componentize } from '@bytecodealliance/componentize-js';
import { mkdir, readFile, rm, writeFile, copyFile, access } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const manifest = JSON.parse(await readFile(join(root, 'manifest.json'), 'utf8'));
const source = await readFile(join(root, 'src', 'plugin.js'), 'utf8');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const { component } = await componentize(source, {
  witPath: join(root, 'wit'),
  worldName: 'psys-world-v4',
});

await writeFile(join(dist, manifest.entry), component);
await copyFile(join(root, 'manifest.json'), join(dist, 'manifest.json'));
try {
  await access(join(root, manifest.icon));
  await copyFile(join(root, manifest.icon), join(dist, manifest.icon));
} catch {}

console.log(`built -> ${join(dist, manifest.entry)} (${component.length} bytes)`);

if (process.argv.includes('--package')) {
  // .abp 就是个 zip；用系统 zip 避免再引一个依赖。
  const { execFileSync } = await import('node:child_process');
  const abp = join(root, `${manifest.name.replaceAll(' ', '-')}-${manifest.version}.abp`);
  await rm(abp, { force: true });
  execFileSync('zip', ['-r', '-q', abp, '.'], { cwd: dist });
  console.log(`packaged -> ${abp}`);
}
