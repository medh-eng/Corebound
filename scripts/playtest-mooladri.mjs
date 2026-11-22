// Playtest (M4 slice 3): Mooladri wakes, is calmed in four steps, and opens the valley.
// Places two drills, jumps to the "Follow the tremor" goal, walks up to the Guardian, holds Scan,
// moves the drills, runs a bio-filter, plants three bloom spores with E, and checks the gate opens.
// Needs the dev server on :5173. Exit code 1 if a check fails. Screenshots in .shots/.
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
page.setDefaultTimeout(300000);
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto('http://localhost:5173/?shot=1&t=0.2&q=low&dist=10&pitch=0.3');
await page.waitForFunction(() => window.__ready === true, null, { timeout: 240000 });
const g = (fn, ...a) => page.evaluate(([f, args]) => window.__game[f](...args), [fn, a]);
const frames = (n) => page.evaluate((k) => new Promise((r) => { let i = 0; const f = () => (++i >= k ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const prompt = () => page.evaluate(() => document.querySelector('#prompt')?.innerText ?? document.querySelector('.prompt')?.innerText ?? '');
const checks = []; const check = (ok, what) => { checks.push(`${ok ? 'PASS' : 'FAIL'} ${what}`); };
const press = async (k) => { await page.keyboard.down(k); await frames(2); await page.keyboard.up(k); await frames(2); };
const goal = async () => (await g('state')).goal;
const M = () => g('mooladri');

// Two drills near the base: the roots will reach for them.
const d1 = await g('place', 'auto_drill', 18, -20);
const d2 = await g('place', 'auto_drill', 24, -12);
await g('goalIndex', 'guardian_find'); await frames(2);
check(!(await M()).awake && (await M()).rise === 0, 'Mooladri rests in the ground before the goal');

// 1. Walk towards it: SARATHI notices the shadow, then it wakes and rises.
await g('nearMooladri', 36); await frames(3);
check(await page.evaluate(() => !!window.__game.flags.guardianShadow), 'SARATHI notices the vast shadow at 36 m');
await g('nearMooladri', 20); await frames(3);
check((await M()).wakeT >= 0, 'walking within 26 m wakes it');
check((await M()).air >= 29.9, 'its distress thickens the haze (air pollution 30)');
await g('guardianTime', 4); await frames(2);
const midRise = (await M()).rise;
await g('guardianTime', 18); await frames(3);
let m = await M();
check(midRise > 0.3 && midRise < 1 && m.rise === 1, `it rises over several seconds (${midRise.toFixed(2)} → ${m.rise})`);
check(m.awake && (await goal()) === 'seismic_scan', `awake; goal moves to the seismic scan (now: ${await goal()})`);
check(m.roots === 5, `roots reach the two drills and three wander (${m.roots})`);
await page.screenshot({ path: '.shots/mooladri-awake.png' });

// 2. The valley is closed.
await g('teleportTo', m.gate.x, m.gate.y, m.gate.z, 3); await frames(3);
check(/Living roots close the valley/.test(await prompt()), `prompt at the gate: "${(await prompt()).slice(0, 50)}"`);
check(m.blocked && !m.open, 'the gate blocks the way');

// 3. Seismic scan: hold Scan beside it (the hook puts it a moment from done).
await g('nearMooladri', 16); await frames(2);
await g('seismicAt', 2.9);
await page.mouse.down({ button: 'right' }); await frames(3);
const sp = await prompt();
await frames(6); await page.mouse.up({ button: 'right' }); await frames(2);
m = await M();
check(/Keep holding Scan|Living root/.test(sp) || m.mapped, `scan prompt while holding: "${sp.slice(0, 40)}"`);
check(m.mapped && (await goal()) === 'move_drills', `holding Scan maps the roots (now: ${await goal()})`);
check(m.drillsOnRoots === 2, `both drills stand on roots (${m.drillsOnRoots})`);
check((await g('codex')).includes('mooladri'), 'Mooladri joins the Codex');
await g('guardianTime', 5); await frames(3);
await page.screenshot({ path: '.shots/mooladri-roots.png' });

// 4. Move the drills clear of the roots.
await g('move', d1, 30, 25);
check((await M()).drillsOnRoots === 1 && (await goal()) === 'move_drills', 'one drill moved: still one on a root');
await g('move', d1, 34, 20);   // the other drill has moved up into the first one's place in the list
check((await M()).drillsOnRoots === 0, 'no drill on a root');
await g('advance'); await frames(2);
check((await goal()) === 'bio_filters_valley', `the drills are clear (now: ${await goal()})`);

// 5. A working bio-filter until the haze clears.
await g('place', 'bio_filter', 10, 6);
await g('simulate', 3); await frames(2);
check((await goal()) === 'bio_filters_valley', 'still hazy: the step waits');
await g('pollute', 14, 3, 30); await g('simulate', 1); await frames(2);
check((await goal()) === 'replant_bloom', `haze clears with a working filter (now: ${await goal()})`);

// 6. Plant bloom spores at the three spots (soil must be clean first).
m = await M();
await g('teleportTo', m.plants[0].x, m.plants[0].y, m.plants[0].z, 0.8); await frames(3);
check(/not clean enough/.test(await prompt()), `dirty soil: "${(await prompt()).slice(0, 50)}"`);
await g('pollute', 14, 3, 5); await frames(3);
check(/Bring a bloom/.test(await prompt()), `no bloom yet: "${(await prompt()).slice(0, 50)}"`);
await g('give', 'bloom', 3); await frames(2);
for (let i = 0; i < 3; i++) {
  await g('teleportTo', m.plants[i].x, m.plants[i].y, m.plants[i].z, 0.8); await frames(3);
  const p = await prompt();
  check(/plant bloom spores/.test(p), `spot ${i + 1}: "${p.slice(0, 40)}"`);
  await press('KeyE'); await frames(2);
}
m = await M();
check(m.planted.length === 3 && (await goal()) === 'valley_calm', `three spots planted (now: ${await goal()})`);
await page.screenshot({ path: '.shots/mooladri-planted.png' });

// 7. It settles; the valley opens; the forest cleans faster.
await g('guardianTime', 10); await frames(2);
m = await M();
check(m.calm && (await goal()) === 'done', `Mooladri is calm (now: ${await goal()})`);
check((await g('base')).floraBonus === true, 'flora now cleans twice as fast');
await g('guardianTime', 7); await frames(3);
m = await M();
check(m.open && !m.blocked, 'the roots open the valley path');
await g('teleportTo', m.valley.x, m.valley.y, m.valley.z, 9); await frames(4);
await page.screenshot({ path: '.shots/mooladri-open.png' });
check(errs.length === 0, `no page errors${errs.length ? ': ' + errs[0] : ''}`);
console.log(checks.join('\n'));
await browser.close();
process.exit(checks.some((c) => c.startsWith('FAIL')) ? 1 : 0);
