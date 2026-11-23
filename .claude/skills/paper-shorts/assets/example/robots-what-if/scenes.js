// scenes.js: "ถ้าหุ่นยนต์ทำงานแทนมนุษย์ได้เกือบทุกอาชีพ?" Four worlds: the factory (hook, scenario, twist),
// the desk of facts (today), the money loop (why it breaks, where money goes, ideas), and the open air (the question).
const FACT_BG = '#EFE8DA';
const tint = (a, col = '#000000') => { if (a > 0) screen(() => { X.fillStyle = rgba(col, a); X.fillRect(0, 0, W, H); }); };

// ---------- S1: the hook ----------
function S1(t) {
  const [a0, b0] = ph('L1', 0), [a1] = ph('L1', 1), [a2] = ph('L1', 2);
  setCam(...kf(t, [[0, [-60, 120, 1.3]], [b0, [0, 60, 1.05]], [4.6, [0, 40, 1.0]]], ease5));
  const dim = ease(seg(t, a2, a2 + .5));
  layer(.3, () => factoryHall(t, 1 - .5 * dim));
  layer(1, () => {
    conveyor(t, -800, 800, 260, 90);
    for (let i = 0; i < 9; i++) { const x = ((i * 190 + t * 90) % 1600) - 800; at(x, 260, .8, 0, () => box(1, i)); }
    // the worker steps aside; the robot steps in
    const out = ease5(seg(t, a0 + .6, b0 + .1)), px = lerp(-120, -420, out), pw = out > 0 && out < 1 ? t * 9 : 0;
    at(px, 440, 1.3, 0, () => { const ws = a0 + .6, we = b0 + .1, fx = t < ws ? 1 : t < ws + .2 ? lerp(1, -1, ease((t - ws) / .2)) : t < we - .15 ? -1 : t < we + .1 ? lerp(-1, 1, ease((t - we + .15) / .25)) : 1; X.scale(Math.sign(fx || 1) * Math.max(.06, Math.abs(fx)), 1); person({ walk: pw, armF: out < .02 ? [-1.0 + .15 * Math.sin(t * 5), -.5] : undefined }); });
    const rin = ease5(seg(t, a0 + .4, b0)), rx = lerp(760, -110, rin), rw = rin > 0 && rin < 1 ? t * 9 : 0;
    at(rx, 440, 1.15, 0, () => { X.scale(-1, 1); humanoid({ walk: rw, armL: rin >= 1 ? [-.9 + .2 * Math.sin(t * 7), -.6] : undefined, armR: rin >= 1 ? [-.8 + .2 * Math.sin(t * 7 + 1), -.6] : undefined }); });
    const on = seg(t, a0 + .2, a0 + .6), cyc = (t * 1.6) % 1;
    at(300, 440, 1, 0, () => robotArm({ target: [lerp(-60, 60, cyc), -120 - 60 * Math.sin(Math.PI * cyc)], grip: cyc < .5 ? 1 : .2, on }));
  });
  tint(.25 * dim, '#3A0010');
  layer(0, () => {
    label('ดีใจ?', t, a1, 4.7, { x: -230, y: -660, back: '#9FE3B5', size: 110, rot: -.06 });
    label('กลัว?', t, a2, 4.7, { x: 230, y: -660, back: R.coral, col: C.cream, size: 110, rot: .06 });
  });
}
// ---------- S2: today, the facts ----------
const CARDS = [['office', -175, -330], ['nurse', 175, -330], ['build', -175, 20], ['teach', 175, 20]];
function S2(t) {
  const [a0, b0] = ph('L2', 0), [a1, b1] = ph('L2', 1), [a2, b2] = ph('L2', 2);
  const off = CARDS[0];
  setCam(...kf(t, [[4.5, [0, -150, 1.08]], [a1, [0, -160, 1.0]], [a2 + .1, [0, -160, 1.0]], [a2 + .9, [off[1], off[2] + 40, 1.9]], [12.4, [off[1], off[2] + 40, 1.95]]], ease5));
  layer(.2, () => { X.fillStyle = FACT_BG; X.fillRect(-4000, -4000, 8000, 8000); for (let i = 0; i < 6; i++) cut(rrect(-1400, -1100 + i * 380, 2800, 160, 40), rgba('#E2D8C4', .7), { z: .4, rim: false }); });
  const zoomK = ease(seg(t, a2 + .3, a2 + .9));
  layer(1, () => {
    CARDS.forEach(([k, x, y], i) => { const p = seg(t, a0 + .1 + i * .12, a0 + .5 + i * .12), hl = i === 0 ? seg(t, a1 + .2, a1 + .6) : 0;
      if (p <= 0) return; const dim = i > 0 ? 1 - .5 * seg(t, a1 + .2, a1 + .6) : 1;
      X.save(); X.globalAlpha = dim; at(x, y, backOut(p, 2) * (1 + .06 * hl), 0, () => jobCard(k, hl)); X.restore();
      if (hl > 0) at(x + 120, y - 120, backOut(hl, 2.4), 0, () => { cut(circ(0, 0, 44, 5), R.coral, { z: 1.6 }); txt('AI', 0, 2, 40, C.cream, { weight: 800, sa: 0 }); }); });
    // inside the highlighted job: its tasks. Some go to AI, the rest stay with the person: the job changes shape
    if (zoomK > 0) at(off[1], off[2], 1, 0, () => { X.save(); X.globalAlpha = zoomK;
      cut(rrect(-150, -150, 300, 300, 30), '#F6F1E6', { z: 0, rim: false });
      ['เอกสาร', 'ตารางนัด', 'คุยกับคน', 'ตัดสินใจ'].forEach((s, i) => { const ai = i < 2, f = seg(t, a2 + .9 + i * .15, a2 + 1.3 + i * .15), y = -110 + i * 60;
        cut(rrect(-125, y, 250, 48, 14), ai ? mix('#E8E2D4', R.mint, f) : '#E8E2D4', { z: .8 });
        txt(s, -40, y + 24, 28, C.ink, { weight: 700, sa: 0 });
        at(98, y + 24, .32, 0, () => ai && f > .5 ? humanoidHead() : personHead()); });
      X.restore(); });
  });
  layer(0, () => {
    label('ข้อเท็จจริงวันนี้', t, a0, a1 + .1, { back: C.cream, size: 92 });
    label('≈ 1 ใน 4 งานทั่วโลก ได้รับผลจาก AI', t, a1 + .2, a2 + .2, { back: R.mint, size: 62 });
    txt('ILO · พ.ค. 2025 (ดัชนีความเสี่ยงต่อ GenAI)', 0, -590, 30, C.ink, { pop: seg(t, a1 + .5, a1 + .8) * (1 - seg(t, a2, a2 + .2)), back: C.cream, z: 1, weight: 700 });
    label('เปลี่ยนรูป ≠ หายไป', t, a2 + .6, 12.4, { back: C.gold, size: 96 });
    txt('WEF คาดการณ์ถึงปี 2030: งานใหม่ 170 ล้าน · งานหายไป 92 ล้าน', 0, 330, 30, C.cream, { pop: seg(t, a2 + 1.4, a2 + 1.7) * (1 - seg(t, 12.1, 12.3)), back: '#3A4A6A', z: 1, weight: 700 });
  });
}
function humanoidHead() { cut(rrect(-40, -36, 80, 72, 24), R.mint, { z: 1 }); cut(rrect(-28, -14, 56, 20, 10), R.visor, { z: .4 }); }
function personHead() { cut(circ(0, -6, 30, 3), R.person, { z: 1 }); cut(rrect(-36, 22, 72, 30, 14), R.person, { z: 1 }); }

