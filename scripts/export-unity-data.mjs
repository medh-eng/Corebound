// Exports every plain-data constant in src/data/ to JSON for the Unity port.
// Usage: node scripts/export-unity-data.mjs [outDir]   (default: unity-export/)
import { build } from 'esbuild';
import { mkdirSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join, resolve } from 'node:path';

const out = process.argv[2] ?? 'unity-export';
mkdirSync(out, { recursive: true });
const tmp = join(out, '.bundle');
mkdirSync(tmp, { recursive: true });
const files = readdirSync('src/data').filter((f) => f.endsWith('.ts'));
const dataDir = resolve('src/data');
const index = files.map((f) => `export * as ${f.replace('.ts', '').replace(/\W/g, '_')} from '${dataDir}/${f}';`).join('\n');
writeFileSync(join(tmp, 'entry.ts'), index);
const bundle = join(tmp, 'bundle.mjs');
await build({ entryPoints: [join(tmp, 'entry.ts')], bundle: true, format: 'esm', platform: 'node', outfile: bundle, logLevel: 'error' });
const mods = await import(pathToFileURL(bundle).href);

const replacer = (_k, v) => {
  if (v instanceof Map) return Object.fromEntries(v);
  if (v instanceof Set) return [...v];
  if (typeof v === 'function') return undefined;
  if (typeof v === 'number' && !Number.isFinite(v)) return null;
  return v;
};
let n = 0;
const skipped = [];
for (const [mod, exports] of Object.entries(mods)) {
  for (const [name, value] of Object.entries(exports)) {
    if (typeof value === 'function') continue;
    try {
      const json = JSON.stringify(value, replacer, 1);
      if (json === undefined) { skipped.push(`${mod}.${name}`); continue; }
      mkdirSync(join(out, mod), { recursive: true });
      writeFileSync(join(out, mod, `${name}.json`), json);
      n++;
    } catch (e) { skipped.push(`${mod}.${name}: ${e.message}`); }
  }
}
rmSync(tmp, { recursive: true, force: true });
console.log(`Exported ${n} data sets to ${out}/`);
if (skipped.length) console.log('Skipped:', skipped.join(', '));
