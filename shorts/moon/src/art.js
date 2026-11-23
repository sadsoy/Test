// art.js: the cut-paper props. Each one draws around its own origin, inside whatever layer()/at() it is called in.
const C = {
  ink: '#241B33', cream: '#FFF6E4', paper: '#F4ECDC',
  night0: '#0F1433', night1: '#1A2152', night2: '#283273', night3: '#3D3F8C', night4: '#5A4E9C',
  hill0: '#20365A', hill1: '#1C4A5A', hill2: '#1E5C57', hill3: '#123A3C',
  moon: '#EFE6D0', moonLt: '#F9F3E4', mare: '#A8A6BE', mareDk: '#8F8CAA', crater: '#DCD1B9',
  hot: '#F28C4A', hotLt: '#FFC069', hotMare: '#A2312C',
  sea: '#3C7DC4', seaLt: '#5C9BD8', land: '#6FAF5B', sand: '#E3C07A', cloud: '#F4F2F8',
  sun: '#FFC93F', sunLt: '#FFE58A', sunDk: '#F59A2A', red: '#E2504A', gold: '#F6C445', teal: '#4FB3A9', rose: '#E9809A'
};

// ---------- sphere projection ----------
// lon/lat in degrees; L0 = longitude facing the viewer (spin), B0 = tilt toward the viewer (libration in latitude).
const DEG = Math.PI / 180;
function sph(lon, lat, L0 = 0, B0 = 0) {
  const dl = (lon - L0) * DEG, la = lat * DEG, x = Math.cos(la) * Math.sin(dl), y0 = Math.sin(la), z0 = Math.cos(la) * Math.cos(dl);
  const b = B0 * DEG; return [x, y0 * Math.cos(b) - z0 * Math.sin(b), y0 * Math.sin(b) + z0 * Math.cos(b)];
}
// outline of a patch on the sphere, projected; points behind the limb are pushed onto it. null if hidden.
function patch(f, R, L0, B0) {
  const n = 18, P = []; let vis = false;
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU, w = 1 + (f.w ?? .18) * (hash(f.seed * 7.7 + i * 2.9) * 2 - 1);
    const lat = f.lat + f.r * (f.sy || 1) * Math.sin(a) * w, lon = f.lon + f.r * (f.sx || 1) * Math.cos(a) * w / Math.max(.3, Math.cos(f.lat * DEG));
    let [x, y, z] = sph(lon, lat, L0, B0);
    if (z > .02) vis = true; else { const d = Math.hypot(x, y) || 1; x /= d; y /= d; }
    P.push([x * R, -y * R]);
  }
  return vis ? P : null;
}
// the real maria of the near side (approximate centres and sizes) and a few far-side ones
const MARIA = [
  { lon: -57, lat: 18, r: 22, sx: .8, sy: 1.25, seed: 1 },  // Oceanus Procellarum
  { lon: -16, lat: 33, r: 15, seed: 2 },                     // Imbrium
  { lon: 17, lat: 28, r: 9, seed: 3 },                       // Serenitatis
  { lon: 31, lat: 8, r: 10, sx: 1.1, seed: 4 },              // Tranquillitatis
  { lon: 59, lat: 17, r: 6, sx: .9, seed: 5 },               // Crisium
  { lon: 51, lat: -8, r: 8, sy: 1.3, seed: 6 },              // Fecunditatis
  { lon: 35, lat: -15, r: 6, seed: 7 },                      // Nectaris
  { lon: -17, lat: -21, r: 9, seed: 8 },                     // Nubium
  { lon: -39, lat: -24, r: 5, seed: 9 },                     // Humorum
  { lon: 5, lat: 55, r: 5, sx: 3.2, sy: .8, seed: 10 },      // Frigoris
  { lon: 2, lat: 10, r: 6, seed: 11 },                       // Vaporum / Sinus Medii
  { lon: -28, lat: 4, r: 7, seed: 12 },                      // Insularum
  { lon: 147, lat: 27, r: 5, seed: 13 },                     // Moscoviense (far side)
  { lon: 163, lat: -34, r: 4, seed: 14 },                    // Ingenii (far side)
];
// craters: a few named near-side ones and a seeded field that is denser on the far side
const CRATERS = [{ lon: -11, lat: -43, r: 3.2 }, { lon: -20, lat: 10, r: 3 }, { lon: -38, lat: 8, r: 2.2 }, { lon: 60, lat: -40, r: 3 }, { lon: -50, lat: -48, r: 2.6 }];
for (let i = 0; i < 46; i++) { const lon = -180 + 360 * hash(i * 3.1 + 1), lat = -75 + 150 * hash(i * 5.7 + 2), far = Math.cos(lon * DEG) < 0; if (!far && hash(i * 9.2) < .6) continue; CRATERS.push({ lon, lat, r: 2 + 4.5 * hash(i * 1.9) }); }

