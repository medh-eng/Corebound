// Landscape Android playtest. Uses real CDP touches for walking/buttons and fault injection for
// interruptions that cannot be driven portably through Chromium. Requires the Vite dev server.
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
mkdirSync('.shots', { recursive: true });
const port = process.env.PORT ?? '5173';
const executablePath = process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch({ executablePath, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const errors = [];
const result = {};
// Some restricted Linux hosts crash Chromium's native gamepad service. This touch-only fallback
// is opt-in, reported in the results, and never changes the game's input code.
const prepare = async (context) => {
  if (process.env.TOUCH_TEST_NO_GAMEPAD === '1') {
    await context.addInitScript(() => Object.defineProperty(navigator, 'getGamepads', { value: () => [] }));
    result.gamepadPollingStubbed = true;
  }
};
const watch = (p) => {
  p.setDefaultTimeout(120000);
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) errors.push(m.text()); });
};
try {
  const context = await browser.newContext({ viewport: { width: 800, height: 360 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await prepare(context);
  const page = await context.newPage();
  watch(page);
  await page.goto(`http://localhost:${port}/?shot=1&touch=1&pitch=0.25&dist=4`);
  await page.waitForFunction(() => window.__ready === true);
  const cdp = await context.newCDPSession(page);
  const touch = (type, points) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
  const frames = async (n) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); };
  const centre = (sel) => page.locator(sel).evaluate((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const position = () => page.evaluate(() => window.__game.state().pos);
  const distance = (a, b) => +Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z).toFixed(2);
  await page.evaluate(() => {
    document.addEventListener('pointerdown', (e) => { if (e.target.matches('.t-look')) window.__walkPointer = e.pointerId; }, true);
  });
  const startWalk = async () => {
    await touch('touchStart', [{ x: 150, y: 260, id: 1 }]);
    await touch('touchMove', [{ x: 150, y: 196, id: 1 }]);
    assert.equal(await page.locator('.t-stick').evaluate((e) => e.classList.contains('hidden')), false, 'joystick arms');
  };
  const released = async () => {
    assert.equal(await page.locator('.t-stick').evaluate((e) => e.classList.contains('hidden')), true, 'joystick releases');
  };
  const restart = async (label) => {
    const before = await position();
    await startWalk(); await frames(12); await touch('touchEnd', []);
    await released();
    const moved = distance(before, await position());
    assert(moved > 0.1, `${label}: movement restarts (moved ${moved}m)`);
    result[label] = moved;
    console.log(`PASS ${label}: moved ${moved}m after restarting`);
  };
  const interrupt = async (label, action, cancelled = false) => {
    await startWalk(); await frames(4); await action(); await frames(2);
    await released();
    if (!cancelled) await touch('touchEnd', []);
    await restart(label);
  };

  result.preset = await page.evaluate(() => ({ touch: document.body.classList.contains('touch'), controls: !document.getElementById('touch').classList.contains('hidden') }));
  assert(result.preset.touch && result.preset.controls, 'phone controls active');
  const css = await page.evaluate(() => ['html', 'body', 'canvas', '#touch', '.t-look', '.a-main'].map((s) => {
    const c = getComputedStyle(document.querySelector(s)); return { selector: s, touchAction: c.touchAction, overscroll: c.overscrollBehavior };
  }));
  assert(css.every((c) => c.overscroll === 'none'), 'game surface prevents overscroll');
  assert(css.filter((c) => c.selector !== 'html').every((c) => c.touchAction === 'none'), 'surface and controls suppress browser touch gestures');
  await frames(4); await page.screenshot({ path: '.shots/touch_hud.png' });

  // A real 60-second held walk; do not replace this with a simulation-time jump.
  const beforeLong = await position();
  await startWalk();
  console.log('Walking continuously for 60 seconds…');
  const started = Date.now();
  await page.waitForTimeout(60000);
  result.longWalkSeconds = (Date.now() - started) / 1000;
  assert.equal(await page.locator('.t-stick').evaluate((e) => e.classList.contains('hidden')), false, 'held joystick survives long walk');
  result.longWalkMetres = distance(beforeLong, await position());
  assert(result.longWalkMetres > 0.1, 'character moved during long walk');
  await touch('touchEnd', []); await released(); await restart('afterLongWalk');

  // Release well outside the joystick's starting area while retaining the original touch.
  await startWalk();
  await touch('touchMove', [{ x: 790, y: 5, id: 1 }]);
  await touch('touchEnd', []); await released(); await restart('outsideRelease');

  await interrupt('pointerCancel', () => page.evaluate(() => {
    document.querySelector('.t-look').dispatchEvent(new PointerEvent('pointercancel', { pointerId: window.__walkPointer, bubbles: true }));
  }));
  await interrupt('lostCapture', async () => {
    await page.evaluate(() => document.querySelector('.t-look').releasePointerCapture(window.__walkPointer));
    // Chromium processes a pending capture change before the next pointer event.
    await touch('touchMove', [{ x: 150, y: 190, id: 1 }]);
  });

  // A document-level release must work even if another surface owns the final event.
  await interrupt('documentRelease', () => page.evaluate(() => {
    document.body.dispatchEvent(new PointerEvent('pointerup', { pointerId: window.__walkPointer, bubbles: true }));
  }));

  // Open Bag with the other thumb while still walking, then close with the visible button.
  await startWalk();
  const bag = await centre('#touch [data-code="Tab"]');
  await touch('touchStart', [{ x: 150, y: 196, id: 1 }, { ...bag, id: 3 }]);
  await frames(4);
  assert.equal(await page.locator('#pack').evaluate((e) => e.classList.contains('hidden')), false, 'Bag opens');
  await released();
  await touch('touchEnd', []);
  await page.screenshot({ path: '.shots/touch_pack.png' });
  const close = await centre('#touch .t-close'); await page.touchscreen.tap(close.x, close.y);
  await frames(4);
  assert.equal(await page.locator('#pack').evaluate((e) => e.classList.contains('hidden')), true, 'panel closes');
  await restart('panelCycle');

  // Inject the same lifecycle events the browser sends; the physical Android app switch is a retest.
  await interrupt('visibilityCycle', () => page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
    delete document.visibilityState;
  }));
  await interrupt('blur', () => page.evaluate(() => window.dispatchEvent(new Event('blur'))));
  await interrupt('pageLifecycle', () => page.evaluate(() => {
    window.dispatchEvent(new Event('pagehide'));
    window.dispatchEvent(new Event('pageshow'));
  }));
  await interrupt('resize', () => page.setViewportSize({ width: 820, height: 360 }));
  await interrupt('rotation', () => page.evaluate(() => {
    window.dispatchEvent(new Event('orientationchange'));
    screen.orientation?.dispatchEvent(new Event('change'));
  }));
  await interrupt('browserGestureCancel', () => touch('touchCancel', []), true);

  // Another left-side pointer must take over, including a reused id whose release was missed.
  await startWalk();
  await page.evaluate(() => {
    const look = document.querySelector('.t-look');
    for (const pointerId of [window.__walkPointer, window.__walkPointer + 100]) {
      look.dispatchEvent(new PointerEvent('pointerdown', { pointerId, clientX: 150, clientY: 260, bubbles: true }));
      look.dispatchEvent(new PointerEvent('pointermove', { pointerId, clientX: 150, clientY: 196, bubbles: true }));
    }
  });
  assert.equal(await page.locator('.t-stick').evaluate((e) => e.classList.contains('hidden')), false, 'new pointer takes over');
  await touch('touchEnd', []);
  await page.evaluate(() => document.dispatchEvent(new PointerEvent('pointerup', { pointerId: window.__walkPointer })));
  await released(); await restart('pointerTakeover');
  await context.close();

  // Keep the existing real-touch mining check on the small view its aim coordinates were written for.
  const small = await browser.newContext({ viewport: { width: 480, height: 270 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await prepare(small);
  const p2 = await small.newPage(); watch(p2);
  await p2.goto(`http://localhost:${port}/?shot=1&touch=1&pitch=0.25&dist=4`);
  await p2.waitForFunction(() => window.__ready === true);
  const cdp2 = await small.newCDPSession(p2);
  const frames2 = async (n) => { for (let i = 0; i < n; i++) await p2.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); };
  await p2.evaluate(() => { window.__game.teleport(1.6, -0.9); window.__game.face(4.5, -3.2); });
  await frames2(30);
  const beforeIce = await p2.evaluate(() => window.__game.state().pack.filter(Boolean).filter((s) => s.id === 'ice').reduce((n, s) => n + s.n, 0));
  const mine = await p2.locator('#touch .a-main').evaluate((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await cdp2.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...mine, id: 2 }] });
  await frames2(120);
  await cdp2.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const state = await p2.evaluate(() => window.__game.state());
  result.mined = state.pack.filter(Boolean); result.goalAfterMining = state.goal;
  const ice = result.mined.filter((s) => s.id === 'ice').reduce((n, s) => n + s.n, 0);
  assert(ice > beforeIce, 'holding Mine collects ice');
  assert.deepEqual(errors, [], 'no browser errors');
  console.log(JSON.stringify(result, null, 1));
  console.log('All touch recovery checks passed; no page errors');
} finally {
  await browser.close();
}
