// Usage: node scripts/screenshots.mjs <url-path> <out.png> [width] [height] [waitMs]
// Starts nothing itself: point it at a running vite dev/preview server (PORT env, default 5173).
import { chromium } from 'playwright';
const [path = '/', out = '.shots/shot.png', w = '1280', h = '720', wait = '0'] = process.argv.slice(2);
const port = process.env.PORT ?? '5173';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(`http://localhost:${port}${path}`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 }).catch(() => logs.push('[timeout] __ready never set'));
if (+wait) await page.waitForTimeout(+wait);
await page.screenshot({ path: out });
const extra = await page.evaluate(() => window.__stats ?? null).catch(() => null);
if (extra) console.log(JSON.stringify(extra));
console.log(logs.filter((l) => !l.includes('GPU stall')).slice(-20).join('\n'));
await browser.close();
