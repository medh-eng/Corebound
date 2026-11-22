// Mooladri (M4 slice 3): roots, the calming steps, the goal order and the valley text.
import { describe, expect, it } from 'vitest';
import { growRoots, onRoot, rootPoints, distToLine, groundDistance, stepDone, soilReady, crownGlow } from '../src/systems/guardian';
import { norm, scale, rotateAround, anyTangent, cross, type V3 } from '../src/core/vec';
import { MOOLADRI, VALLEY_PROMPTS, VALLEY_STEPS, STEP_DONE_LINE } from '../src/data/valley';
import { GUARDIAN_LINES } from '../src/data/scenes';
import { CHAPTER1_GOALS } from '../src/data/story';
import { STEP_MILESTONE, CHAPTER1_MILESTONES, RETIRED_GOALS } from '../src/data/chapter1';
import { CHAPTER1_IN_WORLD, codexById } from '../src/data/codex';
import { tickHarmony } from '../src/systems/harmony';

const R = 150;
const center: V3 = norm({ x: 0.2, y: 1, z: 0.1 });
/** A point `m` metres from the centre along the ground, in direction `deg`. */
const away = (deg: number, m: number): V3 => {
  const dir = rotateAround(anyTangent(center), center, (deg * Math.PI) / 180);
  return scale(rotateAround(center, norm(cross(center, dir)), m / R), R);
};

describe('Mooladri roots', () => {
  const drills = [away(10, 40), away(80, 55), away(200, 30)];
  const roots = growRoots(center, drills, R, { maxToDrills: 6, wander: 3, seed: 42 });

  it('reach every drill (up to the limit) and a few wander off', () => {
    expect(roots.length).toBe(6);
    for (const d of drills) expect(onRoot(d, roots, R, MOOLADRI.rootClear)).toBe(true);
  });
  it('start at the trunk and wiggle no more than about 1.6 m', () => {
    for (const r of roots) {
      const pts = rootPoints(r, R);
      expect(groundDistance(pts[0], center, R)).toBeLessThan(0.05);
      // Every point stays near the straight line from the trunk to the end.
      const straight = rootPoints({ ...r, seed: 0 }, R);
      for (const p of pts) expect(distToLine(p, straight, R)).toBeLessThan(2);
    }
  });
  it('a drill moved a few metres sideways is clear of them', () => {
    const moved = away(10 + 12, 40);   // 12 degrees round at 40 m: about 8 m to the side
    expect(onRoot(moved, roots.slice(0, 1), R, MOOLADRI.rootClear)).toBe(false);
  });
  it('are the same every time for the same seed', () => {
    expect(growRoots(center, drills, R, { maxToDrills: 6, wander: 3, seed: 42 })).toEqual(roots);
  });
  it('only go to the nearest drills when there are many', () => {
    const many = Array.from({ length: 10 }, (_, i) => away(i * 36, 20 + i * 5));
    expect(growRoots(center, many, R, { maxToDrills: 6, wander: 0, seed: 1 }).length).toBe(6);
  });
});

