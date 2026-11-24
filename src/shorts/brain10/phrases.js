// phrases.js (brain10): when each phrase of each narration line starts, in seconds from the start of its line on the TTS
// take (subs_th.js divides by NARR_TEMPO). Picked by hand from the pauses in each line's loudness envelope and checked
// against syllable counts (method: src/shorts/phrases.js). Take: shorts/brain10/take1.wav.
const PHREL = {
  n01: [0.0, 1.9],
  n02: [0.0, 2.16, 3.28],
  n03: [0.0, 1.46, 2.46],
  n04: [0.0, 0.82, 2.02],
  n05: [0.0, 2.16],
  n06: [0.0],
  n07: [0.0, 2.05],
  n08: [0.0, 1.49, 2.77],
  n09: [0.0, 1.68],
  n10: [0.0, 2.32],
  n11: [0.0, 1.68],
};
