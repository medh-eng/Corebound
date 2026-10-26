// Shared stylised materials. Every glowing thing reads a per-vertex "glow" colour
// that brightens at night; plants can sway in the wind.
import * as THREE from 'three';

export const MAX_BOXES = 128;
const boxMin: THREE.Vector4[] = Array.from({ length: MAX_BOXES }, () => new THREE.Vector4(1e9, 1e9, 1e9, 0));
const boxMax: THREE.Vector3[] = Array.from({ length: MAX_BOXES }, () => new THREE.Vector3(-1e9, -1e9, -1e9));

export const shared = {
  uBoxMin: { value: boxMin },   // w = 1 keeps water inside (rivers)
  uBoxMax: { value: boxMax },
  uBoxCount: { value: 0 },
  uTime: { value: 0 },
  uNight: { value: 0 },        // 0 day .. 1 night, at the player's location
  uWind: { value: 1 },
  // Painted ground textures (owner art), applied as triplanar detail on terrain.
  uDetail: { value: 0 },
  uTexGrass: { value: null as THREE.Texture | null }, uTexSoil: { value: null as THREE.Texture | null },
  uTexRock: { value: null as THREE.Texture | null }, uTexSand: { value: null as THREE.Texture | null },
  uTexMean: { value: [new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1)] },
};

/** Low quality skips the texture detail on terrain (set before building materials). */
export const quality = { detail: true };

export interface StylisedOptions {
  roughness?: number;
  metalness?: number;
  vertexColors?: boolean;
  color?: THREE.ColorRepresentation;
  glow?: boolean;              // reads attribute `glow` (vec3)
  glowDay?: number;            // glow strength in daylight
  glowNight?: number;          // glow strength at night
  sway?: number;               // metres of sway at 1 m height (instanced plants)
  swayHeight?: number;         // height at which sway reaches full strength
  side?: THREE.Side;
  flatShading?: boolean;
  envMapIntensity?: number;
  mottle?: number;             // world-space colour variation (terrain detail)
  map?: THREE.Texture | null;
  cutBoxes?: 'ground';          // hide this mesh inside dug-out regions (voxel chunks draw there)
  detail?: 'ground' | 'dug';    // triplanar painted textures chosen from the vertex colour
}

const DETAIL_GLSL = /* glsl */ `
  uniform sampler2D uTexGrass, uTexSoil, uTexRock, uTexSand;
  uniform vec3 uTexMean[4];
  uniform float uDetail;
  varying vec3 vDetP; varying vec3 vDetN;
  vec3 tri(sampler2D t, vec3 p, vec3 w, float s) {
    return texture2D(t, p.yz * s).rgb * w.x + texture2D(t, p.zx * s).rgb * w.y + texture2D(t, p.xy * s).rgb * w.z;
  }`;

let key = 0;

