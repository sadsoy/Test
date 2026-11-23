// engine.js: a small cut-paper renderer on Canvas2D, 1080 x 1920, 30 fps.
// Every frame is a pure function of t (frames render in parallel and out of order).
//
// cut(path, fill, {z, grain, rim, alpha, rule})  one sheet of paper: soft drop shadow (z = height above the sheet under
//   it), paper-fibre grain that moves with the shape, a lit top-left edge and a darker bottom-right edge.
// layer(par, fn)  draw fn inside the camera with parallax par (0 = fixed to the screen, 1 = moves with the world).
// World coordinates: (0, 0) is the screen centre at zoom 1; +y is down.
const W = 1080, H = 1920, FPS = 30, TAU = Math.PI * 2;
const cv = document.getElementById('out'); let X = cv.getContext('2d');

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const ease5 = x => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeIn = x => Math.pow(clamp(x), 3);
const backOut = (x, s = 1.7) => { x = clamp(x); return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const elastic = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -9 * x) * Math.sin((x * 9 - .75) * (TAU / 3)) + 1; };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const spring = (t, t0, k = 6, w = 16) => t < t0 ? 0 : Math.exp(-k * (t - t0)) * Math.sin(w * (t - t0));
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
    const [a, va] = keys[i - 1], [b, vb] = keys[i], k = e((t - a) / (b - a));
    return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
  }
  return keys[keys.length - 1][1];
}
function mix(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), c = i => Math.round(lerp((pa >> i) & 255, (pb >> i) & 255, clamp(k)));
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}
const rgba = (hex, a) => { const p = parseInt(hex.slice(1), 16); return `rgba(${p >> 16 & 255},${p >> 8 & 255},${p & 255},${a})`; };

// ---------- paths ----------
// closed smooth curve through points (Catmull-Rom as Beziers)
function smooth(P, path = new Path2D()) {
  const n = P.length; path.moveTo((P[0][0] + P[n - 1][0]) / 2, (P[0][1] + P[n - 1][1]) / 2);
  for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n]; path.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
  path.closePath(); return path;
}
function poly(P, path = new Path2D()) { P.forEach((p, i) => i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1])); path.closePath(); return path; }
// a hand-cut circle: very slightly irregular, the same every frame (seeded)
function circ(x, y, r, seed = 0, amp = .012, path = new Path2D()) {
  const n = Math.max(14, Math.min(64, Math.round(r / 5))), P = [];
  for (let i = 0; i < n; i++) { const a = i / n * TAU, q = r * (1 + amp * (hash(seed * 31.7 + i * 1.37) * 2 - 1)); P.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); }
  return smooth(P, path);
}
function ell(x, y, rx, ry, rot = 0, seed = 0, amp = .015) {
  const n = 28, P = [], c = Math.cos(rot), s = Math.sin(rot);
  for (let i = 0; i < n; i++) { const a = i / n * TAU, q = 1 + amp * (hash(seed * 17.3 + i * 2.1) * 2 - 1), u = Math.cos(a) * rx * q, v = Math.sin(a) * ry * q; P.push([x + u * c - v * s, y + u * s + v * c]); }
  return smooth(P);
}
// an organic blob (clouds, continents, maria)
function blob(x, y, r, seed, amp = .25, n = 9, sx = 1, sy = 1) {
  const P = [];
  for (let i = 0; i < n; i++) { const a = i / n * TAU, q = r * (1 - amp / 2 + amp * hash(seed * 9.1 + i * 3.3)); P.push([x + Math.cos(a) * q * sx, y + Math.sin(a) * q * sy]); }
  return smooth(P);
}
function rrect(x, y, w, h, r) { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; }
function star(x, y, r, inner = .45, n = 5, rot = -Math.PI / 2) {
  const P = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, q = i % 2 ? r * inner : r; P.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); }
  return poly(P);
}
// smooth open curve through points (Catmull-Rom), n samples per span (vessels, leader paths, graph lines)
function through(P, n = 6) {
  const out = [];
  for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < n; k++) { const u = k / n, u2 = u * u, u3 = u2 * u; out.push([0, 1].map(d => .5 * (2 * p1[d] + (p2[d] - p0[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * u3))); } }
  out.push(P[P.length - 1]); return out;
}
// a tapered strip along a path (arrows, beams, paper ribbons)
function strip(P, w0, w1 = w0) {
  const L = [], R = [], n = P.length;
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, i / Math.max(1, n - 1)) / 2;
    L.push([P[i][0] - dy / d * w, P[i][1] + dx / d * w]); R.push([P[i][0] + dy / d * w, P[i][1] - dx / d * w]);
  }
  return poly(L.concat(R.reverse()));
}
function arcPts(cx, cy, r, a0, a1, n = 40) { const P = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return P; }

