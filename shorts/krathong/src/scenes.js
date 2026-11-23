// scenes.js: "กระทงที่เราลอย…สุดท้ายมันไปไหน?" Nine scenes keyed to the narration phrases (TL).
const LN = Object.fromEntries(TL.lines.map(l => [l.id, l]));
const ph = (id, i) => LN[id].ph[i];
const wordAt = (id, i, word) => { const txt = SUBT[id][i], k = txt.indexOf(word), [a, b] = ph(id, i); return k < 0 ? a : lerp(a, b, k / txt.length); };
const label = (s, t, a, b, o = {}) => txt(s, o.x || 0, o.y ?? -690, o.size || 88, o.col || C.ink, { pop: seg(t, a, a + .35) * (1 - seg(t, b - .2, b)), back: 'back' in o ? o.back : C.cream, z: 1.6, rot: o.rot ?? -.03, edge: o.edge });
const NIGHT = ['#120F2E', '#1D1A48', '#2B2560', '#3D2F74', '#55407F'];

// ---------- S1 / S9: the river on the night of Loy Krathong ----------
const HOLD = { x: 0, y: 300, s: 1.35 };                   // the krathong cradled in two hands (first and last frame)
const CAM0 = [0, 170, 1.32];
function crowd(t, n, lit, area = [-650, -150, 1300, 380], seed = 3) {
  const D = [];
  for (let i = 0; i < n; i++) { const y = area[1] + area[3] * hash(i * 3.7 + seed), x = ((area[0] + area[2] * hash(i * 1.9 + seed) + t * (10 + 8 * hash(i))) % 1500 + 1500) % 1500 - 750; D.push([x, y, i]); }
  D.sort((a, b) => a[1] - b[1]).forEach(([x, y, i]) => krathongDot(x, y + 4 * Math.sin(t * 2 + i), lerp(.55, 1.35, (y - area[1]) / area[3]), t, 300 + i, i % 9 === 4 ? K.foam : i % 7 === 3 ? K.bread : K.leaf, lit * (hash(i * 5.1) < .9 ? 1 : 0)));
}
function nightRiver(t, o) {
  setCam(...o.cam);
  layer(.1, () => nightSky(t, NIGHT));
  layer(.2, () => stars(t, 50, [-800, -1300, 1600, 900], 6));
  layer(.3, () => { glow(250, -640, 420, '#FFF0C8', .45); at(250, -640, 1, 0, () => moonSphere(105, { z: 1.6 })); });
  layer(.5, () => { skyline(-170, '#1B1F45', t, o.cityLit ?? 1); });
  layer(.8, () => { river(t, -175, { gap: 170 }); reflection(200, -150, 420, 120, '#FFE7A8', .35, t); });
  layer(.95, () => crowd(t, o.crowd ?? 34, o.lit ?? 1));
  layer(1, () => {
    if (o.hero) { const [x, y, s] = o.hero; if (s > .1) { cut(ell(x, y + 12 * s, 150 * s, 30 * s, 0, 9), rgba('#0A1430', .35), { z: 0, rim: false, grain: 0 }); krathong(o.heroKind || 'nat', s, t, { lit: 1, seed: 7 }); } }
  });
  if (o.hands) layer(1.05, () => { const [ox, oy, op] = o.hands; at(HOLD.x - 190 + ox, HOLD.y + 90 + oy, 1.3, .25, () => hand(1, op, 1)); at(HOLD.x + 190 - ox, HOLD.y + 90 + oy, 1.3, -.25, () => hand(1, op, -1)); });
}
// the hero krathong drawn at its place (krathong() draws around the origin, so wrap it)
function heroAt(x, y, s) { return [x, y, s]; }
function S1(t) {
  const [a0, b0] = ph('L1', 0), [a1] = ph('L1', 1), [a2, b2] = ph('L1', 2), rel = wordAt('L1', 0, 'ปล่อย');
  const go = ease5(seg(t, rel, b0 + .9)), hx = lerp(HOLD.x, 70, go), hy = lerp(HOLD.y, -40, go), hs = lerp(HOLD.s, .5, go);
  const handsOut = ease(seg(t, rel + .15, rel + 1.1));
  nightRiver(t, {
    cam: kf(t, [[0, CAM0], [rel, [0, 150, 1.28]], [b0 + .6, [0, -20, 1.02]], [5.1, [20, -60, 1.12]]], ease5),
    hero: [0, 0, 0], hands: [handsOut * 80, handsOut * 900, seg(t, rel, rel + .3)],
  });
  layer(1, () => { at(hx, hy + 6 * Math.sin(t * 2), 1, 0, () => krathong('nat', hs, t, { seed: 7 })); });
  layer(0, () => {
    const q = seg(t, a2, a2 + .35);
    if (q > 0) { const [sx, sy] = [lerp(HOLD.x, 70, 1) * 1.12 - 20, -40]; at(190, -330, backOut(q, 2.2) * .9, .15 + .05 * Math.sin(t * 4), () => qmark(1.2, C.gold)); }
    label('ไปไหน?', t, a1 + .05, 5.3, { back: C.red, col: C.cream, size: 110, x: -150 });
  });
}
function S9(t) {
  const [a0] = ph('L9', 0), [a1, b1] = ph('L9', 1), end = TL.duration, up = ease5(seg(t, b1 + .05, end - .05));
  const hx = lerp(40, HOLD.x, up), hy = lerp(40, HOLD.y, up), hs = lerp(.75, HOLD.s, up);
  nightRiver(t, { cam: kf(t, [[34.0, [0, -40, 1.08]], [b1, [10, 40, 1.15]], [end, CAM0]], ease5), crowd: 22, hero: [0, 0, 0], hands: [(1 - up) * 80, (1 - up) * 900, 0] });
  layer(1, () => { const glowK = seg(t, a0, a0 + 1); glow(hx, hy - 30, 420, '#FFD58A', .25 * glowK * (1 - up)); at(hx, hy + 6 * Math.sin(t * 2), 1, 0, () => krathong('nat', hs, t, { seed: 7 })); });
}

