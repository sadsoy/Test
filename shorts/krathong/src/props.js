// props.js: the krathong world in cut paper. Each prop draws around its own origin (waterline / feet at y = 0).
const K = {
  leaf: '#3E8F4C', leafLt: '#72B85E', leafDk: '#2A6A3A', trunk: '#E9DFB9', trunkDk: '#C9BC8A',
  mari: '#F59A24', mariLt: '#FFC24A', lotus: '#F2A0B8', lotusDk: '#D9708F', candle: '#FFF1D2', flame: '#FFC94A',
  foam: '#F5F7FB', foamDk: '#D8DCE6', foamPink: '#F7C6D6', bread: '#D9A35B', breadDk: '#B37632', breadLt: '#EEC27E',
  river0: '#0C1A3A', river1: '#12284F', river2: '#1A3866', river3: '#24497A',
  vest: '#F57A1F', skin: '#E3B48B', skinDk: '#C98F66', soil0: '#6B4A2F', soil1: '#5A3C25', soil2: '#4A301E', soil3: '#3A2516',
  sea: '#2E7DB8', land: '#B8C98A', landDk: '#8FAE6A', water: '#4C8FC9'
};
// ---------- the krathong ----------
// kind 'nat' (banana leaf on a banana-trunk slice), 'foam' or 'bread'; lit 0..1 candle flame; bob = wave tilt
function krathong(kind, s, t, o = {}) {
  const lit = o.lit ?? 1, seedK = o.seed || 1;
  const pal = kind === 'foam' ? { base: K.foam, side: K.foamDk, p1: K.foam, p2: K.foamDk, p3: '#E9ECF3' }
    : kind === 'bread' ? { base: K.breadLt, side: K.breadDk, p1: K.bread, p2: K.breadDk, p3: K.breadLt }
    : { base: K.trunk, side: K.trunkDk, p1: K.leaf, p2: K.leafLt, p3: K.leafDk };
  at(0, 0, s, (o.tilt || 0) + .03 * Math.sin(t * 1.7 + seedK), () => {
    // base: a thick slice (side band + top ellipse)
    cut(ell(0, 6, 132, 36, 0, 3), pal.side, { z: 1.6, sa: .45 });
    cut(ell(0, -6, 126, 30, 0, 4), pal.base, { z: .4, sa: .2 });
    if (kind === 'foam') for (let i = 0; i < 16; i++) cut(circ(-110 + i * 14.5, 16 + 6 * Math.sin(i), 4, 50 + i), '#E3E7EF', { z: 0, rim: false, grain: 0 });
    if (kind === 'bread') for (let i = 0; i < 7; i++) cut(ell(-90 + i * 30, 12, 9, 4, .3, 60 + i), '#9C5F22', { z: 0, rim: false });
    // folded petals around the rim: back row, then front row (each a two-tone fold)
    const petal = (a, r, h, w, front) => {
      const x = Math.cos(a) * r, y = Math.sin(a) * r * .26 - 8;
      const P1 = [[x - w, y], [x, y - h], [x, y + 2]], P2 = [[x, y - h], [x + w, y], [x, y + 2]];
      cut(poly(P1), front ? pal.p1 : pal.p3, { z: .9, sa: .35 }); cut(poly(P2), front ? pal.p2 : pal.p1, { z: .9, sa: .35 });
    };
    const n = 9;
    for (let i = 0; i < n; i++) { const a = Math.PI + (i + .5) / n * Math.PI; petal(a, 108, 46, 22, false); }
    for (let i = 0; i < n; i++) { const a = Math.PI + (i + .5) / n * Math.PI; petal(a, 72, 62, 22, false); }
    // centre: flowers
    if (kind === 'foam') { [[-34, -40], [30, -38], [0, -52]].forEach(([x, y], i) => cut(star(x, y, 22, .55, 6, i), K.foamPink, { z: .8 })); }
    else if (kind === 'bread') { [[-30, -36], [30, -36]].forEach(([x, y], i) => { cut(ell(x, y, 26, 14, 0, 70 + i), K.bread, { z: .8 }); cut(poly([[x + 22, y], [x + 38, y - 10], [x + 38, y + 10]]), K.bread, { z: .8 }); }); cut(circ(0, -50, 22, 77), K.breadLt, { z: .8 }); }
    else { [[-36, -38, K.mari], [36, -36, K.mari], [-10, -56, K.lotus], [16, -50, K.mariLt]].forEach(([x, y, c], i) => { cut(star(x, y, 22, .62, 9, i), c, { z: .8 }); cut(circ(x, y, 8, 80 + i), i === 2 ? K.lotusDk : '#E0701A', { z: .2, rim: false }); }); }
    // incense and candle
    for (let i = 0; i < 3; i++) { const x = 18 + i * 9, top = -150 - i * 10; cut(strip([[x, -50], [x + 4 + i * 3, top]], 4, 3), '#6B4026', { z: .6, rim: false }); if (lit > 0) { cut(circ(x + 4 + i * 3, top, 4, 90 + i), '#FF5A2A', { z: 0, rim: false }); } }
    cut(rrect(-30, -128, 22, 82, 5), K.candle, { z: 1 });
    if (lit > 0) {
      const fl = 1 + .12 * Math.sin(t * 23 + seedK) + .08 * Math.sin(t * 37);
      glow(-19, -146, 120 * lit, '#FFB347', .7 * lit);
      at(-19, -134, lit * fl, .06 * Math.sin(t * 9), () => { cut(smooth([[0, 0], [11, -14], [0, -42], [-11, -14]]), K.flame, { z: 0, rim: false, grain: 0 }); cut(smooth([[0, -4], [5, -12], [0, -26], [-5, -12]]), '#FFF5D0', { z: 0, rim: false, grain: 0 }); });
    }
  });
}
// a small far-away krathong: a lit dot with a leaf cup (crowds, aerial views)
function krathongDot(x, y, s, t, seed, col = K.leaf, lit = 1) {
  if (lit > 0) glow(x, y - 10 * s, 60 * s, '#FFB347', .55 * lit);
  cut(ell(x, y, 20 * s, 8 * s, 0, seed), col, { z: .6, sa: .3, rim: false });
  if (lit > 0) cut(circ(x, y - 8 * s, 4.5 * s, seed + 1), '#FFE08A', { z: 0, rim: false, grain: 0 });
}
// ---------- river and banks ----------
function river(t, y0, o = {}) {
  const cols = o.cols || [K.river0, K.river1, K.river2, K.river3], flow = o.flow ?? 30;
  cols.forEach((c, i) => {
    const y = y0 + i * (o.gap || 150), P = [[-1600, 2800]];
    for (let k = 0; k <= 26; k++) { const x = -1600 + k * 125; P.push([x, y + 14 * Math.sin(k * .8 + i * 2 + t * 1.3) + 8 * Math.sin(k * 1.9 - t * 2 + i)]); }
    P.push([1600, 2800]); cut(poly(P), c, { z: 1.2, sa: .3, rimA: .22 });
    // ripple glints moving with the current
    for (let k = 0; k < 7; k++) { const gx = ((k * 260 + t * flow * (1 + i * .3) + i * 90) % 1800) - 900, gy = y + 50 + 30 * hash(k + i * 9); cut(rrect(gx, gy, 60 + 40 * hash(k * 3 + i), 6, 3), rgba('#9CC3F0', .25), { z: 0, rim: false, grain: 0 }); }
  });
}
// a column of reflected light on the water (moon or candle)
function reflection(x, y0, y1, w, col, a, t) {
  for (let k = 0; k < 9; k++) { const y = lerp(y0, y1, k / 9), ww = w * (1 - k / 12) * (.7 + .3 * Math.sin(t * 3 + k * 1.7)); cut(rrect(x - ww / 2 + 10 * Math.sin(t * 2 + k), y, ww, 10, 5), rgba(col, a * (1 - k / 10)), { z: 0, rim: false, grain: 0 }); }
}
function skyline(y, col, t, lit = 1) {
  const B = [[-620, 160], [-540, 260], [-470, 190], [-400, 330], [-320, 220], [-250, 140], [190, 210], [260, 360], [340, 250], [420, 300], [500, 180], [570, 240]];
  B.forEach(([x, h], i) => { cut(rrect(x, y - h, 66, h + 40, 3), col, { z: 1.2, sa: .35 }); for (let k = 0; k < 6; k++) if (hash(i * 7 + k) < .45 * lit) cut(rrect(x + 10 + 26 * (k % 2), y - h + 20 + 36 * Math.floor(k / 2), 14, 16, 2), '#F7C860', { z: 0, rim: false }); });
  // a temple prang in the middle (generic): stacked tiers and a spire
  at(-40, y, 1, 0, () => {
    const tiers = [[180, 60], [150, 60], [120, 55], [92, 50], [66, 46], [42, 40]];
    let yy = 0; tiers.forEach(([w, h], i) => { cut(poly([[-w / 2, yy], [-w / 2 * .82, yy - h], [w / 2 * .82, yy - h], [w / 2, yy]]), mix(col, '#3A4A7A', i * .06), { z: 1, sa: .3 }); yy -= h; });
    cut(poly([[-12, yy], [0, yy - 120], [12, yy]]), col, { z: 1 });
    glow(0, -140, 260, '#FFC56B', .25 * lit);
  });
}
function bank(y, col, t) { const P = [[-1400, 2600]]; for (let k = 0; k <= 22; k++) P.push([-1400 + k * 130, y + 18 * Math.sin(k * 1.1) + 10 * Math.sin(k * 2.7)]); P.push([1400, 2600]); cut(smooth(P), col, { z: 2 }); }
// ---------- people ----------
function hand(s, open, flip = 1) {   // a paper hand from below, palm up; open 0 = holding, 1 = released (fingers spread)
  at(0, 0, s, 0, () => { X.scale(flip, 1);
    cut(rrect(-48, 0, 96, 260, 40), K.skinDk, { z: 2 });
    cut(ell(0, -10, 62, 52, 0, 5), K.skin, { z: 1.2 });
    for (let i = 0; i < 4; i++) { const a = -2.0 + i * .28 + open * (i - 1.5) * .12, L = 70 + (i === 1 || i === 2 ? 14 : 0); at(-30 + i * 20, -40, 1, a + Math.PI / 2 * 0, () => cut(rrect(-11, -L, 22, L, 11), K.skin, { z: .9 })); }
    at(-58, -6, 1, -.9 - open * .3, () => cut(rrect(-10, -56, 22, 60, 11), K.skin, { z: .9 }));
  });
}
function worker(t, pole) {   // a city worker in an orange vest with a long net pole, side view, feet at 0
  const p = new Path2D(); p.addPath(rrect(-20, -84, 18, 84, 8)); p.addPath(rrect(2, -84, 18, 84, 8)); cut(p, '#1E2A44', { z: 1.4 });
  cut(rrect(-30, -170, 60, 96, 22), K.vest, { z: 1.6 }); cut(rrect(-30, -136, 60, 10, 3), '#FFE7A0', { z: .3, rim: false }); cut(rrect(-30, -112, 60, 10, 3), '#FFE7A0', { z: .3, rim: false });
  cut(circ(2, -196, 24, 3), K.skinDk, { z: 1.4 }); cut(ell(-2, -214, 30, 12, 0, 4), '#F0F0F0', { z: 1.2 });
  at(10, -150, 1, pole, () => { cut(rrect(-4, -6, 300, 10, 5), '#C8A26A', { z: 1.2 }); at(300, 0, 1, -pole + .2, () => { cut(ell(0, 30, 46, 40, 0, 9), rgba('#DDE6F0', .55), { z: .8 }); for (let i = -2; i <= 2; i++) cut(rrect(i * 16 - 1, 0, 2, 64 - Math.abs(i) * 8, 1), rgba('#FFFFFF', .6), { z: 0, rim: false, grain: 0 }); }); });
  at(18, -150, 1, pole * .9 + .4, () => cut(rrect(-8, -8, 70, 16, 8), K.vest, { z: 1 }));
}
function boat(t, o = {}) {   // a long collection boat, side view, waterline at 0
  cut(smooth([[-260, -40], [240, -40], [300, -70], [260, 10], [-220, 14], [-280, -20]]), '#7A3B2A', { z: 2.2 });
  cut(rrect(-240, -44, 480, 12, 6), '#A8583A', { z: .6, rim: false });
  // collected krathongs heaped in the boat
  for (let i = 0; i < (o.load ?? 8); i++) krathongDot(-180 + (i % 5) * 46 + 20 * hash(i), -44 - Math.floor(i / 5) * 14, 1.2, t, 200 + i, i % 4 ? K.leaf : K.foam, 0);
}
function figure(h, col, o = {}) {   // a simple standing/crouching silhouette for the family, feet at 0, facing right
  const cr = o.crouch || 0, p = new Path2D(), bh = h * (1 - .32 * cr);
  p.addPath(rrect(-h * .14, -bh * .52, h * .12, bh * .52, h * .05)); p.addPath(rrect(h * .02, -bh * .52, h * .12, bh * .52, h * .05));
  p.addPath(rrect(-h * .18, -bh * .92, h * .36, bh * .46, h * .14)); p.addPath(circ(h * .02 + cr * h * .08, -bh - h * .1, h * .13, h));
  cut(p, col, { z: 1.8, sa: .5, rimA: .3 });
  at(h * .05, -bh * .8, 1, o.arm ?? .7, () => cut(rrect(-h * .05, -h * .05, h * .42, h * .1, h * .05), col, { z: 1.4, rimA: .3 }));
}
// ---------- the other places a krathong ends up ----------
function clockFace(h, s) { at(0, 0, s, 0, () => { cut(circ(0, 0, 70, 5), C.cream, { z: 2 }); for (let i = 0; i < 12; i++) cut(circ(Math.cos(i / 12 * TAU) * 54, Math.sin(i / 12 * TAU) * 54, 4, i), C.ink, { z: 0, rim: false }); const ha = (h / 12) * TAU - Math.PI / 2, ma = (h % 1) * TAU - Math.PI / 2; at(0, 0, 1, ha, () => cut(rrect(-5, -6, 36, 12, 6), C.ink, { z: .5 })); at(0, 0, 1, ma, () => cut(rrect(-4, -4, 52, 8, 4), C.red, { z: .5 })); cut(circ(0, 0, 7, 9), C.gold, { z: .4 }); }); }
function grinder(t, run) {
  cut(poly([[-150, -260], [150, -260], [80, -150], [-80, -150]]), '#5E8F7A', { z: 2 });   // hopper
  cut(rrect(-120, -160, 240, 170, 18), '#3E6E5E', { z: 2.2 });
  at(0, -80, 1, t * 9 * run, () => { for (let i = 0; i < 6; i++) at(0, 0, 1, i * TAU / 6, () => cut(poly([[0, -8], [52, 0], [0, 8]]), '#C9D6D0', { z: .6 })); cut(circ(0, 0, 18, 3), '#2C4A40', { z: .4 }); });
  cut(rrect(-100, 0, 30, 40, 4), '#2C4A40', { z: 1 }); cut(rrect(70, 0, 30, 40, 4), '#2C4A40', { z: 1 });
}
function sack(s, label = 'ปุ๋ย') { at(0, 0, s, 0, () => { cut(smooth([[-80, 0], [-92, -120], [-60, -190], [60, -190], [92, -120], [80, 0]]), '#C9A26B', { z: 2 }); cut(poly([[-60, -190], [-40, -215], [0, -196], [40, -215], [60, -190]]), '#B48A54', { z: 1 }); txt(label, 0, -100, 50, '#4A6A2A', { weight: 800, sa: 0 }); cut(ell(0, -150, 20, 10, -.5, 3), K.leafLt, { z: .5 }); }); }
function sprout(g, t) {   // a seedling growing (g 0..1)
  if (g <= 0) return;
  const h = 150 * ease(g), sw = .05 * Math.sin(t * 2);
  at(0, 0, 1, sw, () => { cut(strip([[0, 0], [4, -h * .5], [0, -h]], 12, 8), K.leaf, { z: 1.2 }); const k = ease(seg(g, .45, 1)); if (k > 0) { at(0, -h, k, -.5, () => cut(ell(34, 0, 36, 16, 0, 5), K.leafLt, { z: 1.2 })); at(0, -h + 12, k, .4 + Math.PI, () => cut(ell(30, 0, 32, 14, 0, 6), K.leaf, { z: 1.2 })); } });
}
function fish(s, t, col = '#F2A03C', dir = 1) { at(0, 0, s, 0, () => { X.scale(dir, 1); const w = .25 * Math.sin(t * 12); cut(ell(0, 0, 60, 28, 0, 3), col, { z: 1.2 }); at(-52, 0, 1, w, () => cut(poly([[0, 0], [-40, -26], [-40, 26]]), mix(col, '#000000', .15), { z: 1 })); cut(circ(34, -6, 6, 4), C.cream, { z: 0, rim: false }); cut(circ(36, -6, 3, 5), C.ink, { z: 0, rim: false }); }); }
function bubble(x, y, r) { cut(circ(x, y, r, Math.round(x + y)), rgba('#DDEFFF', .45), { z: .3, rim: true, rimA: .6, grain: 0 }); }
