// SARATHI, the damaged lotus-shaped ship AI, as a small drone that floats beside the Custodian
// (the Commander's model, art-inbox/models/sarthi.glb). It bobs, leans as it follows, and when it
// speaks a ring of light opens above its petals. No face: the hologram is rings only (style bible).
import * as THREE from 'three';
import { loadModel } from './assets';
import { shared } from '../art/materials';

const ringMat = (color: string, opacity: number) => new THREE.MeshBasicMaterial({
  color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
});

export class SarathiDrone {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private holo = new THREE.Group();
  private rings: THREE.Mesh[] = [];
  private beam!: THREE.Mesh;
  private core!: THREE.Mesh;
  private thrust!: THREE.Sprite;
  private pos = new THREE.Vector3();
  private vel = new THREE.Vector3();
  private face = new THREE.Vector3(0, 0, 1);
  private placed = false;
  private talk = 0;      // seconds of speech left
  private open = 0;      // 0..1 hologram opening
  private height = 0.55;
  private mats: THREE.MeshStandardMaterial[] = [];

  async load() {
    try {
      const model = await loadModel('sarathi');
      this.height = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).y || this.height;
      model.position.y = -this.height / 2; // turn about its middle
      // Its painted texture lights up a little at night so it never becomes a dark blot.
      model.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
        if (!m || !(o as THREE.Mesh).isMesh || !m.map) return;
        m.emissive = new THREE.Color('#ffe2b8'); m.emissiveMap = m.map; m.emissiveIntensity = 0;
        // Sarvam (T-024): an all-brass bud reads as a lamp kept at a shrine. Until a ceramic model
        // arrives, repaint it in the style bible's materials: off-white ceramic shell, copper only in
        // the darker trim, cyan glow kept. The shading of the painted texture is kept.
        m.metalnessMap = null; m.metalness = 0.12; m.roughness = 0.5;
        m.customProgramCacheKey = () => 'sarathi-ceramic';
        m.onBeforeCompile = (sh) => {
          sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
            {
              vec3 c = diffuseColor.rgb;
              float l = dot(c, vec3(0.299, 0.587, 0.114));
              float teal = smoothstep(0.03, 0.15, (c.g + c.b) * 0.5 - c.r);
              vec3 ceramic = vec3(0.93, 0.9, 0.84) * (0.35 + 1.6 * smoothstep(0.0, 0.45, l));
              vec3 copper = vec3(0.62, 0.34, 0.2) * (0.6 + 1.2 * l);
              float trim = smoothstep(0.16, 0.08, l);
              diffuseColor.rgb = mix(mix(ceramic, copper, trim), c, teal);
            }`);
        };
        this.mats.push(m);
      });
      this.body.add(model);
    } catch {
      // No model yet: a simple bud of petals stands in.
      const petal = new THREE.MeshStandardMaterial({ color: '#c8a26a', metalness: 0.6, roughness: 0.4 });
      for (let i = 0; i < 8; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI), petal);
        p.scale.set(0.7, 1.6, 0.5); p.rotation.y = (i / 8) * Math.PI * 2; p.position.set(Math.sin(p.rotation.y) * 0.1, 0, Math.cos(p.rotation.y) * 0.1);
        this.body.add(p);
      }
    }
    // The cyan heart that shows between the petals; brighter when it talks.
    this.core = new THREE.Mesh(new THREE.SphereGeometry(this.height * 0.17, 16, 12),
      new THREE.MeshBasicMaterial({ color: '#5fffe0', transparent: true, opacity: 0.85, toneMapped: false }));
    this.core.position.y = this.height * 0.12;
    this.body.add(this.core);
    // Thruster glow underneath.
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d')!; const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,214,150,1)'); gr.addColorStop(0.35, 'rgba(255,150,70,0.55)'); gr.addColorStop(1, 'rgba(255,120,40,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    this.thrust = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
    this.thrust.position.y = -this.height * 0.55;
    for (const m of this.mats) m.emissiveIntensity = 0.04 + shared.uNight.value * 0.3;
    this.thrust.scale.setScalar(this.height * 0.7);
    this.body.add(this.thrust);
    // Hologram: a soft beam and two turning rings above the petals.
    const h = this.height;
    this.beam = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.55, h * 0.12, h * 0.7, 24, 1, true), ringMat('#5fe8ff', 0.12));
    this.beam.position.y = h * 0.35;
    this.holo.add(this.beam);
    for (let i = 0; i < 2; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(h * (0.5 - i * 0.16), h * 0.018, 6, 48), ringMat(i ? '#ffd27a' : '#6ff0ff', 0.9));
      r.rotation.x = Math.PI / 2;
      r.position.y = h * (0.72 - i * 0.2);
      this.rings.push(r); this.holo.add(r);
    }
    this.holo.position.y = h * 0.45;
    this.holo.visible = false;
    this.body.add(this.holo);
    this.root.add(this.body);
    this.root.visible = false;
  }

  /** SARATHI is talking: open the hologram for about this long. */
  speak(seconds: number) { this.talk = Math.max(this.talk, Math.min(seconds, 12)); }

  /** Follows the Custodian: hovers off the left shoulder (the camera looks over the right one). */
  update(dt: number, at: THREE.Vector3, up: THREE.Vector3, heading: THREE.Vector3, opts: { visible: boolean; underground: boolean }) {
    this.root.visible = opts.visible;
    if (!opts.visible) { this.placed = false; return; }
    const t = shared.uTime.value;
    const fwd = heading.clone().addScaledVector(up, -heading.dot(up)).normalize();
    const left = new THREE.Vector3().crossVectors(up, fwd).normalize();
    const lift = opts.underground ? 1.45 : 1.95;
    const side = opts.underground ? 0.75 : 1.05;
    const target = at.clone().addScaledVector(up, lift + Math.sin(t * 1.7) * 0.07)
      .addScaledVector(left, side).addScaledVector(fwd, this.talk > 0 ? 0.35 : -0.45);
    if (!this.placed || this.pos.distanceTo(target) > 20) { this.pos.copy(target); this.vel.set(0, 0, 0); this.placed = true; }
    // A soft spring: it lags a little behind you and catches up.
    const k = 14, damp = 2 * Math.sqrt(k) * 0.9;
    this.vel.addScaledVector(target.clone().sub(this.pos), k * dt).addScaledVector(this.vel, -damp * dt);
    this.pos.addScaledVector(this.vel, dt);
    this.root.position.copy(this.pos);
    // Face where you are going (or turn toward you while talking), leaning into its motion.
    const want = this.talk > 0 ? at.clone().addScaledVector(up, 1.6).sub(this.pos) : fwd.clone();
    want.addScaledVector(up, -want.dot(up));
    if (want.lengthSq() > 1e-4) this.face.lerp(want.normalize(), 1 - Math.exp(-3 * dt)).normalize();
    this.face.addScaledVector(up, -this.face.dot(up)).normalize();
    const x = new THREE.Vector3().crossVectors(up, this.face).normalize();
    const z = new THREE.Vector3().crossVectors(x, up).normalize();
    this.root.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, up, z));
    const v = this.vel.clone().addScaledVector(up, -this.vel.dot(up));
    this.body.rotation.set(THREE.MathUtils.clamp(v.dot(z) * 0.12, -0.35, 0.35) + Math.sin(t * 1.3) * 0.04,
      0, THREE.MathUtils.clamp(-v.dot(x) * 0.12, -0.35, 0.35) + Math.sin(t * 0.9) * 0.05);

    // Speech and glow.
    this.talk = Math.max(0, this.talk - dt);
    this.open += ((this.talk > 0 ? 1 : 0) - this.open) * (1 - Math.exp(-6 * dt));
    this.holo.visible = this.open > 0.02;
    this.holo.scale.setScalar(0.3 + this.open * 0.7);
    this.rings[0].rotation.z = t * 0.9; this.rings[1].rotation.z = -t * 1.4;
    for (const r of this.rings) (r.material as THREE.MeshBasicMaterial).opacity = 0.85 * this.open * (0.85 + 0.15 * Math.sin(t * 9));
    (this.beam.material as THREE.MeshBasicMaterial).opacity = 0.13 * this.open;
    const flicker = 0.85 + 0.15 * Math.sin(t * 5.3) * Math.sin(t * 2.1);
    (this.core.material as THREE.MeshBasicMaterial).opacity = (0.55 + 0.45 * this.open) * flicker;
    this.core.scale.setScalar(1 + this.open * 0.15);
    for (const m of this.mats) m.emissiveIntensity = 0.04 + shared.uNight.value * 0.3;
    this.thrust.scale.setScalar(this.height * (0.6 + 0.12 * Math.sin(t * 23) + Math.min(0.5, this.vel.length() * 0.08)));
  }
}