// ---------- S2: almost four hundred thousand ----------
function S2(t) {
  const [a0] = ph('L2', 0), [a1] = ph('L2', 1), [a2, b2] = ph('L2', 2);
  setCam(...kf(t, [[5.0, [0, -60, 1.18]], [8.8, [0, 40, .96]]], ease));
  layer(.1, () => nightSky(t, NIGHT));
  layer(.2, () => stars(t, 40, [-800, -1300, 1600, 700], 8));
  layer(.5, () => skyline(-430, '#1B1F45', t, 1));
  layer(.8, () => river(t, -440, { gap: 230 }));
  const n = Math.round(lerp(30, 150, ease(seg(t, a1, b2))));
  layer(.95, () => crowd(t, n, 1, [-700, -420, 1400, 840], 11));
  layer(0, () => {
    label('กรุงเทพฯ · ปี 2568', t, a0, a2 + .1, { back: C.gold, size: 80 });
    const c = Math.round(391027 * easeOut(seg(t, a2, b2 - .1)) / 1) , k = seg(t, a2 - .05, a2 + .3);
    if (k > 0) { txt(c.toLocaleString('en-US'), 0, -700, 150, C.gold, { pop: k, z: 2, edge: C.ink, sa: .6 }); txt('ใบ  (เกือบ 4 แสน)', 0, -580, 56, C.cream, { pop: seg(t, b2 - .3, b2), back: '#3D2F74', z: 1.2, weight: 700 }); }
  });
}

