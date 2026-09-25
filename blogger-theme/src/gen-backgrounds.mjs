// Generates desert.svg (Start here section) and americana.svg (post list wallpaper tile).
import { writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
let seed = 5;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/* ---------- Desert: Monument Valley-style mesas at golden hour ---------- */
const W = 1600, H = 1000;
function mesa(x0, x1, top, base, talus, spire) {
  const w = x1 - x0, a = w * 0.12, b = w * 0.2;
  let d = `M${x0},${base} L${x0 + a},${base - talus} L${x0 + b},${top}`;
  if (spire) d += ` L${x0 + w * 0.55},${top} L${x0 + w * 0.6},${top + 30} L${x0 + w * 0.66},${top + 30} L${x0 + w * 0.68},${top - 70} L${x0 + w * 0.74},${top - 70} L${x0 + w * 0.76},${top + 30}`;
  d += ` L${x1 - b},${top} L${x1 - a},${base - talus} L${x1},${base}Z`;
  return d;
}
function strata(x0, x1, top, base, talus) {
  const w = x1 - x0; let s = '';
  for (let y = top + 18; y < base - talus; y += 16 + rnd() * 10) s += `<path d="M${x0 + w * 0.2},${y.toFixed(0)} H${x1 - w * 0.2}"/>`;
  return s;
}
function cactus(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#3b1a12">
    <rect x="-9" y="-120" width="18" height="120" rx="9"/>
    <path d="M-9 -60 h-18 a9 9 0 0 1 -9 -9 v-34 a9 9 0 0 1 18 0 v25 h9z"/>
    <path d="M9 -75 h18 a9 9 0 0 0 9 -9 v-26 a9 9 0 0 0 -18 0 v17 h-9z"/></g>`;
}
const road = (() => {
  const vx = 830, vy = 700;
  return `<path d="M${vx - 3},${vy} L${vx + 3},${vy} L1120,${H} L520,${H}Z" fill="#3a2a2e"/>
  <path d="M${vx},${vy} L820,${H}" stroke="#ffcf7a" stroke-width="6" stroke-dasharray="26 22" opacity=".9"/>`;
})();
const shield = `<g transform="translate(1180 780)">
  <rect x="-3" y="0" width="6" height="150" fill="#3b1a12"/>
  <path d="M-38 -70 H38 C38 -48 44 -30 34 -8 C22 18 6 22 0 32 C-6 22 -22 18 -34 -8 C-44 -30 -38 -48 -38 -70Z" fill="#fffaf0" stroke="#1d1d1d" stroke-width="4"/>
  <path d="M-30 -62 H30 V-44 H-30Z" fill="#1d1d1d"/>
  <text x="0" y="-48" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="700" fill="#fffaf0" text-anchor="middle">US</text>
  <text x="0" y="6" font-family="Arial,Helvetica,sans-serif" font-size="40" font-weight="800" fill="#1d1d1d" text-anchor="middle">66</text></g>`;
const mesas = [
  [60, 420, 520, 740, 70, false, '#9c4a2a'], [380, 640, 560, 740, 60, true, '#a9532e'],
  [980, 1300, 500, 740, 80, true, '#963f24'], [1280, 1640, 540, 740, 60, false, '#a24c2b'],
];
const desert = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#23407a"/><stop offset=".45" stop-color="#8a5b8c"/><stop offset=".62" stop-color="#e9824a"/><stop offset=".74" stop-color="#f6c177"/></linearGradient>
<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9884a"/><stop offset="1" stop-color="#8c3d1e"/></linearGradient>
<radialGradient id="sun"><stop offset="0" stop-color="#fff1c9"/><stop offset=".3" stop-color="#ffd27f" stop-opacity=".9"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#s)"/>
<circle cx="830" cy="700" r="330" fill="url(#sun)"/><circle cx="830" cy="700" r="92" fill="#fff4d6"/>
<path d="M0 700 C300 670 520 690 830 680 S1400 668 1600 690 V740 H0Z" fill="#c9774a" opacity=".6"/>
${mesas.map(([x0, x1, top, base, t, sp, c]) => `<path d="${mesa(x0, x1, top, base, t, sp)}" fill="${c}"/><g stroke="#6e2b17" stroke-opacity=".35" stroke-width="3">${strata(x0, x1, top, base, t)}</g>`).join('')}
<rect y="738" width="${W}" height="${H - 738}" fill="url(#g)"/>
${Array.from({ length: 40 }, () => `<ellipse cx="${(rnd() * W).toFixed(0)}" cy="${(760 + rnd() * 220).toFixed(0)}" rx="${(8 + rnd() * 22).toFixed(0)}" ry="${(3 + rnd() * 5).toFixed(0)}" fill="#6e2b17" opacity=".35"/>`).join('')}
${road}
${shield}
${cactus(250, 960, 1.4)}${cactus(1420, 930, 1.1)}${cactus(1520, 990, 1.6)}${cactus(90, 880, 0.8)}
<g fill="none" stroke="#2b1b2e" stroke-width="3" stroke-linecap="round"><path d="M500 300 q10 -8 20 0 q10 -8 20 0"/><path d="M560 270 q8 -6 16 0 q8 -6 16 0"/><path d="M1100 330 q9 -7 18 0 q9 -7 18 0"/></g>
</svg>`;
writeFileSync(`${here}/desert.svg`, desert);

/* ---------- Americana wallpaper tile (line icons, no flag) ---------- */
const icons = {
  shield: `<path d="M-22 -26 H22 C22 -12 26 -2 20 12 C13 26 3 28 0 34 C-3 28 -13 26 -20 12 C-26 -2 -22 -12 -22 -26Z"/><path d="M-22 -16 H22"/><text x="0" y="12" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="800" text-anchor="middle" stroke="none" fill="#14213d">66</text>`,
  cactus: `<path d="M-6 36 V-30 a6 6 0 0 1 12 0 V36"/><path d="M-6 6 h-10 a6 6 0 0 1 -6 -6 v-18 a5 5 0 0 1 10 0 v12 h6"/><path d="M6 -2 h10 a6 6 0 0 0 6 -6 v-14 a5 5 0 0 0 -10 0 v8 h-6"/><path d="M-20 36 H20"/>`,
  torch: `<path d="M-8 -6 H8 L4 20 H-4Z"/><path d="M-12 -6 H12"/><path d="M0 -10 C-12 -18 -6 -30 0 -38 C2 -30 12 -24 6 -14 C4 -10 2 -10 0 -10Z"/><path d="M-2 20 V36 H2 V20"/>`,
  bridge: `<path d="M-30 30 H30"/><path d="M-16 30 V-26 M-10 30 V-26 M10 30 V-26 M16 30 V-26"/><path d="M-16 -26 H-10 M10 -26 H16 M-16 -8 H-10 M10 -8 H16"/><path d="M-36 4 Q-24 20 -13 -26 Q0 14 13 -26 Q24 20 36 4"/>`,
  mug: `<path d="M-16 -8 H12 V22 a6 6 0 0 1 -6 6 H-10 a6 6 0 0 1 -6 -6Z"/><path d="M12 -2 h6 a6 6 0 0 1 0 14 h-6"/><path d="M-8 -16 q-4 -6 0 -12 M0 -16 q-4 -6 0 -12 M8 -16 q-4 -6 0 -12"/>`,
  baseball: `<circle r="22"/><path d="M-14 -17 C-6 -8 -6 8 -14 17 M14 -17 C6 -8 6 8 14 17"/><path d="M-12 -10 l-5 2 M-10 -3 l-5 1 M-10 4 l-5 -1 M12 -10 l5 2 M10 -3 l5 1 M10 4 l5 -1"/>`,
  hat: `<path d="M-32 10 C-20 20 20 20 32 10"/><path d="M-18 12 C-18 -4 -16 -18 -10 -18 C-6 -18 -4 -12 0 -12 C4 -12 6 -18 10 -18 C16 -18 18 -4 18 12"/><path d="M-18 4 C-6 8 6 8 18 4"/>`,
  bus: `<rect x="-30" y="-16" width="60" height="30" rx="5"/><path d="M-24 -10 h10 v10 h-10z M-8 -10 h10 v10 h-10z M8 -10 h10 v10 h-10z"/><circle cx="-18" cy="16" r="5"/><circle cx="18" cy="16" r="5"/>`,
  star: `<path d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4Z"/>`,
};
const place = [['shield', 50, 55, -8], ['cactus', 170, 60, 6], ['torch', 285, 70, -6], ['bridge', 60, 180, 4], ['star', 150, 150, 10],
  ['mug', 215, 190, -10], ['baseball', 300, 190, 0], ['hat', 70, 290, -4], ['bus', 190, 290, 5], ['star', 290, 285, -12], ['star', 120, 245, 0]];
const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="340" viewBox="0 0 340 340"><g fill="none" stroke="#14213d" stroke-opacity=".1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
${place.map(([k, x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${icons[k]}</g>`).join('')}
</g></svg>`.replace('fill="#14213d"', 'fill="#14213d" fill-opacity=".1"');
writeFileSync(`${here}/americana.svg`, tile);
console.log('desert', desert.length, 'americana', tile.length);
