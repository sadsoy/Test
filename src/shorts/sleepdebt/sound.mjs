// sound.mjs (sleepdebt): score and cues for "นอนชดเชยวันหยุดทดแทนการอดนอนได้ไหม?" (SHORT=sleepdebt scripts/shorts_audio.mjs).
// Sections: a sleepy-curious hook and the bank idea (a), the experiment and its costs (b), the good news, the tyre and
// the advice (c, lighter), a warm close (d). 84 BPM, in Eb.
export default ({ NT, ph, DUR }) => {
  const c = k => NT[k][0] - .12;
  const CUT = { c2: c('n02'), c3: c('n03'), c4: c('n05'), c5: c('n07'), c6: c('n09'), c7: c('n10'), c8: c('n11') };
  const SEC = { a: [0, CUT.c3], b: [CUT.c3, CUT.c5], c: [CUT.c5, CUT.c8], d: [CUT.c8, DUR] };
  const CH = {
    a: [[39, 51, 55, 58], [36, 48, 51, 55], [32, 44, 48, 51], [34, 46, 50, 53]],                        // Eb Cm Ab Bb
    b: [[36, 48, 51, 55], [32, 44, 48, 55], [39, 51, 55, 58], [34, 46, 50, 53], [36, 48, 51, 55]],     // Cm Abmaj7 Eb Bb Cm
    c: [[39, 51, 55, 58], [34, 46, 50, 53], [32, 44, 48, 51], [34, 46, 50, 57]],                        // Eb Bb Ab Bbsus
    d: [[39, 51, 55, 58], [32, 44, 48, 55], [34, 46, 50, 53], [36, 48, 51, 55], [39, 51, 55, 58, 63]],  // Eb Ab Bb Cm Eb
  };
  const cues = ({ noiseBurst, thump, paperTap, chime, zap, stamp }) => {
    // 1 hook: weekday bars tick up short, the weekend bars swoop tall, a see-saw creak
    for (let i = 0; i < 5; i++) paperTap(.15 + i * .1, .18, (i - 2) / 3); noiseBurst(ph('n01', 1), .8, 300, 2200, .14, { q: 2 });
    chime(ph('n01', 2), [75, 79], .09); noiseBurst(ph('n01', 2) + .2, .6, 600, 400, .06, { q: 6 });
    // 2 coins clink out, then back in
    for (let i = 0; i < 5; i++) chime(ph('n02', 2) + .3 + i * .1, [93 - i], .05, -.3); for (let i = 0; i < 5; i++) chime(ph('n02', 3) + .25 + i * .12, [91 + i], .05, .3);
    // 3 the lab: clipboard taps, a pour into the bucket
    noiseBurst(CUT.c3 - .2, .45, 300, 2000, .18); paperTap(NT.n03[0] + .3, .3); noiseBurst(ph('n04', 1), 1.4, 900, 500, .08, { q: 1 }); stamp(ph('n04', 2) + .05);
    // 4 the key jams; night falls; the fridge opens; snacks; the scale ticks up
    for (let i = 0; i < 6; i++) paperTap(ph('n05', 1) + .2 + i * .14, .12, .2); noiseBurst(NT.n06[0] - .3, .8, 2000, 400, .1, { q: .5 });
    thump(NT.n06[0] + .1, 120, .25, .2); for (let i = 0; i < 6; i++) paperTap(NT.n06[0] + .4 + i * .18, .14, -.2); for (let i = 0; i < 5; i++) paperTap(ph('n06', 1) + i * .12, .1, .3);
    // 5 sunrise chime, battery charges
    chime(NT.n07[1] + .05, [75, 79, 82, 87], .11);   // after the short line, not on it zap(NT.n08[0] + .2, .04, .6); paperTap(ph('n08', 2), .35);
    // 6 tyre hiss vs a new tyre pop
    noiseBurst(NT.n09[0], 1.2, 5000, 3000, .06, { q: 1 }); thump(ph('n09', 1), 80, .35, .3); stamp(ph('n09', 1) + .05);
    // 7 night, bars ticking for every night
    for (let i = 0; i < 7; i++) paperTap(ph('n10', 1) + i * .2, .14, (i - 3) / 4); chime(ph('n10', 2), [70, 75], .08);
    // 8 the cross on the piggy, coins into the jar, the close
    stamp(ph('n11', 1) + .05); for (let i = 0; i < 4; i++) chime(ph('n11', 2) + .55 + i * .35, [87 + i], .06); chime(NT.n11[1] + .15, [75, 79, 82, 87], .1);
  };
  return { BPM: 84, SEC, CH, CUT, cues };
};