// The moon as a sphere: o.L0 spin (deg), o.B0 tilt, o.hot 0..1 young molten moon, o.phase = sun angle from the viewer
// (0 full, 180 new; o.sunSide -1 = sun on the left), o.rabbit 0..1 golden rabbit glow over the maria.
function moonSphere(R, o = {}) {
  const L0 = o.L0 || 0, B0 = o.B0 || 0, hot = o.hot || 0;
  cut(circ(0, 0, R, 3, .006), mix(C.moon, C.hot, hot), { z: o.z ?? 2.4, sa: .5 });
  X.save(); X.clip(circ(0, 0, R, 3, .006));
  cut(circ(-R * .06, -R * .07, R * .9, 5, .01), mix(C.moonLt, C.hotLt, hot), { z: .6, sa: .18, rim: false, grain: .7 });
  for (const f of MARIA) { const P = patch(f, R, L0, B0); if (P) cut(smooth(P), mix(C.mare, C.hotMare, hot), { z: .7, sa: .3, rimA: .25 }); }
  for (const c of CRATERS) {
    const [x, y, z] = sph(c.lon, c.lat, L0, B0); if (z < .12) continue;
    const r = c.r * DEG * R, k = Math.max(.25, z);
    at(x * R, -y * R, 1, Math.atan2(-y, x), () => {
      cut(ell(0, 0, r * k, r, 0, c.lon), mix(C.crater, '#C9542E', hot), { z: .5, sa: .3 });
      cut(ell(r * .12 * k, r * .1, r * k * .62, r * .62, 0, c.lat), mix('#CFC3A8', '#B7402A', hot), { z: 0, rimA: .2 });
    });
  }
  if (o.rabbit > 0) rabbitGlow(R, o.rabbit, L0, B0);
  // the paper volume: a darker crescent layered over the lower right
  const v = new Path2D(); v.addPath(circ(0, 0, R * 1.02, 3)); v.addPath(circ(-R * .2, -R * .22, R * 1.06, 4));
  cut(v, rgba('#3A2D52', hot ? .18 : .2), { z: 0, rim: false, grain: 0, rule: 'evenodd' });
  if (o.phase != null) nightSide(R, o.phase, o.sunSide ?? -1, o.nightA ?? .82);
  X.restore();
  if (hot > 0) glow(0, 0, R * 1.5, '#FF8A3D', .35 * hot);
}
// the unlit part of a sphere lit from angle phase (deg from the viewer) on side s (-1 = sun on the left)
function nightSide(R, phase, s, a) {
  if (phase <= 1) return;
  const k = Math.cos(phase * DEG), d = -s, p = new Path2D(), n = 40;
  // the dark-side half of the limb, then back along the terminator (an ellipse of half-width R cos(phase))
  for (let i = 0; i <= n; i++) { const th = -Math.PI / 2 + i / n * Math.PI, x = d * Math.cos(th) * R, y = Math.sin(th) * R; i ? p.lineTo(x, y) : p.moveTo(x, y); }
  for (let i = n; i >= 0; i--) { const th = -Math.PI / 2 + i / n * Math.PI; p.lineTo(d * Math.cos(th) * R * k, Math.sin(th) * R); }
  p.closePath();
  cut(p, rgba('#16112E', a), { z: 0, rim: false, grain: .4 });
}
// the rabbit Thai children see in the maria: a warm glow over the near-side seas, and a soft golden cut-out outline
function rabbitGlow(R, a, L0 = 0, B0 = 0) {
  X.save(); X.globalAlpha *= a;
  const ids = [0, 1, 2, 3, 5, 6, 7, 8, 11];
  for (const i of ids) { const P = patch(MARIA[i], R, L0, B0); if (!P) continue; cut(smooth(P), rgba('#F2B53C', .78), { z: .4, rim: false, sa: .2 }); }
  X.globalAlpha *= .9; glow(-R * .1, -R * .1, R * 1.1, '#FFD36B', .5);
  X.restore();
}

