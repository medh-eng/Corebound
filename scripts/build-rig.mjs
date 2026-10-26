// Builds art-inbox/models/custodian_rigged.glb from the Mixamo FBX files (needs the dev server running).
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const port = process.env.PORT ?? '5173';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.setDefaultTimeout(600000);
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto(`http://localhost:${port}/rig.html`);
await page.waitForFunction(() => window.__rig || window.__rigError);
const r = await page.evaluate(() => window.__rig ?? { error: window.__rigError });
if (r.error) { console.log(r.error); process.exit(1); }
writeFileSync('art-inbox/models/custodian_rigged.glb', Buffer.from(r.b64, 'base64'));
console.log(r.info); console.log(r.clips.join('\n'));
await browser.close();
