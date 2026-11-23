// paper.js: a paper-cut kit for the 9:16 Shorts, on top of the engine in core.js / timeline.js.
//
// Each shot paints on one 2D canvas (PG) in layers of cut paper: a flat coloured shape, a soft drop shadow that grows
// with the layer's height above the one under it, and paper fibres multiplied into the colour. pcEnd() lays the sheet
// onto the engine's frame, so dissolves (timeline.js), the paper grain and the vignette (core.js) work as in the film.
// Everything stays a pure function of t.
//
//   pcBegin(bg)                    start a frame: clear to the backing colour
//   pcCam(x, y, z, r)              camera: world point (x, y) at screen centre, zoom z, roll r (rad)
//   layer(p, fn)                   draw fn() through the camera with parallax p (0 = fixed to the screen, 1 = the camera)
//   cut(path, col, lv, o)          one piece of paper: lv = shadow height (0 none … 4 high), o.tex fibres, o.edge highlight
//   Pp(pts) Pr(x,y,w,h,r) Pc(x,y,r) Pe(x,y,rx,ry,rot) Pu(...paths)     Path2D builders
//   hills(y, amp, f, ph, ...)      a rolling paper horizon down to the bottom of the frame
//   pcEnd()                        put the sheet into the frame
// Text: ptext(txt, x, y, size, col, o) cut-paper letters (Kanit), tag(txt, x, y, o) a paper label.

let PG = null, PX = null, FIBER = null, FIBER_C = null, PCAM = { x: 540, y: 960, z: 1, r: 0 };
const FONT = '"Kanit", "Noto Sans Thai", sans-serif';

function pcInit() {
  PG = createGraphics(W, H); PG.pixelDensity(1); PX = PG.drawingContext;
  // fibre texture: soft blotches and short curved fibres on white, multiplied into each piece of paper
  const cv = document.createElement('canvas'); cv.width = cv.height = 512; const c = cv.getContext('2d'), r = lcg(23);
  c.fillStyle = '#fff'; c.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++) {
    const x = r() * 512, y = r() * 512, rr = 20 + r() * 90, g = c.createRadialGradient(x, y, 0, x, y, rr), a = .05 + r() * .06;
    g.addColorStop(0, `rgba(150,130,105,${a})`); g.addColorStop(1, 'rgba(150,130,105,0)'); c.fillStyle = g;
    for (const dx of [-512, 0, 512]) for (const dy of [-512, 0, 512]) c.fillRect(x - rr + dx, y - rr + dy, 2 * rr, 2 * rr);
  }
  c.lineWidth = 1;
  for (let i = 0; i < 1600; i++) {
    const x = r() * 512, y = r() * 512, l = 4 + r() * 16, a = r() * TAU;
    c.strokeStyle = r() < .5 ? `rgba(120,100,80,${.06 + r() * .08})` : `rgba(255,255,255,${.25 + r() * .3})`;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a + .7) * l * .5, y + Math.sin(a + .7) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
  }
  const id = c.getImageData(0, 0, 512, 512), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 16; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  c.putImageData(id, 0, 0);
  FIBER_C = cv; FIBER = PX.createPattern(cv, 'repeat');
}

function pcBegin(bg = '#EDE3D1') {
  const c = PX; c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.filter = 'none';
  c.shadowColor = 'transparent'; c.fillStyle = bg; c.fillRect(0, 0, W, H);
  PCAM = { x: W / 2, y: H / 2, z: 1, r: 0 };
}
function pcCam(x = W / 2, y = H / 2, z = 1, r = 0) { PCAM = { x, y, z, r }; }
function layer(p, fn) {
  const c = PX, z = 1 + (PCAM.z - 1) * p;
  c.save(); c.translate(W / 2, H / 2); c.rotate(PCAM.r * p); c.scale(z, z);
  c.translate(-(W / 2 + (PCAM.x - W / 2) * p), -(H / 2 + (PCAM.y - H / 2) * p));
  fn(c); c.restore();
}
function pcEnd() { flushBrush(); push(); resetMatrix(); translate(-W / 2, -H / 2); image(PG, 0, 0); pop(); }

// ---------- paths ----------
function Pp(pts) { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); return p; }
function Pr(x, y, w, h, r = 0) { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; }
function Pc(x, y, r) { const p = new Path2D(); p.arc(x, y, Math.max(.1, r), 0, TAU); return p; }
function Pe(x, y, rx, ry, rot = 0) { const p = new Path2D(); p.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); return p; }
function Pu(...ps) { const p = new Path2D(); ps.forEach(q => p.addPath(q)); return p; }
// smooth closed blob through points (quadratic midpoints), for clouds, continents, bushes
function Pblob(pts) {
  const p = new Path2D(), n = pts.length, m = i => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2];
  p.moveTo(...m(0)); for (let i = 1; i <= n; i++) p.quadraticCurveTo(pts[i % n][0], pts[i % n][1], ...m(i)); p.closePath(); return p;
}
// a rolling horizon from x0 to x1 at height y, filled down to `bottom`
function hills(y, amp, f, ph, x0 = -400, x1 = W + 400, bottom = H + 600, n = 40) {
  const pts = []; for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); pts.push([x, y + amp * (Math.sin(x * f + ph) * .6 + Math.sin(x * f * 2.3 + ph * 1.7) * .4)]); }
  pts.push([x1, bottom], [x0, bottom]); return Pp(pts);
}

