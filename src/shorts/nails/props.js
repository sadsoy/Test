// props.js (nails): cut-paper props for "เล็บและผมยังยาวหลังเสียชีวิตจริงไหม?". Kept tasteful: hands, a chin, cells,
// a heart, a grape. Shapes are fixed; the skin fold and the skin surface move, which is the whole point of the story:
// the nail and the hair stay the same length while the skin around them pulls back.

const NAI = { skin: '#F2C3A0', skinDk: '#D99E78', skinDry: '#D9B39A', nail: '#F7DCD6', nailTip: '#FFF4F0', nailDk: '#E9B9B0',
  cell: '#F29C8C', cellOff: '#A9A3AE', blood: '#D6334A', o2: '#9FD8F0', ink: '#2E2430', hair: '#3B2A2A' };

// a fingertip seen from the side, pointing right. The nail plate has a fixed length (nailLen). skinBack 0..1 pulls the
// skin fold at the base of the nail back, and pulls the skin at the tip back from under the free edge: more nail shows.
// dry 0..1 shifts the skin to a paler, drier colour. Returns the x where the visible nail starts (for rulers).
function fingertip(x, y, s, o = {}) {
  const S = v => v * s, back = clamp(o.skinBack ?? 0), dry = clamp(o.dry ?? 0), len = o.nailLen ?? 260;
  const skin = mixCol(NAI.skin, NAI.skinDry, dry), skinDk = mixCol(NAI.skinDk, '#C4977E', dry);
  // finger body: slimmer, with a rounded pad at the tip
  cut(Pblob([[x - S(520), y - S(84)], [x - S(40), y - S(90)], [x + S(150), y - S(84)], [x + S(232), y - S(52)], [x + S(262), y + S(4)], [x + S(232), y + S(66)], [x + S(120), y + S(88)], [x - S(520), y + S(88)]]), skin, 3, { edge: .2 });
  for (const kx of [-420, -300]) for (let k = 0; k < 3; k++) strip([[x + S(kx + k * 14), y - S(60)], [x + S(kx + k * 14 + 6), y + S(10)]], skinDk, S(4), 0);   // knuckle creases
  // the nail plate (fixed length), thick enough to read, with a pale free edge and a lunula
  const nx0 = x - S(60), ny = y - S(90);
  cut(Pblob([[nx0, ny + S(20)], [nx0 + S(24), ny - S(14)], [nx0 + S(len) * .9, ny - S(18)], [nx0 + S(len) + S(14), ny + S(8)], [nx0 + S(len) * .96, ny + S(30)], [nx0 + S(20), ny + S(30)]]), NAI.nail, 2, { edge: .45 });
  cut(Pr(nx0 + S(len) * .78, ny - S(14), S(len) * .24, S(40), S(14)), NAI.nailTip, 0, { tex: .2 });
  cut(Pe(nx0 + S(40), ny + S(8), S(26), S(16)), '#FCEDEA', 0, { tex: .2 });
  // skin fold (cuticle) over the base of the nail: retracts to the left by up to 80 px
  const fx = nx0 + S(70) - S(80) * back;
  cut(Pblob([[fx - S(150), ny + S(2)], [fx - S(40), ny - S(2)], [fx + S(8), ny + S(6)], [fx + S(4), ny + S(32)], [fx - S(150), ny + S(36)]]), skin, 0, { tex: .5 });   // skin over the nail root, flush
  strip([[fx + S(2), ny - S(2)], [fx + S(8), ny + S(10)], [fx + S(2), ny + S(28)]], skinDk, S(4), 0);     // the cuticle edge
  // the fingertip pulp under the free edge also pulls back
  if (back > 0) { const tipX = x + S(226) - S(40) * back;
    cut(Pblob([[x + S(120), y - S(56)], [tipX, y - S(50)], [tipX + S(26), y + S(4)], [tipX - S(8), y + S(64)], [x + S(120), y + S(88)]]), skin, 0); }
  return { nailStart: fx, nailEnd: nx0 + S(len) + S(14), ny };
}
// a finger seen from above, pointing up, base at (x, y). The nail plate is fixed (top at nailTop, base at nailBase);
// back 0..1 slides the skin fold at the nail root down (and the side folds out), so more of the same nail shows.
// hidden: alpha of a dashed outline of the part of the nail under the skin. Returns { top, cut } y of the visible nail.
function fingerTop(x, y, s, o = {}) {
  const S = v => v * s, back = clamp(o.back ?? 0), dry = clamp(o.dry ?? back), w = S(110), top = y - S(520);
  const skin = mixCol(NAI.skin, NAI.skinDry, dry), skinDk = mixCol(NAI.skinDk, '#C4977E', dry);
  cut(Pr(x - w, top, 2 * w, S(560), w), skin, 3, { edge: .2 });
  for (let k = 0; k < 3; k++) strip([[x - S(50), y - S(130) + k * S(14)], [x + S(50), y - S(126) + k * S(14)]], skinDk, S(4), 0);   // knuckle creases
  const nw = S(150), nTop = top + S(14), nBase = top + S(250);
  const fold = nBase - S(60) + S(70) * back, side = S(16) * (1 - back);      // the cuticle line moves down as the skin shrinks
  cut(Pr(x - nw / 2, nTop, nw, nBase - nTop, [S(70), S(70), S(24), S(24)]), NAI.nail, 2, { edge: .45 });
  cut(Pr(x - nw / 2, nTop, nw, S(40), [S(70), S(70), 0, 0]), NAI.nailTip, 0, { tex: .2 });
  cut(Pe(x, fold - S(4), S(48), S(26)), '#FCEDEA', 0, { tex: .2 });                                   // lunula
  // skin over the nail root and the sides (hides the hidden part of the plate)
  const P = new Path2D(); P.moveTo(x - w, fold + S(30)); P.lineTo(x - nw / 2 - S(4), fold + S(30)); P.quadraticCurveTo(x, fold - S(36), x + nw / 2 + S(4), fold + S(30)); P.lineTo(x + w, fold + S(30)); P.lineTo(x + w, y + S(40)); P.lineTo(x - w, y + S(40)); P.closePath();
  cut(P, skin, 0, { tex: .7 });                       // same colour and fibres as the finger: no seam
  PX.save(); PX.strokeStyle = skinDk; PX.lineWidth = S(5); PX.lineCap = 'round'; PX.shadowColor = SHADE + '.25)'; PX.shadowBlur = S(6); PX.shadowOffsetY = -S(2);
  PX.beginPath(); PX.moveTo(x - nw / 2 - S(4), fold + S(30)); PX.quadraticCurveTo(x, fold - S(36), x + nw / 2 + S(4), fold + S(30)); PX.stroke(); PX.restore();   // the cuticle: a smooth arch
  if (side > .5) for (const sd of [-1, 1]) cut(Pr(sd < 0 ? x - nw / 2 - S(2) : x + nw / 2 - side + S(2), nTop + S(60), side, fold - nTop - S(40), S(6)), skin, 0, { tex: .4 });
  if (o.hidden > 0) { PX.save(); PX.globalAlpha *= o.hidden; PX.setLineDash([S(10), S(8)]); PX.strokeStyle = '#B5483A'; PX.lineWidth = S(4);
    PX.beginPath(); PX.moveTo(x - nw / 2, fold + S(10)); PX.lineTo(x - nw / 2, nBase - S(24)); PX.quadraticCurveTo(x - nw / 2, nBase, x - nw / 2 + S(24), nBase); PX.lineTo(x + nw / 2 - S(24), nBase); PX.quadraticCurveTo(x + nw / 2, nBase, x + nw / 2, nBase - S(24)); PX.lineTo(x + nw / 2, fold + S(10)); PX.stroke(); PX.restore(); }
  return { top: nTop, cut: fold - S(4), base: nBase };
}
// a vertical ruler from a (top) to b at x, with a label
function rulerV(x, a, b, label, col, alpha = 1) {
  if (alpha <= 0) return;
  strip([[x, a], [x, b]], col, 8, 1, { alpha }); strip([[x - 16, a], [x + 16, a]], col, 6, 0, { alpha }); strip([[x - 16, b], [x + 16, b]], col, 6, 0, { alpha });
  if (label) ptext(label, x, b + 36, 30, col, { lv: 0, weight: 700, alpha });
}
// a ruler under a span [a, b] at y with a label
function rulerSpan(a, b, y, label, col = '#2E9C8E', alpha = 1) {
  if (alpha <= 0) return;
  strip([[a, y], [b, y]], col, 8, 1, { alpha }); strip([[a, y - 16], [a, y + 16]], col, 6, 0, { alpha }); strip([[b, y - 16], [b, y + 16]], col, 6, 0, { alpha });
  if (label) ptext(label, (a + b) / 2, y + 44, 34, col, { lv: 0, weight: 700, alpha });
}
// a chin in profile with stubble; skinDrop 0..1 lowers the skin surface so the same hairs stick out further
function chin(x, y, s, skinDrop = 0, dry = 0) {
  // the underside of a jaw seen from the side; hairs have fixed roots and fixed lengths, and point down out of the skin.
  // skinDrop 0..1 pulls the skin surface up (it shrinks back), so more of each hair shows.
  const S = v => v * s, surf = y + S(22) - S(30) * skinDrop, skin = mixCol(NAI.skin, NAI.skinDry, dry);
  for (let i = 0; i < 14; i++) { const hx = x - S(220) + i * S(32), root = y - S(4) + Math.sin(i * 1.3) * S(4);
    strip([[hx, root], [hx + S(6), root + S(58)]], NAI.hair, S(7), 0); }
  cut(Pblob([[x - S(300), y - S(220)], [x + S(200), y - S(220)], [x + S(270), y - S(120)], [x + S(260), y - S(20)], [x + S(200), surf], [x - S(240), surf + S(2)], [x - S(300), surf - S(10)]]), skin, 2, { edge: .2 });
  strip([[x + S(250), y - S(110)], [x + S(200), y - S(100)]], NAI.skinDk, S(8), 0);       // the lips' corner, so it reads as a face
  ptext('คาง', x - S(150), y - S(120), S(40), '#7A4A3A', { lv: 0, weight: 700 });
}
// a paper heart; beat 0..1 scale pulse
function heart(x, y, r, beat = 0, col = NAI.blood) {
  const k = 1 + .12 * beat, p = new Path2D();
  p.moveTo(x, y + r * .9 * k); p.bezierCurveTo(x - r * 1.4 * k, y - r * .1 * k, x - r * .7 * k, y - r * 1.1 * k, x, y - r * .45 * k);
  p.bezierCurveTo(x + r * .7 * k, y - r * 1.1 * k, x + r * 1.4 * k, y - r * .1 * k, x, y + r * .9 * k); p.closePath();
  cut(p, col, 3, { edge: .3 });
}
// an ECG trace; flat 0..1 flattens it
function ecg(x0, x1, y, t, flat, col = '#9FF0D0') {
  const P = []; for (let i = 0; i <= 160; i++) { const u = i / 160, x = lerp(x0, x1, u), ph = frac(u * 3 - t * .9);
    const beat = ph > .4 && ph < .46 ? -90 * Math.sin((ph - .4) / .06 * Math.PI) : ph > .46 && ph < .5 ? 30 * Math.sin((ph - .46) / .04 * Math.PI) : 0;
    P.push([x, y + beat * (1 - flat)]); }
  strip(P, col, 6, 0);
}
// a tiny paper factory: lit windows and a moving belt when on
function factory(x, y, s, on, t) {
  const S = v => v * s, col = mixCol('#8E8A99', '#F2A65A', on);
  cut(Pp([[x - S(160), y], [x - S(160), y - S(120)], [x - S(80), y - S(170)], [x - S(80), y - S(120)], [x, y - S(170)], [x, y - S(120)], [x + S(80), y - S(170)], [x + S(80), y - S(120)], [x + S(160), y - S(120)], [x + S(160), y]]), col, 3, { edge: .2 });
  for (let i = 0; i < 4; i++) cut(Pr(x - S(130) + i * S(70), y - S(90), S(40), S(40), S(6)), mixCol('#4A4870', '#FFE6A3', on), 0, { tex: .2 });
  if (on > .5) shine(x, y - S(70), S(180), '#FFE27A', .3 * on);
  cut(Pr(x + S(110), y - S(260), S(34), S(100)), mixCol('#6A6487', '#9A8C7E', on), 2);
  if (on > .1) smoke(x + S(127), y - S(260), .45 * s, t, on * .8, '#E8E0D6', { drift: 60, n: 4 });
}
// a grape that dries into a raisin: k 0 → 1 (shrinks, darkens, wrinkles)
function grape(x, y, r, k) {
  const rr = r * (1 - .42 * k), col = mixCol('#8FCB5C', '#6A3A2E', k);
  const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, q = rr * (1 + k * .08 * Math.sin(i * 5)); pts.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); }
  cut(Pblob(pts), col, 3, { edge: .3 * (1 - k) });
  if (k < .5) cut(Pe(x - rr * .35, y - rr * .35, rr * .25, rr * .15, -.6), '#FFFFFF', 0, { tex: 0, alpha: .5 * (1 - k * 2) });
  for (let i = 0; i < 4; i++) { const a = i * 1.4 + .3; if (k > .2) strip([[x + Math.cos(a) * rr * .2, y + Math.sin(a) * rr * .2], [x + Math.cos(a + .5) * rr * .75, y + Math.sin(a + .5) * rr * .75]], mixCol(col, '#2E1A14', .4), rr * .06, 0, { alpha: seg(k, .2, .7) }); }
  strip([[x, y - rr], [x + r * .12, y - rr - r * .3]], '#6B5040', r * .08, 1);
}
// a tube of cream squeezing a dollop (k 0..1)
function creamTube(x, y, s, k) {
  const S = v => v * s;
  PX.save(); PX.translate(x, y); PX.rotate(-.5);
  cut(Pp([[-S(60), -S(200)], [S(60), -S(200)], [S(50), S(40)], [-S(50), S(40)]]), '#FBF8F2', 3, { edge: .4 });
  cut(Pr(-S(60), -S(200), S(120), S(30), S(6)), '#7FC3DC', 0);
  cut(Pr(-S(22), S(40), S(44), S(40), S(8)), '#3A9AD0', 2);
  PX.restore();
  if (k > 0) cut(Pblob([[x + S(60), y + S(120)], [x + S(60 + 60 * k), y + S(100)], [x + S(60 + 90 * k), y + S(130)], [x + S(60), y + S(150)]]), '#FFFFFF', 2, { edge: .4 });
}
// a magnifying glass
function magnifier(x, y, r, a = 1) {
  cut(Pu(Pc(x, y, r * 1.12), Pc(x, y, r * .92)), '#5A4A44', 3, { rule: 'evenodd', alpha: a });
  cut(Pc(x, y, r * .92), 'rgba(220,240,255,.35)', 0, { tex: 0, alpha: a });
  strip([[x + r * .8, y + r * .8], [x + r * 1.6, y + r * 1.6]], '#5A4A44', r * .22, 3, { alpha: a });
}