// The moon seen from above (orbit diagrams): a paper disc that turns in the plane. Its near side (the rabbit face) is
// the edge at angle `face` (radians), marked with a rabbit sticker. o.hot 0..1, o.egg 0..1 tidal bulge along `bulge`.
function moonTop(R, face, o = {}) {
  const hot = o.hot || 0, egg = o.egg || 0;
  X.save();
  X.rotate(o.bulge ?? face); X.scale(1 + .22 * egg, 1 - .1 * egg); X.rotate(face - (o.bulge ?? face));
  cut(circ(0, 0, R, 8, .01), mix(C.moon, C.hot, hot), { z: o.z ?? 1.8 });
  X.save(); X.clip(circ(0, 0, R, 8, .01));
  const spots = [[-.35, -.3, .3], [.25, -.4, .22], [-.1, .35, .26], [.42, .2, .16], [-.55, .25, .13], [.05, -.02, .12]];
  spots.forEach(([x, y, r], i) => cut(blob(x * R, y * R, r * R, 40 + i, .3, 8), mix(C.mare, C.hotMare, hot), { z: .5, sa: .25 }));
  const v = new Path2D(); v.addPath(circ(0, 0, R * 1.02, 3)); v.addPath(circ(-R * .2, -R * .22, R * 1.06, 4));
  cut(v, rgba('#3A2D52', .2), { z: 0, rim: false, grain: 0, rule: 'evenodd' });
  X.restore();
  // the face marker: a small cream rabbit sticker on the near-side edge
  at(R * .5, 0, R / 190, Math.PI / 2, () => rabbitIcon(o.markCol || C.gold));
  X.restore();
  if (hot > 0) glow(0, 0, R * 1.8, '#FF8A3D', .4 * hot);
}
// a sitting rabbit, side view, about 100 px tall, origin at its middle
function rabbitIcon(col = C.cream, z = .8) {
  const p = new Path2D();
  p.addPath(ell(-6, 18, 34, 26, 0, 61));
  p.addPath(circ(26, -10, 19, 62));
  p.addPath(ell(22, -46, 7, 24, -.25, 63));
  p.addPath(ell(36, -44, 6.5, 22, .2, 64));
  p.addPath(circ(-40, 22, 9, 65));
  cut(p, col, { z, sa: .35 });
  cut(circ(32, -12, 3.2, 66), C.ink, { z: 0, rim: false });
}

// ---------- Earth ----------
const LANDS = [
  { lon: -100, lat: 45, r: 20, sx: 1.2, seed: 21 }, { lon: -60, lat: -15, r: 18, sx: .8, sy: 1.5, seed: 22 }, { lon: 20, lat: 5, r: 22, sx: .9, sy: 1.6, seed: 23 },
  { lon: 90, lat: 45, r: 28, sx: 1.5, seed: 24 }, { lon: 135, lat: -25, r: 12, seed: 25 }, { lon: 100, lat: 10, r: 8, seed: 26 }, { lon: -40, lat: 72, r: 9, seed: 27 }
];
function earth(R, spin = 0, o = {}) {
  glow(0, 0, R * 1.45, '#7FC4FF', o.atmo ?? .45);
  cut(circ(0, 0, R, 31, .006), o.sea || C.sea, { z: o.z ?? 2.2, sa: .5 });
  X.save(); X.clip(circ(0, 0, R, 31, .006));
  cut(circ(-R * .08, -R * .08, R * .86, 32), o.seaLt || C.seaLt, { z: .4, rim: false, sa: .15 });
  LANDS.forEach((f, i) => { const P = patch(f, R, spin, 12); if (P) cut(smooth(P), i % 3 === 2 ? C.sand : (o.land || C.land), { z: .6, sa: .3 }); });
  for (let i = 0; i < 5; i++) { const P = patch({ lon: i * 72 + 20, lat: -40 + 22 * i, r: 5, sx: 4, sy: .5, seed: 50 + i, w: .1 }, R, spin * 1.15, 12); if (P) cut(smooth(P), C.cloud, { z: .5, sa: .2, alpha: .85 }); }
  const v = new Path2D(); v.addPath(circ(0, 0, R * 1.02, 3)); v.addPath(circ(-R * .2, -R * .22, R * 1.06, 4));
  cut(v, rgba('#0E1640', .28), { z: 0, rim: false, grain: 0, rule: 'evenodd' });
  X.restore();
}

