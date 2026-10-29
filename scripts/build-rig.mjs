// Builds art-inbox/models/<character>_rigged.glb from that character's Mixamo FBX files,
// then processes it into public/assets/models (needs the dev server running).
// Usage: node scripts/build-rig.mjs [custodian|huxley]   (npm run rig -- huxley)
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const character = process.argv[2] ?? 'custodian';
const port = process.env.PORT ?? '5173';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.setDefaultTimeout(600000);
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto(`http://localhost:${port}/rig.html?c=${encodeURIComponent(character)}`);
await page.waitForFunction(() => window.__rig || window.__rigError);
const r = await page.evaluate(() => window.__rig ?? { error: window.__rigError });
await browser.close();
if (r.error) { console.log(r.error); process.exit(1); }
const out = `art-inbox/models/${character}_rigged.glb`;
writeFileSync(out, Buffer.from(r.b64, 'base64'));
console.log(`${out}: ${r.info}`); console.log(r.clips.join('\n'));
execFileSync('node', ['scripts/process-assets.mjs', `${character}_rigged`], { stdio: 'inherit' });