// ---------- paper ----------
const SHADE = 'rgba(38,24,14,';
function cut(path, col, lv = 1, o = {}) {
  const c = PX;
  c.save();
  if (o.alpha != null) c.globalAlpha = o.alpha;
  if (lv > 0) { c.shadowColor = SHADE + (o.sa ?? .34) + ')'; c.shadowBlur = 3 + lv * 7; c.shadowOffsetX = lv * 1.5; c.shadowOffsetY = 1.5 + lv * 4; }
  c.fillStyle = col; c.fill(path, o.rule || 'nonzero');
  c.shadowColor = 'transparent';
  if (o.tex !== 0) { c.globalCompositeOperation = 'multiply'; c.globalAlpha = (o.alpha ?? 1) * (o.tex ?? .7); c.fillStyle = FIBER; c.fill(path, o.rule || 'nonzero'); }
  if (o.edge) { c.globalCompositeOperation = 'source-over'; c.globalAlpha = (o.alpha ?? 1) * o.edge; c.strokeStyle = '#FFFFFF'; c.lineWidth = 2; c.stroke(path); }
  c.restore();
}
// light that glows (energy, flares, lamps): additive, with no paper texture
function shine(x, y, r, col = '#FFE08A', a = 1) {
  if (a <= 0 || r <= 1) return;
  const c = PX, g = c.createRadialGradient(x, y, 0, x, y, r), [R, G, B] = hexRGB(col);
  g.addColorStop(0, `rgba(${R},${G},${B},${.9 * a})`); g.addColorStop(.25, `rgba(${R},${G},${B},${.45 * a})`); g.addColorStop(1, `rgba(${R},${G},${B},0)`);
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
}
function hexRGB(h) { const v = parseInt(h.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; }
function rgba(h, a) { const [r, g, b] = hexRGB(h); return `rgba(${r},${g},${b},${a})`; }
// a thin paper strip (cables, pipes, string): a stroked path with a shadow
function strip(pts, col, w = 6, lv = 1, o = {}) {
  const c = PX; c.save(); if (o.alpha != null) c.globalAlpha = o.alpha;
  if (lv > 0) { c.shadowColor = SHADE + (o.sa ?? .3) + ')'; c.shadowBlur = 2 + lv * 5; c.shadowOffsetX = lv; c.shadowOffsetY = 1 + lv * 3; }
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = o.cap || 'round'; c.lineJoin = 'round';
  c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); if (o.close) c.closePath(); c.stroke(); c.restore();
}
// catenary sag between two points (power lines)
function sag(a, b, d, n = 16) { const out = []; for (let i = 0; i <= n; i++) { const k = i / n; out.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k) + d * 4 * k * (1 - k)]); } return out; }
// point at fraction k along a polyline
function along(P, k) {
  const L = []; let tot = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(d); tot += d; }
  let s = clamp(k) * tot; for (let i = 0; i < L.length; i++) { if (s <= L[i] || i === L.length - 1) { const u = L[i] ? clamp(s / L[i]) : 0; return [lerp(P[i][0], P[i + 1][0], u), lerp(P[i][1], P[i + 1][1], u)]; } s -= L[i]; }
  return P[P.length - 1];
}
// energy pulses travelling along a polyline: n bright dots, speed in path-lengths per second
function pulses(P, t, n = 3, speed = .5, col = '#FFE27A', r = 10, a = 1) {
  if (a <= 0) return;
  for (let i = 0; i < n; i++) { const k = frac(t * speed + i / n), [x, y] = along(P, k), e = Math.sin(k * Math.PI);
    shine(x, y, r * 3.2, col, .55 * a * e); cut(Pc(x, y, r * .45), '#FFFBEA', 0, { tex: 0, alpha: a * e }); }
}

// ---------- text ----------
// Cut-paper lettering: the letters as paper (shadow + fibres), optional backing card. o: weight, align, alpha, rot,
// pop (0..1 scale-in), lv (shadow), card (colour of a backing strip), spacing.
function ptext(txt, x, y, size, col, o = {}) {
  const c = PX, k = o.pop != null ? backOut(o.pop) : 1; if (k <= .01 || (o.alpha ?? 1) <= 0) return 0;
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(k, k); c.globalAlpha = clamp(o.alpha ?? 1);
  c.font = `${o.weight || 600} ${size}px ${FONT}`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
  if (o.spacing) c.letterSpacing = o.spacing + 'px';
  const w = c.measureText(txt).width;
  if (o.card) {
    const px = size * .42, ax = o.align === 'left' ? -px : o.align === 'right' ? -w - px : -w / 2 - px;
    c.shadowColor = SHADE + '.35)'; c.shadowBlur = 16; c.shadowOffsetX = 3; c.shadowOffsetY = 8;
    c.fillStyle = o.card; const p = Pr(ax, -size * .78, w + 2 * px, size * 1.5, size * .2); c.fill(p);
    c.shadowColor = 'transparent'; c.globalCompositeOperation = 'multiply'; c.globalAlpha *= .7; c.fillStyle = FIBER; c.fill(p);
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = clamp(o.alpha ?? 1);
  }
  const lv = o.lv ?? 2;
  if (lv > 0) { c.shadowColor = SHADE + '.4)'; c.shadowBlur = 3 + lv * 5; c.shadowOffsetX = lv * 1.2; c.shadowOffsetY = 1 + lv * 3; }
  c.fillStyle = col; c.fillText(txt, 0, size * .06);
  c.restore();
  return w * k;
}
function measure(txt, size, weight = 600) { PX.save(); PX.font = `${weight} ${size}px ${FONT}`; const w = PX.measureText(txt).width; PX.restore(); return w; }
// a small paper label, e.g. the source of a number or "สถานการณ์สมมติ"
function tag(txt, x, y, o = {}) {
  ptext(txt, x, y, o.size || 30, o.col || '#3A2E2A', { card: o.card || '#F7F0E2', weight: o.weight || 500, lv: 0, align: o.align, pop: o.pop, alpha: o.alpha, rot: o.rot });
}
