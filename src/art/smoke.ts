// Soft smoke puffs rising from a chimney (the first sign of industry on a clean world).
import * as THREE from 'three';
import { shared } from './materials';

export function chimneySmoke(count = 28): THREE.Points {
  const g = new THREE.BufferGeometry();
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) seed[i] = i / count;
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
  const m = new THREE.ShaderMaterial({
    uniforms: { uTime: shared.uTime, uNight: shared.uNight, uPx: { value: 1 }, uRise: { value: 9 } },
    vertexShader: /* glsl */ `
      attribute float seed; uniform float uTime, uPx, uRise; varying float vA; varying float vLife;
      void main() {
        float life = fract(uTime * 0.07 + seed);
        vLife = life;
        vec3 p = vec3(sin(seed * 40.0 + uTime * 0.3) * life * 1.4 + life * life * 2.5, life * uRise, cos(seed * 23.0) * life * 1.2);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (40.0 + life * 220.0) * uPx / -mv.z;
        vA = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.55, 1.0, life));
      }`,
    fragmentShader: /* glsl */ `
      uniform float uNight; varying float vA; varying float vLife;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.1, d) * vA * 0.45;
        vec3 c = mix(vec3(0.85, 0.83, 0.8), vec3(0.25, 0.24, 0.3), uNight);
        gl_FragColor = vec4(c, a);
      }`,
    transparent: true, depthWrite: false,
  });
  const pts = new THREE.Points(g, m);
  pts.frustumCulled = false;
  pts.name = 'smoke';
  return pts;
}

/** A copper chimney stack with a jaali vent. */
export function chimney(): THREE.Group {
  const grp = new THREE.Group();
  const copper = new THREE.MeshStandardMaterial({ color: '#c8794a', metalness: 0.85, roughness: 0.32 });
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 1.5, 16), copper);
  pipe.position.y = 0.75;
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.22, 0.32, 16), copper);
  collar.position.y = 1.55;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.12, 16), copper);
  cap.position.y = 1.76;
  for (const m of [pipe, collar, cap]) { m.castShadow = true; grp.add(m); }
  return grp;
}