// ---------- paper ----------
let GRAIN = null, GRAIN_PAT = null, FRAME_TEX = null;
function makeTextures() {
  const g = document.createElement('canvas'); g.width = g.height = 512; const c = g.getContext('2d');
  c.fillStyle = '#fff'; c.fillRect(0, 0, 512, 512);
  let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 40; i++) { const x = r() * 512, y = r() * 512, R = 30 + r() * 120, gr = c.createRadialGradient(x, y, 0, x, y, R), a = .06 * r(); gr.addColorStop(0, `rgba(90,70,50,${a})`); gr.addColorStop(1, 'rgba(90,70,50,0)'); c.fillStyle = gr; c.fillRect(x - R, y - R, 2 * R, 2 * R); }
  for (let i = 0; i < 2600; i++) { const x = r() * 512, y = r() * 512, l = 3 + r() * 16, a = r() * TAU; c.strokeStyle = r() < .5 ? `rgba(60,45,30,${.05 + r() * .09})` : `rgba(255,255,255,${.3 + r() * .4})`; c.lineWidth = .6 + r() * .8; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a + .7) * l * .5, y + Math.sin(a + .7) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
  const id = c.getImageData(0, 0, 512, 512), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const v = (r() - .5) * 16; d[i] += v; d[i + 1] += v; d[i + 2] += v; }
  c.putImageData(id, 0, 0);
  GRAIN = g; GRAIN_PAT = X.createPattern(g, 'repeat');
  // whole-frame finish: fine grain + a warm vignette, multiplied over everything
  const f = document.createElement('canvas'); f.width = W; f.height = H; const fc = f.getContext('2d');
  const fd = fc.createImageData(W, H), q = fd.data;
  for (let i = 0; i < q.length; i += 4) { const v = 255 - (r() < .5 ? r() * r() * 26 : 0); q[i] = v; q[i + 1] = v - 1; q[i + 2] = v - 3; q[i + 3] = 255; }
  fc.putImageData(fd, 0, 0);
  const vg = fc.createRadialGradient(W / 2, H * .46, H * .32, W / 2, H / 2, H * .78); vg.addColorStop(0, 'rgba(255,255,255,0)'); vg.addColorStop(1, 'rgba(70,50,60,.42)');
  fc.fillStyle = vg; fc.fillRect(0, 0, W, H);
  FRAME_TEX = f;
}
const PATS = new Map(), patFor = c => { if (!PATS.has(c)) PATS.set(c, c.createPattern(GRAIN, 'repeat')); return PATS.get(c); };
const curScale = () => { const m = X.getTransform(); return Math.hypot(m.a, m.b); };
let SHADOW_RGB = '18,10,34';
function cut(p, fill, o = {}) {
  const z = o.z ?? 1, sc = curScale(), rule = o.rule || 'nonzero';
  X.save();
  if (o.alpha != null) X.globalAlpha *= o.alpha;
  if (z > 0) { X.shadowColor = `rgba(${o.shadow || SHADOW_RGB},${o.sa ?? .42})`; X.shadowBlur = (3 + z * 7) * sc; X.shadowOffsetX = z * 2.2 * sc; X.shadowOffsetY = z * 4.5 * sc; }
  X.fillStyle = fill; X.fill(p, rule);
  X.shadowColor = 'transparent'; X.shadowBlur = 0; X.shadowOffsetX = X.shadowOffsetY = 0;
  X.clip(p, rule);
  if ((o.grain ?? 1) > 0) {
    X.save(); X.globalCompositeOperation = 'multiply'; X.globalAlpha *= .55 * (o.grain ?? 1);
    X.fillStyle = patFor(X); X.fill(p, rule);
    X.restore();
  }
  if (o.rim !== false) {
    const d = 2.2 / sc;
    X.lineJoin = 'round';
    X.save(); X.translate(d * .7, d * 1.2); X.strokeStyle = `rgba(255,255,255,${o.rimA ?? .38})`; X.lineWidth = 2.6 / sc; X.stroke(p); X.restore();
    X.save(); X.translate(-d * .6, -d); X.strokeStyle = `rgba(${SHADOW_RGB},.22)`; X.lineWidth = 2.4 / sc; X.stroke(p); X.restore();
  }
  X.restore();
}
// a soft light (sun, stars, glow of the moon): additive radial gradient, not a sheet of paper
function glow(x, y, r, col = '#FFF2C8', a = .6) {
  if (a <= 0) return;
  X.save(); X.globalCompositeOperation = 'screen';
  const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(.35, rgba(col, a * .35)); g.addColorStop(1, rgba(col, 0));
  X.fillStyle = g; X.fillRect(x - r, y - r, 2 * r, 2 * r); X.restore();
}

