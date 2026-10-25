// Gives plain white models the game's own materials by reading their shape.
// Each painter is a small per-pixel shader program over the model's own coordinates,
// so colour edges are crisp no matter how the AI tool triangulated the mesh.
import * as THREE from 'three';
import { shared } from './materials';

/** Materials whose glow follows the time of day (for models that bring their own materials). */
export const animatedGlow: { mat: THREE.MeshStandardMaterial; day: number; night: number }[] = [];

const GLSL_PALETTE = /* glsl */ `
  const vec3 CERAMIC = vec3(0.87, 0.82, 0.72);
  const vec3 CERAMIC_WARM = vec3(0.75, 0.62, 0.44);
  const vec3 COPPER = vec3(0.62, 0.25, 0.10);
  const vec3 BRONZE = vec3(0.20, 0.09, 0.04);
  const vec3 AMBER = vec3(1.0, 0.42, 0.08);
  struct Paint { vec3 col; float met; float rough; vec3 emi; };
  Paint ceramic()  { return Paint(CERAMIC, 0.0, 0.5, vec3(0.0)); }
  Paint warm()     { return Paint(CERAMIC_WARM, 0.0, 0.6, vec3(0.0)); }
  Paint copper()   { return Paint(COPPER, 0.9, 0.3, vec3(0.0)); }
  Paint bronze()   { return Paint(BRONZE, 0.75, 0.42, vec3(0.0)); }
  Paint glow(float k) { return Paint(AMBER, 0.0, 0.4, AMBER * k); }
`;

interface Painter { program: string } // GLSL body: given vec3 p (model space, metres) return Paint

const PAINTERS: Record<string, Painter> = {
  // shelter_dome: plinth (0–0.5 m), stepped wall (0.5–1.3), jaali band (1.3–2.1), trim ring, dome, round door at +z.
  shelter_dome: {
    program: /* glsl */ `
      float r = length(p.xz);
      float y = p.y;
      float dd = length(vec2(p.x, y - 1.48));
      if (p.z > 1.9 && dd < 1.02 && y > 0.45) {
        if (dd > 0.82) return copper();
        if (dd < 0.19) return glow(1.3);
        if (abs(dd - 0.54) < 0.04) return copper();
        // Little jaali window in the door.
        if (dd < 0.48 && dd > 0.24) {
          vec2 q = vec2(p.x, y) * 9.0;
          vec2 a = abs(fract(vec2(q.x + q.y, q.x - q.y) * 0.5) - 0.5);
          if (min(a.x, a.y) < 0.12) return copper();
          return glow(0.9);
        }
        return warm();
      }
      if (y < 0.42) return bronze();
      if (y < 0.56) return copper();
      if (y < 1.0) { if (r > 2.72) return warm(); return ceramic(); }
      if (y < 1.32) { if (y > 1.25) return copper(); return ceramic(); }
      if (y < 2.08) {
        if (y < 1.37 || y > 2.03) return bronze();
        float u = atan(p.x, p.z) * 2.55;
        vec2 q = vec2(u, y) * 5.2;
        vec2 a = abs(fract(vec2(q.x + q.y, q.x - q.y) * 0.5) - 0.5);
        float line = min(a.x, a.y);
        if (line < 0.09) return bronze();
        return glow(1.0);
      }
      if (y < 2.33) return copper();
      if (y > 3.66) return copper();
      return ceramic();`,
  },
};

export function hasPainter(name: string) { return name in PAINTERS; }

/** Replaces the model's materials with its painter's shader-driven material. */
export function paintModel(name: string, model: THREE.Object3D): void {
  const painter = PAINTERS[name];
  if (!painter) return;
  model.updateMatrixWorld(true);
  const rootInv = new THREE.Matrix4().copy(model.matrixWorld).invert();
  model.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const toRoot = new THREE.Matrix4().multiplyMatrices(rootInv, mesh.matrixWorld);
    const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5, metalness: 0, envMapIntensity: 0.45 });
    mat.customProgramCacheKey = () => `paint-${name}`;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uToRoot = { value: toRoot };
      shader.uniforms.uNight = shared.uNight;
      shader.vertexShader = 'uniform mat4 uToRoot;\nvarying vec3 vObj;\n' +
        shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vObj = (uToRoot * vec4(position, 1.0)).xyz;');
      shader.fragmentShader = 'uniform float uNight;\nvarying vec3 vObj;\n' + GLSL_PALETTE +
        `Paint paintAt(vec3 p) {\n${painter.program}\n}\n` +
        shader.fragmentShader
          .replace('#include <color_fragment>', '#include <color_fragment>\n Paint pp = paintAt(vObj);\n diffuseColor.rgb = pp.col;')
          .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n metalnessFactor = pp.met;')
          .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = pp.rough;')
          .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += pp.emi * mix(0.55, 2.6, uNight);');
    };
    mesh.material = mat;
  });
}
