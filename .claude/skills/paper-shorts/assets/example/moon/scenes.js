// scenes.js: the seven scenes. Each is fn(t) painting the whole frame; times come from the narration (TL).
// (LN, ph, wordAt, label, wsc, pin come from the kit's src/ui.js)
// a word's time inside a phrase, by its position in the text (Thai TTS speaks at a near-even rate)

// ---------- S1 / S7: the night hill ----------
const MOON1 = [0, -480], MOON_PAR = .85;
function camOnMoon(z) { return [MOON1[0] / MOON_PAR, MOON1[1] / MOON_PAR, z]; }
function nightScene(t, o) {
  setCam(...o.cam);
  layer(.15, () => { nightSky(t); });
  layer(.35, () => { stars(t, 70, [-800, -1300, 1600, 1500], 1); cloud(-420 + 18 * t, -150, 1.3, '#4A4A92', 3, .9); cloud(380 + 12 * t, -40, 1, '#55509C', 7, .8); });
  layer(MOON_PAR, () => {
    glow(MOON1[0], MOON1[1], 520, '#FFF1C9', .42);
    at(MOON1[0], MOON1[1], 1, o.moonRot || 0, () => moonSphere(230, { L0: o.L0 || 0, rabbit: o.rabbit || 0, z: 2.6 }));
    if (o.back) o.back();
  });
  layer(.6, () => { cloud(330 + 10 * t, -60, .8, '#6E66B0', 11, .75); });
  const HY = -230;   // the land sits high enough that the child stays clear of the subtitles
  layer(.9, () => { hills(t, [[430 + HY, 90, C.hill0, 1, 2]]); tree(-420, 395 + HY, .9, '#172B49'); tree(-350, 405 + HY, .7, '#172B49'); tree(430, 390 + HY, .8, '#172B49'); });
  layer(1, () => { hills(t, [[560 + HY, 110, C.hill1, 3, 2.4]]); house(300, 500 + HY, 1, 1); tree(170, 515 + HY, .8, '#163C4A'); tree(450, 540 + HY, .6, '#163C4A'); });
  layer(1.15, () => {
    hills(t, [[520 + HY, 90, C.hill2, 5, 3]]);
    at(-190, 432 + HY, 1.45, 0, () => child(o.pose, t));
    hills(t, [[900 + HY, 70, C.hill3, 8, 3.4]]);
    for (let i = 0; i < 9; i++) { const x = -520 + i * 130, h = 40 + 30 * hash(i * 3.3), y = 900 + HY + 30; cut(poly([[x, y], [x + 16, y - h], [x + 34, y]]), '#0E2E30', { z: 1 }); }
  });
}
function S1(t) {
  const [a, b] = ph('L1', 1), rab = wordAt('L1', 0, 'กระต่าย');
  // the moon "tries" to turn its back to us and springs straight back
  const tryT = b - .9, L0 = 26 * Math.sin(Math.PI * seg(t, a + .25, tryT)) * (t < tryT ? 1 : 0) + 10 * spring(t, tryT, 5, 14);
  nightScene(t, {
    cam: kf(t, [[0, camOnMoon(2.25)], [2.45, [0, -120, 1]], [3.9, [0, -150, 1.03]], [4.6, camOnMoon(3.2)]], ease5),
    rabbit: kf(t, [[rab - .1, 0], [rab + .35, .95], [rab + 1.1, .55], [a + .4, .4], [4.4, .3]]),
    L0, pose: { sit: true },
    back: () => {
      // "the back side?": a question mark and a label pop up beside the moon
      const k = seg(t, a + .15, a + .55), out = seg(t, 4.1, 4.4);
      if (k > 0 && out < 1) {
        at(MOON1[0] + 280, MOON1[1] - 120, (1 - out) * (.8 + .06 * Math.sin(t * 6)), .18 + .08 * Math.sin(t * 3), () => qmark(1.4 * backOut(k, 2.4), C.gold));
        txt('ด้านหลัง ?', MOON1[0], MOON1[1] + 330, 84, C.cream, { pop: seg(t, a + .35, a + .75) * (1 - seg(t, 3.85, 4.05)), back: C.red, z: 1.5, rot: -.03 });
      }
    }
  });
}
function S7(t) {
  const [a] = ph('L9', 2);
  nightScene(t, {
    cam: kf(t, [[32.8, camOnMoon(2.6)], [34.3, [0, -120, 1]], [37.9, [0, -160, 1.06]], [TL.duration, camOnMoon(2.25)]], ease5),
    rabbit: kf(t, [[a, 0], [a + .6, .9], [a + 1.6, .6], [38.4, .5], [39.5, 0]]),
    pose: { sit: false, wave: seg(t, 33.9, 34.3) * (1 - seg(t, 36.9, 37.3)) },
  });
}

