// sound.mjs (nails): score and cues for "เล็บและผมยังยาวหลังเสียชีวิตจริงไหม?" (SHORT=nails scripts/shorts_audio.mjs).
// Sections: a spooky-playful hook and rumour (a), the clear biology (b), the reveal in suspense (c), a warm close (d).
// 88 BPM, D minor → F.
export default ({ NT, ph, DUR }) => {
  const c = k => NT[k][0] - .12;
  const CUT = { c2: c('n02'), c3: c('n03'), c4: c('n05'), c5: c('n06'), c6: c('n08'), c7: c('n09'), c8: c('n10') };
  const SEC = { a: [0, CUT.c3], b: [CUT.c3, CUT.c5], c: [CUT.c5, CUT.c8], d: [CUT.c8, DUR] };
  const CH = {
    a: [[38, 50, 53, 57], [34, 46, 50, 53], [36, 48, 51, 55], [33, 45, 49, 52]],                        // Dm Bb Cm A
    b: [[41, 53, 57, 60], [36, 48, 52, 55], [38, 50, 53, 57], [34, 46, 50, 53], [36, 48, 52, 55]],     // F C Dm Bb C
    c: [[38, 50, 53, 57], [34, 46, 50, 57], [38, 50, 53, 57], [33, 45, 49, 52]],                        // Dm Bbmaj7 Dm A
    d: [[41, 53, 57, 60], [34, 46, 50, 57], [36, 48, 52, 55], [38, 50, 53, 57], [41, 53, 57, 60, 65]],  // F Bbmaj7 C Dm F
  };
  const cues = ({ noiseBurst, thump, paperTap, chime, zap, stamp }) => {
    // 1 hook: a spooky swell, the calendar pages flip
    noiseBurst(.0, 1.6, 200, 900, .1, { q: 3 }); chime(ph('n01', 1), [62, 65, 69], .07, -.3);
    for (let i = 0; i < 3; i++) paperTap(ph('n01', 2) + i * ((NT.n01[1] - ph('n01', 2)) / 3), .3, .4);
    // 2 shiver, speech bubble, the question mark
    noiseBurst(NT.n02[0], .6, 4000, 2500, .08, { q: 2 }); paperTap(ph('n02', 1), .35, .3); chime(ph('n02', 2) + .2, [69, 74], .08);
    // 3 cells dividing (soft pops), blood flowing
    noiseBurst(CUT.c3 - .2, .45, 300, 2000, .18); for (let i = 0; i < 8; i++) paperTap(ph('n03', 1) + i * .28, .1, (i % 2 ? .3 : -.3));
    noiseBurst(NT.n04[0], 2.2, 150, 400, .08, { q: .8 });
    // 4 heartbeat, then the flat line and the factory switching off
    for (let i = 0; i < 2; i++) { thump(NT.n05[0] + i * .9, 60, .4, .25); thump(NT.n05[0] + .15 + i * .9, 55, .3, .25); }
    zap(ph('n05', 1), .05, .6); noiseBurst(ph('n05', 1) + .1, .8, 1200, 200, .14, { q: 1.2 }); stamp(ph('n05', 1) + .5);
    // 5 the magnifier slides, the reveal card
    noiseBurst(NT.n06[0], .9, 600, 1800, .1, { q: 1 }); stamp(ph('n07', 1) - .02); chime(ph('n07', 1) + .05, [74, 77, 81], .1);
    // 6 water leaves, the grape shrivels
    for (let i = 0; i < 5; i++) noiseBurst(NT.n08[0] + i * .35, .25, 3000, 1500, .05, { q: 3 }); noiseBurst(ph('n08', 1), 1.2, 800, 300, .12, { q: .7 });
    // 7 skin slides back, stubble shows
    noiseBurst(NT.n09[0] + .2, 1.0, 900, 400, .1, { q: .8 }); noiseBurst(ph('n09', 1), 1.0, 900, 400, .1, { q: .8 }); paperTap(ph('n09', 2), .35);
    // 8 cream squeeze, the summary cards
    noiseBurst(ph('n10', 1), .5, 500, 300, .14, { q: 1.5 }); stamp(ph('n11', 1) + .18); chime(ph('n11', 2) + .2, [77, 81, 84], .1); chime(NT.n11[1] + .15, [77, 81, 84, 89], .1);
  };
  return { BPM: 88, SEC, CH, CUT, cues };
};
