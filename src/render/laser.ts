// The mining laser: a hot amber beam, a glowing impact point and a spray of sparks.
import * as THREE from 'three';
import { shared } from '../art/materials';

const SPARKS = 60;

export class LaserView {
  readonly group = new THREE.Group();
  private beam: THREE.Mesh;
  private core: THREE.Mesh;
  private light = new THREE.PointLight('#ffb050', 0, 7, 2);
  private sparks: THREE.Points;
  private sp: Float32Array;
  private sv: Float32Array;
  private life: Float32Array;
  private next = 0;
  on = false;

  constructor() {
    this.group.name = 'laser';
    const beamMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.55, 0.18).multiplyScalar(4), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    this.beam = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 1, 8, 1, true).translate(0, 0.5, 0).rotateX(Math.PI / 2), beamMat);
    this.core = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.75, 0.4).multiplyScalar(6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.sp = new Float32Array(SPARKS * 3); this.sv = new Float32Array(SPARKS * 3); this.life = new Float32Array(SPARKS);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.sp, 3));
    g.setAttribute('life', new THREE.BufferAttribute(this.life, 1));
    this.sparks = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: { uTime: shared.uTime },
      vertexShader: `attribute float life; varying float vL; void main(){ vL = life; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv; gl_PointSize = life > 0.0 ? 60.0 * life / -mv.z + 1.5 : 0.0; }`,
      fragmentShader: `varying float vL; void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(vec3(1.0, 0.6, 0.25) * 4.0, vL); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    this.sparks.frustumCulled = false;
    this.group.add(this.beam, this.core, this.light, this.sparks);
    this.beam.visible = this.core.visible = false;
  }

  update(dt: number, from: THREE.Vector3 | null, to: THREE.Vector3 | null, normal: THREE.Vector3 | null) {
    const t = shared.uTime.value;
    this.on = !!(from && to);
    this.beam.visible = this.core.visible = this.on;
    this.light.intensity = this.on ? 5 + Math.sin(t * 60) * 1.5 : 0;
    if (from && to) {
      const d = to.distanceTo(from);
      this.beam.position.copy(from);
      this.beam.lookAt(to);
      this.beam.scale.set(1 + Math.sin(t * 80) * 0.25, 1 + Math.sin(t * 80) * 0.25, d);
      this.core.position.copy(to);
      this.core.scale.setScalar(0.8 + Math.sin(t * 50) * 0.25);
      this.light.position.copy(to);
      // Emit sparks.
      for (let k = 0; k < 3; k++) {
        const i = this.next++ % SPARKS;
        this.sp[i * 3] = to.x; this.sp[i * 3 + 1] = to.y; this.sp[i * 3 + 2] = to.z;
        const n = normal ?? new THREE.Vector3(0, 1, 0);
        const rnd = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(2.5);
        const v = n.clone().multiplyScalar(2.5 + Math.random() * 2).add(rnd);
        this.sv[i * 3] = v.x; this.sv[i * 3 + 1] = v.y; this.sv[i * 3 + 2] = v.z;
        this.life[i] = 1;
      }
    }
    for (let i = 0; i < SPARKS; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt * 2.2;
      const px = this.sp[i * 3], py = this.sp[i * 3 + 1], pz = this.sp[i * 3 + 2];
      const l = Math.hypot(px, py, pz) || 1;
      this.sv[i * 3] -= (px / l) * 9.8 * dt; this.sv[i * 3 + 1] -= (py / l) * 9.8 * dt; this.sv[i * 3 + 2] -= (pz / l) * 9.8 * dt;
      this.sp[i * 3] += this.sv[i * 3] * dt; this.sp[i * 3 + 1] += this.sv[i * 3 + 1] * dt; this.sp[i * 3 + 2] += this.sv[i * 3 + 2] * dt;
    }
    this.sparks.geometry.attributes.position.needsUpdate = true;
    (this.sparks.geometry.attributes.life as THREE.BufferAttribute).needsUpdate = true;
  }
}
