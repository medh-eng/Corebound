// Turns owner uploads in art-inbox/ into game-ready files in public/assets/.
// Models: weld, simplify to the triangle budget, stand on the ground (y = 0),
// scale to real-world height, shrink textures to WebP, compress with meshopt.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, simplify, prune, textureCompress, meshopt, center, getBounds } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder } from 'meshoptimizer';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import { readFileSync, existsSync, mkdirSync, statSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('./assets.config.json', import.meta.url)));
const only = process.argv[2];

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'meshopt.encoder': MeshoptEncoder,
  });

function triangles(doc) {
  let t = 0;
  for (const mesh of doc.getRoot().listMeshes())
    for (const p of mesh.listPrimitives()) {
      const idx = p.getIndices();
      t += (idx ? idx.getCount() : p.getAttribute('POSITION').getCount()) / 3;
    }
  return Math.round(t);
}

mkdirSync('public/assets/models', { recursive: true });
await MeshoptSimplifier.ready;
await MeshoptEncoder.ready;

for (const [name, cfg] of Object.entries(config.models)) {
  if (only && only !== name) continue;
  const src = `art-inbox/models/${name}.glb`;
  if (!existsSync(src)) { console.log(`- ${name}: no file in art-inbox yet`); continue; }
  const doc = await io.read(src);
  const before = triangles(doc);

  await doc.transform(dedup(), weld({ tolerance: 0.0001 }));
  // Simplify in passes until under budget (AI meshes can be very dense).
  for (let pass = 0; pass < 4 && triangles(doc) > cfg.targetTriangles; pass++) {
    const ratio = Math.min(1, cfg.targetTriangles / triangles(doc));
    await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.002 * (pass + 1), lockBorder: false }));
  }

  // Stand the model on the ground and scale it to its real-world height.
  await doc.transform(center({ pivot: 'below' }));
  const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];
  const b = getBounds(scene);
  const h = b.max[1] - b.min[1];
  const s = cfg.height / h;
  for (const node of scene.listChildren()) {
    const sc = node.getScale();
    node.setScale([sc[0] * s, sc[1] * s, sc[2] * s]);
    const t = node.getTranslation();
    node.setTranslation([t[0] * s, t[1] * s, t[2] * s]);
  }

  await doc.transform(
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [cfg.textureSize, cfg.textureSize] }),
    prune(),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  );

  // Switch from Draco (if the tool used it) to meshopt compression.
  for (const ext of doc.getRoot().listExtensionsUsed())
    if (ext.extensionName === 'KHR_draco_mesh_compression') ext.dispose();

  const out = `public/assets/models/${name}.glb`;
  await io.write(out, doc);
  const kb = Math.round(statSync(out).size / 1024);
  console.log(`- ${name}: ${before.toLocaleString()} → ${triangles(doc).toLocaleString()} triangles, ${(h * s).toFixed(2)} m tall, ${kb} KB`);
}

// Images for menus and loading screens.
mkdirSync('public/assets/ui', { recursive: true });
for (const [name, cfg] of Object.entries(config.images ?? {})) {
  if (only && only !== name) continue;
  const src = `art-inbox/${cfg.src}`;
  if (!existsSync(src)) { console.log(`- ${name}: no file in art-inbox yet`); continue; }
  let img = sharp(src);
  if (cfg.crop) img = img.extract({ left: cfg.crop[0], top: cfg.crop[1], width: cfg.crop[2], height: cfg.crop[3] });
  if (cfg.trim) img = img.trim({ threshold: 28 });
  const out = `public/assets/ui/${name}.webp`;
  img = img.resize({ width: cfg.width, withoutEnlargement: true });
  if (cfg.alphaFromBlack) {
    // Logos made on black: turn darkness into transparency so they sit over the game.
    const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const out4 = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
      const m = Math.max(data[i], data[i + 1], data[i + 2]);
      const a = Math.min(1, Math.max(0, (m - 34) / 120));
      const k = a > 0 ? 1 / Math.max(a, 0.05) : 0;
      out4[j] = Math.min(255, data[i] * k); out4[j + 1] = Math.min(255, data[i + 1] * k); out4[j + 2] = Math.min(255, data[i + 2] * k);
      out4[j + 3] = Math.round(a * 255);
    }
    img = sharp(out4, { raw: { width: info.width, height: info.height, channels: 4 } });
  }
  await img.webp({ quality: 90, alphaQuality: 95 }).toFile(out);
  console.log(`- ${name}: ${Math.round(statSync(out).size / 1024)} KB`);
}
