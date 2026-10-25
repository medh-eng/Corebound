// Automated mini playtest: hold W, then jump + jetpack, and check the Custodian moved and flew.
import { chromium } from 'playwright';
const port = process.env.PORT ?? '5173';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
await page.goto(`http://localhost:${port}/?shot=1&q=low`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 300000 });
const s0 = await page.evaluate(() => window.__game.state());
const frames = async (n) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); };
await page.keyboard.down('KeyW'); await frames(90); await page.keyboard.up('KeyW');
const s1 = await page.evaluate(() => window.__game.state());
await page.keyboard.down('Space'); await frames(80);
const s2 = await page.evaluate(() => window.__game.state());
await page.keyboard.up('Space'); await frames(240);
const s3 = await page.evaluate(() => window.__game.state());
const d = (a, b) => Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y, a.pos.z - b.pos.z);
console.log(JSON.stringify({ walked_m: +d(s0, s1).toFixed(2), alt_after_jetpack_m: +s2.alt.toFixed(2), fuel_after: +s2.fuel.toFixed(2), landed: s3.grounded, alt_end: +s3.alt.toFixed(2) }));
await browser.close();
