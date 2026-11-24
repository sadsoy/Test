// props.js (sweat): cut-paper props for "เหงื่อออกมากแปลว่าเผาผลาญไขมันมากจริงหรือ?". The character "อิ่ม" comes from
// src/shorts/sleepy/props.js (person); everything here is drawn at a base point with a scale and keeps its shape.

const SWT = { drop: '#6EC6F0', dropDk: '#3A9AD0', salt: '#FFFFFF', fat: '#F7D36B', fatDk: '#E0B341', co2C: '#3A3440', co2O: '#E0614A',
  h2oH: '#FFFFFF', coat: '#FFD23F', coatDk: '#E0B21F', red: '#E0614A', ink: '#2E2430', cool: '#9FE0F5' };

// a sweat drop (teardrop), pointing up
function dropShape(x, y, r) {
  const p = new Path2D(); p.moveTo(x, y - r * 1.6);
  p.bezierCurveTo(x + r * .55, y - r * .8, x + r, y - r * .3, x + r, y + r * .15);
  p.arc(x, y + r * .15, r, 0, Math.PI); p.bezierCurveTo(x - r, y - r * .3, x - r * .55, y - r * .8, x, y - r * 1.6); p.closePath(); return p;
}
function sweatDrop(x, y, r, a = 1, lv = 1) {
  cut(dropShape(x, y, r), SWT.drop, lv, { alpha: a, edge: .35 });
  cut(Pe(x - r * .35, y - r * .1, r * .18, r * .3, -.4), '#FFFFFF', 0, { tex: 0, alpha: .7 * a });
}
// drops flying off a body at (x, y): n drops on arcs, amount k 0..1
function sweatSpray(x, y, t, k, s = 1, n = 8) {
  if (k <= 0) return;
  for (let i = 0; i < n; i++) {
    const p = frac(t * 1.3 + i / n), side = i % 2 ? 1 : -1, dx = side * (60 + 140 * p) * s * (.6 + .4 * hash(i)), dy = (-60 * Math.sin(Math.PI * p) * 2 + 200 * p * p) * s;
    sweatDrop(x + dx + side * 90 * s * hash(i * 3), y - 80 * s * hash(i * 5) + dy, (10 + 6 * hash(i)) * s, k * (1 - p * .6), 1);
  }
}
// a yellow raincoat (poncho) drawn over the character's torso, plus a hood around the head
function raincoat(x, y, s, a = 1) {
  const S = v => v * s;
  PX.save(); PX.globalAlpha = a;
  cut(Pp([[x - S(70), y - S(330)], [x + S(70), y - S(330)], [x + S(150), y - S(120)], [x + S(120), y - S(100)], [x - S(120), y - S(100)], [x - S(150), y - S(120)]]), SWT.coat, 3, { edge: .35 });
  for (const dx of [-60, 0, 60]) strip([[x + S(dx * .6), y - S(320)], [x + S(dx), y - S(110)]], SWT.coatDk, S(4), 0);
  PX.restore();
}
// a bathroom scale with a digital read-out
function bathScale(x, y, s, kg, glow = 0) {
  const S = v => v * s;
  cut(Pr(x - S(220), y - S(70), S(440), S(110), S(40)), '#F4F1EA', 3, { edge: .3 });
  cut(Pr(x - S(110), y - S(52), S(220), S(70), S(12)), '#2E3A40', 0, { tex: .3 });
  if (glow > 0) shine(x, y - S(17), S(160), '#9FF0D0', .35 * glow);
  ptext(kg.toFixed(1), x, y - S(16), S(52), '#9FF0D0', { lv: 0, weight: 700 });
  ptext('kg', x + S(150), y - S(16), S(28), '#5A6A70', { lv: 0 });
}
// a giant cutaway drop: water fills it, a few salt crystals float inside
function bigDrop(x, y, r, t, k = 1) {
  cut(dropShape(x, y, r), SWT.drop, 3, { edge: .35 });
  PX.save(); PX.clip(dropShape(x, y, r));
  for (let i = 0; i < 6; i++) { const yy = y + r * (.9 - i * .38) + Math.sin(t * 1.5 + i) * 6; cut(Pp([[x - r * 1.2, yy], [x + r * 1.2, yy + Math.sin(i) * 10], [x + r * 1.2, yy + r], [x - r * 1.2, yy + r]]), mixCol(SWT.drop, SWT.dropDk, i * .12), 0, { tex: .3, alpha: .5 }); }
  for (let i = 0; i < 5; i++) { const sx = x + (hash(i * 4.1) - .5) * r * 1.1, sy = y + (hash(i * 2.7) - .3) * r * .9 + Math.sin(t * 2 + i) * 8;
    PX.save(); PX.translate(sx, sy); PX.rotate(t * .5 + i); cut(Pr(-10, -10, 20, 20, 3), SWT.salt, 1, { alpha: k, edge: .4 }); PX.restore(); }
  PX.restore();
}
// a fat cell / blob of fat
function fatBlob(x, y, r, t = 0, a = 1) {
  const pts = []; for (let i = 0; i < 9; i++) { const ang = i / 9 * TAU, q = r * (1 + .08 * Math.sin(t * 2 + i * 1.7)); pts.push([x + Math.cos(ang) * q, y + Math.sin(ang) * q * .88]); }
  cut(Pblob(pts), SWT.fat, 3, { alpha: a, edge: .35 });
  for (let i = 0; i < 3; i++) cut(Pc(x + (i - 1) * r * .35, y - r * .1 + (i % 2) * r * .3, r * .16), SWT.fatDk, 0, { alpha: a * .7, tex: .2 });
}
// CO2: O=C=O, and H2O
function co2(x, y, r, rot = 0, a = 1) {
  PX.save(); PX.translate(x, y); PX.rotate(rot);
  strip([[-r * 1.5, 0], [r * 1.5, 0]], '#FFFFFF', r * .3, 0, { alpha: a });
  cut(Pc(-r * 1.6, 0, r * .8), SWT.co2O, 2, { alpha: a, edge: .3 }); cut(Pc(r * 1.6, 0, r * .8), SWT.co2O, 2, { alpha: a, edge: .3 });
  cut(Pc(0, 0, r), SWT.co2C, 2, { alpha: a, edge: .3 });
  PX.restore();
}
function h2o(x, y, r, rot = 0, a = 1) {
  PX.save(); PX.translate(x, y); PX.rotate(rot);
  for (const s of [-1, 1]) { strip([[0, 0], [s * r * 1.2, r * .9]], '#FFFFFF', r * .25, 0, { alpha: a }); cut(Pc(s * r * 1.25, r * .95, r * .55), SWT.h2oH, 2, { alpha: a }); }
  cut(Pc(0, 0, r * .85), SWT.co2O, 2, { alpha: a, edge: .3 });
  PX.restore();
}
// a breath cloud from a mouth, puffing out to the right; k 0..1 how far
function breath(x, y, s, t, k) {
  if (k <= 0) return;
  for (let i = 0; i < 4; i++) { const p = clamp(k * 1.4 - i * .12); if (p <= 0) continue;
    cloud(x + (60 + i * 90) * s * p, y - i * 18 * s, (.35 + i * .12) * s, '#EAF6FB', 2, { alpha: .9 * (1 - i * .12) }); }
}
// a thermometer with level 0..1 (red rises)
function thermometer(x, y, s, v) {
  const S = v2 => v2 * s;
  cut(Pr(x - S(26), y - S(300), S(52), S(300), S(26)), '#FBF5E8', 3, { edge: .3 });
  cut(Pc(x, y, S(46)), '#FBF5E8', 3);
  const col = mixCol('#6EC6F0', SWT.red, v);
  cut(Pc(x, y, S(34)), col, 0); cut(Pr(x - S(12), y - S(40) - S(240) * v, S(24), S(40) + S(240) * v, S(12)), col, 0);
  for (let i = 1; i < 6; i++) strip([[x + S(26), y - S(40) - S(44) * i], [x + S(40), y - S(40) - S(44) * i]], '#9A8C7E', S(3), 0);
}
// a water bottle that empties (k 1 full → 0)
function bottle(x, y, s, k, rot = 0) {
  const S = v => v * s;
  PX.save(); PX.translate(x, y); PX.rotate(rot);
  cut(Pr(-S(50), -S(220), S(100), S(220), S(26)), 'rgba(235,248,255,.95)', 3, { edge: .4 });
  if (k > 0) cut(Pr(-S(42), -S(8) - S(190) * k, S(84), S(190) * k, S(18)), SWT.drop, 0, { tex: .3 });
  cut(Pr(-S(26), -S(262), S(52), S(46), S(8)), '#3A9AD0', 2);
  PX.restore();
}
// a flame (energy actually used), size k
function flame(x, y, s, t, k = 1) {
  if (k <= 0) return;
  const S = v => v * s * k, f = 1 + .08 * Math.sin(t * 13) + .05 * Math.sin(t * 21);
  shine(x, y - S(80), S(220), '#FF9A3C', .6);
  cut(Pblob([[x - S(80), y], [x - S(70), y - S(110) * f], [x - S(10), y - S(220) * f], [x + S(30), y - S(140) * f], [x + S(70), y - S(190) * f], [x + S(85), y - S(60)], [x + S(40), y + S(20)], [x - S(40), y + S(20)]]), '#F07B2A', 2, { edge: .2 });
  cut(Pblob([[x - S(40), y], [x - S(30), y - S(80) * f], [x + S(5), y - S(140) * f], [x + S(40), y - S(70) * f], [x + S(30), y + S(10)]]), '#FFD36B', 0);
}
// heat waves rising from (x, y)
function heatWaves(x, y, s, t, k = 1, col = '#FF8A5C') {
  if (k <= 0) return;
  for (let i = 0; i < 3; i++) { const P = []; const p = frac(t * .6 + i / 3);
    for (let j = 0; j <= 10; j++) P.push([x + (i - 1) * 70 * s + Math.sin(j * .9 + t * 4) * 12 * s, y - j * 18 * s - p * 140 * s]);
    strip(P, col, 8 * s, 0, { alpha: k * Math.sin(Math.PI * p) }); }
}
// a warning triangle
function warn(x, y, r, a = 1) { cut(Pp([[x, y - r], [x + r * 1.1, y + r * .8], [x - r * 1.1, y + r * .8]]), '#FFD23F', 3, { alpha: a, edge: .4 }); ptext('!', x, y + r * .15, r * 1.1, '#2E2430', { lv: 0, weight: 800, alpha: a }); }
