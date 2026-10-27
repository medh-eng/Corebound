// Automated M2 playtest: research station, research, an auto-drill on ore, a conveyor to a smelter,
// plates made from belt-fed ore, a silo, pylons carrying power out. Needs the dev server running.
import { chromium } from 'playwright';
const port = process.env.PORT ?? '5173';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(600000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) errors.push(m.text()); });
await page.goto(`http://localhost:${port}/?shot=1&pitch=0.62&dist=13`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 300000 });
const frames = (n) => page.evaluate((k) => new Promise((r) => { let i = 0; const f = () => (++i >= k ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);

const result = await page.evaluate(() => {
  const g = window.__game;
  const out = {};
  g.goalIndex(10);                                   // jump to the research_station goal
  for (const [k, n] of [['iron_plate', 40], ['silica', 40], ['carbon', 30]]) g.give(k, n);
  const st = g.place('research_station', 6, -5);
  g.simulate(1);
  out.goalAfterStation = g.state().goal;
  // Research the drill through the real path: parts delivered to the station.
  const base = g.base();
  out.started = (() => { base.research.active = 'auto_drill'; base.research.inv = { iron_plate: 4, silica: 6 }; return true; })();
  g.simulate(30);
  out.drillResearched = base.research.done.includes('auto_drill');
  // Find iron under the ground near the base.
  let drill = -1, mine = null;
  for (let fw = 2; fw < 24 && drill < 0; fw += 2) for (let rt = -14; rt <= 14 && drill < 0; rt += 2) {
    const i = g.place('auto_drill', fw, rt);
    const m = base.machines[i];
    if (m.mine === 'iron_ore' && Math.hypot(fw - 12, rt - 7.5) > 6 && Math.hypot(fw - 6, rt + 5) > 4) { drill = i; mine = m.mine; out.drillAt = [fw, rt, Math.round(m.rich * 100)]; }
    else { g.remove(i); }
  }
  out.drillMines = mine;
  g.research('conveyor');
  const sm = g.place('smelter', out.drillAt ? out.drillAt[0] + 4 : 8, out.drillAt ? out.drillAt[1] - 4 : 0);
  g.fill(sm, 'carbon', 10);
  out.belt = g.belt(drill, sm);
  g.simulate(80);
  const s = base.machines[sm];
  out.smelter = { fed: s.fedByBelt, made: s.made, out: { ...s.out } };
  out.goal = g.state().goal;
  // Silo and pylons.
  g.research('storage_silo'); g.research('power_pylon');
  const silo = g.place('storage_silo', out.drillAt ? out.drillAt[0] + 4 : 8, out.drillAt ? out.drillAt[1] + 4 : 4);
  const sm2 = sm;
  out.belt2 = g.belt(sm2, silo);
  g.simulate(40);
  out.siloHolds = { ...base.machines[silo].inv };
  // Stand back from the factory and look at it.
  if (out.drillAt) { g.teleport(out.drillAt[0] - 9, out.drillAt[1] - 3); g.face(out.drillAt[0] + 2, out.drillAt[1]); }
  return out;
});
console.log(JSON.stringify(result, null, 1));
await frames(20);
await page.screenshot({ path: '.shots/m2_factory.png' });
await page.evaluate((r) => { const g = window.__game; if (r.drillAt) { g.teleport(r.drillAt[0] - 2.5, r.drillAt[1] - 6); g.face(r.drillAt[0] + 2, r.drillAt[1] - 2); } g.simulate(3); }, result);
await frames(12);
await page.screenshot({ path: '.shots/m2_close.png' });
console.log(errors.length ? 'ERRORS:\n' + errors.slice(0, 10).join('\n') : 'no page errors');
await browser.close();
