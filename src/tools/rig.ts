// Dev tool: merges Mixamo FBX animations into one skinned GLB per character.
// Run through scripts/build-rig.mjs <character>. Root motion is removed so the game drives movement.
// Clip files are looked for as art-inbox/models/<character>/<File>.fbx, then
// art-inbox/models/<character>_<File>.fbx, then (Custodian only, older uploads) art-inbox/models/<File>.fbx.
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

declare global { interface Window { __rig?: { b64: string; clips: string[]; info: string }; __rigError?: string } }

/** [name in the game, Mixamo file name]. The first clip that loads also gives the mesh and skeleton. */
const CHARACTERS: Record<string, [string, string][]> = {
  custodian: [
    ['idle', 'Idle'], ['idle_stance', 'Idle (1)'], ['walk', 'Walking'], ['run', 'Running'], ['jump', 'Jump'],
    ['walk_back', 'Standing Walk Back'], ['turn_left', 'Left Turn'], ['turn_right', 'Right Turn'],
    ['dance', 'Hip Hop Dancing'], ['dance_silly', 'Silly Dancing'], ['salute', 'Salute'],
  ],
  huxley: [
    ['idle', 'Breathing Idle'], ['idle', 'Idle'], ['talk', 'Talking'], ['talk_2', 'Talking_2'],
    ['think', 'Thinking'], ['point', 'Pointing'],
  ],
};

async function loadFbx(loader: FBXLoader, character: string, file: string): Promise<THREE.Group | null> {
  const f = encodeURIComponent(file);
  const tries = [`/art-inbox/models/${character}/${f}.fbx`, `/art-inbox/models/${character}_${f}.fbx`];
  if (character === 'custodian') tries.push(`/art-inbox/models/${f}.fbx`);
  for (const url of tries) {
    const head = await fetch(url, { method: 'HEAD' });
    if (!head.ok || (head.headers.get('content-type') ?? '').includes('text/html')) continue;
    try { return await loader.loadAsync(url); } catch { /* try the next place */ }
  }
  return null;
}

async function main() {
  const character = new URLSearchParams(location.search).get('c') ?? 'custodian';
  const list = CHARACTERS[character];
  if (!list) throw new Error(`No clip list for "${character}" in src/tools/rig.ts`);
  const loader = new FBXLoader();
  let base: THREE.Group | null = null;
  const clips: THREE.AnimationClip[] = [];
  const missing: string[] = [];
  let hipShift: number | null = null;
  for (const [name, file] of list) {
    if (clips.some((c) => c.name === name)) continue; // an earlier file already gave this clip
    const obj = await loadFbx(loader, character, file);
    if (!obj) { missing.push(file); continue; }
    base ??= obj;
    const clip = obj.animations[0];
    if (!clip) continue;
    clip.name = name;
    // Keep the hips' up-down bob but remove forward/sideways travel. Mixamo's motion stands on the
    // ground, but a model that was uploaded centred has its hips near 0 in the bind pose: shift every
    // clip by the same amount (taken from the first clip) so the body stays where the mesh was bound.
    for (const t of clip.tracks) {
      if (/Hips\.position$/.test(t.name)) {
        const v = t.values;
        const x0 = v[0], z0 = v[2];
        if (hipShift === null) {
          let bindY = v[1];
          base.traverse((o) => { if ((o as THREE.Bone).isBone && /Hips$/.test(o.name)) bindY = o.position.y; });
          hipShift = v[1] - bindY;
        }
        for (let i = 0; i < v.length; i += 3) { v[i] = x0; v[i + 1] -= hipShift; v[i + 2] = z0; }
      }
    }
    clips.push(clip);
  }
  if (!base) throw new Error(`No FBX files found for ${character}`);
  let info = '';
  base.traverse((o) => {
    const m = o as THREE.SkinnedMesh;
    if (m.isSkinnedMesh) info += `${m.name}: ${m.geometry.attributes.position.count} verts, ${m.skeleton.bones.length} bones; `;
  });
  if (missing.length) info += `not found: ${missing.join(', ')}; `;
  info += `hips shifted by ${(hipShift ?? 0).toFixed(3)}`;
  const exporter = new GLTFExporter();
  const glb = (await exporter.parseAsync(base, { binary: true, animations: clips, onlyVisible: true })) as ArrayBuffer;
  let s = '';
  const bytes = new Uint8Array(glb);
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  window.__rig = { b64: btoa(s), clips: clips.map((c) => `${c.name} ${c.duration.toFixed(2)}s`), info };
}
main().catch((e) => { window.__rigError = String(e?.stack ?? e); });