// ---------- S3: the night shift ----------
function S3(t) {
  const [a0, b0] = ph('L3', 0), [a1, b1] = ph('L3', 1), dawn = ease(seg(t, a1 + .8, 12.9));
  setCam(...kf(t, [[8.6, [0, -40, 1.08]], [12.9, [40, -20, 1.0]]], ease));
  const sky = NIGHT.map((c, i) => mix(c, ['#3A3D7A', '#6D5A9A', '#B47BA0', '#E8A08C', '#F6C99A'][i], dawn));
  layer(.1, () => nightSky(t, sky));
  layer(.2, () => stars(t, 40, [-800, -1300, 1600, 900], 6));
  const lit = 1 - ease(seg(t, a0, b0 + .2));
  layer(.5, () => skyline(-170, mix('#1B1F45', '#3B3460', dawn), t, .25 + .75 * lit));
  layer(.8, () => river(t, -175, { gap: 170, cols: [K.river0, K.river1, K.river2, K.river3].map(c => mix(c, '#4A6FA0', dawn * .5)) }));
  const bx = lerp(-480, 700, ease(seg(t, a1 - .6, 12.9)));
  layer(.95, () => {
    for (let i = 0; i < 26; i++) { const x = -560 + 1120 * hash(i * 1.3 + 2), y = -130 + 330 * hash(i * 2.9 + 5); if (x < bx + 180 && Math.abs(y - 90) < 160) continue; krathongDot(x, y + 4 * Math.sin(t * 2 + i), lerp(.6, 1.3, (y + 130) / 330), t, 400 + i, i % 6 === 2 ? K.foam : K.leaf, lit * (hash(i * 7) < .85 ? 1 : 0)); }
  });
  layer(1, () => {
    at(bx, 120 + 6 * Math.sin(t * 1.5), 1, .02 * Math.sin(t * 1.3), () => { boat(t, { load: Math.round(lerp(2, 14, seg(t, a1, b1))) }); at(80, -44, 1, 0, () => worker(t, .55 + .35 * Math.sin(t * 3.2))); });
    for (let i = 0; i < 4; i++) { const w = (t * .6 + i / 4) % 1; cut(ell(bx - 280 - w * 300, 128, 60 + w * 120, 10 + w * 10, 0, 500 + i), rgba('#A9C8F0', .3 * (1 - w)), { z: 0, rim: false, grain: 0 }); }
  });
  layer(0, () => {
    const k = seg(t, a1, a1 + .35);
    if (k > 0) { at(-250, -660, backOut(k, 2), 0, () => clockFace(lerp(22, 29, ease(seg(t, a1, b1 + .2))) % 12, 1)); }
    label('เก็บทั้งคืน', t, a1 + .2, 12.9, { x: 110, back: K.vest, col: C.cream, size: 84 });
  });
}

// ---------- S4: leaf and banana trunk become fertiliser ----------
function S4(t) {
  const [a, b] = ph('L4', 0), grind = wordAt('L4', 0, 'บดย่อย'), fert = wordAt('L4', 0, 'กลายเป็น');
  setCam(...kf(t, [[12.8, [0, -40, 1.1]], [16.8, [0, 20, 1]]], ease));
  layer(.1, () => { const g = X.createLinearGradient(0, -1000, 0, 400); g.addColorStop(0, '#F7C99A'); g.addColorStop(1, '#FBE7C6'); X.fillStyle = g; X.fillRect(-2400, -2600, 4800, 5200); });
  layer(.3, () => { glow(320, -470, 500, '#FFE2A0', .7); cut(circ(320, -470, 110, 4), '#FFD07A', { z: 1.2 }); hills(t, [[-120, 80, '#B9CF8A', 4, 1.4]]); });
  layer(.7, () => hills(t, [[60, 60, '#8DB872', 6, 2]]));
  layer(1, () => {
    hills(t, [[250, 40, '#6E9F58', 9, 2.4]]);
    // krathongs slide down a chute into the hopper
    cut(strip([[-640, -560], [-150, -210]], 120, 120), '#C9A26B', { z: 1.4 });
    for (let i = 0; i < 5; i++) { const p = ((t - 12.8) * .5 + i / 5) % 1, x = lerp(-620, -150, p), y = lerp(-600, -250, p); at(x, y, 1, .62, () => krathong('nat', .55, t, { lit: 0, seed: 30 + i })); }
    at(-60, 200, 1.45, 0, () => grinder(t, seg(t, grind - .3, grind)));
    // chips fly from the spout onto the heap
    const run = seg(t, grind, grind + .2);
    for (let i = 0; i < 22 * run; i++) { const p = ((t * 1.3 + i / 22) % 1), x = lerp(120, 380, p), y = 170 - 240 * p + 300 * p * p; cut(ell(x, y, 14, 7, i, 600 + i), i % 2 ? K.leaf : K.trunkDk, { z: .6, rim: false }); }
    cut(ell(360, 300, 190 * (.4 + .6 * seg(t, grind, b)), 70 * (.4 + .6 * seg(t, grind, b)), 0, 5), '#7A5A35', { z: 1.6 });
    const sk = seg(t, fert, fert + .35); if (sk > 0) at(360, 250, backOut(sk, 2), 0, () => sack(1.25));
    at(-330, 170, 1.6, 0, () => sprout(seg(t, fert + .2, b + .2), t));
  });
  layer(0, () => {
    label('ใบตอง + หยวกกล้วย', t, a, grind + .1, { back: K.leafLt, size: 80 });
    label('บดย่อย', t, grind + .05, fert + .05, { back: '#5E8F7A', col: C.cream, size: 96 });
    label('ปุ๋ยอินทรีย์', t, fert + .1, 17.1, { back: K.leafLt, size: 100 });
  });
}

