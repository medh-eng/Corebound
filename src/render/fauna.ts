// Living things that answer Harmony. M3: glow-moths (Jyotishalabha) drifting around the plants near
// you; more when the world is healthy, none when it collapses. Never harmful, never harmed.
import * as THREE from 'three';
import { shared } from '../art/materials';

const MAX = 140;

interface Moth { home: THREE.Vector3; up: THREE.Vector3; t: THREE.Vector3; b: THREE.Vector3; ph: number; sp: number; r: number; h: number }

export class Fauna {
  readonly group = new THREE.Group();
  private moths: Moth[] = [];
  private mesh: THREE.InstancedMesh;
  private anchor = new THREE.Vector3(1e9, 0, 0);
  private m4 = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private s = new THREE.Vector3();
  private p = new THREE.Vector3();
  private live: THREE.Vector3[] = [];

  /** The nearest moth close to a ray (for the scanner). */
  nearRay(o: THREE.Vector3, d: THREE.Vector3, maxT: number): number | null {
    let best: number | null = null;
    for (const p of this.live) {
      const oc = p.clone().sub(o); const t = oc.dot(d);
      if (t < 0 || t > maxT) continue;
      if (oc.lengthSq() - t * t < 0.8 * 0.8 && (best === null || t < best)) best = t;
    }
    return best;
  }

  constructor(private ground: (dir: THREE.Vector3) => number) {
    // A moth: two soft wing quads; wings flap in the vertex shader.
    const g = new THREE.BufferGeometry();
    const w = 0.16, h = 0.12;
    const pos = new Float32Array([0, 0, 0, w, 0, -h, w, 0, h, 0, 0, 0, -w, 0, h, -w, 0, -h]);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.computeVertexNormals();
    const mat = new THREE.MeshBasicMaterial({ color: '#ffe8a8', side: THREE.DoubleSide, transparent: true, opacity: 0.95, depthWrite: false });
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = shared.uTime;
      sh.uniforms.uNight = shared.uNight;
      sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
          float ph = instanceMatrix[3][0] * 3.1 + instanceMatrix[3][2] * 1.7;
        #else
          float ph = 0.0;
        #endif
        float flap = sin(uTime * 22.0 + ph) * 0.9;
        transformed.y += abs(transformed.x) * flap;
        transformed.x *= 1.0 - 0.35 * abs(flap);`);
      sh.fragmentShader = 'uniform float uNight;\n' + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        diffuseColor.rgb *= mix(1.1, 3.2, uNight);`);
    };
    this.mesh = new THREE.InstancedMesh(g, mat, MAX);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.group.add(this.mesh);
    const tints = ['#ffe8a8', '#c9f7ff', '#ffc9ef', '#d6ffc9'].map((c) => new THREE.Color(c));
    for (let i = 0; i < MAX; i++) this.mesh.setColorAt(i, tints[i % tints.length]);
  }

  /** Re-homes the moths around the player when they have moved far. */
  private scatter(around: THREE.Vector3) {
    this.anchor.copy(around);
    const up = around.clone().normalize();
    const t = new THREE.Vector3().crossVectors(up, Math.abs(up.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
    const b = new THREE.Vector3().crossVectors(up, t);
    this.moths = [];
    for (let i = 0; i < MAX; i++) {
      const a = Math.random() * Math.PI * 2, d = 4 + Math.sqrt(Math.random()) * 34;
      const dir = around.clone().addScaledVector(t, Math.cos(a) * d).addScaledVector(b, Math.sin(a) * d).normalize();
      const home = dir.clone().multiplyScalar(this.ground(dir));
      const u = dir.clone();
      const tt = new THREE.Vector3().crossVectors(u, t).normalize();
      this.moths.push({ home, up: u, t: tt, b: new THREE.Vector3().crossVectors(u, tt), ph: Math.random() * 100, sp: 0.3 + Math.random() * 0.5, r: 0.8 + Math.random() * 2.2, h: 0.6 + Math.random() * 2.6 });
    }
  }

  /** `abundance` 0..1 (from Harmony) sets how many fly. */
  update(time: number, player: THREE.Vector3, abundance: number) {
    if (this.anchor.distanceTo(player) > 22) this.scatter(player);
    const n = Math.round(MAX * Math.max(0, Math.min(1, abundance)));
    this.live.length = 0;
    for (let i = 0; i < n; i++) {
      const m = this.moths[i];
      const k = time * m.sp + m.ph;
      this.p.copy(m.home).addScaledVector(m.t, Math.cos(k) * m.r).addScaledVector(m.b, Math.sin(k * 1.3) * m.r)
        .addScaledVector(m.up, m.h + Math.sin(k * 2.1) * 0.35);
      const heading = m.t.clone().multiplyScalar(-Math.sin(k)).addScaledVector(m.b, Math.cos(k * 1.3) * 1.3).normalize();
      this.q.setFromRotationMatrix(this.m4.lookAt(new THREE.Vector3(), heading, m.up));
      this.s.setScalar(1);
      this.m4.compose(this.p, this.q, this.s);
      this.mesh.setMatrixAt(i, this.m4);
      this.live.push(this.p.clone());
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
