// sound.mjs (sweat): score and cues for "เหงื่อออกมากแปลว่าเผาผลาญไขมันมากจริงหรือ?" (SHORT=sweat scripts/shorts_audio.mjs).
// Sections: a driving, sporty hook and myth (a), a cool, airy explanation (b), the breath twist and the cautions in a
// suspended mode (c), and a bright close (d). 104 BPM, in G.
export default ({ NT, ph, DUR }) => {
  const c = k => NT[k][0] - .12;
  const CUT = { c2: c('n02'), c3: c('n04'), c4: c('n06'), c5: c('n08'), c6: c('n09'), c7: c('n10'), c8: c('n11') };
  const SEC = { a: [0, CUT.c3], b: [CUT.c3, CUT.c4], c: [CUT.c4, CUT.c7], d: [CUT.c7, DUR] };
  const CH = {
    a: [[43, 55, 59, 62], [40, 52, 55, 59], [36, 48, 52, 55], [38, 50, 54, 57]],                         // G Em C D
    b: [[36, 48, 55, 59], [43, 55, 59, 66], [40, 52, 59, 62], [38, 50, 57, 60]],                         // Cmaj7 Gmaj7 Em7 D7sus
    c: [[40, 52, 55, 59], [36, 48, 52, 55], [40, 52, 55, 62], [38, 50, 54, 57], [40, 52, 55, 59]],       // Em C Em7 D Em
    d: [[43, 55, 59, 62], [38, 50, 54, 57], [40, 52, 55, 59], [36, 48, 52, 55], [43, 55, 59, 62, 67]],   // G D Em C G
  };
  const cues = ({ noiseBurst, thump, paperTap, chime, zap, stamp }) => {
    // 1 hook: footsteps of the run, the drench, the question
    for (let i = 0; i * .43 < NT.n01[1] + .1; i++) thump(.05 + i * .43, 75, .18, .15);
    noiseBurst(ph('n01', 1) - .05, .5, 3000, 900, .16, { q: 1.5 }); stamp(ph('n01', 1) - .02);
    chime(ph('n01', 2), [74, 79], .09);
    // 2 the scale counts down, the dive into a drop, the cross on "fat"
    noiseBurst(CUT.c2 - .2, .45, 300, 2000, .2); for (let i = 0; i < 6; i++) paperTap(ph('n02', 1) - .2 + i * .1, .12, .3);
    chime(ph('n02', 1) + .4, [79, 83, 86], .1);
    noiseBurst(NT.n03[0] - .1, .7, 200, 3500, .3, { q: .6, shape: .6 }); thump(NT.n03[0] + .5, 50, .35, .6);   // the dive + a "bloop"
    paperTap(ph('n03', 1), .3); stamp(ph('n03', 2) - .02);
    // 3 vapour hiss, the AC pops in, the drink and the scale back up
    noiseBurst(ph('n04', 1), 1.4, 5000, 2500, .07, { q: .5 }); paperTap(ph('n04', 2) - .1, .4); noiseBurst(ph('n04', 2), .9, 1500, 900, .06, { q: .4 });
    for (let i = 0; i < 4; i++) thump(NT.n05[0] + .2 + i * .22, 140, .12, .12);
    for (let i = 0; i < 6; i++) paperTap(ph('n05', 1) - .2 + i * .1, .12, .3);
    // 4 the twist: the fat blob splits, molecules fly to the breath, the ring fills
    noiseBurst(CUT.c4 - .25, .5, 2500, 300, .25); thump(ph('n06', 2) - .05, 55, .5, .6); zap(ph('n06', 2), .06, .5);
    noiseBurst(ph('n06', 2) + .3, 1.3, 400, 1400, .14, { q: .5 });                                               // the exhale
    noiseBurst(ph('n07', 1) - .1, .9, 500, 1800, .1, { q: 3 }); paperTap(ph('n07', 1) + .5, .3);
    chime(ph('n07', 2), [76, 79, 83], .09); noiseBurst(ph('n07', 3), 1.0, 600, 1600, .12, { q: .5 });
    // 5 running again; the "fit" card
    for (let i = 0; i * .43 < NT.n08[1] - NT.n08[0] + .2; i++) thump(NT.n08[0] - .05 + i * .43, 75, .16, .15);
    paperTap(ph('n08', 1), .35); chime(ph('n08', 2) + .2, [79, 83], .09);
    // 6 heat rising, the warning, the empty bottle
    noiseBurst(NT.n09[0], 2.2, 300, 1200, .09, { q: .4 }); stamp(ph('n09', 1) - .02); zap(ph('n09', 1) + .15, .05, .3); paperTap(ph('n09', 2), .35);
    // 7 the flame grows with a counter; the cross on sweat
    noiseBurst(ph('n10', 1) - .2, 1.4, 200, 900, .12, { q: .6 }); for (let i = 0; i < 8; i++) paperTap(ph('n10', 1) + i * .12, .08, -.3);
    chime(ph('n10', 1) + .4, [81], .1); stamp(ph('n10', 2) - .02);
    // 8 close
    paperTap(NT.n11[0], .35, -.4); paperTap(ph('n11', 1), .35, .4); noiseBurst(ph('n11', 2) - .2, 1.2, 300, 3500, .16, { q: .5 }); chime(ph('n11', 2) + .1, [79, 83, 86, 91], .11);
  };
  return { BPM: 104, SEC, CH, CUT, cues };
};
