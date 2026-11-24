// scenes.js (sleepdebt): the shots of "นอนชดเชยวันหยุดทดแทนการอดนอนได้ไหม?". Every beat is tied to the narration:
// NT[key] = [start, end] of a line, ph(key, i) = onset of its i-th phrase. In a shot fn, dur is the shot's LENGTH:
// its end time is t - lt + dur. See shorts/sleepdebt/STORYBOARD.md.
(() => {
  const pop = (t, t0, d = .35) => seg(t, t0, t0 + d);
  const out = (t, t1, d = .3) => 1 - seg(t, t1, t1 + d);
  const chip = (txt, kind, a) => { if (a <= 0) return; const col = kind === 'fact' ? '#2F5E57' : kind === 'myth' ? '#9A3B3B' : '#5B4A8A';
    layer(0, () => { cut(Pc(70, 172, 9), kind === 'fact' ? '#7BE0A6' : kind === 'myth' ? '#FF9C8A' : '#C9B8FF', 0, { tex: 0, alpha: a }); ptext(txt, 92, 172, 30, '#FFFFFF', { card: col, align: 'left', weight: 500, lv: 0, alpha: a }); }); };
  const source = (txt, x, y, a) => ptext(txt, x, y, 26, '#4A3F3A', { card: 'rgba(250,244,232,.92)', weight: 400, lv: 0, alpha: a });

  // ===================== 1 · HOOK: 5 h on weekdays, 12 h at the weekend — even? =====================
  function s1(t, lt, dur) {
    const end = t - lt + dur, wkend = ph('n01', 1), even = ph('n01', 2);
    pcBegin('#26305E'); sky('#1E2650', '#26305E', '#34407A'); stars(t, .8);
    pcCam(540, 1000, kf(t, [[0, 1.1], [even, 1.0], [end, .98]], easeOut));
    layer(.2, () => moon(860, 360, 60));
    layer(1, () => {
      const we = ease(seg(t, wkend, wkend + .6));                                // weekdays first, the long weekend bars on "เสาร์อาทิตย์"
      weekBars(140, 1230, 800, 560, [5, 5, 5, 5, 5, Math.max(.01, 12 * we), Math.max(.01, 12 * we)], seg(t, .15, wkend * .9));
      // a see-saw: the weekday debt against the weekend lie-in
      const k = pop(t, even - .1, .4), tilt = .12 * Math.sin(t * 2.2) * k;
      if (k > 0) { PX.save(); PX.translate(540, 1500); PX.rotate(tilt); cut(Pr(-330, -14, 660, 28, 14), '#C9824E', 2, { alpha: k });
        ptext('อดนอน', -220, -60, 40, '#FFFFFF', { lv: 2, weight: 700, alpha: k }); ptext('นอนชดเชย', 220, -60, 40, '#FFFFFF', { lv: 2, weight: 700, alpha: k }); PX.restore();
        cut(Pp([[540, 1500], [500, 1580], [580, 1580]]), '#8C6A4E', 2, { alpha: k }); }
    });
    layer(0, () => {
      ptext('จ.–ศ. 5 ชม. · ส.–อา. 12 ชม.', 540, 290, 56, '#FFFFFF', { pop: pop(t, .15, .35), lv: 3, weight: 700 });
      ptext('หายกันไหม?', 540, 410, 110, '#FFD84D', { pop: pop(t, even, .35), lv: 4, weight: 800, rot: -.03 });
      chip('คำถามยอดฮิต', 'study', pop(t, .1, .3));
    });
    SUB_Y = 1700;
    pcEnd();
  }

  // ===================== 2 · THE BANK-ACCOUNT IDEA =====================
  function s2(t, lt, dur) {
    const end = t - lt + dur, bank = ph('n02', 1), debt = ph('n02', 2), pay = ph('n02', 3);
    pcBegin('#F7C9D2'); sky('#FBDCE2', '#F7C9D2', '#EFA9B8');
    pcCam(540, 1000, kf(t, [[NT.n02[0] - .2, 1.06], [pay, 1.0], [end, .98]]));
    layer(1, () => {
      piggy(540, 1000, 1.4, t, seg(t, debt, debt + .4) * out(t, pay + .2, .4));
      // coins fall out on weekdays (debt), then drop back in (pay back)
      for (let i = 0; i < 5; i++) { const k = seg(t, debt + i * .08, debt + .7 + i * .08); if (k > 0 && t < pay + .2) coin(470 + i * 40, 1180 + 260 * easeIn(k), 32, 1 - k * .3, k * 4); }
      for (let i = 0; i < 5; i++) { const k = seg(t, pay + i * .1, pay + .6 + i * .1); if (k > 0 && k < 1) coin(540, lerp(520, 830, easeIn(k)), 32, 1, k * 6); }
    });
    layer(0, () => {
      ptext('การนอน = บัญชีธนาคาร?', 540, 290, 64, '#7A2E3A', { pop: pop(t, bank, .35), lv: 2, weight: 800 });
      ptext('ติดหนี้ → โปะคืน', 540, 400, 58, '#FFFFFF', { pop: pop(t, debt, .35), card: '#B5483A', lv: 3, weight: 700 });
      chip('ความเชื่อที่พบบ่อย', 'myth', 1);
    });
    SUB_Y = 1620;
    pcEnd();
  }

  // ===================== 3 · THE EXPERIMENT: weekend catch-up adds only ~1 h =====================
  function s3(t, lt, dur) {
    const end = t - lt + dur, free = ph('n03', 1), res = NT.n04[0], more = ph('n04', 1), onlyOne = ph('n04', 2);
    pcBegin('#CFE3F2'); sky('#E2EEF8', '#CFE3F2', '#B5D2EA');
    pcCam(540, 1000, kf(t, [[NT.n03[0] - .2, 1.06], [res, 1.0], [onlyOne, 1.04], [end, 1.06]]));
    layer(1, () => {
      // the study design: 5 h on weekdays, then "sleep as much as you like" at the weekend (dashed: what people expect).
      // No hour values are drawn for the weekend: the finding is only that the catch-up came to about 1 extra hour.
      const grow = seg(t, NT.n03[0], free + .8), toBucket = ease(seg(t, res - .2, res + .5));
      PX.save(); PX.globalAlpha = 1 - toBucket;
      weekBars(140, 1260, 800, 560, [5, 5, 5, 5, 5, .01, .01], grow, { ghost: t > free ? [0, 0, 0, 0, 0, 12, 12] : null });
      if (t > free) { ptext('นอนเต็มที่', 820, 640, 34, '#5A4A44', { lv: 0, weight: 700, alpha: pop(t, free, .3) }); }
      PX.restore();
      if (toBucket > 0) { PX.save(); PX.globalAlpha = toBucket;                // the sleep-debt bucket: a sliver gets paid back
        const bx = 540, by = 1380; cut(Pp([[bx - 260, by - 560], [bx + 260, by - 560], [bx + 200, by], [bx - 200, by]]), '#FBF5E8', 3, { edge: .3 });
        ptext('หนี้การนอนทั้งสัปดาห์', bx, by - 610, 40, '#3A2E2A', { lv: 0, weight: 700 });
        const fill = 70 * ease(seg(t, more, onlyOne + .4));
        cut(Pp([[bx - 200 - 60 * fill / 560, by - fill], [bx + 200 + 60 * fill / 560, by - fill], [bx + 200, by], [bx - 200, by]]), '#2E9C8E', 0, { tex: .3 });
        if (t > more) for (let i = 0; i < 4; i++) { const p = frac(t * 1.2 + i / 4); if (t < onlyOne + .6) cut(dropShape(bx + (i - 1.5) * 20, lerp(by - 700, by - fill - 10, p), 12), '#6EC6F0', 1, { alpha: 1 - p }); }
        PX.restore(); }
      // the clipboard of the lab
      cut(Pr(150, 520, 140, 170, 14), '#C9824E', 2); cut(Pr(162, 540, 116, 140, 8), '#FBF5E8', 0); for (let i = 0; i < 4; i++) strip([[176, 570 + i * 26], [262, 570 + i * 26]], '#B9AFA0', 5, 0);
    });
    layer(0, () => {
      ptext('การทดลองจริง', 540, 280, 76, '#1F3E6E', { pop: pop(t, NT.n03[0], .35), lv: 2, weight: 800 });
      ptext('นอนชดเชยได้แค่ราว 1 ชม.', 540, 390, 56, '#FFFFFF', { pop: pop(t, onlyOne, .35), card: '#2E9C8E', lv: 3, weight: 700 });
      source('ที่มา: Depner et al., Current Biology (2019)', 540, 460, pop(t, res, .35));
      chip('งานวิจัย', 'fact', 1);
    });
    SUB_Y = 1620;
    pcEnd();
  }

  // ===================== 4 · BACK TO SHORT SLEEP: insulin works worse, night snacking, weight up =====================
  function s4(t, lt, dur) {
    const end = t - lt + dur, ins = ph('n05', 1), snackT = NT.n06[0], gain = ph('n06', 1), same = ph('n06', 2);
    const night = ease(seg(t, snackT - .3, snackT + .3));
    const bg = mixCol('#F7E0A8', '#2A2F5A', night);
    pcBegin(bg); sky(mixCol('#FBEBC4', '#222850', night), bg, mixCol('#EFCF86', '#323A6E', night)); stars(t, night);
    pcCam(540, 1000, kf(t, [[NT.n05[0] - .2, 1.06], [ins, 1.0], [snackT, 1.0], [end, .97]]));
    layer(1, () => {
      if (night < 1) { PX.save(); PX.globalAlpha = 1 - night; keyLock(620, 960, 1.2, t, 1 - ease(seg(t, ins, ins + .8))); PX.restore(); }
      if (night > 0) { PX.save(); PX.globalAlpha = night;
        fridge(760, 1420, 1.0, ease(seg(t, snackT, snackT + .5)));
        person(330, 1380, .95, { legs: false, smile: .4, belly: ease(seg(t, gain, gain + .8)), arm: [0, .6], lid: .45 });
        for (let i = 0; i < 6; i++) { const k = seg(t, snackT + .3 + i * .18, snackT + 1.0 + i * .18); if (k <= 0 || k >= 1) continue;
          snack(i % 3, lerp(700, 360, ease(k)), lerp(1180, 1020, ease(k)) - 120 * Math.sin(Math.PI * k), 34, k * 5); }
        const kg = seg(t, gain, gain + .9); if (kg > 0) bathScale(330, 1500, .9, lerp(60, 61.4, ease(kg)), kg);
        PX.restore(); }
    });
    layer(0, () => {
      ptext('อินซูลินทำงานแย่ลง', 540, 290, 66, '#7A2E3A', { pop: pop(t, ins, .35), lv: 2, weight: 800, alpha: 1 - night });
      ptext('กินจุบจิบตอนดึก', 540, 290, 70, '#FFFFFF', { pop: pop(t, snackT + .1, .35), lv: 3, weight: 800 });
      ptext('น้ำหนักขึ้นพอๆ กับกลุ่มที่อดนอนตลอด', 540, 400, 44, '#FFD84D', { pop: pop(t, same, .35), lv: 2, weight: 700 });
      if (t > ins) source('ที่มา: Depner et al. (2019) · กลุ่มที่นอนชดเชยวันหยุด', 540, 480, pop(t, ins, .35));
      chip('งานวิจัย', 'fact', 1);
    });
    SUB_Y = 1690;
    pcEnd();
  }

  // ===================== 5 · THE GOOD NEWS (with limits) =====================
  function s5(t, lt, dur) {
    const end = t - lt + dur, fresh = NT.n08[0], study = ph('n08', 1), better = ph('n08', 2);
    pcBegin('#FCE3A0'); sky('#FFF0C4', '#FCE3A0', '#F7C96B');
    pcCam(540, 1000, kf(t, [[NT.n07[0] - .2, 1.1], [fresh, 1.0], [end, .98]]));
    layer(.15, () => sun(540, 720, 110 * backOut(pop(t, NT.n07[0], .6)), t));
    layer(1, () => {
      const up = ease(seg(t, fresh, fresh + .8));
      person(330, 1520, 1.0, { legs: false, smile: 1, lid: lerp(.5, 0, up), arm: [up * .9, up * .9] });
      battery(640, 1350, 320, 150, lerp(.25, .6, up), t);                        // fresher — but only partly charged
      ptext('สดชื่นขึ้นบ้าง', 800, 1130, 44, '#3A2E2A', { pop: pop(t, fresh + .3, .35), lv: 1, weight: 700 });
    });
    layer(0, () => {
      ptext('ข่าวดีก็มี', 540, 290, 96, '#3A2E2A', { pop: pop(t, NT.n07[0], .35), lv: 3, weight: 800 });
      ptext('ดีกว่าอดนอนทุกวัน', 540, 410, 62, '#FFFFFF', { pop: pop(t, better, .35), card: '#2E9C8E', lv: 3, weight: 800 });
      if (t > study) source('งานวิจัยเชิงสำรวจ: Åkerstedt et al., J Sleep Res (2018)', 540, 490, pop(t, study, .35));
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1640;
    pcEnd();
  }

  // ===================== 6 · A PATCH, NOT A NEW TYRE =====================
  function s6(t, lt, dur) {
    const end = t - lt + dur, notNew = ph('n09', 1);
    pcBegin('#D9D3E8'); sky('#E6E1F2', '#D9D3E8', '#C2BADB');
    pcCam(540, 1000, kf(t, [[NT.n09[0] - .2, 1.05], [end, 1.0]]));
    layer(1, () => {
      tire(300, 1000, 190 * backOut(pop(t, NT.n09[0], .4)), true, t);
      ptext('ปะยางรั่ว', 300, 1270, 50, '#5A3A2A', { lv: 0, weight: 800, alpha: pop(t, NT.n09[0] + .1, .3) });
      const k = pop(t, notNew, .4);
      if (k > 0) { tire(780, 1000, 190 * backOut(k), false, t); ptext('ยางใหม่', 780, 1270, 50, '#1F4E46', { lv: 0, weight: 800, alpha: k });
        ptext('≠', 540, 1000, 140, '#9A3B3B', { pop: k, lv: 2, weight: 800 }); }
    });
    layer(0, () => {
      ptext('ช่วยได้ แต่ไม่หายขาด', 540, 300, 70, '#3A2E5A', { pop: pop(t, NT.n09[0], .35), lv: 2, weight: 800 });
      chip('เปรียบเทียบ', 'study', 1);
    });
    SUB_Y = 1620;
    pcEnd();
  }

  // ===================== 7 · SLEEP ENOUGH EVERY NIGHT =====================
  function s7(t, lt, dur) {
    const end = t - lt + dur, every = ph('n10', 1), seven = ph('n10', 2);
    pcBegin('#2B3566'); sky('#222B58', '#2B3566', '#3A4580'); stars(t, 1);
    pcCam(540, 1000, kf(t, [[NT.n10[0] - .2, 1.06], [seven, 1.0], [end, .98]]));
    layer(.2, () => moon(840, 380, 60));
    layer(1, () => {
      bed(560, 1150, 1.3, t);
      zzz(470, 870, t, 1);
      const k = seg(t, every, every + 1.4);
      weekBars(140, 1720, 800, 300, [7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5], k, { need: 7, colors: Array(7).fill('#2E9C8E') });
    });
    layer(0, () => {
      ptext('นอนให้พอทุกคืน', 540, 290, 84, '#FFFFFF', { pop: pop(t, NT.n10[0], .35), lv: 3, weight: 800 });
      ptext('ผู้ใหญ่ อย่างน้อย 7 ชม.', 540, 410, 62, '#FFD84D', { pop: pop(t, seven, .35), lv: 2, weight: 700 });
      if (t > seven) source('ที่มา: AASM / Sleep Research Society (2015)', 540, 490, pop(t, seven, .35));
      chip('คำแนะนำ', 'fact', 1);
    });
    SUB_Y = 1235;
    pcEnd();
  }

  // ===================== 8 · CLOSE: a daily upkeep, not a debt to settle at once =====================
  function s8(t, lt, dur) {
    const end = t - lt + dur, notDebt = ph('n11', 1), upkeep = ph('n11', 2);
    pcBegin('#BFE8D3'); sky('#D6F2E4', '#BFE8D3', '#9FD8BE');
    pcCam(540, 1000, kf(t, [[NT.n11[0] - .2, 1.08], [upkeep, 1.0], [end, .97]]));
    layer(1, () => {
      const kx = pop(t, notDebt, .35);
      PX.save(); PX.globalAlpha = 1 - seg(t, upkeep - .2, upkeep + .3);
      piggy(540, 950, 1.0, t, kx);
      if (kx > 0) { strip([[340, 800], [740, 1100]], '#D6334A', 18, 2, { alpha: kx }); strip([[740, 800], [340, 1100]], '#D6334A', 18, 2, { alpha: kx }); }
      PX.restore();
      const ku = seg(t, upkeep, end);
      if (ku > 0) { PX.save(); PX.globalAlpha = seg(t, upkeep - .1, upkeep + .3); jarPlant(540, 1250, 1.4, ease(ku), t);
        for (let i = 0; i < 4; i++) { const k = seg(t, upkeep + .2 + i * .35, upkeep + .7 + i * .35); if (k > 0 && k < 1) coin(540, lerp(620, 920, easeIn(k)), 30, 1, k * 6); }
        PX.restore(); }
    });
    layer(0, () => {
      ptext('ไม่ใช่หนี้ที่จ่ายทีเดียว', 540, 290, 66, '#3A2E2A', { pop: pop(t, notDebt, .35), lv: 2, weight: 800 });
      ptext('แต่คือค่าบำรุงรายวัน', 540, 400, 70, '#FFFFFF', { pop: pop(t, upkeep, .35), card: '#2E9C8E', lv: 3, weight: 800 });
      const k = seg(t, NT.n11[1] + .15, NT.n11[1] + .45);
      if (k > 0) ptext('ข้อมูล: Depner 2019 · Åkerstedt 2018 · AASM/SRS 2015', 540, 1480, 26, '#3A4A44', { alpha: k, lv: 0 });
    });
    SUB_Y = 1620;
    pcEnd();
  }

  const c = k => NT[k][0] - .12;
  const wrap = fn => (t, lt, dur) => { SUB_Y = null; fn(t, lt, dur); };
  shots([[0, wrap(s1)], [c('n02'), wrap(s2)], [c('n03'), wrap(s3)], [c('n05'), wrap(s4)], [c('n07'), wrap(s5)], [c('n09'), wrap(s6)], [c('n10'), wrap(s7)], [c('n11'), wrap(s8)]]);
})();
