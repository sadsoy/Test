// sound.mjs (brain10): score and cues for "เราใช้สมองแค่ 10% จริงหรือ?" (SHORT=brain10 scripts/shorts_audio.mjs).
// Sections: a curious, dim hook and movie hype (a), bright discovery (b), the seizure twist in suspense (c), and the
// orchestra close (d). 92 BPM, in A minor → C.
export default ({ NT, ph, DUR }) => {
  const c = k => NT[k][0] - .12;
  const CUT = { c2: c('n02'), c3: c('n03'), c4: c('n05'), c5: c('n07'), c6: c('n08'), c7: c('n10'), c8: c('n11') };
  const SEC = { a: [0, CUT.c3], b: [CUT.c3, CUT.c6], c: [CUT.c6, CUT.c7], d: [CUT.c7, DUR] };
  const CH = {
    a: [[45, 57, 60, 64], [41, 53, 57, 60], [43, 55, 59, 62], [40, 52, 56, 59]],                         // Am F G E
    b: [[48, 60, 64, 67], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60], [48, 60, 64, 67]],      // C G Am F C
    c: [[45, 57, 60, 64], [46, 58, 62, 65], [45, 57, 60, 64]],                                          // Am Bb Am
    d: [[48, 60, 64, 67], [41, 53, 57, 64], [43, 55, 62, 65], [45, 57, 60, 64], [48, 60, 64, 67, 72]],  // C Fmaj7 G7 Am C
  };
  const cues = ({ noiseBurst, thump, paperTap, chime, zap, stamp }) => {
    // 1 hook: one cell lights, nine dark tiles drop, question marks
    zap(.12, .06, .3); chime(.4, [81], .1); for (let i = 0; i < 10; i++) paperTap(.2 + i * .05, .12, (i - 5) / 6);
    for (let i = 0; i < 4; i++) paperTap(ph('n01', 1) + i * .1, .2, (i - 1.5) / 2);
    // 2 movie: whoosh in, padlock clicks open, progress zips, power-up
    noiseBurst(CUT.c2 - .25, .5, 300, 2400, .22); thump(ph('n02', 1), 140, .3, .15); paperTap(ph('n02', 1) + .05, .4);
    noiseBurst(ph('n02', 1) + .1, 1.0, 400, 3000, .14, { q: 3 }); zap(ph('n02', 2), .1, .6); chime(ph('n02', 2) + .05, [76, 81, 85, 88], .1);
    // 3 scanner hum and pings as lobes take turns; night falls; cards filed
    noiseBurst(NT.n03[0] - .2, 1.2, 600, 1800, .08, { q: 4 }); for (let i = 0; i < 5; i++) chime(ph('n03', 1) + i * .45, [72 + i * 2], .06, (i - 2) / 3);
    noiseBurst(NT.n04[0] - .3, 1.0, 2000, 400, .1, { q: .5 }); for (let i = 0; i < 4; i++) paperTap(ph('n04', 2) + i * .25 + .6, .22, .3);
    // 4 bars grow; energy bolts
    paperTap(NT.n05[0] + .2, .3, -.3); noiseBurst(ph('n05', 1), .9, 300, 1600, .12, { q: 2 }); zap(ph('n05', 1) + .7, .07, .3);
    noiseBurst(NT.n06[0] - .1, .5, 1800, 400, .15); stamp(NT.n06[0] + .8);
    // 5 labels pop, the bandage, the lost eye
    for (let i = 0; i < 5; i++) paperTap(NT.n07[0] - .1 + i * .08, .18, (i - 2) / 3); thump(NT.n07[0] + .5, 70, .4, .3); stamp(ph('n07', 1) - .02);
    // 6 sparse ticks, then the surge
    for (let i = 0; i < 10; i++) paperTap(NT.n08[0] + i * .18, .06, (i % 3 - 1) * .5);
    noiseBurst(ph('n08', 2) - .3, .6, 200, 4000, .3, { q: .5 }); for (let i = 0; i < 12; i++) zap(ph('n08', 2) + i * .09, .06, .2);
    stamp(NT.n09[0] - .02); thump(ph('n09', 1), 45, .6, .9);
    // 7 orchestra: chimes in turn per instrument
    for (let i = 0; i < 8; i++) chime(ph('n10', 1) + i * .39, [[72, 76], [69], [76, 79], [74, 77], [79, 84]][i % 5], .08, ((i % 5) - 2) / 3);
    // 8 the ring fills, bright close
    noiseBurst(NT.n11[0], 1.4, 300, 2600, .04, { q: 3 }); paperTap(ph('n11', 1), .18); chime(NT.n11[1] + .1, [72, 76, 79, 84], .11);   // the chime waits for the last word
  };
  return { BPM: 92, SEC, CH, CUT, cues };
};
