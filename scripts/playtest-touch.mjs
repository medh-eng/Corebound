// Phone playtest: a landscape Android-sized screen with touch only. Walks with the joystick, opens the
// backpack with the Bag button and closes it with ✕, then mines ice by holding the Mine button.
// Needs the dev server running. Screenshots go to .shots/touch_*.png.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('.shots', { recursive: true });
const port = process.env.PORT ?? '5173';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const context = await browser.newContext({ viewport: { width: 800, height: 360 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
page.setDefaultTimeout(600000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) errors.push(m.text()); });
await page.goto(`http://localhost:${port}/?shot=1&touch=1&pitch=0.25&dist=4`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 300000 });
const cdp = await context.newCDPSession(page);
const touch = (type, points) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
const frames = async (n) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); };
const centre = async (sel) => page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel);
const result = {};
result.preset = await page.evaluate(() => ({ touch: document.body.classList.contains('touch'), controls: !document.getElementById('touch').classList.contains('hidden') }));
await frames(4);
await page.screenshot({ path: '.shots/touch_hud.png' });

// 1. Walk forward with the joystick (left thumb).
const before = await page.evaluate(() => window.__game.state().pos);
await touch('touchStart', [{ x: 150, y: 260, id: 1 }]);
await touch('touchMove', [{ x: 150, y: 196, id: 1 }]);
await frames(40);
await touch('touchEnd', []);
const after = await page.evaluate(() => window.__game.state().pos);
result.walked = +Math.hypot(after.x - before.x, after.y - before.y, after.z - before.z).toFixed(2);

// 3. Open the backpack with Bag, then close it with ✕.
const bag = await centre('#touch [data-code="Tab"]');
await touch('touchStart', [{ x: bag.x, y: bag.y, id: 3 }]); await touch('touchEnd', []);
await frames(4);
result.packOpened = await page.evaluate(() => !document.getElementById('pack').classList.contains('hidden'));
await page.screenshot({ path: '.shots/touch_pack.png' });
const close = await centre('#touch .t-close');
await page.touchscreen.tap(close.x, close.y);
await frames(4);
result.packClosed = await page.evaluate(() => document.getElementById('pack').classList.contains('hidden'));

// 2. Mine ice by holding Mine (right thumb), aimed by facing the crystal. The aim numbers are the
//    mouse playtest's, which assume its 480 × 270 view, so this step runs on a small phone screen.
await context.close();   // one game at a time: the software renderer is slow
const small = await browser.newContext({ viewport: { width: 480, height: 270 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const p2 = await small.newPage();
p2.setDefaultTimeout(600000);
p2.on('pageerror', (e) => errors.push(e.message));
await p2.goto(`http://localhost:${port}/?shot=1&touch=1&pitch=0.25&dist=4`);
await p2.waitForFunction(() => window.__ready === true, null, { timeout: 300000 });
const cdp2 = await small.newCDPSession(p2);
const frames2 = async (n) => { for (let i = 0; i < n; i++) await p2.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); };
await p2.evaluate(() => { window.__game.teleport(1.6, -0.9); window.__game.face(4.5, -3.2); });
await frames2(30);
const mine = await p2.evaluate(() => { const r = document.querySelector('#touch .a-main').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
await cdp2.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: mine.x, y: mine.y, id: 2 }] });
await frames2(120);
await cdp2.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
const s = await p2.evaluate(() => window.__game.state());
result.mined = s.pack.filter(Boolean);
result.goalAfterMining = s.goal;

console.log(JSON.stringify(result, null, 1));
console.log(errors.length ? 'ERRORS:\n' + errors.slice(0, 10).join('\n') : 'no page errors');
await browser.close();
