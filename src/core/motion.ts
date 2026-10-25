// Character movement on a small planet: gravity pulls toward the centre,
// "up" is always away from it, and walking happens in the local tangent plane.
import { add, cross, dot, len, norm, reject, rotateAround, scale, sub, type V3 } from './vec';

export interface MoveInput {
  forward: number;   // -1..1
  right: number;     // -1..1
  sprint: boolean;
  jump: boolean;     // pressed this step
  jet: boolean;      // held
  yaw: number;       // radians to turn this step
}

export interface MoverState {
  pos: V3;
  vel: V3;
  heading: V3;       // unit, tangent to the surface: where "forward" points
  grounded: boolean;
  jetFuel: number;   // 0..1
  jetting: boolean;
}

export interface Collider { pos: V3; radius: number }

export interface MoveParams {
  gravity: number;
  walkSpeed: number;
  sprintSpeed: number;
  jumpSpeed: number;
  jetAccel: number;
  jetBurn: number;     // fuel per second
  jetRecharge: number; // fuel per second on the ground
  bodyRadius: number;
}

export const DEFAULT_MOVE: MoveParams = {
  gravity: 9.8,
  walkSpeed: 5,
  sprintSpeed: 8.5,
  jumpSpeed: 6.2,
  jetAccel: 17,
  jetBurn: 0.32,
  jetRecharge: 0.45,
  bodyRadius: 0.45,
};

export function upOf(s: MoverState): V3 { return norm(s.pos); }

/** Advances the character by dt seconds. groundRadius(dir) gives the surface distance from the centre. */
export function stepMover(
  s: MoverState,
  input: MoveInput,
  dt: number,
  groundRadius: (dir: V3) => number,
  colliders: readonly Collider[],
  p: MoveParams = DEFAULT_MOVE,
): void {
  let up = norm(s.pos);
  // Keep heading tangent (parallel transport as we move over the curve), then turn.
  s.heading = norm(reject(s.heading, up));
  if (input.yaw) s.heading = norm(rotateAround(s.heading, up, input.yaw));
  const right = norm(cross(s.heading, up));

  let wish = add(scale(s.heading, input.forward), scale(right, input.right));
  const wl = len(wish);
  if (wl > 1) wish = scale(wish, 1 / wl);
  const speed = input.sprint ? p.sprintSpeed : p.walkSpeed;
  const target = scale(wish, speed);

  let vr = dot(s.vel, up);
  let vt = reject(s.vel, up);
  const accel = s.grounded ? 12 : 2.5;
  const k = 1 - Math.exp(-accel * dt);
  vt = add(vt, scale(sub(target, vt), k));

  if (input.jump && s.grounded) { vr = p.jumpSpeed; s.grounded = false; }
  s.jetting = false;
  if (!s.grounded && input.jet && s.jetFuel > 0) {
    vr += p.jetAccel * dt;
    s.jetFuel = Math.max(0, s.jetFuel - p.jetBurn * dt);
    s.jetting = true;
  }
  vr -= p.gravity * dt;
  if (vr < -40) vr = -40;

  s.vel = add(vt, scale(up, vr));
  s.pos = add(s.pos, scale(s.vel, dt));

  // Push out of trees, rocks and buildings (in the tangent plane).
  up = norm(s.pos);
  for (const c of colliders) {
    const d = sub(s.pos, c.pos);
    const dt2 = reject(d, up);
    const dist = len(dt2);
    const min = c.radius + p.bodyRadius;
    if (dist < min && dist > 1e-6) {
      const push = scale(dt2, (min - dist) / dist);
      s.pos = add(s.pos, push);
      const n = scale(dt2, 1 / dist);
      const into = dot(s.vel, n);
      if (into < 0) s.vel = sub(s.vel, scale(n, into));
    }
  }

  // Stand on the ground.
  up = norm(s.pos);
  const g = groundRadius(up);
  const r = len(s.pos);
  if (r <= g + 0.02 && dot(s.vel, up) <= 0.01) {
    s.pos = scale(up, g);
    s.vel = reject(s.vel, up);
    s.grounded = true;
  } else {
    s.grounded = r <= g + 0.02;
  }
  if (s.grounded) s.jetFuel = Math.min(1, s.jetFuel + p.jetRecharge * dt);
  s.heading = norm(reject(s.heading, norm(s.pos)));
}

/** Height of the character above the ground (m). */
export function altitude(s: MoverState, groundRadius: (dir: V3) => number): number {
  return len(s.pos) - groundRadius(norm(s.pos));
}
