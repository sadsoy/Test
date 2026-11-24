// props.js (sleepy): the cut-paper cast and props of "ทำไมเราถึงรู้สึกง่วงหลังจากกินอาหาร?". Built on paper.js
// (cut, Pc, Pr, Pe, Pp, Pblob, strip, shine, ptext) and the shared props (cloud, sun, sky). Each prop is drawn at a base
// point with a scale s and only the controls it needs, so shapes never change between frames: the character's head,
// body and limbs are fixed shapes that only move, turn and scale.

const SLP = { skin: '#F4C9A2', skinDk: '#E3AD84', hair: '#3B2A2A', shirt: '#2F9C8F', shirtDk: '#247A70', cheek: '#F29C8C', ink: '#2E2430',
  plate: '#FBF7EE', rice: '#FFF8E6', curry: '#E8892F', egg: '#FFD25E', green: '#6DBE6A', brain: '#F2A7B5', brainDk: '#D97F92',
  blood: '#D6334A', sugar: '#FFFFFF', orexin: '#FFD84D', lav: '#B9A7E0', mint: '#BFE8D3' };

// ---------- the character: "อิ่ม", a round paper person seen from the front ----------
// o: lid 0..1 (eyelids closed), nod (rad, head tilt), bob (px, head drop), mouth 0..1 (open, a yawn at 1), smile -1..1,
// belly 0..1 (full), arm: [left, right] raise 0..1, walk (phase, legs swing), legs (draw legs), look (px, pupils).
function person(x, y, s, o = {}) {
  const lid = clamp(o.lid ?? 0), nod = o.nod ?? 0, mouth = clamp(o.mouth ?? 0), belly = clamp(o.belly ?? 0), arm = o.arm || [0, 0];
  const S = v => v * s, wk = o.walk ?? null;
  // legs (behind the body)
  if (o.legs !== false) for (const side of [-1, 1]) {
    const sw = wk == null ? 0 : Math.sin(wk + (side > 0 ? Math.PI : 0)) * .45, hx = x + S(side * 34), hy = y - S(118);
    const fx = hx + Math.sin(sw) * S(110), fy = hy + Math.cos(sw) * S(110);
    strip([[hx, hy], [fx, fy]], '#3D4A6B', S(30), 1, { cap: 'round' });
    cut(Pe(fx + S(side * 6), fy + S(6), S(26), S(13)), '#2E2430', 1);
  }
  // arms behind the torso when lowered
  const armAt = side => { const up = side < 0 ? arm[0] : arm[1], sx = x + S(side * 78), sy = y - S(300);
    const a = lerp(.25, 2.6, up) * side, swing = wk == null ? 0 : Math.sin(wk + (side < 0 ? Math.PI : 0)) * .35;
    const ex = sx + Math.sin(a + swing) * S(130), ey = sy + Math.cos(a + swing) * S(130);
    strip([[sx, sy], [ex, ey]], SLP.shirt, S(34), 1); cut(Pc(ex, ey, S(20)), SLP.skin, 1); };
  armAt(-1); armAt(1);
  // torso with a belly that rounds out when full
  const bw = S(108 + 26 * belly);
  cut(Pblob([[x - S(92), y - S(330)], [x + S(92), y - S(330)], [x + bw, y - S(210)], [x + S(96), y - S(110)], [x - S(96), y - S(110)], [x - bw, y - S(210)]]), SLP.shirt, 2, { edge: .2 });
  cut(Pe(x, y - S(205), S(40 + 30 * belly), S(30 + 22 * belly)), SLP.shirtDk, 0, { tex: .4, alpha: .35 + .4 * belly });
  // head (tilts and drops as a unit)
  const hx = x, hy = y - S(440) + (o.bob ?? 0);
  PX.save(); PX.translate(hx, hy); PX.rotate(nod);
  cut(Pc(0, 0, S(118)), SLP.skin, 3, { edge: .2 });
  cut(Pblob([[-S(122), S(6)], [-S(116), -S(66)], [-S(60), -S(118)], [S(20), -S(126)], [S(96), -S(92)], [S(124), -S(10)], [S(92), -S(56)], [S(20), -S(70)], [-S(56), -S(64)], [-S(96), -S(24)]]), SLP.hair, 1);
  for (const side of [-1, 1]) {
    const ex = S(side * 44), ey = S(6);
    cut(Pe(ex, ey, S(17), S(21)), '#FFFFFF', 0, { tex: .2 });
    cut(Pc(ex + (o.look ?? 0) * s, ey + S(3), S(10)), SLP.ink, 0, { tex: 0 });
    if (lid > .01) {                                      // the eyelid: a skin-coloured flap that comes down over the eye
      PX.save(); PX.beginPath(); PX.ellipse(ex, ey, S(19), S(23), 0, 0, TAU); PX.clip();
      cut(Pr(ex - S(22), ey - S(26), S(44), S(48) * lid), SLP.skinDk, 0, { tex: .3 }); PX.restore();
      strip([[ex - S(18), ey - S(23) + S(46) * lid], [ex + S(18), ey - S(23) + S(46) * lid]], SLP.ink, S(3.5), 0);
    }
    cut(Pe(S(side * 74), S(40), S(16), S(10)), SLP.cheek, 0, { tex: .2, alpha: .8 });
  }
  if (mouth > .15) cut(Pe(0, S(58), S(14 + 8 * mouth), S(8 + 22 * mouth)), '#7A2E3A', 0, { tex: .2 });
  else { const sm = o.smile ?? .6; PX.save(); PX.strokeStyle = SLP.ink; PX.lineWidth = S(5); PX.lineCap = 'round'; PX.beginPath(); PX.moveTo(-S(18), S(52)); PX.quadraticCurveTo(0, S(52 + 18 * sm), S(18), S(52)); PX.stroke(); PX.restore(); }
  PX.restore();
  return { head: [hx, hy] };
}
// floating Z's of sleepiness: n letters drifting up and to the side from (x, y); k 0..1 how sleepy
function zzz(x, y, t, k, s = 1) {
  if (k <= 0) return;
  for (let i = 0; i < 3; i++) { const p = frac(t * .45 + i / 3), a = k * Math.sin(Math.PI * p);
    ptext('Z', x + p * 90 * s + i * 10, y - p * 200 * s, (40 + i * 16) * s, '#FFFFFF', { alpha: a, lv: 2, weight: 800, rot: -.2 + i * .1 }); }
}

