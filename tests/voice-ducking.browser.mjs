// Run with: node tests/voice-ducking.browser.mjs
// Uses a real decoded MP3 and Web Audio graph, without loading the 3D world.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const server = await createServer({ server: { host: '127.0.0.1', port: 33681, strictPort: true } });
await server.listen();
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
try {
  const page = await browser.newPage();
  const url = 'http://127.0.0.1:33681/Corebound/?voice-check=1';
  await page.route(url, (route) => route.fulfill({ contentType: 'text/html', body: `<!doctype html>
    <html><head><meta charset="utf-8"></head><body><script type="module">
    import { UI } from '/Corebound/src/ui/ui.ts';
    import { Sound } from '/Corebound/src/audio/sound.ts';
    import { VOICE_FILE } from '/Corebound/src/data/voice.ts';
    window.ui = new UI(); window.sound = new Sound();
    window.sound.start(); window.sound.ctx.resume();
    window.ui.sarathi(Object.keys(VOICE_FILE)[0], 1);
    window.ready = true;
    </script></body></html>` }));
  await page.goto(url);
  await page.waitForFunction(() => window.ready && window.sound.voiceSrc
    && Math.abs(window.sound.musicDuck.gain.value - 0.45) < 0.001
    && Math.abs(window.sound.musicBus.gain.value - 0.33) < 0.001
    && Math.abs(window.sound.sfxBus.gain.value - 0.8) < 0.001);
  const during = await page.evaluate(() => ({
    state: window.sound.ctx.state,
    duration: window.sound.voiceSrc.buffer.duration,
    music: window.sound.musicBus.gain.value,
    duck: window.sound.musicDuck.gain.value,
    effects: window.sound.sfxBus.gain.value,
    subtitle: !document.querySelector('#sarathi').classList.contains('hidden'),
  }));
  assert.equal(during.state, 'running');
  assert(during.duration > 0);
  assert(Math.abs(during.duck - 0.45) < 0.001);
  assert(Math.abs(during.music - 0.33) < 0.001);
  assert(Math.abs(during.effects - 0.8) < 0.001);
  assert(during.subtitle);
  await page.waitForFunction(() => window.sound.voiceSrc === null, undefined, { timeout: (during.duration + 3) * 1000 });
  assert(await page.locator('#sarathi').evaluate((el) => !el.classList.contains('hidden')));
  await page.waitForFunction(() => window.sound.musicDuck.gain.value > 0.999);
  await page.waitForFunction(() => document.querySelector('#sarathi').classList.contains('hidden'));
  console.log(JSON.stringify({ ...during, restored: 1, result: 'Real MP3, music dip, unaffected SFX, natural end and subtitle tail pass' }));
} finally {
  await browser.close();
  await server.close();
}
