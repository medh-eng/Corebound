// Mooladri screenshots: resting, awake (with root map), calm with the valley open.
import { chromium } from 'playwright';
const [out = '.shots/moo', w = 1280, h = 720, q = 'high', t = '0.3'] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
page.setDefaultTimeout(300000);
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto(`http://localhost:5173/?shot=1&t=${t}&q=${q}&dist=11&pitch=0.32`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 240000 });
const g = (fn, ...a) => page.evaluate(([f, args]) => window.__game[f](...args), [fn, a]);
const frames = (n) => page.evaluate((k) => new Promise((r) => { let i = 0; const f = () => (++i >= k ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await g('place', 'auto_drill', 18, -20); await g('place', 'auto_drill', 22, -14);
await g('goalIndex', 'guardian_find'); await g('nearMooladri', 30); await frames(3);
await page.screenshot({ path: `${out}-1-rest.png` });
await g('nearMooladri', 20); await frames(2); await g('guardianTime', 25); await frames(3);
await g('nearMooladri', 19, +(process.env.ANG ?? 0)); await frames(3);
await page.screenshot({ path: `${out}-2-awake.png` });
await g('seismicAt', 2.99); await page.mouse.down({ button: 'right' }); await frames(4); await page.mouse.up({ button: 'right' });
await g('guardianTime', 5); await frames(3);
console.log(JSON.stringify(await g('mooladri')));
await page.screenshot({ path: `${out}-3-roots.png` });
if (process.env.CALM) {
  await g('goalIndex', 'valley_calm'); await g('guardianTime', 12); await g('guardianTime', 8); await frames(2);
  await g('nearMooladri', 22, +(process.env.ANG ?? 0) + 20); await frames(3);
  console.log(JSON.stringify(await g('mooladri')));
  await page.screenshot({ path: `${out}-4-calm.png` });
}
console.log('errors', errs.slice(0, 3));
await browser.close();
