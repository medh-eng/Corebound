// The Custodian on screen: your rigged model with its Mixamo animations (idle, walk, run,
// walk back, turns, jump), turned to face where you walk, plus jetpack flames.
import * as THREE from 'three';
import { loadAnimated, loadModel } from './assets';

type Anim = 'idle' | 'idle_stance' | 'walk' | 'run' | 'walk_back' | 'turn_left' | 'turn_right' | 'jump' | 'dance' | 'dance_silly' | 'salute';

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
  private emote: Anim | null = null;
  private emoteTime = 0;
  ready = false;
  animated = false;
  /** The mining laser tool; added to the scene by the game and placed in the right hand each frame. */
  readonly tool = new THREE.Group();
  private tip = new THREE.Object3D();
  private tipGlow: THREE.MeshStandardMaterial;
  private bones: { arm?: THREE.Bone; fore?: THREE.Bone; hand?: THREE.Bone } = {};
  private aim: THREE.Vector3 | null = null;
  private aimW = 0;

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

    // Mining laser: ceramic grip, copper barrel and coils, amber emitter. Points along +Z.
    const ceramic = new THREE.MeshStandardMaterial({ color: '#f2eadb', roughness: 0.5 });
    const copper = new THREE.MeshStandardMaterial({ color: '#c8794a', roughness: 0.3, metalness: 0.85 });
    this.tipGlow = new THREE.MeshStandardMaterial({ color: '#ffb347', emissive: '#ff9330', emissiveIntensity: 1.2 });
    const bodyM = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.26), ceramic);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.13, 0.07), copper);
    grip.position.set(0, -0.1, -0.06); grip.rotation.x = 0.25;
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.24, 12).rotateX(Math.PI / 2), copper);
    barrel.position.z = 0.22;
    const coilGeo = new THREE.TorusGeometry(0.045, 0.012, 6, 14);
    for (const z of [0.15, 0.21, 0.27]) { const c = new THREE.Mesh(coilGeo, copper); c.position.z = z; this.tool.add(c); }
    const emitter = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), this.tipGlow);
    emitter.position.z = 0.35;
    this.tip.position.z = 0.37;
    this.tool.add(bodyM, grip, barrel, emitter, this.tip);
    this.tool.traverse((o) => { o.castShadow = true; });
    this.tool.name = 'laser-tool';
  }

  /** World position of the laser's emitter. */
  get muzzle(): THREE.Vector3 { return this.tip.getWorldPosition(new THREE.Vector3()); }

  /** Point the laser (and right arm) at a world target, or null to lower it. */
  setAim(target: THREE.Vector3 | null) { this.aim = target ? target.clone() : null; }

  private pointBone(bone: THREE.Bone, child: THREE.Object3D, target: THREE.Vector3, w: number) {
    bone.updateWorldMatrix(true, false);
    child.updateWorldMatrix(false, false);
    const bp = bone.getWorldPosition(new THREE.Vector3());
    const cp = child.getWorldPosition(new THREE.Vector3());
    const cur = cp.sub(bp).normalize();
    const want = target.clone().sub(bp).normalize();
    const delta = new THREE.Quaternion().setFromUnitVectors(cur, want);
    const bw = bone.getWorldQuaternion(new THREE.Quaternion());
    const pw = (bone.parent as THREE.Object3D).getWorldQuaternion(new THREE.Quaternion());
    const aimed = pw.invert().multiply(delta.multiply(bw));
    bone.quaternion.slerp(aimed, w);
    bone.updateWorldMatrix(false, true);
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
      scene.traverse((o) => {
        const b = o as THREE.Bone;
        if (!b.isBone) return;
        if (/RightArm$/.test(b.name)) this.bones.arm = b;
        if (/RightForeArm$/.test(b.name)) this.bones.fore = b;
        if (/RightHand$/.test(b.name)) this.bones.hand = b;
      });
      this.mixer = new THREE.AnimationMixer(scene);
      for (const c of clips) {
        const a = this.mixer.clipAction(c);
        if (c.name === 'jump' || c.name === 'salute') { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
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

  /** Plays a celebration (salute once; dances loop until you move). Returns false if missing. */
  startEmote(name: 'dance' | 'dance_silly' | 'salute'): boolean {
    if (!this.actions.has(name)) return false;
    this.emote = name; this.emoteTime = 0;
    if (this.current === name) { this.actions.get(name)!.reset().play(); }
    return true;
  }
  get emoting() { return this.emote; }

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
    if (this.aim) {
      // Turn to face what you are mining.
      const t = this.aim.clone().sub(pos); t.addScaledVector(up, -t.dot(up));
      if (t.lengthSq() > 0.04) { want = t.normalize(); turning = 0; }
    }
    const rate = this.aim ? 12 : speed <= 0.4 ? 4 : 10;
    this.face.lerp(want, 1 - Math.exp(-rate * dt)).normalize();
    const x = new THREE.Vector3().crossVectors(up, this.face).normalize();
    const z = new THREE.Vector3().crossVectors(x, up).normalize();
    this.root.position.copy(pos);
    this.root.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, up, z));

    if (this.emote && (speed > 0.4 || !grounded || this.aim)) this.emote = null;
    if (this.emote === 'salute' && this.emoteTime > 2.7) this.emote = null;
    if (this.animated && this.mixer) {
      if (this.emote) { this.emoteTime += dt; this.play(this.emote, 0.3); }
      else if (!grounded) this.play('jump', 0.15);
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
      this.root.updateMatrixWorld(true);
      // Raise the right arm toward what the laser is aimed at.
      this.aimW += ((this.aim ? 1 : 0) - this.aimW) * (1 - Math.exp(-12 * dt));
      const { arm, fore, hand } = this.bones;
      if (this.aim && arm && fore && hand && this.aimW > 0.01) {
        this.pointBone(arm, fore, this.aim, this.aimW);
        this.pointBone(fore, hand, this.aim, this.aimW);
      }
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

    // Laser tool in the right hand: along the forearm when idle, at the target when firing.
    const { fore, hand } = this.bones;
    if (hand && fore) {
      const hp = hand.getWorldPosition(new THREE.Vector3());
      const fp = fore.getWorldPosition(new THREE.Vector3());
      const dir = this.aim && this.aimW > 0.3 ? this.aim.clone().sub(hp).normalize() : hp.clone().sub(fp).normalize();
      this.tool.position.copy(hp).addScaledVector(dir, 0.04);
      this.tool.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(), dir.clone().negate(), up));
    } else {
      const side = new THREE.Vector3().crossVectors(up, this.face).normalize();
      this.tool.position.copy(pos).addScaledVector(up, 1.0).addScaledVector(side, -0.35).addScaledVector(this.face, 0.25);
      const dir = this.aim ? this.aim.clone().sub(this.tool.position).normalize() : this.face.clone();
      this.tool.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(), dir.clone().negate(), up));
    }
    this.tipGlow.emissiveIntensity = this.aim ? 4 + Math.sin(time * 50) : 1.2;
  }

  get facing(): THREE.Vector3 { return this.face; }
}
