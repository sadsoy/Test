// cues.js: sound cues tied to the picture (scripts/audio.mjs reads window.CUES from the page).
function buildCues() {
  const P = ph, c = [];
  for (let k = 0; k < 8; k++) c.push(['tick', .15 + k * .5, 0, .7]);                                 // the wall clock ticking
  c.push(['pop2', wordAt('L1', 0, 'โกรท')], ['shimmer', wordAt('L1', 0, 'สี่ทุ่ม')], ['pop', wordAt('L1', 0, 'สี่ทุ่ม') + .1],
    ['whoosh', P('L2', 0)[0] - .1, .9], ['whirr', wordAt('L2', 0, 'ตีหนึ่ง') - .3, .8, 1], ['pop', wordAt('L2', 0, 'ตีหนึ่ง') + .2],
    ['pop2', P('L2', 1)[0] + .1], ['swell', P('L2', 1)[0] + .2, 1.9], ['whoosh', 7.9, 1.0],
    ['pop', P('L3', 0)[0] + .2], ['shimmer', P('L3', 1)[0]], ['pop2', P('L3', 1)[0] + .3],
    ['pop', P('L4', 0)[0]], ['hum', P('L4', 1)[0], 2.8], ['pop2', P('L4', 1)[0] + .9],
    ['whoosh', P('L5', 0)[0] + .1, .8], ['pop', P('L5', 0)[0] + .4], ['bubble', P('L5', 0)[0] + .4, 2.8], ['pop2', P('L5', 0)[0] + 1.1],
    ['shimmer', P('L6', 0)[0] + .1], ['ding', P('L6', 0)[0] + .25], ['water', P('L6', 0)[0], 3.4], ['whoosh', 22.4, .6],
    ['wipe', 24.79], ['pop', P('L7', 0)[0]], ['swish', wordAt('L7', 0, 'เลื่อน')], ['swish', P('L7', 1)[0] + .4], ['pop2', P('L7', 1)[0]],
    ['shimmer', wordAt('L8', 0, 'เวลาวิเศษ') - .1], ['swipe', wordAt('L8', 0, 'เวลาวิเศษ') + .6], ['paper', P('L9', 0)[0] + .4], ['pop', P('L9', 0)[0] + .1],
    ['swell', P('L9', 1)[0], 2.0], ['pop2', wordAt('L9', 1, 'จังหวะ')], ['paper', P('L9', 1)[1] + .05], ['chime', P('L9', 1)[1] + .1]);
  for (let k = 0; k < 3; k++) c.push(['tick', 36.9 + k * .25, 0, .6]);
  return c.map(([type, t, d, g]) => ({ type, t: +t.toFixed(3), d: d || 0, g: g || 1 })).sort((a, b) => a.t - b.t);
}