// ---------- S5: foam, 7 %, landfill, hundreds of years ----------
function S5(t) {
  const [a0] = ph('L5', 0), [a1] = ph('L5', 1), [a2] = ph('L5', 2), [a3, b3] = ph('L5', 3);
  const down = ease5(seg(t, a2 - .1, a2 + .7));
  setCam(...kf(t, [[16.7, [0, -560, 1.12]], [a2 - .1, [0, -520, 1]], [a2 + .7, [0, 60, 1]], [22.1, [0, 120, 1.05]]], ease5));
  layer(1, () => {
    // the sky above ground, then the ground in cut-away strata
    X.fillStyle = '#C9D7E6'; X.fillRect(-2000, -2200, 4000, 2000);
    hills(t, [[-330, 30, '#9DBE7A', 2, 1.6]]);
    const layers = [K.soil0, K.soil1, K.soil2, K.soil3, '#2E1D12'];
    layers.forEach((c, i) => { const y = -300 + i * 190, P = [[-1400, 2600]]; for (let k = 0; k <= 22; k++) P.push([-1400 + k * 130, y + 16 * Math.sin(k * .9 + i * 2)]); P.push([1400, 2600]); cut(poly(P), c, { z: 1.6, sa: .4 }); });
    // pebbles and roots
    for (let i = 0; i < 30; i++) cut(ell(-500 + 1000 * hash(i * 2.1), -200 + 900 * hash(i * 3.3), 10 + 14 * hash(i), 7 + 8 * hash(i * 2), i, 700 + i), '#8A6A4A', { z: .5, sa: .3 });
    // the pit and the foam krathong that falls into it and stays
    const fall = ease(seg(t, a2 + .1, a2 + .7)), fy = lerp(-620, 230, fall);
    cut(ell(0, 260, 220, 60, 0, 8), '#2B1A10', { z: 0, rim: false });
    at(0, fy, 1, 0, () => krathong('foam', .9, t, { lit: 0, seed: 9 }));
    // soil fills back over it, layer by layer
    for (let i = 0; i < 3; i++) { const k = ease(seg(t, a2 + .5 + i * .3, a2 + .8 + i * .3)); if (k > 0) { const y = lerp(-900, 120 - i * 125, k), T = [], B = []; for (let q = 0; q <= 14; q++) { const x = -420 + q * 60; T.push([x, y + 14 * Math.sin(q * 1.3 + i)]); B.push([x, y + 135 + 12 * Math.sin(q * .9 + i * 2)]); } cut(poly([...T, ...B.reverse()]), [K.soil1, K.soil0, '#7C5A3A'][i], { z: 1.8 }); } }
    // above ground: one foam krathong in a row of fourteen (≈ 7 %)
    const rk = seg(t, a1, a1 + .5) * (1 - down);
    if (rk > 0) for (let i = 0; i < 14; i++) { const x = -455 + i * 70, k = seg(rk, i / 20, i / 20 + .3); if (k > 0) at(x, -470, backOut(k, 2) * .26, 0, () => krathong(i === 9 ? 'foam' : i === 4 ? 'bread' : 'nat', 1, t, { lit: 0, seed: i })); }
    if (rk > 0) cut(strip(arcPts(175, -490, 52, 0, TAU * .999, 40), 8), rgba(C.red, rk), { z: .8, rim: false });
    // the foam on its own at first
    const fk = seg(t, a0, a0 + .4) * (1 - seg(t, a1 - .1, a1 + .3));
    if (fk > 0) at(0, -640, backOut(fk, 2), 0, () => krathong('foam', .9, t, { lit: 0, seed: 9 }));
  });
  layer(0, () => {
    label('กระทงโฟม', t, a0, a1 + .1, { back: C.cream, size: 96 });
    label('7%', t, a1 + .05, a2 + .1, { back: null, col: C.cream, edge: C.red, size: 170 });
    label('ฝังกลบ', t, a2 + .05, a3 + .1, { back: K.soil0, col: C.cream, size: 100 });
    const k = seg(t, a3, b3);
    if (t > a3) label('+' + Math.round(lerp(0, 500, easeOut(k)) / 50) * 50 + ' ปี', t, a3, 22.2, { back: C.red, col: C.cream, size: 100, rot: .02 });
  });
}