export function stylised(o: StylisedOptions = {}): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    color: o.color ?? '#ffffff',
    roughness: o.roughness ?? 0.85,
    metalness: o.metalness ?? 0,
    vertexColors: o.vertexColors ?? false,
    side: o.side ?? THREE.FrontSide,
    flatShading: o.flatShading ?? false,
    envMapIntensity: o.envMapIntensity ?? 0.25,
    map: o.map ?? null,
  });
  const glowDay = o.glowDay ?? 0.35;
  const glowNight = o.glowNight ?? 2.2;
  const sway = o.sway ?? 0;
  const swayH = o.swayHeight ?? 1;
  const mottle = o.mottle ?? 0;
  const id = ++key;
  const detail = quality.detail ? o.detail : undefined;
  m.customProgramCacheKey = () => `stylised-${o.glow ? 1 : 0}-${sway > 0 ? 1 : 0}-${mottle > 0 ? 1 : 0}-${o.cutBoxes ? 1 : 0}-${detail ?? ''}-${id}`;
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = shared.uTime;
    shader.uniforms.uNight = shared.uNight;
    shader.uniforms.uWind = shared.uWind;
    let vs = shader.vertexShader;
    let fs = shader.fragmentShader;
    const vDecl: string[] = ['uniform float uTime;', 'uniform float uWind;'];
    const fDecl: string[] = ['uniform float uNight;'];
    if (o.glow) {
      vDecl.push('attribute vec3 glow;', 'varying vec3 vGlow;');
      fDecl.push('varying vec3 vGlow;');
      vs = vs.replace('#include <begin_vertex>', '#include <begin_vertex>\n vGlow = glow;');
      fs = fs.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>\n totalEmissiveRadiance += vGlow * mix(${glowDay.toFixed(3)}, ${glowNight.toFixed(3)}, uNight);`,
      );
    }
    if (sway > 0) {
      vs = vs.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          #ifdef USE_INSTANCING
            vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
          #else
            vec3 ip = vec3(0.0);
          #endif
          float ph = dot(ip, vec3(0.37, 0.71, 0.53));
          float k = pow(clamp(position.y / ${swayH.toFixed(3)}, 0.0, 1.5), 2.0) * ${sway.toFixed(3)} * uWind;
          transformed.x += k * sin(uTime * 1.7 + ph);
          transformed.z += k * 0.6 * cos(uTime * 1.3 + ph * 1.7);
        }`,
      );
    }
    if (o.cutBoxes) {
      shader.uniforms.uBoxMin = shared.uBoxMin; shader.uniforms.uBoxMax = shared.uBoxMax; shader.uniforms.uBoxCount = shared.uBoxCount;
      vDecl.push('varying vec3 vCutP;');
      fDecl.push('varying vec3 vCutP;', CUT_GLSL);
      vs = vs.replace('#include <begin_vertex>', '#include <begin_vertex>\n vCutP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      fs = fs.replace('void main() {', 'void main() {\n if (insideCut(vCutP, false)) discard;');
    }
    if (mottle > 0) {
      vDecl.push('varying vec3 vWorldP;');
      fDecl.push('varying vec3 vWorldP;');
      vs = vs.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vWorldP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      // Make sure worldpos_vertex runs even without shadows/envmaps.
      vs = vs.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>');
      fDecl.push(`
        float hash3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        float vnoise(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
          return mix(mix(mix(hash3(i+vec3(0,0,0)),hash3(i+vec3(1,0,0)),f.x), mix(hash3(i+vec3(0,1,0)),hash3(i+vec3(1,1,0)),f.x),f.y),
                     mix(mix(hash3(i+vec3(0,0,1)),hash3(i+vec3(1,0,1)),f.x), mix(hash3(i+vec3(0,1,1)),hash3(i+vec3(1,1,1)),f.x),f.y), f.z); }`);
      fs = fs.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float mt = vnoise(vWorldP * 0.55) * 0.6 + vnoise(vWorldP * 2.3) * 0.4;
        diffuseColor.rgb *= 1.0 + (mt - 0.5) * ${(mottle * 2).toFixed(3)};`,
      );
    }
    if (detail) {
      for (const k of ['uDetail', 'uTexGrass', 'uTexSoil', 'uTexRock', 'uTexSand', 'uTexMean'] as const) shader.uniforms[k] = shared[k];
      vDecl.push('varying vec3 vDetP; varying vec3 vDetN;');
      fDecl.push(DETAIL_GLSL);
      vs = vs.replace('#include <begin_vertex>', '#include <begin_vertex>\n vDetP = (modelMatrix * vec4(transformed, 1.0)).xyz; vDetN = normalize(mat3(modelMatrix) * objectNormal);');
      const pick = detail === 'ground'
        ? `float gW = smoothstep(0.01, 0.10, c.g - max(c.r, c.b));
           float sW = (1.0 - gW) * smoothstep(0.30, 0.55, lum);
           vec4 wts = vec4(gW, 1.0 - gW - sW, 0.0, sW);`
        : `float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
           float rW = 1.0 - smoothstep(0.04, 0.14, sat);
           float sW = (1.0 - rW) * smoothstep(0.28, 0.5, lum);
           vec4 wts = vec4(0.0, 1.0 - rW - sW, rW, sW);
           k *= 1.0 - smoothstep(0.0, 0.08, c.b - c.r);   // ice keeps its own look`;
      fs = fs.replace('#include <color_fragment>', `#include <color_fragment>
        if (uDetail > 0.5) {
          vec3 c = diffuseColor.rgb;
          float lum = dot(c, vec3(0.3, 0.59, 0.11));
          float k = 0.75;
          ${pick}
          vec3 w = pow(abs(normalize(vDetN)), vec3(4.0)); w /= (w.x + w.y + w.z);
          vec3 d = vec3(0.0);
          if (wts.x > 0.01) d += wts.x * tri(uTexGrass, vDetP, w, 0.34) / uTexMean[0];
          if (wts.y > 0.01) d += wts.y * tri(uTexSoil, vDetP, w, 0.40) / uTexMean[1];
          if (wts.z > 0.01) d += wts.z * tri(uTexRock, vDetP, w, 0.33) / uTexMean[2];
          if (wts.w > 0.01) d += wts.w * tri(uTexSand, vDetP, w, 0.25) / uTexMean[3];
          float dl = dot(d, vec3(0.3, 0.59, 0.11));
          d = mix(vec3(dl), d, 0.45);                 // keep the pattern, tame the texture's own colours
          diffuseColor.rgb = c * mix(vec3(1.0), d, k);
        }`);
    }
    shader.vertexShader = vDecl.join('\n') + '\n' + vs;
    shader.fragmentShader = fDecl.join('\n') + '\n' + fs;
  };
  return m;
}

/** Adds a zero `glow` attribute to geometry that has none (so glow materials can share). */
export function ensureGlow(g: THREE.BufferGeometry): THREE.BufferGeometry {
  if (!g.getAttribute('glow')) {
    g.setAttribute('glow', new THREE.BufferAttribute(new Float32Array(g.getAttribute('position').count * 3), 3));
  }
  return g;
}

/** Fills the `color` attribute of a geometry with one colour (creating it if needed). */
export function paintGeometry(g: THREE.BufferGeometry, color: THREE.ColorRepresentation, glow?: THREE.ColorRepresentation) {
  const n = g.getAttribute('position').count;
  const c = new THREE.Color(color);
  const cols = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const gl = new Float32Array(n * 3);
  if (glow) {
    const gc = new THREE.Color(glow);
    for (let i = 0; i < n; i++) { gl[i * 3] = gc.r; gl[i * 3 + 1] = gc.g; gl[i * 3 + 2] = gc.b; }
  }
  g.setAttribute('glow', new THREE.BufferAttribute(gl, 3));
  return g;
}

const CUT_GLSL = /* glsl */ `
  uniform vec4 uBoxMin[${MAX_BOXES}];
  uniform vec3 uBoxMax[${MAX_BOXES}];
  uniform int uBoxCount;
  bool insideCut(vec3 p, bool water) {
    for (int i = 0; i < ${MAX_BOXES}; i++) {
      if (i >= uBoxCount) break;
      if (water && uBoxMin[i].w > 0.5) continue;
      float g = water ? 1.0 : 0.0; // water hides a little beyond the box so no slivers show in pits
      if (all(greaterThanEqual(p, uBoxMin[i].xyz - g)) && all(lessThan(p, uBoxMax[i] + g))) return true;
    }
    return false;
  }`;

/** Shadow-casting copy of the ground material that also skips dug-out regions. */
export function cutDepthMaterial(): THREE.MeshDepthMaterial {
  const m = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uBoxMin = shared.uBoxMin; shader.uniforms.uBoxMax = shared.uBoxMax; shader.uniforms.uBoxCount = shared.uBoxCount;
    shader.vertexShader = 'varying vec3 vCutP;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vCutP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = 'varying vec3 vCutP;\n' + CUT_GLSL + '\n' + shader.fragmentShader.replace('void main() {', 'void main() {\n if (insideCut(vCutP, false)) discard;');
  };
  return m;
}

/** Water is hidden inside dug regions unless that region holds a river. */
export function applyWaterCut(m: THREE.MeshStandardMaterial) {
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uBoxMin = shared.uBoxMin; shader.uniforms.uBoxMax = shared.uBoxMax; shader.uniforms.uBoxCount = shared.uBoxCount;
    shader.vertexShader = 'varying vec3 vCutP;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vCutP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = 'varying vec3 vCutP;\n' + CUT_GLSL + '\n' + shader.fragmentShader.replace('void main() {', 'void main() {\n if (insideCut(vCutP, true)) discard;');
  };
  m.customProgramCacheKey = () => 'water-cut';
}

/** Loads the painted ground textures and turns on terrain detail. */
export function loadGroundTextures(url: (name: string) => string) {
  if (!quality.detail) return;
  const names = ['jiva_grass', 'jiva_soil', 'jiva_rock', 'jiva_sandstone'] as const;
  const slots = [shared.uTexGrass, shared.uTexSoil, shared.uTexRock, shared.uTexSand];
  let left = names.length;
  names.forEach((n, i) => {
    new THREE.TextureLoader().load(url(n), (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      // Average colour (linear), so the texture adds pattern without shifting the terrain's palette.
      const img = t.image as HTMLImageElement;
      const cv = document.createElement('canvas'); cv.width = cv.height = 16;
      const cx = cv.getContext('2d');
      if (cx) {
        cx.drawImage(img, 0, 0, 16, 16);
        const px = cx.getImageData(0, 0, 16, 16).data;
        const m = [0, 0, 0];
        for (let j = 0; j < px.length; j += 4) for (let c = 0; c < 3; c++) m[c] += Math.pow(px[j + c] / 255, 2.2);
        shared.uTexMean.value[i].set(m[0] / 256, m[1] / 256, m[2] / 256);
      }
      slots[i].value = t;
      if (--left === 0) shared.uDetail.value = 1;
    });
  });
}
