import { describe, it, expect } from 'vitest';
import { stepMover, type MoverState, type MoveInput } from '../src/core/motion';
import { dot, len, norm } from '../src/core/vec';

const R = 100;
const ground = () => R;
const idle: MoveInput = { forward: 0, right: 0, sprint: false, jump: false, jet: false, yaw: 0 };
const fresh = (): MoverState => ({
  pos: { x: 0, y: R + 3, z: 0 }, vel: { x: 0, y: 0, z: 0 },
  heading: { x: 0, y: 0, z: 1 }, grounded: false, jetFuel: 1, jetting: false,
});

describe('movement on a sphere', () => {
  it('falls to the ground and stands there', () => {
    const s = fresh();
    for (let i = 0; i < 300; i++) stepMover(s, idle, 1 / 60, ground, []);
    expect(s.grounded).toBe(true);
    expect(len(s.pos)).toBeCloseTo(R, 3);
  });
  it('walks over the curve while staying on the surface and keeping heading tangent', () => {
    const s = fresh();
    for (let i = 0; i < 60; i++) stepMover(s, idle, 1 / 60, ground, []);
    for (let i = 0; i < 600; i++) stepMover(s, { ...idle, forward: 1 }, 1 / 60, ground, []);
    expect(len(s.pos)).toBeCloseTo(R, 2);
    expect(Math.abs(dot(s.heading, norm(s.pos)))).toBeLessThan(1e-6);
    // 10 s at walking speed covers ~50 m of arc.
    const angle = Math.acos(norm(s.pos).y);
    expect(angle * R).toBeGreaterThan(40);
  });
  it('can walk all the way around and come back', () => {
    const s = fresh();
    for (let i = 0; i < 60; i++) stepMover(s, idle, 1 / 60, ground, []);
    const steps = Math.ceil(((2 * Math.PI * R) / 5) * 60);
    for (let i = 0; i < steps; i++) stepMover(s, { ...idle, forward: 1 }, 1 / 60, ground, []);
    const back = norm(s.pos);
    expect(back.y).toBeGreaterThan(0.97);
  });
  it('jumps and jetpacks upward, using fuel', () => {
    const s = fresh();
    for (let i = 0; i < 60; i++) stepMover(s, idle, 1 / 60, ground, []);
    stepMover(s, { ...idle, jump: true }, 1 / 60, ground, []);
    let peak = 0;
    for (let i = 0; i < 90; i++) {
      stepMover(s, { ...idle, jet: true }, 1 / 60, ground, []);
      peak = Math.max(peak, len(s.pos) - R);
    }
    expect(peak).toBeGreaterThan(4);
    expect(s.jetFuel).toBeLessThan(1);
  });
  it('is pushed out of colliders', () => {
    const s = fresh();
    for (let i = 0; i < 60; i++) stepMover(s, idle, 1 / 60, ground, []);
    const tree = { pos: { x: 0, y: R, z: 3 }, radius: 1 };
    for (let i = 0; i < 240; i++) stepMover(s, { ...idle, forward: 1 }, 1 / 60, ground, [tree]);
    const d = Math.hypot(s.pos.x - tree.pos.x, s.pos.z - tree.pos.z);
    expect(d).toBeGreaterThan(1.3);
  });
});
