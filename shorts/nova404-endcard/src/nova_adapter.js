// nova_adapter.js: lets the NOVA 404 brand kit (brand_identity/templates/nova_brand.js, written for src/shorts/paper.js)
// run unchanged on this engine. It provides paper.js's names (PX, Pp/Pr/Pc/Pe/Pu, SHADE, FIBER, shine, hexRGB) and a cut()
// that takes paper.js's signature cut(path, col, lv, o) when its third argument is a number, so the brand's paper
// heights (lv 0–4), warm shadows and fibre texture come out as specified.
Object.defineProperty(window, 'PX', { get: () => X });
const Pp = pts => { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); return p; };
const Pr = (x, y, w, h, r = 0) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };
const Pc = (x, y, r) => { const p = new Path2D(); p.arc(x, y, Math.max(.1, r), 0, TAU); return p; };
const Pe = (x, y, rx, ry, rot = 0) => { const p = new Path2D(); p.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); return p; };
const Pu = (...ps) => { const p = new Path2D(); ps.forEach(q => p.addPath(q)); return p; };
const SHADE = 'rgba(38,24,14,';
const hexRGB = h => { const v = parseInt(h.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
Object.defineProperty(window, 'FIBER', { get: () => patFor(X) });
function brandCut(path, col, lv = 1, o = {}) {      // a port of paper.js cut()
  const c = X, base = c.globalAlpha, al = base * (o.alpha ?? 1);
  c.save(); c.globalAlpha = al;
  if (lv > 0) { c.shadowColor = SHADE + (o.sa ?? .34) + ')'; c.shadowBlur = 3 + lv * 7; c.shadowOffsetX = lv * 1.5; c.shadowOffsetY = 1.5 + lv * 4; }
  c.fillStyle = col; c.fill(path, o.rule || 'nonzero');
  c.shadowColor = 'transparent';
  if (o.tex !== 0) { c.globalCompositeOperation = 'multiply'; c.globalAlpha = al * (o.tex ?? .7) * .8; c.fillStyle = FIBER; c.fill(path, o.rule || 'nonzero'); }
  c.restore();
}
const engineCut = cut;
cut = function (path, col, a, o) { return typeof a === 'number' ? brandCut(path, col, a, o) : engineCut(path, col, a); };
function shine(x, y, r, col = '#FFE08A', a = 1) {
  if (a <= 0 || r <= 1) return;
  const c = X, g = c.createRadialGradient(x, y, 0, x, y, r), [R, G, B] = hexRGB(col);
  g.addColorStop(0, `rgba(${R},${G},${B},${.9 * a})`); g.addColorStop(.25, `rgba(${R},${G},${B},${.45 * a})`); g.addColorStop(1, `rgba(${R},${G},${B},0)`);
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
}
