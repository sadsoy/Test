// sound.mjs (sneeze): score and cues for "ทำไมเราไม่ควรกลั้นจาม?" (SHORT=sneeze scripts/shorts_audio.mjs).
// Sections: a comic, tickly hook (a), how a sneeze works (b), the pressure and the case report in suspense (c), the right
// way and the close (d). 100 BPM, in C.
export default ({ NT, ph, DUR }) => {
  const c = k => NT[k][0] - .12;
  const CUT = { c2: c('n02'), c3: c('n03'), c4: c('n05'), c5: c('n07'), c6: c('n08'), c7: c('n09'), c8: c('n11') };
  const SEC = { a: [0, CUT.c3], b: [CUT.c3, CUT.c4], c: [CUT.c4, CUT.c7], d: [CUT.c7, DUR] };
  const CH = {
    a: [[48, 60, 64, 67], [45, 57, 60, 64], [41, 53, 57, 60], [43, 55, 59, 62]],                        // C Am F G
    b: [[41, 53, 57, 64], [43, 55, 62, 65], [48, 60, 64, 67], [45, 57, 60, 64], [41, 53, 57, 60]],     // Fmaj7 G7 C Am F
    c: [[45, 57, 60, 64], [44, 56, 60, 63], [45, 57, 60, 64], [40, 52, 56, 59]],                        // Am Ab+ Am E
    d: [[48, 60, 64, 67], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60], [48, 60, 64, 67, 72]],  // C G Am F C
  };
  const cues = ({ noiseBurst, thump, paperTap, chime, zap, stamp }) => {
    // 1 hook: the tickle builds ("ah… ah…"), then a muffled stifled sneeze
    noiseBurst(.1, ph('n01', 1) - .1, 300, 2500, .08, { q: 4 }); thump(ph('n01', 1), 90, .5, .35); noiseBurst(ph('n01', 1), .25, 600, 200, .25, { q: .8 });
    chime(ph('n01', 2), [76, 79], .08);
    // 2 doctor's warning
    paperTap(ph('n02', 1), .35); stamp(ph('n02', 1) + .02); zap(ph('n02', 2), .05, .35);
    // 3 signal to the brain, inhale, throat closes, pressure, release (the real sneeze!)
    zap(NT.n03[0] + .3, .04, .6); chime(ph('n03', 1) + .2, [72, 79], .08);
    noiseBurst(NT.n04[0], .9, 400, 1400, .12, { q: .8 }); thump(ph('n04', 1), 140, .25, .12); noiseBurst(ph('n04', 2), .9, 200, 700, .1, { q: 3 });
    noiseBurst(ph('n04', 3), .6, 3000, 600, .35, { q: .5, shape: .3 }); thump(ph('n04', 3), 70, .3, .3);
    // 4 corks pop in, pressure rises (a rising whine), the gauge maxes
    paperTap(NT.n05[0] + .2, .4, .4); paperTap(NT.n05[0] + .35, .4, .3); noiseBurst(ph('n05', 1), 2.4, 300, 2600, .12, { q: 6 }); stamp(ph('n06', 1));
    // 5 the case report card, the magnifier
    paperTap(NT.n07[0], .4); paperTap(ph('n07', 1), .3, -.3); thump(ph('n07', 2), 60, .35, .4); chime(ph('n07', 2) + .4, [69, 72], .07);
    // 6 the see-saw tips
    noiseBurst(ph('n08', 1), .6, 600, 300, .08, { q: 6 }); thump(ph('n08', 1) + .5, 90, .3, .2);
    // 7 a real sneeze into the elbow, a soft "ahh", people safe
    noiseBurst(ph('n09', 1), .5, 3500, 800, .32, { q: .5, shape: .3 }); paperTap(ph('n09', 2), .3); chime(ph('n10', 1), [79, 84], .09);
    // 8 the cross, the tick, a bright end (after the last word)
    stamp(ph('n11', 1) + .02); chime(ph('n11', 2) + .1, [72, 76, 79], .08); chime(NT.n11[1] + .15, [72, 76, 79, 84], .11);
  };
  return { BPM: 100, SEC, CH, CUT, cues };
};
