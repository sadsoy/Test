// scenes.js (nails): the shots of "เล็บและผมยังยาวหลังเสียชีวิตจริงไหม?". Every beat is tied to the narration:
// NT[key] = [start, end] of a line, ph(key, i) = onset of its i-th phrase. In a shot fn, dur is the shot's LENGTH:
// its end time is t - lt + dur. See shorts/nails/STORYBOARD.md.
(() => {
  const pop = (t, t0, d = .35) => seg(t, t0, t0 + d);
  const out = (t, t1, d = .3) => 1 - seg(t, t1, t1 + d);
  const chip = (txt, kind, a) => { if (a <= 0) return; const col = kind === 'fact' ? '#2F5E57' : kind === 'myth' ? '#9A3B3B' : '#5B4A8A';
    layer(0, () => { cut(Pc(70, 172, 9), kind === 'fact' ? '#7BE0A6' : kind === 'myth' ? '#FF9C8A' : '#C9B8FF', 0, { tex: 0, alpha: a }); ptext(txt, 92, 172, 30, '#FFFFFF', { card: col, align: 'left', weight: 500, lv: 0, alpha: a }); }); };
  const source = (txt, x, y, a) => ptext(txt, x, y, 26, '#4A3F3A', { card: 'rgba(250,244,232,.92)', weight: 400, lv: 0, alpha: a });

  // ===================== 1 · HOOK: the rumour — nails keep growing for days =====================
  function s1(t, lt, dur) {
    const end = t - lt + dur, dead = ph('n01', 1), nails = ph('n01', 2);
    pcBegin('#2A2346'); sky('#1F1A38', '#2A2346', '#3A3160'); stars(t, .7);
    pcCam(540, 1000, kf(t, [[0, 1.12], [nails, 1.03], [end, 1.0]], easeOut));
    layer(.2, () => { moon(820, 380, 70); for (let i = 0; i < 3; i++) cloud(((i * 400 + t * 25) % 1500) - 200, 520 + i * 70, .8, '#4A4270', 2, { alpha: .8 }); });
    layer(1, () => {
      // the myth, acted out: the nail creeps longer as calendar days flip
      const grow = ease(seg(t, nails, end + .5));
      const f = fingertip(650, 1150, 1.0, { nailLen: 300 + 90 * grow });
      rulerSpan(f.nailStart, f.nailEnd, 980, null, '#FFD84D', pop(t, nails, .3));
      const day = Math.min(3, 1 + Math.floor(seg(t, nails, end) * 3));
      if (t > nails) { cut(Pr(150, 640, 200, 220, 18), '#FBF5E8', 3, { edge: .3 }); cut(Pr(150, 640, 200, 56, 18), '#D6334A', 0); ptext('วันที่', 250, 668, 32, '#FFFFFF', { lv: 0, weight: 700 }); ptext(String(day), 250, 780, 110, '#3A2E2A', { lv: 0, weight: 800, pop: frac(seg(t, nails, end) * 3) < .2 ? frac(seg(t, nails, end) * 3) * 5 : 1 }); }
    });
    layer(0, () => {
      ptext('ตายไปแล้ว…', 540, 300, 80, '#E9E3FF', { pop: pop(t, dead, .35), lv: 3, weight: 700 });
      ptext('เล็บยังยาวต่อ?', 540, 430, 104, '#FFD84D', { pop: pop(t, nails, .35), lv: 4, weight: 800, rot: -.03 });
      chip('ความเชื่อที่พบบ่อย', 'myth', pop(t, .1, .3));
    });
    SUB_Y = 1620;
    pcEnd();
  }

  // ===================== 2 · GOOSEBUMPS: "I saw it myself" =====================
  function s2(t, lt, dur) {
    const end = t - lt + dur, some = ph('n02', 1), saw = ph('n02', 2);
    pcBegin('#5B4A8A'); sky('#6E5CA0', '#5B4A8A', '#47386F');
    pcCam(540, 1000, kf(t, [[NT.n02[0] - .2, 1.08], [saw, 1.0], [end, .98]]));
    const shiver = seg(t, NT.n02[0], NT.n02[0] + .3) * out(t, some, .4);
    layer(1, () => {
      person(540 + Math.sin(t * 50) * 6 * shiver, 1460, 1.15, { lid: 0, mouth: shiver > .3 ? .45 : 0, smile: -.3, legs: false, look: Math.sin(t * 3) * 5 });
      if (shiver > 0) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; strip([[540 + Math.cos(a) * 170, 960 + Math.sin(a) * 170], [540 + Math.cos(a) * 210, 960 + Math.sin(a) * 210]], '#FFFFFF', 8, 1, { alpha: shiver }); }
      const kb = pop(t, some, .35);
      if (kb > 0) { cut(Pr(560, 520, 420, 150, 70), '#FFFFFF', 3, { alpha: kb }); cut(Pp([[620, 660], [600, 730], [680, 665]]), '#FFFFFF', 0, { alpha: kb });
        ptext('ฉันเห็นมากับตา!', 770, 595, 50, '#5B4A8A', { pop: kb, lv: 0, weight: 800 }); }
    });
    layer(0, () => {
      ptext('น่าขนลุก!', 540, 290, 96, '#FFFFFF', { pop: pop(t, NT.n02[0], .35), lv: 3, weight: 800, rot: .03 });
      if (t > saw) ptext('?', 860, 1000, 160, '#FFD84D', { pop: pop(t, saw + .2, .4), lv: 3, weight: 800 });
      chip('ความเชื่อที่พบบ่อย', 'myth', 1);
    });
    SUB_Y = 1700;
    pcEnd();
  }

  // ===================== 3 · HOW NAILS GROW: cells dividing, fed by blood =====================
  function s3(t, lt, dur) {
    const end = t - lt + dur, divide = ph('n03', 1), feed = NT.n04[0], blood = ph('n04', 1);
    pcBegin('#BFE8D3'); sky('#D6F2E4', '#BFE8D3', '#9FD8BE');
    pcCam(kf(t, [[NT.n03[0] - .2, 540], [divide, 460], [end, 440]]), 1000, kf(t, [[NT.n03[0] - .2, 1.0], [divide, 1.18], [end, 1.22]]));
    layer(1, () => {
      const f = fingertip(640, 1050, 1.0, {});
      // cutaway window at the nail root: dividing cells push the nail forward on a belt
      const wx = f.nailStart - 60, wy = f.ny + 40;
      cut(Pr(wx - 160, wy - 10, 330, 170, 24), '#FBEDE6', 2, { edge: .3 });
      for (let i = 0; i < 6; i++) { const x = wx - 130 + ((i * 55 + (t - divide) * 40 * (t > divide ? 1 : 0)) % 330 + 330) % 330, y = wy + 80;
        const sp = t > divide ? Math.max(0, Math.sin(t * 3 + i)) : 0;                  // a cell pinching in two
        cut(Pe(x - sp * 10, y, 24, 22), NAI.cell, 1, { edge: .3 }); if (sp > .3) cut(Pe(x + 14, y, 18 * sp, 18 * sp), NAI.cell, 1); }
      ptext('เซลล์แบ่งตัว', wx, wy + 190, 34, '#7A2E3A', { lv: 0, weight: 700, alpha: pop(t, divide, .35) });
      // the blood vessel and what it brings
      const kv = seg(t, feed - .2, feed + .3), V = [[60, 1260], [260, 1240], [wx - 40, wy + 150]];
      strip(V, NAI.blood, 22, 2, { alpha: kv });
      if (kv > 0) for (let i = 0; i < 6; i++) { const k = frac(t * .5 + i / 6), [x, y] = along(V, k);
        if (i % 2) sugarCube(x, y - 30, 14, t + i, kv); else { cut(Pc(x, y - 30, 16), NAI.o2, 1, { alpha: kv }); ptext('O₂', x, y - 30, 16, '#1F4E6E', { lv: 0, weight: 800, alpha: kv }); } }
      ptext('ออกซิเจน + น้ำตาล', 260, 1340, 36, '#7A2E3A', { lv: 0, weight: 700, alpha: pop(t, feed + .2, .35) });
      ptext('จากเลือด', 260, 1390, 34, '#7A2E3A', { lv: 0, weight: 600, alpha: pop(t, blood, .35) });
    });
    layer(0, () => {
      ptext('เล็บงอกได้อย่างไร', 540, 270, 76, '#1F4E46', { pop: pop(t, NT.n03[0], .35), lv: 2, weight: 800 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1620;
    pcEnd();
  }

  // ===================== 4 · THE HEART STOPS, THE FACTORY CLOSES =====================
  function s4(t, lt, dur) {
    const end = t - lt + dur, stop = NT.n05[0] + .6, close = ph('n05', 1);
    const off = seg(t, close, close + .8);
    pcBegin(mixCol('#F2D7A6', '#7E7A8C', off)); sky(mixCol('#F7E3BE', '#8E8A9C', off), mixCol('#F2D7A6', '#7E7A8C', off), mixCol('#E8C487', '#6A6678', off));
    pcCam(540, 980, kf(t, [[NT.n05[0] - .2, 1.06], [close, 1.0], [end, .98]]));
    layer(1, () => {
      const flat = seg(t, stop - .2, stop + .3), beat = flat < 1 ? Math.max(0, Math.sin(t * 7)) ** 6 * (1 - flat) : 0;
      heart(320, 700, 110, beat, mixCol(NAI.blood, '#8E8A99', flat * .6));
      cut(Pr(120, 860, 840, 160, 20), '#22263A', 2); ecg(140, 940, 940, t, flat);
      factory(540, 1420, 1.3, 1 - off, t);
      if (off > .3) { PX.save(); PX.translate(540, 1240); PX.rotate(-.06 + Math.sin(t * 2) * .02); cut(Pr(-110, -40, 220, 80, 10), '#FBF5E8', 3, { alpha: seg(off, .3, .6) }); ptext('ปิด', 0, 2, 52, '#9A3B3B', { lv: 0, weight: 800, alpha: seg(off, .3, .6) }); PX.restore(); }
      ptext('โรงงานผลิตเล็บและผม', 540, 1520, 36, '#3A2E2A', { lv: 0, weight: 700, alpha: pop(t, close - .3, .35) });
    });
    layer(0, () => {
      ptext('หัวใจหยุด = ส่งอาหารหยุด', 540, 290, 58, '#3A2E2A', { pop: pop(t, stop, .35), lv: 2, weight: 800 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1660;
    pcEnd();
  }

  // ===================== 5 · THE QUESTION AND THE REVEAL: it's the skin =====================
  function s5(t, lt, dur) {
    const end = t - lt + dur, ans = NT.n07[0], skin = ph('n07', 1);
    pcBegin('#F7C9B6'); sky('#FBDCCD', '#F7C9B6', '#EFA98E');
    const mx = kf(t, [[NT.n06[0], 900], [skin, 560]], easeOut), my = kf(t, [[NT.n06[0], 800], [skin, 1020]], easeOut);
    pcCam(540, 1000, kf(t, [[NT.n06[0] - .2, 1.08], [skin, 1.0], [end, 1.04]]));
    layer(1, () => {
      fingertip(640, 1100, 1.0, {});
      magnifier(mx, my, 130, pop(t, ans - .2, .4));
      if (t > skin) shine(560, 1000, 200, '#FFE9A0', .5 * pop(t, skin, .4));
    });
    layer(0, () => {
      ptext('แล้วที่เห็นว่ายาวขึ้น?', 540, 290, 70, '#3A2E2A', { pop: pop(t, NT.n06[0], .35), lv: 2, weight: 800, alpha: out(t, ans - .2, .25) });
      ptext('มาจากไหน?', 540, 400, 70, '#9A3B3B', { pop: pop(t, ph('n06', 1), .35), lv: 2, weight: 800, alpha: out(t, ans - .2, .25) });
      ptext('ผิวหนังต่างหาก!', 540, 330, 104, '#FFFFFF', { pop: pop(t, skin, .35), card: '#D9734E', lv: 4, weight: 800, rot: -.04 });
      chip('จุดหักมุม', 'study', 1);
    });
    SUB_Y = 1620;
    pcEnd();
  }

  // ===================== 6 · SKIN DRIES AND SHRINKS (grape → raisin) =====================
  function s6(t, lt, dur) {
    const end = t - lt + dur, shrink = ph('n08', 1), k = ease(seg(t, NT.n08[0] + .2, end - .2));
    pcBegin('#F2E2B8'); sky('#F7EBCB', '#F2E2B8', '#E6CE96');
    pcCam(540, 980, kf(t, [[NT.n08[0] - .2, 1.06], [end, 1.0]]));
    layer(1, () => {
      grape(540, 900, 230, k);
      for (let i = 0; i < 6; i++) { const p = frac(t * .7 + i / 6); cut(dropShape(540 + (i - 2.5) * 70, 900 - 200 - p * 300, 16), '#6EC6F0', 1, { alpha: (1 - p) * seg(t, NT.n08[0], NT.n08[0] + .4) * (1 - k * .5) }); }
      ptext('องุ่น', 330, 1290, 46, '#3A2E2A', { lv: 0, weight: 700, alpha: 1 - k }); ptext('→ ลูกเกด', 680, 1290, 46, '#6A3A2E', { lv: 0, weight: 800, alpha: k });
    });
    layer(0, () => {
      ptext('เสียน้ำ', 540, 280, 84, '#1F4E6E', { pop: pop(t, NT.n08[0], .35), lv: 2, weight: 800 });
      ptext('ผิวแห้ง · หดตัว', 540, 400, 72, '#FFFFFF', { pop: pop(t, shrink, .35), card: '#9A6A3A', lv: 3, weight: 800 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1600;
    pcEnd();
  }

  // ===================== 7 · NAIL AND STUBBLE STAY THE SAME LENGTH; THE SKIN PULLS BACK =====================
  function s7(t, lt, dur) {
    const end = t - lt + dur, stub = ph('n09', 1), looks = ph('n09', 2);
    pcBegin('#DCEAF7'); sky('#E8F2FB', '#DCEAF7', '#C4DAEE');
    pcCam(540, 960, kf(t, [[NT.n09[0] - .2, 1.04], [end, 1.0]]));
    const back = ease(seg(t, NT.n09[0] + .5, stub + .6)), drop = ease(seg(t, stub + .1, looks + .3));   // slow enough to watch
    layer(1, () => {
      cut(Pr(60, 500, 960, 520, 30), '#F7FAFD', 2, { edge: .3 }); cut(Pr(60, 1060, 960, 520, 30), '#F7FAFD', 2, { edge: .3 });
      // two fingers from above: as it was, and after the skin has shrunk. Same nail; the dashed outline is the part under the skin.
      const L = fingerTop(300, 1100, .82, { back: 0, hidden: pop(t, NT.n09[0] + .3, .4) }), R = fingerTop(700, 1100, .82, { back, hidden: pop(t, NT.n09[0] + .3, .4) });
      ptext('ปกติ', 300, 545, 36, '#3A2E2A', { lv: 0, weight: 800 }); ptext('ผิวหดตัว', 700, 545, 36, '#B5483A', { lv: 0, weight: 800 });
      rulerV(180, L.top, L.cut, 'ที่เห็น', '#2E9C8E'); rulerV(840, R.top, R.cut, 'เห็นมากขึ้น', '#D9734E');
      ptext('เส้นประ = เล็บส่วนที่อยู่ใต้ผิว · ยาวเท่ากัน', 540, 1000, 30, '#B5483A', { lv: 0, weight: 700, alpha: pop(t, NT.n09[0] + .6, .3) });
      chin(540, 1340, 1.2, drop, drop);
      ptext('ตอหนวดยาวเท่าเดิม แต่ผิวลดระดับลง', 540, 1120, 34, '#2E9C8E', { lv: 0, weight: 700, alpha: pop(t, stub + .3, .3) });
    });
    layer(0, () => {
      ptext('ไม่ได้ยาวขึ้น', 540, 290, 84, '#3A2E2A', { pop: pop(t, NT.n09[0], .35), lv: 2, weight: 800 });
      ptext('แค่ดูเหมือนยาวขึ้น', 540, 400, 66, '#FFFFFF', { pop: pop(t, looks, .35), card: '#D9734E', lv: 3, weight: 800 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1690;
    pcEnd();
  }

  // ===================== 8 · CREAM, AND THE ONE-LINE TAKEAWAY =====================
  function s8(t, lt, dur) {
    const end = t - lt + dur, cream = ph('n10', 1), slow = ph('n10', 2), sum = NT.n11[0], notNail = ph('n11', 1), skin = ph('n11', 2);
    const fin = ease(seg(t, sum - .2, sum + .4));
    pcBegin(mixCol('#F7D9C4', '#BFE8D3', fin)); sky(mixCol('#FBE6D6', '#D6F2E4', fin), mixCol('#F7D9C4', '#BFE8D3', fin), mixCol('#EFC2A4', '#9FD8BE', fin));
    pcCam(540, 1000, kf(t, [[NT.n10[0] - .2, 1.06], [sum, 1.0], [end, .97]]));
    layer(1, () => {
      if (fin < 1) { PX.save(); PX.globalAlpha = 1 - fin;
        fingertip(620, 1150, 1.0, { dry: .2 }); creamTube(380, 760, .9, seg(t, cream, cream + .6));
        if (t > slow) { PX.save(); PX.globalAlpha *= seg(t, slow, slow + .4); PX.strokeStyle = '#FFFFFF'; PX.lineWidth = 10; PX.setLineDash([16, 14]); PX.beginPath(); PX.ellipse(620, 1080, 340, 120, 0, 0, TAU); PX.stroke(); PX.restore(); }
        PX.restore(); }
      if (fin > 0) { PX.save(); PX.globalAlpha = fin;
        cut(Pr(120, 640, 840, 260, 30), '#FBF5E8', 3, { edge: .3 }); cut(Pr(120, 960, 840, 260, 30), '#FBF5E8', 3, { edge: .3 });
        ptext('เล็บยาวขึ้น', 470, 770, 64, '#8E8A99', { lv: 0, weight: 800, alpha: pop(t, notNail, .35) }); if (t > notNail + .2) { strip([[290, 770], [650, 770]], '#D6334A', 12, 1, { alpha: pop(t, notNail + .2, .3) }); ptext('✗', 820, 770, 90, '#D6334A', { lv: 0, weight: 800, pop: pop(t, notNail + .2, .3) }); }
        ptext('ผิวหดลง', 470, 1090, 70, '#1F4E46', { lv: 0, weight: 800, alpha: pop(t, skin, .35) }); ptext('✓', 820, 1090, 90, '#2E9C8E', { lv: 0, weight: 800, pop: pop(t, skin + .2, .3) });
        PX.restore(); }
    });
    layer(0, () => {
      ptext('ทาครีมชะลอผิวหดตัว', 540, 300, 64, '#5A3A2A', { pop: pop(t, cream, .35), lv: 2, weight: 800, alpha: 1 - fin });
      if (fin < 1) source('ที่มา: Vreeman & Carroll, BMJ (2007) "Medical myths"', 540, 390, pop(t, cream, .35) * (1 - fin));
      ptext('สรุป', 540, 300, 80, '#1F4E46', { pop: pop(t, sum, .35), lv: 2, weight: 800 });
      const k = seg(t, NT.n11[1] + .2, NT.n11[1] + .5);
      if (k > 0) ptext('ข้อมูล: Vreeman & Carroll, BMJ 2007 · Live Science', 540, 1330, 26, '#3A4A44', { alpha: k, lv: 0 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1600;
    pcEnd();
  }

  const c = k => NT[k][0] - .12;
  const wrap = fn => (t, lt, dur) => { SUB_Y = null; fn(t, lt, dur); };
  shots([[0, wrap(s1)], [c('n02'), wrap(s2)], [c('n03'), wrap(s3)], [c('n05'), wrap(s4)], [c('n06'), wrap(s5)], [c('n08'), wrap(s6)], [c('n09'), wrap(s7)], [c('n10'), wrap(s8)]]);
})();
