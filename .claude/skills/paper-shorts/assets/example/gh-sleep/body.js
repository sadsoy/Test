// body.js: the sleeper, the head in profile with a midsagittal brain, the bedroom, the clock, EEG, blood, the graph.
// The head faces LEFT (face toward -x), local units, about 900 tall; (0, 0) sits near the ear.
const B = {
  wall0: '#1B2150', wall1: '#252C66', wall2: '#30387A', night: '#141836', sheet: '#E9E2F4', blanket: '#5B6FC2', blanketLt: '#7A8DDA',
  pillow: '#F3EEFA', bed: '#6B4A7E', bedDk: '#4E3460', skinSil: '#2A2F5E', headCut: '#F4E7DC',
  cere: '#E99AA6', cereLt: '#F4B9C1', cereDk: '#CC7A88', cbl: '#D7849A', stem: '#E5AE9E', thal: '#F2C9B8', cc: '#FFF2E2',
  hypo: '#F59A3C', scn: '#FFE066', chiasm: '#FFE7A6', pitA: '#F6C445', pitP: '#E8D8A0', bone: '#EDE3CC', vessel: '#C8343F', vesselLt: '#E25A62',
  gh: '#FFD23F', rbc: '#D8323C', clock: '#FFF6E4', clockRim: '#E0A24A'
};
// ---------- the head ----------
const HEAD_P = [[40, -430], [-120, -412], [-250, -342], [-312, -222], [-322, -112], [-346, -62], [-332, -22], [-372, 40], [-402, 92], [-362, 112], [-346, 132], [-352, 160], [-336, 186], [-350, 206], [-326, 242], [-322, 282], [-272, 312], [-182, 302], [-124, 332], [-112, 470], [112, 470], [140, 302], [252, 200], [322, 40], [342, -120], [302, -302], [200, -402]];
const BR = {
  cere: [[-282, -150], [-272, -282], [-162, -372], [20, -392], [190, -342], [292, -222], [302, -92], [262, 0], [180, 30], [70, 2], [-20, -18], [-110, -42], [-200, -66], [-272, -92]],
  thal: [-10, -118, 60, 40], hypo: [-86, -70, 42, 28], scn: [-114, -58], chiasm: [-134, -36, 22, 9],
  stalk: [[-92, -46], [-86, -16], [-80, 6]], pitA: [-92, 24, 25, 21], pitP: [-64, 26, 16, 18], eye: [-268, -40]
};
function headProfile(o = {}) {
  const reveal = o.reveal ?? 1, head = smooth(HEAD_P);
  // the head: a solid silhouette (sleeping) that turns into a translucent cut-away (inside view)
  cut(head, mix('#5A5FA8', B.headCut, reveal), { z: 2.4, sa: .5, alpha: lerp(1, .9, reveal) });
  if (reveal < .02) return;
  X.save(); X.globalAlpha *= reveal;
  // the skull line and the face features (closed eye, ear) as light paper strips
  cut(ell(64, 34, 40, 68, -.15, 3), mix(B.headCut, '#E2C9B8', .8), { z: .6, sa: .25 });
  cut(strip([[-292, -40], [-270, -30], [-246, -40]], 7, 7), '#8A6A6A', { z: 0, rim: false });
  // brain
  cut(smooth(BR.cere), B.cere, { z: 1.6, sa: .4 });
  X.save(); X.clip(smooth(BR.cere));
  // medial-surface folds: curved bands that follow the corpus callosum (cingulate gyrus) and the outline, not radial rays
  [[250, 196, 1.08, 1.92], [212, 158, 1.02, 1.98], [176, 122, 1.0, 2.0]].forEach(([rx, ry, a0, a1], i) => { const P = []; for (let k = 0; k <= 30; k++) { const a = Math.PI * lerp(a0, a1, k / 30); P.push([10 + Math.cos(a) * rx, -128 + Math.sin(a) * ry]); } cut(strip(P, 9 - i * 2, 9 - i * 2), B.cereDk, { z: .2, rim: false, alpha: .55 }); });
  for (let i = 0; i < 6; i++) { const a = Math.PI * (1.12 + i * .15), P = [[10 + Math.cos(a) * 262, -128 + Math.sin(a) * 206], [10 + Math.cos(a + .05) * 300, -128 + Math.sin(a + .05) * 245]]; cut(strip(P, 7, 4), B.cereDk, { z: 0, rim: false, alpha: .45 }); }
  X.restore();
  // cerebellum (back, low) with folia; brainstem (down into the neck)
  cut(ell(200, 78, 108, 70, -.15, 11), B.cbl, { z: 1.4 });
  for (let i = 0; i < 4; i++) cut(strip(arcPts(200, 78, 30 + i * 18, -.6, 2.6, 16), 5), B.cereDk, { z: 0, rim: false, alpha: .5 });
  cut(strip([[30, -60], [52, 60], [72, 180], [86, 330], [92, 470]], 78, 56), B.stem, { z: 1.5 });
  cut(ell(48, 50, 50, 44, .2, 12), mix(B.stem, '#D9967F', .3), { z: .6 });                       // pons
  // corpus callosum, thalamus
  cut(strip(through([[-160, -118], [-60, -205], [80, -200], [158, -132], [120, -112]], 6), 30, 24), B.cc, { z: 1 });
  cut(ell(...BR.thal, 0, 13), B.thal, { z: 1 });
  // optic nerve from the eye to the chiasm, then the chiasm
  cut(strip([[-250, -40], [-190, -38], [-134, -36]], 13, 11), B.chiasm, { z: .8 });
  cut(ell(...BR.chiasm, 0, 14), B.chiasm, { z: .9 });
  // hypothalamus (below and in front of the thalamus)
  const hl = o.hypo || 0;
  if (hl > 0) glow(BR.hypo[0], BR.hypo[1], 160, '#FFB347', .6 * hl);
  cut(ell(...BR.hypo, -.2, 15), mix('#E9B28A', B.hypo, .4 + .6 * hl), { z: 1.2 });
  // SCN: the clock, a small nucleus at the front of the hypothalamus, just above the chiasm
  const sc = o.scn || 0;
  if (sc > 0) { glow(BR.scn[0], BR.scn[1], 110, '#FFE066', .8 * sc); cut(circ(BR.scn[0], BR.scn[1], 11, 16), B.scn, { z: .8 }); }
  // pituitary on its stalk, behind the chiasm, seated in the sella turcica (bone)
  cut(strip(BR.stalk, 13, 11), mix('#E9B28A', B.pitA, .3), { z: .9 });
  cut(strip(arcPts(-78, 20, 46, .15, Math.PI - .15, 18), 12), B.bone, { z: 1.2 });
  const pk = o.pit || 0;
  if (pk > 0) glow(BR.pitA[0], BR.pitA[1], 150, '#FFD23F', .7 * pk);
  cut(ell(...BR.pitP, 0, 17), B.pitP, { z: 1 });
  cut(ell(...BR.pitA, 0, 18), mix('#E8C68A', B.pitA, .5 + .5 * pk), { z: 1.1 });
  // night tint over the whole cut-away while asleep
  if (o.night) { X.save(); X.clip(head); X.fillStyle = rgba('#1B2A6E', .32 * o.night); X.fillRect(-500, -500, 1000, 1000); X.restore(); }
  X.restore();
}
// ---------- the sleeper (lying on the back; arms and hands stay under the blanket) ----------
const SLEEPER = { hx: 300, hy: 168, hs: .2 };               // head anchor in the bedroom world (rotated so the face points up)
function sleeperAndBed(t, o = {}) {
  const br = 1 + .012 * Math.sin(t * 1.6);                 // breathing: the blanket rises a little
  cut(rrect(-500, 250, 980, 140, 24), B.bed, { z: 2.2 });
  cut(rrect(410, 20, 60, 360, 20), B.bedDk, { z: 2.4 });
  cut(rrect(-490, 232, 960, 40, 18), B.sheet, { z: 1 });
  cut(ell(300, 236, 130, 42, 0, 5), B.pillow, { z: 1.6 });
  // head on the pillow, profile, face up: the same headProfile used for the brain, rotated 90°
  at(SLEEPER.hx, SLEEPER.hy, SLEEPER.hs, Math.PI / 2, () => headProfile({ reveal: o.reveal || 0 }));
  // blanket over the body (from the neck down to the feet)
  at(0, 236, 1, 0, () => { X.scale(1, br); cut(smooth([[-470, 10], [-470, -60], [-420, -96], [-300, -84], [-80, -112], [100, -104], [212, -78], [232, 6]]), B.blanket, { z: 2 }); for (let i = 0; i < 4; i++) cut(strip([[-360 + i * 150, -88], [-330 + i * 150, -30]], 8, 4), B.blanketLt, { z: 0, rim: false }); });
}
// ---------- the clock ----------
function wallClock(h, m, o = {}) {
  const flip = o.flip || 0, sx = Math.cos(flip * Math.PI);
  X.save(); X.scale(Math.max(.02, Math.abs(sx)), 1);
  if (sx >= 0) {
    cut(circ(0, 0, 130, 21), B.clockRim, { z: 2.4 });
    cut(circ(0, 0, 112, 22), B.clock, { z: .8 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU - Math.PI / 2; cut(rrect(Math.cos(a) * 92 - 4, Math.sin(a) * 92 - 4, 8, 8, 4), '#3A2D52', { z: 0, rim: false }); }
    [['12', 0, -72], ['3', 74, 2], ['6', 0, 76], ['9', -74, 2]].forEach(([s, x, y]) => txt(s, x, y, 26, '#3A2D52', { weight: 700, sa: 0 }));
    const ha = ((h % 12) + m / 60) / 12 * TAU - Math.PI / 2, ma = m / 60 * TAU - Math.PI / 2;
    at(0, 0, 1, ha, () => cut(rrect(-10, -7, 62, 14, 7), '#2B2147', { z: .9 }));
    at(0, 0, 1, ma, () => cut(rrect(-10, -5, 88, 10, 5), C.red, { z: .9 }));
    cut(circ(0, 0, 10, 23), B.clockRim, { z: .6 });
  } else {
    // the back of the card: the sleep rhythm (a slow wave and a crescent moon)
    cut(circ(0, 0, 130, 24), '#3D4CA8', { z: 2.4 });
    const P = []; for (let k = 0; k <= 40; k++) { const x = -90 + k * 4.5; P.push([x, 10 + 34 * Math.sin(k / 40 * TAU * 1.5)]); } cut(strip(P, 12), '#9FD8FF', { z: .8 });
    cut(circ(-6, -60, 26, 25), C.gold, { z: .8 }); cut(circ(6, -68, 22, 26), '#3D4CA8', { z: 0, rim: false });
  }
  X.restore();
}
function bedroom(t, o = {}) {
  layer(.4, () => { X.fillStyle = B.wall0; X.fillRect(-3000, -3000, 6000, 6000); for (let i = 0; i < 6; i++) cut(rrect(-900 + i * 320, -1400, 180, 2800, 0), rgba(B.wall1, .5), { z: .4, rim: false, grain: .6 }); });
  layer(.6, () => {
    // the window with the night outside
    cut(rrect(-470, -760, 330, 430, 20), '#3A2D52', { z: 2 });
    cut(rrect(-450, -740, 290, 390, 14), B.night, { z: .5 });
    glow(-330, -640, 160, '#FFF0C8', .5); cut(circ(-330, -640, 46, 30), '#F5ECD2', { z: .8 });
    stars(t, 8, [-440, -730, 270, 360], 3);
    cut(rrect(-312, -740, 14, 390, 4), '#3A2D52', { z: .6 });
  });
  layer(1, () => {
    at(180, -520, 1, 0, () => wallClock(o.h ?? 22, o.m ?? 0, { flip: o.flip }));
    sleeperAndBed(t, o);
  });
}
// ---------- EEG strip ----------
function eeg(t, deep, a = 1) {   // a paper strip with a brain-wave trace: small and fast awake, large and slow in deep sleep
  if (a <= 0) return;
  X.save(); X.globalAlpha *= a;
  cut(rrect(-470, -90, 940, 180, 22), C.cream, { z: 1.6 });
  const P = []; for (let k = 0; k <= 180; k++) { const x = -440 + k * 4.9, u = x / 880 + t * .5, f = lerp(22, 3.2, deep), A = lerp(14, 62, deep); P.push([x, A * Math.sin(u * TAU * f) + lerp(6, 2, deep) * Math.sin(u * TAU * 41 + 1.3)]); }
  cut(strip(P, 5), mix('#3A6BD8', '#2B2F8A', deep), { z: .3, rim: false });
  X.restore();
}
// ---------- blood ----------
function hexP(x, y, r, rot = 0) { const P = []; for (let i = 0; i < 6; i++) { const a = rot + i / 6 * TAU; P.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } return poly(P); }
function ghMol(x, y, r, t, i) { glow(x, y, r * 3, '#FFD23F', .45); cut(hexP(x, y, r, t * 1.5 + i), B.gh, { z: .8 }); cut(hexP(x, y, r * .45, -t + i), '#FFF3B0', { z: 0, rim: false }); }
function rbc(x, y, r, rot, i) { at(x, y, 1, rot, () => { cut(ell(0, 0, r, r * .62, 0, i), B.rbc, { z: .8 }); cut(ell(0, 0, r * .45, r * .26, 0, i + 1), '#A9222C', { z: 0, rim: false }); }); }
