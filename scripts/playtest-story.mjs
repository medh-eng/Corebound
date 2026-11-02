// Playtest (M4 slice 2): Huxley's projector, the translator and the memory logs. Jumps to the
// "Listen to Prof. Huxley" goal, walks up to each prop and presses E, and checks the goals move on.
// Needs the dev server on :5173. Exit code 1 if a check fails. Screenshots in .shots/.
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto('http://localhost:5173/?shot=1&t=0.3&q=low');
await page.waitForFunction(() => window.__ready === true, null, { timeout: 240000 });
const g = (fn, ...a) => page.evaluate(([f, args]) => window.__game[f](...args), [fn, a]);
const frames = (n) => page.evaluate((k) => new Promise((r) => { let i = 0; const f = () => (++i >= k ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const prompt = () => page.evaluate(() => document.querySelector('#prompt')?.innerText ?? document.querySelector('.prompt')?.innerText ?? '');
const logOpen = () => page.evaluate(() => !!document.querySelector('#log-viewer.open, #log.open, .log-viewer.open, [data-log-open="1"]') || window.__game.ui?.()?.logOpen);
const checks = []; const check = (ok, what) => checks.push(`${ok ? 'PASS' : 'FAIL'} ${what}`);
const press = async (k) => { await page.keyboard.down(k); await frames(2); await page.keyboard.up(k); await frames(2); };

await g('goalIndex', 'huxley_message'); await frames(2);
check((await g('state')).goal === 'huxley_message', 'goal: listen to Prof. Huxley');
const props = await g('storyProps');
check(props.length === 9, `nine props placed (${props.length})`);

// 1. Huxley's projector by the hatch.
const pj = props.find((p) => p.id === 'projector');
await g('teleportTo', pj.x, pj.y, pj.z, 1.4); await frames(3);
const p1 = await prompt();
check(/Huxley's projector/.test(p1), `prompt at the projector: "${p1.slice(0, 50)}"`);
await page.screenshot({ path: '.shots/story-projector.png' });
await press('KeyE'); await frames(6);
await page.screenshot({ path: '.shots/story-huxley-message.png' });
await press('KeyE'); await frames(3);
check((await g('state')).goal === 'translator', `hearing the message moves on (now: ${(await g('state')).goal})`);

// 2. The translator.
const tr = props.find((p) => p.id === 'translator');
await g('teleportTo', tr.x, tr.y, tr.z, 1.2); await frames(3);
const p2 = await prompt();
check(/Translator/.test(p2), `prompt at the translator: "${p2.slice(0, 40)}"`);
await press('KeyE'); await frames(3);
check((await g('state')).goal === 'memory_logs', `picking it up moves on (now: ${(await g('state')).goal})`);

// 3. Three memory logs.
for (const id of ['log_01', 'log_02', 'log_03']) {
  const l = props.find((p) => p.id === id);
  await g('teleportTo', l.x, l.y, l.z, 1.3); await frames(3);
  const p3 = await prompt();
  check(/Memory log/.test(p3), `prompt at ${id}: "${p3.slice(0, 40)}"`);
  await press('KeyE'); await frames(4);
  if (id === 'log_01') await page.screenshot({ path: '.shots/story-log.png' });
  await press('KeyE'); await frames(2);
}
const after = (await g('state')).goal;
check(after === 'harmony_look', `three logs complete the goal (now: ${after})`);
const lb = props.find((p) => p.id === 'log_05');
await g('teleportTo', lb.x, lb.y, lb.z, 4); await frames(4);
await page.screenshot({ path: '.shots/story-buried-log.png' });
check(errs.length === 0, `no page errors${errs.length ? ': ' + errs[0] : ''}`);
console.log(checks.join('\n'));
await browser.close();
process.exit(checks.some((c) => c.startsWith('FAIL')) ? 1 : 0);
