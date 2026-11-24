// props.js (sneeze): cut-paper props for "ทำไมเราไม่ควรกลั้นจาม?". The character "อิ่ม" is person() from
// src/shorts/sleepy/props.js. Injuries are shown as small diagram marks, never graphically.

const SNZ = { dust: '#E8C35A', skin: '#F4C9A2', skinDk: '#E3AD84', air: '#9FD8F0', airHot: '#FF8A6A', tube: '#F2A7B5', tubeDk: '#D97F92',
  lung: '#F7B7C2', cork: '#C9824E', ink: '#2E2430', drop: '#7FC3E8' };

// a dust / pollen speck
function dust(x, y, r, rot = 0, a = 1) {
  const pts = []; for (let i = 0; i < 12; i++) { const ang = rot + i / 12 * TAU, q = i % 2 ? r * .6 : r; pts.push([x + Math.cos(ang) * q, y + Math.sin(ang) * q]); }
  cut(Pp(pts), SNZ.dust, 1, { alpha: a });
}
// a hand pinching the nose with the palm over the mouth, placed over a person's face (head centre hx, hy, scale s)
function pinchHand(hx, hy, s, k = 1) {
  if (k <= 0) return;
  const S = v => v * s;
  PX.save(); PX.globalAlpha *= k; PX.translate(0, (1 - k) * S(160));
  cut(Pblob([[hx - S(70), hy + S(30)], [hx + S(70), hy + S(30)], [hx + S(80), hy + S(110)], [hx, hy + S(150)], [hx - S(80), hy + S(110)]]), SNZ.skin, 3, { edge: .3 });
  for (const sd of [-1, 1]) cut(Pe(hx + sd * S(22), hy + S(18), S(16), S(26)), SNZ.skin, 2, { edge: .3 });   // finger and thumb on the nose
  strip([[hx - S(40), hy + S(80)], [hx + S(40), hy + S(80)]], SNZ.skinDk, S(4), 0);
  PX.restore();
}
// puffed-out cheeks (pressure) over a face
function puffCheeks(hx, hy, s, k) {
  if (k <= 0) return; const S = v => v * s;
  for (const sd of [-1, 1]) cut(Pe(hx + sd * S(86), hy + S(46), S(30 + 14 * k), S(22 + 10 * k)), '#F29C8C', 1, { alpha: .85 * k });
}
// the airway in profile (facing right), centred so the throat is at (x, y). o: inflate 0..1 (lungs), glottis 0..1 (closed),
// corks 0..1 (nose and mouth sealed), pressure 0..1 (air colour and arrows), out 0..1 (air rushing out), tear 0..1.
function airway(x, y, s, t, o = {}) {
  const S = v => v * s, inf = o.inflate ?? 0, pr = o.pressure ?? 0, airCol = mixCol(SNZ.air, SNZ.airHot, pr);
  // head and torso silhouettes
  // a clear profile: torso, neck, round skull, jaw, nose and lips (facing right); the brain sits inside the skull
  cut(Pr(x - S(260), y + S(160), S(500), S(560), S(120)), '#7FB8D8', 2, { edge: .2 });
  cut(Pr(x - S(80), y + S(20), S(140), S(190), S(30)), SNZ.skin, 2);
  cut(Pblob([[x - S(170), y - S(30)], [x + S(150), y - S(70)], [x + S(205), y + S(10)], [x + S(195), y + S(60)], [x + S(120), y + S(100)], [x + S(20), y + S(110)], [x - S(110), y + S(60)]]), SNZ.skin, 2, { edge: .2 });
  cut(Pc(x - S(10), y - S(170), S(215)), SNZ.skin, 3, { edge: .2 });
  cut(Pp([[x + S(170), y - S(190)], [x + S(262), y - S(98)], [x + S(185), y - S(80)]]), SNZ.skin, 2, { edge: .2 });            // nose
  cut(Pe(x + S(206), y + S(18), S(18), S(26)), '#E89A8A', 1);                                                                 // lips
  cut(Pc(x + S(110), y - S(200), S(14)), SNZ.ink, 0);                                                                         // eye
  cut(Pblob([[x - S(230), y - S(170)], [x - S(160), y - S(360)], [x + S(40), y - S(395)], [x + S(160), y - S(320)], [x + S(60), y - S(320)], [x - S(140), y - S(280)]]), SLP.hair, 1);
  brain(x - S(50), y - S(220), .62 * s, mixCol('#E9B3BE', '#FF9AB0', o.brainLit ?? 0), { lv: 1 });
  if ((o.brainLit ?? 0) > 0) shine(x - S(50), y - S(220), S(160), '#FFE27A', .6 * o.brainLit);
  // passages: nose, mouth, throat, windpipe
  const nose = [[x + S(235), y - S(108)], [x + S(130), y - S(112)], [x + S(40), y - S(90)], [x, y - S(40)]];
  const mouth = [[x + S(195), y + S(18)], [x + S(100), y + S(18)], [x + S(30), y + S(8)], [x, y - S(20)]];
  const pipe = [[x, y - S(40)], [x - S(8), y + S(80)], [x - S(10), y + S(200)], [x - S(10), y + S(400)]];
  for (const P of [nose, mouth, pipe]) { strip(P, SNZ.tubeDk, S(46), 1); strip(P, mixCol(SNZ.tube, '#FFD0C0', pr * .5), S(32), 0); }
  // lungs
  for (const sd of [-1, 1]) { const r = S(110 + 40 * inf); cut(Pblob([[x - S(10) + sd * S(20), y + S(400)], [x - S(10) + sd * (r + S(20)), y + S(380)], [x - S(10) + sd * (r * 1.3), y + S(500)], [x - S(10) + sd * (r * 1.1), y + S(620)], [x - S(10) + sd * S(30), y + S(600)]]), mixCol(SNZ.lung, '#FF9A9A', pr), 2, { edge: .25 }); }
  // the glottis: a little flap in the throat that closes
  PX.save(); PX.translate(x - S(8), y + S(110)); PX.rotate(-1.2 * (1 - (o.glottis ?? 0))); cut(Pr(-S(4), -S(4), S(30), S(10), S(5)), '#B5483A', 1); PX.restore();
  PX.save(); PX.translate(x - S(8), y + S(110)); PX.rotate(Math.PI + 1.2 * (1 - (o.glottis ?? 0))); cut(Pr(-S(4), -S(4), S(30), S(10), S(5)), '#B5483A', 1); PX.restore();
  // pressure arrows inside the windpipe
  if (pr > 0) for (let i = 0; i < 4; i++) { const p = frac(t * (1 + 2 * pr) + i / 4), yy = y + S(380) - p * S(260);
    cut(Pp([[x - S(10), yy - S(16)], [x + S(4), yy + S(4)], [x - S(24), yy + S(4)]]), airCol, 0, { tex: 0, alpha: .9 * pr }); }
  if (pr > .5) shine(x - S(10), y + S(150), S(220), '#FF7A5A', .4 * (pr - .5) * 2);
  // corks sealing the nose and the mouth
  const ck = o.corks ?? 0;
  if (ck > 0) { cut(Pr(x + S(228), y - S(126), S(44) * ck, S(36), S(6)), SNZ.cork, 2, { edge: .3 }); cut(Pr(x + S(188), y + S(0), S(44) * ck, S(36), S(6)), SNZ.cork, 2, { edge: .3 }); }
  // air rushing out of the nose and mouth
  const ot = o.out ?? 0;
  if (ot > 0) for (let i = 0; i < 10; i++) { const p = frac(t * 1.6 + i / 10), from = i % 2 ? [x + S(240), y - S(108)] : [x + S(200), y + S(18)];
    cut(Pc(from[0] + p * S(300) * (1 + .3 * hash(i)), from[1] + (hash(i * 3) - .5) * p * S(160), S(8 + 6 * hash(i))), SNZ.drop, 1, { alpha: ot * (1 - p) }); }
  // a small tear mark on the windpipe
  const tr = o.tear ?? 0;
  if (tr > 0) { strip([[x - S(34), y + S(300)], [x - S(22), y + S(290)], [x - S(30), y + S(278)], [x - S(18), y + S(268)]], '#D6334A', S(6), 0, { alpha: tr }); shine(x - S(26), y + S(284), S(70), '#FF6A5C', .5 * tr); }
}
// a sneeze spray from a mouth (x, y) pointing in direction dir (+1 right); blocked at bx (sleeve) if given
function spray(x, y, s, t, k, dir = 1, bx = null) {
  if (k <= 0) return;
  for (let i = 0; i < 26; i++) { const p = frac(t * 1.4 + i / 26), ang = (hash(i) - .5) * .9, d = p * 380 * s;
    let px = x + Math.cos(ang) * d * dir, py = y + Math.sin(ang) * d;
    if (bx != null && (px - bx) * dir > 0) continue;                          // stopped by the sleeve
    cut(Pc(px, py, (4 + 6 * hash(i * 7)) * s), SNZ.drop, 0, { tex: 0, alpha: k * (1 - p) }); }
}
// the arm crossing the face: a sleeve from the shoulder to the elbow at the mouth, hand beyond (character facing front)
function elbowCover(hx, hy, s, k, shirt = SLP.shirt) {
  if (k <= 0) return; const S = v => v * s;
  PX.save(); PX.globalAlpha *= k;
  const sh = [hx - S(80), hy + S(140)], el = [hx + S(10), hy + S(70)], hand = [hx + S(150), hy + S(10)];
  strip([sh, el], shirt, S(46), 2); strip([el, hand], shirt, S(42), 2); cut(Pc(hand[0], hand[1], S(24)), SNZ.skin, 2);
  PX.restore();
}
// a tissue
function tissue(x, y, s, k = 1) {
  const S = v => v * s; if (k <= 0) return;
  cut(Pblob([[x - S(70), y - S(50)], [x, y - S(70)], [x + S(70), y - S(46)], [x + S(60), y + S(50)], [x - S(64), y + S(56)]]), '#FFFFFF', 2, { edge: .4, alpha: k });
  strip([[x - S(40), y - S(20)], [x + S(30), y + S(10)]], '#E6E9EE', S(4), 0, { alpha: k });
}
// a printed case-report card
function reportCard(x, y, s, k) {
  const S = v => v * s; if (k <= 0) return;
  PX.save(); PX.translate(x, y); PX.rotate(-.04); PX.scale(backOut(k), backOut(k));
  cut(Pr(-S(300), -S(200), S(600), S(400), S(16)), '#FBF8F2', 3, { edge: .4 });
  cut(Pr(-S(300), -S(200), S(600), S(70), [S(16), S(16), 0, 0]), '#2F5E57', 0);
  ptext('BMJ Case Reports · 2023', 0, -S(166), S(34), '#FFFFFF', { lv: 0, weight: 700 });
  for (let i = 0; i < 6; i++) strip([[-S(260), -S(90) + i * S(40)], [S(i % 3 === 2 ? 120 : 260), -S(90) + i * S(40)]], '#D9D2C4', S(8), 0);
  PX.restore();
}
