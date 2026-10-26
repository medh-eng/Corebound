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
const only = process.argv.length > 2 ? new Set(process.argv.slice(2)) : null;

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
  if (only && !only.has(name)) continue;
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
  if (only && !only.has(name)) continue;
  const src = `art-inbox/${cfg.src}`;
  if (!existsSync(src)) { console.log(`- ${name}: no file in art-inbox yet`); continue; }
  let img = sharp(src);
  if (cfg.crop) img = img.extract({ left: cfg.crop[0], top: cfg.crop[1], width: cfg.crop[2], height: cfg.crop[3] });
  if (cfg.trim) img = img.trim({ threshold: 28 });
  const dir = `public/assets/${cfg.dir ?? 'ui'}`;
  mkdirSync(dir, { recursive: true });
  const out = `${dir}/${name}.webp`;
  if (cfg.unmark || cfg.pano) {
    const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let buf = data, w = info.width, h = info.height;
    if (cfg.unmark) unmark(buf, w, h);
    if (cfg.pano) ({ buf, w, h } = panorama(buf, w, h));
    img = sharp(buf, { raw: { width: w, height: h, channels: 3 } });
  }
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

/** Paints out the small sparkle watermark AI image tools put in the bottom-right corner,
 *  by copying nearby picture over it through a soft round mask. */
function unmark(buf, w, h) {
  // The mark is a see-through four-point star, ~96 px wide, centred ~112 px in from the corner.
  const cx = w - 112, cy = h - 112, r = 60;
  const dx = -Math.round(r * 2.8), dy = -Math.round(r * 2.8);
  for (let y = Math.floor(cy - r * 1.6); y <= cy + r * 1.6; y++) for (let x = Math.floor(cx - r * 1.6); x <= cx + r * 1.6; x++) {
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const d = Math.hypot(x - cx, y - cy) / r;
    const a = d < 1 ? 1 : d < 1.6 ? 1 - (d - 1) / 0.6 : 0;
    if (a <= 0) continue;
    const i = (y * w + x) * 3, j = (((y + dy + h) % h) * w + ((x + dx + w) % w)) * 3;
    for (let c = 0; c < 3; c++) buf[i + c] = Math.round(buf[i + c] * (1 - a) + buf[j + c] * a);
  }
}

/** Makes a sky picture usable all the way round: crops to 2:1 and blends the left and right
 *  edges into each other so there is no seam behind you. */
function panorama(buf, w, h) {
  let H = Math.round(w / 2), top = Math.max(0, Math.floor((h - H) / 2));
  if (H > h) H = h;
  const out = Buffer.alloc(w * H * 3);
  for (let y = 0; y < H; y++) buf.copy(out, y * w * 3, ((y + top) * w) * 3, ((y + top) * w + w) * 3);
  const N = Math.floor(w * 0.1);
  for (let y = 0; y < H; y++) for (let k = 0; k < N; k++) {
    const t = 0.5 * (1 - k / N); const a = (y * w + k) * 3, b = (y * w + (w - 1 - k)) * 3;
    for (let c = 0; c < 3; c++) {
      const va = out[a + c], vb = out[b + c];
      out[a + c] = Math.round(va * (1 - t) + vb * t);
      out[b + c] = Math.round(vb * (1 - t) + va * t);
    }
  }
  console.log(`  panorama ${w}×${H} (cropped ${top}px top and bottom, edges blended)`);
  return { buf: out, w, h: H };
}
