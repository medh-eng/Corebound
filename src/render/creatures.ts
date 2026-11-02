// Jivagraha's living creatures, from the Commander's models (M3, GDD §11): gentle grazers that
// wander and graze and step away from you, burrowers that pop out of the ground and duck back in
// when you come close, and small birds that circle over the forest by day. Never harmful, never
// harmed. Their numbers follow Harmony (more when the world is healthy). Models are not rigged, so
// the motion is a body bob, sway and lean done here.
import * as THREE from 'three';
import { loadModel } from './assets';

type Ground = (dir: THREE.Vector3) => number;

interface Grazer { dir: THREE.Vector3; head: THREE.Vector3; state: 'walk' | 'graze' | 'flee'; t: number; phase: number; obj: THREE.Object3D }
interface Burrower { dir: THREE.Vector3; yaw: number; state: 'hidden' | 'rise' | 'look' | 'dive'; t: number; obj: THREE.Object3D }
interface Bird { centre: THREE.Vector3; radius: number; alt: number; ang: number; speed: number; phase: number; obj: THREE.Object3D }

/** Which way each model faces when loaded, turned so "forward" is +Z (checked in the viewer). */
const FACING: Record<string, number> = { grazer: -Math.PI / 2, burrower: Math.PI / 2, bird: -Math.PI / 2 };

const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), m4 = new THREE.Matrix4();

/** placement group → `inner` (pitch, roll and pulse in the creature's own frame, +Z forward)
 *  → facing group (turns the model so it faces +Z) → model. */
function wrap(model: THREE.Object3D, name: string): THREE.Object3D {
  const g = new THREE.Group();
  const inner = new THREE.Group();
  const face = new THREE.Group();
  face.rotation.y = FACING[name] ?? 0;
  face.add(model);
  inner.add(face);
  g.add(inner);
  g.userData.inner = inner;
  return g;
}

/** Orients `obj` standing at `pos` on the sphere, facing along `fwd` (both world space). */
function place(obj: THREE.Object3D, pos: THREE.Vector3, up: THREE.Vector3, fwd: THREE.Vector3) {
  const z = fwd.clone().addScaledVector(up, -fwd.dot(up)).normalize();
  const x = tmp.crossVectors(up, z).normalize();
  obj.position.copy(pos);
  obj.quaternion.setFromRotationMatrix(m4.makeBasis(x, up, z));
}

/** A random direction on the sphere within `minDeg`..`maxDeg` of `around`. */
function near(around: THREE.Vector3, minDeg: number, maxDeg: number, rnd: () => number): THREE.Vector3 {
  const a = around.clone().normalize();
  const side = tmp2.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(a).normalize();
  const ang = THREE.MathUtils.degToRad(minDeg + (maxDeg - minDeg) * rnd());
  return a.applyAxisAngle(side, ang).normalize();
}

export class Creatures {
  readonly group = new THREE.Group();
  private grazers: Grazer[] = [];
  private burrowers: Burrower[] = [];
  private birds: Bird[] = [];
  private rnd: () => number;
  private ready = false;
  /** What happened this frame, for SARATHI's remarks (T-037): seen_grazer, seen_burrower, seen_bird, grazer_shy, burrower_shy. */
  readonly events = new Set<string>();

