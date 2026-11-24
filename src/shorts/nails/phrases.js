// phrases.js (nails): when each phrase of each narration line starts, in seconds from the start of its line on the TTS
// take (subs_th.js divides by NARR_TEMPO). Picked by hand from the pauses in each line's loudness envelope and checked
// against syllable counts (method: src/shorts/phrases.js). Take: shorts/nails/take1.wav.
const PHREL = {
  n01: [0.0, 0.93, 1.96],
  n02: [0.0, 1.1, 2.44],
  n03: [0.0, 1.47],
  n04: [0.0, 1.31],
  n05: [0.0, 1.13],
  n06: [0.0, 1.41],
  n07: [0.0, 0.96],
  n08: [0.0, 1.44],
  n09: [0.0, 1.37, 3.16],
  n10: [0.0, 1.54, 2.85],
  n11: [0.0, 1.06, 2.3],
};
