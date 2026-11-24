// scenes.js (sleepy): the shots of "ทำไมเราถึงรู้สึกง่วงหลังจากกินอาหาร?". Every beat is tied to the narration:
// NT[key] = [start, end] of a line, ph(key, i) = onset of its i-th phrase. See shorts/sleepy/STORYBOARD.md.
(() => {
  const pop = (t, t0, d = .35) => seg(t, t0, t0 + d);
  const out = (t, t1, d = .3) => 1 - seg(t, t1, t1 + d);
  const chip = (txt, kind, a) => { if (a <= 0) return; const col = kind === 'fact' ? '#2F5E57' : kind === 'myth' ? '#9A3B3B' : '#5B4A8A';
    layer(0, () => { cut(Pc(70, 172, 9), kind === 'fact' ? '#7BE0A6' : kind === 'myth' ? '#FF9C8A' : '#C9B8FF', 0, { tex: 0, alpha: a }); ptext(txt, 92, 172, 30, '#FFFFFF', { card: col, align: 'left', weight: 500, lv: 0, alpha: a }); }); };
  const source = (txt, x, y, a) => ptext(txt, x, y, 26, '#4A3F3A', { card: 'rgba(250,244,232,.92)', weight: 400, lv: 0, alpha: a });
  const confetti = (t, cols, n = 14, a = 1) => { for (let i = 0; i < n; i++) { const x = hash(i * 7.3) * W, y = ((hash(i * 3.1) * H + t * (30 + 20 * hash(i))) % (H + 200)) - 100, r = 8 + 10 * hash(i * 9);
    PX.save(); PX.translate(x, y); PX.rotate(t * (hash(i) - .5) * 2 + i); cut(Pr(-r, -r * .6, 2 * r, 1.2 * r, 3), cols[i % cols.length], 1, { alpha: .55 * a, sa: .15 }); PX.restore(); } };

  // ===================== 1 · HOOK: full, then instantly sleepy =====================
  function s1(t, lt, dur) {
    const sleepy = ph('n01', 1), why = ph('n01', 2), whyQ = ph('n01', 3);
    pcBegin('#F6C9A0'); sky('#FAD9B5', '#F6C9A0', '#EBA978'); confetti(t, ['#F9E0C2', '#F2B38A', '#FFE9D2'], 10);
    const z = kf(t, [[0, 1.18], [sleepy, 1.08], [why, 1.0], [dur, .97]], easeOut), sh = t > sleepy && t < sleepy + .35 ? shakeXY(t, 6 * (1 - seg(t, sleepy, sleepy + .35))) : [0, 0];
    pcCam(540 + sh[0], 1000 + sh[1], z);
    const eaten = ease(seg(t, .05, sleepy - .05)), lid = kf(t, [[sleepy - .05, 0], [sleepy + .2, .92], [why - .1, .8], [why + .25, .3], [dur, .45]]);
    const nod = kf(t, [[sleepy, 0], [sleepy + .25, .22], [why, .16], [why + .3, -.06], [dur, .02]], easeOut), bob = kf(t, [[sleepy, 0], [sleepy + .25, 40], [why + .3, 0]], easeOut);
    layer(.5, () => { cut(Pr(-200, 1250, W + 400, 900), '#C8794A', 3, { edge: .15 }); cut(Pr(-200, 1250, W + 400, 26), '#E0955F', 0); });
    layer(1, () => {
      person(540, 1390, 1.15, { lid, nod, bob, belly: eaten, mouth: t > why - .2 && t < why + .6 ? .4 : 0, smile: t < sleepy ? .9 : .3, arm: [0, kf(t, [[0, .55], [sleepy - .1, .55], [sleepy + .2, 0]])], legs: false, look: t > why ? 0 : 4 });
      plate(540, 1480, 1.05, eaten);
      zzz(700, 720, t, seg(t, sleepy + .1, sleepy + .4) * out(t, why + .1, .3));
    });
    layer(0, () => {
      ptext('อิ่มปุ๊บ', 330, 330, 108, '#FFFFFF', { pop: pop(t, .2, .35), lv: 3, weight: 800, card: '#E8892F', rot: -.05 });
      ptext('ง่วงปั๊บ', 720, 470, 108, '#3A2E2A', { pop: pop(t, sleepy - .02, .35), lv: 3, weight: 800, card: '#FFD25E', rot: .05 });
      ptext('ทำไม?', 540, 650, 130, '#FFFFFF', { pop: pop(t, whyQ - .05, .4), lv: 4, weight: 800 });
    });
    SUB_Y = 1640;
    pcEnd();
  }

  // ===================== 2 · THE MYTH: "blood leaves the brain" =====================
  function s2(t, lt, dur) {
    const T0 = NT.n02[0], truth = NT.n03[0], steady = ph('n03', 1);
    pcBegin('#7CC6C0'); sky('#9AD8D2', '#7CC6C0', '#5AAFAA');
    pcCam(540, kf(t, [[T0 - .2, 1000], [truth, 960], [dur, 940]]), kf(t, [[T0 - .2, 1.08], [truth, 1.0], [dur, .98]]));
    const myth = seg(t, ph('n02', 1), ph('n02', 2) + .4) * (1 - seg(t, steady, steady + .6)), grey = myth;
    layer(.3, () => { for (let i = 0; i < 5; i++) cut(Pc(140 + i * 210, 1700 + (i % 2) * 60, 130), '#6BB8B2', 1, { sa: .2 }); });
    layer(1, () => {
      // body silhouette, a vessel from heart level to brain and to the stomach
      cut(Pblob([[540, 520], [690, 600], [700, 820], [800, 900], [820, 1500], [260, 1500], [280, 900], [380, 820], [390, 600]]), '#F4C9A2', 3, { edge: .2 });
      brain(540, 680, 1.0, mixCol(SLP.brain, '#A9A3AE', grey));
      stomach(600, 1180, 1.1);
      const up = [[520, 1060], [500, 900], [520, 780]], down = [[520, 1060], [560, 1120], [600, 1160]];
      strip(up, '#C23A4E', 12, 1); strip(down, '#C23A4E', 12, 1);
      cut(Pblob([[470, 1020], [520, 990], [570, 1020], [560, 1080], [520, 1110], [480, 1080]]), '#D6334A', 2);   // the heart
      // the myth: drops leave the brain for the stomach; the truth: a steady flow to both
      const toBrain = lerp(1, .25, myth), toGut = lerp(1, 2.2, myth);
      for (let i = 0; i < 4; i++) { const k = frac(t * .9 * toBrain + i / 4), [x, y] = along(up, k); cut(Pc(x, y, 11), SLP.blood, 1, { alpha: Math.sin(Math.PI * k) * (1 - myth * .7) }); }
      for (let i = 0; i < 5; i++) { const k = frac(t * .9 * toGut + i / 5), [x, y] = along(down, k); cut(Pc(x, y, 11), SLP.blood, 1, { alpha: Math.sin(Math.PI * k) }); }
      if (myth > .05) { shine(600, 1180, 220, '#FF7A7A', .4 * myth); ptext('?', 650, 600, 90, '#3A2E2A', { alpha: myth, lv: 2, weight: 800 }); }
      const lock = seg(t, steady, steady + .5);
      if (lock > 0) { PX.save(); PX.globalAlpha = lock; PX.strokeStyle = '#2E8C6E'; PX.lineWidth = 10; PX.setLineDash([22, 14]); PX.lineDashOffset = -t * 40; PX.beginPath(); PX.ellipse(540, 660, 170 * backOut(lock), 130 * backOut(lock), 0, 0, TAU); PX.stroke(); PX.restore();
        shine(540, 660, 260, '#9FF0D0', .35 * lock); }
    });
    layer(0, () => {
      const km = pop(t, ph('n02', 0), .35) * out(t, truth - .05, .25);
      ptext('ความเชื่อ: เลือดไหลไปที่ท้อง', 540, 270, 50, '#FFFFFF', { pop: km, card: 'rgba(154,59,59,.92)', lv: 2, weight: 600 });
      ptext('สมองขาดเลือด → ง่วง', 540, 365, 46, '#3A2E2A', { alpha: km * seg(t, ph('n02', 2) - .1, ph('n02', 2) + .3), lv: 1, weight: 600 });
      const ks = pop(t, truth - .03, .3);
      if (ks > 0) ptext('ไม่จริง!', 540, 300, 140, '#FFFFFF', { pop: ks, card: '#D6334A', lv: 4, weight: 800, rot: -.08, alpha: out(t, steady + .1, .3) });
      const kt = pop(t, steady + .2, .4);
      ptext('สมองคุมเลือดของตัวเองให้คงที่', 540, 290, 50, '#FFFFFF', { pop: kt, card: 'rgba(46,140,110,.95)', lv: 2, weight: 600 });
      if (kt > 0) source('ที่มา: Cleveland Clinic · Sleep Foundation', 540, 370, kt);
      chip(t < truth ? 'ความเชื่อที่พบบ่อย' : 'ข้อเท็จจริง', t < truth ? 'myth' : 'fact', pop(t, T0, .3));
    });
    pcEnd();
  }

  // ===================== 3 · REST AND DIGEST: the switch, and the gut telling the brain =====================
  function s3(t, lt, dur) {
    const T0 = NT.n04[0], flip = ph('n04', 1), sig = NT.n05[0], full = ph('n05', 1);
    const mode = ease(seg(t, flip, flip + .6));
    const bg = mixCol('#F2A65A', '#A99BDB', mode);
    pcBegin(bg); sky(mixCol('#F7BE7E', '#C3B6EC', mode), bg, mixCol('#E08A3E', '#8C7CC8', mode));
    const inside = ease(seg(t, sig - .35, sig + .35));
    pcCam(540, lerp(960, 1000, inside), lerp(1.0, 1.04, inside) + .02 * Math.sin(lt * .5));
    // the switch
    if (inside < 1) layer(1, () => {
      PX.save(); PX.globalAlpha = 1 - inside; PX.translate(0, -inside * 300);
      cut(Pr(170, 760, 740, 260, 130), '#FBF5E8', 4, { edge: .3 });
      cut(Pr(210, 800, 660, 180, 90), mixCol('#F7C08A', '#CFC3F2', mode), 0, { tex: .5 });
      const kx = lerp(300, 780, mode);
      cut(Pc(kx, 890, 110), '#FFFFFF', 3, { edge: .4 }); cut(Pc(kx, 890, 80), mixCol('#E8892F', '#7B66C9', mode), 0);
      ptext(mode < .5 ? '⚡' : '☾', kx, 892, 70, '#FFFFFF', { lv: 0 });
      ptext('ตื่นตัว', 300, 1110, 54, '#3A2E2A', { lv: 0, weight: 700, alpha: 1 - mode * .6 });
      ptext('พักและย่อย', 780, 1110, 54, '#3A2E2A', { lv: 0, weight: 700, alpha: .4 + mode * .6 });
      ptext('(สู้หรือหนี)', 300, 1175, 34, '#5A4A44', { lv: 0, alpha: 1 - mode * .6 });
      ptext('(พาราซิมพาเทติก)', 780, 1175, 36, '#4A3F6A', { lv: 0, alpha: .4 + mode * .6 });
      PX.restore();
    });
    // inside: gut → brain signals
    if (inside > 0) layer(1, () => {
      PX.save(); PX.globalAlpha = inside; PX.translate(0, (1 - inside) * 300);
      cut(Pblob([[540, 300], [740, 380], [760, 700], [860, 820], [880, 1650], [200, 1650], [220, 820], [320, 700], [340, 380]]), '#F7DCC6', 3, { edge: .2 });
      brain(540, 520, 1.05);
      stomach(470, 1050, .8); gut(560, 1360, 1.15, t);
      const nerve = [[540, 600], [560, 760], [520, 920], [560, 1100], [560, 1260]];
      strip(nerve, '#F2D27A', 10, 1);
      for (let i = 0; i < 3; i++) { const k = frac((t - sig) * .6 + i / 3), [x, y] = along(nerve.slice().reverse(), k); if (t < sig) continue;
        PX.save(); PX.translate(x + 40, y); PX.rotate(-.1); cut(Pr(-38, -26, 76, 52, 6), '#FFFFFF', 2, { edge: .3 }); cut(Pp([[-38, -26], [0, 6], [38, -26]]), '#EDE6D6', 0); PX.restore(); }
      const kb = pop(t, full, .35);
      if (kb > 0) { cut(Pr(640, 330, 340, 120, 60), '#FFFFFF', 3); cut(Pp([[680, 440], [660, 500], [720, 445]]), '#FFFFFF', 0);
        ptext(t < ph('n05', 2) ? 'อิ่มแล้ว' : 'พักได้', 810, 392, 54, '#5B4A8A', { pop: kb, lv: 0, weight: 700 }); }
      PX.restore();
    });
    layer(0, () => {
      const k = pop(t, T0, .35) * out(t, sig - .3, .25);
      ptext('หลังกิน ร่างกายสลับโหมด', 540, 290, 58, '#FFFFFF', { pop: k, lv: 3, weight: 700, card: 'rgba(60,40,70,.85)' });
      const k2 = pop(t, sig + .05, .35);
      ptext('ลำไส้ส่งสัญญาณถึงสมอง', 540, 200, 50, '#FFFFFF', { pop: k2, card: 'rgba(91,74,138,.92)', lv: 2, weight: 600 });
      if (k2 > 0) source('ผ่านเส้นประสาทเวกัส และฮอร์โมนจากลำไส้', 540, 270, k2);
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    pcEnd();
  }

  // ===================== 4 · OREXIN: sugar quiets the wake cells =====================
  function s4(t, lt, dur) {
    const T0 = NT.n06[0], press = ph('n06', 1), name = ph('n06', 3);
    pcBegin('#2B2650'); sky('#221E44', '#2B2650', '#3A3468');
    pcCam(540, kf(t, [[T0 - .2, 1020], [name, 980], [dur, 960]]), kf(t, [[T0 - .2, 1.12], [name, 1.0], [dur, .97]]));
    layer(.3, () => brain(540, 960, 4.2, '#3E3770', { lv: 1, alpha: .8 }));
    const cells = [[330, 800], [540, 720], [750, 800], [270, 1010], [480, 980], [690, 1000], [820, 1150], [410, 1190], [610, 1210]];
    const dim = i => (i % 3 === 1 ? .15 : 1) * seg(t, press + .1 + i * .1, press + .6 + i * .1);   // some cells dim, not all: "อาจ"
    layer(1, () => {
      cells.forEach(([x, y], i) => wakeCell(x, y + Math.sin(t * 1.6 + i) * 6, 52, 1 - .85 * dim(i), t));
      for (let i = 0; i < 6; i++) { const k = seg(t, T0 + .1 + i * .18, T0 + 1.1 + i * .18); if (k <= 0) continue;
        const x = 200 + (i * 137) % 680, y = lerp(380, 700 + (i % 3) * 140, easeOut(k)); sugarCube(x, y, 30, k * 3 + i, 1); }
    });
    layer(0, () => {
      ptext('น้ำตาลในเลือดสูงขึ้น', 540, 280, 58, '#FFFFFF', { pop: pop(t, T0 + .05, .35), lv: 3, weight: 700 });
      const k = pop(t, name, .4);
      ptext('ออเร็กซิน', 540, 1375, 92, '#FFD84D', { pop: k, lv: 3, weight: 800, card: 'rgba(30,26,60,.9)' });
      ptext('เซลล์ที่ช่วยให้เราตื่นตัว', 540, 1470, 42, '#FFFFFF', { alpha: k, lv: 2 });
      if (k > 0) source('งานวิจัยในเซลล์สัตว์ทดลอง: Burdakov et al., Neuron (2006)', 540, 360, k);
    });
    SUB_Y = 1610;
    chip('งานวิจัย (ยังศึกษาอยู่)', 'study', 1);
    pcEnd();
  }

  // ===================== 5 · MEAL SIZE: the bigger, the sleepier =====================
  function s5(t, lt, dur) {
    const T0 = NT.n07[0], carb = ph('n07', 1), fat = ph('n07', 2), more = ph('n07', 3);
    pcBegin('#F7E2B5'); sky('#FBEBC8', '#F7E2B5', '#EBC98A');
    pcCam(kf(t, [[T0 - .2, 540], [more, 600]]), 1000, kf(t, [[T0 - .2, 1.06], [more + .4, 1.0]]));
    const grow = easeOut(seg(t, T0, carb + .3));
    layer(.4, () => { cut(Pr(-200, 1380, W + 400, 800), '#D9A36A', 2); });
    layer(1, () => {
      balancedPlate(260, 1330, .8, 1); bigMeal(740, 1340, lerp(.55, 1.0, grow), 1);
      gauge(260, 960, 130, .2 + .05 * Math.sin(t * 2), 'มื้อพอดี');
      gauge(740, 960, 150, lerp(.25, .95, ease(seg(t, carb, more + .4))) + .02 * Math.sin(t * 9), 'มื้อใหญ่');
      if (t > more) zzz(880, 760, t, seg(t, more, more + .3));
    });
    layer(0, () => {
      ptext('ยิ่งมื้อใหญ่', 540, 300, 84, '#3A2E2A', { pop: pop(t, T0, .35), lv: 3, weight: 800 });
      ptext('แป้งเยอะ', 330, 430, 58, '#FFFFFF', { pop: pop(t, carb, .3), card: '#D98A3A', lv: 2, weight: 700, rot: -.04 });
      ptext('มันเยอะ', 750, 430, 58, '#FFFFFF', { pop: pop(t, fat, .3), card: '#C0603A', lv: 2, weight: 700, rot: .04 });
      ptext('ยิ่งง่วงหนัก', 540, 1560, 76, '#FFFFFF', { pop: pop(t, more, .35), card: '#7B66C9', lv: 3, weight: 800 });
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1660;
    pcEnd();
  }

  // ===================== 6 · TWIST: sleepy in the afternoon even without lunch =====================
  function s6(t, lt, dur) {
    const T0 = NT.n08[0], noLunch = ph('n08', 1), still = ph('n08', 2), clock = NT.n09[0], dip = ph('n09', 1);
    const gold = seg(t, T0, still);
    pcBegin('#F4B860'); sky(mixCol('#BFE6F2', '#F7C978', gold), mixCol('#9ED3E6', '#F4B860', gold), mixCol('#7FC3DC', '#E89A48', gold));
    const graph = ease(seg(t, clock - .2, clock + .5));
    pcCam(540, lerp(960, 1000, graph), lerp(1.06, 1.0, graph));
    if (graph < 1) layer(1, () => {
      PX.save(); PX.globalAlpha = 1 - graph;
      const h = kf(t, [[T0, 8], [still, 14.2]], ease);
      clockFace(540, 760, 230, h);
      const k = pop(t, noLunch - .05, .35);
      if (k > 0) { plate(540, 1290, .9 * backOut(k), 1, { egg: false }); PX.save(); PX.globalAlpha = (1 - graph) * k; strip([[380, 1160], [700, 1400]], '#D6334A', 22, 2); strip([[700, 1160], [380, 1400]], '#D6334A', 22, 2); PX.restore(); }
      PX.restore();
    });
    if (graph > 0) layer(1, () => {
      PX.save(); PX.globalAlpha = graph;
      cut(Pr(80, 560, 920, 900, 30), '#FBF5E8', 3, { edge: .3 });
      const X = hh => lerp(160, 920, (hh - 7) / 16), Y = v => lerp(1300, 700, v), alert = hh => clamp(.55 + .3 * Math.sin((hh - 9) / 14 * Math.PI) - .28 * Math.exp(-Math.pow((hh - 14.5) / 1.5, 2)) - (hh > 21 ? (hh - 21) * .18 : 0));
      cut(Pr(X(13), 640, X(16) - X(13), 680, 10), 'rgba(123,102,201,.22)', 0, { tex: .3 });
      const draw = ease(seg(t, clock, dip + .6)), P = []; for (let hh = 7; hh <= 7 + 16 * draw; hh += .25) P.push([X(hh), Y(alert(hh))]);
      if (P.length > 1) strip(P, '#E0614A', 12, 2);
      for (const [hh, lab] of [[8, '8 น.'], [12, '12 น.'], [16, '16 น.'], [20, '20 น.']]) ptext(lab, X(hh), 1360, 30, '#5A4A44', { lv: 0 });
      ptext('ความตื่นตัว', 260, 610, 34, '#5A4A44', { lv: 0, weight: 600 });
      const kd = pop(t, dip, .4);
      if (kd > 0) { ptext('ช่วงบ่าย', X(14.5), 760, 46, '#5B4A8A', { pop: kd, lv: 1, weight: 700 }); person(X(14.5), Y(alert(14.5)) - 10 + 160 * .32, .32, { lid: .75, legs: false, nod: .15, smile: .2 }); zzz(X(14.5) + 40, Y(alert(14.5)) - 140, t, kd, .7); }
      PX.restore();
    });
    layer(0, () => {
      ptext('จุดหักมุม', 540, 230, 44, '#FFFFFF', { pop: pop(t, T0, .3), card: 'rgba(90,60,30,.85)', lv: 2, weight: 600 });
      ptext('ไม่กินข้าว ก็ยังง่วง!', 540, 330, 70, '#3A2E2A', { pop: pop(t, still, .35), lv: 3, weight: 800, alpha: out(t, clock - .3, .25) });
      const kc = pop(t, clock + .1, .35);
      ptext('นาฬิกาชีวิต', 540, 330, 80, '#3A2E2A', { pop: kc, lv: 3, weight: 800 });
      if (kc > 0) source('ที่มา: Monk (2005) · post-lunch dip', 540, 420, kc);
      chip('ข้อเท็จจริง', 'fact', 1);
    });
    SUB_Y = 1620;
    pcEnd();
  }

  // ===================== 7 · TIPS =====================
  function s7(t, lt, dur) {
    const T0 = NT.n10[0], just = ph('n10', 1), prot = ph('n10', 2), walk = ph('n10', 3);
    pcBegin(CLN.sky1); sky('#D6F0EA', '#A6DCE6', '#86CDE0');
    const walking = ease(seg(t, walk - .2, walk + .4));
    pcCam(lerp(540, 600, walking), 1000, lerp(1.04, 1.0, walking));
    layer(.15, () => { sun(820, 420, 80, t); for (let i = 0; i < 3; i++) cloud(((i * 420 + t * 26) % 1500) - 200, 520 + i * 70, .9, '#FFFFFF', 2); });
    layer(.4, () => { cut(hills(1260, 40, .005, 3), CLN.hill1, 1); for (let i = 0; i < 7; i++) tree(-60 + ((i * 190 - t * 60 * walking) % 1400 + 1400) % 1400, 1290, .9, i % 2 ? CLN.hill3 : CLN.hill4); });
    layer(1, () => {
      cut(Pr(-200, 1400, W + 400, 800), CLN.hill2, 3);
      cut(Pr(-200, 1480, W + 400, 70), '#E9DFC8', 1);
      if (walking < 1) { PX.save(); PX.globalAlpha = 1 - walking; balancedPlate(540, 1080, 1.7, seg(t, prot - .3, prot + .6)); PX.restore(); }
      if (walking > 0) person(lerp(320, 560, walking), 1470, 1.0, { walk: walking > .02 ? t * 7 : null, lid: 0, smile: .9, look: 4 });
    });
    layer(0, () => {
      ptext('อยากตาสว่าง?', 540, 260, 76, '#1F4E46', { pop: pop(t, T0, .35), lv: 3, weight: 800 });
      const tips = [['กินพอดี', just], ['เพิ่มโปรตีน + ผัก', prot], ['เดินสั้นๆ หลังมื้อ', walk]];
      tips.forEach(([txt, t0], i) => { const k = pop(t, t0, .35); if (k <= 0) return;
        cut(Pc(200, 380 + i * 92, 28 * backOut(k)), '#2E9C8E', 2); ptext('✓', 200, 382 + i * 92, 38, '#FFFFFF', { pop: k, lv: 0, weight: 800 });
        ptext(txt, 250, 380 + i * 92, 50, '#1F4E46', { pop: k, align: 'left', lv: 1, weight: 700 }); });
    });
    pcEnd();
  }

  // ===================== 8 · CLOSE =====================
  function s8(t, lt, dur) {
    const T0 = NT.n11[0], lazy = ph('n11', 1), work = ph('n11', 2);
    pcBegin('#FFD9A8'); sky('#FFE6C2', '#FFD9A8', '#F7B98A'); confetti(t, ['#FFFFFF', '#F7C978', '#F29C8C', '#BFE8D3'], 18, seg(t, work, work + .5));
    pcCam(540, 1000, kf(t, [[T0 - .2, 1.1], [work, 1.0], [DUR, .97]]));
    layer(1, () => {
      const stretch = ease(seg(t, work - .1, work + .5));
      person(540, 1440, 1.05, { arm: [stretch, stretch], lid: lerp(.5, 0, stretch), mouth: t > T0 + .2 && t < lazy ? .9 : 0, smile: 1, legs: false, belly: .5 });
      // gears turning in the belly: the body at work
      if (stretch > 0) for (const [gx, gy, r, dir] of [[500, 1230, 36, 1], [565, 1275, 26, -1]]) {
        PX.save(); PX.translate(gx, gy); PX.rotate(t * 2 * dir); PX.globalAlpha = stretch;
        cut(Pp(Array.from({ length: 16 }, (_, i) => { const a = i / 16 * TAU, q = i % 2 ? r : r * 1.3; return [Math.cos(a) * q, Math.sin(a) * q]; })), '#FFD84D', 2); cut(Pc(0, 0, r * .4), '#E8892F', 0); PX.restore(); }
    });
    layer(0, () => {
      ptext('ง่วงหลังกิน', 540, 270, 92, '#3A2E2A', { pop: pop(t, T0, .35), lv: 3, weight: 800 });
      ptext('≠ ขี้เกียจ', 540, 400, 100, '#FFFFFF', { pop: pop(t, lazy, .35), card: '#D6334A', lv: 3, weight: 800, rot: -.05 });
      ptext('ร่างกายกำลังทำงาน', 540, 545, 66, '#1F4E46', { pop: pop(t, work, .35), lv: 2, weight: 700 });
      SUB_Y = 1660;
      const k = seg(t, NT.n11[1] + .2, NT.n11[1] + .5);
      if (k > 0) { ptext('ถ้าง่วงผิดปกติบ่อยๆ ควรปรึกษาแพทย์', 540, 660, 34, '#3A2E2A', { alpha: k, lv: 0, card: 'rgba(255,248,236,.9)' });
        ptext('ข้อมูล: Cleveland Clinic · Sleep Foundation · Monk 2005 · Burdakov 2006', 540, 725, 24, '#5A4A44', { alpha: k, lv: 0 }); }
    });
    pcEnd();
  }

  const c = k => NT[k][0] - .12;
  const wrap = fn => (t, lt, dur) => { SUB_Y = null; fn(t, lt, dur); };
  shots([[0, wrap(s1)], [c('n02'), wrap(s2)], [c('n04'), wrap(s3)], [c('n06'), wrap(s4)], [c('n07'), wrap(s5)], [c('n08'), wrap(s6)], [c('n10'), wrap(s7)], [c('n11'), wrap(s8)]]);
})();
