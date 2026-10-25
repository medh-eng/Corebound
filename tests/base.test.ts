import { describe, it, expect } from 'vitest';
import { Backpack } from '../src/systems/inventory';
import { newBase, tickBase } from '../src/systems/base';
import { RECIPES } from '../src/data/items';

const tick = (o: Partial<Parameters<typeof tickBase>[1]> = {}) => ({
  dt: 1, inShelter: false, running: false, lasering: false, jetting: false,
  sunAt: () => 1, nearShelter: () => true, ...o,
});

describe('backpack and crafting', () => {
  it('stacks items and refuses overflow', () => {
    const b = new Backpack(2);
    expect(b.add('ice', 70)).toBe(0);
    expect(b.add('silica', 10)).toBe(10);
    expect(b.count('ice')).toBe(70);
  });
  it('crafts an electrolyzer from ore and silica', () => {
    const b = new Backpack();
    b.add('iron_ore', 6); b.add('silica', 4);
    const r = RECIPES.find((x) => x.out === 'electrolyzer')!;
    expect(b.craft(r)).toBe(true);
    expect(b.count('electrolyzer')).toBe(1);
    expect(b.count('iron_ore')).toBe(0);
    expect(b.craft(r)).toBe(false);
  });
});

describe('survival and power', () => {
  it('drains oxygen outside and blacks out safely', () => {
    const s = newBase();
    let blackout = false;
    for (let i = 0; i < 400 && !blackout; i++) blackout = tickBase(s, tick()).blackout;
    expect(blackout).toBe(true);
    expect(s.oxygen).toBeGreaterThan(0.3);
  });
  it('turns ice into shelter air with solar power, and refills the suit inside', () => {
    const s = newBase();
    s.machines.push({ id: 'solar_lotus', pos: { x: 0, y: 0, z: 0 } }, { id: 'electrolyzer', pos: { x: 0, y: 0, z: 0 }, ice: 5 });
    for (let i = 0; i < 40; i++) tickBase(s, tick());
    expect(s.shelterO2).toBeGreaterThan(20);
    const before = s.oxygen;
    for (let i = 0; i < 10; i++) tickBase(s, tick({ inShelter: true }));
    expect(s.oxygen).toBeGreaterThan(before);
  });
  it('makes no air at night without a battery, but does with a charged one', () => {
    const night = newBase();
    night.machines.push({ id: 'solar_lotus', pos: { x: 0, y: 0, z: 0 } }, { id: 'electrolyzer', pos: { x: 0, y: 0, z: 0 }, ice: 5 });
    for (let i = 0; i < 30; i++) tickBase(night, tick({ sunAt: () => 0 }));
    expect(night.shelterO2).toBe(0);
    const stored = newBase();
    stored.machines.push({ id: 'solar_lotus', pos: { x: 0, y: 0, z: 0 } }, { id: 'battery', pos: { x: 0, y: 0, z: 0 } });
    for (let i = 0; i < 120; i++) tickBase(stored, tick());
    expect(stored.stored).toBeGreaterThan(5);
    stored.machines.push({ id: 'electrolyzer', pos: { x: 0, y: 0, z: 0 }, ice: 5 });
    for (let i = 0; i < 30; i++) tickBase(stored, tick({ sunAt: () => 0 }));
    expect(stored.shelterO2).toBeGreaterThan(10);
  });
});
