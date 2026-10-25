// Bloom, tone mapping and a light colour grade (warm lift + soft vignette).
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uVignette: { value: 0.28 }, uWarm: { value: 0.025 }, uSat: { value: 1.18 } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uVignette, uWarm, uSat; varying vec2 vUv;
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 d = vUv - 0.5;
      float v = 1.0 - uVignette * smoothstep(0.25, 0.85, length(d * vec2(1.25, 1.0)));
      c.rgb *= v;
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb = clamp(mix(vec3(l), c.rgb, uSat), 0.0, 1.0);
      c.rgb += vec3(uWarm, uWarm * 0.5, 0.0) * (1.0 - c.rgb);
      gl_FragColor = c;
    }`,
};

export interface PostFX {
  composer: EffectComposer;
  bloom: UnrealBloomPass;
  resize(w: number, h: number): void;
}

export function buildPostFX(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): PostFX {
  const size = renderer.getSize(new THREE.Vector2());
  const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), 0.55, 0.65, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.addPass(new ShaderPass(GradeShader));
  return {
    composer, bloom,
    resize(w, h) { composer.setSize(w, h); bloom.resolution.set(w / 2, h / 2); },
  };
}
