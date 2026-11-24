// scenes.js (sneeze): the shots of "ทำไมเราไม่ควรกลั้นจาม?". Every beat is tied to the narration:
// NT[key] = [start, end] of a line, ph(key, i) = onset of its i-th phrase. In a shot fn, dur is the shot's LENGTH:
// its end time is t - lt + dur. See shorts/sneeze/STORYBOARD.md.
(() => {
  const pop = (t, t0, d = .35) => seg(t, t0, t0 + d);
  const out = (t, t1, d = .3) => 1 - seg(t, t1, t1 + d);
  const chip = (txt, kind, a) => { if (a <= 0) return; const col = kind === 'fact' ? '#2F5E57' : kind === 'myth' ? '#9A3B3B' : '#5B4A8A';
    layer(0, () => { cut(Pc(70, 172, 9), kind === 'fact' ? '#7BE0A6' : kind === 'myth' ? '#FF9C8A' : '#C9B8FF', 0, { tex: 0, alpha: a }); ptext(txt, 92, 172, 30, '#FFFFFF', { card: col, align: 'left', weight: 500, lv: 0, alpha: a }); }); };
  const source = (txt, x, y, a) => ptext(txt, x, y, 26, '#4A3F3A', { card: 'rgba(250,244,232,.92)', weight: 400, lv: 0, alpha: a });

  // ===================== 1 · HOOK: a sneeze coming, pinched shut =====================
  function s1(t, lt, dur) {
    const end = t - lt + dur, pinch = ph('n01', 1), ever = ph('n01', 2);
    pcBegin('#F7B267'); sky('#FAD093', '#F7B267', '#EE9248');
    pcCam(540, 1150, kf(t, [[0, 1.45], [pinch, 1.3], [end, 1.22]], easeOut));
    const hold = seg(t, pinch, pinch + .3), sh = hold > 0 ? shakeXY(t, 5 * hold) : [0, 0];
    layer(.3, () => { for (let i = 0; i < 14; i++) { const p = frac(t * .25 + i / 14); dust(120 + hash(i) * 840, 1500 - p * 900, 8 + 6 * hash(i * 3), t + i, .7); } });
    layer(1, () => {
      const x = 540 + sh[0], y = 1560 + sh[1], hx = x, hy = y - 440 * 1.2;
      const tickle = seg(t, .1, pinch);                                                  // the face scrunches as it builds
      person(x, y, 1.2, { legs: false, lid: lerp(0, .65, tickle) + .25 * hold, mouth: t < pinch ? .35 * tickle : 0, smile: -.2, look: 0 });
      for (let i = 0; i < 4; i++) { const p = frac(t * .9 + i / 4); dust(hx + 160 - p * 140, hy - 80 + Math.sin(i * 2 + t * 3) * 30, 10, t * 2 + i, (1 - p) * (1 - hold)); }
      puffCheeks(hx, hy, 1.2, hold);
      pinchHand(hx, hy, 1.2, hold);
      if (hold > 0) ptext('!!', hx + 190, hy - 130, 90, '#D6334A', { pop: hold, lv: 2, weight: 800 });
    });
    layer(0, () => {
      ptext('ฮัด…', 540, 300, 110, '#FFFFFF', { pop: pop(t, .1, .35), lv: 3, weight: 800, rot: -.05, alpha: out(t, pinch - .1, .2) });
      ptext('กลั้นจาม?', 540, 330, 120, '#3A2E2A', { pop: pop(t, pinch + .05, .35), card: '#FFD84D', lv: 4, weight: 800, rot: .03 });
    });
    SUB_Y = 1700;
    pcEnd();
  }

  // ===================== 2 · LOOKS POLITE, BUT… =====================
  function s2(t, lt, dur) {
    const end = t - lt + dur, doc = ph('n02', 1), danger = ph('n02', 2);
    pcBegin('#BFE3E0'); sky('#D6EFEC', '#BFE3E0', '#9FD3CE');
    pcCam(540, 980, kf(t, [[NT.n02[0] - .2, 1.06], [danger, 1.0], [end, .98]]));
    layer(1, () => {
      const x = 380, y = 1520, hy = y - 440;
      person(x, y, 1.05, { legs: false, lid: .2, smile: .2 });
      puffCheeks(x, hy, 1.05, 1); pinchHand(x, hy, 1.05, 1);
      const kw = pop(t, danger - .1, .4);
      if (kw > 0) { warn(800, 900, 120 * backOut(kw), kw); }
      const kd = pop(t, doc, .35);                                                       // the doctor's word, as a stethoscope
      if (kd > 0) { PX.save(); PX.globalAlpha *= kd; strip(through([[700, 1180], [740, 1320], [840, 1340], [880, 1200]], 8), '#5A6A78', 12, 2); cut(Pc(790, 1360, 30), '#9AA6B2', 2, { edge: .4 }); PX.restore(); }
    });
    layer(0, () => {
      ptext('ดูสุภาพดี ✓', 540, 290, 76, '#1F4E46', { pop: pop(t, NT.n02[0], .35), lv: 2, weight: 800, alpha: out(t, doc - .1, .25) });
      ptext('แต่หมอเตือน!', 540, 290, 84, '#FFFFFF', { pop: pop(t, doc, .35), card: '#D6334A', lv: 3, weight: 800, rot: -.03 });
      ptext('อาจอันตรายกว่าที่คิด', 540, 410, 56, '#3A2E2A', { pop: pop(t, danger, .35), lv: 1, weight: 700 });
      chip('คำเตือนจากแพทย์', 'myth', 1);
    });
    SUB_Y = 1680;
    pcEnd();
  }

  // ===================== 3 · HOW A SNEEZE WORKS =====================
  function s3(t, lt, dur) {
    const end = t - lt + dur, brainT = ph('n03', 1), inhale = NT.n04[0], close = ph('n04', 1), press = ph('n04', 2), release = ph('n04', 3);
    pcBegin('#E9E2F7'); sky('#F2EDFB', '#E9E2F7', '#D8CCF0');
    pcCam(560, kf(t, [[NT.n03[0] - .2, 820], [inhale, 960], [end, 980]]), kf(t, [[NT.n03[0] - .2, 1.12], [inhale, .98], [end, .96]]));
    layer(1, () => {
      const inf = ease(seg(t, inhale, close)) * (1 - ease(seg(t, release, release + .4)));
      const gl = ease(seg(t, close, close + .3)) * (1 - ease(seg(t, release, release + .15)));
      const pr = ease(seg(t, press, release)) * (1 - ease(seg(t, release, release + .5)));
      airway(560, 760, 1.0, t, { inflate: inf, glottis: gl, pressure: pr, out: seg(t, release, release + .2) * out(t, end - .3, .3), brainLit: pop(t, brainT, .3) * out(t, NT.n04[0], .4) });
      // dust tickles the nose, the nerve tells the brain
      for (let i = 0; i < 5; i++) { const p = frac(t * .6 + i / 5); dust(960 - p * 160, 650 + Math.sin(i + t * 3) * 25, 10, t + i, (1 - p) * out(t, inhale, .4)); }
      const sig = seg(t, NT.n03[0] + .3, brainT + .4);
      if (sig > 0 && sig < 1) { const P = [[780, 660], [660, 600], [520, 540]], [px, py] = along(P, sig); strip(P, '#FFD84D', 6, 0, { alpha: .7 }); shine(px, py, 50, '#FFE27A', 1); }
      if (t > brainT) ptext('จาม!', 380, 420, 56, '#7A2E3A', { pop: pop(t, brainT + .2, .35), card: '#FFFFFF', lv: 2, weight: 800 });
      // the steps, ticked off on the right
      const steps = [['สูดลมลึก', inhale], ['ปิดคอ', close], ['อัดแรงดัน', press], ['ปล่อย!', release]];
      steps.forEach(([txt, t0], i) => { const k = pop(t, t0, .3); if (k > 0) ptext(`${i + 1}. ${txt}`, 900, 1020 + i * 70, 40, i === 3 ? '#D6334A' : '#3A2E5A', { pop: k, lv: 1, weight: 700, align: 'center' }); });
    });
    layer(0, () => {
      ptext('จาม = ระบบป้องกันตัว', 540, 260, 70, '#3A2E5A', { pop: pop(t, NT.n03[0], .35), lv: 2, weight: 800 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1690;
    pcEnd();
  }

  // ===================== 4 · SEAL IT SHUT: nowhere for the pressure to go =====================
  function s4(t, lt, dur) {
    const end = t - lt + dur, noWay = ph('n05', 1), docs = NT.n06[0], x20 = ph('n06', 1);
    const hot = seg(t, noWay, x20 + .5);
    pcBegin(mixCol('#E9E2F7', '#F7C6B6', hot)); sky(mixCol('#F2EDFB', '#FBD7CB', hot), mixCol('#E9E2F7', '#F7C6B6', hot), mixCol('#D8CCF0', '#EFA48C', hot));
    const sh = hot > .5 ? shakeXY(t, 6 * (hot - .5)) : [0, 0];
    pcCam(560 + sh[0], 980 + sh[1], kf(t, [[NT.n05[0] - .2, 1.0], [x20, 1.06], [end, 1.1]]));
    layer(1, () => {
      airway(560, 760, 1.0, t, { inflate: 1, glottis: 0, corks: ease(seg(t, NT.n05[0] + .2, NT.n05[0] + .7)), pressure: lerp(.4, 1, ease(hot)) });
      gauge(880, 1500, 150, lerp(.3, .98, ease(hot)) + .02 * Math.sin(t * 20) * hot, 'แรงดัน');
    });
    layer(0, () => {
      ptext('ปิดทางออกหมด', 540, 270, 76, '#7A2E3A', { pop: pop(t, NT.n05[0] + .2, .35), lv: 2, weight: 800, alpha: out(t, docs - .2, .25) });
      ptext('แรงดันไม่มีที่ไป', 540, 380, 58, '#3A2E2A', { pop: pop(t, noWay, .35), lv: 1, weight: 700, alpha: out(t, docs - .2, .25) });
      ptext('~20 เท่า', 540, 320, 140, '#FFFFFF', { pop: pop(t, x20, .4), card: '#D6334A', lv: 4, weight: 800, rot: -.04 });
      if (t > docs) source('การประเมินของทีมแพทย์ในรายงานปี 2023 (BMJ Case Reports)', 540, 450, pop(t, docs, .35));
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1690;
    pcEnd();
  }

  // ===================== 5 · THE 2023 CASE: a 2 mm tear in the windpipe =====================
  function s5(t, lt, dur) {
    const end = t - lt + dur, man = ph('n07', 1), tear = ph('n07', 2);
    pcBegin('#DCEAF7'); sky('#E8F2FB', '#DCEAF7', '#C4DAEE');
    pcCam(540, kf(t, [[NT.n07[0] - .2, 960], [tear, 1040], [end, 1080]]), kf(t, [[NT.n07[0] - .2, 1.04], [tear, 1.0], [end, 1.06]]));
    layer(1, () => {
      reportCard(540, 700, 1.0, pop(t, NT.n07[0], .4));
      const k = pop(t, man, .4);
      if (k > 0) { PX.save(); PX.globalAlpha *= k; airway(460, 1000, .7, t, { inflate: .6, corks: 1, pressure: .7, tear: seg(t, tear, tear + .5) }); PX.restore(); }
      if (t > tear) { magnifier(700, 1290, 110, pop(t, tear + .2, .35)); ptext('รูขนาด ~2 มม.', 820, 1460, 44, '#B5483A', { pop: pop(t, tear + .4, .35), lv: 1, weight: 800 }); }
    });
    layer(0, () => {
      ptext('เกิดขึ้นจริง', 540, 260, 84, '#1F3E6E', { pop: pop(t, NT.n07[0], .35), lv: 2, weight: 800 });
      ptext('กลั้นจาม → หลอดลมฉีก', 540, 380, 58, '#FFFFFF', { pop: pop(t, tear, .35), card: '#B5483A', lv: 3, weight: 800 });
      chip('รายงานทางการแพทย์', 'fact', 1);
    });
    SUB_Y = 1700;
    pcEnd();
  }

  // ===================== 6 · RARE, BUT NOT WORTH IT =====================
  function s6(t, lt, dur) {
    const end = t - lt + dur, notWorth = ph('n08', 1);
    pcBegin('#F2E2B8'); sky('#F7EBCB', '#F2E2B8', '#E6CE96');
    pcCam(540, 1000, kf(t, [[NT.n08[0] - .2, 1.05], [end, 1.0]]));
    layer(1, () => {
      const tilt = lerp(0, -.22, ease(seg(t, notWorth, notWorth + .6)));
      cut(Pp([[540, 1300], [475, 1430], [605, 1430]]), '#8C6A4E', 2);
      PX.save(); PX.translate(540, 1300); PX.scale(1.3, 1.3); PX.rotate(tilt);
      cut(Pr(-380, -14, 760, 28, 14), '#C9824E', 2);
      cut(Pr(-360, -190, 240, 176, 20), '#FBF5E8', 2, { edge: .3 }); ptext('ได้อะไร?', -240, -130, 40, '#3A2E2A', { lv: 0, weight: 800 }); ptext('แค่ไม่มีเสียง', -240, -70, 32, '#5A4A44', { lv: 0, weight: 600 });
      cut(Pr(120, -190, 240, 176, 20), '#FBF5E8', 2, { edge: .3 }); ptext('เสี่ยงอะไร?', 240, -130, 40, '#B5483A', { lv: 0, weight: 800 }); ptext('พบน้อย แต่ร้ายแรง', 240, -70, 30, '#5A4A44', { lv: 0, weight: 600 });
      PX.restore();
    });
    layer(0, () => {
      ptext('พบได้น้อยมาก', 540, 290, 80, '#3A2E2A', { pop: pop(t, NT.n08[0], .35), lv: 2, weight: 800 });
      ptext('แต่ไม่คุ้มเสี่ยง', 540, 410, 72, '#FFFFFF', { pop: pop(t, notWorth, .35), card: '#B5483A', lv: 3, weight: 800, rot: -.03 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1620;
    pcEnd();
  }

  // ===================== 7 · THE RIGHT WAY: let it out, into a tissue or an elbow =====================
  function s7(t, lt, dur) {
    const end = t - lt + dur, letIt = ph('n09', 1), cover = ph('n09', 2), safe = NT.n10[0], others = ph('n10', 1);
    pcBegin('#BFE8D3'); sky('#D6F2E4', '#BFE8D3', '#9FD8BE');
    pcCam(kf(t, [[NT.n09[0] - .2, 540], [safe, 540], [end, 600]]), 1000, kf(t, [[NT.n09[0] - .2, 1.06], [safe, 1.0], [end, .96]]));
    layer(1, () => {
      const x = 400, y = 1560, hx = x, hy = y - 440 * 1.05;
      const sneeze = seg(t, letIt, letIt + .3), arm = ease(seg(t, cover - .3, cover + .2));
      person(x, y, 1.05, { legs: false, lid: sneeze > 0 && sneeze < 1 ? .9 : .2, mouth: sneeze > 0 ? .6 : 0, smile: .4, nod: -.08 * sneeze });
      elbowCover(hx, hy, 1.05, arm);
      if (t > letIt) spray(hx + 40, hy + 60, 1.05, t, seg(t, letIt, letIt + .2) * out(t, safe + .5, .4), 1, arm > .5 ? hx + 130 : null);
      tissue(250, 900, 1.0, pop(t, cover - .2, .35) * out(t, safe, .3)); if (t > cover - .2 && t < safe + .3) ptext('หรือ', 250, 820, 34, '#1F4E46', { lv: 0, weight: 700, alpha: pop(t, cover, .3) * out(t, safe, .3) });
      // the people around stay clear
      const kp = pop(t, others - .2, .4);
      if (kp > 0) { PX.save(); PX.globalAlpha *= kp; person(860, 1560, .65, { legs: false, smile: 1, shirt: '#E0614A' }); person(980, 1580, .55, { legs: false, smile: 1, shirt: '#7B66C9' }); PX.restore();
        cut(Pc(920, 1050, 40 * backOut(kp)), '#2E9C8E', 2); ptext('✓', 920, 1052, 48, '#FFFFFF', { pop: kp, lv: 0, weight: 800 }); }
    });
    layer(0, () => {
      ptext('ปล่อยให้จามออกมา', 540, 270, 76, '#1F4E46', { pop: pop(t, letIt, .35), lv: 2, weight: 800 });
      ptext('ใช้ข้อพับแขน / ทิชชู่ปิด', 540, 380, 56, '#FFFFFF', { pop: pop(t, cover, .35), card: '#2E9C8E', lv: 3, weight: 700 });
      ptext('ปลอดภัย + ไม่แพร่เชื้อ', 540, 480, 46, '#1F4E46', { pop: pop(t, others, .35), lv: 1, weight: 700 });
      chip('วิธีที่แนะนำ', 'fact', 1);
    });
    SUB_Y = 1720;
    pcEnd();
  }

  // ===================== 8 · CLOSE =====================
  function s8(t, lt, dur) {
    const end = t - lt + dur, dont = ph('n11', 1), right = ph('n11', 2);
    pcBegin('#FFD9A8'); sky('#FFE6C2', '#FFD9A8', '#F7B98A');
    pcCam(540, 1000, kf(t, [[NT.n11[0] - .2, 1.08], [right, 1.0], [end, .97]]));
    layer(1, () => {
      const ka = pop(t, dont, .35), kb = pop(t, right, .35);
      cut(Pr(100, 620, 400, 600, 30), '#FBF5E8', 3, { alpha: ka, edge: .3 }); cut(Pr(580, 620, 400, 600, 30), '#FBF5E8', 3, { alpha: kb, edge: .3 });
      if (ka > 0) { PX.save(); PX.globalAlpha *= ka; person(300, 1120, .6, { legs: false, lid: .5, smile: -.2 }); puffCheeks(300, 856, .6, 1); pinchHand(300, 856, .6, 1); PX.restore();
        strip([[160, 700], [440, 1140]], '#D6334A', 16, 2, { alpha: ka }); strip([[440, 700], [160, 1140]], '#D6334A', 16, 2, { alpha: ka }); ptext('อย่ากลั้น', 300, 1180, 46, '#B5483A', { lv: 0, weight: 800, alpha: ka }); }
      if (kb > 0) { PX.save(); PX.globalAlpha *= kb; person(780, 1120, .6, { legs: false, lid: .3, smile: .6 }); elbowCover(780, 856, .6, 1); PX.restore();
        ptext('✓', 900, 700, 80, '#2E9C8E', { pop: kb, lv: 1, weight: 800 }); ptext('จามใส่ข้อพับแขน', 780, 1180, 40, '#1F4E46', { lv: 0, weight: 800, alpha: kb }); }
    });
    layer(0, () => {
      ptext('สรุป', 540, 300, 84, '#3A2E2A', { pop: pop(t, NT.n11[0], .35), lv: 2, weight: 800 });
      const k = seg(t, NT.n11[1] + .15, NT.n11[1] + .45);
      if (k > 0) ptext('ข้อมูล: BMJ Case Reports 2023 · คำแนะนำสุขอนามัยการจาม', 540, 1320, 26, '#3A4A44', { alpha: k, lv: 0 });
    });
    SUB_Y = 1600;
    pcEnd();
  }

  const c = k => NT[k][0] - .12;
  const wrap = fn => (t, lt, dur) => { SUB_Y = null; fn(t, lt, dur); };
  shots([[0, wrap(s1)], [c('n02'), wrap(s2)], [c('n03'), wrap(s3)], [c('n05'), wrap(s4)], [c('n07'), wrap(s5)], [c('n08'), wrap(s6)], [c('n09'), wrap(s7)], [c('n11'), wrap(s8)]]);
})();