// ---------- food ----------
// a plate of rice and curry with a fried egg; eaten 0..1 empties it (the food shrinks into the plate)
function plate(x, y, s, eaten = 0, o = {}) {
  const S = v => v * s, k = 1 - clamp(eaten);
  cut(Pe(x, y, S(190), S(62)), '#E7DFD0', 2, { sa: .3 });
  cut(Pe(x, y - S(6), S(160), S(50)), SLP.plate, 0, { edge: .3 });
  if (k > .02) {
    cut(Pblob([[x - S(130 * k), y - S(4)], [x - S(80 * k), y - S(70 * k)], [x - S(10), y - S(84 * k)], [x + S(30 * k), y - S(40 * k)], [x + S(10), y + S(10)]]), SLP.rice, 1, { edge: .3 });
    cut(Pblob([[x - S(10), y + S(14)], [x + S(40 * k), y - S(40 * k)], [x + S(120 * k), y - S(34 * k)], [x + S(140 * k), y + S(4)], [x + S(60), y + S(22 * k)]]), SLP.curry, 1);
    if (o.egg !== false) { cut(Pblob([[x - S(70), y - S(60 * k)], [x - S(20), y - S(78 * k)], [x + S(16), y - S(60 * k)], [x - S(6), y - S(34 * k)], [x - S(60), y - S(36 * k)]]), '#FFFDF5', 1); cut(Pc(x - S(28), y - S(58 * k), S(15 * k)), SLP.egg, 0); }
    for (let i = 0; i < 3; i++) cut(Pe(x + S(70 + i * 22) * k, y - S(16 * k), S(9 * k), S(5 * k), .5), SLP.green, 0);
  }
}
// a big heavy meal: a mound of rice, fried chicken, noodles; a small balanced plate is plate() with o.egg
function bigMeal(x, y, s, k = 1) {
  const S = v => v * s;
  cut(Pe(x, y, S(230), S(72)), '#E7DFD0', 2); cut(Pe(x, y - S(6), S(200), S(60)), SLP.plate, 0);
  cut(Pblob([[x - S(170), y], [x - S(120), y - S(150) * k], [x - S(20), y - S(210) * k], [x + S(70), y - S(160) * k], [x + S(150), y]]), SLP.rice, 2, { edge: .3 });
  for (let i = 0; i < 4; i++) ore(x + S(-110 + i * 70), y - S(40 + (i % 2) * 70) * k, S(44), i % 2 ? '#C8742E' : '#B5652A', 40 + i);
  for (let i = 0; i < 5; i++) strip([[x + S(60 + i * 12), y - S(20)], [x + S(90 + i * 10), y - S(110) * k], [x + S(130 + i * 6), y - S(40)]], '#F2D27A', S(8), 1);
}
function balancedPlate(x, y, s, k = 1) {          // half vegetables, a quarter protein, a quarter rice
  const S = v => v * s;
  cut(Pe(x, y, S(190), S(62)), '#E7DFD0', 2); cut(Pe(x, y - S(6), S(160), S(50)), SLP.plate, 0);
  const a = ease(clamp(k * 3)), b = ease(clamp(k * 3 - 1)), c = ease(clamp(k * 3 - 2));
  if (a > 0) for (let i = 0; i < 7; i++) cut(Pc(x - S(90) + S(i % 4 * 26), y - S(10 + Math.floor(i / 4) * 22) - S(10) * a, S(18) * a), i % 2 ? SLP.green : '#4FA36A', 1);
  if (b > 0) cut(Pblob([[x + S(10), y - S(4)], [x + S(40), y - S(46) * b], [x + S(100), y - S(40) * b], [x + S(120), y - S(4)]]), '#C9824E', 1);
  if (c > 0) cut(Pblob([[x + S(20), y + S(18)], [x + S(60), y - S(10) * c], [x + S(110), y + S(4)], [x + S(80), y + S(30)]]), SLP.rice, 1);
}

