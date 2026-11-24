// scenes.js (brain10): the shots of "เราใช้สมองแค่ 10% จริงหรือ?". Every beat is tied to the narration:
// NT[key] = [start, end] of a line, ph(key, i) = onset of its i-th phrase. In a shot fn, dur is the shot's LENGTH:
// its end time is t - lt + dur. See shorts/brain10/STORYBOARD.md.
(() => {
  const pop = (t, t0, d = .35) => seg(t, t0, t0 + d);
  const out = (t, t1, d = .3) => 1 - seg(t, t1, t1 + d);
  const chip = (txt, kind, a) => { if (a <= 0) return; const col = kind === 'fact' ? '#2F5E57' : kind === 'myth' ? '#9A3B3B' : '#5B4A8A';
    layer(0, () => { cut(Pc(70, 172, 9), kind === 'fact' ? '#7BE0A6' : kind === 'myth' ? '#FF9C8A' : '#C9B8FF', 0, { tex: 0, alpha: a }); ptext(txt, 92, 172, 30, '#FFFFFF', { card: col, align: 'left', weight: 500, lv: 0, alpha: a }); }); };
  const source = (txt, x, y, a) => ptext(txt, x, y, 26, '#4A3F3A', { card: 'rgba(250,244,232,.92)', weight: 400, lv: 0, alpha: a });
  const all = v => Object.fromEntries(LOBE_ORDER.map(k => [k, v]));

  // ===================== 1 · HOOK: 10% lit, 90% dark =====================
  function s1(t, lt, dur) {
    const end = t - lt + dur, rest = ph('n01', 1);
    pcBegin('#1B1F3B'); sky('#151933', '#1B1F3B', '#262C52'); stars(t, .8);
    pcCam(540, 1000, kf(t, [[0, 1.08], [rest, 1.03], [end, .98]], easeOut));
    const on = kf(t, [[.1, 0], [.5, 1]]);
    layer(1, () => {
      brainBuddy(560, 1000, 1.25, { frontal: on, parietal: 0, occipital: 0, temporal: 0, cerebellum: 0 }, { look: -6, smile: .2 });
      // ten paper cells along the bottom: one lit, nine dark (10% vs 90%)
      for (let i = 0; i < 10; i++) { const k = pop(t, .2 + i * .05, .3); if (k <= 0) continue;
        cut(Pr(155 + i * 80, 1420, 64, 64 * backOut(k), 10), i === 0 ? '#FFD84D' : '#4A4870', 2, { edge: .2 }); if (i === 0) shine(187, 1452, 80, '#FFE27A', .6); }
      const kq = pop(t, rest, .4);
      if (kq > 0) for (let i = 0; i < 4; i++) { const [cx, cy] = lobeCenter(['parietal', 'occipital', 'temporal', 'cerebellum'][i], 560, 1000, 1.25);
        ptext('?', cx, cy - 10 + Math.sin(t * 3 + i) * 8, 90, '#FFFFFF', { pop: clamp(kq * 1.4 - i * .12), lv: 2, weight: 800 }); }
    });
    layer(0, () => {
      ptext('ใช้สมองแค่', 540, 290, 80, '#FFFFFF', { pop: pop(t, .15, .35), lv: 3, weight: 700 });
      ptext('10%?', 540, 440, 170, '#FFD84D', { pop: pop(t, .4, .4), lv: 4, weight: 800, rot: -.04 });
      ptext('อีก 90% ทำอะไรอยู่?', 540, 1560, 54, '#FFFFFF', { pop: pop(t, rest + .1, .35), lv: 2, weight: 700, card: 'rgba(74,72,112,.9)' });
      chip('ความเชื่อที่พบบ่อย', 'myth', pop(t, .1, .3));
    });
    SUB_Y = 1690;
    pcEnd();
  }

  // ===================== 2 · THE MOVIE VERSION: unlock 100% =====================
  function s2(t, lt, dur) {
    const end = t - lt + dur, unlock = ph('n02', 1), genius = ph('n02', 2);
    pcBegin('#7A1F2B'); sky('#5E1620', '#7A1F2B', '#4A1018');
    pcCam(540, 980, kf(t, [[NT.n02[0] - .2, 1.1], [genius, 1.0], [end, .96]]));
    layer(.4, () => { for (const side of [-1, 1]) for (let i = 0; i < 5; i++) cut(Pr(side < 0 ? -60 + i * 34 : W - 200 + i * 34, 80, 60, 1500, 30), i % 2 ? '#A3283A' : '#8E2232', 2, { sa: .3 }); });
    layer(1, () => {
      cut(Pr(150, 420, 780, 900, 20), '#1B1F3B', 3, { edge: .2 });              // the cinema screen
      const prog = ease(seg(t, unlock, genius + .4)), lit = clamp(.1 + .9 * prog);
      const L = {}; LOBE_ORDER.forEach((k, i) => L[k] = clamp(lit * 5 - i)); L.frontal = 1;
      brainBuddy(540, 830, .95, L, { look: 4, smile: lerp(.2, 1, prog) });
      cut(Pr(230, 1170, 620, 50, 25), '#3A3660', 1); cut(Pr(236, 1176, 608 * lit, 38, 19), mixCol('#FFD84D', '#9FF0D0', prog), 0, { tex: 0 }); shine(236 + 608 * lit, 1195, 70, '#FFFFFF', .6 * (prog > 0 && prog < 1 ? 1 : 0));
      ptext(`${Math.round(lit * 100)}%`, 540, 1255, 46, '#FFFFFF', { lv: 1, weight: 800 });
      padlock(850, 520, .8, ease(seg(t, unlock, unlock + .4)));
      if (t > genius) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t, r = 330 + 20 * Math.sin(t * 6 + i); bolt(540 + Math.cos(a) * r, 830 + Math.sin(a) * r * .8, 34, '#FFE27A', 1, { alpha: seg(t, genius, genius + .3) }); }
    });
    layer(0, () => {
      ptext('ในหนัง:', 540, 230, 50, '#FFD9C9', { pop: pop(t, NT.n02[0], .3), lv: 2, weight: 600 });
      ptext('ปลดล็อก 100% = อัจฉริยะ', 540, 320, 64, '#FFFFFF', { pop: pop(t, unlock, .35), lv: 3, weight: 800 });
      chip('ความเชื่อ (ในหนัง)', 'myth', 1);
    });
    SUB_Y = 1560;
    pcEnd();
  }

  // ===================== 3 · BRAIN SCANS: every part busy all day, even asleep =====================
  function s3(t, lt, dur) {
    const end = t - lt + dur, scan = NT.n03[0], found = ph('n03', 1), night = ease(seg(t, NT.n04[0] - .2, NT.n04[0] + .5)), store = ph('n04', 2);
    const bg = mixCol('#BFE8E2', '#22284A', night);
    pcBegin(bg); sky(mixCol('#D6F2EE', '#1A1F3C', night), bg, mixCol('#A3DCD4', '#2B3360', night));
    stars(t, night);
    pcCam(540, 980, kf(t, [[scan - .2, 1.08], [found, 1.0], [end, .97]]));
    layer(1, () => {
      // during the day each lobe takes its turn (icons pop by it); at night the brain sleeps but keeps filing memories
      const turn = (t - found) * 2.2, L = {};
      LOBE_ORDER.forEach((k, i) => { const tk = t < found ? .15 : .35 + .65 * Math.max(0, Math.cos((turn - i) * 1.3)); L[k] = lerp(tk, .55 + .25 * Math.sin(t * 2 + i), night); });
      scannerRing(540, 960, 400, t, 1 - night);
      brainBuddy(540, 960, 1.05, L, { sleep: night > .5, look: Math.sin(t * 2) * 6, smile: .5 });
      if (t > found && night < .5) { const icons = { frontal: '💡', parietal: '✋', occipital: '👁', temporal: '💬', cerebellum: '⚖' };
        LOBE_ORDER.forEach(k => { const [cx, cy] = lobeCenter(k, 540, 960, 1.05); if (L[k] > .8) ptext(icons[k], cx, cy - 150, 56, '#FFFFFF', { lv: 1, alpha: (L[k] - .8) * 5 * (1 - night * 2) }); }); }
      if (night > .5) { moon(860, 420, 60); zzz(330, 760, t, night, .8);
        for (let i = 0; i < 4; i++) { const k = seg(t, store + i * .25, store + .8 + i * .25); if (k <= 0 || k >= 1) continue;   // memory cards filed into a box
          const x = lerp(250 + i * 60, 760, ease(k)), y = lerp(620, 1340, ease(k)); PX.save(); PX.translate(x, y); PX.rotate((1 - k) * .6);
          cut(Pr(-40, -28, 80, 56, 6), '#FBF5E8', 2, { edge: .3 }); strip([[-26, -8], [26, -8]], '#B9AFA0', 4, 0); strip([[-26, 8], [14, 8]], '#B9AFA0', 4, 0); PX.restore(); }
        cut(Pr(690, 1330, 150, 100, 12), '#C9824E', 3, { alpha: seg(t, store - .3, store) }); ptext('ความจำ', 765, 1385, 34, '#FFFFFF', { lv: 0, weight: 700, alpha: seg(t, store - .3, store) }); }
    });
    layer(0, () => {
      ptext('สแกนสมองจริง', 540, 260, 74, '#1F4E46', { pop: pop(t, scan, .35), lv: 2, weight: 800, alpha: 1 - night });
      ptext('แทบทุกส่วนมีงานทำ', 540, 370, 60, '#FFFFFF', { pop: pop(t, found, .35), card: '#2E9C8E', lv: 3, weight: 700, alpha: 1 - night });
      ptext('แม้ตอนนอน', 540, 270, 80, '#FFFFFF', { pop: pop(t, NT.n04[0] + .1, .35), lv: 3, weight: 800 });
      ptext('สมองยังจัดเก็บความจำ', 540, 380, 52, '#FFD84D', { pop: pop(t, store, .35), lv: 2, weight: 700 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1600;
    pcEnd();
  }

  // ===================== 4 · 2% OF THE WEIGHT, 20% OF THE ENERGY =====================
  function s4(t, lt, dur) {
    const end = t - lt + dur, energy = ph('n05', 1), keep = NT.n06[0];
    pcBegin('#F7D06B'); sky('#FADF94', '#F7D06B', '#EDB948');
    pcCam(540, 980, kf(t, [[NT.n05[0] - .2, 1.06], [keep, 1.0], [end, 1.03]]));
    const bars = 1 - ease(seg(t, keep - .1, keep + .5));
    layer(1, () => {
      if (bars > 0) { PX.save(); PX.globalAlpha = bars;
        person(300, 1440, 1.0, { legs: false, smile: .6 }); brain(300, 905, .42, '#F2A7B5', { lv: 1 }); shine(300, 905, 120, '#FFE9A0', .6);
        const w = ease(seg(t, NT.n05[0] + .2, NT.n05[0] + .9)), e = ease(seg(t, energy, energy + .9));
        cut(Pr(560, 780, 380, 70, 14), '#FBF5E8', 2); cut(Pr(566, 786, 368 * .02 * 5 * w, 58, 10), '#8E8A99', 0, { tex: 0 });   // bars drawn at 5× scale so 2% shows
        ptext('น้ำหนัก ~2%', 750, 740, 44, '#3A2E2A', { lv: 0, weight: 700, alpha: w });
        cut(Pr(560, 1000, 380, 70, 14), '#FBF5E8', 2); cut(Pr(566, 1006, 368 * .2 * 5 * e, 58, 10), '#E0614A', 0, { tex: 0 }); if (e > 0) shine(566 + 368 * e, 1035, 80, '#FFB36B', .6 * e);
        ptext('พลังงาน ~20%', 750, 960, 44, '#3A2E2A', { lv: 0, weight: 700, alpha: e });
        bolt(940, 1035, 40 * e, '#FFE27A', 2);
        PX.restore(); }
      if (bars < 1) { const k = 1 - bars;
        PX.save(); PX.globalAlpha = k;
        brainBuddy(540, 980, 1.2, all(1), { smile: 1, look: 6 });
        for (let i = 0; i < 5; i++) { const p = frac(t * .9 + i / 5); bolt(lerp(980, 640, p), lerp(620, 900, p), 36, '#FFE27A', 2, { alpha: Math.sin(Math.PI * p) }); }
        PX.restore(); }
    });
    layer(0, () => {
      ptext('อวัยวะที่กินพลังงานที่สุดชิ้นหนึ่ง', 540, 270, 50, '#3A2E2A', { pop: pop(t, energy, .35), lv: 1, weight: 700, alpha: bars });
      if (bars > 0) source('ที่มา: Raichle & Gusnard, PNAS (2002)', 540, 340, pop(t, energy, .35) * bars);
      const k = pop(t, keep + .3, .35);
      ptext('ไม่เลี้ยงไว้เฉยๆ', 540, 290, 84, '#3A2E2A', { pop: k, lv: 3, weight: 800 });
      if (k > 0) { ptext('ว่างงาน 90%', 540, 1500, 60, '#8E8A99', { alpha: k, lv: 1, weight: 700 }); strip([[350, 1500], [730, 1500]], '#D6334A', 14, 1, { alpha: seg(t, keep + .8, keep + 1.1) }); }
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1640;
    pcEnd();
  }

  // ===================== 5 · DAMAGE ANYWHERE COSTS SOMETHING =====================
  function s5(t, lt, dur) {
    const end = t - lt + dur, hurt = NT.n07[0] + .5, lost = ph('n07', 1);
    pcBegin('#F6A68E'); sky('#F9C0AE', '#F6A68E', '#EE8A70');
    pcCam(kf(t, [[NT.n07[0] - .2, 540], [lost, 570], [end, 580]]), 1000, kf(t, [[NT.n07[0] - .2, .98], [lost, 1.04], [end, 1.06]]));
    const dmg = ease(seg(t, hurt, hurt + .4));
    layer(1, () => {
      brainBuddy(540, 960, 1.3, { occipital: 1 - .8 * dmg }, { smile: lerp(.6, -.4, dmg), look: 0 });
      LOBE_ORDER.forEach((k, i) => { const [cx, cy] = lobeCenter(k, 540, 960, 1.3), lab = pop(t, NT.n07[0] - .1 + i * .08, .3), off = k === 'occipital' ? dmg : 0;
        const lx = cx + (k === 'frontal' ? -40 : k === 'occipital' ? 80 : 0), ly = cy + (k === 'parietal' ? -190 : k === 'cerebellum' ? 230 : k === 'temporal' ? 250 : -200);
        ptext(LOBE_TH[k], lx, ly, 34, off > .5 ? '#8E8A99' : '#3A2E2A', { pop: lab, card: 'rgba(255,250,240,.92)', lv: 1, weight: 600 }); });
      if (dmg > 0) { const [cx, cy] = lobeCenter('occipital', 540, 960, 1.3);           // a paper bandage over the hurt lobe
        PX.save(); PX.translate(cx, cy); PX.rotate(-.5); cut(Pr(-90 * dmg, -26, 180 * dmg, 52, 14), '#F7E3C8', 3, { edge: .3 }); cut(Pr(-20, -20, 40, 40, 6), '#E9CFAE', 0); PX.restore(); }
      const kl = pop(t, lost, .35);
      if (kl > 0) { const [cx, cy] = lobeCenter('occipital', 540, 960, 1.3); ptext('👁', cx + 40, cy - 330 + 40 * kl, 64, '#FFFFFF', { alpha: 1 - kl * .7, lv: 1 }); }
    });
    layer(0, () => {
      ptext('เสียหายตรงไหน', 540, 270, 76, '#3A2E2A', { pop: pop(t, NT.n07[0], .35), lv: 2, weight: 800 });
      ptext('ก็เสียความสามารถบางอย่าง', 540, 380, 54, '#FFFFFF', { pop: pop(t, lost, .35), card: '#9A3B3B', lv: 3, weight: 700 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1640;
    pcEnd();
  }

  // ===================== 6 · TWIST: all neurons at once =====================
  function s6(t, lt, dur) {
    const end = t - lt + dur, everyone = ph('n08', 2), notG = NT.n09[0], seiz = ph('n09', 1);
    const surge = seg(t, everyone - .1, everyone + .3) * (1 - seg(t, seiz + .9, seiz + 1.6));
    const bg = mixCol('#1A1630', '#3A0E1E', surge);
    pcBegin(bg); sky(mixCol('#14102A', '#2A0814', surge), bg, mixCol('#231C40', '#4A1424', surge));
    const sh = surge > .3 ? shakeXY(t, 10 * surge) : [0, 0];
    pcCam(540 + sh[0], 960 + sh[1], kf(t, [[NT.n08[0] - .2, 1.1], [everyone, 1.0], [seiz, 1.05], [end, 1.0]]));
    layer(1, () => {
      const N = 34, P = []; for (let i = 0; i < N; i++) P.push([120 + hash(i * 3.3) * 840, 520 + hash(i * 7.1) * 900]);
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]); if (d < 190) strip([P[i], P[j]], mixCol('#3E3870', '#FF8A7A', surge), 3, 0, { alpha: .7 }); }
      P.forEach(([x, y], i) => { const sparse = Math.max(0, Math.sin(t * (2 + hash(i) * 3) + i * 7)) ** 12;   // a few at a time
        neuron(x, y, 16, clamp(sparse + surge), i); });
      if (surge > .2) { PX.save(); PX.globalAlpha = .25 * surge * (.5 + .5 * Math.sin(t * 40)); PX.fillStyle = '#FFFFFF'; PX.fillRect(0, 0, W, H); PX.restore(); }
      eeg(100, 980, 1470, t, surge);
    });
    layer(0, () => {
      ptext('ปกติ: ทำงานทีละกลุ่ม', 540, 270, 56, '#FFFFFF', { pop: pop(t, NT.n08[0], .35), lv: 2, weight: 700, alpha: out(t, everyone - .2, .25) });
      ptext('ถ้าทุกเซลล์ทำงานพร้อมกัน…', 540, 270, 56, '#FFFFFF', { pop: pop(t, everyone - .1, .3), lv: 2, weight: 700, alpha: out(t, notG - .1, .25) });
      ptext('ไม่ใช่อัจฉริยะ', 540, 270, 84, '#FFFFFF', { pop: pop(t, notG, .3), card: '#9A3B3B', lv: 3, weight: 800 });
      ptext('ใกล้กับอาการชัก', 540, 400, 70, '#FFD84D', { pop: pop(t, seiz, .35), lv: 3, weight: 800 });
      chip('จุดหักมุม', 'study', 1);
    });
    SUB_Y = 1640;
    pcEnd();
  }

  // ===================== 7 · AN ORCHESTRA =====================
  function s7(t, lt, dur) {
    const end = t - lt + dur, rhythm = ph('n10', 1);
    pcBegin('#2C2350'); sky('#231C44', '#2C2350', '#3A2F66');
    pcCam(540, kf(t, [[NT.n10[0] - .2, 1000], [end, 960]]), kf(t, [[NT.n10[0] - .2, 1.1], [rhythm, 1.0], [end, .98]]));
    layer(.3, () => { for (const x of [200, 540, 880]) { PX.save(); PX.globalAlpha = .18; PX.fillStyle = '#FFF3C4'; PX.beginPath(); PX.moveTo(x - 30, 0); PX.lineTo(x + 30, 0); PX.lineTo(x + 200, 1500); PX.lineTo(x - 200, 1500); PX.fill(); PX.restore(); } });
    layer(1, () => {
      cut(Pe(540, 1430, 520, 110), '#5A3A2A', 3); cut(Pe(540, 1410, 500, 90), '#7A5038', 0);
      const beat = (t - rhythm) * 1.6, kinds = ['violin', 'drum', 'trumpet', 'piano', 'harp'];
      kinds.forEach((kd, i) => { const x = 150 + i * 195, y = 1220 + (i % 2) * 80, k = t < rhythm ? .25 : clamp(.25 + .75 * Math.max(0, Math.cos((beat - i) * 1.4)));
        instrument(kd, x, y, 1.05, k, t); ptext(LOBE_TH[LOBE_ORDER[i]].split(' · ')[0], x, y + 140, 30, '#FFE9C8', { lv: 0, weight: 600, alpha: pop(t, rhythm + .1 * i, .3) }); });
      const L = {}; LOBE_ORDER.forEach((k, i) => L[k] = t < rhythm ? .7 : clamp(.35 + .65 * Math.max(0, Math.cos((beat - i) * 1.4))));
      brainBuddy(540, 760, .95, L, { smile: 1 });
      strip([[700, 760], [800, 640 + Math.sin(t * 6) * 30]], '#FBF5E8', 8, 1);   // the conductor's baton
    });
    layer(0, () => {
      ptext('วงออร์เคสตรา', 540, 260, 84, '#FFE9A0', { pop: pop(t, NT.n10[0], .35), lv: 3, weight: 800 });
      ptext('แต่ละส่วนเล่นตามจังหวะ', 540, 380, 54, '#FFFFFF', { pop: pop(t, rhythm, .35), lv: 2, weight: 700 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1660;
    pcEnd();
  }

  // ===================== 8 · CLOSE: 100%, just not all at once =====================
  function s8(t, lt, dur) {
    const end = t - lt + dur, notAll = ph('n11', 1);
    pcBegin('#BFE8D3'); sky('#D6F2E4', '#BFE8D3', '#9FD8BE');
    pcCam(540, 980, kf(t, [[NT.n11[0] - .2, 1.1], [notAll, 1.0], [end, .97]]));
    layer(1, () => {
      const ring = ease(seg(t, NT.n11[0], notAll));
      PX.save(); PX.lineCap = 'round'; PX.lineWidth = 34; PX.strokeStyle = '#FBF5E8'; PX.beginPath(); PX.arc(540, 960, 400, 0, TAU); PX.stroke();
      PX.strokeStyle = '#2E9C8E'; PX.shadowColor = SHADE + '.3)'; PX.shadowBlur = 10; PX.shadowOffsetY = 4; PX.beginPath(); PX.arc(540, 960, 400, -Math.PI / 2, -Math.PI / 2 + TAU * ring); PX.stroke(); PX.restore();
      const turn = (t - notAll) * 2.4, L = {}; LOBE_ORDER.forEach((k, i) => L[k] = t < notAll ? ring : clamp(.45 + .55 * Math.max(0, Math.cos((turn - i) * 1.3))));
      brainBuddy(540, 960, 1.0, L, { smile: 1 });
    });
    layer(0, () => {
      ptext('ใช้ครบ 100%', 540, 270, 96, '#1F4E46', { pop: pop(t, NT.n11[0], .35), lv: 3, weight: 800 });
      ptext('แค่ไม่ใช้พร้อมกัน', 540, 400, 66, '#FFFFFF', { pop: pop(t, notAll, .35), card: '#2E9C8E', lv: 3, weight: 800, rot: -.03 });
      const k = seg(t, NT.n11[1] + .2, NT.n11[1] + .5);
      if (k > 0) ptext('ข้อมูล: Scientific American · Raichle & Gusnard 2002 · BPS Psychologist', 540, 1500, 24, '#3A4A44', { alpha: k, lv: 0 });
    });
    SUB_Y = 1600;
    pcEnd();
  }

  const c = k => NT[k][0] - .12;
  const wrap = fn => (t, lt, dur) => { SUB_Y = null; fn(t, lt, dur); };
  shots([[0, wrap(s1)], [c('n02'), wrap(s2)], [c('n03'), wrap(s3)], [c('n05'), wrap(s4)], [c('n07'), wrap(s5)], [c('n08'), wrap(s6)], [c('n10'), wrap(s7)], [c('n11'), wrap(s8)]]);
})();