// ---------- S2: the moon spins ----------
function S2(t) {
  const t0 = 4.45, [a, b] = ph('L2', 0), lt = t - t0;
  setCam(...kf(t, [[t0, [0, -150, 2]], [5.4, [0, -150, 1.02]], [7.0, [0, -170, 1]]], ease5));
  layer(.2, () => space(t));
  layer(.4, () => stars(t, 80, [-900, -1500, 1800, 2400], 4));
  // a full turn as he says it: the rabbit side slides away, the cratered far side passes, the rabbit comes back
  const spin = 360 * ease(seg(t, a + .1, b + .1)), shrink = ease5(seg(t, 7.0, 7.45));
  const R = lerp(330, 80, shrink), y = lerp(-150, -390, shrink);
  layer(1, () => {
    glow(0, y, R * 1.8, '#C9D6FF', .3);
    at(0, y, 1, 0, () => moonSphere(R, { L0: spin, z: 2.6 }));
    const k = seg(t, a + .05, a + .45) * (1 - shrink);
    if (k > 0) at(0, y, backOut(k, 2), lt * 1.6, () => { arcArrow(R + 70, -2.7, -.5, 34, C.gold); arcArrow(R + 70, .44, 2.64, 34, C.gold); });
  });
  layer(0, () => txt('หมุนรอบตัวเอง', 0, -640, 96, C.ink, { pop: seg(t, a + .2, a + .6) * (1 - seg(t, 6.95, 7.25)), back: C.gold, z: 1.6, rot: -.025 }));
}

// ---------- S3: one spin = one orbit ----------
const EARTH3 = [0, 0], ORB = 300;
const orbAng = t => -Math.PI / 2 + TAU * (t - 7.45) / 7.2;
function dial(x, y, label, val, ang, kind, pop) {
  if (pop <= 0) return;
  at(x, y, backOut(pop, 2), 0, () => {
    cut(circ(0, 0, 118, 90 + x), C.cream, { z: 2 });
    cut(circ(0, 0, 100, 91 + x), '#E8DDC6', { z: .3, rim: false });
    if (kind === 'spin') { at(0, 0, 1, ang, () => moonTop(52, 0, { z: 1.2 })); }
    else { at(0, 0, 1, 0, () => earth(30, ang * 30, { atmo: 0, z: 1 })); cut(circ(0, 0, 74, 95), 'rgba(0,0,0,0)', { z: 0, grain: 0 }); at(Math.cos(ang) * 74, Math.sin(ang) * 74, 1, ang + Math.PI, () => moonTop(20, 0, { z: .8 })); }
    txt(label, 0, 160, 42, C.ink, { weight: 700, back: C.cream, z: 1 });
    txt(val, 0, 232, 54, C.cream, { back: C.teal, z: 1.2, pop: clamp(pop * 1.4 - .3) });
  });
}
function S3(t) {
  const [a1] = ph('L3', 1), [a2] = ph('L3', 2), [a4, b4] = ph('L4', 0);
  setCam(...kf(t, [[7.45, [0, -60, 1]], [12.3, [0, -40, 1.04]], [14.8, [0, -20, 1.1]]], ease));
  layer(.2, () => space(t, '#10163E', '#1D2B5E', ['#24396E', '#1E4E6E', '#3B2E6E']));
  layer(.4, () => stars(t, 80, [-900, -1500, 1800, 2400], 4));
  const th = orbAng(t), mx = EARTH3[0] + Math.cos(th) * ORB, my = EARTH3[1] + Math.sin(th) * ORB, open = ease5(seg(t, 7.5, 8.2));
  layer(1, () => {
    // the dashed orbit, unrolling
    for (let i = 0; i < 40; i++) { const a0 = -Math.PI / 2 + i / 40 * TAU; if (i / 40 > open) break; cut(strip(arcPts(EARTH3[0], EARTH3[1], ORB, a0, a0 + TAU / 40 * .55, 4), 9), rgba('#C9D6FF', .8), { z: .8, rim: false }); }
    at(EARTH3[0], EARTH3[1], backOut(seg(t, 7.5, 8.1), 1.6), 0, () => earth(140, t * 40));
    // L4: the line of sight from Earth always lands on the same face
    const s = seg(t, a4 - .1, a4 + .4);
    if (s > 0) {
      const ex = EARTH3[0] + Math.cos(th) * 150, ey = EARTH3[1] + Math.sin(th) * 150, ux = EARTH3[0] + Math.cos(th) * lerp(150, ORB - 70, s), uy = EARTH3[1] + Math.sin(th) * lerp(150, ORB - 70, s);
      cut(strip([[ex, ey], [ux, uy]], 12, 26), rgba(C.gold, .75), { z: .6, rim: false });
      at(ex, ey, 1, th, () => { cut(ell(0, 0, 26, 15, 0, 3), C.cream, { z: 1 }); cut(circ(4, 0, 8, 4), C.ink, { z: 0, rim: false }); });
      glow(mx - Math.cos(th) * 50, my - Math.sin(th) * 50, 120, '#FFE08A', .45 * s);
    }
    // the moon: its face (the rabbit sticker) always points at Earth, so it turns once per orbit
    at(mx, my, 1, 0, () => moonTop(80, th + Math.PI, { markCol: C.gold }));
  });
  layer(0, () => {
    const sp = seg(t, a1, a1 + .5), ob = seg(t, a2, a2 + .5), eq = seg(t, a2 + .9, a2 + 1.3);
    dial(-245, -640, 'หมุนรอบตัวเอง', '27.3 วัน', th + Math.PI, 'spin', sp);
    dial(245, -640, 'โคจรรอบโลก', '27.3 วัน', th, 'orbit', ob);
    txt('=', 0, -640, 150, C.gold, { pop: eq, z: 1.5 });
    txt('ความลับคือ…', 0, -660, 92, C.ink, { pop: seg(t, 7.6, 7.95) * (1 - seg(t, a1 - .2, a1)), back: C.cream, z: 1.6, rot: -.03 });
  });
}