  /** `dry(dir)` is true where a creature may stand (land, not water). */
  constructor(private ground: Ground, private dry: (dir: THREE.Vector3) => boolean, private counts = { grazers: 5, burrowers: 4, birds: 5 }, seed = 7) {
    let s = seed >>> 0;
    this.rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  async load(start: THREE.Vector3) {
    const tryLoad = async (n: string) => { try { return await loadModel(n); } catch { return null; } };
    const [g, b, f] = await Promise.all([tryLoad('grazer'), tryLoad('burrower'), tryLoad('bird')]);
    if (g) for (let i = 0; i < this.counts.grazers; i++) {
      const obj = wrap(i ? g.clone() : g, 'grazer');
      const dir = this.landNear(start, 18, 45);
      this.grazers.push({ dir, head: tmp.set(this.rnd() - 0.5, this.rnd() - 0.5, this.rnd() - 0.5).cross(dir).normalize().clone(), state: 'graze', t: this.rnd() * 4, phase: this.rnd() * 10, obj });
      this.group.add(obj);
    }
    if (b) for (let i = 0; i < this.counts.burrowers; i++) {
      const obj = wrap(i ? b.clone() : b, 'burrower');
      obj.visible = false;
      this.burrowers.push({ dir: this.landNear(start, 8, 30), yaw: this.rnd() * 6.28, state: 'hidden', t: 2 + this.rnd() * 8, obj });
      this.group.add(obj);
    }
    if (f) for (let i = 0; i < this.counts.birds; i++) {
      const obj = wrap(i ? f.clone() : f, 'bird');
      this.birds.push({ centre: near(start, 5, 25, this.rnd), radius: 5 + this.rnd() * 8, alt: 6 + this.rnd() * 6, ang: this.rnd() * 6.28, speed: (0.35 + this.rnd() * 0.25) * (this.rnd() < 0.5 ? -1 : 1), phase: this.rnd() * 10, obj });
      this.group.add(obj);
    }
    this.ready = true;
  }

  private landNear(around: THREE.Vector3, minDeg: number, maxDeg: number): THREE.Vector3 {
    for (let k = 0; k < 30; k++) { const d = near(around, minDeg, maxDeg, this.rnd); if (this.dry(d)) return d; }
    return around.clone().normalize();
  }

  /** Test hook: where the first creature of a kind is (world position), or null. */
  spot(kind: 'grazer' | 'burrower' | 'bird'): THREE.Vector3 | null {
    const list = kind === 'grazer' ? this.grazers : kind === 'burrower' ? this.burrowers : this.birds;
    const c = list.find((x) => x.obj.visible) ?? list[0];
    return c ? c.obj.position.clone() : null;
  }

  /** Test hook: puts the first creature of a kind `dist` metres ahead of `at` along `fwd`. */
  bringTo(kind: 'grazer' | 'burrower' | 'bird', at: THREE.Vector3, fwd: THREE.Vector3, dist: number) {
    const R = at.length(), up = at.clone().normalize();
    const f = fwd.clone().addScaledVector(up, -fwd.dot(up)).normalize();
    const dir = up.clone().addScaledVector(f, dist / R).normalize();
    if (kind === 'grazer' && this.grazers[0]) { const g = this.grazers[0]; g.dir.copy(dir); g.state = 'graze'; g.t = 20; g.head.copy(tmp.crossVectors(up, f)); }
    if (kind === 'burrower' && this.burrowers[0]) { const b = this.burrowers[0]; b.dir.copy(dir); b.state = 'look'; b.t = 20; b.obj.visible = true; }
    if (kind === 'bird') for (const b of this.birds) { b.centre.copy(dir); b.alt = 4; }
  }

  /** Test hook: brings every burrower up now. */
  surfaceAll() { for (const b of this.burrowers) { b.state = 'look'; b.t = 12; b.obj.visible = true; } }

  /** Nearest creature close to a ray (for the scanner): [distance, codex id]. */
  nearRay(o: THREE.Vector3, d: THREE.Vector3, maxT: number): [number, string] | null {
    let best: [number, string] | null = null;
    const test = (p: THREE.Vector3, r: number, id: string) => {
      const oc = p.clone().sub(o); const t = oc.dot(d);
      if (t < 0 || t > maxT || oc.lengthSq() - t * t > r * r) return;
      if (!best || t < best[0]) best = [t, id];
    };
    for (const g of this.grazers) if (g.obj.visible) test(g.obj.position.clone().addScaledVector(g.dir, 0.9), 1.1, 'gentle_grazer');
    for (const b of this.burrowers) if (b.obj.visible && b.state !== 'dive') test(b.obj.position.clone().addScaledVector(b.dir, 0.2), 0.6, 'small_burrower');
    for (const f of this.birds) if (f.obj.visible) test(f.obj.position, 0.9, 'small_bird');
    return best;
  }

  /** `abundance` 0..1 from Harmony; `night` 0..1. */
  update(dt: number, time: number, player: THREE.Vector3, abundance: number, night: number) {
    this.events.clear();
    if (!this.ready) return;
    const pDir = player.clone().normalize();
    const R = player.length();
    const show = (i: number, n: number) => i < Math.round(n * Math.max(0.2, abundance));

    // Grazers: walk a little, graze a while, step away from you. Asleep (still) at night.
    this.grazers.forEach((g, i) => {
      g.obj.visible = show(i, this.grazers.length);
      if (!g.obj.visible) return;
      const up = g.dir;
      const pos = up.clone().multiplyScalar(this.ground(up));
      const dist = pos.distanceTo(player);
      // Too far behind you on this small world: wander back into view.
      if (dist > 70) { g.dir.copy(this.landNear(pDir, 18, 40)); return; }
      g.t -= dt;
      if (dist < 12) this.events.add('seen_grazer');
      if (dist < 5 && g.state !== 'flee') { g.state = 'flee'; g.t = 2.5; this.events.add('grazer_shy'); }
      if (g.t <= 0) {
        if (night > 0.7) { g.state = 'graze'; g.t = 3; }
        else if (g.state === 'walk') { g.state = 'graze'; g.t = 3 + this.rnd() * 4; }
        else { g.state = 'walk'; g.t = 3 + this.rnd() * 5; g.head.applyAxisAngle(up, (this.rnd() - 0.5) * 2.4); }
      }
      if (g.state === 'flee') {
        tmp.copy(pos).sub(player); tmp.addScaledVector(up, -tmp.dot(up));
        if (tmp.lengthSq() > 1e-4) g.head.lerp(tmp.normalize(), 1 - Math.exp(-4 * dt));
      }
      const speed = g.state === 'flee' ? 2.6 : g.state === 'walk' ? 0.7 : 0;
      g.head.addScaledVector(up, -g.head.dot(up)).normalize();
      if (speed > 0) {
        const next = up.clone().addScaledVector(g.head, (speed * dt) / R).normalize();
        if (this.dry(next)) g.dir.copy(next);
        else { g.head.negate(); g.state = 'graze'; g.t = 1.5; }
      }
      const step = speed > 0 ? Math.abs(Math.sin(time * speed * 4.2 + g.phase)) * 0.06 : 0;
      place(g.obj, g.dir.clone().multiplyScalar(this.ground(g.dir) + step), g.dir, g.head);
      const inner = g.obj.userData.inner as THREE.Object3D;
      // Grazing: lean the head end down and nod; walking: a gentle side-to-side sway.
      inner.rotation.x = g.state === 'graze' && night < 0.7 ? 0.22 + Math.sin(time * 2.2 + g.phase) * 0.06 : 0;
      inner.rotation.z = speed > 0 ? Math.sin(time * speed * 4.2 + g.phase) * 0.04 : 0;
    });

    // Burrowers: pop up near you, look around, duck back in (at once if you come close).
    for (const b of this.burrowers) {
      b.t -= dt;
      const up = b.dir;
      const base = this.ground(up);
      const pos = up.clone().multiplyScalar(base);
      const dist = pos.distanceTo(player);
      if (b.state === 'hidden' && b.t <= 0) {
        b.dir.copy(this.landNear(pDir, 6, 22));
        if (b.dir.clone().multiplyScalar(this.ground(b.dir)).distanceTo(player) < 6 || night > 0.85 || this.rnd() > 0.5 + abundance * 0.5) { b.t = 3 + this.rnd() * 5; continue; }
        b.state = 'rise'; b.t = 0.8; b.yaw = this.rnd() * 6.28; b.obj.visible = true;
      } else if (b.state === 'rise' && b.t <= 0) { b.state = 'look'; b.t = 4 + this.rnd() * 5; }
      else if (b.state === 'look' && (b.t <= 0 || dist < 4.5)) { b.state = 'dive'; b.t = dist < 4.5 ? 0.35 : 0.7; if (dist < 4.5) this.events.add('burrower_shy'); }
      else if (b.state === 'dive' && b.t <= 0) { b.state = 'hidden'; b.t = 4 + this.rnd() * 8; b.obj.visible = false; }
      if (!b.obj.visible) continue;
      if (b.state === 'look' && dist < 12) this.events.add('seen_burrower');
      const k = b.state === 'rise' ? 1 - b.t / 0.8 : b.state === 'dive' ? b.t / (dist < 4.5 ? 0.35 : 0.7) : 1;
      const depth = (1 - THREE.MathUtils.smoothstep(k, 0, 1)) * 0.5;
      if (b.state === 'look') b.yaw += Math.sin(time * 1.3) * dt * 0.8;
      const fwd = tmp2.set(Math.cos(b.yaw), 0.3, Math.sin(b.yaw)).cross(up).normalize();
      place(b.obj, up.clone().multiplyScalar(base - depth), up, fwd);
      (b.obj.userData.inner as THREE.Object3D).rotation.x = b.state === 'look' ? Math.sin(time * 3 + b.yaw) * 0.08 : 0;
    }

    // Birds: lazy circles over the trees by day, gone to roost at night.
    this.birds.forEach((f, i) => {
      f.obj.visible = night < 0.6 && show(i, this.birds.length);
      if (!f.obj.visible) return;
      if (f.centre.angleTo(pDir) > 0.45) f.centre.copy(near(pDir, 3, 20, this.rnd));
      f.ang += f.speed * dt;
      const up = f.centre;
      const e1 = tmp.set(0, 1, 0).cross(up); if (e1.lengthSq() < 1e-4) e1.set(1, 0, 0).cross(up); e1.normalize();
      const e2 = new THREE.Vector3().crossVectors(up, e1).normalize();
      const off = e1.clone().multiplyScalar(Math.cos(f.ang) * f.radius).addScaledVector(e2, Math.sin(f.ang) * f.radius);
      const dir = up.clone().multiplyScalar(R).add(off).normalize();
      const pos = dir.clone().multiplyScalar(this.ground(dir) + f.alt + Math.sin(time * 0.7 + f.phase) * 0.8);
      const vel = e1.clone().multiplyScalar(-Math.sin(f.ang)).addScaledVector(e2, Math.cos(f.ang)).multiplyScalar(Math.sign(f.speed));
      place(f.obj, pos, dir, vel);
      if (pos.distanceTo(player) < 25) this.events.add('seen_bird');
      const inner = f.obj.userData.inner as THREE.Object3D;
      inner.rotation.z = -Math.sign(f.speed) * 0.35;                       // bank into the turn
      const flap = Math.sin(time * 9 + f.phase);
      inner.scale.set(1, 1 + flap * 0.12, 1 - flap * 0.05);                // wingbeat pulse
    });
  }
}
