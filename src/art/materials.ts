// Shared stylised materials. Every glowing thing reads a per-vertex "glow" colour
// that brightens at night; plants can sway in the wind.
import * as THREE from 'three';

export const shared = {
  uTime: { value: 0 },
  uNight: { value: 0 },        // 0 day .. 1 night, at the player's location
  uWind: { value: 1 },
};

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
}

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
  m.customProgramCacheKey = () => `stylised-${o.glow ? 1 : 0}-${sway > 0 ? 1 : 0}-${mottle > 0 ? 1 : 0}-${id}`;
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