// ---------- S4: how the lock happened ----------
const W4 = 10, BRK = ph('L5', 2)[0] + .1, BRK_D = 4.0, MOON4 = [0, -330];
function face4(t) {
  // fast spin, then a steady deceleration (continuous speed) that stops with the face toward Earth (+y = down)
  const rem = t < BRK ? W4 * (BRK - t) + W4 * BRK_D / 2 : t < BRK + BRK_D ? W4 * Math.pow(BRK + BRK_D - t, 2) / (2 * BRK_D) : 0;
  return Math.PI / 2 - rem + .06 * spring(t, BRK + BRK_D, 5, 22);
}
function S4(t) {
  const [a0] = ph('L5', 0), [a1, b1] = ph('L5', 1), [a2, b2] = ph('L5', 2), [a6] = ph('L6', 0), [a8] = ph('L6', 2);
  const lockT = BRK + BRK_D, stamp = a8 + .05;
  const sh = t > stamp ? 14 * Math.exp(-8 * (t - stamp)) : 0;
  setCam(...kf(t, [[14.8, [0, -60, 1.12]], [16.5, [0, -40, 1]], [lockT, [0, -80, 1.05]], [24.9, [0, -110, 1.1]]], ease), 0);
  CAM.x += sh * Math.sin(t * 90); CAM.y += sh * Math.cos(t * 77);
  const hot = 1 - ease(seg(t, 18.4, 22.8)), speed = t < BRK ? 1 : t < lockT ? (lockT - t) / BRK_D : 0;
  SHADOW_RGB = '30,8,20';
  layer(.2, () => space(t, mix('#2B1238', '#141A44', 1 - hot), mix('#6A2A3A', '#2A2A5E', 1 - hot), [mix('#7A2E48', '#3B2E7A', 1 - hot), mix('#9A4A2E', '#1F4B78', 1 - hot), '#5A2E6E']));
  layer(.4, () => stars(t, 60, [-900, -1500, 1800, 2400], 9));
  layer(1, () => {
    at(0, 1060, 1, 0, () => earth(640, t * 8, { sea: mix('#3A5C8C', C.sea, 1 - hot), land: mix('#8C6A44', C.land, 1 - hot), atmo: .35 }));
    const f = face4(t), eg = ease(seg(t, a2 + .1, a2 + .9)) * .9;
    // Earth's pull on the bulge: arrows from Earth toward the moon
    const g = seg(t, a2, a2 + .4) * (1 - seg(t, lockT + .3, lockT + .8));
    if (g > 0) for (let i = -1; i <= 1; i++) {
      const x = i * 120, y0 = 380, y1 = lerp(380, -40 + Math.abs(i) * 30, g), wob = 10 * Math.sin(t * 9 + i);
      cut(strip([[x * 1.3, y0], [x + wob, (y0 + y1) / 2], [x * .6, y1]], 26, 10), rgba(C.teal, .9), { z: 1.2 });
      cut(poly([[x * .6 - 30, y1 + 10], [x * .6, y1 - 40], [x * .6 + 30, y1 + 10]]), C.teal, { z: 1.2 });
    }
    // speed streaks while it spins fast
    if (speed > .15) at(MOON4[0], MOON4[1], 1, f * .5, () => { for (let i = 0; i < 3; i++) cut(strip(arcPts(0, 0, 260 + i * 24, i * 2.1, i * 2.1 + 1.3 * speed, 14), 6, 1), rgba('#FFD9A8', .55 * speed), { z: .4, rim: false }); });
    // the bulge is dragged ahead by the spin, and Earth's pull on it brakes the spin
    const bulge = Math.PI / 2 + .55 * speed * (t > a2 ? 1 : 0);
    at(MOON4[0], MOON4[1], 1, 0, () => moonTop(210, f, { hot, egg: eg, bulge, z: 2.6 }));
    // the lock: a padlock closes on the Earth–Moon line
    const pk = seg(t, a6 + .3, a6 + .7);
    if (pk > 0) {
      for (let i = 0; i < 7; i++) cut(circ(0, -80 + i * 62, 7, 200 + i), rgba(C.gold, .9 * pk), { z: .6, rim: false });
      at(0, 120, backOut(pk, 2), .1 * spring(t, a6 + .9, 6, 20), () => padlock(1.15, ease(seg(t, a6 + .75, a6 + .95))));
    }
  });
  layer(0, () => {
    txt('หลายพันล้านปีก่อน', 0, -650, 84, C.cream, { pop: seg(t, a0, a0 + .35) * (1 - seg(t, a1 - .1, a1 + .1)), back: '#8A3B5C', z: 1.6, rot: -.03 });
    txt('หมุนเร็วมาก!', 0, -650, 104, C.ink, { pop: seg(t, a1 + .05, a1 + .4) * (1 - seg(t, a2 - .1, a2 + .1)), back: C.hotLt, z: 1.6, rot: .03 + .02 * Math.sin(t * 40) });
    txt('แรงโน้มถ่วงโลก', 0, -650, 90, C.ink, { pop: seg(t, a2 + .1, a2 + .45) * (1 - seg(t, b2 - .3, b2)), back: C.teal, z: 1.6, rot: -.02 });
    if (t > a2 + 1.2 && t < b2 + .1) txt('เบรก!', 300, -480, 80, C.cream, { pop: seg(t, wordAt('L5', 2, 'เบรก'), wordAt('L5', 2, 'เบรก') + .3), back: C.red, z: 1.4, rot: .12 });
    const sk = seg(t, stamp, stamp + .25);
    if (sk > 0) {
      X.save(); X.translate(0, -650); X.scale(lerp(1.7, 1, easeOut(sk)), lerp(1.7, 1, easeOut(sk))); X.globalAlpha = sk;
      txt('การล็อกแบบไทดัล', 0, 0, 92, C.cream, { back: C.red, z: 2, rot: -.04 });
      txt('TIDAL LOCKING', 0, 115, 52, C.ink, { back: C.gold, z: 1.4, rot: -.04, weight: 700 });
      X.restore();
    }
  });
  SHADOW_RGB = '18,10,34';
}