// ---------- S6: bread, fish, and spoiled water ----------
function S6(t) {
  const [a0] = ph('L6', 0), [a1] = ph('L6', 1), [a2, b2] = ph('L6', 2), rot = ease(seg(t, a2, b2 + .2));
  setCam(...kf(t, [[21.9, [0, -260, 1.1]], [a1, [0, -80, 1]], [26.1, [0, 0, 1.04]]], ease5));
  layer(.3, () => {
    const g = X.createLinearGradient(0, -700, 0, 900); g.addColorStop(0, mix('#3E8FC4', '#6F7A4A', rot)); g.addColorStop(1, mix('#0F3A66', '#2E3220', rot)); X.fillStyle = g; X.fillRect(-2400, -2600, 4800, 5200);
    for (let i = 0; i < 5; i++) cut(strip([[-300 + i * 180, -620], [-420 + i * 200, 900]], 60, 160), rgba('#CDE8FF', .08 * (1 - rot)), { z: 0, rim: false, grain: 0 });
  });
  layer(1, () => {
    // the surface, seen from just below; sky above it
    X.fillStyle = '#F2C79A'; X.fillRect(-2000, -2200, 4000, 1580);
    const P = [[-1400, -2000]]; for (let k = 0; k <= 22; k++) P.push([-1400 + k * 130, -620 + 10 * Math.sin(k + t * 2)]); P.push([1400, -2000]);
    cut(poly(P), '#F2C79A', { z: 1.6, rim: false });
    at(0, -628 + 5 * Math.sin(t * 2), 1, 0, () => krathong('bread', .85, t, { lit: 0, seed: 4 }));
    // crumbs: bitten off, some eaten, the rest sink and rot on the bottom
    for (let i = 0; i < 12; i++) {
      const t0 = a0 + .2 + i * .12, p = seg(t, t0, t0 + 2.2), x = -160 + 320 * hash(i * 4.4), y = lerp(-600, 520 + 40 * hash(i), easeOut(p));
      const eaten = i % 3 === 0 && t > a1 + .3;
      if (p > 0 && !eaten) cut(blob(x + 20 * Math.sin(p * 6 + i), y, 14 + 6 * hash(i), 800 + i, .4, 7), mix(K.bread, '#6D7A3A', rot), { z: .8 });
    }
    // fish: come to nibble, then swim off as the water turns
    [[-1, 0], [1, 1], [-1, 2]].forEach(([d, i]) => {
      const come = ease(seg(t, a0 + .2 + i * .2, a1 + .2)), leave = ease(seg(t, a2 + .2 + i * .15, b2 + .3));
      const x = d * lerp(620, 120 + 60 * i, come) + d * leave * -900 * -1, y = -380 + i * 150 + 20 * Math.sin(t * 3 + i);
      at(x, y, 1, 0, () => fish(1.3, t + i, ['#F2A03C', '#E9809A', '#F6C445'][i], d < 0 ? 1 : -1));
    });
    // bubbles stop when the water spoils
    for (let i = 0; i < 10; i++) { const p = (t * .4 + i / 10) % 1; if (hash(i + Math.floor(t * .4 + i / 10)) > rot) bubble(-400 + 90 * i, lerp(700, -560, p), 6 + 6 * hash(i)); }
    // murk rising from the bottom
    if (rot > 0) cut(rrect(-800, lerp(900, -500, rot), 1600, 1600, 0), rgba('#4A4E2A', .45 * rot), { z: 0, rim: false });
    cut(rrect(-800, 560, 1600, 600, 0), mix('#C9B07A', '#5A5230', rot), { z: 1.6 });
  });
  layer(0, () => {
    label('กระทงขนมปัง', t, a0, a2 - .1, { back: K.breadLt, size: 90, y: -760 });
    label('น้ำเสีย!', t, a2 + .3, 26.3, { back: '#5A5230', col: C.cream, size: 110, y: -760 });
  });
}

