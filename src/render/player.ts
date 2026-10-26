// The Custodian on screen: your rigged model with its Mixamo animations (idle, walk, run,
// walk back, turns, jump), turned to face where you walk, plus jetpack flames.
import * as THREE from 'three';
import { loadAnimated, loadModel } from './assets';

type Anim = 'idle' | 'idle_stance' | 'walk' | 'run' | 'walk_back' | 'turn_left' | 'turn_right' | 'jump';

export class PlayerView {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private flames: THREE.Mesh[] = [];
  private jetLight = new THREE.PointLight('#ff8a3a', 0, 9, 2);
  private face = new THREE.Vector3(0, 0, 1);
  private faceSet = false;
  private phase = 0;
  private jetGlow = 0;
  private mixer: THREE.AnimationMixer | null = null;
  private actions = new Map<string, THREE.AnimationAction>();
  private current: Anim | null = null;
  private idleTime = 0;
  ready = false;
  animated = false;

  constructor() {
    this.root.name = 'player';
    this.root.add(this.body);
    const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1.0, 6, 12), new THREE.MeshStandardMaterial({ color: '#efe6d6' }));
    cap.position.y = 0.9;
    cap.castShadow = true;
    this.body.add(cap);
    const flameMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.55, 0.2).multiplyScalar(3), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    for (const x of [-0.14, 0.14]) {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.7, 10, 1, true), flameMat);
      f.rotation.x = Math.PI;
      f.position.set(x, 0.62, -0.36);
      f.visible = false;
      this.flames.push(f);
      this.body.add(f);
    }
    this.jetLight.position.set(0, 0.5, -0.4);
    this.body.add(this.jetLight);
  }

  private tune(model: THREE.Object3D) {
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.envMapIntensity = 1.3;
      // Mixamo exports darken the colour factor; AI textures can come out dark and metallic.
      // Lift them toward the concept art.
      if (mat.color.r < 0.5) { mat.color.setRGB(1, 1, 1); mat.roughness = 0.65; mat.metalness = 0.15; }
      mat.metalness = Math.min(mat.metalness, 0.5);
      mat.color.multiplyScalar(1.15);
    });
  }

  async load(): Promise<void> {
    try {
      const { scene, clips } = await loadAnimated('custodian_rigged');
      this.tune(scene);
      this.mixer = new THREE.AnimationMixer(scene);
      for (const c of clips) {
        const a = this.mixer.clipAction(c);
        if (c.name === 'jump') { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
        this.actions.set(c.name, a);
      }
      this.body.clear();
      this.body.add(scene, ...this.flames, this.jetLight);
      this.animated = this.actions.size > 0;
      this.ready = true;
      this.play('idle_stance', 0);
      return;
    } catch (e) {
      console.warn('Rigged Custodian missing, falling back to the static model', e);
    }
    try {
      const model = await loadModel('custodian');
      this.tune(model);
      this.body.clear();
      this.body.add(model, ...this.flames, this.jetLight);
      this.ready = true;
    } catch (e) {
      console.warn('Custodian model missing, using placeholder', e);
    }
  }

  private play(name: Anim, fade = 0.25, speed = 1) {
    const want = this.actions.has(name) ? name : name === 'idle_stance' ? 'idle' : name;
    const next = this.actions.get(want);
    if (!next) return;
    next.timeScale = speed;
    if (this.current === want) return;
    const prev = this.current ? this.actions.get(this.current) : null;
    next.reset().play();
    if (prev && fade > 0) next.crossFadeFrom(prev, fade, true);
    else if (prev) prev.stop();
    this.current = want as Anim;
  }

  /** pos: feet position; up: local up; vel: velocity; heading: camera forward; flags from movement. */
  update(dt: number, pos: THREE.Vector3, up: THREE.Vector3, vel: THREE.Vector3, heading: THREE.Vector3, grounded: boolean, jetting: boolean, time: number) {
    if (!this.faceSet) { this.face.copy(heading); this.faceSet = true; }
    const vt = vel.clone().addScaledVector(up, -vel.dot(up));
    const speed = vt.length();
    const hd = heading.clone().addScaledVector(up, -heading.dot(up)).normalize();
    const backwards = speed > 0.4 && vt.dot(hd) < -0.5 * speed;
    this.face.addScaledVector(up, -this.face.dot(up)).normalize();
    let turning = 0;
    let want: THREE.Vector3;
    if (backwards) want = hd;                         // walk backwards while facing forward
    else if (speed > 0.4) want = vt.clone().normalize();
    else {
      // Standing: turn on the spot when the camera swings far enough away.
      const ang = this.face.angleTo(hd);
      want = ang > 0.6 ? hd : this.face.clone();
      if (ang > 0.6) turning = Math.sign(new THREE.Vector3().crossVectors(this.face, hd).dot(up));
    }
    const rate = speed <= 0.4 ? 4 : 10;
    this.face.lerp(want, 1 - Math.exp(-rate * dt)).normalize();
    const x = new THREE.Vector3().crossVectors(up, this.face).normalize();
    const z = new THREE.Vector3().crossVectors(x, up).normalize();
    this.root.position.copy(pos);
    this.root.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, up, z));

    if (this.animated && this.mixer) {
      if (!grounded) this.play('jump', 0.15);
      else if (backwards) this.play('walk_back', 0.25, Math.min(1.4, speed / 3));
      else if (speed > 6) this.play('run', 0.25, speed / 7.5);
      else if (speed > 0.4) this.play('walk', 0.25, Math.max(0.7, speed / 4.2));
      else if (turning) this.play(turning > 0 ? 'turn_left' : 'turn_right', 0.2);
      else {
        this.idleTime += dt;
        // Mostly the stance idle; now and then the long breathing idle.
        this.play(Math.floor(this.idleTime / 16) % 3 === 2 ? 'idle' : 'idle_stance', 0.4);
      }
      if (speed > 0.4 || !grounded) this.idleTime = 0;
      this.mixer.update(dt);
      this.body.position.y = 0;
      this.body.rotation.set(jetting ? 0.12 : 0, 0, 0);
    } else {
      // Fallback waddle for an unrigged model.
      const sf = Math.min(1, speed / 6);
      if (grounded) this.phase += dt * (4 + speed * 1.35);
      this.body.position.y = grounded ? Math.abs(Math.sin(this.phase)) * 0.07 * sf : 0;
      this.body.rotation.z = grounded ? Math.sin(this.phase) * 0.07 * sf : 0;
      this.body.rotation.x = grounded ? 0.09 * sf : 0.18 * sf + (jetting ? 0.05 : 0);
    }

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