// ---------- the body, inside ----------
function brainShape(x, y, s) {
  const S = v => v * s; return Pblob([[x - S(110), y + S(20)], [x - S(118), y - S(40)], [x - S(70), y - S(92)], [x, y - S(104)], [x + S(74), y - S(90)], [x + S(118), y - S(36)], [x + S(108), y + S(30)], [x + S(40), y + S(56)], [x - S(50), y + S(56)]]);
}
function brain(x, y, s, col = SLP.brain, o = {}) {
  const S = v => v * s;
  cut(brainShape(x, y, s), col, o.lv ?? 2, { edge: .25, alpha: o.alpha });
  PX.save(); PX.strokeStyle = mixCol(col, '#7A2E3A', .35); PX.lineWidth = S(6); PX.lineCap = 'round'; PX.globalAlpha = o.alpha ?? 1;
  for (const [a, b, c] of [[[-70, -40], [-30, -70], [10, -40]], [[20, -60], [60, -70], [80, -20]], [[-80, 10], [-40, -10], [0, 20]], [[20, 10], [60, -10], [90, 20]], [[0, -100], [0, -40], [0, 50]]]) {
    PX.beginPath(); PX.moveTo(x + S(a[0]), y + S(a[1])); PX.quadraticCurveTo(x + S(b[0]), y + S(b[1]), x + S(c[0]), y + S(c[1])); PX.stroke(); }
  PX.restore();
}
function stomach(x, y, s, col = '#E98B7A') {
  const S = v => v * s;
  cut(Pblob([[x - S(30), y - S(110)], [x + S(10), y - S(70)], [x + S(80), y - S(60)], [x + S(110), y + S(10)], [x + S(60), y + S(70)], [x - S(40), y + S(60)], [x - S(70), y], [x - S(50), y - S(70)]]), col, 2, { edge: .25 });
}
function gut(x, y, s, t = 0) {                       // the intestine as a coiled paper strip
  const S = v => v * s, P = [];
  for (let i = 0; i <= 80; i++) { const k = i / 80, a = k * TAU * 2.2, r = S(40 + 70 * k); P.push([x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * .8 + Math.sin(k * 30 + t * 2) * S(3)]); }
  strip(P, '#E8A07A', S(30), 2); strip(P, '#F3BC98', S(14), 0);
}
// a sugar cube with a sparkle
function sugarCube(x, y, r, rot = 0, a = 1) {
  PX.save(); PX.translate(x, y); PX.rotate(rot);
  cut(Pr(-r, -r, 2 * r, 2 * r, r * .2), '#FFFFFF', 2, { edge: .4, alpha: a }); cut(Pr(-r, -r, 2 * r, r * .6, r * .2), '#EDEFF5', 0, { alpha: a });
  PX.restore(); shine(x + r * .6, y - r * .6, r * 1.6, '#FFFFFF', .5 * a);
}
// a wake-promoting (orexin) neuron as a little paper lamp: on 0..1 how lit; asleep shows closed eyes
function wakeCell(x, y, r, on, t = 0) {
  const col = mixCol('#6A6487', SLP.orexin, on);
  if (on > .05) shine(x, y, r * 3.2, '#FFE27A', .8 * on);
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .3; strip([[x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6 + Math.sin(t * 2 + i) * 4]], col, r * .18, 1); }
  cut(Pc(x, y, r), col, 2, { edge: .3 });
  for (const side of [-1, 1]) {
    if (on > .5) cut(Pc(x + side * r * .32, y - r * .05, r * .12), SLP.ink, 0, { tex: 0 });
    else strip([[x + side * r * .32 - r * .12, y], [x + side * r * .32 + r * .12, y]], SLP.ink, r * .07, 0);
  }
}
// a dial from "ตื่น" to "ง่วงมาก" with a needle at v 0..1
function gauge(x, y, r, v, label) {
  cut(Pp([...Array.from({ length: 19 }, (_, i) => { const a = Math.PI + i / 18 * Math.PI; return [x + Math.cos(a) * r, y + Math.sin(a) * r]; }), [x, y]]), '#FBF5E8', 2, { edge: .3 });
  for (let i = 0; i < 3; i++) { PX.save(); PX.strokeStyle = ['#7BC86C', '#F2C14E', '#E0614A'][i]; PX.lineWidth = r * .16; PX.beginPath(); PX.arc(x, y, r * .78, Math.PI + i * Math.PI / 3, Math.PI + (i + 1) * Math.PI / 3); PX.stroke(); PX.restore(); }
  const a = Math.PI + clamp(v) * Math.PI;
  strip([[x, y], [x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72]], SLP.ink, r * .07, 1); cut(Pc(x, y, r * .1), SLP.ink, 1);
  if (label) ptext(label, x, y + r * .32, r * .22, '#3A2E2A', { lv: 0, weight: 600 });
}
// a paper clock face with hands at hour h (float)
function clockFace(x, y, r, h) {
  cut(Pc(x, y, r * 1.08), '#C9824E', 3, { sa: .3 }); cut(Pc(x, y, r), '#FBF5E8', 0, { edge: .3 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; cut(Pc(x + Math.sin(a) * r * .84, y - Math.cos(a) * r * .84, r * (i % 3 ? .03 : .06)), SLP.ink, 0, { tex: 0 }); }
  const ah = h / 12 * TAU, am = frac(h) * TAU;
  strip([[x, y], [x + Math.sin(ah) * r * .5, y - Math.cos(ah) * r * .5]], SLP.ink, r * .07, 1);
  strip([[x, y], [x + Math.sin(am) * r * .75, y - Math.cos(am) * r * .75]], '#3A2E2A', r * .045, 1);
  cut(Pc(x, y, r * .07), '#E0614A', 1);
}