// ---------- S5: the far side is not dark ----------
function S5(t) {
  const [a0, b0] = ph('L7', 0), [a1, b1] = ph('L7', 1);
  setCam(...kf(t, [[24.85, [0, -120, 1.12]], [28.6, [0, -120, 1]]], ease));
  const sunK = ease5(seg(t, a1 - .1, a1 + 1.3)), phase = lerp(160, 12, sunK), sx = lerp(-950, -360, sunK), sy = lerp(-300, -500, sunK);
  layer(.2, () => space(t, mix('#0B0E26', '#1B2A63', sunK), mix('#1A1640', '#3A3C7E', sunK), ['#1D2050', '#24305E', '#2E2656']));
  layer(.4, () => stars(t, 70, [-900, -1500, 1800, 2400], 12));
  layer(.7, () => {
    glow(sx, sy, 700, '#FFD36B', .9 * sunK + .1);
    at(sx, sy, 1, t * .3, () => { for (let i = 0; i < 12; i++) at(0, 0, 1, i * TAU / 12, () => cut(poly([[150, -26], [250, 0], [150, 26]]), C.sunLt, { z: 1, grain: .5 })); });
    cut(circ(sx, sy, 160, 5), C.sun, { z: 2.4 }); cut(circ(sx - 18, sy - 18, 120, 6), C.sunLt, { z: .6, rim: false });
  });
  layer(1, () => {
    // light beams from the sun onto the far side
    if (sunK > .05) for (let i = 0; i < 3; i++) cut(strip([[sx + 120, sy + 90 + i * 60], [-170, -220 + i * 120]], 30, 70), rgba('#FFE7A0', .22 * sunK), { z: 0, rim: false, grain: 0 });
    at(0, -120, 1, 0, () => moonSphere(300, { L0: 180 + 6 * Math.sin(t * .8), phase, sunSide: -1, nightA: .86, z: 2.8 }));
    const k = seg(t, a0 + .1, a0 + .45), x = seg(t, wordAt('L7', 0, 'ไม่ได้') + .05, wordAt('L7', 0, 'ไม่ได้') + .3);
  });
  layer(0, () => {
    const k = seg(t, a0 + .1, a0 + .45), x = seg(t, wordAt('L7', 0, 'ไม่ได้') + .05, wordAt('L7', 0, 'ไม่ได้') + .3);
    txt('ด้านมืด ?', 60, -700, 92, C.cream, { pop: k * (1 - seg(t, a1 + .2, a1 + .5)), back: '#2B2654', z: 1.6, rot: -.03 });
    if (x > 0 && t < a1 + .5) { const al = 1 - seg(t, a1 + .2, a1 + .5); at(60, -700, 1, -.12, () => cut(rrect(-210 * easeOut(x), -12, 420 * easeOut(x), 24, 10), C.red, { z: 1.4, alpha: al })); }
    txt('ได้แสงเท่ากัน!', 60, -700, 92, C.ink, { pop: seg(t, a1 + .9, a1 + 1.3), back: C.sunLt, z: 1.6, rot: .03 });
  });
}