// ---------- S7: the ones that slip through ----------
function riverPath(k) {   // centre line of the river on the map, k 0 (Bangkok) .. 1 (the sea)
  const P = [[-60, -900], [80, -650], [-90, -420], [60, -200], [-40, 20], [70, 220], [0, 420]];
  const f = clamp(k) * (P.length - 1), i = Math.min(P.length - 2, Math.floor(f)), u = f - i; return [lerp(P[i][0], P[i + 1][0], u), lerp(P[i][1], P[i + 1][1], u)];
}
function S7(t) {
  const [a0] = ph('L7', 0), [a1] = ph('L7', 1), [a2, b2] = ph('L7', 2);
  setCam(...kf(t, [[26.0, [0, -300, 1.1]], [a1, [0, -60, 1]], [29.7, [0, 240, 1.02]]], ease5));
  layer(1, () => {
    X.fillStyle = K.land; X.fillRect(-2000, -2200, 4000, 4400);
    for (let i = 0; i < 18; i++) cut(blob(-560 + 1120 * hash(i * 2.3), -900 + 1300 * hash(i * 4.1), 60 + 40 * hash(i), 900 + i, .35, 8), K.landDk, { z: .8, alpha: .8 });
    // the sea at the bottom
    const S = [[-1400, 2600], [-1400, 430]]; for (let k = 0; k <= 22; k++) S.push([-1400 + k * 130, 430 + 30 * Math.sin(k * .7 + t)]); S.push([1400, 2600]);
    cut(poly(S), K.sea, { z: 1.8 });
    const RP = []; for (let k = 0; k <= 40; k++) RP.push(riverPath(k / 40));
    cut(strip(RP, 70, 150), K.water, { z: 1.4 });
    // the line of collection boats across the river
    const ny = -560; for (let i = -3; i <= 3; i++) cut(rrect(riverPath(.12)[0] + i * 26 - 10, ny - 6, 20, 12, 5), K.vest, { z: .8 });
    // a stream of krathong: most stop at the boats, a few slip through
    for (let i = 0; i < 18; i++) {
      const slip = i === 3 || i === 9 || i === 14, start = 26.0 + i * .12, p = seg(t, start, start + (slip ? 3.2 : .9));
      let k = slip ? p : Math.min(p * .14, .118), [x, y] = riverPath(k); x += 18 * Math.sin(i * 2.1);
      if (i === 9) { const bk = seg(t, a1, a1 + .6); k = Math.min(k, .55); [x, y] = riverPath(k); x += lerp(0, 95, ease(bk)); }
      if (i === 14) { k = Math.min(k, .5); [x, y] = riverPath(k); x -= 90 * ease(seg(t, a1 + .1, a1 + .7)); }
      if (i === 3) { k = lerp(0, 1.12, ease(seg(t, a0, b2))); [x, y] = k > 1 ? [riverPath(1)[0] + (k - 1) * 600, riverPath(1)[1] + (k - 1) * 900] : riverPath(k); }
      if (!slip && p >= 1) continue;
      krathongDot(x, y, slip ? 1.5 : 1.1, t, 1000 + i, K.leaf, 0);
      if (slip && t > a0) cut(strip(arcPts(x, y - 4, 34, 0, TAU * .999, 30), 5), rgba(C.red, seg(t, a0, a0 + .3)), { z: .6, rim: false });
    }
    // labels on the map
    at(-60, -900, 1, 0, () => { cut(circ(0, 0, 18, 3), C.red, { z: 1.4 }); });
    txt('กรุงเทพฯ', 130, -900, 54, C.ink, { back: C.cream, z: 1, weight: 700 });
    txt('ทะเล', 280, 540, 80, C.cream, { pop: seg(t, a2, a2 + .3), back: '#1E5A8C', z: 1.2 });
    txt('ติดตลิ่ง', -330, -40, 60, C.ink, { pop: seg(t, a1 + .4, a1 + .7) * (1 - seg(t, a2 + .3, a2 + .5)), back: C.cream, z: 1.2, weight: 700 });
  });
  layer(0, () => label('หลุดรอด!', t, a0 + .1, 29.8, { back: C.red, col: C.cream, size: 96 }));
}

