// make_logo.mjs — NOVA 404 logo system, generated as SVG (text converted to outlines with opentype.js, so the files
// need no fonts). Paper-cut depth comes from an SVG filter on every paper layer: a soft offset shadow plus fibre grain.
// Writes: logo/concepts/*.svg (the three explored directions) and the final family in logo/*.svg.
// Usage: node brand_identity/src/make_logo.mjs
import fs from 'fs';
import opentype from 'opentype.js';

const ROOT = 'brand_identity', F = n => { const b = fs.readFileSync(`${ROOT}/typography/fonts/${n}.ttf`); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const UNB = F('unbounded-800'), MONO = F('spacemono-700');
// lay text out glyph by glyph with kerning (opentype.js's full shaping trips on a ligature table in Unbounded)
function tp(font, str, x, y, size) {
  const k = size / font.unitsPerEm, gl = [...str].map(ch => font.charToGlyph(ch)), parts = []; let gx = x;
  gl.forEach((g, i) => { parts.push(g.getPath(gx, y, size).toPathData(2)); gx += g.advanceWidth * k + (i + 1 < gl.length ? font.getKerningValue(g, gl[i + 1]) * k : 0); });
  return { toPathData: () => parts.join(' '), end: gx };
}
const tw = (font, str, size) => tp(font, str, 0, 0, size).end;
const C = { ink: '#1B1F3B', ink2: '#2E3A6E', ink3: '#46559A', deep: '#0E1226', cream: '#F4ECDD', gold: '#FFC83D', goldLt: '#FFE08A',
  goldDk: '#E9A21F', coral: '#E8604C', teal: '#23867A' };
fs.mkdirSync(`${ROOT}/logo/concepts`, { recursive: true });

// ---------- shared SVG pieces ----------
const paperFilter = (id = 'pc', d = 7, blur = 5, op = .38) => `
  <filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}"/><feOffset dx="${d * .3}" dy="${d}" result="b"/>
    <feFlood flood-color="#26170D" flood-opacity="${op}"/><feComposite in2="b" operator="in" result="shadow"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="11"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.32 .22" result="grain"/>
    <feComposite in="grain" in2="SourceGraphic" operator="in" result="tex"/>
    <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/><feMergeNode in="tex"/></feMerge>
  </filter>`;
const svg = (w, h, body, defs = '', bg = null) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>${paperFilter('pc')}${paperFilter('pcs', 4, 3, .32)}${defs}</defs>
${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ''}
${body}
</svg>
`;
const f2 = n => +n.toFixed(2);
// a 4-point star (the "nova") split into two halves of a fold: left lighter, right darker
function nova(cx, cy, r, inner = .24, light = C.goldLt, dark = C.gold) {
  const p = (a, q) => `${f2(cx + Math.cos(a) * q)},${f2(cy + Math.sin(a) * q)}`, k = r * inner, D = Math.PI / 4;
  const top = p(-Math.PI / 2, r), bot = p(Math.PI / 2, r), left = p(Math.PI, r), right = p(0, r);
  return `<path d="M${top} L${p(-Math.PI / 2 - D, k)} L${left} L${p(Math.PI / 2 + D, k)} L${bot} Z" fill="${light}"/>
  <path d="M${top} L${p(-D, k)} L${right} L${p(D, k)} L${bot} Z" fill="${dark}"/>`;
}
// an annulus path (for one-colour versions)
const ring = (cx, cy, r0, r1) => `M${cx - r1},${cy} a${r1},${r1} 0 1,0 ${2 * r1},0 a${r1},${r1} 0 1,0 ${-2 * r1},0 Z M${cx - r0},${cy} a${r0},${r0} 0 1,1 ${2 * r0},0 a${r0},${r0} 0 1,1 ${-2 * r0},0 Z`;
const starPath = (cx, cy, r, inner = .24) => { const pts = []; for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + i * Math.PI / 4, q = i % 2 ? r * inner : r; pts.push(`${f2(cx + Math.cos(a) * q)},${f2(cy + Math.sin(a) * q)}`); } return `M${pts.join(' L')} Z`; };

// ---------- the final symbol: "the paper portal" ----------
// Concentric discs of cut paper open onto a dark hole (the unknown, "404"), and a folded-paper nova is coming through it.
// theme: 'light' (for light grounds) | 'dark' (for dark grounds) | 'mono' (one colour, given as col)
function portal(cx, cy, R, theme = 'light', col = C.ink) {
  if (theme === 'mono') {
    return `<path fill="${col}" fill-rule="evenodd" d="${ring(cx, cy, R * .86, R)} ${ring(cx + R * .02, cy + R * .02, R * .58, R * .72)}"/>
  <path fill="${col}" d="${starPath(cx + R * .08, cy - R * .07, R * .4)}"/>`;
  }
  const L = theme === 'light' ? [C.ink, C.ink2, C.ink3, C.deep] : [C.cream, C.ink2, C.ink3, C.deep];
  return `<g filter="url(#pc)"><circle cx="${cx}" cy="${cy}" r="${R}" fill="${L[0]}"/></g>
  <g filter="url(#pcs)"><circle cx="${f2(cx + R * .025)}" cy="${f2(cy + R * .02)}" r="${f2(R * .84)}" fill="${L[1]}"/></g>
  <g filter="url(#pcs)"><circle cx="${f2(cx + R * .04)}" cy="${f2(cy + R * .035)}" r="${f2(R * .66)}" fill="${L[2]}"/></g>
  <circle cx="${f2(cx + R * .05)}" cy="${f2(cy + R * .045)}" r="${f2(R * .48)}" fill="${L[3]}"/>
  <circle cx="${f2(cx - R * .2)}" cy="${f2(cy + R * .22)}" r="${f2(R * .035)}" fill="${C.cream}" opacity=".9"/>
  <circle cx="${f2(cx + R * .3)}" cy="${f2(cy + R * .25)}" r="${f2(R * .022)}" fill="${C.cream}" opacity=".7"/>
  <g filter="url(#pc)">${nova(cx + R * .08, cy - R * .07, R * .4)}</g>`;
}

// ---------- wordmark: N [portal] V A + a coral paper label with 404 ----------
function wordmark(x, base, size, theme = 'light', mono = null) {
  const ink = mono || (theme === 'light' ? C.ink : C.cream), capH = UNB.tables.os2.sCapHeight / UNB.unitsPerEm * size;
  const glyph = (ch, gx) => tp(UNB, ch, gx, base, size).toPathData(2);
  let gx = x, parts = [];
  parts.push(`<path d="${glyph('N', gx)}" fill="${ink}"/>`); gx += tw(UNB, 'N', size);
  const R = capH * .58, ox = gx + R * 1.02 + size * .01;                      // the portal takes the place of the O
  const portalSvg = mono ? portal(ox, base - capH / 2, R, 'mono', mono) : portal(ox, base - capH / 2, R, theme);
  gx = ox + R * 1.02 + size * .035;
  const va = tp(UNB, 'VA', gx, base, size).toPathData(2); gx += tw(UNB, 'VA', size);
  const letters = mono ? `<path d="${glyph('N', x)}" fill="${ink}"/><path d="${va}" fill="${ink}"/>`
    : `<g filter="url(#pcs)"><path d="${glyph('N', x)}" fill="${ink}"/><path d="${va}" fill="${ink}"/></g>`;
  // the 404 label: a slightly tilted strip of coral paper with notched ends
  const ms = size * .44, tw404 = tw(MONO, '404', ms), lx = gx + size * .14, lh = ms * 1.15, ly = base - lh * .95;
  const lw = tw404 + ms * .7, n = lh * .22;
  const label = `M${f2(lx)},${f2(ly)} L${f2(lx + lw)},${f2(ly)} L${f2(lx + lw - n)},${f2(ly + lh / 2)} L${f2(lx + lw)},${f2(ly + lh)} L${f2(lx)},${f2(ly + lh)} L${f2(lx + n)},${f2(ly + lh / 2)} Z`;
  const digits = tp(MONO, '404', lx + ms * .35, ly + lh * .78, ms).toPathData(2);
  const lab = mono ? `<path fill="${mono}" fill-rule="evenodd" d="${label} ${digits}"/>`
    : `<g filter="url(#pcs)" transform="rotate(-4 ${f2(lx + lw / 2)} ${f2(ly + lh / 2)})"><path d="${label}" fill="${C.coral}"/><path d="${digits}" fill="${C.cream}"/></g>`;
  const right = lx + lw;
  return { body: letters + portalSvg + lab, width: right - x, top: base - capH - R * .2, bottom: base + R * .25 };
}

function writeMain(name, theme, mono = null, bg = null) {
  const size = 200, pad = 60, base = 300;
  const w = wordmark(pad, base, size, theme, mono), W = Math.ceil(w.width + pad * 2), H = 420;
  fs.writeFileSync(`${ROOT}/logo/${name}.svg`, svg(W, H, w.body, '', bg));
  return { W, H };
}
// stacked: symbol above the wordmark
function writeStacked(name, theme) {
  const size = 150, W = 1000, R = 230;
  const w = wordmark(0, 0, size, theme);
  const x0 = (W - w.width) / 2, base = 2 * R + 140 + 150;
  const w2 = wordmark(x0, base, size, theme);
  fs.writeFileSync(`${ROOT}/logo/${name}.svg`, svg(W, base + 90, portal(W / 2, R + 40, R, theme) + w2.body));
}
function writeIcon(name, theme, mono = null, bg = null, size = 512, r = 236) {
  const body = mono ? portal(size / 2, size / 2, r, 'mono', mono) : portal(size / 2, size / 2, r, theme);
  fs.writeFileSync(`${ROOT}/logo/${name}.svg`, svg(size, size, body, '', bg));
}
// the YouTube profile picture: the symbol on a midnight square (YouTube crops it to a circle)
function writeProfile() {
  const S = 800;
  const bg = `<rect width="${S}" height="${S}" fill="${C.ink}"/><circle cx="${S / 2}" cy="${S / 2}" r="${S * .47}" fill="#232955"/>`;
  fs.writeFileSync(`${ROOT}/logo/nova404_profile_800.svg`, svg(S, S, bg + portal(S / 2, S / 2 + 6, S * .34, 'dark')));
}

// ---------- the three concepts explored before the final ----------
function concepts() {
  const S = 512;
  // A · the paper portal (chosen)
  fs.writeFileSync(`${ROOT}/logo/concepts/A_paper_portal.svg`, svg(S, S, portal(256, 256, 220, 'light'), '', C.cream));
  // B · the folded nova: an origami 4-point star, eight facets in two golds, with 404 punched under it
  const facets = []; for (let i = 0; i < 8; i++) { const a0 = -Math.PI / 2 + i * Math.PI / 4, a1 = a0 + Math.PI / 4, big = i % 2 === 0;
    const P = (a, q) => `${f2(256 + Math.cos(a) * q)},${f2(230 + Math.sin(a) * q)}`;
    facets.push(`<path d="M256,230 L${P(a0, big ? 200 : 52)} L${P(a1, big ? 52 : 200)} Z" fill="${i % 2 ? C.gold : C.goldLt}"/>`); }
  const d404 = tp(MONO, '404', 256 - tw(MONO, '404', 70) / 2, 470, 70).toPathData(2);
  fs.writeFileSync(`${ROOT}/logo/concepts/B_folded_nova.svg`, svg(S, S, `<g filter="url(#pc)"><rect x="16" y="16" width="480" height="480" rx="70" fill="${C.ink}"/></g><g filter="url(#pc)">${facets.join('')}</g><path d="${d404}" fill="${C.cream}"/>`, '', C.cream));
  // C · the 404 tag: a coral luggage tag, 404 cut out, a star punched for the string hole
  const d4 = tp(UNB, '404', 256 - tw(UNB, '404', 150) / 2, 330, 150).toPathData(2);
  fs.writeFileSync(`${ROOT}/logo/concepts/C_404_tag.svg`, svg(S, S, `<g filter="url(#pc)" transform="rotate(-6 256 256)"><path fill="${C.coral}" fill-rule="evenodd" d="M110,110 L402,110 L452,170 L452,402 L60,402 L60,170 Z ${starPath(256, 165, 34, .35)} ${d4}"/></g>`, '', C.cream));
}

concepts();
const m = writeMain('nova404_logo_main_light', 'light');
writeMain('nova404_logo_main_dark', 'dark');
writeMain('nova404_logo_mono_black', 'light', C.ink);
writeMain('nova404_logo_mono_white', 'light', '#FFFFFF');
writeStacked('nova404_logo_stacked_light', 'light');
writeStacked('nova404_logo_stacked_dark', 'dark');
writeIcon('nova404_icon_light', 'light');
writeIcon('nova404_icon_dark', 'dark');
writeIcon('nova404_icon_mono_black', 'light', C.ink);
writeIcon('nova404_icon_mono_white', 'light', '#FFFFFF');
writeProfile();
console.log('main logo', m.W, 'x', m.H, '·', fs.readdirSync(`${ROOT}/logo`).filter(f => f.endsWith('.svg')).join(' '));
