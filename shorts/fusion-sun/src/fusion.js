// fusion.js: the Sun, nuclei, a tokamak, a laser target, a power plant and grid, desalination, caveat cards.
const F = {
  space0: '#0B0D2A', space1: '#1B1546', sun0: '#FFF3B0', sun1: '#FFD25A', sun2: '#FF9A3C', sun3: '#E8552E', corona: '#FFB347',
  proton: '#F2665A', neutron: '#9AB0CC', plasma: '#FF5FB8', plasmaLt: '#FFD0F0', field: '#7FE7FF', steel: '#8F9BB3', steelDk: '#5E6A86',
  coil: '#D9A441', city0: '#1D2A4A', city1: '#2B3A66', win: '#FFD97A', sea: '#2F7FBF', seaLt: '#5FA8DE', fresh: '#9FE0FF', grid: '#FFE08A'
};
// ---------- the Sun ----------
// o.cut 0..1 opens a wedge showing the layers (core, radiative zone, convective zone); o.glow
function sunBall(R, t, o = {}) {
  glow(0, 0, R * 2.2, F.corona, o.glow ?? .7);
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU + t * .05, L = R * (1.12 + .1 * Math.sin(t * 1.3 + i * 1.7) + .06 * hash(i)); at(0, 0, 1, a, () => cut(poly([[R * .9, -R * .09], [L, 0], [R * .9, R * .09]]), i % 2 ? F.corona : F.sun2, { z: .8, sa: .3 })); }
  cut(circ(0, 0, R, 11, .005), F.sun2, { z: 2.6, sa: .5 });
  cut(circ(-R * .06, -R * .06, R * .9, 12), F.sun1, { z: .8, rim: false, sa: .2 });
  X.save(); X.clip(circ(0, 0, R, 11, .005));
  for (let i = 0; i < 26; i++) { const a = hash(i * 3.1) * TAU, r = R * Math.sqrt(hash(i * 7.3)) * .9; cut(blob(Math.cos(a) * r, Math.sin(a) * r, R * (.05 + .05 * hash(i)), 300 + i, .4, 7), rgba(F.sun2, .55), { z: .3, rim: false }); }
  X.restore();
  const k = o.cut || 0;
  if (k > 0) { // a wedge cut toward the viewer: layers inside
    const a0 = -Math.PI * .5 - .9 * k, a1 = -Math.PI * .5 + .9 * k, wedge = r => { const p = new Path2D(); p.moveTo(0, 0); p.arc(0, 0, r, a0, a1); p.closePath(); return p; };
    cut(wedge(R * .99), F.sun3, { z: 1.6 }); cut(wedge(R * .7), F.sun2, { z: 1.4 }); cut(wedge(R * .28), F.sun0, { z: 1.2 }); glow(0, -R * .14, R * .35, '#FFFFFF', .6 * k);
  }
}
// ---------- nuclei ----------
function ball(x, y, r, col, sym) { cut(circ(x, y, r, Math.round(x * 3 + y)), col, { z: 1.1, sa: .35 }); cut(circ(x - r * .3, y - r * .3, r * .35, 2), rgba('#FFFFFF', .35), { z: 0, rim: false, grain: 0 }); if (sym) txt(sym, x, y + 1, r * 1.1, C.cream, { weight: 800, sa: 0 }); }
// a nucleus from p protons and n neutrons, packed in a small cluster
function nucleus(p, n, r = 18, seed = 1) {   // counts are exact: (i*7+seed) mod N is a permutation when gcd(7, N) = 1
  const N = p + n, items = []; for (let i = 0; i < N; i++) items.push(i < p ? 'p' : 'n');
  items.sort((a, b) => hash(seed * 13 + a.charCodeAt(0) + items.length) - .5);
  for (let i = 0; i < N; i++) { const a = i * 2.4 + seed, rr = r * 1.05 * Math.sqrt(i); const x = Math.cos(a) * rr, y = Math.sin(a) * rr; const pr = (i * 7 + seed) % N < p; ball(x, y, r, pr ? F.proton : F.neutron, pr && r > 14 ? '+' : null); }
}
function flash(x, y, k, r = 220) { if (k <= 0 || k >= 1) return; const a = Math.sin(Math.PI * k); glow(x, y, r * (.5 + k), '#FFF6C8', .9 * a); for (let i = 0; i < 10; i++) at(x, y, 1, i * TAU / 10 + k, () => cut(poly([[r * .15, -6], [r * (.35 + .5 * k), 0], [r * .15, 6]]), rgba('#FFF3B0', .9 * a), { z: 0, rim: false, grain: 0 })); }
// ---------- tokamak (cutaway, seen from a 3/4 angle) ----------
// o.heat 0..1 (plasma colour from dull red to violet-white), o.mag 0..1 (coils lit, field lines spiralling)
function tokamak(t, o = {}) {
  const RX = 330, RY = 120, heat = o.heat ?? 1, mag = o.mag ?? 1;
  const ringPath = (rx, ry, w) => { const p = new Path2D(); p.ellipse(0, 0, rx + w, ry + w * .45, 0, 0, TAU); p.ellipse(0, 0, Math.max(10, rx - w), Math.max(4, ry - w * .45), 0, 0, TAU); return p; };
  // base and back half of the vessel
  cut(ell(0, 230, 470, 90, 0, 3), F.steelDk, { z: 2.4 });
  cut(ringPath(RX, RY, 120), F.steel, { z: 2.2, rule: 'evenodd' });
  // D-shaped field coils around the ring (back ones first)
  // D-shaped toroidal-field coils: each is a loop wrapped around the vessel tube at azimuth a. Its plane holds the
  // vertical axis and the radial direction, so it is edge-on at the front/back and fully open at the sides.
  const coils = 16, coil = (i, front) => { const a = i / coils * TAU + .1, cx = Math.cos(a) * RX, cy = Math.sin(a) * RY, isFront = Math.sin(a) > 0; if (isFront !== front) return;
    const ru = [Math.cos(a), Math.sin(a) * RY / RX], P = [];
    const Dpts = [[-70, -150], [-70, 150]]; for (let k = 0; k <= 16; k++) { const th = Math.PI / 2 - k / 16 * Math.PI; Dpts.push([-70 + 175 * Math.cos(th), 150 * Math.sin(th)]); }
    for (const [u, v] of Dpts) P.push([cx + u * ru[0], cy + u * ru[1] + v * .95]);
    P.push(P[0]); cut(strip(P, 15, 15), mix(F.coil, '#FFF0B8', .5 * mag * (.5 + .5 * Math.sin(t * 4 + i))), { z: front ? 1.6 : .8, sa: front ? .45 : .25, alpha: front ? 1 : .85 }); };
  for (let i = 0; i < coils; i++) coil(i, false);
  // central solenoid
  cut(rrect(-50, -230, 100, 420, 30), F.steelDk, { z: 2 }); for (let k = 0; k < 6; k++) cut(rrect(-50, -210 + k * 66, 100, 26, 10), mix(F.coil, '#FFF0B8', .4 * mag), { z: .6 });
  // the plasma ring: a glowing band, its colour following the heat
  const pc = mix('#C8503C', F.plasma, heat), pl = mix('#FF9A7A', F.plasmaLt, heat);
  glow(0, 0, RX * 1.25, pc, .35 + .35 * heat);
  cut(ringPath(RX, RY, 44), pc, { z: .6, rim: false, rule: 'evenodd', alpha: .95 });
  cut(ringPath(RX, RY, 18), pl, { z: 0, rim: false, rule: 'evenodd', alpha: .8 });
  // magnetic field lines: a helix winding round the plasma, drifting with time
  if (mag > 0) for (let h = 0; h < 3; h++) { const P = []; for (let s = 0; s <= 140; s++) { const u = s / 140 * TAU, v = u * 9 + t * 2 + h * 2.1; P.push([Math.cos(u) * (RX + 52 * Math.cos(v)), Math.sin(u) * (RY + 24 * Math.cos(v)) - 30 * Math.sin(v)]); } for (let s = 0; s < P.length - 1; s += 2) { const front = Math.sin(s / 140 * TAU) > 0; cut(strip([P[s], P[s + 1]], 4), rgba(F.field, (front ? .95 : .4) * mag), { z: 0, rim: false, grain: 0 }); } }
  // front coils and the cut-away front rim of the vessel
  for (let i = 0; i < coils; i++) coil(i, true);
  const front = new Path2D(); front.ellipse(0, 0, RX + 120, RY + 54, 0, .15, Math.PI - .15); front.ellipse(0, 0, RX + 70, RY + 30, 0, Math.PI - .15, .15, true); cut(front, F.steelDk, { z: 2.6 });
}
// a stellarator, small: a twisted ring
function stellarator(t, s = 1) { at(0, 0, s, 0, () => { const P = []; for (let k = 0; k <= 120; k++) { const u = k / 120 * TAU, w = 40 + 18 * Math.sin(5 * u + t); P.push([Math.cos(u) * (150 + 20 * Math.cos(5 * u)), Math.sin(u) * (60 + 12 * Math.sin(5 * u))]); } cut(strip(P, 30, 30), F.plasma, { z: 1.2 }); cut(strip(P, 10, 10), F.plasmaLt, { z: 0, rim: false }); }); }
// laser target chamber (NIF-like, simplified): beams converge on a tiny capsule
function laserShot(t, k, out) {
  cut(circ(0, 0, 260, 21), F.steelDk, { z: 2.4 }); cut(circ(0, 0, 230, 22), '#121633', { z: .6, rim: false });
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU, r0 = 600, r1 = lerp(600, 24, ease(k)); if (k > 0) cut(strip([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r1, Math.sin(a) * r1]], 10, 6), rgba('#7FC8FF', .85), { z: .4, rim: false, grain: 0 }); }
  cut(rrect(-26, -16, 52, 32, 10), F.coil, { z: 1 }); cut(circ(0, 0, 9, 3), '#FFFFFF', { z: .4 });
  flash(0, 0, out, 300);
}
function bar(x, y, w, h, col, label, val) { if (h <= 1) return; cut(rrect(x - w / 2, y - h, w, h, 12), col, { z: 1.4 }); if (label) txt(label, x, y + 44, 32, C.cream, { weight: 700, sa: 0 }); if (val) txt(val, x, y - h - 34, 40, C.cream, { weight: 800, sa: 0 }); }
// ---------- power plant, grid, city, water ----------
function plant(t, glowK = 1) {
  cut(rrect(-260, -150, 520, 150, 12), '#3B4A72', { z: 2.2 });
  const dome = new Path2D(); dome.moveTo(-170, -150); dome.quadraticCurveTo(-170, -360, 0, -370); dome.quadraticCurveTo(170, -360, 170, -150); dome.closePath(); cut(dome, '#5A6A96', { z: 2.4 });
  cut(ell(0, -250, 90, 34, 0, 3), mix('#3A2A5A', F.plasma, glowK), { z: .5 }); glow(0, -250, 200, F.plasma, .45 * glowK);
  for (let i = 0; i < 6; i++) cut(rrect(-230 + i * 80, -110, 40, 50, 6), F.win, { z: .3, rim: false });
}
function turbine(t, spin) { cut(rrect(-120, -110, 240, 110, 14), '#4A5A86', { z: 2 }); at(0, -55, 1, t * 8 * spin, () => { for (let i = 0; i < 6; i++) at(0, 0, 1, i * TAU / 6, () => cut(poly([[0, -6], [44, -14], [44, 14], [0, 6]]), '#BFD0EE', { z: .8 })); cut(circ(0, 0, 12, 3), '#2A3450', { z: .6 }); }); }
function pylon(h = 260) { const c = '#B8C2D8'; cut(strip([[-60, 0], [0, -h]], 10), c, { z: 1 }); cut(strip([[60, 0], [0, -h]], 10), c, { z: 1 }); for (let k = 1; k < 4; k++) cut(rrect(-60 + k * 12, -k * h / 4 - 4, 120 - k * 24, 8, 3), c, { z: 1 }); cut(rrect(-70, -h * .8, 140, 8, 3), c, { z: 1 }); }
function wire(P, t, k, live) { cut(strip(P, 4), '#9AA6C4', { z: .4, rim: false }); if (live > 0) for (let i = 0; i < 6; i++) { const u = ((t * .6 + i / 6) % 1), q = P[Math.floor(u * (P.length - 1))]; glow(q[0], q[1], 40, F.grid, .9 * live); cut(circ(q[0], q[1], 7, i), F.grid, { z: .3, rim: false }); } }
function city(t, lit, w = 900, seed = 5) { for (let i = 0; i < 14; i++) { const x = -w / 2 + i * w / 14, h = 160 + 260 * hash(i * 2.7 + seed); cut(rrect(x, -h, w / 14 - 10, h, 6), i % 2 ? F.city0 : F.city1, { z: 1.6 }); for (let r = 0; r < Math.floor(h / 48); r++) for (let c2 = 0; c2 < 2; c2++) { const on = hash(i * 31 + r * 7 + c2) < lit; if (on) cut(rrect(x + 10 + c2 * 26, -h + 18 + r * 48, 16, 22, 3), F.win, { z: 0, rim: false }); } } if (lit > 0) glow(0, -200, w * .7, F.win, .25 * lit); }
function waves(t, y, w, col) { const P = [[-w, 2000]]; for (let k = 0; k <= 30; k++) { const x = -w + k * 2 * w / 30; P.push([x, y + 14 * Math.sin(k * .9 + t * 2)]); } P.push([w, 2000]); cut(poly(P), col, { z: 1.4 }); }
function hazard(r) { cut(circ(0, 0, r, 3), '#F6C445', { z: 1.2 }); for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * TAU / 3, p = new Path2D(); p.moveTo(0, 0); p.arc(0, 0, r * .8, a - .5, a + .5); p.closePath(); cut(p, '#2A2236', { z: 0, rim: false }); } cut(circ(0, 0, r * .22, 4), '#F6C445', { z: 0, rim: false }); cut(circ(0, 0, r * .14, 5), '#2A2236', { z: 0, rim: false }); }
