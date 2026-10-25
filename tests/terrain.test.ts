import { describe, it, expect } from 'vitest';
import { Terrain } from '../src/core/terrain';
import { JIVAGRAHA } from '../src/data/worlds';
import { rng, randomDir } from '../src/core/random';

describe('terrain', () => {
  const t = new Terrain(JIVAGRAHA);
  it('is deterministic for the same seed', () => {
    const t2 = new Terrain(JIVAGRAHA);
    const r = rng(5);
    for (let i = 0; i < 50; i++) {
      const d = randomDir(r);
      expect(t2.height(d.x, d.y, d.z)).toBe(t.height(d.x, d.y, d.z));
    }
  });
  it('keeps heights within a sensible range', () => {
    const r = rng(9);
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < 4000; i++) {
      const d = randomDir(r);
      const h = t.height(d.x, d.y, d.z);
      min = Math.min(min, h); max = Math.max(max, h);
    }
    expect(min).toBeGreaterThan(-6);
    expect(max).toBeLessThan(20);
    expect(max - min).toBeGreaterThan(5); // not flat
  });
  it('flattens the starting clearing to the spawn height', () => {
    const s = t.spawnDir;
    expect(t.height(s.x, s.y, s.z)).toBeCloseTo(JIVAGRAHA.spawn.height, 3);
  });
  it('has rivers below sea level somewhere', () => {
    const r = rng(11);
    let wet = 0;
    for (let i = 0; i < 4000; i++) {
      const d = randomDir(r);
      if (t.height(d.x, d.y, d.z) < t.seaLevel) wet++;
    }
    expect(wet).toBeGreaterThan(40);
    expect(wet).toBeLessThan(2000);
  });
});
