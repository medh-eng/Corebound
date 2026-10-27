// Sky dome, stars, aurora, the ringed planet, and the glowing atmosphere seen from orbit.
import * as THREE from 'three';
import type { WorldDef } from '../data/worlds';
import { shared } from './materials';
import { rng, randomDir } from '../core/random';

const lin = (s: string) => new THREE.Color(s);

export interface Sky {
  group: THREE.Group;            // follows the camera
  ringed: THREE.Group;           // fixed in the world
  atmosphere: THREE.Mesh;        // fixed around the planet
  uniforms: {
    uSun: { value: THREE.Vector3 };
    uUp: { value: THREE.Vector3 };
    uSpace: { value: number };
    uNight: { value: number };
  };
  update(camera: THREE.Camera): void;
  /** 0 clean .. 1 heavy haze. */
  setHaze(v: number): void;
  /** A sky-only copy (no stars) used to light metals and water. */
  envScene: THREE.Scene;
  /** Use a painted 360° night sky (equirectangular). Its painted gas giant at (u, v) is turned
   *  to face `planetDir` and replaces the code-made ringed planet at night. */
  setPanorama(tex: THREE.Texture, planetUV: [number, number], planetDir: THREE.Vector3): void;
}

export function buildSky(world: WorldDef): Sky {
  const P = world.palette;
  const uniforms = {
    uSun: { value: new THREE.Vector3(1, 0, 0) },
    uUp: { value: new THREE.Vector3(0, 1, 0) },
    uSpace: { value: 0 },
    uNight: { value: 0 },
  };
  const skyUniforms = {
    ...uniforms,
    uTime: shared.uTime,
    dayZ: { value: lin(P.skyDayZenith) }, dayH: { value: lin(P.skyDayHorizon) },
    setZ: { value: lin(P.skySunsetZenith) }, setH: { value: lin(P.skySunsetHorizon) },
    nightZ: { value: lin(P.skyNightZenith) }, nightH: { value: lin(P.skyNightHorizon) },
    spaceC: { value: lin(P.space) }, auroraC: { value: lin(P.aurora) },
    uPano: { value: null as THREE.Texture | null }, uPanoOn: { value: 0 }, uPanoRot: { value: new THREE.Matrix3() },
    uHaze: { value: 0 },   // dirty air: a dull yellow-grey veil (Harmony)
  };
  const hide = { value: 0 };   // 1 = the painted sky's planet has taken over

  const skyVert = /* glsl */ `
    varying vec3 vDir;
    void main() {
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vDir = wp.xyz - cameraPosition;
      gl_Position = projectionMatrix * viewMatrix * wp;
      gl_Position.z = gl_Position.w * 0.99999;
    }`;
  const skyFrag = (withAurora: boolean) => /* glsl */ `
    uniform vec3 uSun, uUp, dayZ, dayH, setZ, setH, nightZ, nightH, spaceC, auroraC;
    uniform float uSpace, uNight, uTime, uPanoOn, uHaze;
    uniform sampler2D uPano; uniform mat3 uPanoRot;
    varying vec3 vDir;
    void main() {
      vec3 d = normalize(vDir);
      float h = dot(d, uUp);
      float se = dot(uSun, uUp);
      float day = smoothstep(-0.14, 0.32, se);
      float sunset = 1.0 - smoothstep(0.0, 0.32, abs(se - 0.03));
      float sd = max(dot(d, uSun), 0.0);
      vec3 zen = mix(nightZ, dayZ, day);
      zen = mix(zen, setZ, sunset * 0.65);
      vec3 hor = mix(nightH, dayH, day);
      hor = mix(hor, setH, sunset * (0.35 + 0.65 * pow(sd, 1.5)));
      float t = pow(clamp(h, 0.0, 1.0), 0.36);
      vec3 col = mix(hor, zen, t);
      col += setH * pow(sd, 10.0) * (0.15 + sunset * 0.9) * day;
      col += vec3(1.0, 0.85, 0.6) * pow(sd, 300.0) * 2.0;
      col += vec3(1.0, 0.95, 0.85) * smoothstep(0.99945, 0.99965, sd) * 14.0;
      if (h < 0.0) col = mix(hor, hor * 0.55, clamp(-h * 2.5, 0.0, 1.0));
      ${withAurora ? `
      vec3 north = vec3(0.0, 1.0, 0.0) - uUp * uUp.y;
      if (dot(north, north) > 1e-4) {
        north = normalize(north);
        vec3 hz = d - uUp * h;
        if (dot(hz, hz) > 1e-5) {
          hz = normalize(hz);
          float az = dot(hz, north);
          float side = dot(hz, cross(uUp, north));
          float band = smoothstep(0.1, 0.85, az) * smoothstep(0.05, 0.16, h) * (1.0 - smoothstep(0.32, 0.62, h));
          float curtain = 0.55 + 0.45 * sin(side * 22.0 + uTime * 0.35 + 3.0 * sin(h * 14.0 + uTime * 0.6 + side * 5.0));
          float rays = 0.6 + 0.4 * sin(side * 70.0 + uTime * 0.9);
          col += auroraC * band * curtain * rays * uNight * (1.0 - uSpace) * 0.85;
          col += vec3(0.6, 0.3, 1.0) * band * smoothstep(0.25, 0.5, h) * uNight * 0.25 * (1.0 - uSpace);
        }
      }` : ''}
      {
        float lum = dot(col, vec3(0.3, 0.59, 0.11));
        col = mix(col, vec3(lum) * vec3(1.06, 0.98, 0.8) + vec3(0.03, 0.025, 0.0), uHaze * 0.65 * (1.0 - uSpace));
      }
      col = mix(col, spaceC + vec3(1.0, 0.9, 0.7) * smoothstep(0.9993, 0.9997, sd) * 14.0, uSpace);
      ${withAurora ? `
      if (uPanoOn > 0.5) {
        vec3 q = uPanoRot * d;
        vec2 uv = vec2(atan(q.z, q.x) / 6.2831853 + 0.5, 1.0 - acos(clamp(q.y, -1.0, 1.0)) / 3.1415927);
        float vis = max(uNight * smoothstep(-0.03, 0.14, h), uSpace);
        vis *= 1.0 - smoothstep(0.72, 0.93, abs(q.y));   // equirect pictures smear at the poles
        col += texture2D(uPano, uv).rgb * vis * 0.95;
      }` : 'col = mix(col, vec3(dot(col, vec3(0.3333))) * vec3(1.08, 1.0, 0.86), 0.6);'}
      gl_FragColor = vec4(col, 1.0);
    }`;

  const skyMat = new THREE.ShaderMaterial({
    uniforms: skyUniforms, vertexShader: skyVert, fragmentShader: skyFrag(true),
    side: THREE.BackSide, depthWrite: false,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(4000, 48, 24), skyMat);
  dome.frustumCulled = false;
  dome.renderOrder = -10;

  // Stars: visible at night and always from space.
  const r = rng(world.seed + 99);
  const N = 2600;
  const sp = new Float32Array(N * 3), ss = new Float32Array(N), sc = new Float32Array(N * 3);
  const starTints = [new THREE.Color('#ffffff'), new THREE.Color('#c9d6ff'), new THREE.Color('#ffe2c4'), new THREE.Color('#e3c8ff')];
  for (let i = 0; i < N; i++) {
    const d = randomDir(r);
    sp[i * 3] = d.x * 3800; sp[i * 3 + 1] = d.y * 3800; sp[i * 3 + 2] = d.z * 3800;
    ss[i] = Math.pow(r(), 4) * 4 + 0.9;
    const c = starTints[Math.floor(r() * starTints.length)];
    sc[i * 3] = c.r; sc[i * 3 + 1] = c.g; sc[i * 3 + 2] = c.b;
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sg.setAttribute('size', new THREE.BufferAttribute(ss, 1));
  sg.setAttribute('tint', new THREE.BufferAttribute(sc, 3));
  const starMat = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uTime: shared.uTime, uPx: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float size; attribute vec3 tint;
      uniform float uTime, uPx; uniform vec3 uUp, uSun; uniform float uSpace, uNight;
      varying vec3 vTint; varying float vA;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vec3 d = normalize(wp.xyz - cameraPosition);
        float h = dot(d, uUp);
        float vis = max(uNight * smoothstep(-0.02, 0.12, h), uSpace);
        vA = vis * (0.75 + 0.25 * sin(uTime * (1.5 + size) + position.x));
        vTint = tint;
        gl_Position = projectionMatrix * viewMatrix * wp;
        gl_Position.z = gl_Position.w * 0.99998;
        gl_PointSize = size * uPx;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vTint; varying float vA;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float a = smoothstep(0.5, 0.0, length(c));
        gl_FragColor = vec4(vTint * 2.2, a * vA);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const stars = new THREE.Points(sg, starMat);
  stars.frustumCulled = false;
  stars.renderOrder = -9;

  const group = new THREE.Group();
  group.add(dome, stars);

  // The ringed planet: a violet gas giant that hangs in Jivagraha's sky.
  const ringed = new THREE.Group();
  const gasMat = new THREE.ShaderMaterial({
    uniforms: { uSun: uniforms.uSun, uTime: shared.uTime, uHide: hide },
    transparent: true,
    vertexShader: /* glsl */ `
      varying vec3 vP; varying vec3 vN;
      void main() { vP = position; vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun; uniform float uHide; varying vec3 vP; varying vec3 vN;
      void main() {
        if (uHide > 0.999) discard;
        float lat = normalize(vP).y;
        float b = sin(lat * 26.0 + sin(lat * 7.0 + vP.x * 0.004) * 1.6) * 0.5 + 0.5;
        float b2 = sin(lat * 61.0 + vP.z * 0.003) * 0.5 + 0.5;
        vec3 c1 = vec3(0.30, 0.20, 0.62), c2 = vec3(0.55, 0.42, 0.85), c3 = vec3(0.78, 0.66, 0.95);
        vec3 col = mix(c1, c2, b); col = mix(col, c3, b2 * 0.35);
        float l = dot(normalize(vN), uSun);
        float lit = smoothstep(-0.25, 0.6, l);
        vec3 shade = col * (0.22 + 1.6 * lit) + vec3(1.0, 0.6, 0.4) * pow(1.0 - abs(l), 8.0) * 0.08;
        gl_FragColor = vec4(shade, 1.0 - uHide);
      }`,
  });
  const giant = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), gasMat);
  const ringMat = new THREE.ShaderMaterial({
    uniforms: { uSun: uniforms.uSun, uHide: hide },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vP;
      void main() { vUv = uv; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      varying vec3 vP; uniform float uHide;
      void main() {
        float r = length(vP.xy);
        float t = (r - 1.45) / (2.35 - 1.45);
        float bands = 0.55 + 0.45 * sin(t * 62.0) * sin(t * 17.0 + 1.0);
        float a = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.9, 1.0, t)) * bands * 0.75;
        if (t > 0.55 && t < 0.6) a *= 0.15;
        gl_FragColor = vec4(vec3(0.82, 0.74, 1.0) * 1.6, min(1.0, a * 1.3) * (1.0 - uHide));
      }`,
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
  });
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.45, 2.35, 160, 1), ringMat);
  ring.rotation.x = -Math.PI / 2 + 0.38;
  ring.rotation.y = 0.25;
  ringed.add(giant, ring);
  ringed.scale.setScalar(world.ringedPlanet.radius);

  // Atmosphere glow seen from orbit: brighter where the closest point of the view ray skims the planet.
  const R = world.radius;
  const atmMat = new THREE.ShaderMaterial({
    uniforms: { uSun: uniforms.uSun, uR: { value: R }, uAlt: { value: 0 }, atmC: { value: lin(P.atmosphere) }, setC: { value: lin(P.skySunsetHorizon) } },
    vertexShader: /* glsl */ `
      varying vec3 vW;
      void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun, atmC, setC; uniform float uR, uAlt; varying vec3 vW;
      void main() {
        vec3 D = normalize(vW - cameraPosition);
        float tc = -dot(cameraPosition, D);
        vec3 cl = cameraPosition + D * tc;
        float b = length(cl);
        float g = b > uR ? exp(-(b - uR) / (0.045 * uR)) : 0.55 + 0.45 * pow(b / uR, 6.0);
        float l = dot(normalize(cl), uSun);
        float lit = smoothstep(-0.35, 0.35, l);
        vec3 col = mix(setC, atmC, smoothstep(-0.1, 0.4, l)) * lit;
        gl_FragColor = vec4(col * g * 1.3 * uAlt, 1.0);
      }`,
    side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(R * 1.28, 96, 48), atmMat);
  atmosphere.renderOrder = 5;

  // Environment copy of the sky (no stars, no aurora) for reflections on metal and water.
  const envScene = new THREE.Scene();
  const envDome = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 16), new THREE.ShaderMaterial({
    uniforms: skyUniforms, vertexShader: skyVert, fragmentShader: skyFrag(false), side: THREE.BackSide, depthWrite: false,
  }));
  envScene.add(envDome);
  const groundHemi = new THREE.Mesh(
    new THREE.SphereGeometry(90, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(P.grassLow).multiplyScalar(0.35), side: THREE.BackSide }),
  );
  envScene.add(groundHemi);

  return {
    group, ringed, atmosphere, uniforms, envScene,
    setHaze(v) { skyUniforms.uHaze.value = v; },
    setPanorama(tex, [u, v], planetDir) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.RepeatWrapping;
      const phi = (u - 0.5) * Math.PI * 2, th = v * Math.PI;
      const p0 = new THREE.Vector3(Math.sin(th) * Math.cos(phi), Math.cos(th), Math.sin(th) * Math.sin(phi));
      // Rotation taking world directions into the picture's directions: planetDir -> p0.
      const q = new THREE.Quaternion().setFromUnitVectors(planetDir.clone().normalize(), p0);
      skyUniforms.uPanoRot.value.setFromMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(q));
      skyUniforms.uPano.value = tex;
      skyUniforms.uPanoOn.value = 1;
    },
    update(camera: THREE.Camera) {
      if (skyUniforms.uPanoOn.value > 0.5) hide.value = THREE.MathUtils.smoothstep(Math.max(uniforms.uNight.value, uniforms.uSpace.value), 0.45, 0.8);
      group.position.copy(camera.position);
      const alt = camera.position.length() - R;
      atmMat.uniforms.uAlt.value = THREE.MathUtils.smoothstep(alt, R * 0.25, R * 0.9);
      // Point the environment's "ground" half away from the local up.
      groundHemi.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), uniforms.uUp.value);
    },
  };
}
