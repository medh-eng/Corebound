// Turns owner uploads in art-inbox/ into game-ready files in public/assets/.
// Models: weld, simplify to the triangle budget, stand on the ground (y = 0),
// scale to real-world height, shrink textures to WebP, compress with meshopt.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, simplify, prune, textureCompress, meshopt, center, getBounds, compactPrimitive } from '@gltf-transform/functions';
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
  const src = `art-inbox/models/${cfg.src ?? `${name}.glb`}`;
  if (!existsSync(src)) { console.log(`- ${name}: no file in art-inbox yet`); continue; }
  const doc = await io.read(src);
  const before = triangles(doc);

  if (cfg.cutAbove) cutAbove(doc, cfg.cutAbove);
  await doc.transform(dedup(), weld({ tolerance: 0.0001 }));
  // Simplify in passes until under budget (AI meshes can be very dense).
  for (let pass = 0; pass < 4 && triangles(doc) > cfg.targetTriangles; pass++) {
    const ratio = Math.min(1, cfg.targetTriangles / triangles(doc));
    await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.002 * (pass + 1), lockBorder: false }));
  }

  // Stand the model on the ground and scale it to its real-world height.
  // Skinned characters are measured through their skeleton (the mesh node's own bounds can be
  // in a different space), then moved so the feet stand on y = 0, centred.
  const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];
  const sb = skinnedBounds(doc);
  if (sb) {
    const off = [-(sb.min[0] + sb.max[0]) / 2, -sb.min[1], -(sb.min[2] + sb.max[2]) / 2];
    for (const node of scene.listChildren()) { const t = node.getTranslation(); node.setTranslation([t[0] + off[0], t[1] + off[1], t[2] + off[2]]); }
  } else await doc.transform(center({ pivot: 'below' }));
  const b = sb ?? getBounds(scene);
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

/** Bounds of every skinned mesh in its bind pose: Σ weight · jointWorld · inverseBind · vertex. */
function skinnedBounds(doc) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  let any = false;
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(), skin = node.getSkin();
    if (!mesh || !skin || !skin.getInverseBindMatrices()) continue;
    const ibm = skin.getInverseBindMatrices().getArray();
    const mats = skin.listJoints().map((j, i) => mul(j.getWorldMatrix(), Array.from(ibm.subarray(i * 16, i * 16 + 16))));
    for (const prim of mesh.listPrimitives()) {
      const P = prim.getAttribute('POSITION'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0');
      if (!J || !W) continue;
      const p = [0, 0, 0], j = [0, 0, 0, 0], w = [0, 0, 0, 0];
      const step = Math.max(1, Math.floor(P.getCount() / 20000));
      for (let i = 0; i < P.getCount(); i += step) {
        P.getElement(i, p); J.getElement(i, j); W.getElement(i, w);
        const o = [0, 0, 0];
        for (let k = 0; k < 4; k++) {
          if (!w[k]) continue; const m = mats[j[k]];
          for (let r = 0; r < 3; r++) o[r] += w[k] * (m[r] * p[0] + m[4 + r] * p[1] + m[8 + r] * p[2] + m[12 + r]);
        }
        for (let r = 0; r < 3; r++) { min[r] = Math.min(min[r], o[r]); max[r] = Math.max(max[r], o[r]); }
        any = true;
      }
    }
  }
  return any ? { min, max } : null;
}

/** 4×4 matrices, column-major (glTF order). */
function mul(a, b) {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
}
function invert(m) {
  // Gauss-Jordan on a row-major copy.
  const A = [0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => m[c * 4 + r]).concat([0, 1, 2, 3].map((c) => (c === r ? 1 : 0))));
  for (let i = 0; i < 4; i++) {
    let p = i; for (let r = i + 1; r < 4; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    [A[i], A[p]] = [A[p], A[i]];
    const d = A[i][i]; for (let c = 0; c < 8; c++) A[i][c] /= d;
    for (let r = 0; r < 4; r++) if (r !== i) { const f = A[r][i]; for (let c = 0; c < 8; c++) A[r][c] -= f * A[i][c]; }
  }
  const o = new Array(16);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) o[c * 4 + r] = A[r][c + 4];
  return o;
}

/** Removes every triangle above a fraction of the model's height (0–1), e.g. a stray floating part
 *  the 3D tool made from a hologram in the concept image. */
function cutAbove(doc, frac) {
  const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];
  const b = getBounds(scene);
  const limit = b.min[1] + (b.max[1] - b.min[1]) * frac;
  let removed = 0;
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      const idx = prim.getIndices();
      if (!idx) continue;
      const a = idx.getArray(), keep = [];
      const wy = (i) => { const p = pos.getElement(i, [0, 0, 0]); return m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13]; };
      for (let t = 0; t < a.length; t += 3) {
        if ((wy(a[t]) + wy(a[t + 1]) + wy(a[t + 2])) / 3 > limit) { removed++; continue; }
        keep.push(a[t], a[t + 1], a[t + 2]);
      }
      idx.setArray(new (a.constructor)(keep));
      compactPrimitive(prim);
    }
  }
  console.log(`  removed ${removed.toLocaleString()} triangles above ${Math.round(frac * 100)}% of the height`);
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
