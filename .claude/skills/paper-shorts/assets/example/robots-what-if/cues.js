// cues.js: sound cues tied to the picture (scripts/audio.mjs reads window.CUES from the page).
function buildCues() {
  const P = ph, c = [
    ['motor', 0, 4.4, .6], ['click', P('L1', 0)[0] + .25], ['whirr', P('L1', 0)[0] + .4, 2.2, 1], ['thud', P('L1', 0)[1] - .1], ['pop2', P('L1', 1)[0]], ['stamp', P('L1', 2)[0]], ['hum', P('L1', 2)[0], 1.0],
    ['wipe', 4.19], ['paper', P('L2', 0)[0] + .1], ['pop', P('L2', 0)[0] + .2], ['pop', P('L2', 0)[0] + .45], ['ding', P('L2', 1)[0] + .3], ['pop2', P('L2', 1)[0] + .5], ['whoosh', P('L2', 2)[0] + .2, .8], ['swish', P('L2', 2)[0] + 1.0], ['swish', P('L2', 2)[0] + 1.2], ['pop', P('L2', 2)[0] + .7],
    ['wipe', 11.89], ['stamp', P('L3', 0)[0] + .05], ['motor', P('L3', 1)[0], 5.6, 1], ['whirr', P('L3', 1)[0], 3.0, 1], ['pop', P('L3', 1)[0] + .1], ['pop2', P('L3', 2)[0] + .2], ['swipe', P('L3', 2)[0] + .5],
    ['whoosh', P('L4', 0)[0] - .3, .9], ['boing', P('L4', 0)[0] + .2], ['stamp', P('L4', 0)[0] + .05],
    ['paper', 19.3], ['pop', P('L5', 0)[0] + .1], ['pop', P('L5', 0)[0] + .35], ['pop', P('L5', 0)[0] + .6], ['pop', P('L5', 0)[0] + .85], ['ding', wordAt('L5', 0, 'ค่าจ้าง')], ['whirr', P('L5', 1)[0], .8, 1], ['stamp', P('L5', 2)[0] + .2], ['swipe', P('L5', 2)[0] + .15],
    ['swell', P('L6', 0)[0], 1.6], ['pop2', P('L6', 0)[0] + .1],
    ['shimmer', P('L7', 0)[0] + .2], ['pop', P('L7', 0)[0] + .15], ['pop2', P('L7', 0)[0] + .7], ['shimmer', P('L7', 1)[0] + .3], ['pop', P('L7', 1)[0] + .15],
    ['whoosh', 30.6, .6], ['whirr', 30.9, 2.2, 1], ['pop', P('L8', 1)[0]], ['swipe', P('L8', 1)[0] + .6], ['paper', P('L8', 2)[0] + .1], ['pop2', P('L8', 3)[0]],
    ['whoosh', 35.2, .7], ['swell', P('L9', 0)[0], 2.0], ['shimmer', P('L9', 1)[0]], ['pop', P('L9', 1)[0] + .15], ['chime', P('L9', 1)[1]],
  ];
  return c.map(([type, t, d, g]) => ({ type, t: +t.toFixed(3), d: d || 0, g: g || 1 })).sort((a, b) => a.t - b.t);
}
