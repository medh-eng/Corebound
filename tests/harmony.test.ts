import { describe, it, expect } from 'vitest';
import { newBase, tickBase, addMachine, type BaseState } from '../src/systems/base';
import { harmonyValue, bandOf, tickHarmony, newHarmony } from '../src/systems/harmony';

const O = { x: 0, y: 0, z: 0 };
const run = (b: BaseState, seconds: number, random = () => 1) => {
  let r;
  for (let t = 0; t < seconds; t += 1) { b.oxygen = 1; r = tickBase(b, { dt: 1, inShelter: false, running: false, lasering: false, jetting: false, sunAt: () => 1, nearShelter: () => true, random }); }
  return r!;
};
const powered = () => { const b = newBase(); for (let i = 0; i < 4; i++) addMachine(b, { id: 'solar_lotus', pos: O }); return b; };

describe('harmony', () => {
  it('starts thriving and smoke drags it down', () => {
    const b = powered();
    expect(bandOf(harmonyValue(b.harmony))).toBe('thriving');
    addMachine(b, { id: 'coal_burner', pos: O, inv: { carbon: 20 } });
    addMachine(b, { id: 'smelter', pos: O, inv: { iron_ore: 20, carbon: 10 } });
    run(b, 600);
    expect(b.harmony.air).toBeGreaterThan(30);
    expect(harmonyValue(b.harmony)).toBeLessThan(90);
  });
  it('a bio-filter cleans the air while it has power', () => {
    const b = powered();
    b.harmony.air = 50;
    addMachine(b, { id: 'bio_filter', pos: O });
    run(b, 600);
    expect(b.harmony.air).toBeLessThan(25);
  });
  it('a settling pond cleans water and soil with no power', () => {
    const b = newBase();
    b.harmony.water = 40; b.harmony.soil = 40;
    addMachine(b, { id: 'settling_pond', pos: O });
    run(b, 600);
    expect(b.harmony.water).toBeLessThan(25);
    expect(b.harmony.soil).toBeLessThan(30);
  });
  it('the world always recovers a little by itself', () => {
    const h = newHarmony(); h.air = 100; h.water = 100; h.soil = 100;
    expect(bandOf(harmonyValue(h))).toBe('collapse');
    tickHarmony(h, [], 600);
    expect(h.air).toBeLessThan(100);
  });
  it('clean smelting halves the smoke', () => {
    const a = newHarmony(), c = newHarmony();
    tickHarmony(a, ['coal_burner'], 120);
    tickHarmony(c, ['coal_burner'], 120, { clean: true });
    expect(c.air).toBeLessThan(a.air);
  });
});

describe('faults and filters', () => {
  it('when stressed, machines need attention and stop until fixed', () => {
    const b = powered();
    b.harmony.air = 100; b.harmony.soil = 60;
    const sm = addMachine(b, { id: 'smelter', pos: O, inv: { iron_ore: 20, carbon: 10 } });
    const r = run(b, 2, () => 0);           // dice always say "fault"
    expect(r.faults.length + (sm.fault ? 1 : 0)).toBeGreaterThan(0);
    expect(sm.fault).toBe(true);
    const made = sm.made ?? 0;
    run(b, 30, () => 0.99);
    expect(sm.made ?? 0).toBe(made);
    sm.fault = false;
    run(b, 30, () => 1);
    expect(sm.made ?? 0).toBeGreaterThan(made);
  });
  it('the electrolyzer vents hydrogen instead of stopping', () => {
    const b = powered();
    const el = addMachine(b, { id: 'electrolyzer', pos: O, inv: { ice: 20 }, out: { hydrogen: 20 } });
    run(b, 30);
    expect(b.shelterO2).toBeGreaterThan(10);
    expect(el.out?.hydrogen).toBe(20);
  });
  it('the Sabatier reactor turns hydrogen into methane', () => {
    const b = powered();
    const sab = addMachine(b, { id: 'sabatier_reactor', pos: O, inv: { hydrogen: 8 } });
    run(b, 45);
    expect(sab.out?.methane).toBeGreaterThanOrEqual(3);
  });
});
