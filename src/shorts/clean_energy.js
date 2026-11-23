// clean_energy.js: the shots of the Short "ถ้าโลกเปลี่ยนไปใช้พลังงานสะอาดทั้งหมด?". Every beat is tied to the narration:
// NT[key] = [start, end] of a line, ph(key, i) = onset of its i-th phrase (subs_th.js). See shorts/clean-energy/STORYBOARD.md.
(() => {
  const SC = 1.0;
  const pop = (t, t0, d = .35) => seg(t, t0, t0 + d);
  const out = (t, t1, d = .3) => 1 - seg(t, t1, t1 + d);
  // chips that tell present-day data from the imagined future
  const chip = (txt, kind, a) => { if (a <= 0) return; const col = kind === 'fact' ? '#2F5E57' : '#8A4E7A';
    layer(0, () => { cut(Pc(70, 172, 9), kind === 'fact' ? '#7BE0A6' : '#F5A3D3', 0, { tex: 0, alpha: a }); ptext(txt, 92, 172, 30, '#FFFFFF', { card: col, align: 'left', weight: 500, lv: 0, alpha: a }); }); };
  const source = (txt, x, y, a, align = 'center') => ptext(txt, x, y, 26, '#4A3F3A', { card: 'rgba(250,244,232,.92)', weight: 400, lv: 0, alpha: a, align });
  // a sheet of paper that slides up over the frame (p 0 → .5 covers, .5 → 1 leaves at the top); cut at p = .5
  function sheetWipe(p, col = '#F1E7D3') {
    if (p <= 0 || p >= 1) return;
    const y = p < .5 ? lerp(H + 120, -40, easeOut(p * 2)) : lerp(-40, -H - 260, ease((p - .5) * 2));
    layer(0, () => {
      const top = [], n = 18; for (let i = 0; i <= n; i++) top.push([i / n * W, y + Math.sin(i * 1.7) * 14 + (i % 2) * 10]);
      cut(Pp([...top, [W, y + H + 300], [0, y + H + 300]]), col, 4, { sa: .4, edge: .4 });
      cut(Pp([...top.map(([x, yy]) => [x, yy + 40]), [W, y + H + 300], [0, y + H + 300]]), mixCol(col, '#2E9C8E', .12), 0, { tex: .5 });
    });
  }
  // numeric integral of a speed curve: rotation angle of something whose speed changes (turbine blades)
  const spinOf = (t, t0, v) => { let a = 0; const n = 40, dt = (t - t0) / n; for (let i = 0; i < n; i++) a += v(t0 + (i + .5) * dt) * dt; return a; };

  // ===================== 1 · HOOK: the planet on fossil fuel =====================
  function s1(t, lt, dur) {
    pcBegin('#141B33'); sky('#10172C', '#1B2645', '#2A3760'); stars(t, 1);
    const snap = ph('n01', 4), z = kf(t, [[0, 1.18], [snap, 1.0], [dur, .96]], easeOut);
    pcCam(540, 1060, z, kf(t, [[0, .03], [dur, 0]]));
    const ex = 540, ey = 1080, R = 260;
    const icons = [['oil', ph('n01', 1) + .25, -2.6], ['coal', ph('n01', 2), -1.57], ['gas', ph('n01', 3), -.54]];
    layer(.4, () => { for (const r of [380, 480]) { PX.save(); PX.strokeStyle = 'rgba(255,240,210,.14)'; PX.lineWidth = 3; PX.setLineDash([10, 16]); PX.beginPath(); PX.ellipse(ex, ey, r, r * .9, 0, 0, TAU); PX.stroke(); PX.restore(); } });
    layer(1, () => {
      const clean = kf(t, [[snap, 0], [snap + .7, .55], [dur, .62]]);
      // smog halo around the fossil planet, thinning after the snip
      for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t * .15, rr = R * 1.08 + 18 * Math.sin(t * 1.3 + i);
        cut(Pc(ex + Math.cos(a) * rr, ey + Math.sin(a) * rr, 70 + 14 * Math.sin(i * 2 + t)), '#8C7E70', 2, { alpha: .55 * (1 - clean * 1.4), sa: .2 }); }
      earth(ex, ey, R, t, clean);
      for (const [kind, t0, ang] of icons) {
        const k = pop(t, t0, .4), fly = easeIn(seg(t, snap, snap + .75)), a = ang + Math.sin(t * 1.2 + ang) * .05, d = 380 + fly * 700;
        if (k <= 0 || fly >= 1) continue;
        const ix = ex + Math.cos(a) * d, iy = ey + Math.sin(a) * d * .9, s = backOut(k) * (1 - fly * .4), rot = fly * 3 * Math.sign(Math.cos(a));
        if (fly <= 0) strip(sag([ex + Math.cos(a) * R * .95, ey + Math.sin(a) * R * .95], [ix, iy], 30), '#2B2522', 9, 1);   // the "plug" cable
        else { const cx = ex + Math.cos(a) * (R + 40 + fly * 200), cy = ey + Math.sin(a) * (R + 40 + fly * 200); strip([[ex + Math.cos(a) * R, ey + Math.sin(a) * R], [cx, cy]], '#2B2522', 9, 1, { alpha: 1 - fly }); }
        PX.save(); PX.globalAlpha = 1 - fly; PX.translate(ix, iy); PX.rotate(rot); PX.scale(s, s);
        cut(Pc(0, 0, 86), '#F3EBDC', 3, { edge: .3 });
        if (kind === 'oil') { cut(Pblob([[0, -58], [34, 0], [30, 34], [0, 50], [-30, 34], [-34, 0]]), '#2A2422', 1); cut(Pe(-12, 10, 8, 14), '#6B625C', 0); }
        if (kind === 'coal') { ore(-14, 8, 34, '#3A3432', 3, 1); ore(22, -12, 26, '#4A4340', 8, 1); }
        if (kind === 'gas') { cut(Pblob([[0, -56], [30, -6], [26, 30], [0, 44], [-26, 30], [-30, -6]]), '#3D7BD9', 1); cut(Pblob([[0, -18], [14, 8], [10, 28], [0, 34], [-10, 28], [-14, 8]]), '#9CC8FF', 0); }
        PX.restore();
        ptext({ oil: 'น้ำมัน', coal: 'ถ่านหิน', gas: 'ก๊าซ' }[kind], ix, iy + 112 * s, 40, '#FFF3DA', { lv: 2, alpha: k * (1 - fly) });
      }
      if (t > snap - .05 && t < snap + .4) shine(ex, ey, 520, '#FFF2C8', .7 * (1 - seg(t, snap, snap + .4)));      // the snip
    });
    layer(0, () => {
      ptext('ถ้าโลกเลิกใช้ฟอสซิล', 540, 300, 78, '#FFF3DA', { pop: pop(t, .15, .45), lv: 3, weight: 700 });
      ptext('ทั้งหมด?', 540, 440, 150, '#FFD84D', { pop: pop(t, snap - .05, .4), lv: 4, weight: 800, rot: -.04 });
    });
    pcEnd();
  }

  // ===================== 2 · SETUP: the fossil world =====================
  function s2(t, lt, dur) {
    pcBegin(FOS.sky1);
    sky('#B8A285', '#A08A70', '#7E6C5A');
    const t0 = NT.n02[0], a3 = ph('n03', 2);
    const cx = kf(t, [[t0, 540], [ph('n03', 0), 520], [ph('n03', 1) + .4, 600], [a3 + .2, 540]]);
    const cy = kf(t, [[t0, 1000], [ph('n03', 0) - .1, 1040], [ph('n03', 0) + .6, 1300], [ph('n03', 1) + .4, 1380], [a3 + .5, 760], [dur, 700]]);
    const z = kf(t, [[t0, 1.0], [ph('n03', 0) + .6, 1.18], [ph('n03', 1) + .4, 1.22], [a3 + .5, 1.0], [dur, .98]]);
    pcCam(cx, cy, z);
    layer(.15, () => { for (let i = 0; i < 6; i++) { const x = ((i * 260 + t * 18) % 1600) - 260; cloud(x, 420 + (i % 3) * 140, 1.3, '#8E7E6E', 2, { alpha: .8 }); } });
    // the CO2 load building in the sky
    const co2 = seg(t, a3 - .1, a3 + 1.6);
    layer(.45, () => { for (let i = 0; i < 11; i++) { const k = clamp(co2 * 11 - i), x = 140 + (i * 97) % 800, y = 470 - (i % 4) * 70 + Math.sin(t + i) * 8;
      if (k > 0) cloud(x, y, (.9 + .25 * (i % 3)) * backOut(k), i % 2 ? '#5A4F49' : '#6A5E57', 3, { sa: .35 }); } });
    layer(.3, () => {
      cut(hills(1150, 40, .006, 1), '#8E7A66', 1);
      for (const x of [120, 210, 860, 960]) { cut(Pr(x, 1060, 22, 110), '#7D6B5B', 1); smoke(x + 11, 1060, .5, t, .7, '#8D8177'); }
    });
    layer(.65, () => {
      cut(hills(1290, 30, .004, 3), FOS.hill, 2);
      coalPlant(310, 1300, .86, t, 1);
      refinery(800, 1320, .78, t, 1);
    });
    layer(1, () => {
      cut(Pr(-400, 1400, W + 800, 1200), FOS.ground, 3);
      cut(Pr(-400, 1470, W + 800, 110), FOS.road, 1);
      for (let i = 0; i < 14; i++) cut(Pr(-300 + i * 120 - (t * 260) % 120, 1522, 60, 8), '#D9C9A8', 0, { tex: .3 });
      const cols = ['#C0533A', '#3E6E8E', '#D9A441', '#6F8F5E', '#8A6A9A'];
      for (let i = 0; i < 5; i++) { const x = ((t * 230 + i * 330) % 1650) - 280; car(x, 1515, .85, cols[i], { t: t + i }); }
      for (let i = 0; i < 4; i++) { const x = W + 280 - ((t * 190 + i * 410) % 1650); car(x, 1570, .9, cols[(i + 2) % 5], { t: t + i * 2, flip: true }); }
      pumpjack(260, 1760, .8, t); pumpjack(780, 1790, .7, t + 1.1);
      cut(Pr(430, 1640, 200, 150, 4), FOS.brick, 2); chimney(470, 1640, 26, 160, t, .9, .6); chimney(590, 1640, 22, 120, t + .7, .9, .5);    // a factory
    });
    layer(0, () => {
      // the 80% ring
      const k = pop(t, ph('n02', 1) - .1, .9), go = out(t, NT.n03[0] + .2, .4);
      if (k > 0 && go > 0) {
        PX.save(); PX.globalAlpha = go; PX.translate(0, (1 - go) * -60);
        const x = 540, y = 470, r = 175;
        cut(Pc(x, y, r + 26), '#F4ECDD', 3, { sa: .3 });
        PX.save(); PX.lineCap = 'butt';
        PX.lineWidth = 62; PX.strokeStyle = '#D9CCB6'; PX.beginPath(); PX.arc(x, y, r - 30, 0, TAU); PX.stroke();
        PX.shadowColor = SHADE + '.35)'; PX.shadowBlur = 10; PX.shadowOffsetY = 4;
        PX.strokeStyle = '#5E4D42'; PX.beginPath(); PX.arc(x, y, r - 30, -Math.PI / 2, -Math.PI / 2 + TAU * .8 * easeOut(k)); PX.stroke(); PX.restore();
        ptext(`${Math.round(80 * easeOut(k))}%`, x, y - 8, 96, '#3A2E2A', { lv: 1, weight: 800 });
        ptext('ฟอสซิล', x, y + 66, 36, '#5E4D42', { lv: 0, weight: 600 });
        ptext('ของพลังงานทั้งหมดที่โลกใช้', x, y + r + 70, 40, '#FFF3DA', { lv: 2, weight: 600, card: 'rgba(70,55,45,.88)' });
        source('ที่มา: IEA · ราว 4 ใน 5 ของอุปทานพลังงานโลก', x, y + r + 140, 1);
        PX.restore();
      }
      const kc = pop(t, a3 + .3, .5);
      ptext('~38,000 ล้านตัน CO₂', 540, 300, 72, '#FFF3DA', { pop: kc, lv: 3, weight: 800, card: 'rgba(60,48,42,.9)' });
      ptext('ต่อปี จากภาคพลังงาน', 540, 405, 42, '#FFF3DA', { alpha: kc, lv: 2 });
      if (kc > 0) source('ที่มา: IEA Global Energy Review (2024–2025)', 540, 470, kc);
      chip('ข้อมูลปัจจุบัน', 'fact', pop(t, t0 + .2, .3));
    });
    if (lt > dur - .2) sheetWipe((lt - (dur - .2)) / .4);
    pcEnd();
  }

  // ===================== 3 · ESCALATION: sun, wind, storage and a smart grid =====================
  function s3(t, lt, dur) {
    const T0 = NT.n04[0] - .2, night = seg(t, ph('n05', 0) - .1, ph('n05', 0) + 1.2), sunUp = easeOut(seg(t, T0 - .2, T0 + 1.6));
    const day = mixCol(mixCol('#F7D9B5', CLN.sky1, sunUp), NIGHT.sky1, night);
    pcBegin(day);
    sky(mixCol(mixCol('#F3C9A4', CLN.sky0, sunUp), NIGHT.sky0, night), day, mixCol(mixCol('#F9E6C9', CLN.sky2, sunUp), NIGHT.sky2, night));
    stars(t, night);
    const bat = ph('n05', 1), grid = ph('n05', 2);
    const z = kf(t, [[T0, 1.08], [ph('n04', 1) + .4, 1.0], [bat - .2, 1.0], [bat + .7, 1.1], [dur, 1.14]]);
    const cy = kf(t, [[T0, 1060], [ph('n04', 1) + .4, 980], [bat - .2, 1000], [bat + .7, 1180], [dur, 1200]]);
    pcCam(540, cy, z);
    layer(.12, () => {
      const sy = lerp(1250, 520, sunUp) + night * 900;
      if (night < 1) sun(780, sy, 90, t, { alpha: 1 - night * .3 });
      if (night > 0) moon(250, lerp(700, 380, night), 54);
      for (let i = 0; i < 4; i++) cloud(((i * 330 + t * 14) % 1500) - 220, 640 + (i % 2) * 120, 1, mixCol('#FFFFFF', '#4B5C86', night), 2, { alpha: .9 });
    });
    const wind = t => lerp(2.2, .35, ease(seg(t, ph('n05', 0), ph('n05', 0) + 1.2)));   // the wind drops at night
    const ang = spinOf(t, T0, wind);
    layer(.3, () => {
      cut(hills(1180, 46, .005, 2), mixCol(CLN.hill1, NIGHT.hill, night), 1);
      for (const [x, s, ph0] of [[130, .42, 0], [330, .5, 1.1], [760, .46, 2.2], [950, .4, .5]]) turbine(x, 1170 + Math.sin(x * .005 + 2) * 30, s, ang + ph0, { col: mixCol(CLN.white, '#9AA6C4', night), lv: 1 });
    });
    layer(.6, () => {
      cut(hills(1330, 34, .004, 5), mixCol(CLN.hill2, NIGHT.hill2, night), 2);
      for (const [x, s, ph0] of [[200, .72, .4], [560, .8, 1.7]]) turbine(x, 1325, s, ang * 1.1 + ph0, { col: mixCol(CLN.white, '#A7B2CE', night) });
      // the town, lit by the batteries at night
      const lit = night * seg(t, bat + .3, grid + .2);
      [[700, 120, 210, '#E7C9A0'], [830, 100, 300, '#D8B58A'], [940, 120, 240, '#E9D2B0'], [1050, 90, 170, '#D2A97E']].forEach(([x, w, h, col]) =>
        building(x - 40, 1340, w, h, mixCol(col, '#3B4668', night * .7), lit, { solar: true, glow: .3 * lit, cw: 16, ch: 20, gx: 12, gy: 16 }));
    });
    layer(1, () => {
      cut(Pr(-400, 1440, W + 800, 1100), mixCol(CLN.hill3, '#1F3A3A', night), 3);
      for (let r = 0; r < 4; r++) for (let cI = 0; cI < 3; cI++) {
        const i = r * 3 + cI, k = easeOut(seg(t, ph('n04', 0) + i * .1, ph('n04', 0) + i * .1 + .5));
        solarRow(60 + cI * 300 + (r % 2) * 60 - 40, 1560 + r * 110, 250, .95, k, t, { col: mixCol(CLN.panel, '#1E2C46', night) });
      }
      // battery containers rise in at night, then discharge into the grid
      const kb = backOut(seg(t, bat - .1, bat + .45)), chg = lerp(1, .55, seg(t, bat + .5, dur));
      if (kb > 0) for (let i = 0; i < 3; i++) { PX.save(); PX.translate(0, (1 - kb) * 260); battery(560 + i * 150, 1960, 136, 120, chg, t); PX.restore(); }
    });
    // the smart grid: power lines and a network of energy moving both ways
    const kg = seg(t, bat + .2, bat + .9), kn = seg(t, grid - .2, grid + .6);
    if (kg > 0) layer(1, () => {
      const A = [630, 1840], B = [880, 1600], C = [1000, 1420];
      const l1 = sag(A, B, 30), l2 = sag(B, C, 24);
      strip(l1, '#C9D3E6', 4, 1, { alpha: kg }); strip(l2, '#C9D3E6', 4, 1, { alpha: kg });
      pulses(l1.concat(l2), t, 4, .7, NIGHT.glow, 12, kg * night);
    });
    if (kn > 0) layer(1, () => {
      const N = [[200, 900], [560, 820], [140, 1580], [460, 1700], [690, 1860], [880, 1240], [980, 1100]];
      const E = [[0, 1], [1, 6], [0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [1, 5], [3, 5]];
      E.forEach(([i, j], n) => { const P = sag(N[i], N[j], -40); strip(P, rgba('#9FF0D0', .7), 4, 0, { alpha: kn });
        pulses(n % 2 ? P.slice().reverse() : P, t + n * .3, 2, .55, n % 3 ? '#9FF0D0' : NIGHT.glow, 10, kn); });
      N.forEach(([x, y], i) => { cut(Pc(x, y, 18 * backOut(clamp(kn * 2 - i * .1))), '#EFFFF8', 2, { tex: 0 }); shine(x, y, 60, '#9FF0D0', .5 * kn); });
    });
    layer(0, () => {
      // the solar cost chart
      const kc = pop(t, ph('n04', 0) + .3, .5), go = out(t, NT.n05[0] + .1, .4), drop = easeOut(seg(t, ph('n04', 1), ph('n04', 1) + .9));
      if (kc > 0 && go > 0) {
        PX.save(); PX.globalAlpha = go * clamp(kc * 1.5);
        cut(Pr(150, 210, 780, 520, 26), 'rgba(250,244,232,.95)', 3, { sa: .3 });
        ptext('ต้นทุนไฟฟ้าโซลาร์', 540, 275, 50, '#2D4B5A', { lv: 0, weight: 700 });
        const base = 650, hMax = 300, h2 = lerp(hMax, hMax * .1, drop);
        cut(Pr(290, base - hMax * backOut(kc), 170, hMax * backOut(kc), 8), '#C98B5A', 2); ptext('2010', 375, base + 34, 34, '#4A3F3A', { lv: 0 });
        cut(Pr(620, base - h2 * backOut(kc), 170, h2 * backOut(kc), 8), '#3FA77A', 2); ptext('2024', 705, base + 34, 34, '#4A3F3A', { lv: 0 });
        ptext('−90%', 705, base - h2 - 60, 72, '#2E8C6E', { pop: drop, lv: 2, weight: 800 });
        PX.restore();
        source('ที่มา: IRENA (2025) · ค่าไฟเฉลี่ยตลอดอายุ (LCOE) โซลาร์ฟาร์ม', 540, 790, go * kc);
      }
      const kb = pop(t, bat + .1, .4) * out(t, grid - .45, .25);
      if (kb > 0) { ptext('แบตเตอรี่: สำรองไฟได้หลายชั่วโมง', 540, 300, 50, '#FFF3DA', { pop: kb, card: 'rgba(30,42,74,.92)', lv: 2 }); ptext('ยังไม่ใช่ข้ามฤดูกาล', 540, 390, 40, '#FFD84D', { alpha: kb, lv: 2 }); }
      const kn2 = pop(t, grid - .1, .4);
      if (kn2 > 0) { ptext('Smart Grid', 540, 300, 76, '#9FF0D0', { pop: kn2, card: 'rgba(20,32,60,.92)', lv: 2, weight: 700 });
        ptext('จับคู่การผลิตกับการใช้ไฟ ทุกวินาที', 540, 405, 40, '#FFF3DA', { alpha: kn2, lv: 2 }); }
      chip('ข้อมูลปัจจุบัน', 'fact', pop(t, T0 + .3, .3));
    });
    if (lt < .2) sheetWipe(.5 + lt / .4);
    pcEnd();
  }

  // ===================== 4a · TURNING POINT: electricity is only a fifth =====================
  function s4a(t, lt, dur) {
    pcBegin('#E9DFCC'); sky('#EFE6D4', '#E2D5BE', '#CDBCA2');
    const T0 = NT.n06[0], kE = ph('n06', 1), z = kf(t, [[T0 - .3, 1.12], [kE + .3, 1.0], [dur, .97]]), sh = shakeXY(t, 6 * Math.exp(-6 * Math.max(0, t - kE)) * (t > kE ? 1 : 0));
    pcCam(540 + sh[0], 940 + sh[1], z);
    layer(.3, () => { for (let i = 0; i < 7; i++) cut(Pr(-40 + i * 170, 1500 + (i % 2) * 40, 150, 600, 10), '#D8C9AE', 1, { sa: .2 }); });
    layer(1, () => {
      const labels = ['น้ำมัน', 'ก๊าซ', 'ถ่านหิน', 'ชีวมวล ฯลฯ'];
      for (let i = 0; i < 5; i++) {
        const k = easeOut(seg(t, T0 - .2 + i * .14, T0 + .25 + i * .14)), y = 1330 - i * 158 - (1 - k) * 900, elec = i === 4;
        if (k <= 0) continue;
        const lift = elec ? 30 * ease(seg(t, kE, kE + .4)) : 0, x0 = 190 - (elec ? lift : 0);
        cut(Pr(x0, y - 140, 700 + lift * 2, 140, 18), elec ? mixCol('#B9AE9C', '#FFD84D', seg(t, kE, kE + .3)) : mixCol('#8E8172', '#776A5D', i * .2), elec ? 4 : 3, { edge: .2 });
        if (elec) { const g = seg(t, kE, kE + .3); bolt(300, y - 70, 46, '#FFF6C8', 2, { alpha: g }); shine(540, y - 70, 360, '#FFE27A', .5 * g);
          ptext('ไฟฟ้า', 560, y - 74, 64, '#3A2E2A', { lv: 0, weight: 700, alpha: .4 + .6 * g }); }
        else { ptext(labels[i], 540, y - 70, 46, '#F4EBDD', { lv: 1, weight: 500 }); smoke(820, y - 140, .35, t + i, .6, '#9A8C7E', { rise: 200, n: 4 }); }
      }
    });
    layer(0, () => {
      const k = pop(t, kE + .1, .4);
      ptext('ไฟฟ้า ≈ 1 ใน 5', 540, 260, 92, '#3A2E2A', { pop: k, lv: 3, weight: 800, card: '#FFD84D' });
      ptext('ของพลังงานที่โลกใช้จริงปลายทาง', 540, 380, 42, '#3A2E2A', { alpha: k, lv: 1, weight: 600 });
      const k2 = pop(t, ph('n06', 2) + .1, .4);
      ptext('อีก 4 ใน 5 ยังเผาเชื้อเพลิงโดยตรง', 540, 1430, 42, '#FFF3DA', { pop: k2, card: 'rgba(70,55,45,.92)', lv: 2 });
      if (k > 0) source('ที่มา: IEA · ปี 2023 ราว 20%', 540, 448, k);
      chip('ข้อมูลปัจจุบัน', 'fact', 1);
    });
    SUB_Y = 1640;
    pcEnd();
  }

  // ===================== 4b · the hard sectors =====================
  function s4b(t, lt, dur) {
    pcBegin('#E4D8C2'); sky('#E9DFCC', '#DCCDB3', '#CBB89B');
    pcCam(540, 960, kf(t, [[NT.n07[0] - .2, 1.04], [dur, 1.0]]));
    const cards = [[0, 'เหล็ก', 0, '#C9A27E'], [1, 'ซีเมนต์', 1, '#BDB2A2'], [2, 'เครื่องบิน', 2, '#A9CBE0'], [3, 'เรือ', 3, '#9DBCCB']];
    layer(1, () => cards.forEach(([i, name, p, bg]) => {
      const k = backOut(seg(t, ph('n07', p) - .12, ph('n07', p) + .3)); if (k <= 0) return;
      const cx = 290 + (i % 2) * 500, cy = 640 + Math.floor(i / 2) * 560;
      PX.save(); PX.translate(cx, cy); PX.scale(k, k); PX.rotate((i % 2 ? .02 : -.02) + Math.sin(t * 1.5 + i) * .006); PX.translate(-cx, -cy);
      cut(Pr(cx - 230, cy - 250, 460, 500, 24), bg, 3, { edge: .25 });
      PX.save(); PX.clip(Pr(cx - 230, cy - 250, 460, 500, 24));
      cut(hills(cy + 140, 14, .02, i), mixCol(bg, '#5E4D42', .45), 1);
      if (i === 0) furnace(cx - 70, cy + 160, .78, t);
      if (i === 1) kiln(cx + 20, cy + 160, .8, t);
      if (i === 2) { airplane(cx + Math.sin(t) * 10, cy - 30, .95); for (let n = 0; n < 4; n++) cut(Pc(cx - 190 - n * 50, cy - 26, 12 + n * 4), '#F4F1EA', 1, { alpha: .8 - n * .15 }); }
      if (i === 3) { cut(Pr(cx - 240, cy + 120, 480, 200), '#4C7F96', 1); ship(cx, cy + 130, .72, t); }
      PX.restore();
      ptext(name, cx, cy + 205, 52, '#FFFFFF', { lv: 2, weight: 700, card: 'rgba(58,46,42,.85)' });
      PX.restore();
    }));
    layer(0, () => {
      const k = pop(t, ph('n07', 4) - .05, .35);
      ptext('ยังเปลี่ยนยาก', 540, 920, 104, '#FFF3DA', { pop: k, card: '#B5483A', lv: 4, weight: 800, rot: -.06 });
      ptext('ต้องใช้ความร้อนสูงมาก หรือพลังงานที่หนาแน่น', 540, 230, 40, '#3A2E2A', { pop: pop(t, ph('n07', 0), .4), lv: 1, card: 'rgba(250,244,232,.92)' });
      chip('ข้อมูลปัจจุบัน', 'fact', 1);
    });
    pcEnd();
  }

  // ===================== 4c · minerals: clean is not impact-free =====================
  function s4c(t, lt, dur) {
    pcBegin('#D8C7AA'); sky('#E7D7BC', '#D7C2A1', '#B99B76');
    const T0 = NT.n08[0], six = ph('n08', 1), clean = ph('n08', 2);
    pcCam(540, kf(t, [[T0 - .2, 1000], [six + 1.2, 960], [clean, 1060], [dur, 1100]]), kf(t, [[T0 - .2, 1.0], [six + 1.2, 1.02], [clean, 1.06], [dur, 1.08]]));
    layer(.4, () => { cut(hills(1360, 30, .006, 4), '#C29E77', 1); });
    layer(.7, () => { cut(Pr(-400, 1480, W + 800, 900), '#C9A57D', 2); mine(540, 1500, 1000, 1, t);
      for (let i = 0; i < 4; i++) smoke(300 + i * 160, 1520, .5, t + i, .55 * seg(t, clean - .5, clean + .5), '#D8C2A0', { rise: 240, n: 4 }); });
    layer(1, () => {
      cut(Pr(-400, 1350, W + 800, 30), '#8A6A4D', 2);
      car(290, 1345, 1.05, '#3FA77A', { ev: true, t }); car(800, 1345, 1.05, '#B5483A', { t, smoke: .6 });
      const ores = [['ทองแดง', '#C8703A'], ['ลิเธียม', '#D9D4C7'], ['นิกเกิล', '#9AA39A'], ['แมงกานีส', '#7D6C8A'], ['กราไฟต์', '#4A4744'], ['โคบอลต์', '#3E6FB0']];
      ores.forEach(([name, col], i) => { const k = easeOut(seg(t, six - .3 + i * .16, six + .05 + i * .16)); if (k <= 0) return;
        const y = 1180 - i * 108 - (1 - k) * 700, x = 290 + (i % 2 ? 14 : -14);
        ore(x, y, 56, col, i * 5); ptext(name, x + 140, y, 30, '#3A2E2A', { lv: 0, weight: 500, align: 'left', alpha: k }); });
      const k1 = easeOut(seg(t, six - .3, six + .05)); if (k1 > 0) { ore(800, 1180 - (1 - k1) * 700, 56, '#C8703A', 3); ptext('ทองแดง ฯลฯ', 800, 1080, 30, '#3A2E2A', { lv: 0, alpha: k1 }); }
      ptext('รถไฟฟ้า', 290, 1420, 38, '#FFFFFF', { lv: 2, weight: 600 }); ptext('รถน้ำมัน', 800, 1420, 38, '#FFFFFF', { lv: 2, weight: 600 });
    });
    layer(0, () => {
      const k = pop(t, six + .9, .35) * out(t, clean - .15, .3);
      if (k > 0) ptext('แร่ ×6', 760, 520, 120, '#3A2E2A', { pop: k, card: '#FFD84D', lv: 4, weight: 800, rot: .05 });
      const k2 = pop(t, clean - .05, .4);
      ptext('สะอาด ≠ ไร้ผลกระทบ', 540, 330, 76, '#FFF3DA', { pop: k2, card: 'rgba(70,52,40,.94)', lv: 3, weight: 800 });
      if (k2 > 0) ptext('เหมือง น้ำ และชุมชน ต้องได้รับการดูแล', 540, 440, 38, '#3A2E2A', { alpha: k2, lv: 0, card: 'rgba(250,244,232,.9)' });
      source('ที่มา: IEA (2021) · แร่ต่อคัน ไม่รวมเหล็กและอะลูมิเนียม', 540, 230, pop(t, six, .4) * out(t, clean - .15, .3));
      chip('ข้อมูลปัจจุบัน', 'fact', 1);
    });
    SUB_Y = 1600;
    pcEnd();
  }

  // ===================== 5a · CONCLUSION: a cleaner city (imagined) =====================
  function s5a(t, lt, dur) {
    const T0 = NT.n09[0], air = seg(t, ph('n09', 1) - .2, ph('n09', 1) + 1.0);
    pcBegin(CLN.sky1); sky(mixCol('#BFB5A3', '#BFE6F2', air), mixCol('#A99C88', '#8ED0E4', air), mixCol('#968A78', '#6FBFD8', air));
    pcCam(kf(t, [[T0 - .3, 600], [dur, 480]]), 980, kf(t, [[T0 - .3, 1.12], [dur, 1.02]]));
    layer(.1, () => { sun(820, 430, 70, t, { glowA: .5 * air + .1 }); for (let i = 0; i < 3; i++) cloud(((i * 420 + t * 20) % 1500) - 200, 560 + i * 60, .9, '#FFFFFF', 2, { alpha: .9 }); });
    const ang = t * 1.6;
    layer(.3, () => { cut(hills(1120, 40, .005, 7), CLN.hill1, 1);
      for (const [x, s] of [[60, .4], [230, .46], [420, .38], [880, .44], [1060, .4]]) turbine(x, 1120 + Math.sin(x * .005 + 7) * 28, s, ang + x, { lv: 1 }); });
    layer(.6, () => {
      cut(hills(1290, 20, .004, 2), CLN.hill2, 2);
      [[-120, 130, 360, '#F2E3C8'], [30, 110, 260, '#E7CFA8'], [160, 150, 420, '#F6EBD8'], [330, 120, 300, '#DDBF96'], [470, 140, 470, '#EFDFC4'], [630, 110, 330, '#E3C9A2'], [760, 150, 390, '#F4E6CF'], [930, 120, 280, '#DCC09A'], [1070, 130, 340, '#EEDDC0']].forEach(([x, w, h, col], i) =>
        building(x, 1300, w, h, col, .15, { solar: i % 2 === 0, cw: 16, ch: 22, gx: 14, gy: 18, win: '#BFE3EE' }));
      for (let i = 0; i < 8; i++) tree(-60 + i * 170, 1305, .8 + (i % 3) * .15, i % 2 ? CLN.hill3 : CLN.hill4);
    });
    layer(.8, () => { cut(Pr(-500, 1380, W + 1200, 26), '#8E9AA0', 2); train(((t * 300) % 2600) - 900, 1378, .9, 4); });
    layer(1, () => {
      cut(Pr(-500, 1460, W + 1200, 900), CLN.hill3, 3); cut(Pr(-500, 1520, W + 1200, 120), '#4A5A5E', 1);
      for (let i = 0; i < 16; i++) cut(Pr(-400 + i * 120 - (t * 200) % 120, 1576, 60, 8), '#E8F2EE', 0, { tex: .3 });
      bus(((t * 150) % 1700) - 300, 1575, .8, '#2E9C8E', t);
      const cols = ['#EE8B6A', '#F2C14E', '#7FB8E0']; for (let i = 0; i < 3; i++) car(W + 300 - ((t * 210 + i * 560) % 1700), 1630, .85, cols[i], { ev: true, t: t + i, flip: true });
      for (let i = 0; i < 6; i++) tree(-40 + i * 200, 1760, 1.1, i % 2 ? CLN.hill4 : '#4FA078');
    });
    layer(0, () => {
      if (air < 1) { PX.save(); PX.globalAlpha = .55 * (1 - air); PX.fillStyle = '#9C8F82'; PX.fillRect(0, 0, W, H); PX.restore(); }
      const k = pop(t, ph('n09', 2) - .1, .45);
      ptext('~5 ล้านคน / ปี', 540, 280, 96, '#1F4E46', { pop: k, card: 'rgba(250,250,244,.95)', lv: 3, weight: 800 });
      ptext('การเสียชีวิตที่โยงกับมลพิษอากาศจากฟอสซิล', 540, 395, 38, '#FFFFFF', { alpha: k, lv: 2, card: 'rgba(31,78,70,.9)' });
      if (k > 0) source('ที่มา: BMJ (2023) · ค่าประมาณจากแบบจำลอง', 540, 465, k);
      chip('สถานการณ์สมมติ', 'scenario', pop(t, T0, .3));
    });
    pcEnd();
  }

  // ===================== 5b · the whole planet, wired =====================
  function s5b(t, lt, dur) {
    pcBegin('#141B33'); sky('#0F1730', '#1A2848', '#24406A'); stars(t, 1);
    const T0 = NT.n10[0], q = ph('n10', 2), z = kf(t, [[T0 - .3, 1.45], [q, 1.0], [DUR, .94]], ease);
    pcCam(540, kf(t, [[T0 - .3, 1100], [q, 1020]]), z);
    const ex = 540, ey = 1030, R = 300, rot = t * .03;
    layer(1, () => {
      earth(ex, ey, R, t, .95, { spin: .03 });
      // cities on the continents (same coordinates as earth()), linked by glowing lines
      const C = [[.12, -.35], [.28, .3], [.8, -.3], [.98, .42], [1.5, -.45], [.62, -.05]], k = seg(t, T0 + .2, T0 + 1.6);
      const P = C.map(([u, v]) => { let x = (u - frac(rot) * 2) * R * 1.1; while (x < -R * 1.2) x += 2 * R * 1.1; while (x > R * 1.2) x -= 2 * R * 1.1; return [ex + x, ey + v * R]; });
      const vis = ([x, y]) => Math.hypot(x - ex, y - ey) < R * .96;
      PX.save(); PX.clip(Pc(ex, ey, R * 1.25));
      [[0, 1], [0, 2], [2, 5], [1, 5], [2, 3], [5, 3], [2, 4]].forEach(([i, j], n) => { if (!vis(P[i]) || !vis(P[j])) return;
        const m = [(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2 - 60], L = through([P[i], m, P[j]], 8);
        strip(L, rgba('#9FF0D0', .8), 4, 0, { alpha: clamp(k * 3 - n * .3) }); pulses(L, t + n * .4, 2, .45, n % 2 ? '#FFE27A' : '#9FF0D0', 9, clamp(k * 3 - n * .3)); });
      P.forEach((p, i) => { if (vis(p)) { shine(p[0], p[1], 50, '#FFE9A0', .7 * clamp(k * 3 - i * .2)); cut(Pc(p[0], p[1], 9), '#FFF6D8', 1, { tex: 0, alpha: clamp(k * 3 - i * .2) }); } });
      PX.restore();
    });
    layer(0, () => {
      const k = pop(t, T0 + .2, .45) * out(t, q - .2, .3);
      if (k > 0) { ptext('ต้องสร้างหรือปรับปรุงสายส่ง', 540, 300, 50, '#FFF3DA', { pop: k, lv: 2, card: 'rgba(20,32,60,.92)' });
        ptext('~80 ล้านกิโลเมตร ภายในปี 2040', 540, 400, 54, '#9FF0D0', { alpha: k, lv: 2, weight: 700 });
        source('ที่มา: IEA (2023) · เท่ากับโครงข่ายทั้งโลกที่มีวันนี้', 540, 470, k); }
      const k2 = pop(t, q - .05, .45);
      ptext('เราจะไปถึง', 540, 290, 84, '#FFF3DA', { pop: k2, lv: 3, weight: 700 });
      ptext('เร็วแค่ไหน?', 540, 420, 130, '#FFD84D', { pop: pop(t, q + .25, .45), lv: 4, weight: 800, rot: -.03 });
      const k3 = seg(t, NT.n10[1] + .25, NT.n10[1] + .6);
      if (k3 > 0) ptext('ข้อมูล: IEA · IRENA · BMJ · สถานการณ์อนาคตเป็นการจำลอง', 540, 1480, 28, '#D9E4F2', { alpha: k3, lv: 1, weight: 400 });
    });
    pcEnd();
  }

  // shot list: cuts sit in the gaps between lines
  const c2 = NT.n02[0] - .12, c3 = NT.n04[0] - .2, c4 = NT.n06[0] - .19, c5 = NT.n07[0] - .1, c6 = NT.n08[0] - .1, c7 = NT.n09[0] - .19, c8 = NT.n10[0] - .13;
  const wrap = fn => (t, lt, dur) => { SUB_Y = null; fn(t, lt, dur); };
  shots([[0, wrap(s1)], [c2, wrap(s2)], [c3, wrap(s3)], [c4, wrap(s4a)], [c5, wrap(s4b)], [c6, wrap(s4c)], [c7, wrap(s5a)], [c8, wrap(s5b)]]);
  XFADE_AT[c3.toFixed(2)] = 0;                                    // the paper sheet wipes from the fossil world to the clean one
  XFADE_AT[c5.toFixed(2)] = .3; XFADE_AT[c6.toFixed(2)] = .35;
})();
