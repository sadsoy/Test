// cues.js: sound cues tied to the picture (scripts/audio.mjs reads window.CUES from the page).
function buildCues() {
  const P = ph, c = [
    ['swell', 0, 2.6], ['shimmer', P('L1', 0)[0] + .6], ['bubble', P('L1', 0)[0] + .7, 1.6], ['pop', P('L1', 0)[0] + .35], ['whoosh', P('L1', 1)[0] - .3, 1.8],
    ['paper', 4.85], ['pop', P('L2', 1)[0]], ['pop2', P('L2', 1)[0] + .3], ['whirr', P('L2', 1)[0] + .5, 1.4, 1], ['stamp', wordAt('L2', 2, 'ซูเปอร์')],
    ['pop', P('L3', 0)[0] + .3], ['hum', P('L3', 0)[0] + .2, 3.4], ['shimmer', P('L3', 1)[0]], ['pop2', P('L3', 0)[0] + 1.0],
    ['whoosh', 14.6, .8], ['pop', P('L4', 0)[0] + .3], ['water', 14.9, 9.4], ['swish', P('L4', 0)[0] + .6], ['pop2', P('L4', 1)[0]], ['swish', P('L4', 2)[0] + .1], ['pop', P('L4', 2)[0] + .1],
    ['bubble', P('L5', 0)[0] + .1, 2.0], ['pop2', P('L5', 0)[0] + .1],
    ['wipe', 23.99], ['pop', P('L6', 0)[0] + .1], ['swish', P('L6', 1)[0] - .1], ['pop', P('L6', 1)[0] + .1], ['swish', P('L6', 2)[0] - .1], ['splash', P('L6', 2)[0] + .2], ['pop', P('L6', 3)[0] + .05],
    ['whoosh', 29.7, .7], ['pop', P('L7', 0)[0]], ['swell', P('L7', 0)[0] + .2, 1.2], ['pop2', P('L7', 1)[0] + .1], ['stamp', P('L7', 2)[0] + .2],
    ['shimmer', 35.25], ['stamp', 35.3], ['pop2', 35.6], ['pop', P('L8', 0)[0] + .1], ['chime', P('L8', 1)[1] + .1],
  ];
  return c.map(([type, t, d, g]) => ({ type, t: +t.toFixed(3), d: d || 0, g: g || 1 })).sort((a, b) => a.t - b.t);
}
