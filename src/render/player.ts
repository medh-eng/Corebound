// The Custodian on screen: your model, turned to face where you walk, with a bouncy
// procedural walk (until the model gets a skeleton) and jetpack flames.
import * as THREE from 'three';
import { loadModel } from './assets';

export class PlayerView {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private flames: THREE.Mesh[] = [];
  private jetLight = new THREE.PointLight('#ff8a3a', 0, 9, 2);
  private face = new THREE.Vector3(0, 0, 1);
  private faceSet = false;
  private phase = 0;
  private jetGlow = 0;
  ready = false;

  constructor() {
    this.root.name = 'player';
    this.root.add(this.body);
    // Placeholder until the model loads.
    const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1.0, 6, 12), new THREE.MeshStandardMaterial({ color: '#efe6d6' }));
    cap.position.y = 0.9;
    cap.castShadow = true;
    this.body.add(cap);

    const flameMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.55, 0.2).multiplyScalar(3), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    for (const x of [-0.14, 0.14]) {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.7, 10, 1, true), flameMat);
      f.rotation.x = Math.PI; // point down
      f.position.set(x, 0.62, -0.36);
      f.visible = false;
      this.flames.push(f);
      this.body.add(f);
    }
    this.jetLight.position.set(0, 0.5, -0.4);
    this.body.add(this.jetLight);
  }

  async load(): Promise<void> {
    try {
      const model = await loadModel('custodian');
      model.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          const mat = m.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 1.3;
          // AI textures come out a little dark and metallic; lift them toward the concept art.
          mat.metalness = Math.min(mat.metalness, 0.6);
          mat.color.multiplyScalar(1.25);
        }
      });
      this.body.clear();
      this.body.add(model, ...this.flames, this.jetLight);
      this.ready = true;
    } catch (e) {
      console.warn('Custodian model missing, using placeholder', e);
    }
  }

  /** pos: feet position; up: local up; vel: velocity; grounded/jetting flags. */
  update(dt: number, pos: THREE.Vector3, up: THREE.Vector3, vel: THREE.Vector3, heading: THREE.Vector3, grounded: boolean, jetting: boolean, time: number) {
    if (!this.faceSet) { this.face.copy(heading); this.faceSet = true; }
    const vt = vel.clone().addScaledVector(up, -vel.dot(up));
    const speed = vt.length();
    // Face the way you move; when standing still, slowly turn to the camera's forward.
    const want = speed > 0.4 ? vt.normalize() : this.face.clone().addScaledVector(up, -this.face.dot(up)).normalize();
    this.face.addScaledVector(up, -this.face.dot(up)).normalize();
    this.face.lerp(want, 1 - Math.exp(-10 * dt)).normalize();
    const x = new THREE.Vector3().crossVectors(up, this.face).normalize();
    const z = new THREE.Vector3().crossVectors(x, up).normalize();
    this.root.position.copy(pos);
    this.root.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, up, z));

    // Waddle walk: bob, sway and lean, scaled by speed.
    const sf = Math.min(1, speed / 6);
    if (grounded) this.phase += dt * (4 + speed * 1.35);
    const bob = grounded ? Math.abs(Math.sin(this.phase)) * 0.07 * sf : 0;
    this.body.position.y = bob;
    this.body.rotation.z = grounded ? Math.sin(this.phase) * 0.07 * sf : 0;
    this.body.rotation.x = grounded ? 0.09 * sf : 0.18 * Math.min(1, speed / 6) + (jetting ? 0.05 : 0);
    this.body.rotation.y = grounded ? Math.sin(this.phase * 0.5) * 0.04 * sf : 0;

    this.jetGlow += ((jetting ? 1 : 0) - this.jetGlow) * (1 - Math.exp(-14 * dt));
    for (const f of this.flames) {
      f.visible = this.jetGlow > 0.03;
      const flick = 0.85 + 0.25 * Math.sin(time * 47 + f.position.x * 30);
      f.scale.set(1, this.jetGlow * flick, 1);
      f.position.y = 0.62 - 0.35 * this.jetGlow * flick;
    }
    this.jetLight.intensity = this.jetGlow * 6;
  }

  get facing(): THREE.Vector3 { return this.face; }
}
