// scenes.js (sweat): the shots of "เหงื่อออกมากแปลว่าเผาผลาญไขมันมากจริงหรือ?". Every beat is tied to the narration:
// NT[key] = [start, end] of a line, ph(key, i) = onset of its i-th phrase. See shorts/sweat/STORYBOARD.md.
// In a shot fn, dur is the shot's LENGTH: its end time is t - lt + dur.
(() => {
  const pop = (t, t0, d = .35) => seg(t, t0, t0 + d);
  const out = (t, t1, d = .3) => 1 - seg(t, t1, t1 + d);
  const chip = (txt, kind, a) => { if (a <= 0) return; const col = kind === 'fact' ? '#2F5E57' : kind === 'myth' ? '#9A3B3B' : '#5B4A8A';
    layer(0, () => { cut(Pc(70, 172, 9), kind === 'fact' ? '#7BE0A6' : kind === 'myth' ? '#FF9C8A' : '#C9B8FF', 0, { tex: 0, alpha: a }); ptext(txt, 92, 172, 30, '#FFFFFF', { card: col, align: 'left', weight: 500, lv: 0, alpha: a }); }); };
  const source = (txt, x, y, a) => ptext(txt, x, y, 26, '#4A3F3A', { card: 'rgba(250,244,232,.92)', weight: 400, lv: 0, alpha: a });
  const tiles = (c1, c2, size = 120) => { for (let y = 0; y < H; y += size) for (let x = 0; x < W; x += size) cut(Pr(x + 4, y + 4, size - 8, size - 8, 10), ((x + y) / size) % 2 ? c1 : c2, 0, { tex: .5 }); };
  const ME = { shirt: '#3B6FD8', band: '#E0614A' };        // อิ่ม in running gear

  // ===================== 1 · HOOK: a raincoat run, drenched in sweat =====================
  function s1(t, lt, dur) {
    const end = t - lt + dur, drench = ph('n01', 1), q = ph('n01', 2);
    pcBegin('#F28B54'); sky('#F7B267', '#F28B54', '#E2573B');
    pcCam(540, 1000, kf(t, [[0, 1.2], [drench, 1.08], [end, 1.0]], easeOut), Math.sin(t * 9) * .006);
    layer(.15, () => { sun(800, 360, 110, t, { glowA: .9 }); heatWaves(540, 900, 1.4, t, .6, '#FFC38A'); });
    layer(.5, () => { cut(Pr(-200, 1340, W + 400, 900), '#C9563A', 3); for (let i = 0; i < 9; i++) cut(Pr(((i * 160 - t * 600) % 1440 + 1440) % 1440 - 200, 1420, 90, 14, 6), '#E6866A', 0); });
    layer(1, () => {
      const x = 450, y = 1470;
      person(x, y + Math.abs(Math.sin(t * 7)) * -16, 1.0, { walk: t * 7, ...ME, lid: .15, mouth: .3, smile: .2 });
      raincoat(x, y + Math.abs(Math.sin(t * 7)) * -16, 1.0);
      sweatSpray(x, y - 440, t, seg(t, .1, drench + .2), 1.1, 10);
      const k = pop(t, q - .1, .4);                          // the myth: a lump of fat "melting"
      if (k > 0) { fatBlob(850, 1120, 90 * backOut(k), t, k); ptext('ไขมัน', 850, 1120, 40, '#7A5A1A', { lv: 0, weight: 800, alpha: k }); for (let i = 0; i < 3; i++) { const p = frac(t * .8 + i / 3); cut(dropShape(850 + (i - 1) * 40, 1210 + p * 120, 12), SWT.fat, 1, { alpha: k * (1 - p) }); } }
    });
    layer(0, () => {
      ptext('เหงื่อท่วม', 540, 320, 120, '#FFFFFF', { pop: pop(t, drench - .05, .35), card: '#3A9AD0', lv: 4, weight: 800, rot: -.04 });
      ptext('= ไขมันละลาย?', 540, 480, 92, '#3A2E2A', { pop: pop(t, q, .35), card: '#FFD23F', lv: 3, weight: 800, rot: .03 });
      chip('ความเชื่อที่พบบ่อย', 'myth', pop(t, .1, .3));
    });
    SUB_Y = 1700;
    pcEnd();
  }

  // ===================== 2 · THE SCALE, then inside a drop of sweat =====================
  function s2(t, lt, dur) {
    const end = t - lt + dur, lost = ph('n02', 1), but = NT.n03[0], salt = ph('n03', 1), notFat = ph('n03', 2);
    const dive = ease(seg(t, but - .1, but + .55));          // the camera dives into a drop on the forehead
    pcBegin('#BFE8D3'); layer(0, () => tiles('#C9EEDC', '#B5E2CB'));
    if (dive < 1) {
      const zin = ease(seg(dive, 0, .75));
      pcCam(lerp(540, 505, zin), lerp(1000, 845, zin), lerp(1.0, 7.0, zin * zin));
      layer(1, () => {
        const kg = lerp(65, 64, ease(seg(t, lost - .2, lost + .5)));
        bathScale(540, 1410, 1.2, kg, seg(t, lost, lost + .3));
        person(540, 1350, 1.0, { ...ME, smile: t > lost ? 1 : .5, arm: [0, t > lost ? .9 : 0], legs: false });
        sweatDrop(505, 845, 16, 1, 1);                    // the drop on the forehead the camera dives into
        const k = pop(t, lost + .2, .35);
        if (k > 0) ptext('−1 กก.!', 830, 760, 76, '#FFFFFF', { pop: k, card: '#2E9C8E', lv: 3, weight: 800, rot: .05 });
      });
    }
    if (dive > 0) layer(0, () => {
      PX.save(); PX.globalAlpha = clamp((dive - .55) * 3);         // only once the zoom into the forehead drop fills the frame
      PX.fillStyle = '#E8F6FB'; PX.fillRect(0, 0, W, H);
      const r = lerp(120, 330, easeOut(seg(dive, .3, 1))), y = lerp(960, 1020, dive);
      bigDrop(540, y, r, t, pop(t, salt, .4));
      if (t > salt - .1) { ptext('น้ำ ~99%', 540, y + 40, 96, '#FFFFFF', { pop: pop(t, but + .5, .35), lv: 3, weight: 800 }); }
      PX.restore();
    });
    layer(0, () => {
      const kq = pop(t, NT.n02[0], .35) * out(t, but - .2, .25);
      ptext('ขึ้นตาชั่งทีไร…', 540, 300, 72, '#1F4E46', { pop: kq, lv: 2, weight: 800 });
      const ks = pop(t, salt, .35);
      if (ks > 0) { ptext('+ เกลือแร่นิดหน่อย', 540, 330, 54, '#1F4E46', { pop: ks, lv: 1, weight: 700, card: 'rgba(255,255,255,.9)' }); source('ที่มา: Cleveland Clinic (เหงื่อจากต่อมเอคครีน)', 540, 410, ks); }
      const kf2 = pop(t, notFat, .35);
      if (kf2 > 0) { ptext('ไขมัน', 540, 1520, 70, '#3A2E2A', { pop: kf2, card: SWT.fat, lv: 3, weight: 800 }); strip([[400, 1470], [680, 1570]], '#D6334A', 18, 2, { alpha: kf2 }); strip([[680, 1470], [400, 1570]], '#D6334A', 18, 2, { alpha: kf2 }); }
      chip(t < but ? 'ความเชื่อที่พบบ่อย' : 'ข้อเท็จจริง', t < but ? 'myth' : 'fact', 1);
    });
    SUB_Y = dive > 0 ? 1700 : 1610;
    pcEnd();
  }

  // ===================== 3 · SWEAT IS AN AIR CONDITIONER; drink and the weight is back =====================
  function s3(t, lt, dur) {
    const end = t - lt + dur, cool = ph('n04', 1), ac = ph('n04', 2), drink = NT.n05[0], back = ph('n05', 1);
    pcBegin('#A9DDF0'); sky('#CDEFF8', '#A9DDF0', '#86CCE6');
    pcCam(540, kf(t, [[NT.n04[0] - .2, 960], [drink, 1000], [end, 1020]]), kf(t, [[NT.n04[0] - .2, 1.08], [ac, 1.0], [end, 1.04]]));
    layer(.3, () => { for (let i = 0; i < 4; i++) cloud(((i * 380 + t * 30) % 1500) - 200, 520 + (i % 2) * 120, .9, '#FFFFFF', 2); });
    layer(1, () => {
      const x = 400, y = 1560, drinking = seg(t, drink - .1, drink + .5) * out(t, back + .3, .3);
      person(x, y, 1.05, { ...ME, legs: false, smile: .7, arm: [0, drinking * .75] });
      // sweat drops on the skin turn to vapour and carry the heat away
      for (let i = 0; i < 7; i++) { const p = frac(t * .5 + i / 7), sx = x + (i - 3) * 38, sy = y - 300 - p * 380;
        if (p < .3) sweatDrop(sx, y - 300 - i % 3 * 60, 12, 1 - p * 2, 1); else cloud(sx, sy, .22 + p * .2, '#FFFFFF', 1, { alpha: .8 * (1 - p) }); }
      heatWaves(x, y - 620, 1, t, seg(t, cool, cool + .3) * .9, '#FF8A5C');
      // the paper air-conditioner
      const ka = pop(t, ac - .1, .4);
      if (ka > 0) { PX.save(); PX.translate(790, 900); PX.scale(backOut(ka), backOut(ka));
        cut(Pr(-170, -70, 340, 140, 24), '#FBF8F2', 3, { edge: .4 }); cut(Pr(-140, 30, 280, 18, 9), '#C9D6DC', 0);
        for (let i = 0; i < 3; i++) { const P = []; for (let j = 0; j <= 8; j++) P.push([-100 + i * 100 + Math.sin(j + t * 5) * 8, 60 + j * 22]); strip(P, SWT.cool, 8, 0, { alpha: .8 }); }
        PX.restore(); }
      if (drinking > 0) bottle(x + 120, y - 470, .9, 1 - seg(t, drink, back), lerp(0, -2.2, drinking));
      const kb = seg(t, back - .2, back + .4);
      if (kb > 0) bathScale(760, 1640, .9, lerp(64, 65, ease(kb)), kb);
    });
    layer(0, () => {
      ptext('ระบายความร้อน', 540, 300, 80, '#1F4E6E', { pop: pop(t, cool, .35), lv: 3, weight: 800, alpha: out(t, drink - .2, .25) });
      ptext('แอร์ของร่างกาย', 790, 760, 52, '#1F4E6E', { pop: pop(t, ac, .35), lv: 1, weight: 700, alpha: out(t, drink - .2, .25) });
      const kw = pop(t, back, .35);
      ptext('น้ำหนักกลับมา', 540, 300, 80, '#1F4E6E', { pop: kw, lv: 3, weight: 800 });
      if (kw > 0) ptext('ที่หายไปคือน้ำ ไม่ใช่ไขมัน', 540, 410, 46, '#FFFFFF', { alpha: kw, card: 'rgba(31,78,110,.9)', lv: 2 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    pcEnd();
  }

  // ===================== 4 · TWIST: we breathe fat out =====================
  function s4(t, lt, dur) {
    const end = t - lt + dur, ans = ph('n06', 1), breathe = ph('n06', 2), pct = ph('n07', 1), co = ph('n07', 2), outB = ph('n07', 3);
    pcBegin('#173B45'); sky('#12303A', '#173B45', '#1F4C58');
    const z = kf(t, [[NT.n06[0] - .2, 1.15], [ans, 1.0], [pct, 1.0], [co, 1.06], [end, 1.1]]);
    pcCam(540, kf(t, [[NT.n06[0] - .2, 980], [pct, 960], [end, 940]]), z);
    const split = ease(seg(t, breathe - .1, breathe + .6));
    layer(1, () => {
      // the character in profile-ish at the lower left: we use the front view, mouth open when breathing out
      const exhale = seg(t, breathe + .2, breathe + .7);
      person(200, 1560, .7, { ...ME, legs: false, mouth: exhale > 0 && t < co + 1.2 ? .55 : 0, smile: .6 });
      if (split < 1) fatBlob(560, 820, 150 * (1 - split * .9), t, 1 - split);
      // molecules: most become CO2 that flows out with the breath, the rest water
      for (let i = 0; i < 12; i++) {
        const isW = i % 6 === 5, k = seg(t, breathe + i * .12, breathe + 2.4 + i * .12), x0 = 560 + Math.cos(i * 1.7) * 120, y0 = 820 + Math.sin(i * 1.3) * 90;
        if (split <= 0) continue;
        if (isW) { const kk = ease(clamp(k * 1.6)); h2o(lerp(x0, 760 + (i % 3) * 60, kk), lerp(y0, 1300, kk), 22, t + i, split); continue; }
        // CO2 goes to the mouth, then leaves with the breath and fades
        const a = ease(clamp(k * 2)), b = ease(clamp(k * 2 - 1)), mx = 262, my = 1290;
        const x = b > 0 ? lerp(mx, 980 + Math.sin(i) * 60, b) : lerp(x0, mx, a), y = b > 0 ? lerp(my, 1180 + Math.cos(i) * 70, b) : lerp(y0, my, a);
        co2(x, y, 20, t * .8 + i, split * (1 - b));
      }
      breath(260, 1290, 1, t, seg(t, breathe + .3, breathe + 1.2) * out(t, end - .3, .3));
    });
    layer(0, () => {
      ptext('ไขมันหายไปไหน?', 540, 280, 86, '#FFFFFF', { pop: pop(t, NT.n06[0], .35), lv: 3, weight: 800, alpha: out(t, pct - .3, .25) });
      ptext('หายใจออกไป!', 540, 410, 96, '#173B45', { pop: pop(t, breathe, .35), card: '#9FF0D0', lv: 4, weight: 800, rot: -.04, alpha: out(t, pct - .3, .25) });
      // the split: ~84% CO2, the rest water
      const kp = pop(t, pct - .1, .6);
      if (kp > 0) {
        const x = 540, y = 400, r = 150, a = easeOut(kp);
        cut(Pc(x, y, r + 20), '#F4ECDD', 3);
        PX.save(); PX.lineCap = 'butt'; PX.lineWidth = 56;
        PX.strokeStyle = '#6EC6F0'; PX.beginPath(); PX.arc(x, y, r - 28, 0, TAU); PX.stroke();
        PX.strokeStyle = SWT.co2C; PX.beginPath(); PX.arc(x, y, r - 28, -Math.PI / 2, -Math.PI / 2 + TAU * .84 * a); PX.stroke(); PX.restore();
        ptext(`${Math.round(84 * a)}%`, x, y - 6, 80, '#3A2E2A', { lv: 0, weight: 800 });
        ptext('CO₂', x, y + 52, 32, '#3A2E2A', { lv: 0, weight: 600 });
        ptext('คาร์บอนไดออกไซด์', 540, 615, 44, '#FFFFFF', { alpha: seg(t, co - .1, co + .3), lv: 2, weight: 700 });
        ptext('ออกทางลมหายใจ', 540, 672, 40, '#9FF0D0', { alpha: seg(t, outB - .1, outB + .3), lv: 2, weight: 600 });
        ptext('ที่เหลือ ~16% เป็นน้ำ', 540, 728, 34, '#BFE8F5', { alpha: seg(t, co + .3, co + .7), lv: 1, align: 'center' });
        source('ที่มา: Meerman & Brown, BMJ (2014)', 540, 790, kp);
      }
      chip('จุดหักมุม', 'study', 1);
    });
    SUB_Y = 1660;
    pcEnd();
  }

  // ===================== 5 · A FIT BODY SWEATS EASILY =====================
  function s5(t, lt, dur) {
    const end = t - lt + dur, fit = ph('n08', 1), good = ph('n08', 2);
    pcBegin('#C7E86B'); sky('#DDF29B', '#C7E86B', '#A8D44F');
    pcCam(kf(t, [[NT.n08[0] - .2, 500], [end, 580]]), 1000, kf(t, [[NT.n08[0] - .2, 1.06], [end, 1.0]]));
    layer(.4, () => { cut(hills(1300, 40, .006, 2), '#8CC24A', 2); for (let i = 0; i < 6; i++) tree(((i * 220 - t * 140) % 1320 + 1320) % 1320 - 100, 1330, .8, '#4FA36A'); });
    layer(1, () => {
      cut(Pr(-300, 1420, W + 600, 900), '#7DB33F', 3); cut(Pr(-300, 1470, W + 600, 60), '#E9DFC8', 1);
      const x = 420, y = 1500 + Math.abs(Math.sin(t * 7)) * -14;
      person(x, y, 1.0, { walk: t * 7, ...ME, smile: .9, look: 4 });
      sweatSpray(x, y - 440, t, .8, 1, 8);
      thermometer(800, 1250, 1.0, .3 + .03 * Math.sin(t * 3));
      ptext('อุณหภูมิกาย', 800, 1330, 36, '#2E4A1F', { lv: 0, weight: 600, alpha: pop(t, good, .35) });
      ptext('คงที่ ✓', 800, 1380, 40, '#2E7A3A', { lv: 0, weight: 800, alpha: pop(t, good + .2, .35) });
    });
    layer(0, () => {
      ptext('เหงื่อออกง่าย', 540, 280, 84, '#2E4A1F', { pop: pop(t, NT.n08[0], .35), lv: 3, weight: 800 });
      ptext('อาจแปลว่า "ฟิต"', 540, 410, 72, '#FFFFFF', { pop: pop(t, fit, .35), card: '#3B6FD8', lv: 3, weight: 800, rot: -.03 });
      ptext('ระบายความร้อนได้เก่งขึ้น', 540, 520, 46, '#2E4A1F', { pop: pop(t, good, .35), lv: 1, weight: 600 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    pcEnd();
  }

  // ===================== 6 · THE RAINCOAT: risk, not fat loss =====================
  function s6(t, lt, dur) {
    const end = t - lt + dur, risk = ph('n09', 1), notFat = ph('n09', 2);
    const heat = seg(t, NT.n09[0], risk + 1.0);
    pcBegin('#F6D04D'); sky(mixCol('#F9E08A', '#F7A04D', heat), mixCol('#F6D04D', '#F0803C', heat), mixCol('#E9B530', '#D9583A', heat));
    pcCam(540, 1000, kf(t, [[NT.n09[0] - .2, 1.08], [notFat, 1.0], [end, .98]]) + Math.sin(t * 20) * .003 * heat);
    layer(1, () => {
      const x = 420, y = 1560;
      person(x, y, 1.0, { ...ME, legs: false, lid: .35 * heat, mouth: .3 * heat, smile: -.2 });
      raincoat(x, y, 1.0);
      heatWaves(x, y - 560, 1, t, heat, '#FF5A3C');
      thermometer(820, 1100, 1.1, lerp(.3, .95, ease(heat)));
      bottle(820, 1640, .9, 1 - ease(seg(t, risk, risk + 1.2)));
      const kw = pop(t, risk + .1, .35); if (kw > 0) { warn(660, 860, 70 * backOut(kw), kw); }
    });
    layer(0, () => {
      ptext('ชุดกันฝน', 540, 270, 88, '#3A2E2A', { pop: pop(t, NT.n09[0], .35), lv: 3, weight: 800 });
      const kr = pop(t, risk, .35);
      ptext('เสี่ยงขาดน้ำ · ร้อนเกิน', 540, 390, 62, '#FFFFFF', { pop: kr, card: '#D6334A', lv: 3, weight: 800 });
      const kn = pop(t, notFat, .35);
      if (kn > 0) { ptext('ไม่ได้ช่วยลดไขมัน', 540, 510, 60, '#3A2E2A', { pop: kn, card: 'rgba(255,248,236,.95)', lv: 2, weight: 700 }); }
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    pcEnd();
  }

  // ===================== 7 · WHAT REALLY COUNTS: energy used =====================
  function s7(t, lt, dur) {
    const end = t - lt + dur, energy = ph('n10', 1), notSweat = ph('n10', 2);
    pcBegin('#8E7CC8'); sky('#A99BDB', '#8E7CC8', '#6E5CB0');
    pcCam(540, 1000, kf(t, [[NT.n10[0] - .2, 1.08], [end, 1.0]]));
    layer(1, () => {
      // left: the flame of energy used, with a kcal counter; right: the sweat drop, crossed out
      cut(Pr(90, 700, 420, 760, 36), '#F6F1FF', 3, { edge: .3 }); cut(Pr(570, 700, 420, 760, 36), '#F6F1FF', 3, { edge: .3 });
      const kE = seg(t, energy - .2, energy + 1.2);
      flame(300, 1180, 1.1, t, .4 + .6 * ease(kE));
      ptext(`${Math.round(lerp(0, 300, ease(kE)))} kcal`, 300, 1320, 56, '#5B4A8A', { lv: 0, weight: 800 });
      ptext('พลังงานที่ใช้', 300, 770, 42, '#3A2E5A', { lv: 0, weight: 700 });
      for (let i = 0; i < 3; i++) sweatDrop(700 + i * 80, 1080 + (i % 2) * 70, 44, 1, 2);
      ptext('ปริมาณเหงื่อ', 780, 770, 42, '#3A2E5A', { lv: 0, weight: 700 });
      const kx = pop(t, notSweat, .3);
      if (kx > 0) { strip([[620, 900], [940, 1360]], '#D6334A', 22, 2, { alpha: kx }); strip([[940, 900], [620, 1360]], '#D6334A', 22, 2, { alpha: kx }); }
      const kc = pop(t, energy + .3, .3);
      if (kc > 0) { cut(Pc(300, 1410, 40 * backOut(kc)), '#2E9C8E', 2); ptext('✓', 300, 1412, 48, '#FFFFFF', { pop: kc, lv: 0, weight: 800 }); }
    });
    layer(0, () => {
      ptext('ตัววัดที่แท้จริง', 540, 300, 84, '#FFFFFF', { pop: pop(t, NT.n10[0], .35), lv: 3, weight: 800 });
      ptext('คือพลังงาน ไม่ใช่เหงื่อ', 540, 420, 56, '#FFD84D', { pop: pop(t, notSweat, .35), lv: 2, weight: 700 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1620;
    pcEnd();
  }

  // ===================== 8 · CLOSE: sweat is the AC, breath is the exit =====================
  function s8(t, lt, dur) {
    const end = t - lt + dur, breathK = ph('n11', 1), exit = ph('n11', 2);
    pcBegin('#F7B7A3'); sky('#FBD3C4', '#F7B7A3', '#EE9580');
    pcCam(540, 1000, kf(t, [[NT.n11[0] - .2, 1.1], [exit, 1.0], [end, .97]]));
    layer(1, () => {
      const ka = pop(t, NT.n11[0], .4), kb = pop(t, breathK, .4);
      cut(Pr(70, 640, 450, 540, 36), '#E6F6FB', 3, { alpha: ka, edge: .3 }); cut(Pr(560, 640, 450, 540, 36), '#EAF7F0', 3, { alpha: kb, edge: .3 });
      if (ka > 0) { PX.save(); PX.globalAlpha = ka; sweatDrop(295, 900, 80, 1, 2); for (let i = 0; i < 3; i++) { const P = []; for (let j = 0; j <= 6; j++) P.push([200 + i * 90 + Math.sin(j + t * 5) * 7, 1010 + j * 18]); strip(P, SWT.cool, 7, 0); } PX.restore();
        ptext('เหงื่อ = แอร์', 295, 1110, 50, '#1F4E6E', { lv: 0, weight: 800, alpha: ka }); }
      if (kb > 0) { PX.save(); PX.globalAlpha = kb; for (let i = 0; i < 3; i++) co2(700 + i * 90, 820 + Math.sin(t * 2 + i) * 20 + i * 60, 18, t + i, 1); cloud(785, 1000, .7, '#FFFFFF', 2); PX.restore();
        ptext('ลมหายใจ = ทางออก', 785, 1110, 46, '#1F4E46', { lv: 0, weight: 800, alpha: kb }); ptext('ของไขมัน', 785, 1162, 46, '#1F4E46', { lv: 0, weight: 800, alpha: pop(t, exit, .35) }); }
      person(540, 1830, .72, { ...ME, legs: false, smile: 1, arm: [seg(t, exit, exit + .4), seg(t, exit, exit + .4)] });
    });
    layer(0, () => {
      ptext('สรุป', 540, 300, 70, '#3A2E2A', { pop: pop(t, NT.n11[0] - .1, .3), lv: 2, weight: 800 });
      const k = seg(t, NT.n11[1] + .2, NT.n11[1] + .5);
      if (k > 0) { ptext('อากาศร้อนหรือออกกำลังนานๆ ดื่มน้ำให้พอ', 540, 450, 34, '#3A2E2A', { alpha: k, lv: 0, card: 'rgba(255,248,236,.9)' });
        ptext('ข้อมูล: Meerman & Brown, BMJ 2014 · Cleveland Clinic · งานทบทวนสรีรวิทยาเหงื่อ', 540, 515, 24, '#5A4A44', { alpha: k, lv: 0 }); }
    });
    SUB_Y = 1340;
    pcEnd();
  }

  const c = k => NT[k][0] - .12;
  const wrap = fn => (t, lt, dur) => { SUB_Y = null; fn(t, lt, dur); };
  shots([[0, wrap(s1)], [c('n02'), wrap(s2)], [c('n04'), wrap(s3)], [c('n06'), wrap(s4)], [c('n08'), wrap(s5)], [c('n09'), wrap(s6)], [c('n10'), wrap(s7)], [c('n11'), wrap(s8)]]);
})();