// ---------- S3–S4: the hypothetical factory, then the twist ----------
function S3(t) {
  const [a0] = ph('L3', 0), [a1] = ph('L3', 1), [a2] = ph('L3', 2), [a4, b4] = ph('L4', 0);
  setCam(...kf(t, [[12.2, [-300, 60, 1.15]], [16.3, [500, 40, 1.0]], [a4 - .2, [700, 0, .95]], [a4 + .5, [1250, -260, .62]], [19.4, [1260, -280, .6]]], ease5));
  const speed = lerp(90, 420, ease(seg(t, a1, a2 + 1)));
  layer(.3, () => factoryHall(t, 1));
  layer(1, () => {
    // the factory floor ends at a doorway; outside: an empty street, a shop and the boxes piling up
    cut(rrect(1050, -900, 2000, 1500, 0), '#1F2E52', { z: 2 }); stars(t, 30, [1100, -880, 1700, 600], 9);
    cut(rrect(1050, 160, 2000, 1500, 0), '#33395E', { z: 2.2 });
    at(1850, 440, 1.2, 0, () => shop(t, 1));
    const pile = ease(seg(t, a1, b4 + .3)), pileN = Math.round(4 + 46 * pile);
    for (let i = 0; i < pileN; i++) { const row = Math.floor(Math.sqrt(i * 2)), col = i - row * (row + 1) / 2; at(1200 + col * 74 - row * 10, 440 - (Math.floor(i / 6)) * 56, .9, (hash(i) - .5) * .2, () => box(1, i)); }
    conveyor(t, -1000, 1100, 260, speed);
    for (let i = 0; i < 16; i++) { const x = ((i * 135 + t * speed) % 2100) - 1000; at(x, 260, .8, 0, () => box(1, i)); }
    for (let i = 0; i < 5; i++) { const cyc = (t * (1.2 + speed / 200) + i * .3) % 1; at(-700 + i * 380, 440, 1, 0, () => robotArm({ target: [lerp(-60, 60, cyc), -120 - 60 * Math.sin(Math.PI * cyc)], grip: cyc < .5 ? 1 : .2, on: 1 })); }
    const pk = seg(t, a2 + .1, a2 + .5); if (pk > 0) at(820, -260, backOut(pk, 2) * 1.3, 0, () => priceTag(1, seg(t, a2 + .3, a2 + 1.2)));
    const q = seg(t, a4 + .1, a4 + .5); if (q > 0) at(1500, -420, backOut(q, 2.2) * 2.2, .12, () => qmark(1, C.gold));
  });
  layer(0, () => {
    const sk = seg(t, a0, a0 + .25), so = seg(t, a1 - .1, a1 + .15);
    if (sk > 0 && so < 1) { X.save(); X.translate(0, -690); X.scale(lerp(1.5, 1, easeOut(sk)), lerp(1.5, 1, easeOut(sk))); X.globalAlpha = sk * (1 - so); txt('สถานการณ์สมมติ', 0, 0, 100, C.cream, { back: '#5A4EA8', z: 2, rot: -.03, edge: null }); txt('WHAT IF', 0, 100, 46, C.ink, { back: R.neon, z: 1.4, weight: 800, rot: -.03 }); X.restore(); }
    label('ผลิตได้มหาศาล', t, a1 + .1, a2 + .05, { back: R.neon, size: 92 });
    label('ราคาถูกลง', t, a2 + .1, a4, { back: R.coral, col: C.cream, size: 92 });
    label('แล้วใครจะซื้อ?', t, a4, 19.5, { back: C.gold, size: 110 });
  });
}