// ---------- S8: what we can do this year ----------
function S8(t) {
  const [a0] = ph('L8', 0), [a1] = ph('L8', 1), [a2] = ph('L8', 2), [a3, b3] = ph('L8', 3);
  setCam(...kf(t, [[29.6, [0, -40, 1.08]], [34.1, [0, 0, 1.0]]], ease));
  layer(.1, () => nightSky(t, NIGHT.map(c => mix(c, '#5A3A6E', .25))));
  layer(.2, () => stars(t, 40, [-800, -1300, 1600, 900], 21));
  layer(.3, () => { glow(330, -420, 380, '#FFF0C8', .4); at(330, -420, 1, 0, () => moonSphere(90, { z: 1.4 })); });
  layer(.5, () => skyline(-280, '#22204E', t, 1));
  layer(.8, () => { river(t, -285, { gap: 150 }); crowd(t, 12, 1, [-650, -260, 1300, 200], 31); });
  layer(1, () => {
    bank(250, '#1F3B2E', t);
    const kx = lerp(110, 190, ease(seg(t, a3 + .2, b3 + .3))), ky = lerp(250, 150, ease(seg(t, a3 + .2, b3 + .3)));
    at(kx, ky, 1, 0, () => krathong('nat', .55, t, { seed: 12 }));
    const reach = .9 - .5 * ease(seg(t, a3 + .2, b3));
    at(-160, 250, 1, 0, () => figure(300, '#121A2E', { crouch: .6, arm: reach }));
    at(-20, 260, 1, 0, () => figure(190, '#18223A', { crouch: .5, arm: reach + .1 }));
    at(-330, 250, 1, 0, () => figure(320, '#0F1628', { crouch: .3, arm: reach - .1 }));
  });
  layer(0, () => {
    const items = [['วัสดุธรรมชาติ', a1 + .2], ['ใบเล็ก', a2 + .05], ['ลอยรวมกันใบเดียว', a3 + .2]];
    items.forEach(([s, at0], i) => { const k = seg(t, at0, at0 + .3); if (k <= 0) return; const y = -760 + i * 115; txt(s, 40, y, 66, C.ink, { pop: k, back: C.cream, z: 1.3, weight: 700 }); at(-260, y, backOut(seg(t, at0 + .1, at0 + .4), 2.5), 0, () => { cut(circ(0, 0, 38, i), K.leafLt, { z: 1.4 }); cut(strip([[-16, 0], [-4, 14], [18, -14]], 10), C.cream, { z: 0, rim: false }); }); });
    label('ปีนี้', t, a0, a1 + .1, { back: C.gold, size: 100 });
  });
}

const SCENES = [[0, S1], [5.1, S2], [8.7, S3], [12.8, S4], [16.75, S5], [22.0, S6], [26.05, S7], [29.65, S8], [34.05, S9]];