// ---------- S6: the wobble shows us 59 % ----------
function S6(t) {
  const [a0] = ph('L8', 0), [a1, b1] = ph('L8', 1);
  setCam(...kf(t, [[28.4, [0, -160, 1.05]], [32.4, [0, -160, 1]], [33.15, [0, -160, 1.75]]], ease5));
  layer(.2, () => space(t, '#0E2033', '#1C4558', ['#1E4E6E', '#24605E', '#2E3E6E']));
  layer(.4, () => stars(t, 70, [-900, -1500, 1800, 2400], 15));
  const wob = ease(seg(t, a0 + .3, a0 + 1)), L0 = 7.9 * wob * Math.sin(TAU * (t - 28.4) / 1.7), B0 = 6.7 * wob * Math.sin(TAU * (t - 28.4) / 2.3 + 1);
  const pct = kf(t, [[a1 + .1, 50], [a1 + 1.4, 59]], easeOut), ring = seg(t, a0 + .1, a0 + .6), out = seg(t, 32.5, 32.9);
  layer(1, () => {
    glow(0, -160, 560, '#E9F2FF', .3);
    // the share of the surface we get to see, as a paper ring that fills
    if (ring > 0) {
      cut(strip(arcPts(0, -160, 372, -Math.PI / 2, -Math.PI / 2 + TAU * .999, 90), 22), rgba('#0C1A2A', .55 * (1 - out)), { z: .3, rim: false });
      cut(strip(arcPts(0, -160, 372, -Math.PI / 2, -Math.PI / 2 + TAU * pct / 100 * ease(ring), 90), 30), C.gold, { z: 1.4, alpha: 1 - out });
    }
    at(0, -160, 1, 0, () => moonSphere(300, { L0, B0, rabbit: .2 + .2 * Math.sin(t * 2) ** 2, z: 2.8 }));
    // little arrows on each side rocking with the wobble
    const k = wob * (1 - out);
    if (k > 0) [-1, 1].forEach(s => at(s * 430, -160, k, 0, () => cut(poly([[s * 10 + s * 12 * Math.sin(TAU * (t - 28.4) / 1.7), -40], [s * 52 + s * 12 * Math.sin(TAU * (t - 28.4) / 1.7), 0], [s * 10 + s * 12 * Math.sin(TAU * (t - 28.4) / 1.7), 40]]), C.teal, { z: 1.2 })));
  });
  layer(0, () => {
    txt('ส่ายไปมา', 0, -680, 92, C.ink, { pop: seg(t, a0 + .5, a0 + .9) * (1 - seg(t, a1 - .15, a1 + .05)), back: C.teal, z: 1.6, rot: -.03 });
    txt(Math.round(pct) + '%', 0, -690, 190, pct > 58.5 ? C.gold : C.cream, { pop: seg(t, a1 + .0, a1 + .35) * (1 - out), z: 2, edge: C.ink, sa: .6 });
  });
}

// scene list: [start, fn]. Transitions in main.js.
const SCENES = [[0, S1], [4.45, S2], [7.45, S3], [14.8, S4], [24.85, S5], [28.45, S6], [32.85, S7]];