// ---------- camera ----------
let CAM = { x: 0, y: 0, z: 1, r: 0 };
function setCam(x = 0, y = 0, z = 1, r = 0) { CAM = { x, y, z, r }; }
function layer(par, fn) {
  X.save(); X.translate(W / 2, H / 2); X.rotate(CAM.r * par); const z = Math.pow(CAM.z, par); X.scale(z, z); X.translate(-CAM.x * par, -CAM.y * par);
  fn(); X.restore();
}
// screen space, origin top-left
function screen(fn) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); fn(); X.restore(); }
// put an element at (x, y) with scale s and rotation r, then draw it around its own origin
function at(x, y, s, r, fn) { X.save(); X.translate(x, y); if (r) X.rotate(r); if (s !== 1) X.scale(s, s); fn(); X.restore(); }

// ---------- type ----------
// Thai display type on a paper backing; pop = 0..1 entrance
function txt(s, x, y, size, col, o = {}) {
  X.save(); X.translate(x, y); if (o.rot) X.rotate(o.rot); const k = o.pop == null ? 1 : backOut(o.pop, 2.2); if (k <= .01) { X.restore(); return; } X.scale(k, k);
  X.globalAlpha *= o.alpha ?? 1;
  X.font = `${o.weight || 800} ${size}px Kanit, sans-serif`; X.textAlign = o.align || 'center'; X.textBaseline = 'middle';
  if (o.back) {
    const m = X.measureText(s), w = m.width + size * .9, h = size * 1.45;
    cut(rrect(-w / 2 + (o.align === 'left' ? m.width / 2 : 0), -h / 2, w, h, size * .22), o.back, { z: o.z ?? 1.4 });
  }
  X.shadowColor = `rgba(${SHADOW_RGB},${o.sa ?? .45})`; X.shadowBlur = size * .08 * curScale(); X.shadowOffsetX = size * .03 * curScale(); X.shadowOffsetY = size * .06 * curScale();
  if (o.edge) { X.lineJoin = 'round'; X.lineWidth = size * .16; X.strokeStyle = o.edge; X.strokeText(s, 0, 0); X.shadowColor = 'transparent'; }
  X.fillStyle = col; X.fillText(s, 0, 0);
  X.restore();
}
