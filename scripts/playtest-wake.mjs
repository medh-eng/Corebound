// Playtest (M4 slice 1): the wake-up. A new game opens on the crash site; SARATHI's intro lines play in
// order; you cannot walk until the view swings round; reaching the shelter completes the first goal;
// standing at the module refills the suit from its reserve; a stuck hint arrives when nothing moves on.
// Needs the dev server on :5173. Exit code 1 if a check fails.
import { chromium } from 'playwright';
const touch = process.argv.includes('--touch');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
// The headless browser draws about one frame every few seconds, so the page is small and the checks wait for frames.
const page = await browser.newPage({ viewport: touch ? { width: 800, height: 360 } : { width: 640, height: 360 } });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto(`http://localhost:5173/?shot=1&wake=1&t=0.02&q=low${touch ? '&touch=1' : ''}`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 240000 });
const g = (fn, ...a) => page.evaluate(([f, args]) => window.__game[f](...args), [fn, a]);
const frames = (n) => page.evaluate((k) => new Promise((r) => { let i = 0; const f = () => (++i >= k ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const line = () => page.evaluate(() => document.querySelector('#sarathi .line')?.textContent ?? '');
const checks = []; const check = (ok, what) => { checks.push(`${ok ? 'PASS' : 'FAIL'} ${what}`); };

// 1. The lines arrive in order. Jump the clock beat by beat rather than waiting in the slow browser.
const beats = [1.2, 6.5, 12, 17, 23, 29, 35];
const said = [];
for (const t of beats) { await g('openingAt', t - 0.01); await frames(2); said.push(await line()); }
check(said[0].startsWith('Cryo-pod seals hiss open'), `first line: "${said[0].slice(0, 40)}…"`);
check(new Set(said).size === beats.length, `seven different lines in turn (${new Set(said).size})`);
check(said[6].includes('shelter dome'), 'last line points to the shelter');

// 2. Walking is locked at the start, free after the camera swings.
await g('openingAt', 2);
const p0 = (await g('state')).pos;
await page.keyboard.down('KeyW'); await frames(4); await page.keyboard.up('KeyW');
const p1 = (await g('state')).pos;
const moved0 = Math.hypot(p1.x - p0.x, p1.y - p0.y, p1.z - p0.z);
check(moved0 < 0.05, `cannot walk during the opening shot (moved ${moved0.toFixed(2)} m)`);
await g('openingAt', 20); await frames(2);
await page.keyboard.down('KeyW'); await frames(6); await page.keyboard.up('KeyW');
const p2 = (await g('state')).pos;
const moved1 = Math.hypot(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
check(moved1 > 0.15, `can walk after the view swings round (moved ${moved1.toFixed(2)} m)`);
await page.screenshot({ path: `.shots/wake-after${touch ? '-touch' : ''}.png` });

// 3. A stuck hint names the first milestone's help (after the wake-up's lines have finished).
await g('openingAt', 60); await frames(2);
await g('stuckNow'); await page.waitForFunction(() => /daylight/.test(document.querySelector('#sarathi .line')?.textContent ?? '') && /shelter beside/.test(document.querySelector('#sarathi .line')?.textContent ?? ''), null, { timeout: 120000 }).catch(() => {});
const hint = await line();
check(hint.includes('daylight') && hint.includes('shelter'), `stuck hint: "${hint.slice(0, 60)}…"`);

// 4. Reaching the shelter completes the wake goal.
check((await g('state')).goal === 'wake', 'first goal is the wake-up');
await g('teleport', 8, 5); await frames(3);
const goal = (await g('state')).goal;
check(goal !== 'wake', `reaching the shelter completes it (now: ${goal})`);
await page.screenshot({ path: `.shots/wake-shelter${touch ? '-touch' : ''}.png` });

// 5. The module's last air refills the suit, and runs down as it does.
await page.evaluate(() => { const b = window.__game.base(); b.oxygen = 0.3; });
const m0 = await page.evaluate(() => window.__game.base().moduleO2);
await g('teleport', -0.2, -2.3); await frames(8);
const after = await page.evaluate(() => ({ o: window.__game.base().oxygen, m: window.__game.base().moduleO2 }));
check(after.o > 0.3 && after.m < m0, `module air refills the suit (oxygen ${after.o.toFixed(2)}, module ${m0} → ${after.m.toFixed(1)})`);

console.log(checks.join('\n'));
if (errs.length) console.log('page errors:', errs.slice(0, 5));
await browser.close();
process.exit(checks.some((c) => c.startsWith('FAIL')) || errs.length ? 1 : 0);
