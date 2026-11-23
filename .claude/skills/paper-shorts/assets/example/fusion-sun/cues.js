// cues.js: sound cues tied to the picture (scripts/audio.mjs reads window.CUES from the page).
function buildCues() {
  const P = ph, c = [
    ['swell', 0, 2.2], ['hum', 0, 3.0, .7], ['whoosh', P('L1', 1)[0] - .1, .9], ['shimmer', P('L1', 1)[0] + 1.2, 0, .6], ['stamp', P('L1', 1)[0] + 1.25],
    ['whoosh', P('L2', 0)[0] + .2, 1.2], ['zip', P('L2', 0)[0] + .4], ['ding', P('L2', 0)[1]], ['pop', P('L2', 0)[0] + .4],
    ['whoosh', 4.85, .5], ['pop', P('L3', 0)[0]], ['swish', P('L3', 1)[0] - .1], ['stamp', P('L3', 1)[0] + .6], ['shimmer', P('L3', 1)[0] + .6], ['pop2', P('L3', 2)[0]], ['swish', P('L3', 3)[0] + .1], ['stamp', P('L3', 3)[0] + .2],
    ['whoosh', 9.0, .5], ['pop', P('L4', 0)[0]], ['swell', P('L4', 0)[0] + .2, 1.6], ['hum', P('L4', 1)[0], 1.6, 1], ['whirr', P('L4', 1)[0] + .1, 1.4, 1], ['pop2', P('L4', 1)[0] + .1],
    ['whoosh', 12.55, .5], ['pop', P('L5', 0)[0]], ['zip', P('L5', 1)[0]], ['stamp', P('L5', 1)[0] + .8], ['shimmer', P('L5', 1)[0] + .85], ['pop', P('L5', 1)[0] + 1.5], ['pop2', P('L5', 1)[0] + 1.7], ['swell', P('L5', 2)[0] + .1, 1.4], ['thud', P('L5', 2)[0] + .3],
    ['wipe', 18.39], ['stamp', P('L6', 0)[0]], ['motor', P('L6', 1)[0], 9.0, .45], ['whirr', P('L6', 1)[0], 2.0, .6], ['shimmer', P('L6', 1)[0] + .5, 0, .5], ['pop', P('L6', 1)[0] + .75],
    ['water', P('L7', 0)[0], 3.8], ['bubble', P('L7', 0)[0] + .2, 1.6], ['pop', P('L7', 0)[0] + .1], ['pop2', P('L7', 1)[0] + .1], ['swipe', P('L7', 1)[0] + .4],
    ['whoosh', P('L8', 0)[0] - .2, .9], ['splash', P('L8', 1)[0] + .2, 0, .7], ['pop', P('L8', 0)[0] + .3],
    ['wipe', 28.29], ['pop', P('L9', 0)[0]], ['thud', P('L9', 1)[0] + .1], ['pop2', P('L9', 2)[0]], ['pop2', P('L9', 3)[0]],
    ['whoosh', 34.1, .9], ['swell', P('L10', 0)[0], 2.4, .5], ['shimmer', P('L10', 1)[0] + .4, 0, .5], ['chime', P('L10', 1)[1] + .05],
  ];
  return c.map(([type, t, d, g]) => ({ type, t: +t.toFixed(3), d: d || 0, g: g || 1 })).sort((a, b) => a.t - b.t);
}
