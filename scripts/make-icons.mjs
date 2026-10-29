// Makes the app icons for installing Corebound on a phone (public/icons/*.png): a small ringed
// living planet on the game's night colour. Run: node scripts/make-icons.mjs
import sharp from 'sharp';
const svg = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="sky" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#2a2150"/><stop offset="1" stop-color="#0b0a1c"/></radialGradient>
    <radialGradient id="planet" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#8fe0a0"/><stop offset="0.45" stop-color="#2f9e7a"/><stop offset="1" stop-color="#14504a"/></radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0.6" stop-color="#5cffd6" stop-opacity="0.35"/><stop offset="1" stop-color="#5cffd6" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="512" height="512" rx="${pad ? 0 : 110}" fill="url(#sky)"/>
  <g transform="translate(256 262) scale(${pad ? 0.78 : 1})">
    <circle r="190" fill="url(#glow)"/>
    <path d="M -200 40 A 210 62 -18 0 1 200 -40" fill="none" stroke="#ffb347" stroke-width="16" stroke-linecap="round" opacity="0.55" transform="rotate(-18)"/>
    <circle r="138" fill="url(#planet)"/>
    <path d="M -96 -40 q 40 -30 80 -6 q 30 18 70 -4" fill="none" stroke="#c9ffd9" stroke-width="10" stroke-linecap="round" opacity="0.5"/>
    <circle cx="-30" cy="38" r="14" fill="#ffd27a"/>
    <circle cx="44" cy="70" r="9" fill="#5cffd6"/>
    <path d="M -210 40 A 210 62 -18 0 0 210 -40" fill="none" stroke="#ffb347" stroke-width="16" stroke-linecap="round" transform="rotate(-18)"/>
  </g>
</svg>`;
for (const [name, size, pad] of [['icon-192', 192, false], ['icon-512', 512, false], ['icon-maskable-512', 512, true]])
  await sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(`public/icons/${name}.png`);
console.log('icons written');
