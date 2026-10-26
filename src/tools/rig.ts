// Dev tool: merges Mixamo FBX animations (in art-inbox/models) into one skinned GLB.
// Run through scripts/build-rig.mjs. Root motion is removed so the game drives movement.
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

declare global { interface Window { __rig?: { b64: string; clips: string[]; info: string } ; __rigError?: string } }

const CLIPS: [string, string][] = [
  ['idle', 'Idle'], ['idle_stance', 'Idle (1)'], ['walk', 'Walking'], ['run', 'Running'], ['jump', 'Jump'],
  ['walk_back', 'Standing Walk Back'], ['turn_left', 'Left Turn'], ['turn_right', 'Right Turn'],
  ['dance', 'Hip Hop Dancing'], ['dance_silly', 'Silly Dancing'], ['salute', 'Salute'],
];

async function main() {
  const loader = new FBXLoader();
  const base = await loader.loadAsync('/art-inbox/models/Idle.fbx');
  const clips: THREE.AnimationClip[] = [];
  for (const [name, file] of CLIPS) {
    let obj: THREE.Group;
    try { obj = await loader.loadAsync(`/art-inbox/models/${encodeURIComponent(file)}.fbx`); } catch { continue; }
    const clip = obj.animations[0];
    if (!clip) continue;
    clip.name = name;
    // Keep the hips' up-down bob but remove forward/sideways travel (except for the jump's height).
    for (const t of clip.tracks) {
      if (/Hips\.position$/.test(t.name)) {
        const v = t.values;
        const x0 = v[0], z0 = v[2];
        for (let i = 0; i < v.length; i += 3) { v[i] = x0; v[i + 2] = z0; }
      }
    }
    clips.push(clip);
  }
  let info = '';
  base.traverse((o) => {
    const m = o as THREE.SkinnedMesh;
    if (m.isSkinnedMesh) info += `${m.name}: ${m.geometry.attributes.position.count} verts, ${m.skeleton.bones.length} bones; `;
  });
  const exporter = new GLTFExporter();
  const glb = (await exporter.parseAsync(base, { binary: true, animations: clips, onlyVisible: true })) as ArrayBuffer;
  let s = '';
  const bytes = new Uint8Array(glb);
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  window.__rig = { b64: btoa(s), clips: clips.map((c) => `${c.name} ${c.duration.toFixed(2)}s`), info };
}
main().catch((e) => { window.__rigError = String(e?.stack ?? e); });
