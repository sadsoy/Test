// scenes.js: "ถ้าเราสร้างดวงอาทิตย์บนโลกได้สำเร็จ?" Sun → fusion vs fission → tokamak → the 2022 laser shot (fact)
// → [WHAT IF] a fusion plant lights a city and makes fresh water → the caveats → back to the Sun.
const spaceBg = (t, c0 = F.space0, c1 = F.space1) => { layer(.1, () => { const g = X.createLinearGradient(0, -1200, 0, 1200); g.addColorStop(0, c0); g.addColorStop(1, c1); X.fillStyle = g; X.fillRect(-5000, -5000, 10000, 10000); }); layer(.2, () => stars(t, 80, [-1200, -1600, 2400, 3200], 7)); };
const SUNP = [-60, -200];

// ---------- S1: the Sun fuses hydrogen; could we light that fire on Earth? ----------
function S1(t) {
  const [a0] = ph('L1', 0), [a1, b1] = ph('L1', 1), [a2, b2] = ph('L2', 0);
  setCam(...kf(t, [[0, [SUNP[0], SUNP[1], .62]], [a1 - .1, [SUNP[0], SUNP[1], .8]], [a1 + .9, [SUNP[0], SUNP[1] - 120, 2.1]], [b1, [SUNP[0], SUNP[1] - 120, 2.2]], [a2 + .6, [200, 150, .55]], [5.1, [520, 420, 1.3]]], ease5));
  spaceBg(t);
  layer(1, () => {
    at(...SUNP, 1, 0, () => sunBall(380, t, { cut: ease(seg(t, a1, a1 + .6)) * (1 - ease(seg(t, a2 + .2, a2 + .8))) }));
    // inside the core: two hydrogen nuclei meet and fuse (simplified; in the Sun this is the proton–proton chain)
    const k = seg(t, a1 + .4, a1 + 1.25), m = seg(t, a1 + 1.25, b1 + .3);
    if (k > 0 && m < 1) { const c = [SUNP[0], SUNP[1] - 90], d = lerp(110, 22, ease(k)); if (k < 1) { ball(c[0] - d, c[1], 20, F.proton, '+'); ball(c[0] + d, c[1], 20, F.proton, '+'); } else at(c[0], c[1], 1, 0, () => nucleus(2, 2, 18, 3)); flash(c[0], c[1], m, 180); }
    // the spark crosses space to the Earth
    const sp = seg(t, a2 + .3, b2 + .1);
    if (sp > 0 && sp < 1) { const x = lerp(SUNP[0] + 200, 520, ease(sp)), y = lerp(SUNP[1] + 60, 420, ease(sp)); glow(x, y, 90, '#FFF0B0', .9); cut(circ(x, y, 12, 3), '#FFFFFF', { z: 0, rim: false }); }
    at(520, 420, 1, 0, () => earth(150, t * 20, { atmo: .5 }));
    if (sp >= 1) glow(520, 420, 120 + 30 * Math.sin(t * 6), F.plasma, .5);
  });
  pin('ไฮโดรเจน → ฮีเลียม', SUNP[0], SUNP[1] - 90, 540, 1180, seg(t, a1 + 1.2, a1 + 1.5) * (1 - seg(t, a2, a2 + .2)), C.ink, C.cream, 52);
  layer(0, () => label('บนโลก?', t, a2 + .4, 5.2, { back: F.plasmaLt, size: 110 }));
}
// ---------- S2: fusion joins light nuclei; fission splits heavy ones ----------
function S2(t) {
  const [a0] = ph('L3', 0), [a1, b1] = ph('L3', 1), [a2] = ph('L3', 2), [a3, b3] = ph('L3', 3);
  setCam(...kf(t, [[5.0, [0, -60, 1.15]], [a2, [0, -80, 1.0]], [9.3, [0, -40, 1.02]]], ease5));
  spaceBg(t, '#120F33', '#24194E');
  layer(1, () => {
    // fusion: D + T → He-4 + n + energy
    const top = -360; cut(rrect(-490, top - 230, 980, 460, 34), rgba('#2A2160', .9), { z: 1.6 });
    const fk = seg(t, a0 + .2, a1 + .6), fm = seg(t, a1 + .6, b1 + .6), dx = lerp(320, 50, ease(fk));
    if (fk < 1) { at(-dx, top, 1, 0, () => nucleus(1, 1, 42, 1)); at(dx, top, 1, 0, () => nucleus(1, 2, 42, 2)); txt('D', -dx, top + 130, 48, C.cream, { weight: 800, sa: 0 }); txt('T', dx, top + 130, 48, C.cream, { weight: 800, sa: 0 }); }
    else { at(-40, top, 1, 0, () => nucleus(2, 2, 42, 3)); txt('He-4', -40, top + 150, 44, C.cream, { weight: 800, sa: 0 }); const nx = lerp(40, 400, ease(fm)); ball(nx, top - 20, 36, F.neutron); txt('n', nx, top + 60, 40, C.cream, { weight: 800, sa: 0 }); }
    flash(0, top, fm, 320);
    // fission: a neutron splits U-235 (a heavy nucleus) into two smaller ones plus neutrons
    const bot = 260, pk = seg(t, a2 - .1, a2 + .3);
    if (pk > 0) { X.save(); X.globalAlpha = pk; cut(rrect(-490, bot - 260, 980, 470, 34), rgba('#3A2A44', .9), { z: 1.6 });
      const nk = seg(t, a2 + .2, a3 + .2), sm = seg(t, a3 + .2, b3 + .6);
      if (sm <= 0) { at(60, bot, 1, 0, () => nucleus(16, 22, 24, 4)); txt('U-235 (ภาพย่อส่วน)', 60, bot + 185, 36, C.cream, { weight: 700, sa: 0 }); ball(lerp(-440, -110, ease(nk)), bot, 26, F.neutron); }
      else { const s = lerp(0, 230, easeOut(sm)); at(60 - s, bot - .25 * s, 1, 0, () => nucleus(7, 10, 24, 5)); at(60 + s, bot + .25 * s, 1, 0, () => nucleus(8, 11, 24, 6)); for (let i = 0; i < 3; i++) ball(60 + Math.cos(i * 2.1 + .5) * s * 1.4, bot + Math.sin(i * 2.1 + .5) * s * .8, 20, F.neutron); flash(60, bot, sm, 260); }
      X.restore(); }
  });
  layer(0, () => {
    label('ฟิวชัน = รวมนิวเคลียสเบา', t, a0, 9.3, { y: -720, back: F.plasmaLt, size: 70 });
    txt('ฟิชชัน = แยกนิวเคลียสหนัก (โรงไฟฟ้านิวเคลียร์วันนี้)', 0, -10, 40, C.cream, { pop: seg(t, a2, a2 + .3) * (1 - seg(t, 9.1, 9.3)), back: '#6A3A5A', z: 1.2, weight: 700 });
  });
}
// ---------- S3: hotter than the Sun's core, held by magnets ----------
function S3(t) {
  const [a0, b0] = ph('L4', 0), [a1, b1] = ph('L4', 1), heat = ease(seg(t, a0 + .2, b0)), mag = ease(seg(t, a1, a1 + .7));
  setCam(...kf(t, [[9.15, [0, 60, 1.25]], [a1, [0, 40, 1.0]], [12.8, [0, 30, 1.08]]], ease5));
  spaceBg(t, '#0E1030', '#1A1A44');
  layer(1, () => at(0, 140, 1.15, 0, () => tokamak(t, { heat, mag })));
  layer(0, () => {
    const ck = seg(t, a0, a0 + .3) * (1 - seg(t, 12.6, 12.85));
    if (ck > 0) at(0, -620, backOut(ck, 2), 0, () => {
      cut(rrect(-440, -150, 880, 300, 28), C.cream, { z: 1.6 });
      txt('แกนดวงอาทิตย์ ≈ 15 ล้าน °C', -400, -92, 42, C.ink, { weight: 700, sa: 0, align: 'left' });
      cut(rrect(-400, -50, 66, 30, 15), F.sun2, { z: .6 });
      txt('พลาสมาในเครื่อง ≈ 150 ล้าน °C', -400, 12, 42, C.ink, { weight: 700, sa: 0, align: 'left' });
      cut(rrect(-400, 50, Math.max(30, 660 * heat), 30, 15), F.plasma, { z: .6 }); if (heat > .9) txt('×10', 300, 66, 40, F.plasma, { weight: 800, sa: 0 });
      txt('ที่มา: ITER', 330, -110, 28, '#6A5A7A', { weight: 700, sa: 0 });
    });
    label('แม่เหล็กขังพลาสมา', t, a1 + .1, 12.85, { y: -370, back: F.field, size: 72 });
    txt('โทคาแมค (เช่น ITER) · อีกแบบคือสเตลลาเรเตอร์', 0, 470, 32, C.cream, { pop: seg(t, a1 + .4, a1 + .7) * (1 - seg(t, 12.6, 12.85)), back: '#2A2A5A', z: 1, weight: 700 });
  });
}
// ---------- S4: the 2022 laser shot (a fact) ----------
function S4(t) {
  const [a0] = ph('L5', 0), [a1, b1] = ph('L5', 1), [a2, b2] = ph('L5', 2);
  const beams = seg(t, a1, a1 + .8), out = seg(t, a1 + .8, a1 + 1.6), bars = ease(seg(t, a1 + 1.4, b1)), sys = ease(seg(t, a2 + .1, b2 - .2));
  setCam(...kf(t, [[12.7, [0, 120, 1.3]], [a1 + 1.4, [0, 60, 1.0]], [a2, [0, -40, .96]], [18.8, [0, -80, .92]]], ease5));
  spaceBg(t, '#0A0E26', '#141C3E');
  layer(1, () => {
    at(0, 230, .78, 0, () => laserShot(t, beams, out));
    // energy bars: laser in vs fusion out (the target), then what the whole facility drew from the grid
    if (bars > 0) { cut(rrect(-420, -560, 840, 560, 30), rgba('#1E2A52', .95), { z: 1.6 });
      const base = -120;
      bar(-250, base, 160, 205 * bars, '#7FC8FF', 'เลเซอร์เข้า', bars > .9 ? '2.05 MJ' : null);
      bar(-40, base, 160, 315 * bars, F.plasma, 'ปฏิกิริยาออก', bars > .9 ? '3.15 MJ' : null);
      if (sys > 0) { const h = 1200 * sys; bar(220, base, 170, h, '#9AA6C4', 'ไฟที่ทั้งระบบใช้', null); if (sys > .5) txt('มากกว่าหลายเท่า', 220, base - 320, 40, C.cream, { weight: 800, sa: 0 }); } }
  });
  layer(0, () => {
    label('ธ.ค. 2022 · NIF สหรัฐฯ', t, a0, a2 + .1, { back: '#7FC8FF', size: 76 });
    label('ทั้งระบบยังใช้ไฟมากกว่า', t, a2 + .1, 18.85, { back: '#9AA6C4', size: 76 });
    txt('ที่มา: LLNL · สถิติล่าสุด เม.ย. 2025: 8.6 MJ จากเลเซอร์ 2.08 MJ', 0, 380, 28, C.cream, { pop: seg(t, b1 - .3, b1) * (1 - seg(t, 18.6, 18.85)), back: '#2A2A5A', z: 1, weight: 700 });
  });
}
// ---------- S5–S6: [WHAT IF] a fusion plant lights a city and makes fresh water ----------
const PLANT = [-560, 300], TURB = [-120, 300], CITY = [700, 300], DESAL = [1500, 330];
function S5(t) {
  const [a0] = ph('L6', 0), [a1, b1] = ph('L6', 1), [a2, b2] = ph('L7', 0), [a3, b3] = ph('L7', 1), [a4] = ph('L8', 0), [a5, b5] = ph('L8', 1);
  const on = ease(seg(t, a1, a1 + .8)), lit = ease(seg(t, a1 + .4, b1 + .3)), water = ease(seg(t, a5, b5 - .2));
  setCam(...kf(t, [[18.7, [-200, 230, .85]], [a1 + .2, [80, 230, .72]], [a2 - .2, [80, 210, .72]], [a2 + .5, [-640, 250, 1.0]], [b3, [-580, 230, 1.0]], [a4 + .4, [1080, 250, .78]], [28.7, [1150, 230, .8]]], ease5));
  layer(.1, () => { const g = X.createLinearGradient(0, -1200, 0, 600); g.addColorStop(0, '#2B3F7A'); g.addColorStop(.6, '#E9A07A'); g.addColorStop(1, '#F8D29A'); X.fillStyle = g; X.fillRect(-5000, -5000, 10000, 10000); });
  layer(.3, () => { glow(300, -260, 500, '#FFE2A0', .6); for (let i = 0; i < 6; i++) cloud(-900 + i * 520 + 10 * t, -480 + 60 * (i % 2), 1, '#F4C3B0', 40 + i, .8); });
  layer(1, () => {
    waves(t, 380, 3000, F.sea); waves(t + 1, 430, 3000, F.seaLt);
    cut(rrect(-900, 300, 3200, 80, 10), '#5E7A5A', { z: 2 });
    at(...PLANT, 1, 0, () => plant(t, on));
    at(...TURB, 1, 0, () => turbine(t, on));
    const wireP = []; for (let k = 0; k <= 40; k++) { const x = lerp(TURB[0] + 120, CITY[0] - 380, k / 40); wireP.push([x, 20 - 60 * Math.sin(Math.PI * ((k % 10) / 10))]); }
    [TURB[0] + 260, TURB[0] + 520].forEach(x => at(x, 300, .9, 0, () => pylon(280)));
    wire(wireP, t, 1, on);
    at(...CITY, 1, 0, () => city(t, lit, 760, 5));
    // fuel: deuterium from seawater, tritium made from lithium
    const fk = seg(t, a2 + .2, a2 + .6);
    if (fk > 0) { for (let i = 0; i < 5; i++) { const u = ((t - a2) * .6 + i / 5) % 1; ball(lerp(-1000, PLANT[0] - 120, u), lerp(440, 200, u) - 80 * Math.sin(Math.PI * u), 22, F.proton); }
      at(-880, 240, backOut(fk, 2) * 1.6, 0, () => { cut(blob(0, 0, 60, 7, .35, 8, 1.3, .9), '#C8C8D8', { z: 1.4 }); txt('ลิเทียม', 0, 2, 30, C.ink, { weight: 800, sa: 0 }); }); }
    // no carbon emitted while generating: a CO2 cloud is struck out
    const ck = seg(t, a3 + .1, a3 + .4);
    if (ck > 0 && t < a4 + .5) at(PLANT[0] + 40, -200, backOut(ck, 2) * 1.7, 0, () => { const p = new Path2D(); p.addPath(blob(0, 0, 70, 11, .2, 8, 1.6, .8)); p.addPath(blob(-50, -26, 50, 12, .2)); cut(p, '#7A7A8A', { z: 1.4 }); txt('CO2', 0, 4, 46, C.cream, { weight: 800, sa: 0 }); const s = seg(t, a3 + .4, a3 + .7); if (s > 0) at(0, 0, 1, -.5, () => cut(rrect(-130 * s, -10, 260 * s, 20, 8), C.red, { z: 1 })); });
    // desalination: seawater in, fresh water out to the city
    at(...DESAL, 1, 0, () => { cut(rrect(-200, -180, 400, 180, 14), '#4A6A96', { z: 2.2 }); for (let i = 0; i < 4; i++) cut(rrect(-170 + i * 90, -150, 60, 120, 10), mix('#7FA8D8', F.fresh, water), { z: .6 }); txt('โรงกลั่นน้ำ', 0, -210, 34, C.ink, { back: C.cream, z: 1, weight: 800 }); });
    if (water > 0) { cut(strip([[DESAL[0] - 210, 230], [CITY[0] + 400, 230]], 22), F.fresh, { z: 1.2, alpha: water }); for (let i = 0; i < 8; i++) { const u = ((t * .7 + i / 8) % 1); const x = lerp(DESAL[0] - 210, CITY[0] + 400, u); at(x, 230, 1, 0, () => cut(smooth([[0, -16], [10, 0], [0, 12], [-10, 0]]), '#FFFFFF', { z: .4, alpha: water })); } }
    if (lit > .2) glow(...CITY, 300, '#FFE08A', .25 * lit);
  });
  layer(0, () => {
    const sk = seg(t, a0, a0 + .25), so = seg(t, a1 + .4, a1 + .7);
    if (sk > 0 && so < 1) { X.save(); X.translate(0, -690); X.scale(lerp(1.5, 1, easeOut(sk)), lerp(1.5, 1, easeOut(sk))); X.globalAlpha = sk * (1 - so); txt('สถานการณ์สมมติ', 0, 0, 100, C.cream, { back: '#5A4EA8', z: 2, rot: -.03 }); txt('WHAT IF', 0, 100, 46, C.ink, { back: F.plasmaLt, z: 1.4, weight: 800, rot: -.03 }); X.restore(); }
    label('ไฟฟ้าสุทธิ → ทั้งเมือง', t, a1 + .75, a2 + .05, { back: F.grid, size: 80 });
    label('ดิวทีเรียมจากน้ำทะเล + ลิเทียม', t, a2 + .1, a3 + .05, { back: F.seaLt, col: C.cream, size: 62 });
    label('ไม่ปล่อยคาร์บอนตอนผลิตไฟ', t, a3 + .1, a4 + .3, { back: '#9FE3B5', size: 70 });
    label('อาจ: น้ำทะเล → น้ำจืด', t, a4 + .3, 28.75, { back: F.fresh, size: 84 });
  });
}
// ---------- S7: not magic ----------
function S7(t) {
  const [a0] = ph('L9', 0), [a1, b1] = ph('L9', 1), [a2] = ph('L9', 2), [a3, b3] = ph('L9', 3);
  setCam(...kf(t, [[28.6, [0, -60, 1.12]], [a1, [0, -40, 1.0]], [34.5, [0, -20, 1.03]]], ease5));
  layer(.1, () => { X.fillStyle = '#2A2440'; X.fillRect(-4000, -4000, 8000, 8000); for (let i = 0; i < 5; i++) cut(rrect(-1400, -1000 + i * 420, 2800, 180, 50), rgba('#352E52', .9), { z: .5, rim: false }); });
  layer(1, () => {
    const card = (i, at0, icon, title, n1, n2) => { const k = seg(t, at0, at0 + .35); if (k <= 0) return; const y = -470 + i * 310;
      at(0, y, backOut(k, 2), 0, () => { cut(rrect(-470, -130, 940, 260, 30), C.cream, { z: 2 }); at(-360, 0, 1, 0, icon); txt(title, -250, -50, 44, C.ink, { weight: 800, sa: 0, align: 'left' }); if (n1) txt(n1, -250, 16, 28, '#5A4A6A', { weight: 700, sa: 0, align: 'left' }); if (n2) txt(n2, -250, 60, 28, '#5A4A6A', { weight: 700, sa: 0, align: 'left' }); }); };
    card(0, a1 + .1, () => hazard(70), 'ชิ้นส่วนกลายเป็นสารกัมมันตรังสี', 'นิวตรอนทำให้วัสดุแผ่รังสี · ทริเทียมก็แผ่รังสี', 'ส่วนใหญ่อายุสั้นกว่ากากฟิชชัน แต่ไม่ใช่ศูนย์');
    card(1, a2, () => { for (let i = 0; i < 4; i++) cut(ell(0, 40 - i * 22, 52, 16, 0, i), i % 2 ? C.gold : '#E0A82A', { z: 1 }); }, 'ต้นทุนสูง', 'วัสดุต้องทนความร้อนและนิวตรอนได้นาน', 'วิศวกรรมระดับโรงไฟฟ้ายังต้องพิสูจน์');
    card(2, a3, () => { cut(rrect(-56, -56, 112, 112, 14), '#E8E2D4', { z: 1 }); cut(rrect(-56, -56, 112, 30, 10), C.red, { z: 1 }); txt('?', 0, 18, 64, C.ink, { weight: 800, sa: 0 }); }, 'ยังไม่รู้ว่าพร้อมเมื่อไหร่', 'ITER (แผนปี 2024): ทดลอง D-T ราวปี 2039', 'และ ITER เองไม่ได้ผลิตไฟฟ้า');
  });
  layer(0, () => label('ไม่ใช่เวทมนตร์', t, a0, 34.6, { back: C.cream, size: 100 }));
}
// ---------- S8: back to the Sun ----------
function S8(t) {
  const [a0, b0] = ph('L10', 0), [a1, b1] = ph('L10', 1), end = TL.duration;
  setCam(...kf(t, [[34.3, [520, 420, 1.3]], [a0 + .8, [300, 200, .6]], [b1, [SUNP[0], SUNP[1], .66]], [end, [SUNP[0], SUNP[1], .62]]], ease5));
  spaceBg(t);
  layer(1, () => {
    at(...SUNP, 1, 0, () => sunBall(380, t, {}));
    at(520, 420, 1, 0, () => earth(150, t * 20, { atmo: .5 }));
    glow(520, 420, 120 + 30 * Math.sin(t * 6), F.plasma, .55);
    // a thin line of light between the two fires
    const lk = seg(t, a1, a1 + .8); if (lk > 0) cut(strip([[520, 420], [lerp(520, SUNP[0] + 300, lk), lerp(420, SUNP[1] + 120, lk)]], 6, 2), rgba('#FFE7B0', .8), { z: 0, rim: false, grain: 0 });
  });
  layer(0, () => {
    const k = seg(t, a1 + .4, a1 + .9);
    if (k > 0) at(0, -680, backOut(k, 1.8), -.02, () => { txt('ถ้าเราสร้างดวงอาทิตย์', 0, 0, 84, C.cream, { back: F.sun3, z: 2 }); txt('บนโลกได้สำเร็จ?', 0, 110, 84, C.cream, { back: F.sun3, z: 2 }); });
    label('ยังสร้างไม่ได้ · กำลังเรียนรู้', t, a0 + .1, a1 + .3, { back: F.sun1, size: 72 });
  });
}

const SCENES = [[0, S1], [5.0, S2], [9.15, S3], [12.7, S4], [18.7, S5], [28.6, S7], [34.3, S8]];
