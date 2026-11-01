// Reports the largest number of uniform slots any shader program uses, against the Android minimum.
// Phones with WebGL 2 may allow only 224 fragment uniform vectors. Needs the dev server running.
import { chromium } from 'playwright';
const port = process.env.PORT ?? '5173';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 640, height: 300 } });
page.setDefaultTimeout(600000);
await page.addInitScript(() => {
  window.__progs = [];
  const link = WebGL2RenderingContext.prototype.linkProgram;
  WebGL2RenderingContext.prototype.linkProgram = function (p) { link.call(this, p); window.__progs.push([this, p]); };
});
await page.goto(`http://localhost:${port}/?shot=1&q=${process.argv[2] ?? 'phone'}&touch=1`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 300000 });
const r = await page.evaluate(() => {
  const slots = { 0x8B52: 1, 0x8B51: 1, 0x8B50: 1, 0x1406: 1, 0x1404: 1, 0x8B5C: 4, 0x8B5B: 3, 0x8B56: 1, 0x8B5E: 1, 0x8B60: 1, 0x8DC1: 1, 0x8B53: 1, 0x8B54: 1, 0x8B55: 1 };
  const out = [];
  for (const [gl, p] of window.__progs) {
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) ?? 0;
    let v = 0; let names = [];
    for (let i = 0; i < n; i++) { const u = gl.getActiveUniform(p, i); v += u.size * (slots[u.type] ?? 1); if (u.size > 8) names.push(`${u.name}×${u.size}`); }
    out.push({ v, linked: gl.getProgramParameter(p, gl.LINK_STATUS), big: names.join(' ') });
  }
  out.sort((a, b) => b.v - a.v);
  return { programs: out.length, top: out.slice(0, 4) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
