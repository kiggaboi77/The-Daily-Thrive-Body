// Generates src/hero.svg — a suburban American street at dusk with a city skyline.
import { writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const W = 1600, H = 900;
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function ridge(base, amp, freqs, step = 16) {
  const ph = freqs.map(() => rnd() * Math.PI * 2);
  let d = `M-20,${H}`;
  for (let x = -20; x <= W + 20; x += step) {
    let y = 0;
    freqs.forEach((f, i) => { y += Math.sin(x * f + ph[i]) / (i + 1); });
    d += ` L${x},${(base - amp * (0.6 + 0.4 * y)).toFixed(1)}`;
  }
  return d + ` L${W + 20},${H} Z`;
}

// Skyline: towers with lit windows
function skyline(x0, x1, baseY) {
  let out = '', x = x0;
  while (x < x1) {
    const w = 26 + rnd() * 46, h = 50 + rnd() ** 1.6 * 190;
    const top = baseY - h;
    out += `<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}"/>`;
    if (rnd() > 0.75) out += `<rect x="${(x + w / 2 - 1).toFixed(0)}" y="${(top - 26).toFixed(0)}" width="2" height="26"/>`;
    for (let wy = top + 10; wy < baseY - 8; wy += 12)
      for (let wx = x + 5; wx < x + w - 6; wx += 9)
        if (rnd() > 0.72) out += `<rect class="win" x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="3" height="5"/>`;
    x += w + 2 + rnd() * 6;
  }
  return out;
}

// Suburban house with gable roof and lit windows
function house(x, y, s, body, roof) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-8 60 L90 -6 L188 60Z" fill="${roof}"/>
    <rect x="8" y="56" width="164" height="94" fill="${body}"/>
    <rect x="128" y="-2" width="18" height="40" fill="${roof}"/>
    <rect x="26" y="78" width="36" height="30" fill="#ffd28a"/><path d="M44 78v30M26 93h36" stroke="${body}" stroke-width="3"/>
    <rect x="118" y="78" width="36" height="30" fill="#ffd28a"/><path d="M136 78v30M118 93h36" stroke="${body}" stroke-width="3"/>
    <rect x="76" y="92" width="28" height="58" fill="#ffc36b" opacity=".85"/>
    <path d="M62 42 L90 20 L118 42Z" fill="#ffd28a" opacity=".6"/>
  </g>`;
}
function tree(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#0d1628"><rect x="-4" y="0" width="8" height="46"/><circle cx="0" cy="-10" r="30"/><circle cx="-20" cy="6" r="22"/><circle cx="20" cy="6" r="22"/><circle cx="0" cy="-34" r="20"/></g>`;
}

// Road from viewer toward the city
function road() {
  const L = [], R = [], C = [];
  const N = 50;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const y = 900 - t * 250;
    const x = 760 + (880 - 760) * t + Math.sin(t * Math.PI * 1.4) * 120 * (1 - t);
    const w = 420 * (1 - t) ** 1.7 + 4;
    L.push([x - w / 2, y]); R.push([x + w / 2, y]); C.push([x, y, w]);
  }
  const f = (p) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
  let dashes = '';
  for (let i = 0; i < N - 4; i += 3) {
    const [x1, y1, w1] = C[i], [x2, y2] = C[i + 1];
    dashes += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}" stroke-width="${Math.max(1, w1 / 45).toFixed(1)}"/>`;
  }
  return `<path d="M${f(L)} L${f(R.reverse())} Z" fill="#2a3450"/><g stroke="#ffcf7a" stroke-linecap="round" opacity=".9">${dashes}</g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1a33"/><stop offset=".42" stop-color="#2b3e6b"/><stop offset=".68" stop-color="#b8708a"/><stop offset=".86" stop-color="#f3a86b"/></linearGradient>
<radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffb877" stop-opacity=".5"/><stop offset="1" stop-color="#ffb877" stop-opacity="0"/></radialGradient>
<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd3a1" stop-opacity="0"/><stop offset="1" stop-color="#ffd3a1" stop-opacity=".45"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
${Array.from({ length: 60 }, () => `<circle cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * 300).toFixed(0)}" r="${(rnd() * 1.2 + .3).toFixed(1)}" fill="#fff" opacity="${(rnd() * .6 + .2).toFixed(2)}"/>`).join('')}
<circle cx="900" cy="640" r="260" fill="url(#sun)"/>
<path d="${ridge(640, 70, [0.003, 0.008, 0.02])}" fill="#7a5f86" opacity=".75"/>
<g fill="#3a3f66">${skyline(640, 1160, 660)}</g>
<style>.win{fill:#ffd9a0;opacity:.85}</style>
<rect x="0" y="560" width="${W}" height="110" fill="url(#haze)"/>
<path d="${ridge(700, 36, [0.004, 0.011, 0.03])}" fill="#26315a"/>
<path d="${ridge(760, 30, [0.0035, 0.009, 0.025])}" fill="#1a2444"/>
${road()}
<path d="M-20 900 L-20 800 C200 780 420 790 560 840 C600 860 620 885 626 900Z" fill="#101a31"/>
<path d="M1620 900 L1620 745 C1420 740 1220 750 1080 790 C1010 812 980 860 972 900Z" fill="#101a31"/>
${tree(1150, 730, 1.1)}
${house(1200, 660, 0.9, '#1b2745', '#0d1628')}
${house(1390, 640, 1.0, '#223052', '#0d1628')}
${tree(1618, 700, 1.4)}
<g fill="#0d1628"><rect x="1366" y="726" width="5" height="60"/><rect x="1356" y="714" width="26" height="16" rx="7"/><rect x="1380" y="710" width="3" height="12" fill="#c8323c"/></g>
<g><rect x="1060" y="600" width="5" height="190" fill="#0d1628"/><path d="M1062 600 q0 -18 30 -18 h10" stroke="#0d1628" stroke-width="5" fill="none"/><circle cx="1104" cy="588" r="30" fill="#ffd9a0" opacity=".25"/><rect x="1094" y="584" width="20" height="7" rx="3" fill="#ffe7bd"/></g>
${tree(120, 780, 1.3)}
</svg>`;
writeFileSync(`${here}/hero.svg`, svg);
console.log('hero.svg', svg.length);