// ---------- S5–S7: the money loop ----------
const LOOPC = [0, -60], LR = 290, NODES = [['โรงงาน', -Math.PI / 2], ['ค่าจ้าง', 0], ['คน', Math.PI / 2], ['ซื้อของ', Math.PI]];
const nodeXY = a => [LOOPC[0] + Math.cos(a) * LR, LOOPC[1] + Math.sin(a) * LR];
function S5(t) {
  const [a0, b0] = ph('L5', 0), [a1] = ph('L5', 1), [a2, b2] = ph('L5', 2), [a6, b6] = ph('L6', 0), [a7, b7] = ph('L7', 0), [a7b, b7b] = ph('L7', 1);
  const wage = wordAt('L5', 0, 'ค่าจ้าง'), brk = ease(seg(t, a2 + .1, a2 + .6)), grey = seg(t, a1, a1 + .4);
  const towerH = lerp(0, 520, ease(seg(t, a6, b6))), ubi = seg(t, a7 + .2, b7 + .3), div = seg(t, a7b + .1, a7b + .6);
  setCam(...kf(t, [[19.2, [0, -40, 1.12]], [b0, [0, -40, 1.0]], [a2 + .2, [140, -20, 1.25]], [a6 + .2, [120, -140, .92]], [a7 + .4, [120, -120, .9]], [30.9, [80, -100, .95]]], ease5));
  layer(.2, () => { X.fillStyle = '#E4EEF0'; X.fillRect(-4000, -4000, 8000, 8000); for (let i = 0; i < 6; i++) cut(rrect(-1400, -1100 + i * 380, 2800, 160, 40), rgba('#D3E2E5', .8), { z: .4, rim: false }); });
  layer(1, () => {
    // the ring, drawn in as he speaks; the wage arc (factory → people) greys, then tears
    const draw = ease(seg(t, a0, a0 + 1.2));
    for (let q = 0; q < 4; q++) { const s0 = -Math.PI / 2 + q * Math.PI / 2 + .22, s1 = s0 + Math.PI / 2 - .44, isWage = q === 0 || q === 1, d = clamp(draw * 4 - q);
      if (d <= 0) continue; let col = isWage ? mix(C.gold, '#B9B9B9', grey) : C.gold, e = lerp(s0, s1, d);
      if (q === 1 && brk > 0) { const gap = .5 * brk; cut(strip(arcPts(...LOOPC, LR, s0, (s0 + e) / 2 - gap, 20), 22), col, { z: 1, alpha: 1 - .3 * brk }); cut(strip(arcPts(...LOOPC, LR, (s0 + e) / 2 + gap, e, 20).map(([x, y]) => [x, y + 80 * brk * brk]), 22), col, { z: 1, alpha: 1 - .6 * brk }); }
      else cut(strip(arcPts(...LOOPC, LR, s0, e, 24), 22), col, { z: 1 });
      const [ex, ey] = [LOOPC[0] + Math.cos(e) * LR, LOOPC[1] + Math.sin(e) * LR]; if (d >= 1) at(ex, ey, 1, e + Math.PI / 2, () => cut(poly([[-22, -18], [22, 0], [-22, 18]]), col, { z: 1.1 }));
    }
    // coins travelling round the ring (they stop at the tear)
    if (draw > .9) for (let i = 0; i < 6; i++) { let u = ((t - a0) * .25 + i / 6) % 1, a = -Math.PI / 2 + u * TAU; if (brk > .3 && u > .3 && u < .5) continue; const [x, y] = [LOOPC[0] + Math.cos(a) * LR, LOOPC[1] + Math.sin(a) * LR]; at(x, y, 1, 0, () => coin(20, t, i)); }
    if (brk > 0) for (let i = 0; i < 4; i++) { const f = seg(t, a2 + .3 + i * .1, a2 + 1.3 + i * .1), [x, y] = nodeXY(Math.PI / 4); if (f > 0 && f < 1) at(x + (i - 1.5) * 30, y + 400 * f * f, 1, 0, () => coin(18, t, i + 9)); }
    // nodes
    NODES.forEach(([s, a], i) => { const [x, y] = nodeXY(a), k = seg(t, a0 + i * .25, a0 + .3 + i * .25), hl = i === 1 ? seg(t, wage, wage + .3) * (1 - seg(t, a1 + .3, a1 + .6)) : 0;
      if (k <= 0) return; at(x, y, backOut(k, 2) * (1 + .12 * hl), 0, () => {
        cut(circ(0, 0, 92, 30 + i), i === 1 ? mix(C.cream, '#D9D9D9', grey) : C.cream, { z: 2 });
        if (i === 0) at(0, 40, .35, 0, () => robotArm({ target: [100, -70], on: 1 }));
        if (i === 1) { if (grey < .5) coin(34, t, 3); else at(0, 30, .3, 0, () => humanoid({})); }
        if (i === 2) { at(-26, 62, .34, 0, () => person({})); at(26, 62, .3, 0, () => person({ col: R.personLt })); }
        if (i === 3) at(0, 34, .75, 0, () => bag(1));
        txt(s, 0, 128, 42, C.ink, { back: C.cream, z: 1, weight: 800 });
      }); });
    // income flows up to the machine owners' tower
    if (towerH > 4) { at(560, 440, 1, 0, () => tower(towerH)); for (let i = 0; i < 7; i++) { const u = ((t - a6) * .7 + i / 7) % 1, [fx, fy] = nodeXY(-Math.PI / 2); const x = lerp(fx + 60, 560, u), y = lerp(fy, 440 - towerH - 40, u) - 160 * Math.sin(Math.PI * u); if (t > a6) at(x, y, 1, 0, () => coin(18, t, i + 20)); } }
    // ideas: coins rain from the tower back to people (basic income); a new dividend link from the factory to people
    if (ubi > 0) for (let i = 0; i < 8; i++) { const u = ((t - a7) * .6 + i / 8) % 1, [px, py] = nodeXY(Math.PI / 2); const x = lerp(560, px + 40, u), y = lerp(440 - towerH, py - 40, u) - 120 * Math.sin(Math.PI * u); at(x, y, 1, 0, () => coin(17, t, i + 40)); }
    if (div > 0) { const [fx, fy] = nodeXY(-Math.PI / 2), [px, py] = nodeXY(Math.PI / 2); cut(strip([[fx, fy + 100], [fx + 30, (fy + py) / 2], [px, py - 100]].slice(0, 3).map((p, j) => j === 2 ? [lerp(fx + 30, px, div), lerp((fy + py) / 2, py - 100, div)] : p), 18), '#7FD8A8', { z: 1.2 });
      if (div > .9) txt('ปันผล', fx + 110, (fy + py) / 2, 40, C.ink, { back: '#C8F2D6', z: 1, weight: 800 }); }
  });
  layer(0, () => {
    label('เงินซื้อของ มาจากค่าจ้าง', t, a0 + .1, a1, { back: C.gold, size: 70 });
    label('วงจรขาด!', t, a2 + .2, a6 + .1, { back: R.coral, col: C.cream, size: 100 });
    label('รายได้ไหลไปหา เจ้าของเครื่องจักร', t, a6, a7 + .05, { back: '#3A3F6E', col: C.cream, size: 66 });
    label('รายได้พื้นฐานถ้วนหน้า (UBI)', t, a7 + .1, a7b + .05, { back: '#C8F2D6', size: 72 });
    txt('ฟินแลนด์ทดลอง 2017–18: ผู้ว่างงาน 2,000 คน ได้ 560 ยูโร/เดือน', 0, -590, 30, C.ink, { pop: seg(t, a7 + .6, a7 + .9) * (1 - seg(t, a7b - .1, a7b + .1)), back: C.cream, z: 1, weight: 700 });
    txt('ผล: เครียดน้อยลง แต่การจ้างงานแทบไม่เปลี่ยน (Kela 2020)', 0, -540, 30, C.ink, { pop: seg(t, a7 + .9, a7 + 1.2) * (1 - seg(t, a7b - .1, a7b + .1)), back: C.cream, z: 1, weight: 700 });
    label('หรือปันผลจากหุ่นยนต์', t, a7b + .1, 30.9, { back: '#C8F2D6', size: 84 });
    txt('* แนวคิดที่ยังถกเถียงกันอยู่ ไม่ใช่คำตอบสำเร็จรูป', 0, -580, 32, C.ink, { pop: seg(t, a7b + .4, a7b + .7) * (1 - seg(t, 30.7, 30.9)), back: C.cream, z: 1, weight: 700 });
  });
}
// ---------- S8: the real question ----------
function S8(t) {
  const [a0] = ph('L8', 0), [a1, b1] = ph('L8', 1), [a2] = ph('L8', 2), [a3, b3] = ph('L8', 3);
  setCam(...kf(t, [[30.8, [0, -60, 1.1]], [a2, [0, -60, 1.0]], [35.6, [0, -40, 1.05]]], ease5));
  layer(.2, () => { X.fillStyle = '#2A2F5A'; X.fillRect(-4000, -4000, 8000, 8000); for (let i = 0; i < 5; i++) cut(rrect(-1400, -1000 + i * 420, 2800, 180, 50), rgba('#343A6E', .8), { z: .5, rim: false }); });
  const showArm = 1 - ease(seg(t, a2, a2 + .4)), pie = ease(seg(t, a2 + .1, a2 + .6));
  layer(1, () => {
    if (showArm > 0) { X.save(); X.globalAlpha = showArm; const spin = t * 3; at(0, 260, 1.5, 0, () => robotArm({ target: [140 * Math.cos(spin), -160 + 60 * Math.sin(spin)], grip: .5 + .5 * Math.sin(spin * 2), on: 1 })); X.restore(); }
    if (pie > 0) {
      // the output as a pie of boxes: the slices slide out toward the owners' tower and toward everyone, and keep re-dividing
      const share = .5 + .32 * Math.sin((t - a2) * 1.6), cols = [C.gold, R.mint, R.coral, '#9FB8E8'];
      const sl = [share, (1 - share) * .45, (1 - share) * .35, (1 - share) * .2]; let a = -Math.PI / 2;
      sl.forEach((f, i) => { const a1s = a, a2s = a + f * TAU, mid = (a1s + a2s) / 2, off = 30 * pie; a = a2s; const p = new Path2D(); p.moveTo(Math.cos(mid) * off, -60 + Math.sin(mid) * off); p.arc(Math.cos(mid) * off, -60 + Math.sin(mid) * off, 250 * pie, a1s, a2s); p.closePath(); cut(p, cols[i], { z: 1.6 + i * .1 }); });
      at(-360, 420, .9 * pie, 0, () => tower(320)); for (let i = 0; i < 5; i++) at(160 + i * 70, 440, .55 * pie, 0, () => person({ col: i % 2 ? R.personLt : '#5A5EB0' }));
    }
  });
  layer(0, () => {
    const k = seg(t, a1, a1 + .3), x = seg(t, a1 + .6, b1 + .2), out = seg(t, a2, a2 + .3);
    txt('หุ่นยนต์ทำอะไรได้?', 0, -700, 92, C.ink, { pop: k * (1 - out), back: C.cream, z: 1.6, rot: -.03 });
    if (x > 0 && out < 1) at(0, -700, 1, -.08, () => cut(rrect(-360 * easeOut(x), -12, 720 * easeOut(x), 24, 10), R.coral, { z: 1.4, alpha: 1 - out }));
    label('เราจะแบ่งผลผลิตกันยังไง?', t, a3, 35.7, { back: C.gold, size: 80 });
  });
}
// ---------- S9: the question for you ----------
function S9(t) {
  const [a0, b0] = ph('L9', 0), [a1, b1] = ph('L9', 1), end = TL.duration;
  setCam(...kf(t, [[35.3, [-80, 0, 1.15]], [b0, [0, -40, 1.05]], [end, [0, -140, .95]]], ease5));
  layer(.1, () => { const g = X.createLinearGradient(0, -1200, 0, 600); g.addColorStop(0, '#3B3A7A'); g.addColorStop(.55, '#E9887A'); g.addColorStop(1, '#F6C78A'); X.fillStyle = g; X.fillRect(-4000, -4000, 8000, 8000); });
  layer(.25, () => { glow(220, -80, 520, '#FFE2A0', .7); cut(circ(220, -80, 120, 3), '#FFD28A', { z: 1 }); });
  layer(.5, () => { for (let i = 0; i < 9; i++) { const x = -900 + i * 220, h = 220 + 160 * hash(i * 3.3); cut(rrect(x, 200 - h, 150, h + 200, 10), '#7A5C8E', { z: 1.2 }); } at(-260, 210, .5, 0, () => { X.scale(-1, 1); humanoid({ walk: t * 6, armL: [-1.2, -.7], armR: [-1.1, -.7] }); }); at(-300, 150, .5, 0, () => box(1, 3)); at(300, 210, .5, 0, () => robotArm({ target: [100, -80 + 30 * Math.sin(t * 2)], on: 1 })); });
  layer(.8, () => hills(t, [[300, 50, '#5E8A6A', 4, 2]]));
  layer(1, () => {
    hills(t, [[440, 40, '#4A7A5A', 7, 2.4]]);
    const wk = ease5(seg(t, 35.3, a1 + .3)), px = lerp(-420, 0, wk);
    at(px, 420, 1.25, 0, () => person({ walk: wk < 1 ? t * 8 : 0, armF: wk >= 1 ? [-.25, -.2] : undefined }));
    const ik2 = seg(t, a1 - .1, a1 + .6);
    ['book', 'brush', 'heart', 'sprout', 'music'].forEach((k, i) => { const a = -Math.PI / 2 + (i - 2) * .55, r = 260 + 20 * Math.sin(t * 1.5 + i), f = seg(ik2, i * .12, i * .12 + .5); if (f > 0) at(Math.cos(a) * r, 40 + Math.sin(a) * r + 10 * Math.sin(t * 2 + i), backOut(f, 2.2) * 1.2, 0, () => lifeIcon(k, 1)); });
  });
  layer(0, () => label('คุณจะใช้ชีวิตเพื่ออะไร?', t, a1 + .1, end + 1, { back: C.cream, size: 92 }));
}

const SCENES = [[0, S1], [4.5, S2], [12.2, S3], [19.2, S5], [30.8, S8], [35.4, S9]];
