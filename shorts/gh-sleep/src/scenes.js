// scenes.js: "ร่างกายรู้ได้อย่างไรว่าเมื่อไหร่ควรหลั่ง Growth Hormone?" One continuous camera journey:
// wall clock → bedroom → into the sleeper's head → brain → pituitary → blood → graph → clock → bedroom → wall clock.
const LN = Object.fromEntries(TL.lines.map(l => [l.id, l])), ph = (id, i) => LN[id].ph[i];
const wordAt = (id, i, word) => { const s = SUBT[id][i], k = s.indexOf(word), [a, b] = ph(id, i); return k < 0 ? a : lerp(a, b, k / s.length); };
const label = (s, t, a, b, o = {}) => txt(s, o.x || 0, o.y ?? -700, o.size || 86, o.col || C.ink, { pop: seg(t, a, a + .35) * (1 - seg(t, b - .2, b)), back: 'back' in o ? o.back : C.cream, z: 1.6, rot: o.rot ?? -.03, edge: o.edge, weight: o.weight });
// screen position of a world point in a par-1 layer with no camera rotation
const wsc = (x, y) => [W / 2 + CAM.z * (x - CAM.x), H / 2 + CAM.z * (y - CAM.y)];
// a label card joined by a paper leader line to a world point
function pin(s, wx, wy, sx, sy, k, col = C.cream, back = '#2B2F6E') {
  if (k <= 0) return; const [px, py] = wsc(wx, wy);
  screen(() => { X.globalAlpha = clamp(k * 1.5); cut(strip([[sx, sy], [lerp(sx, px, .6), lerp(sy, py, .6) - 10], [px, py]], 5, 3), rgba('#FFF2C8', .9), { z: .6, rim: false }); cut(circ(px, py, 9, 3), '#FFF2C8', { z: .6 }); txt(s, sx, sy, 58, col, { pop: k, back, z: 1.3, weight: 700 }); });
}

// ---------- the bedroom (opening, and closing) ----------
const CLOCK_W = [180, -520], CAM_CLOCK = [180, -520, 3.0];
const HEADC = [SLEEPER.hx + 60 * SLEEPER.hs, SLEEPER.hy - 20 * SLEEPER.hs];   // the head's local point (-20, -60), rotated 90°
function BED(t) {
  const [a1, b1] = ph('L1', 0), [a2, b2] = ph('L2', 0), [a3, b3] = ph('L2', 1), one = wordAt('L2', 0, 'ตีหนึ่ง');
  const zoomIn = ease5(seg(t, a3 + .2, 8.85)), Zh = 1.3 / SLEEPER.hs;
  let cam = kf(t, [[0, CAM_CLOCK], [a2 - .1, [180, -520, 2.9]], [a2 + 1.2, [40, -150, 1.0]], [a3 + .2, [60, -60, 1.04]]], ease5);
  if (zoomIn > 0) cam = [lerp(cam[0], HEADC[0], zoomIn), lerp(cam[1], HEADC[1], zoomIn), Math.exp(lerp(Math.log(cam[2]), Math.log(Zh), zoomIn))];
  setCam(cam[0], cam[1], cam[2], -Math.PI / 2 * ease(seg(t, a3 + .5, 8.85)));
  const hm = kf(t, [[one - .3, 22], [one + .5, 25]], ease5);       // 22:00 → 01:00 (the hands sweep forward 3 hours)
  bedroom(t, { h: Math.floor(hm), m: (hm % 1) * 60, reveal: ease(seg(t, 8.1, 8.8)) });
  // 22:00–02:00 on the dial: a gold sector from 10 to 2 o'clock
  const sec = seg(t, wordAt('L1', 0, 'สี่ทุ่ม'), wordAt('L1', 0, 'สี่ทุ่ม') + .6) * (1 - seg(t, a3, a3 + .4));
  if (sec > 0) layer(1, () => at(...CLOCK_W, 1, 0, () => { const p = new Path2D(); p.moveTo(0, 0); p.arc(0, 0, 108, -Math.PI / 2 - Math.PI / 3, -Math.PI / 2 - Math.PI / 3 + TAU / 3 * ease(sec)); p.closePath(); cut(p, rgba(C.gold, .55), { z: 0, rim: false }); }));
  layer(0, () => {
    label('Growth Hormone (GH)', t, wordAt('L1', 0, 'โกรท'), wordAt('L1', 0, 'สี่ทุ่ม') + .1, { back: C.cream, size: 74 });
    label('22:00–02:00 ?', t, wordAt('L1', 0, 'สี่ทุ่ม') + .1, a2 + .1, { back: C.gold, size: 100 });
    label('นอนตีหนึ่ง = พลาด?', t, one + .2, a3 + .1, { back: C.red, col: C.cream, size: 84 });
    label('รู้เวลาได้ยังไง?', t, a3 + .1, 8.6, { back: C.cream, size: 88 });
  });
}
function BED2(t) {
  const [a, b] = ph('L9', 1), end = TL.duration, flipBack = ease5(seg(t, b + .05, b + .55));
  setCam(...kf(t, [[34.3, [40, -120, 1.12]], [b, [40, -150, 1.0]], [b + .3, [60, -180, 1.0]], [end, CAM_CLOCK]], ease5));
  bedroom(t, { h: 22, m: 0, flip: 1 + flipBack });
  // the sleep rhythm: a slow wave rises from the sleeper's head, and a GH glow pulses with each crest
  layer(1, () => {
    const k = seg(t, a - .1, a + .5) * (1 - seg(t, b + .2, b + .6));
    if (k > 0) { const P = []; for (let i = 0; i <= 60; i++) { const x = -420 + i * 13; P.push([x, -40 + 48 * Math.sin(i / 60 * TAU * 2 - t * 2.2)]); } X.save(); X.globalAlpha = k; cut(strip(P, 14), '#9FD8FF', { z: 1 }); X.restore(); glow(HEADC[0], HEADC[1], 260, '#FFD23F', .55 * k * (.5 + .5 * Math.sin(t * 2.2))); }
  });
  layer(0, () => label('จังหวะการนอน', t, wordAt('L9', 1, 'จังหวะ') - .1, b + .5, { back: '#9FD8FF', size: 96 }));
}

