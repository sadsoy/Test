// sound.mjs (sleepy): the score and sound cues of "ทำไมเราถึงรู้สึกง่วงหลังจากกินอาหาร?", for scripts/shorts_audio.mjs
// (SHORT=sleepy). The synth tools come from there. Sections follow the story: a playful hook and myth (a), a soft,
// floating "rest and digest" (b), the afternoon twist (c, suspended), and a bright, warm close (d). 96 BPM, in F.
export default ({ NT, ph, DUR }) => {
  const c = k => NT[k][0] - .12;
  const CUT = { c2: c('n02'), c3: c('n04'), c4: c('n06'), c5: c('n07'), c6: c('n08'), c7: c('n10'), c8: c('n11') };
  const SEC = { a: [0, CUT.c3], b: [CUT.c3, CUT.c6], c: [CUT.c6, CUT.c7], d: [CUT.c7, DUR] };
  const CH = {
    a: [[41, 53, 57, 60], [38, 50, 53, 57], [34, 46, 50, 53], [36, 48, 52, 55]],                       // F Dm Bb C
    b: [[34, 46, 50, 57], [41, 53, 57, 64], [38, 50, 57, 60], [36, 48, 55, 58], [34, 46, 53, 57]],    // Bbmaj7 Fmaj7 Dm7 C7sus Bb
    c: [[38, 50, 53, 57], [34, 46, 50, 53], [38, 50, 53, 57]],                                          // Dm Bb Dm
    d: [[41, 53, 57, 60], [36, 48, 52, 55], [38, 50, 53, 57], [34, 46, 50, 53], [41, 53, 57, 60, 65]],  // F C Dm Bb F
  };
  const cues = ({ noiseBurst, thump, paperTap, chime, zap, stamp, pluck }) => {
    // 1 hook: spoon taps while the plate empties, a heavy-eyelid "bonk", the question
    for (let i = 0; i < 4; i++) paperTap(.1 + i * .12, .28, (i % 2 ? .3 : -.3));
    const sleepy = ph('n01', 1); thump(sleepy, 70, .45, .45); noiseBurst(sleepy - .1, .5, 1200, 300, .14, { q: 2 });
    chime(ph('n01', 3) - .05, [72, 77, 81], .1);
    // 2 myth → truth
    noiseBurst(CUT.c2 - .2, .45, 300, 2000, .22); for (let i = 0; i < 6; i++) thump(ph('n02', 1) + i * .3, 60, .12, .2);
    stamp(NT.n03[0] - .03); chime(ph('n03', 1) + .2, [77, 81, 84], .09, .2);
    // 3 the switch, then the gut's messages
    noiseBurst(CUT.c3 - .2, .4, 2000, 400, .2); paperTap(ph('n04', 1), .5); thump(ph('n04', 1) + .05, 90, .3, .2);
    noiseBurst(NT.n05[0] - .3, .7, 300, 1500, .14, { q: .6 }); for (let i = 0; i < 3; i++) paperTap(NT.n05[0] + .2 + i * .55, .2, .2);
    chime(ph('n05', 1), [84, 88], .08);
    // 4 sugar cubes fall in; wake cells dim
    for (let i = 0; i < 6; i++) paperTap(NT.n06[0] + .4 + i * .18, .25, (i % 3 - 1) * .5);
    for (let i = 0; i < 9; i++) if (i % 3 !== 1) zap(ph('n06', 1) + .3 + i * .1, .03, .2);
    chime(ph('n06', 3), [69, 72, 76], .1, -.2);
    // 5 the plate grows, the dial swings
    noiseBurst(NT.n07[0], .6, 200, 800, .2, { q: .8 }); paperTap(ph('n07', 1), .35, -.3); paperTap(ph('n07', 2), .35, .3); thump(ph('n07', 3), 55, .5, .6);
    // 6 twist: the clock ticks to the afternoon, the plate is crossed out, the curve draws
    for (let i = 0; i < 10; i++) paperTap(NT.n08[0] + i * .2, .12, .4);
    stamp(ph('n08', 1) - .02); noiseBurst(NT.n09[0] - .2, .9, 400, 2400, .14, { q: .7 }); thump(ph('n09', 1) + .1, 60, .3, .5);
    // 7 tips: ticks for each, footsteps when walking
    for (const k of [1, 2, 3]) chime(ph('n10', k), [79 + k * 2], .1, (k - 2) * .3);
    for (let i = 0; i < 6; i++) paperTap(ph('n10', 3) + .3 + i * .45, .14, i % 2 ? .2 : -.2);
    // 8 close: the red "≠" card, a bright lift, the ending chord rings out (melody() plays it)
    stamp(ph('n11', 1) - .02); noiseBurst(ph('n11', 2) - .2, 1.2, 300, 3500, .16, { q: .5 }); chime(ph('n11', 2) + .1, [77, 81, 84, 89], .11);
  };
  return { BPM: 96, SEC, CH, CUT, cues };
};
