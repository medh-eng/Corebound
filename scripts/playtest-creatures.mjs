// Playtest (T-037): bring a grazer near and check SARATHI says her first and shy remarks once each. Needs the dev server on :5173.
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto('http://localhost:5173/?shot=1&t=0.35');
await page.waitForFunction(() => window.__ready === true, null, { timeout: 240000 });
const said = new Set();
const t0 = Date.now();
while (Date.now() - t0 < 240000 && said.size < 2) {
  await page.evaluate(() => { window.__game.creatureTalkNow(); window.__game.bringCreature('grazer', 9); });
  await page.waitForTimeout(1500);
  const line = await page.evaluate(() => document.querySelector('#sarathi .line')?.textContent ?? '');
  if (line.match(/grazer/i)) said.add(line);
  if (said.size === 1) { await page.evaluate(() => { window.__game.creatureTalkNow(); window.__game.bringCreature('grazer', 3); }); await page.waitForTimeout(2500); const l2 = await page.evaluate(() => document.querySelector('#sarathi .line')?.textContent ?? ''); if (l2.match(/grazer/i)) said.add(l2); }
}
console.log('SARATHI said:', [...said]);
console.log('flags', await page.evaluate(() => JSON.stringify(Object.keys(window.__game.flags ?? {}))).catch(() => '?'));
await page.screenshot({ path: '.shots/grazer.png' });
console.log('errors', errs.slice(0, 5));
await browser.close();
