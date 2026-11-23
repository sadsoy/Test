// scenes.js: "ซูเปอร์เอลนีโญ". Globe → Pacific map → equatorial cross-section → impacts map → globe → title.
const LN = Object.fromEntries(TL.lines.map(l => [l.id, l])), ph = (id, i) => LN[id].ph[i];
const wordAt = (id, i, word) => { const s = SUBT[id][i], k = s.indexOf(word), [a, b] = ph(id, i); return k < 0 ? a : lerp(a, b, k / s.length); };
const label = (s, t, a, b, o = {}) => txt(s, o.x || 0, o.y ?? -700, o.size || 84, o.col || C.ink, { pop: seg(t, a, a + .35) * (1 - seg(t, b - .2, b)), back: 'back' in o ? o.back : C.cream, z: 1.6, rot: o.rot ?? -.03, edge: o.edge, weight: o.weight });
const wsc = (x, y) => [W / 2 + CAM.z * (x - CAM.x), H / 2 + CAM.z * (y - CAM.y)];
function pin(s, wx, wy, sx, sy, k, col = C.ink, back = C.cream, size = 50) {
  if (k <= 0) return; const [px, py] = wsc(wx, wy);
  screen(() => { X.globalAlpha = clamp(k * 1.5); cut(strip([[sx, sy], [px, py]], 4, 3), rgba('#FFFFFF', .9), { z: .6, rim: false }); cut(circ(px, py, 8, 3), '#FFFFFF', { z: .6 }); txt(s, sx, sy, size, col, { pop: k, back, z: 1.3, weight: 700 }); });
}
const spaceBg = t => { layer(.1, () => { X.fillStyle = G.space0; X.fillRect(-4000, -4000, 8000, 8000); }); layer(.2, () => stars(t, 90, [-900, -1500, 1800, 3000], 5)); };
const NINO = [200, 0];                                             // a point in the central equatorial Pacific

