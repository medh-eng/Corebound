// Model viewer: /viewer.html?m=shelter_dome — four views of one processed model.
import * as THREE from 'three';
import { loadModel } from '../render/assets';
import { paintModel } from '../art/paint';

declare global { interface Window { __ready?: boolean } }

const params = new URLSearchParams(location.search);
const name = params.get('m') ?? 'custodian';
const paint = params.get('paint') !== '0';

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setScissorTest(true);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#2a2738');
scene.add(new THREE.HemisphereLight('#fff4e0', '#3a3550', 1.4));
const sun = new THREE.DirectionalLight('#ffe7c2', 2.4);
sun.position.set(3, 5, 4);
scene.add(sun);

const model = await loadModel(name);
if (paint) paintModel(name, model);
scene.add(model);
const box = new THREE.Box3().setFromObject(model);
const size = box.getSize(new THREE.Vector3());
const mid = box.getCenter(new THREE.Vector3());
let tris = 0;
model.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) tris += (m.geometry.index?.count ?? m.geometry.attributes.position.count) / 3; });
document.getElementById('label')!.textContent =
  `${name} — ${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)} m, ${Math.round(tris).toLocaleString()} triangles`;

const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
const dist = Math.max(size.x, size.y, size.z) * 2.6;
const views = [0, Math.PI / 2, Math.PI, Math.PI / 4];
const w = innerWidth / 2, h = innerHeight / 2;
cam.aspect = w / h; cam.updateProjectionMatrix();
views.forEach((a, i) => {
  const x = (i % 2) * w, y = (1 - Math.floor(i / 2)) * h;
  renderer.setViewport(x, y, w, h); renderer.setScissor(x, y, w, h);
  cam.position.set(mid.x + Math.sin(a) * dist, mid.y + size.y * 0.35, mid.z + Math.cos(a) * dist);
  cam.lookAt(mid);
  renderer.render(scene, cam);
});
window.__ready = true;
