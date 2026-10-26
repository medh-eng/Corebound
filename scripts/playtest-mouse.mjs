// Real-input check: hold the left mouse button on the ice crystal and confirm ice is collected.
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 480, height: 270 } });
page.setDefaultTimeout(600000);
await page.goto(`http://localhost:${process.env.PORT ?? 5173}/?shot=1&q=low&pitch=0.25&dist=4`);
await page.waitForFunction(() => window.__ready === true);
const frames = async (n) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); };
await page.evaluate(() => { window.__game.teleport(1.6, -0.9); window.__game.face(4.5, -3.2); });
await frames(60);
await page.mouse.move(240, 135);
await page.mouse.down();
await frames(120);
await page.mouse.up();
const s = await page.evaluate(() => window.__game.state());
console.log(JSON.stringify({ pack: s.pack.filter(Boolean), goal: s.goal }));
await page.screenshot({ path: '.shots/mouse.png' });
await browser.close();
