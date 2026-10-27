import { describe, it, expect } from 'vitest';
import {
  newBase, tickBase, addMachine, addBelt, beltProblem, removeMachine, migrateBase, startResearch, accept, powerNetworks,
  type PlacedMachine, type BaseState,
} from '../src/systems/base';
import { BELTS } from '../src/data/items';

const O = { x: 0, y: 0, z: 0 };
const at = (x: number) => ({ x, y: 0, z: 0 });
const tick = (o: Partial<Parameters<typeof tickBase>[1]> = {}) => ({
  dt: 0.5, inShelter: false, running: false, lasering: false, jetting: false,
  sunAt: () => 1, nearShelter: (p: { x: number }) => Math.abs(p.x) < 30, ...o,
});
const run = (b: BaseState, seconds: number, o: Partial<Parameters<typeof tickBase>[1]> = {}) => {
  let last;
  for (let t = 0; t < seconds; t += 0.5) { b.oxygen = 1; last = tickBase(b, tick(o)); }
  return last!;
};
const base = () => { const b = newBase(); addMachine(b, { id: 'solar_lotus', pos: O }); addMachine(b, { id: 'solar_lotus', pos: O }); return b; };

describe('drills and belts', () => {
  it('a drill feeds a smelter by belt and plates come out', () => {
    const b = base();
    const drill = addMachine(b, { id: 'auto_drill', pos: at(5), mine: 'iron_ore', rich: 1 });
    const sm = addMachine(b, { id: 'smelter', pos: at(15), inv: { carbon: 10 } });
    expect(beltProblem(b, drill, sm, 10)).toBeNull();
    addBelt(b, drill, sm, 10);
    run(b, 90);
    expect(sm.fedByBelt).toBeGreaterThan(4);
    expect(sm.out?.iron_plate ?? 0).toBeGreaterThan(1);
  });
  it('items keep their spacing and back up when the far end is full', () => {
    const b = base();
    const drill = addMachine(b, { id: 'auto_drill', pos: at(5), mine: 'ice', rich: 1 });
    const st = addMachine(b, { id: 'research_station', pos: at(9) });   // no research chosen: takes nothing
    const belt = addBelt(b, drill, st, 4);
    run(b, 60);
    const ds = belt.items.map((i) => i.d);
    for (let i = 1; i < ds.length; i++) expect(ds[i - 1] - ds[i]).toBeGreaterThanOrEqual(BELTS.spacing - 1e-6);
    expect(ds[0]).toBeLessThanOrEqual(4);
    expect(belt.items.length).toBeGreaterThanOrEqual(7);
  });
  it('refuses impossible belts', () => {
    const b = base();
    const bat = addMachine(b, { id: 'battery', pos: at(2) });
    const sm = addMachine(b, { id: 'smelter', pos: at(4) });
    const drill = addMachine(b, { id: 'auto_drill', pos: at(6), mine: 'iron_ore', rich: 1 });
    expect(beltProblem(b, bat, sm, 5)).toMatch(/nothing to send/);
    expect(beltProblem(b, drill, bat, 5)).toMatch(/nothing in/);
    expect(beltProblem(b, drill, sm, 99)).toMatch(/Too long/);
    addBelt(b, drill, sm, 5);
    expect(beltProblem(b, drill, sm, 5)).toMatch(/already sends/);
  });
  it('a silo stores anything and sends it on', () => {
    const b = base();
    const silo = addMachine(b, { id: 'storage_silo', pos: at(3), inv: { iron_ore: 6, carbon: 3 } });
    const sm = addMachine(b, { id: 'smelter', pos: at(8) });
    addBelt(b, silo, sm, 5);
    run(b, 40);
    expect(sm.out?.iron_plate ?? 0).toBeGreaterThan(0);
    expect(accept(b, silo, 'silicon')).toBe(true);
  });
  it('removing a machine gives back its contents, belt items and conveyors', () => {
    const b = base();
    const drill = addMachine(b, { id: 'auto_drill', pos: at(5), mine: 'iron_ore', rich: 1, out: { iron_ore: 3 } });
    const sm = addMachine(b, { id: 'smelter', pos: at(15), inv: { carbon: 2 } });
    addBelt(b, drill, sm, 9);
    const back = removeMachine(b, sm);
    expect(back.carbon).toBe(2);
    expect(back.conveyor).toBe(5);
    expect(b.belts.length).toBe(0);
  });
});

describe('power networks', () => {
  it('machines far from the shelter need pylons', () => {
    const b = base();
    const far = addMachine(b, { id: 'auto_drill', pos: at(50), mine: 'iron_ore', rich: 1 });
    run(b, 20);
    expect(far.made ?? 0).toBe(0);
    addMachine(b, { id: 'power_pylon', pos: at(25) });   // inside the shelter area
    addMachine(b, { id: 'power_pylon', pos: at(45) });   // 20 m on: linked
    const nets = powerNetworks(b, tick().nearShelter);
    expect(nets.netOf.get(far.uid!)).toBe(0);
    run(b, 20);
    expect(far.made ?? 0).toBeGreaterThan(1);
  });
  it('a coal burner makes power at night', () => {
    const b = newBase();
    const burner = addMachine(b, { id: 'coal_burner', pos: O, inv: { carbon: 2 } });
    const sm = addMachine(b, { id: 'smelter', pos: O, inv: { iron_ore: 4, carbon: 2 } });
    run(b, 30, { sunAt: () => 0 });
    expect(sm.out?.iron_plate ?? 0).toBeGreaterThan(0);
    expect(burner.inv?.carbon).toBeLessThan(2);
  });
});

describe('research', () => {
  it('needs its parts and power, then unlocks', () => {
    const b = base();
    const st = addMachine(b, { id: 'research_station', pos: at(4) });
    expect(startResearch(b, 'silicon_furnace')).toBe(false);   // needs earlier research
    expect(startResearch(b, 'conveyor')).toBe(true);
    run(b, 20);
    expect(b.research.done).not.toContain('conveyor');         // no parts yet
    for (let i = 0; i < 3; i++) expect(accept(b, st, 'iron_plate')).toBe(true);
    expect(accept(b, st, 'iron_plate')).toBe(false);           // only what it needs
    const r = run(b, 20);
    expect(b.research.done).toContain('conveyor');
    expect(r).toBeTruthy();
  });
});

describe('old saves', () => {
  it('moves old machine fields into buffers and gives ids', () => {
    const b = { ...newBase(), belts: undefined, research: undefined, nextUid: undefined, stored: 12 } as unknown as BaseState;
    const sm: PlacedMachine = { id: 'smelter', pos: O, ore: 3, plates: 2 };
    b.machines.push(sm, { id: 'battery', pos: O });
    migrateBase(b);
    expect(sm.inv?.iron_ore).toBe(3);
    expect(sm.out?.iron_plate).toBe(2);
    expect(sm.uid).toBeDefined();
    expect(b.machines[1].charge).toBe(12);
    expect(b.belts).toEqual([]);
  });
});