// ---------- S1: the globe, the ocean sends a signal ----------
function S1(t) {
  const [a0, b0] = ph('L1', 0), [a1, b1] = ph('L1', 1), L0 = lerp(168, 195, ease(seg(t, 0, 4.9)));
  setCam(...kf(t, [[0, [0, 0, .58]], [b1, [0, 0, .9]], [5.1, [0, 0, 1.0]]], ease5));
  spaceBg(t);
  layer(1, () => {
    globe(t, 301, L0, 8);
    const [x, y, z] = sph(...NINO, L0, 8), p = [x * 301, -y * 301];
    // the signal: rings spreading from the central equatorial Pacific
    const sk = seg(t, a0 + .6, a0 + 1) * (1 - seg(t, 4.3, 4.75));
    if (sk > 0 && z > 0) for (let i = 0; i < 3; i++) { const u = ((t - a0) * .55 + i / 3) % 1; cut(strip(arcPts(p[0], p[1], 20 + 150 * u, 0, TAU * .999, 40).map(([qx, qy]) => [qx, p[1] + (qy - p[1]) * .55]), 6 * (1 - u) + 1), rgba(G.warm1, .9 * (1 - u) * sk), { z: 0, rim: false }); }
    if (sk > 0) glow(p[0], p[1], 90, G.warm1, .6 * sk);
    // scientists watching: a satellite crosses and scans the Pacific
    const st = seg(t, a1 - .3, 4.7);
    if (st > 0) { const sx = lerp(-640, 820, st), sy = -420 + 40 * Math.sin(st * 3);
      cut(poly([[sx - 8, sy + 20], [sx + 8, sy + 20], [p[0] + 70, p[1]], [p[0] - 70, p[1]]]), rgba('#BFE6FF', .22 * Math.sin(Math.PI * st)), { z: 0, rim: false, grain: 0 });
      at(sx, sy, .9, -.15, () => satellite(t)); }
  });
  pin('มหาสมุทรแปซิฟิก', 0, 0, 540, 420, seg(t, a0 + .3, a0 + .7) * (1 - seg(t, a1 + .6, a1 + .9)), C.ink, C.cream, 56);
}
// ---------- S2–S3: the Pacific map: what Super El Niño is, and where the water warms ----------
function S2(t) {
  const [a0] = ph('L2', 0), [a1, b1] = ph('L2', 1), [a2, b2] = ph('L2', 2), [a3, b3] = ph('L3', 0), [a3b, b3b] = ph('L3', 1);
  const c0 = mapXY(195, 0), c1 = mapXY(205, 2), c2 = mapXY(232, 0);
  setCam(...kf(t, [[4.8, [c0[0], 0, 1.0]], [b2, [c1[0], -30, 1.05]], [a3 + .4, [c1[0], 10, 1.45]], [b3b, [c2[0], 0, 1.6]], [15.1, [mapXY(222, 0)[0], 0, 2.4]]], ease5));
  const tongue = seg(t, a3 + .2, b3b - .4);
  layer(1, () => {
    mapOcean(t); normalSST(1 - ease(seg(t, a3, a3 + 1))); sstTongue(tongue, t); equatorLine(); mapLand();
    // the globe dissolves into the flat map at the same scale
    const gf = 1 - ease(seg(t, 4.8, 5.5)); if (gf > 0) { X.save(); X.globalAlpha = gf; X.fillStyle = G.space0; X.fillRect(-2400, -2400, 4800, 4800); globe(t, 301, 195, 8); X.restore(); }
  });
  pin('เส้นศูนย์สูตร', ...mapXY(165, 0), 250, 1160, seg(t, a3 + .1, a3 + .4) * (1 - seg(t, b3b, b3b + .2)), C.ink, C.cream, 46);
  layer(0, () => {
    label('เอลนีโญ (El Niño)', t, a1, a2 + .05, { back: G.warm1, size: 84 });
    // strength gauge: the forecast leans to very strong
    const gk = seg(t, a1 + .3, a1 + .6) * (1 - seg(t, a2 - .1, a2 + .1));
    if (gk > 0) at(0, -520, backOut(gk, 2), 0, () => {
      cut(rrect(-300, -150, 600, 240, 30), C.cream, { z: 1.6 });
      const cols = ['#9FD8A0', G.warm1, G.warm2, G.warm3], names = ['อ่อน', 'ปานกลาง', 'แรง', 'แรงมาก'];
      cols.forEach((c, i) => { const a0g = Math.PI + i * Math.PI / 4; cut(strip(arcPts(0, 40, 150, a0g + .02, a0g + Math.PI / 4 - .02, 10), 34), c, { z: .8 }); const am = a0g + Math.PI / 8; txt(names[i], Math.cos(am) * 222, 40 + Math.sin(am) * 200, 26, C.ink, { weight: 700, sa: 0 }); });
      const na = Math.PI + Math.PI * lerp(.15, .88, ease(seg(t, a1 + .5, b1)));
      at(0, 40, 1, na, () => cut(rrect(-8, -8, 130, 16, 8), C.ink, { z: 1 })); cut(circ(0, 40, 14, 3), C.ink, { z: 1 });
      txt('คาดการณ์ · NOAA / WMO (พ.ย. 2569)', 0, 70, 24, '#6A5A7A', { weight: 700, sa: 0 });
    });
    const sk = seg(t, wordAt('L2', 2, 'ซูเปอร์'), wordAt('L2', 2, 'ซูเปอร์') + .25), so = seg(t, a3 - .1, a3 + .2);
    if (sk > 0 && so < 1) { X.save(); X.translate(0, -680); X.scale(lerp(1.6, 1, easeOut(sk)), lerp(1.6, 1, easeOut(sk))); X.globalAlpha = sk * (1 - so);
      txt('ซูเปอร์เอลนีโญ', 0, 0, 120, C.cream, { back: G.warm3, z: 2, rot: -.03 });
      txt('= ชื่อเรียกเอลนีโญที่แรงมาก ไม่ใช่ปรากฏการณ์ใหม่', 0, 120, 38, C.ink, { back: C.cream, z: 1.2, weight: 700, rot: -.03 }); X.restore(); }
    // legend: warmer than normal, a little → a lot (no invented numbers)
    const lk = seg(t, a3 + .3, a3 + .6) * (1 - seg(t, 14.7, 15.0));
    if (lk > 0) at(0, -680, backOut(lk, 2), 0, () => { cut(rrect(-330, -70, 660, 150, 24), C.cream, { z: 1.6 }); txt('ผิวน้ำอุ่นกว่าปกติ', 0, -28, 44, C.ink, { weight: 800, sa: 0 }); [G.warm1, G.warm2, G.warm3].forEach((c, i) => cut(rrect(-150 + i * 100, 20, 92, 34, 8), c, { z: .6 })); txt('น้อย', -210, 37, 28, C.ink, { weight: 700, sa: 0 }); txt('มาก', 210, 37, 28, C.ink, { weight: 700, sa: 0 }); });
    label('ตอนกลาง → ตะวันออก', t, a3 + 1.0, b3b + .4, { y: -520, back: G.warm2, col: C.cream, size: 64 });
  });
}
// ---------- S4: the equatorial cross-section ----------
function S4(t) {
  const [a0, b0] = ph('L4', 0), [a1, b1] = ph('L4', 1), [a2, b2] = ph('L4', 2), [a5, b5] = ph('L5', 0);
  setCam(...kf(t, [[14.9, [0, -80, 1.35]], [a0 + .6, [0, -60, 1.0]], [b2, [60, -60, 1.0]], [a5 + .3, [180, 20, 1.3]], [24.4, [140, 0, 1.2]]], ease5));
  const k = ease(seg(t, a1, b2 - .1)), up = 1 - .85 * ease(seg(t, a5 + .3, b5 - .6));
  layer(.2, () => { X.fillStyle = '#10204A'; X.fillRect(-4000, -4000, 8000, 8000); });
  layer(1, () => at(0, 60, .84, 0, () => crossSection(t, k, { upwell: up })));
  const SC = (x, y) => [x * .84, 60 + y * .84];
  pin('ลมสินค้า → พัดไปทางตะวันตก', ...SC(-40, -60), 540, 610, seg(t, a0 + .3, a0 + .7) * (1 - seg(t, a1 - .1, a1 + .1)), C.ink, C.cream, 46);
  pin('น้ำอุ่นกองทางตะวันตก', ...SC(-400, 90), 330, 1290, seg(t, wordAt('L4', 0, 'น้ำอุ่น'), wordAt('L4', 0, 'น้ำอุ่น') + .3) * (1 - seg(t, a1 - .1, a1 + .1)), C.ink, G.warm1, 46);
  pin('ลมอ่อนลง', ...SC(0, -60), 540, 610, seg(t, a1, a1 + .3) * (1 - seg(t, b2, b2 + .2)), C.cream, C.red, 56);
  pin('น้ำอุ่นแผ่ไปทางตะวันออก', ...SC(200, 60), 600, 1290, seg(t, a2 + .1, a2 + .4) * (1 - seg(t, b2 + .2, b2 + .4)), C.ink, G.warm1, 46);
  pin('น้ำเย็นผุดขึ้น ลดลง', ...SC(410, 220), 560, 1300, seg(t, a5 + .1, a5 + .4) * (1 - seg(t, 24.0, 24.3)), C.ink, G.cold, 50);
  layer(0, () => {
    label('ภาพตัดขวางตามเส้นศูนย์สูตร', t, 14.95, a0 + .4, { back: C.cream, size: 66 });
    const sk = seg(t, 15, 15.3) * (1 - seg(t, 24, 24.3));
    txt('ตะวันตก (อินโดนีเซีย)', -260, -560, 36, C.cream, { pop: sk, back: '#2B3A7A', z: 1, weight: 700 });
    txt('ตะวันออก (อเมริกาใต้)', 270, -560, 36, C.cream, { pop: sk, back: '#2B3A7A', z: 1, weight: 700 });
    label(t < a1 ? 'ปกติ' : 'เอลนีโญ', t, t < a1 ? a0 + .4 : a1, t < a1 ? a1 : 24.3, { y: -700, back: t < a1 ? '#9FD8A0' : G.warm3, col: t < a1 ? C.ink : C.cream, size: 84 });
  });
}
// ---------- S5: impacts, region by region ----------
function S5(t) {
  const [a0, b0] = ph('L6', 0), [a1] = ph('L6', 1), [a2] = ph('L6', 2), [a3, b3] = ph('L6', 3);
  const indo = mapXY(128, -12), peru = mapXY(278, -4), usS = mapXY(265, 31);
  setCam(...kf(t, [[24.3, [mapXY(200, 0)[0], 40, .82]], [b0, [mapXY(200, 0)[0], 40, .85]], [a1 + .4, [indo[0] + 60, indo[1] - 40, 1.35]], [a2 + .4, [peru[0] - 160, peru[1] - 60, 1.3]], [a3 + .5, [mapXY(200, 0)[0], 20, .8]], [30.2, [mapXY(200, 0)[0], 20, .7]]], ease5));
  layer(1, () => {
    mapOcean(t); sstTongue(1, t); equatorLine(.6); mapLand();
    // the main tropical rain shifts east with the warm water
    const rk = seg(t, a0 + .2, b0); if (rk > 0) { const cx = lerp(mapXY(140, 0)[0], mapXY(185, 0)[0], ease(rk)); at(cx, -60, .9, 0, () => rainIcon(1, t)); cut(strip([[mapXY(140, 0)[0], -150], [cx - 80, -150]], 6, 14), rgba('#FFFFFF', .6 * rk), { z: .4, rim: false }); }
    const dk = seg(t, a1, a1 + .35), wk = seg(t, a2, a2 + .35);
    if (dk > 0) { at(indo[0], indo[1] - 40, backOut(dk, 2) * .8, 0, () => droughtIcon(1, t)); at(mapXY(145, -27)[0], mapXY(145, -27)[1], backOut(dk, 2) * .7, 0, () => heatIcon(1, t)); }
    if (wk > 0) { at(peru[0] + 10, peru[1], backOut(wk, 2) * .8, 0, () => rainIcon(1, t)); at(usS[0], usS[1], backOut(wk, 2) * .65, 0, () => rainIcon(1, t + 1)); }
  });
  layer(0, () => {
    label('รูปแบบฝน–อุณหภูมิเปลี่ยน', t, a0 + .1, a1 + .05, { back: C.cream, size: 72 });
    label('มักแห้ง–ร้อนกว่าปกติ', t, a1 + .1, a2 + .05, { back: G.crack, col: C.cream, size: 76 });
    label('มักฝนมากกว่าปกติ', t, a2 + .1, a3 + .05, { back: '#3B6BB0', col: C.cream, size: 76 });
    label('แล้วแต่ภูมิภาค', t, a3 + .05, 30.2, { back: C.gold, size: 90 });
    txt('แนวโน้มที่มักเกิดในช่วงเอลนีโญ ไม่ได้เกิดทุกครั้ง', 0, -560, 34, C.cream, { back: '#2B3A7A', z: 1, weight: 700, pop: seg(t, a3 + .3, a3 + .6) * (1 - seg(t, 30, 30.2)) });
  });
}
// ---------- S6: on top of a warming world ----------
function S6(t) {
  const [a0] = ph('L7', 0), [a1] = ph('L7', 1), [a2, b2] = ph('L7', 2);
  setCam(...kf(t, [[29.9, [0, 60, 1.35]], [31.2, [0, 120, .95]], [35.3, [0, 140, .9]]], ease5));
  spaceBg(t);
  layer(1, () => {
    globe(t, 301, 195 + (t - 30) * 4, 8, { sst: 1, heat: .25 + .45 * ease(seg(t, a0, a0 + 1)) + .2 * ease(seg(t, a1, a1 + .8)), atmo: .55 });
    const rk = seg(t, a2 + .3, a2 + .7);
    if (rk > 0) [[droughtIcon, -380, -40], [rainIcon, 380, -20], [heatIcon, 0, -420]].forEach(([fn, x, y], i) => at(x, y + 160, backOut(seg(rk, i * .15, i * .15 + .6), 2) * .6, 0, () => fn(1, t)));
  });
  layer(0, () => {
    // the warm-up as a stacked bar: the long-term trend, then El Niño on top (a temporary boost)
    const bk = seg(t, a0, a0 + .35);
    if (bk > 0) at(0, -640, backOut(bk, 2), 0, () => {
      cut(rrect(-420, -110, 840, 250, 28), C.cream, { z: 1.6 });
      cut(rrect(-380, -10, 760, 64, 32), '#E8DDC6', { z: .3, rim: false });
      const w1 = 470 * ease(seg(t, a0 + .2, a0 + 1)), w2 = 170 * ease(seg(t, a1 + .1, a1 + .8));
      if (w1 > 4) cut(rrect(-380, -10, w1, 64, 32), G.warm2, { z: .8 });
      if (w2 > 4) cut(rrect(-380 + w1 - 10, -10, w2 + 10, 64, 32), G.warm3, { z: 1 });
      txt('โลกร้อนระยะยาว', -380 + Math.max(w1, 240) / 2, -60, 42, C.ink, { weight: 700, sa: 0, alpha: clamp(w1 / 200) });
      if (w2 > 20) txt('+ เอลนีโญ (ชั่วคราว)', 150, 100, 40, G.warm3, { weight: 800, sa: 0 });
    });
    label('อาจเพิ่มความเสี่ยงอากาศสุดขั้ว', t, a2 + .2, 35.4, { y: -400, back: G.warm3, col: C.cream, size: 62 });
  });
}
// ---------- S7: the title ----------
function S7(t) {
  const [a0, b0] = ph('L8', 0), [a1, b1] = ph('L8', 1), end = TL.duration;
  setCam(...kf(t, [[35.1, [0, 140, .9]], [end, [0, 160, .62]]], ease));
  spaceBg(t);
  layer(1, () => globe(t, 301, 195 + (t - 30) * 4, 8, { sst: 1 - .5 * seg(t, 36, 38), atmo: .5 }));
  layer(0, () => {
    const k = seg(t, 35.25, 35.7);
    if (k > 0) at(0, -600, backOut(k, 1.8), -.02, () => {
      txt('ซูเปอร์เอลนีโญ', 0, 0, 130, C.cream, { back: G.warm3, z: 2.2 });
      txt('ปรากฏการณ์ที่อาจเปลี่ยนสภาพอากาศทั่วโลก', 0, 130, 46, C.ink, { back: C.cream, z: 1.4, weight: 700 });
    });
    txt('ข้อมูล: NOAA CPC (12 พ.ย. 2569) · WMO (20 พ.ย. 2569)', 0, -330, 28, C.cream, { pop: seg(t, 35.6, 36), back: '#2B3A7A', z: .8, weight: 700 });
    label('ติดตามประกาศกรมอุตุนิยมวิทยา', t, a0 + .1, end + 1, { y: -240, back: '#9FD8A0', size: 52 });
  });
}

const SCENES = [[0, S1], [4.8, S2], [14.9, S4], [24.3, S5], [29.95, S6], [35.15, S7]];
