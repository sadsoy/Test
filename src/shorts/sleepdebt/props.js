// props.js (sleepdebt): cut-paper props for "นอนชดเชยวันหยุดทดแทนการอดนอนได้ไหม?". The character "อิ่ม" (person) comes
// from src/shorts/sleepy/props.js, the scale from sweat, the battery and sky from the shared props. Shapes are fixed;
// only bars, coins, needles and lids move.

const SD = { night: '#26305E', moon: '#F5EFD8', bar: '#7B66C9', barShort: '#E0614A', barLong: '#2E9C8E', coin: '#F2C14E', coinDk: '#C9952E',
  pig: '#F7A8B8', pigDk: '#E07F95', ink: '#2E2430', tire: '#2F2A2E', patch: '#C9824E' };
const DAYS = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];

// a week of sleep bars: hours[i] per day, drawn 0..12 h over height h; k 0..1 grows them in; o.need draws the 8 h line
function weekBars(x, y, w, h, hours, k = 1, o = {}) {
  const bw = w / 7;
  cut(Pr(x - 20, y - h - 70, w + 40, h + 140, 24), '#FBF5E8', 3, { edge: .3 });
  if (o.need != null) { const ny = y - h * o.need / 12; PX.save(); PX.setLineDash([14, 10]); PX.strokeStyle = '#2E9C8E'; PX.lineWidth = 5; PX.beginPath(); PX.moveTo(x, ny); PX.lineTo(x + w, ny); PX.stroke(); PX.restore();
    ptext(`${o.need} ชม.`, x + w - 10, ny - 22, 26, '#2E9C8E', { lv: 0, weight: 700, align: 'right' }); }
  hours.forEach((hr, i) => {
    const kk = clamp(k * 1.6 - i * .09), bh = h * hr / 12 * backOut(kk), bx = x + i * bw + bw * .18;
    if (kk <= 0) return;
    const col = (o.colors && o.colors[i]) || (hr < 6 ? SD.barShort : hr > 9 ? SD.barLong : SD.bar);
    cut(Pr(bx, y - bh, bw * .64, bh, 10), col, 2, { edge: .25 });
    if (o.ghost && o.ghost[i]) { PX.save(); PX.setLineDash([8, 8]); PX.strokeStyle = '#8E8A99'; PX.lineWidth = 4; const gh = h * o.ghost[i] / 12; PX.strokeRect(bx, y - gh, bw * .64, gh); PX.restore(); }
    if (hr >= .5) ptext(`${hr}`, bx + bw * .32, y - bh - 24, 30, '#3A2E2A', { lv: 0, weight: 700, alpha: kk });
    ptext(DAYS[i], bx + bw * .32, y + 36, 30, '#5A4A44', { lv: 0, weight: 600 });
  });
}
// a coin; k scale
function coin(x, y, r, k = 1, rot = 0) {
  if (k <= 0) return;
  PX.save(); PX.translate(x, y); PX.rotate(rot); PX.scale(k, k);
  cut(Pc(0, 0, r), SD.coin, 2, { edge: .4 }); cut(Pc(0, 0, r * .72), SD.coinDk, 0, { alpha: .5 });
  ptext('z', 0, 2, r * 1.1, '#FFF3C4', { lv: 0, weight: 800 });
  PX.restore();
}
// a paper piggy bank; debt 0..1 cracks it and darkens the label
function piggy(x, y, s, t, debt = 0) {
  const S = v => v * s;
  for (const dx of [-70, 50]) cut(Pr(x + S(dx), y + S(60), S(34), S(60), S(10)), SD.pigDk, 2);
  cut(Pe(x, y, S(170), S(120)), SD.pig, 3, { edge: .3 });
  cut(Pe(x + S(160), y - S(10), S(40), S(36)), SD.pigDk, 1); cut(Pc(x + S(150), y - S(16), S(6)), SD.ink, 0); cut(Pc(x + S(172), y - S(4), S(6)), SD.ink, 0);
  cut(Pp([[x + S(60), y - S(110)], [x + S(90), y - S(160)], [x + S(110), y - S(100)]]), SD.pigDk, 1);
  cut(Pc(x + S(90), y - S(40), S(10)), SD.ink, 0);
  cut(Pr(x - S(50), y - S(124), S(100), S(14), S(7)), SD.ink, 0);
  if (debt > .05) { strip([[x - S(40), y - S(60)], [x - S(10), y - S(10)], [x - S(40), y + S(30)], [x - S(5), y + S(80)]], SD.ink, S(5), 0, { alpha: debt }); }
}
// insulin as a key and the cell's lock; fit 1 = opens easily, 0 = jams
function keyLock(x, y, s, t, fit) {
  const S = v => v * s, jam = 1 - fit, turn = fit * .8 * ease(frac(t * .5)) - jam * .15 * Math.abs(Math.sin(t * 14));
  cut(Pr(x - S(130), y - S(170), S(260), S(330), S(40)), '#9FD8C8', 3, { edge: .3 });
  ptext('เซลล์', x, y - S(120), S(40), '#1F4E46', { lv: 0, weight: 800 });
  cut(Pc(x, y, S(46)), '#2E4A44', 1); cut(Pr(x - S(14), y, S(28), S(70)), '#2E4A44', 1);
  PX.save(); PX.translate(x - S(230) + S(40) * fit, y); PX.rotate(turn);
  cut(Pc(-S(70), 0, S(50)), SD.coin, 2, { edge: .4 }); cut(Pc(-S(70), 0, S(20)), '#FBF5E8', 0);
  cut(Pr(-S(24), -S(12), S(190), S(24), S(6)), SD.coin, 2); for (let i = 0; i < 3; i++) cut(Pr(S(100 + i * 24), S(10), S(14), S(22)), SD.coin, 1);
  PX.restore();
  ptext('อินซูลิน', x - S(240), y + S(90), S(34), '#7A5A1A', { lv: 0, weight: 700 });
}
// a fridge at night with its light spilling out; open 0..1
function fridge(x, y, s, open) {
  const S = v => v * s;
  cut(Pr(x - S(130), y - S(420), S(260), S(420), S(22)), '#E9EEF2', 3, { edge: .3 });
  if (open > 0) { shine(x + S(40), y - S(220), S(320), '#FFF3C4', .7 * open); cut(Pr(x - S(110), y - S(400), S(220), S(380), S(12)), '#FFF8DC', 0, { alpha: open });
    for (let i = 0; i < 3; i++) cut(Pr(x - S(110), y - S(300) + i * S(100), S(220), S(8)), '#DCE3E8', 0, { alpha: open }); }
  PX.save(); PX.translate(x + S(130), y - S(420)); PX.scale(1 - .85 * open, 1); cut(Pr(-S(260), 0, S(260), S(420), S(22)), '#DDE5EA', 2, { edge: .3 }); PX.restore();
}
function snack(kind, x, y, r, rot = 0, a = 1) {
  PX.save(); PX.translate(x, y); PX.rotate(rot);
  if (kind === 0) { cut(Pc(0, 0, r), '#C98B4E', 2, { alpha: a }); for (let i = 0; i < 4; i++) cut(Pc(Math.cos(i * 1.7) * r * .5, Math.sin(i * 2.3) * r * .5, r * .14), '#5A3A2A', 0, { alpha: a }); }
  if (kind === 1) { cut(Pp([[-r, -r * .8], [r, -r * .6], [r * .9, r * .9], [-r * .8, r]]), '#E0614A', 2, { alpha: a }); ptext('ขนม', 0, 0, r * .55, '#FFFFFF', { lv: 0, weight: 800, alpha: a }); }
  if (kind === 2) { cut(Pp([[0, -r], [r * .9, r * .7], [-r * .9, r * .7]]), '#F2C14E', 2, { alpha: a }); cut(Pc(r * .1, r * .1, r * .15), '#E0614A', 0, { alpha: a }); }
  PX.restore();
}
// a tyre: patched (leaks, a little hiss) or new (round and full)
function tire(x, y, r, patched, t) {
  const sq = patched ? .9 + .04 * Math.sin(t * 3) : 1;
  PX.save(); PX.translate(x, y); PX.scale(1, sq);
  cut(Pc(0, 0, r), SD.tire, 3, { edge: .2 }); cut(Pc(0, 0, r * .55), '#BFC6CC', 1); cut(Pc(0, 0, r * .18), '#7E8890', 1);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; strip([[Math.cos(a) * r * .82, Math.sin(a) * r * .82], [Math.cos(a) * r * .97, Math.sin(a) * r * .97]], '#4A4448', r * .06, 0); }
  if (patched) { PX.save(); PX.rotate(-.6); cut(Pr(r * .5, -r * .18, r * .45, r * .36, r * .06), SD.patch, 2, { edge: .3 }); PX.restore(); }
  PX.restore();
  if (patched) for (let i = 0; i < 3; i++) { const p = frac(t * .9 + i / 3); ptext('ฟู่', x + r * .9 + p * r * .7, y - r * .7 - p * r * .4, r * .22, '#FFFFFF', { lv: 1, alpha: Math.sin(Math.PI * p) * .9 }); }
}
// a little bed with a sleeper (the character's head on a pillow) — lid 1 = asleep
function bed(x, y, s, t, asleep = 1) {
  const S = v => v * s;
  cut(Pr(x - S(220), y - S(70), S(440), S(70), S(14)), '#8C6A4E', 2);
  cut(Pr(x - S(230), y - S(170), S(40), S(170), S(10)), '#7A5A40', 2);
  cut(Pe(x - S(130), y - S(100), S(70), S(34)), '#FBF8F2', 2);
  cut(Pc(x - S(120), y - S(140), S(48)), SLP.skin, 2); cut(Pblob([[x - S(168), y - S(140)], [x - S(150), y - S(186)], [x - S(90), y - S(186)], [x - S(72), y - S(150)], [x - S(120), y - S(160)]]), SLP.hair, 1);
  for (const ex of [-138, -104]) strip([[x + S(ex - 8), y - S(140)], [x + S(ex), y - S(134)], [x + S(ex + 8), y - S(140)]], SLP.ink, S(4), 0);
  cut(Pblob([[x - S(80), y - S(150)], [x + S(200), y - S(140)], [x + S(220), y - S(70)], [x - S(80), y - S(70)]]), '#7B66C9', 2, { edge: .2 });
  for (let i = 0; i < 3; i++) strip([[x - S(40) + i * S(80), y - S(140)], [x - S(40) + i * S(80), y - S(72)]], '#9A88DA', S(5), 0);
}
// a jar of coins with a sprout that grows with k
function jarPlant(x, y, s, k, t) {
  const S = v => v * s;
  cut(Pr(x - S(110), y - S(200), S(220), S(200), S(30)), 'rgba(220,240,255,.6)', 2, { edge: .5 });
  const n = Math.floor(k * 7); for (let i = 0; i < n; i++) coin(x - S(60) + (i % 3) * S(60), y - S(30) - Math.floor(i / 3) * S(40), S(26), 1, i);
  const h = S(40 + 200 * k); strip([[x, y - S(200)], [x + Math.sin(t) * S(6), y - S(200) - h]], '#4FA36A', S(10), 1);
  for (let i = 0; i < Math.floor(k * 4); i++) { const yy = y - S(220) - i * h / 4, sd = i % 2 ? 1 : -1; cut(Pe(x + sd * S(34), yy, S(36), S(16), sd * -.5), '#6DBE6A', 1); }
}
