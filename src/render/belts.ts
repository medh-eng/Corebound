// Conveyor belts: the path along the ground between two machines, the belt itself (the owner's
// conveyor model repeated along the path, or a code-built strip), the items riding on it,
// and power cables between pylons.
import * as THREE from 'three';
import { ITEMS, MACHINES, type ItemId } from '../data/items';
import type { Belt, PlacedMachine } from '../systems/base';
import { conveyorModel, PYLON_TOP } from './machines';

const LIFT = 0.32;          // belt surface above the ground
const MAX_ITEMS = 3000;

type Ground = (dir: THREE.Vector3) => number;
const V = (p: { x: number; y: number; z: number }) => new THREE.Vector3(p.x, p.y, p.z);

/** Points along the ground from one machine's edge to the other's, 0.5 m apart. */
export function beltPath(from: PlacedMachine, to: PlacedMachine, ground: Ground): THREE.Vector3[] {
  const a = V(from.pos), b = V(to.pos);
  const ra = MACHINES[from.id].radius + 0.25, rb = MACHINES[to.id].radius + 0.25;
  const chord = b.clone().sub(a);
  const len = chord.length();
  const pts: THREE.Vector3[] = [];
  if (len < ra + rb + 0.5) return [a.clone(), b.clone()];
  const start = a.clone().addScaledVector(chord, ra / len), end = b.clone().addScaledVector(chord, -rb / len);
  const n = Math.max(2, Math.ceil(start.distanceTo(end) / 0.5));
  for (let i = 0; i <= n; i++) {
    const d = start.clone().lerp(end, i / n).normalize();
    pts.push(d.multiplyScalar(ground(d) + LIFT));
  }
  return pts;
}

export const pathLength = (pts: THREE.Vector3[]) => pts.reduce((s, p, i) => (i ? s + p.distanceTo(pts[i - 1]) : 0), 0);

interface BeltView { group: THREE.Group; pts: THREE.Vector3[]; cum: number[]; length: number }

export class BeltRenderer {
  readonly group = new THREE.Group();
  private views = new Map<Belt, BeltView>();
  private items: THREE.InstancedMesh;
  private cables = new THREE.Group();
  private colors = new Map<ItemId, THREE.Color>();
  private m4 = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private s = new THREE.Vector3(1, 1, 1);
  private p = new THREE.Vector3();

