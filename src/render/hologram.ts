// Prof. Huxley as a blue-gold hologram (the Commander's rigged model, art-inbox/models/huxley.glb
// + Mixamo clips). Used in the memory-log viewer now; stands in the wreckage in M4.
// Draws into its own small canvas and stops by itself when the canvas is hidden.
import * as THREE from 'three';
import { loadAnimated } from './assets';

const VERT = /* glsl */ `
#include <common>
#include <skinning_pars_vertex>
varying vec3 vN; varying vec3 vV; varying vec2 vUv; varying float vY;
void main() {
  #include <skinbase_vertex>
  #include <begin_vertex>
  #include <beginnormal_vertex>
  #include <skinnormal_vertex>
  #include <skinning_vertex>
  vec4 wp = modelMatrix * vec4(transformed, 1.0);
  vec4 mv = viewMatrix * wp;
  vN = normalize(normalMatrix * objectNormal);
  vV = normalize(-mv.xyz);
  vUv = uv; vY = wp.y;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform sampler2D map; uniform float uTime; uniform float uHasMap;
varying vec3 vN; varying vec3 vV; varying vec2 vUv; varying float vY;
void main() {
  vec3 tex = uHasMap > 0.5 ? texture2D(map, vUv).rgb : vec3(0.6);
  float lum = dot(tex, vec3(0.3, 0.55, 0.15));
  float rim = pow(1.0 - abs(dot(normalize(vN), vV)), 2.2);
  float lines = 0.72 + 0.28 * sin(vY * 220.0 - uTime * 6.0);
  float sweep = smoothstep(0.0, 0.06, abs(fract(vY * 0.35 - uTime * 0.18) - 0.5) - 0.42);
  float flicker = 0.9 + 0.1 * sin(uTime * 31.0) * sin(uTime * 7.0);
  vec3 blue = vec3(0.42, 0.78, 1.0), gold = vec3(1.0, 0.8, 0.45);
  vec3 col = mix(blue * (0.35 + lum * 1.1), gold, rim * 0.85);
  col += gold * (1.0 - sweep) * 0.35;
  float a = (0.38 + lum * 0.5 + rim * 0.9) * lines * flicker;
  gl_FragColor = vec4(col * a, a);
}`;

export class HoloPortrait {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(24, 0.7, 0.1, 20);
  private mixer: THREE.AnimationMixer | null = null;
  private clips: THREE.AnimationClip[] = [];
  private action: THREE.AnimationAction | null = null;
  private uniforms: { uTime: { value: number } }[] = [];
  private loading: Promise<void> | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private frame = 0;
  private last = 0;
  private time = 0;
  private nextClip = 0;
  private turn = 0;
  ready = false;

  private async load() {
    const { scene: model, clips } = await loadAnimated('huxley_rigged');
    model.traverse((o) => {
      const m = o as THREE.SkinnedMesh;
      if (!m.isMesh) return;
      const old = m.material as THREE.MeshStandardMaterial;
      const u = { map: { value: old.map }, uTime: { value: 0 }, uHasMap: { value: old.map ? 1 : 0 } };
      this.uniforms.push(u);
      m.material = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG, uniforms: u,
        transparent: true, depthWrite: false, blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      });
      m.castShadow = m.receiveShadow = false;
    });
    this.scene.add(model);
    // The projector he stands on: a glowing ring and a faint beam.
    const disc = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.42, 48),
      new THREE.MeshBasicMaterial({ color: '#7fd0ff', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
    disc.rotation.x = -Math.PI / 2; disc.position.y = 0.01;
    const fade = document.createElement('canvas'); fade.width = 4; fade.height = 128;
    const fg = fade.getContext('2d')!; const grad = fg.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, 'rgba(255,255,255,0)'); grad.addColorStop(0.7, 'rgba(255,255,255,0.35)'); grad.addColorStop(1, 'rgba(255,255,255,1)');
    fg.fillStyle = grad; fg.fillRect(0, 0, 4, 128);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 2.0, 32, 1, true),
      new THREE.MeshBasicMaterial({ color: '#4aa8ff', map: new THREE.CanvasTexture(fade), transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
    beam.position.y = 1.0;
    this.scene.add(disc, beam);
    this.mixer = new THREE.AnimationMixer(model);
    this.clips = clips;
    // Stand him on the projector: measure the posed, skinned body as it will be drawn, then scale it
    // to 1.78 m and put the feet at y = 0, centred.
    const idle = clips.find((c) => c.name === 'idle') ?? clips[0];
    if (idle) { this.mixer.clipAction(idle).play(); this.mixer.update(0.1); this.mixer.stopAllAction(); }
    const measure = () => {
      model.updateMatrixWorld(true);
      model.traverse((o) => { const m = o as THREE.SkinnedMesh; if (m.isSkinnedMesh) m.skeleton.update(); });
      return new THREE.Box3().setFromObject(model, true);
    };
    let box = measure();
    const tall = box.max.y - box.min.y;
    if (tall > 0.2) model.scale.multiplyScalar(1.78 / tall);
    box = measure();
    const mid = box.getCenter(new THREE.Vector3());
    model.position.set(model.position.x - mid.x, model.position.y - box.min.y, model.position.z - mid.z);
    this.camera.position.set(0.2, 1.2, 4.3);
    this.camera.lookAt(0, 0.92, 0);
    this.ready = true;
  }

  private play(name: string) {
    const clip = this.clips.find((c) => c.name === name) ?? this.clips[0];
    if (!clip || !this.mixer) return;
    const next = this.mixer.clipAction(clip);
    next.reset().play();
    if (this.action && this.action !== next) this.action.crossFadeTo(next, 0.5, false);
    this.action = next;
    this.nextClip = this.time + Math.max(3, clip.duration);
  }

  /** Starts drawing into the canvas (loads the model the first time). */
  async start(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.loading ??= this.load().catch((e) => { console.warn('Huxley hologram:', e); });
    await this.loading;
    if (!this.ready || this.canvas !== canvas) return;
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      this.renderer.setClearColor(0x000000, 0);
    }
    this.turn = 0;
    this.play('talk');
    window.cancelAnimationFrame(this.frame);
    this.last = performance.now();
    this.frame = window.requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const c = this.canvas, r = this.renderer;
    if (!c || !r || !c.isConnected || c.offsetParent === null) { this.frame = 0; return; } // hidden: stop
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now; this.time += dt;
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * Math.min(2, devicePixelRatio)) || c.height !== Math.round(h * Math.min(2, devicePixelRatio))) {
      r.setPixelRatio(Math.min(2, devicePixelRatio)); r.setSize(w, h, false);
      this.camera.aspect = w / Math.max(1, h); this.camera.updateProjectionMatrix();
    }
    if (this.time > this.nextClip) this.play(['talk_2', 'think', 'talk', 'point', 'talk'][this.turn++ % 5]);
    this.mixer?.update(dt);
    for (const u of this.uniforms) u.uTime.value = this.time;
    r.render(this.scene, this.camera);
    this.frame = window.requestAnimationFrame(this.tick);
  };

  /** Draws a single frame at once (for screenshots, where frames are slow). */
  renderOnce(seconds = 1.5) {
    if (!this.renderer || !this.mixer) return;
    this.mixer.update(seconds); this.time += seconds;
    this.last = performance.now();
    this.tick(this.last);
  }
}
