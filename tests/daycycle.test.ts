import { describe, it, expect } from 'vitest';
import { sunDir, sunElevation, timeForSunrise, daylight, localClock } from '../src/core/daycycle';
import { len, norm } from '../src/core/vec';

describe('day and night', () => {
  it('gives a unit sun direction that repeats every day', () => {
    expect(len(sunDir(0.3))).toBeCloseTo(1, 6);
    const a = sunDir(0.2), b = sunDir(1.2);
    expect(a.x).toBeCloseTo(b.x, 6); expect(a.z).toBeCloseTo(b.z, 6);
  });
  it('finds a rising sun at the requested height', () => {
    const up = norm({ x: 0.28, y: 0.42, z: 0.86 });
    const t = timeForSunrise(up, 13);
    expect(Math.asin(sunElevation(t, up)) * 180 / Math.PI).toBeCloseTo(13, 0);
    expect(sunElevation(t + 0.01, up)).toBeGreaterThan(sunElevation(t, up));
    const clock = localClock(t, up);
    const hour = Number(clock.slice(0, 2));
    expect(hour).toBeGreaterThanOrEqual(5);
    expect(hour).toBeLessThanOrEqual(9);
  });
  it('maps elevation to daylight', () => {
    expect(daylight(-0.5)).toBe(0);
    expect(daylight(0.8)).toBe(1);
    expect(daylight(0.05)).toBeGreaterThan(0);
  });
});