// ---------- sky, space, land ----------
function nightSky(t, pal = [C.night0, C.night1, C.night2, C.night3, C.night4]) {
  X.fillStyle = pal[0]; X.fillRect(-2000, -2400, 4000, 4800);
  for (let i = 1; i < pal.length; i++) {
    const y0 = -1100 + i * 330, P = [[-1400, 2600]];
    for (let k = 0; k <= 16; k++) { const x = -1400 + k * 175; P.push([x, y0 + Math.sin(k * .9 + i * 1.7) * 26 + Math.sin(k * 2.3 + i) * 10]); }
    P.push([1400, 2600]); cut(poly(P), pal[i], { z: 1.6, sa: .35, rimA: .12 });
  }
}
function stars(t, n = 60, area = [-700, -1150, 1400, 1500], seed = 1) {
  for (let i = 0; i < n; i++) {
    const x = area[0] + area[2] * hash(seed * 13 + i * 1.3), y = area[1] + area[3] * hash(seed * 7 + i * 2.7), s = 4 + 9 * hash(i * 4.1 + seed) ** 2;
    const tw = .75 + .25 * Math.sin(t * (1.5 + 2 * hash(i)) + i * 2);
    if (s > 9) glow(x, y, s * 4, '#FFF3C4', .35 * tw);
    cut(star(x, y, s * tw, .42, s > 8 ? 4 : 5, hash(i) * 2), i % 7 ? '#FFF6D8' : '#FFE08A', { z: .6, sa: .5, rim: false, grain: 0 });
  }
}
function space(t, top = '#11143A', bot = '#2A1F5C', neb = ['#3B2E7A', '#1F4B78', '#5A2E6E']) {
  const g = X.createLinearGradient(0, -1100, 0, 1100); g.addColorStop(0, top); g.addColorStop(1, bot); X.fillStyle = g; X.fillRect(-2400, -2600, 4800, 5200);
  // nebula strata: wide, slanted, translucent paper bands with wavy cut edges
  X.save(); X.rotate(-.32);
  neb.forEach((c, i) => {
    const y0 = -820 + i * 600, h = 230 + 60 * hash(i + 3), T = [], B = [];
    for (let k = 0; k <= 22; k++) { const x = -1700 + k * 155; T.push([x, y0 + 40 * Math.sin(k * .7 + i * 2) + 18 * Math.sin(k * 1.9 + i)]); B.push([x, y0 + h + 50 * Math.sin(k * .5 + i * 3) + 16 * Math.sin(k * 2.3)]); }
    cut(poly([...T, ...B.reverse()]), c, { z: 1.4, alpha: .5, sa: .35, rimA: .15 });
  });
  X.restore();
}
function hills(t, layers) {
  layers.forEach(([y, amp, col, seed, z], i) => {
    const P = [[-1500, 2600]]; for (let k = 0; k <= 24; k++) { const x = -1500 + k * 125; P.push([x, y - amp * (.5 + .5 * Math.sin(k * .55 + seed)) - amp * .4 * Math.sin(k * 1.37 + seed * 2)]); }
    P.push([1500, 2600]); cut(smooth(P), col, { z: z ?? 2, sa: .45 });
  });
}
function tree(x, y, s, col) { at(x, y, s, 0, () => { cut(poly([[0, -90], [34, 0], [-34, 0]]), col, { z: 1 }); cut(poly([[0, -130], [26, -50], [-26, -50]]), col, { z: 1 }); }); }
function house(x, y, s, lit) {
  at(x, y, s, 0, () => {
    cut(rrect(-60, -70, 120, 80, 4), '#2A3550', { z: 1.6 });
    cut(poly([[-78, -66], [0, -128], [78, -66]]), '#1B2440', { z: 1.6 });
    cut(rrect(-18, -50, 36, 34, 3), '#FFC861', { z: .3, rim: false });
    glow(0, -33, 90, '#FFB347', .5 * lit);
  });
}
function cloud(x, y, s, col, seed, a = 1) {
  at(x, y, s, 0, () => { const p = new Path2D(); p.addPath(blob(0, 0, 70, seed, .2, 8, 2.1, .7)); p.addPath(blob(-50, -30, 50, seed + 1, .2)); p.addPath(blob(40, -38, 58, seed + 2, .2)); cut(p, col, { z: 1.4, alpha: a, sa: .3 }); });
}
// a child in silhouette (dark paper), sitting on a hilltop or standing and waving; origin at the feet
function child(pose, t, col = '#0F1A2E') {
  const wave = pose.wave || 0, p = new Path2D();
  if (pose.sit) {   // sitting side-on, knees up, facing right toward the moon
    p.addPath(rrect(-24, -96, 46, 66, 20)); p.addPath(rrect(-14, -44, 66, 24, 12)); p.addPath(rrect(34, -42, 20, 44, 10)); p.addPath(ell(48, 0, 18, 8, 0, 70));
  } else {          // standing, feet apart
    p.addPath(rrect(-26, -112, 52, 74, 22)); p.addPath(rrect(-22, -48, 19, 50, 9)); p.addPath(rrect(4, -48, 19, 50, 9));
  }
  const hy = pose.sit ? -122 : -140;
  p.addPath(circ(2, hy, 27, 73)); p.addPath(ell(-8, hy - 14, 26, 15, -.35, 74)); p.addPath(ell(-24, hy - 2, 10, 14, .3, 75));
  cut(p, col, { z: 1.8, sa: .55, rimA: .32 });
  // the raised arm: points up at the moon (sitting) or waves (standing)
  const sh = pose.sit ? [4, -84] : [10, -102];
  const ang = pose.sit ? -.8 + .04 * Math.sin(t * 2) : lerp(.9, -.75 + .4 * Math.sin(t * 10), wave);
  at(sh[0], sh[1], 1, ang, () => { cut(rrect(-9, -9, 74, 18, 9), col, { z: 1.4, sa: .5, rimA: .32 }); cut(circ(68, 0, 11, 76), col, { z: 1.2, rimA: .32 }); });
}
// a curved paper arrow along an arc (spin and orbit cues)
function arcArrow(r, a0, a1, w, col, z = 1.2) {
  const P = arcPts(0, 0, r, a0, a1, 36); cut(strip(P, w * .4, w), col, { z });
  const e = P[P.length - 1], d = a1 > a0 ? 1 : -1, ta = a1 + d * Math.PI / 2;
  const tip = [e[0] + Math.cos(ta) * w * 1.6, e[1] + Math.sin(ta) * w * 1.6], nx = Math.cos(a1), ny = Math.sin(a1);
  cut(poly([[e[0] + nx * w * 1.3, e[1] + ny * w * 1.3], tip, [e[0] - nx * w * 1.3, e[1] - ny * w * 1.3]]), col, { z });
}
function padlock(s, shut, col = C.gold) {
  at(0, 0, s, 0, () => {
    const lift = (1 - shut) * 34, sh = new Path2D(); sh.addPath(strip(arcPts(0, -40 - lift, 34, Math.PI, TAU, 24), 14));
    sh.addPath(rrect(-41, -42 - lift, 14, 40 + (1 - shut) * 6, 4)); sh.addPath(rrect(27, -42 - lift, 14, 40, 4));
    cut(sh, '#C9CDD8', { z: 1.2 });
    cut(rrect(-58, -18, 116, 92, 16), col, { z: 2 });
    cut(circ(0, 18, 12, 81), C.ink, { z: 0, rim: false }); cut(rrect(-5, 20, 10, 28, 4), C.ink, { z: 0, rim: false });
  });
}
function qmark(s, col) {
  at(0, 0, s, 0, () => {
    cut(strip([...arcPts(0, -40, 46, Math.PI * 1.05, Math.PI * 2.35, 26), [12, 32], [6, 52]], 30, 28), col, { z: 2 });
    cut(circ(4, 98, 18, 91), col, { z: 2 });
  });
}
// a torn sheet of paper sweeping up the screen; p 0..1, fully covering at p = .5 (cut under it)
function tearWipe(p, col, col2, dir = 1) {
  if (p <= 0 || p >= 1) return;
  screen(() => {
    const y = lerp(H * 1.5 + 140, -H / 2 - 140, ease5(p)), edge = (y0, s, k) => { const P = []; for (let i = 0; i <= 30; i++) P.push([-40 + i * (W + 80) / 30, y0 + s * (22 * hash(i * 3.7 + k) + 14 * Math.sin(i * 1.3 + k))]); return P; };
    const top = edge(y - H / 2 - 40, -1, 1), bot = edge(y + H / 2 + 40, 1, 2);
    X.save(); if (dir < 0) { X.translate(W, H); X.rotate(Math.PI); }
    cut(poly([...top, ...bot.reverse()]), col2 || col, { z: 4, sa: .5 });
    const top2 = edge(y - H / 2 + 10, -1, 5), bot2 = edge(y + H / 2 - 10, 1, 6);
    cut(poly([...top2, ...bot2.reverse()]), col, { z: 1.5, sa: .3 });
    X.restore();
  });
}
