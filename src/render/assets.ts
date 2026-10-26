import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

/** Loads a processed model from public/assets/models. Missing normals are computed. */
export async function loadModel(name: string): Promise<THREE.Group> {
  const gltf = await loader.loadAsync(assetUrl(`models/${name}.glb`));
  gltf.scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (!mesh.geometry.getAttribute('normal')) mesh.geometry.computeVertexNormals();
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
  return gltf.scene;
}

/** Loads a processed model with its animations. */
export async function loadAnimated(name: string): Promise<{ scene: THREE.Group; clips: THREE.AnimationClip[] }> {
  const gltf = await loader.loadAsync(assetUrl(`models/${name}.glb`));
  gltf.scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false; // skinned meshes move outside their bind-pose bounds
  });
  return { scene: gltf.scene, clips: gltf.animations };
}
