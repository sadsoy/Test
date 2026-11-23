// cues.js: sound-effect cues tied to the picture (scripts/audio.mjs reads window.CUES from the page).
function buildCues() {
  const P = ph, L1b = P('L1', 1)[0], rab = wordAt('L1', 0, 'กระต่าย'), L2 = P('L2', 0), [a31] = P('L3', 1), [a32] = P('L3', 2), [a4] = P('L4', 0);
  const [a50] = P('L5', 0), [a51] = P('L5', 1), [a52] = P('L5', 2), [a60] = P('L6', 0), [a62] = P('L6', 2), [a70] = P('L7', 0), [a71] = P('L7', 1), [a80] = P('L8', 0), [a81] = P('L8', 1), [a92] = P('L9', 2);
  const c = [
    ['shimmer', rab], ['pop', L1b + .15], ['pop2', L1b + .35], ['wobble', L1b + .25], ['boing', L1b + 1.3],
    ['whoosh', 4.1, .6], ['swish', L2[0] + .05], ['pop', L2[0] + .2], ['whirr', L2[0] + .1, L2[1] - L2[0]],
    ['zip', 7.0], ['paper', 7.5], ['pop', 7.55], ['pop2', 7.6], ['pop', a31], ['pop', a32], ['ding', a32 + .9], ['shimmer', a4 - .1],
    ['wipe', 14.5], ['pop', a50], ['whirr', a51, BRK - a51 + 2.5, 1.6], ['pop2', a51 + .05], ['hum', a52, 3.4], ['pop', a52 + .1],
    ['brake', wordAt('L5', 2, 'เบรก'), 1.8], ['pop', a60 + .3], ['click', a60 + .85], ['stamp', a62 + .05],
    ['wipe', 24.55], ['pop2', a70 + .1], ['swipe', wordAt('L7', 0, 'ไม่ได้') + .05], ['swell', a71 - .1, 1.6], ['pop', a71 + .9],
    ['swish', a80 + .1], ['pop', a80 + .5], ['pop2', a81],
    ['whoosh', 32.55, .6], ['shimmer', a92], ['chime', 38.6],
  ];
  for (let v = 51; v <= 59; v++) c.push(['tick', a81 + .1 + 1.3 * (1 - Math.cbrt(1 - (v - 50) / 9)), 1, .6 + (v - 50) * .05]);
  c.push(['ding', a81 + 1.42]);
  return c.map(([type, t, d, g]) => ({ type, t: +t.toFixed(3), d: d || 0, g: g || 1 })).sort((a, b) => a.t - b.t);
}
