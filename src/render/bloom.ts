// Bloom flowers: rare glowing flowers that open only while Harmony is thriving. Laser one to collect it.
import * as THREE from 'three';

export interface Bloom { pos: THREE.Vector3; root: THREE.Group; born: number; fade?: number }

export class BloomField {
  readonly group = new THREE.Group();
  readonly blooms: Bloom[] = [];
  private petalMat = new THREE.MeshStandardMaterial({ color: '#ff9ad5', emissive: '#ff5fb8', emissiveIntensity: 1.6, roughness: 0.5, side: THREE.DoubleSide });
  private coreMat = new THREE.MeshStandardMaterial({ color: '#fff3b0', emissive: '#ffd36a', emissiveIntensity: 2.5 });

  constructor(private ground: (dir: THREE.Vector3) => number) {}

  /** Opens a new bloom on the ground somewhere 6–30 m from `near`. */
  spawn(near: THREE.Vector3, time: number, avoid: (p: THREE.Vector3) => boolean) {
    const up = near.clone().normalize();
    const t = new THREE.Vector3().crossVectors(up, Math.abs(up.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
    const b = new THREE.Vector3().crossVectors(up, t);
    for (let tries = 0; tries < 12; tries++) {
      const a = Math.random() * Math.PI * 2, d = 6 + Math.random() * 24;
      const dir = near.clone().addScaledVector(t, Math.cos(a) * d).addScaledVector(b, Math.sin(a) * d).normalize();
      const pos = dir.clone().multiplyScalar(this.ground(dir));
      if (avoid(pos)) continue;
      const root = new THREE.Group();
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.6, 6).translate(0, 0.3, 0), new THREE.MeshStandardMaterial({ color: '#3f9a5a' }));
      root.add(stem);
      for (let i = 0; i < 7; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 6).scale(0.45, 0.12, 1).translate(0, 0, 0.16), this.petalMat);
        p.position.y = 0.62;
        p.rotation.set(-0.5, (i / 7) * Math.PI * 2, 0, 'YXZ');
        root.add(p);
      }
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), this.coreMat);
      core.position.y = 0.64;
      const light = new THREE.PointLight('#ff7fc8', 1.5, 4, 2);
      light.position.y = 0.8;
      root.add(core, light);
      root.position.copy(pos);
      root.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      root.scale.setScalar(0.01);
      this.group.add(root);
      this.blooms.push({ pos, root, born: time });
      return true;
    }
    return false;
  }

  /** The bloom a ray hits within `maxT`, if any. */
  raycast(o: THREE.Vector3, d: THREE.Vector3, maxT: number): { t: number; bloom: Bloom } | null {
    let best: { t: number; bloom: Bloom } | null = null;
    for (const bl of this.blooms) {
      const c = bl.pos.clone().addScaledVector(bl.pos.clone().normalize(), 0.55);
      const oc = c.sub(o);
      const t = oc.dot(d);
      if (t < 0 || t > maxT) continue;
      if (oc.lengthSq() - t * t < 0.45 * 0.45 && (!best || t < best.t)) best = { t, bloom: bl };
    }
    return best;
  }

  remove(bl: Bloom) {
    this.group.remove(bl.root);
    this.blooms.splice(this.blooms.indexOf(bl), 1);
  }

  /** Opens new blooms gently; when the world is no longer thriving they fade away. */
  update(time: number, thriving: boolean) {
    for (const bl of [...this.blooms]) {
      if (!thriving && time - bl.born > 4) bl.fade = (bl.fade ?? 1) * 0.985;
      const s = Math.min(1, (time - bl.born) / 2) * (bl.fade ?? 1);
      bl.root.scale.setScalar(Math.max(0.01, s));
      bl.root.rotateY(0.004);
      if ((bl.fade ?? 1) < 0.05) this.remove(bl);
    }
  }
}
