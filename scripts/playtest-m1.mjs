// Automated Chapter 1 run: mine real ice with the laser, then build the air supply and breathe.
import { chromium } from 'playwright';
const port = process.env.PORT ?? '5173';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 480, height: 270 } });
page.setDefaultTimeout(600000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`http://localhost:${port}/?shot=1&q=low&pitch=0.35&dist=6`);
await page.waitForFunction(() => window.__ready === true);
const frames = async (n) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); };
const st = () => page.evaluate(() => window.__game.state());
const log = {};
// 1. Walk toward the ice crystal and laser it.
await page.evaluate(() => { window.__game.teleport(2.2, -1.6); window.__game.face(4.5, -3.2); });
await frames(5);
await page.evaluate(() => { window.__laser = true; });
await frames(150);
await page.evaluate(() => { window.__laser = false; });
let s = await st();
log.iceMined = s.pack.filter(Boolean).filter((x) => x.id === 'ice').reduce((a, x) => a + x.n, 0);
log.goalAfterIce = s.goal;
// 2. Dig the ground for silica with the laser (aim down at the grass ahead).
await page.evaluate(() => { window.__game.teleport(-6, -6); window.__game.face(-3, -6); });
await page.evaluate(() => { window.__laser = true; });
await frames(200);
await page.evaluate(() => { window.__laser = false; });
s = await st();
log.afterDigging = s.pack.filter(Boolean).map((x) => `${x.n} ${x.id}`).join(', ');
// 3. Craft, place, load and breathe.
await page.evaluate(() => { const g = window.__game; g.give('iron_ore', 6); g.give('silica', 4); g.craft('electrolyzer'); g.place('electrolyzer', 9.5, 2.5); g.loadIce(4); });
await frames(60);
await page.evaluate(() => window.__game.teleport(8.6, 5.2));
await frames(420);
s = await st();
log.shelterO2 = +s.shelterO2.toFixed(1); log.oxygen = +s.oxygen.toFixed(2); log.goalAtEnd = s.goal; log.machines = s.machines;
log.errors = errors;
console.log(JSON.stringify(log, null, 1));
await browser.close();