  constructor() {
    const g = new THREE.BoxGeometry(0.38, 0.26, 0.38);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.6 });
    this.items = new THREE.InstancedMesh(g, mat, MAX_ITEMS);
    this.items.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_ITEMS * 3), 3);
    this.items.count = 0;
    this.items.castShadow = true;
    this.items.frustumCulled = false;
    this.group.add(this.items, this.cables);
    for (const id of Object.keys(ITEMS) as ItemId[]) this.colors.set(id, new THREE.Color(ITEMS[id].color));
  }

  /** Builds the visible belt. `pts` come from beltPath. */
  add(belt: Belt, pts: THREE.Vector3[]) {
    this.remove(belt);
    const group = new THREE.Group();
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
    // One belt piece per ~1.8 m, bent along the ground.
    const pieces = Math.max(1, Math.round(cum[cum.length - 1] / 1.8));
    const pieceLen = cum[cum.length - 1] / pieces;
    const src = conveyorModel;
    const parts: { geo: THREE.BufferGeometry; mat: THREE.Material; local: THREE.Matrix4 }[] = [];
    if (src) {
      src.updateMatrixWorld(true);
      src.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) parts.push({ geo: m.geometry, mat: m.material as THREE.Material, local: m.matrixWorld.clone() }); });
    } else {
      parts.push({ geo: new THREE.BoxGeometry(1.86, 0.3, 1.4).translate(0, 0.15, 0), mat: new THREE.MeshStandardMaterial({ color: '#d9cdb8', roughness: 0.6 }), local: new THREE.Matrix4() });
    }
    const box = new THREE.Box3();
    if (src) box.setFromObject(src); else box.set(new THREE.Vector3(-0.93, 0, -0.7), new THREE.Vector3(0.93, 0.3, 0.7));
    const size = box.getSize(new THREE.Vector3());
    const longX = size.x >= size.z;   // the model's long side lies along x (or z)
    const modelLen = longX ? size.x : size.z, modelW = longX ? size.z : size.x;
    for (const part of parts) {
      const im = new THREE.InstancedMesh(part.geo, part.mat, pieces);
      im.castShadow = true; im.receiveShadow = true;
      for (let k = 0; k < pieces; k++) {
        const mid = this.at({ pts, cum } as BeltView, (k + 0.5) * pieceLen);
        const a = this.at({ pts, cum } as BeltView, k * pieceLen), b = this.at({ pts, cum } as BeltView, (k + 1) * pieceLen);
        const up = mid.clone().normalize();
        const fwd = b.clone().sub(a); fwd.addScaledVector(up, -fwd.dot(up)).normalize();
        const side = new THREE.Vector3().crossVectors(up, fwd).normalize();
        const basis = longX ? new THREE.Matrix4().makeBasis(fwd, up, side.clone().negate()) : new THREE.Matrix4().makeBasis(side, up, fwd);
        const scale = new THREE.Matrix4().makeScale(
          longX ? (pieceLen + 0.04) / modelLen : 0.7 / modelW, 0.55, longX ? 0.7 / modelW : (pieceLen + 0.04) / modelLen);
        const centre = new THREE.Matrix4().makeTranslation(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
        const pos = mid.clone().addScaledVector(up, -LIFT + 0.02);
        const m = new THREE.Matrix4().setPosition(pos).multiply(basis).multiply(scale).multiply(centre).multiply(part.local);
        im.setMatrixAt(k, m);
      }
      group.add(im);
    }
    this.group.add(group);
    this.views.set(belt, { group, pts, cum, length: cum[cum.length - 1] });
  }

  remove(belt: Belt) {
    const v = this.views.get(belt);
    if (!v) return;
    this.group.remove(v.group);
    v.group.traverse((o) => { const im = o as THREE.InstancedMesh; if (im.isInstancedMesh) im.dispose(); });
    this.views.delete(belt);
  }

  /** Keeps the drawn belts in step with the simulation's list. */
  sync(belts: Belt[], machines: PlacedMachine[], ground: Ground) {
    const live = new Set(belts);
    for (const b of [...this.views.keys()]) if (!live.has(b)) this.remove(b);
    const byUid = new Map(machines.map((m) => [m.uid!, m]));
    for (const b of belts) {
      if (this.views.has(b)) continue;
      const f = byUid.get(b.from), t = byUid.get(b.to);
      if (f && t) this.add(b, beltPath(f, t, ground));
    }
  }

  private at(v: Pick<BeltView, 'pts' | 'cum'>, d: number): THREE.Vector3 {
    const { pts, cum } = v;
    if (d <= 0) return pts[0].clone();
    if (d >= cum[cum.length - 1]) return pts[pts.length - 1].clone();
    let i = 1;
    while (cum[i] < d) i++;
    const t = (d - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]);
    return pts[i - 1].clone().lerp(pts[i], t);
  }

  /** Places every riding item. Call once a frame. */
  updateItems(belts: Belt[], camera: THREE.Camera) {
    let n = 0;
    const camPos = camera.position;
    for (const b of belts) {
      const v = this.views.get(b);
      if (!v) continue;
      if (v.pts[0].distanceTo(camPos) > 120) continue;
      for (const it of b.items) {
        if (n >= MAX_ITEMS) break;
        const d = (it.d / Math.max(1e-6, b.length)) * v.length;
        this.p.copy(this.at(v, d));
        const up = this.p.clone().normalize();
        this.p.addScaledVector(up, 0.14);
        this.q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
        this.m4.compose(this.p, this.q, this.s);
        this.items.setMatrixAt(n, this.m4);
        this.items.setColorAt(n, this.colors.get(it.id)!);
        n++;
      }
    }
    this.items.count = n;
    this.items.instanceMatrix.needsUpdate = true;
    if (this.items.instanceColor) this.items.instanceColor.needsUpdate = true;
  }

  /** Copper cables with a little sag between linked pylons (and from the shelter to its pylons). */
  setCables(links: [THREE.Vector3, THREE.Vector3][]) {
    this.cables.clear();
    const mat = new THREE.LineBasicMaterial({ color: '#b8743f' });
    for (const [a0, b0] of links) {
      const a = a0.clone().addScaledVector(a0.clone().normalize(), PYLON_TOP), b = b0.clone().addScaledVector(b0.clone().normalize(), PYLON_TOP);
      const pts: THREE.Vector3[] = [];
      const sag = a.distanceTo(b) * 0.06;
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const p = a.clone().lerp(b, t);
        p.addScaledVector(p.clone().normalize(), -sag * 4 * t * (1 - t));
        pts.push(p);
      }
      this.cables.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
  }
}
