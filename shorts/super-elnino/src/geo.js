// geo.js: the Pacific in cut paper. Continents are simplified outlines in real longitude/latitude (degrees, east +),
// drawn either on a globe (orthographic) or on a Pacific-centred map (equirectangular). One dataset, two projections.
const G = {
  space0: '#0B1030', space1: '#1A1F52', ocean: '#2D6FB0', oceanLt: '#4A8DCB', oceanDk: '#1E5590', land: '#9CC07A', landDk: '#7AA35E',
  desert: '#D9B978', ice: '#EEF3F8', warm1: '#FFD36B', warm2: '#F59A3C', warm3: '#E0503C', cold: '#7FD0F0', atmo: '#8FD3FF',
  wind: '#F4F7FF', cloud: '#F2F4FA', rain: '#8FC8F0', sun: '#FFC93F', crack: '#B98A52'
};
const LANDS_GEO = {
  namerica: [[-168, 66], [-162, 60], [-152, 58], [-136, 58], [-130, 54], [-124, 48], [-124, 40], [-118, 34], [-117, 32], [-112, 29], [-110, 23], [-105, 20], [-97, 16], [-92, 15], [-87, 13], [-83, 9], [-79, 8], [-77, 9], [-80, 10], [-84, 15], [-88, 16], [-87, 21], [-91, 19], [-97, 22], [-97, 27], [-93, 29], [-89, 30], [-84, 30], [-82, 26], [-80, 25], [-81, 31], [-76, 35], [-70, 42], [-66, 45], [-60, 47], [-56, 52], [-62, 58], [-78, 62], [-90, 68], [-110, 70], [-130, 70], [-150, 71], [-165, 69]],
  samerica: [[-77, 8], [-80, 1], [-81, -4], [-79, -8], [-76, -14], [-71, -18], [-70, -24], [-72, -32], [-74, -40], [-74, -50], [-68, -55], [-65, -55], [-67, -46], [-62, -39], [-57, -37], [-53, -34], [-48, -26], [-41, -22], [-39, -15], [-35, -8], [-35, -5], [-44, -2], [-50, 0], [-52, 4], [-60, 8], [-62, 10], [-71, 12], [-75, 11]],
  asia: [[100, 13], [103, 10], [105, 9], [109, 12], [109, 16], [107, 21], [111, 21], [117, 23], [121, 29], [122, 31], [120, 35], [121, 40], [125, 40], [127, 39], [129, 35], [130, 43], [135, 44], [140, 48], [141, 52], [143, 60], [160, 61], [170, 65], [180, 66], [180, 76], [60, 76], [60, 10], [78, 8], [80, 15], [87, 22], [92, 21], [94, 16], [98, 16], [99, 8], [100, 3], [103, 1], [104, 2], [102, 6], [100, 8]],
  japan: [[130, 31], [132, 34], [135, 34], [140, 35], [141, 39], [142, 43], [145, 44], [141, 45], [139, 40], [137, 37], [133, 35], [130, 34]],
  borneo: [[109, 1], [111, -3], [116, -4], [118, 1], [119, 5], [117, 7], [115, 5], [111, 2]],
  sumatra: [[95, 5], [98, 4], [104, -2], [106, -6], [102, -4], [98, 0]],
  java: [[105, -6], [110, -7], [114, -7], [114, -8.5], [106, -7]],
  sulawesi: [[119, 1], [124, 1], [121, -2], [122, -5], [120, -5]],
  philippines: [[120, 18], [122, 18], [124, 13], [126, 7], [125, 6], [122, 8], [121, 13]],
  newguinea: [[131, -1], [135, -3], [141, -3], [146, -6], [150, -10], [143, -9], [138, -8], [133, -4]],
  australia: [[114, -22], [114, -26], [115, -34], [118, -35], [123, -34], [129, -32], [135, -35], [138, -35], [140, -38], [146, -39], [150, -37], [153, -32], [153, -25], [150, -22], [146, -19], [145, -15], [142, -11], [141, -17], [136, -15], [137, -12], [132, -11], [130, -13], [126, -14], [122, -18]],
  nzN: [[172, -34], [175, -37], [178, -38], [176, -41], [174, -41]], nzS: [[172, -41], [174, -42], [171, -45], [167, -46], [168, -44]],
  africa: [[-17, 15], [-5, 36], [10, 37], [32, 31], [43, 12], [51, 12], [40, -15], [35, -25], [20, -35], [12, -18], [9, 4], [-8, 4]],
  europe: [[-10, 36], [-9, 44], [-2, 48], [-5, 58], [5, 62], [20, 70], [40, 68], [60, 70], [60, 45], [40, 41], [26, 40], [20, 38], [12, 44], [3, 43]],
  greenland: [[-55, 60], [-44, 60], [-22, 70], [-20, 82], [-60, 82], [-70, 77]],
  antarctica: [[-180, -70], [-120, -73], [-60, -64], [0, -70], [60, -67], [120, -66], [180, -70], [180, -90], [-180, -90]]
};
const lon360 = lon => (lon % 360 + 360) % 360;
// ---------- map (equirectangular, Pacific-centred) ----------
const MAP = { lonC: 195, k: 5.26 };              // centre longitude; px per degree (matches a globe of radius 301 at its centre)
const mapXY = (lon, lat) => { let d = lon360(lon) - MAP.lonC; if (d > 180) d -= 360; if (d < -180) d += 360; return [d * MAP.k, -lat * MAP.k]; };
function mapPoly(P) { const Q = []; let prev = null; for (const [lo, la] of P) { let [x, y] = mapXY(lo, la); if (prev && Math.abs(x - prev[0]) > 900) x += x < prev[0] ? 360 * MAP.k : -360 * MAP.k; Q.push([x, y]); prev = [x, y]; } return Q; }
function mapLand(o = {}) {
  for (const [name, P] of Object.entries(LANDS_GEO)) { if (name === 'antarctica') continue; const Q = mapPoly(P); cut(poly(Q), name === 'australia' ? mix(G.land, G.desert, .5) : G.land, { z: 1.6, sa: .45 }); }
}
function mapOcean(t, o = {}) {
  X.fillStyle = G.ocean; X.fillRect(-2200, -1400, 4400, 2800);
  // gentle moving swell lines
  for (let i = 0; i < 14; i++) { const y = -560 + i * 80, x0 = ((t * 14 + i * 97) % 300) - 1300; for (let k = 0; k < 9; k++) cut(rrect(x0 + k * 300, y + 10 * Math.sin(k + i), 120, 5, 3), rgba(G.oceanLt, .35), { z: 0, rim: false, grain: 0 }); }
}
// the sea-surface temperature anomaly as nested paper contours along the equator: k 0..1 grows it
function sstTongue(k, t) {
  if (k <= 0) return;
  const bands = [[155, 283, 11, G.warm1], [172, 281, 7, G.warm2], [190, 272, 3.8, G.warm3]];
  bands.forEach(([w, e, hw], i) => {
    const kk = ease(seg(k, i * .22, .5 + i * .22)); if (kk <= 0) return;
    const ee = lerp(e - 20, e, kk), ww = lerp((w + e) / 2 + 20, w, kk), T = [], Bm = [];
    for (let s = 0; s <= 24; s++) { const lo = lerp(ww, ee, s / 24), h = hw * kk * (.55 + .45 * Math.sin(Math.PI * Math.min(1, s / 24 * 1.15))) * (1 + .06 * Math.sin(t * 1.5 + s)); T.push(mapXY(lo, h)); Bm.push(mapXY(lo, -h * 1.1)); }
    cut(smooth([...T, ...Bm.reverse()]), bands[i][3], { z: .8 + i * .4, sa: .35 });
  });
}
// the normal state: the warm pool in the west and the cool tongue in the east
function normalSST(a) { if (a <= 0) return; X.save(); X.globalAlpha *= a; cut(smooth([mapXY(125, 14), mapXY(165, 12), mapXY(178, 4), mapXY(165, -8), mapXY(140, -14), mapXY(122, -4)]), G.warm2, { z: .6, alpha: .85 }); cut(smooth([mapXY(285, 2), mapXY(230, 3), mapXY(185, 1), mapXY(230, -4), mapXY(282, -8)]), rgba(G.cold, .55), { z: .6 }); X.restore(); }
function equatorLine(a = 1) { if (a <= 0) return; for (let i = -40; i < 40; i++) cut(rrect(i * 26, -2, 14, 4, 2), rgba('#FFFFFF', .55 * a), { z: 0, rim: false, grain: 0 }); }
// ---------- globe (orthographic) ----------
function globePoly(P, R, L0, B0) {
  const Q = []; let vis = false;
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6));
    for (let s = 0; s < n; s++) { const lo = lerp(a[0], b[0], s / n), la = lerp(a[1], b[1], s / n); let [x, y, z] = sph(lo, la, L0, B0); if (z > .02) vis = true; else { const d = Math.hypot(x, y) || 1; x /= d; y /= d; } Q.push([x * R, -y * R]); } }
  return vis ? Q : null;
}
function globe(t, R, L0, B0 = 8, o = {}) {
  glow(0, 0, R * 1.35, G.atmo, o.atmo ?? .4);
  cut(circ(0, 0, R * 1.04, 41, .004), rgba(G.atmo, .35), { z: 0, rim: false, grain: 0 });
  cut(circ(0, 0, R, 42, .004), G.ocean, { z: 2.6, sa: .55 });
  X.save(); X.clip(circ(0, 0, R, 42, .004));
  cut(circ(-R * .1, -R * .1, R * .88, 43), G.oceanLt, { z: .4, rim: false, sa: .1, alpha: .5 });
  if (o.sst) { const ss = (lo, la) => { const [x, y, z] = sph(lo, la, L0, B0); return z > 0 ? [x * R, -y * R] : null; };
    [[155, 283, 11, G.warm1], [172, 281, 7, G.warm2], [190, 272, 3.8, G.warm3]].forEach(([w, e, hw, c], i) => { const T = [], Bm = []; for (let s = 0; s <= 20; s++) { const lo = lerp(w, e, s / 20), h = hw * (.55 + .45 * Math.sin(Math.PI * Math.min(1, s / 20 * 1.15))), p = ss(lo, h), q = ss(lo, -h * 1.1); if (p && q) { T.push(p); Bm.push(q); } } if (T.length > 2) cut(smooth([...T, ...Bm.reverse()]), c, { z: .5, alpha: o.sst }); }); }
  for (const [name, P] of Object.entries(LANDS_GEO)) { const Q = globePoly(P, R, L0, B0); if (Q) cut(poly(Q), name === 'antarctica' || name === 'greenland' ? G.ice : name === 'australia' ? mix(G.land, G.desert, .5) : G.land, { z: .9, sa: .35 }); }
  if (o.heat) { X.fillStyle = rgba('#FF7A3C', .28 * o.heat); X.fillRect(-R, -R, 2 * R, 2 * R); }
  // terminator shade for volume
  const v = new Path2D(); v.addPath(circ(0, 0, R * 1.02, 3)); v.addPath(circ(-R * .22, -R * .22, R * 1.08, 4)); cut(v, rgba('#0A1030', .35), { z: 0, rim: false, grain: 0, rule: 'evenodd' });
  X.restore();
}
// ---------- cross-section along the equator (Walker circulation) ----------
// k 0 = normal (trades strong, warm water piled in the west, upwelling in the east), 1 = El Niño
function crossSection(t, k, o = {}) {
  const up = o.upwell ?? 1 - k;
  // sky band, then the ocean slab
  X.fillStyle = '#6FA8DC'; X.fillRect(-700, -900, 1400, 900);
  cut(rrect(-700, -900, 1400, 900, 0), '#7FB6E4', { z: 0, rim: false, alpha: .4 });
  const thW = lerp(300, 200, k), thE = lerp(70, 170, k);                  // thermocline depth, west and east
  cut(rrect(-560, 0, 1120, 520, 0), '#1E3F8C', { z: 1.2 });               // cold deep water
  const surf = x => 6 * Math.sin(x / 60 + t * 2.4);
  const warmP = []; for (let i = 0; i <= 28; i++) { const x = -560 + i * 40; warmP.push([x, surf(x)]); } for (let i = 28; i >= 0; i--) { const x = -560 + i * 40, u = i / 28; warmP.push([x, lerp(thW, thE, u) + 10 * Math.sin(u * 7 + t)]); }
  cut(poly(warmP), G.warm2, { z: 1.4 });
  const hotP = []; const hotE = lerp(-120, 280, k); for (let i = 0; i <= 20; i++) { const x = lerp(-560, hotE, i / 20); hotP.push([x, surf(x)]); } for (let i = 20; i >= 0; i--) { const u = i / 20, x = lerp(-560, hotE, u); hotP.push([x, lerp(thW * .6, 30, u)]); }
  cut(poly(hotP), G.warm3, { z: .8, alpha: .85 });
  // upwelling of cold water off South America (east)
  for (let i = 0; i < 3; i++) { const x = 360 + i * 50, a = up * (.5 + .5 * Math.sin(t * 3 + i)); if (up > .05) { cut(strip([[x, 360], [x - 10, 200], [x, 40]], 26 * up, 8 * up), rgba(G.cold, .85 * up), { z: .8 }); cut(poly([[x - 22 * up, 60], [x, 20], [x + 22 * up, 60]]), rgba(G.cold, up), { z: .8 }); } }
  // land on both sides: Indonesia/Australia (west), South America with the Andes (east)
  cut(poly([[-700, -40], [-600, -70], [-560, -30], [-560, 600], [-700, 600]]), G.landDk, { z: 2.2 });
  cut(poly([[700, -260], [640, -320], [590, -200], [560, -40], [560, 600], [700, 600]]), G.landDk, { z: 2.2 });
  cut(poly([[640, -320], [610, -270], [650, -260]]), G.ice, { z: .6 });
  // the atmosphere: rising air and rain clouds over the warmest water, sinking air over the cool east
  const cx = lerp(-360, 60, k);
  for (let i = 0; i < 3; i++) at(cx + (i - 1) * 110, -360 - 30 * (i % 2), 1, 0, () => { const p = new Path2D(); p.addPath(blob(0, 0, 60, 300 + i, .25, 8, 1.6, .8)); p.addPath(blob(-40, -24, 44, 310 + i, .25)); cut(p, G.cloud, { z: 1.6 }); });
  for (let i = 0; i < 10; i++) { const x = cx - 170 + i * 36, y = -300 + ((t * 300 + i * 53) % 260); cut(rrect(x, y, 5, 28, 3), rgba(G.rain, .85), { z: 0, rim: false }); }
  // trade winds at the surface, blowing west (to the left); they weaken in El Niño
  const tw = 1 - .7 * k;
  for (let i = 0; i < 5; i++) { const x = 380 - i * 170 - ((t * 120 * tw) % 170), L = 110 * tw; if (L > 8) { cut(strip([[x + L, -60], [x, -60]], 12, 12), G.wind, { z: 1.2 }); cut(poly([[x - 26, -60], [x + 4, -80], [x + 4, -40]]), G.wind, { z: 1.2 }); } }
}
// ---------- small icons for impacts ----------
function droughtIcon(s, t) { at(0, 0, s, 0, () => { glow(30, -70, 120, '#FFB347', .5); cut(circ(30, -70, 40, 1), G.sun, { z: 1.2 }); cut(rrect(-90, 0, 180, 60, 14), G.crack, { z: 1.4 }); for (let i = 0; i < 4; i++) cut(strip([[-70 + i * 46, 6], [-60 + i * 46, 30], [-74 + i * 46, 54]], 4, 3), '#7A5530', { z: 0, rim: false }); }); }
function rainIcon(s, t) { at(0, 0, s, 0, () => { const p = new Path2D(); p.addPath(blob(0, -60, 60, 7, .2, 8, 1.6, .8)); p.addPath(blob(-40, -84, 42, 8, .2)); p.addPath(blob(30, -90, 48, 9, .2)); cut(p, '#C9D3E8', { z: 1.4 }); for (let i = 0; i < 6; i++) { const y = ((t * 220 + i * 37) % 90); cut(rrect(-70 + i * 26, -20 + y, 5, 24, 3), G.rain, { z: 0, rim: false }); } cut(ell(0, 74, 90, 14, 0, 9), rgba(G.rain, .8), { z: .6 }); }); }
function heatIcon(s, t) { at(0, 0, s, 0, () => { cut(rrect(-14, -90, 28, 130, 14), C.cream, { z: 1.4 }); cut(circ(0, 52, 28, 3), G.warm3, { z: 1.4 }); cut(rrect(-7, -60 + 20 * Math.sin(t * 2) * 0, 14, 110, 7), G.warm3, { z: 0, rim: false }); for (let i = 0; i < 3; i++) cut(strip([[44 + i * 22, 30], [52 + i * 22, 0], [44 + i * 22, -30]], 5, 5), rgba(G.warm2, .8), { z: 0, rim: false }); }); }
function satellite(t) { cut(rrect(-26, -20, 52, 40, 6), '#D9DDE8', { z: 1.4 }); cut(rrect(-120, -14, 84, 28, 4), '#3B5BA8', { z: 1.2 }); cut(rrect(36, -14, 84, 28, 4), '#3B5BA8', { z: 1.2 }); for (let i = 0; i < 3; i++) { cut(rrect(-114 + i * 26, -10, 2, 20, 1), '#9FB8E8', { z: 0, rim: false }); cut(rrect(42 + i * 26, -10, 2, 20, 1), '#9FB8E8', { z: 0, rim: false }); } cut(circ(0, 26, 10, 3), '#F2C94C', { z: .8 }); }
