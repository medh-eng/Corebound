// Run with: node tests/phone-hud.browser.mjs
// Exercise the real UI and touch controls without loading the 3D world or its assets.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const output = new URL('./evidence/T-028/', import.meta.url);
await mkdir(output, { recursive: true });
const server = await createServer({ server: { host: '127.0.0.1', port: 33681, strictPort: true } });
await server.listen();
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  for (const touch of [true, false]) {
    const page = await browser.newPage({ viewport: touch ? { width: 800, height: 360 } : { width: 1280, height: 720 }, hasTouch: touch });
    await page.clock.install({ time: new Date('2026-10-31T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-10-31T00:00:01Z'));
    const url = `http://127.0.0.1:33681/Corebound/?touch=${touch ? 1 : 0}`;
    await page.route(url, (route) => route.fulfill({ contentType: 'text/html', body: `<!doctype html>
      <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/Corebound/src/ui/style.css"></head><body><script type="module">
      import { UI } from '/Corebound/src/ui/ui.ts';
      import { TouchControls } from '/Corebound/src/ui/touch.ts';
      import { machineAction, machineOutput } from '/Corebound/src/data/controls.ts';
      window.ui = new UI();
      if (${touch}) {
        const controls = new TouchControls({ stick: { x: 0, y: 0 }, mouseDX: 0, mouseDY: 0 });
        controls.update({ mode: 'play', building: false, belt: false, near: true });
      }
      window.ui.hideLoading(); window.ui.showHud();
      window.ui.goals([{ key: 'Now', text: 'Load the electrolyzer — press E' }]);
      window.ui.prompt('Electrolyzer · 7 ice inside · ' + machineAction('load', 'ice') + ' · ' + machineAction('pickup'));
      window.ui.tags([{ x: 480, y: 180, text: machineOutput([{ name: 'Iron plate', n: 3 }]) }]);
      </script></body></html>` }));
    await page.goto(url);
    await page.locator('#help .controls').waitFor();
    if (touch) {
      assert.equal(await page.locator('#help .phone-help p').count(), 11);
      assert.equal(await page.locator('#help .keys').count(), 0);
      const help = await page.locator('#help').boundingBox();
      const vitals = await page.locator('#vitals').boundingBox();
      const tools = await page.locator('.t-tools').boundingBox();
      assert(help.x >= 0 && help.x + help.width <= 800 * 0.4);
      assert(help.width <= 800 * 0.4 && help.y < 360 / 3);
      assert(help.y >= vitals.y + vitals.height);
      assert(help.y + help.height < tools.y);
      assert.equal(await page.locator('#prompt').innerText(), 'Electrolyzer · 7 ice inside · Tap Use to load ice · Pick up');
      await page.screenshot({ path: new URL('phone-help.png', output).pathname });
    } else {
      assert.equal(await page.locator('#help .keys b').first().innerText(), 'W A S D');
      assert.equal(await page.locator('#prompt').innerText(), 'Electrolyzer · 7 ice inside · E Load ice · X Pick up');
      await page.screenshot({ path: new URL('desktop-help.png', output).pathname });
    }
    assert.equal(await page.locator('#tags').innerText(), '3 iron plates ready');
    await page.clock.runFor(19999);
    assert.equal(await page.locator('#help').evaluate((el) => el.style.opacity), '1');
    await page.clock.runFor(1);
    assert.equal(await page.locator('#help').evaluate((el) => el.style.opacity), '0');
    await page.clock.runFor(1300);
    if (touch) {
      await page.screenshot({ path: new URL('phone-after-fade.png', output).pathname, animations: 'disabled' });
      assert.equal(await page.locator('#help').evaluate((el) => getComputedStyle(el).opacity), '0');
    }
    await page.evaluate(() => window.ui.showPause(() => {}));
    assert.equal(await page.locator('#pause .phone-help p').count(), touch ? 11 : 0);
    assert.equal(await page.locator('#pause .keys b').count(), touch ? 0 : 18);
    console.log(`${touch ? 'Phone 800×360' : 'Desktop 1280×720'}: help, prompts, output tags, fade and pause controls pass`);
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}