// ---------- inside the head ----------
const HD = { x: 0, y: 40, s: 1.3 }, hw = (x, y) => [HD.x + HD.s * x, HD.y + HD.s * y];
function BRAIN(t) {
  const [a3, b3] = ph('L3', 0), [a3b, b3b] = ph('L3', 1), [a4] = ph('L4', 0), [a4b, b4b] = ph('L4', 1), [a5, b5] = ph('L5', 0), [a6, b6] = ph('L6', 0);
  const pit = hw(-92, 24), hyp = hw(-86, -70), scn = hw(-114, -58), vesselEnd = hw(-118, 330);
  setCam(...kf(t, [[8.7, [-26, -38, 1]], [9.6, [-20, -60, 1.02]], [a3b + .3, [-90, -40, 1.5]], [b3b, [-80, -50, 1.45]], [a4 + .2, [-10, -80, 1.0]],
    [b4b, [-10, -80, 1.0]], [a5 + .6, [pit[0] + 10, (hyp[1] + pit[1]) / 2, 3.1]], [a6, [pit[0], pit[1] + 10, 3.2]], [a6 + 1.6, [pit[0] + 6, pit[1] + 150, 4.6]]], ease5));
  const night = ease(seg(t, a4b, a4b + 1.4));
  layer(.3, () => space(t, mix('#1E2563', '#0E1238', night), mix('#2C3478', '#16194A', night), ['#2B3A86', '#24306E', '#3A2E7A']));
  layer(.5, () => stars(t, 40 * night, [-800, -1300, 1600, 2400], 4));
  layer(1, () => {
    at(HD.x, HD.y, HD.s, 0, () => headProfile({ reveal: 1, hypo: seg(t, a3 + .2, a3 + .7), scn: seg(t, a3b, a3b + .4), pit: seg(t, a5 + 1.2, a5 + 1.8) + .5 * seg(t, a6, a6 + .3), night }));
    // the circadian clock: a day/night ring turning around the SCN
    const ck = seg(t, a3b + .1, a3b + .5) * (1 - seg(t, b3b + .1, b3b + .5));
    if (ck > 0) at(scn[0], scn[1], ck * .55, t * .8, () => { cut(strip(arcPts(0, 0, 70, 0, Math.PI, 30), 16), C.gold, { z: .8 }); cut(strip(arcPts(0, 0, 70, Math.PI, TAU, 30), 16), '#4B5BC8', { z: .8 }); cut(circ(70, 0, 16, 1), '#FFE066', { z: .8 }); cut(circ(-70, 0, 13, 2), '#E8EEFF', { z: .8 }); });
    // L5: the signal travels from the hypothalamus down the stalk to the anterior pituitary
    const sg = seg(t, a5 + .3, b5 + .6);
    if (sg > 0 && t < b6) { const path = [[-86, -70], [-92, -46], [-86, -16], [-80, 6], [-92, 22]].map(p => hw(...p)), C2 = through(path, 8);
      for (let i = 0; i < 5; i++) { const u = ((t - a5) * .9 + i / 5) % 1, q = C2[Math.floor(u * (C2.length - 1))]; glow(q[0], q[1], 40, '#9CFF9A', .7); cut(circ(q[0], q[1], 7, i), '#C8FFB0', { z: .4, rim: false }); } }
    // L6: a blood vessel from the pituitary; GH (gold hexagons) pours into it and flows away
    const vk = seg(t, a6 - .4, a6 + .2);
    if (vk > 0) { const VP = [[-92, 44], [-104, 96], [-122, 170], [-120, 250], [-118, 330]].map(p => hw(...p)), VC = through(VP, 8);
      cut(strip(VC, 26 * vk, 34 * vk), B.vessel, { z: 1.2 }); cut(strip(VC, 10 * vk, 14 * vk), B.vesselLt, { z: 0, rim: false });
      const gk = seg(t, a6 + .2, a6 + .6); for (let i = 0; i < 14 * gk; i++) { const u = ((t - a6) * .45 + i / 14) % 1, q = VC[Math.floor(u * (VC.length - 1))]; ghMol(q[0] + 4 * Math.sin(i * 3), q[1], 6, t, i); } }
  });
  // labels joined to the structures
  pin('ไฮโปทาลามัส', ...hyp, 280, 420, seg(t, a3 + .2, a3 + .5) * (1 - seg(t, a3b + .1, a3b + .3)));
  pin('นาฬิกาชีวภาพ (SCN)', ...scn, 330, 420, seg(t, a3b + .3, a3b + .6) * (1 - seg(t, b3b, b3b + .3)), '#3A2D52', C.gold);
  pin('ไฮโปทาลามัส', ...hyp, 250, 380, seg(t, a5 + .4, a5 + .7) * (1 - seg(t, a6 - .1, a6 + .1)));
  pin('ต่อมใต้สมอง', ...pit, 760, 1180, seg(t, a5 + 1.1, a5 + 1.4) * (1 - seg(t, a6 + .5, a6 + .8)), '#3A2D52', C.gold);
  layer(0, () => {
    eeg(t, ease(seg(t, a4b, b4b - .2)), seg(t, a4 - .1, a4 + .3) * (1 - seg(t, b4b + .2, b4b + .5)));
    if (t > a4 - .1 && t < b4b + .5) txt(t < a4b + .9 ? 'ตื่น → เริ่มหลับ' : 'หลับลึก (Slow-wave sleep)', 0, -560, 50, C.cream, { back: '#2B2F6E', z: 1, weight: 700, pop: seg(t, a4, a4 + .3) * (1 - seg(t, b4b + .2, b4b + .5)) });
    label('สัญญาณ GHRH', t, a5 + .4, b5 + .1, { back: '#C8FFB0', size: 80 });
    label('GH ระลอกใหญ่!', t, a6 + .2, 22.7, { back: C.gold, size: 92 });
  });
}
// ---------- in the bloodstream ----------
function BLOOD(t) {
  const [a6, b6] = ph('L6', 0);
  setCam(...kf(t, [[22.4, [0, -40, 1.25]], [25.3, [60, 20, 1.0]]], ease));
  layer(.3, () => { X.fillStyle = '#5A1824'; X.fillRect(-3000, -3000, 6000, 6000); });
  layer(1, () => {
    X.save(); X.rotate(-.5);
    cut(rrect(-1400, -330, 2800, 660, 0), '#E7848A', { z: 2.4 }); cut(rrect(-1400, -280, 2800, 560, 0), '#B8323C', { z: 1.6 }); cut(rrect(-1400, -230, 2800, 460, 0), '#8E1F2A', { z: .6, rim: false });
    for (let i = 0; i < 26; i++) { const x = ((i * 137 + t * 260) % 2800) - 1400, y = -180 + 360 * hash(i * 3.1); rbc(x, y, 34 + 8 * hash(i), Math.sin(t + i), 40 + i); }
    for (let i = 0; i < 12; i++) { const x = ((i * 233 + t * 300 + 60) % 2800) - 1400, y = -150 + 300 * hash(i * 5.7 + 2); ghMol(x, y, 16, t, i); }
    X.restore();
  });
  layer(0, () => label('GH → กระแสเลือด', t, 22.55, 25.4, { back: C.gold, size: 92 }));
}
// ---------- the graph: the pulse follows sleep ----------
function GRAPH(t) {
  const [a7, b7] = ph('L7', 0), [a7b, b7b] = ph('L7', 1), shift = wordAt('L7', 0, 'เลื่อน');
  setCam(...kf(t, [[25.0, [0, -60, 1.08]], [29.9, [0, -60, 1.0]]], ease));
  layer(.3, () => { X.fillStyle = '#1D2A5C'; X.fillRect(-3000, -3000, 6000, 6000); for (let i = 0; i < 5; i++) cut(rrect(-1200, -900 + i * 420, 2400, 160, 40), rgba('#2B3A7A', .6), { z: .6, rim: false }); });
  const X0 = -400, X1 = 420, Y0 = 110, Y1 = -300, hx = h => lerp(X0, X1, (h - 20) / 12), gy = v => lerp(Y0, Y1 + 70, v);
  const s = kf(t, [[shift, 22.5], [b7b - .1, 25]], ease5);              // sleep onset, hours (25 = 01:00)
  const GH = (h, s0) => .06 + .9 * Math.exp(-Math.pow((h - (s0 + .6)) / .38, 2)) + .3 * Math.exp(-Math.pow((h - (s0 + 3.3)) / .3, 2)) + .2 * Math.exp(-Math.pow((h - (s0 + 5.6)) / .3, 2));
  layer(1, () => {
    cut(rrect(-490, -470, 980, 800, 34), C.cream, { z: 2.6 });
    // the 22:00–02:00 window people believe in
    cut(rrect(hx(22), Y1 - 20, hx(26) - hx(22), Y0 - Y1 + 20, 6), rgba(C.gold, .28), { z: 0, rim: false });
    txt('ช่วง 22:00–02:00', (hx(22) + hx(26)) / 2, Y1 + 16, 30, '#9A7420', { weight: 700, sa: 0 });
    cut(rrect(X0, Y0, X1 - X0, 6, 3), '#3A2D52', { z: .4 }); cut(rrect(X0 - 6, Y1, 6, Y0 - Y1, 3), '#3A2D52', { z: .4 });
    [20, 22, 24, 26, 28, 30, 32].forEach(h => txt(String(h % 24).padStart(2, '0') + ':00', hx(h), Y0 + 34, 28, '#3A2D52', { weight: 700, sa: 0 }));
    txt('ระดับ GH ในเลือด', X0 - 10, Y1 - 90, 34, '#3A2D52', { weight: 700, sa: 0, align: 'left' });
    // sleep bar with its deep-sleep (SWS) stretches, under the axis
    const sb = [hx(s), Y0 + 70, Math.min(hx(32), hx(s + 7.5)) - hx(s), 46];
    cut(rrect(...sb, 12), '#4B5BC8', { z: 1 });
    cut(rrect(hx(s + .25), Y0 + 70, hx(s + 1.4) - hx(s + .25), 46, 8), '#232C78', { z: .4 }); cut(rrect(hx(s + 2.7), Y0 + 70, hx(s + 3.5) - hx(s + 2.7), 46, 8), '#323C96', { z: .4 });
    txt('นอน', sb[0] - 44, Y0 + 93, 30, '#232C78', { weight: 800, sa: 0 }); txt('หลับลึก', (hx(s + .25) + hx(s + 1.4)) / 2, Y0 + 145, 28, '#232C78', { weight: 700, sa: 0 });
    // the ghost of the earlier night, then the curve drawn in
    const draw = seg(t, a7 + .1, shift - .1);
    if (t > shift) { const G = []; for (let k = 0; k <= 120; k++) { const h = 20 + k / 10; G.push([hx(h), gy(GH(h, 22.5))]); } cut(strip(G, 5), rgba('#8A7FB0', .55), { z: 0, rim: false }); txt('คืนก่อน', hx(23.1) - 70, gy(.8), 26, '#8A7FB0', { weight: 700, sa: 0 }); }
    const P = []; for (let k = 0; k <= 120 * draw + (t > shift ? 120 : 0) && k <= 120; k++) { const h = 20 + k / 10; P.push([hx(h), gy(GH(h, s))]); }
    if (P.length > 1) cut(strip(P, 9), C.red, { z: 1 });
    const pk = [hx(s + .6), gy(GH(s + .6, s))]; if (draw > .7) { glow(pk[0], pk[1], 90, '#FFD23F', .7); txt('GH', pk[0] + 50, pk[1] + 10, 40, '#B8323C', { weight: 800, sa: 0 }); }
    txt('กราฟจำลองจากงานวิจัย (Van Cauter 1992; Born 1988)', 0, 295, 24, '#6A5A7A', { weight: 400, sa: 0 });
  });
  layer(0, () => { label('นอนช้า → GH มาช้าตาม', t, a7b, 30.0, { back: C.red, col: C.cream, size: 76 }); label('งานวิจัยพบว่า…', t, a7, a7b + .05, { back: C.cream, size: 84 }); });
}
// ---------- the clock card: not a magic hour ----------
function CLOCK(t) {
  const [a8, b8] = ph('L8', 0), [a9] = ph('L9', 0), flip = ease5(seg(t, a9 + .4, a9 + 1.0)), magic = wordAt('L8', 0, 'เวลาวิเศษ');
  setCam(...kf(t, [[29.8, [0, -80, 1.1]], [34.5, [0, -60, 1.0]]], ease));
  layer(.3, () => { X.fillStyle = '#3A2D6E'; X.fillRect(-3000, -3000, 6000, 6000); for (let i = 0; i < 4; i++) cut(rrect(-1200, -800 + i * 500, 2400, 200, 60), rgba('#4A3A86', .6), { z: .6, rim: false }); });
  layer(1, () => {
    const sp = seg(t, magic - .1, magic + .3) * (1 - seg(t, magic + .8, magic + 1.3));
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .4, r = 400 + 30 * Math.sin(t * 3 + i), fall = seg(t, magic + .8, magic + 1.5) * 300; if (sp > 0) cut(star(Math.cos(a) * r, -60 + Math.sin(a) * r + fall, 26 * sp, .42, 4, i), C.gold, { z: 1 }); }
    at(0, -60, 2.5, 0, () => wallClock(22, 0, { flip }));
  });
  layer(0, () => {
    const lk = seg(t, magic - .1, magic + .25), st = seg(t, magic + .6, magic + .9), out = seg(t, a9 - .1, a9 + .2);
    txt('เวลาวิเศษ?', 0, -700, 100, C.ink, { pop: lk * (1 - out), back: C.gold, z: 1.6, rot: -.03 });
    if (st > 0 && out < 1) at(0, -700, 1, -.1, () => cut(rrect(-260 * easeOut(st), -12, 520 * easeOut(st), 24, 10), C.red, { z: 1.4, alpha: 1 - out }));
    label('ร่างกายไม่ได้ดูนาฬิกา', t, a9 + .1, 34.6, { back: C.cream, size: 82 });
  });
}

const SCENES = [[0, BED], [8.7, BRAIN], [22.6, BLOOD], [25.1, GRAPH], [29.85, CLOCK], [34.4, BED2]];
