// cues.js: sound cues tied to the picture (scripts/audio.mjs reads window.CUES from the page).
function buildCues() {
  const P = ph, rel = wordAt('L1', 0, 'ปล่อย');
  const c = [
    ['water', 0, 5.4], ['splash', rel + .35], ['shimmer', rel + .2], ['pop', P('L1', 2)[0] + .05], ['pop2', P('L1', 1)[0] + .1],
    ['whoosh', 4.85, .55], ['water', 5.1, 3.7], ['pop2', P('L2', 0)[0]], ['ding', P('L2', 2)[1] - .1],
    ['whoosh', 8.5, .5], ['water', 8.7, 4.2], ['motor', P('L3', 1)[0] - .3, 3.6], ['splash', P('L3', 1)[0] + .6], ['splash', P('L3', 1)[0] + 1.7], ['pop', P('L3', 1)[0]], ['pop2', P('L3', 1)[0] + .2],
    ['wipe', 12.49], ['pop', P('L4', 0)[0]], ['grind', wordAt('L4', 0, 'บดย่อย') - .3, 2.6], ['pop2', wordAt('L4', 0, 'บดย่อย') + .05], ['pop', wordAt('L4', 0, 'กลายเป็น')], ['shimmer', wordAt('L4', 0, 'กลายเป็น') + .3],
    ['wipe', 16.44], ['pop', P('L5', 0)[0]], ['stamp', P('L5', 1)[0] + .05], ['whoosh', P('L5', 2)[0] - .1, .7], ['stamp', P('L5', 2)[0] + .65], ['thud', P('L5', 2)[0] + 1.0], ['thud', P('L5', 2)[0] + 1.3], ['pop2', P('L5', 2)[0] + .05],
    ['wipe', 21.69], ['bubble', 22.1, 3.0], ['pop', P('L6', 0)[0]], ['swish', P('L6', 2)[0] + .25], ['swell', P('L6', 2)[0] + .1, 1.4], ['stamp', P('L6', 2)[0] + .3],
    ['whoosh', 25.85, .5], ['pop', P('L7', 0)[0] + .1], ['swish', P('L7', 1)[0] + .2], ['water', P('L7', 2)[0], 1.6], ['pop2', P('L7', 2)[0]],
    ['wipe', 29.34], ['water', 29.65, 8.8], ['pop', P('L8', 0)[0]], ['ding', P('L8', 1)[0] + .3, 0, .45], ['ding', P('L8', 2)[0] + .15, 0, .45], ['ding', P('L8', 3)[0] + .3, 0, .45], ['splash', P('L8', 3)[1] + .1, 0, .6],
    ['shimmer', P('L9', 0)[0]], ['chime', P('L9', 1)[1] - .2],
  ];
  return c.map(([type, t, d, g]) => ({ type, t: +t.toFixed(3), d: d || 0, g: g || 1 })).sort((a, b) => a.t - b.t);
}
