// Turning the phone: start upright, play, turn sideways and back; the picture must fill the screen
// each time (the Commander saw it stay half-width after choosing landscape). Needs the dev server.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const port = process.env.PORT ?? '5173';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const context = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
// The game never hears a size announcement, as when Android reports a turn before the new size is
// ready: only the game's own every-frame check can fit the picture.
await context.addInitScript(() => {
  const SIZE = new Set(['resize', 'orientationchange', 'fullscreenchange']);
  const add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (SIZE.has(type) && (this === window || this === document || this === window.visualViewport || this === screen.orientation)) return;
    return add.call(this, type, fn, opts);
  };
});
const page = await context.newPage();
page.setDefaultTimeout(300000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`http://localhost:${port}/?shot=1&touch=1&q=phone`);
await page.waitForFunction(() => window.__ready === true);
const frames = async (n) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); };
const fills = () => page.evaluate(() => { const c = document.querySelector("canvas"); const r = c.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), vw: innerWidth, vh: innerHeight, sw: c.style.width, bw: c.width, n: document.querySelectorAll("canvas").length }; });
const results = {};
assert.equal(await page.locator('#rotate').isVisible(), true, 'upright shows the turn screen');
await page.locator('#rotate-skip').tap();

await frames(3);
results.upright = await fills();
for (const [name, w, h] of [['sideways', 740, 360], ['uprightAgain', 360, 740], ['sidewaysAgain', 800, 360]]) {
  await page.setViewportSize({ width: w, height: h });
  await frames(3);
  results[name] = await fills();
  assert.equal(results[name].w, w, `${name}: picture width fills the screen`);
  assert.equal(results[name].h, h, `${name}: picture height fills the screen`);
}
await page.screenshot({ path: '.shots/rotate_sideways.png' });
console.log(JSON.stringify(results));
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'all rotation checks pass; no page errors');
await browser.close();