describe('Calming steps', () => {
  const rules = MOOLADRI;
  const v = { rootsMapped: true, drillsOnRoots: 0, air: 40, soil: 30, filterWorking: false, planted: 0 };
  it('each needs its own condition', () => {
    expect(stepDone('seismic_scan', { ...v, rootsMapped: false }, rules)).toBe(false);
    expect(stepDone('seismic_scan', v, rules)).toBe(true);
    expect(stepDone('move_drills', { ...v, drillsOnRoots: 2 }, rules)).toBe(false);
    expect(stepDone('move_drills', v, rules)).toBe(true);
    expect(stepDone('bio_filters_valley', { ...v, air: 10 }, rules)).toBe(false);   // no filter working
    expect(stepDone('bio_filters_valley', { ...v, filterWorking: true }, rules)).toBe(false);   // still hazy
    expect(stepDone('bio_filters_valley', { ...v, filterWorking: true, air: rules.airClear }, rules)).toBe(true);
    expect(stepDone('replant_bloom', { ...v, planted: 2 }, rules)).toBe(false);
    expect(stepDone('replant_bloom', { ...v, planted: 3 }, rules)).toBe(true);
  });
  it('planting waits for clean soil (clearing the haze does not skip it)', () => {
    expect(soilReady(rules.soilClean + 1, rules)).toBe(false);
    expect(soilReady(rules.soilClean, rules)).toBe(true);
  });
  it('the crown glows brighter with each step and steady once calm', () => {
    const avg = (steps: number) => Array.from({ length: 50 }, (_, i) => crownGlow('restless', steps, i * 0.37)).reduce((a, b) => a + b) / 50;
    expect(avg(4)).toBeGreaterThan(avg(0));
    expect(crownGlow('calm', 0, 3)).toBe(1);
    expect(crownGlow('resting', 0, 3)).toBeLessThan(0.3);
  });
  it('a calm Mooladri lets the forest clean twice as fast', () => {
    const a = { air: 40, water: 10, soil: 30 }, b = { ...a };
    tickHarmony(a, [], 60); tickHarmony(b, [], 60, { flora2: true });
    expect(40 - b.air).toBeCloseTo((40 - a.air) * 2, 0);
  });
});

describe('Slice 3 goals and text', () => {
  const at = (id: string) => CHAPTER1_GOALS.findIndex((g) => g.id === id);
  it('run in the order of the scenes', () => {
    const order = ['memory_logs', 'harmony_look', 'guardian_find', 'seismic_scan', 'move_drills', 'bio_filters_valley', 'replant_bloom', 'valley_calm', 'done'];
    order.forEach((id, i) => { expect(at(id)).toBeGreaterThanOrEqual(0); if (i) expect(at(id)).toBe(at(order[i - 1]) + 1); });
  });
  it('belong to the right Chapter 1 milestones', () => {
    expect(STEP_MILESTONE.seismic_scan).toBe('roots');
    expect(STEP_MILESTONE.move_drills).toBe('roots');
    expect(STEP_MILESTONE.bio_filters_valley).toBe('clear_smog');
    expect(STEP_MILESTONE.replant_bloom).toBe('replant_bloom');
    for (const id of Object.keys(STEP_MILESTONE)) expect(CHAPTER1_MILESTONES.some((m) => m.id === STEP_MILESTONE[id])).toBe(true);
  });
  it('old saves on retired goals move to goals that exist', () => {
    for (const to of Object.values(RETIRED_GOALS)) expect(at(to)).toBeGreaterThanOrEqual(0);
    for (const from of Object.keys(RETIRED_GOALS)) expect(at(from)).toBe(-1);
  });
  it('every done line exists, and steps keep T-042 wording', () => {
    for (const d of Object.values(STEP_DONE_LINE)) expect(GUARDIAN_LINES[d.line as keyof typeof GUARDIAN_LINES]).toBeTruthy();
    for (const [id, st] of Object.entries(VALLEY_STEPS)) expect(CHAPTER1_GOALS[at(id)].text).toBe(st.text);
  });
  it('valley text uses straight apostrophes and stays short', () => {
    const all = [...Object.values(VALLEY_PROMPTS), ...Object.values(VALLEY_STEPS).flatMap((s) => [s.text, s.sarathi])];
    for (const t of all) { expect(t).not.toMatch(/[‘’“”]/); expect(t.split(/\s+/).length).toBeLessThan(25); }
    for (const t of Object.values(VALLEY_PROMPTS)) expect(t.split(/\s+/).length).toBeLessThanOrEqual(12);
  });
  it('prompts before the end never name a later step', () => {
    for (const k of ['roots_blocked', 'seismic_scan_hold', 'root_marked'] as const) expect(VALLEY_PROMPTS[k]).not.toMatch(/filter|bloom|spore|drill/i);
  });
  it('Mooladri and the valley can be scanned', () => {
    for (const id of ['mooladri', 'root_valley']) { expect(CHAPTER1_IN_WORLD).toContain(id); expect(codexById(id)).toBeTruthy(); }
  });
});
