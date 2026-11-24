// phrases.js (sleepdebt): when each phrase of each narration line starts, in seconds from the start of its line on the
// TTS take (subs_th.js divides by NARR_TEMPO). Picked by hand from the pauses in each line's loudness envelope and checked
// against syllable counts (method: src/shorts/phrases.js). Take: shorts/sleepdebt/take1.wav.
const PHREL = {
  n01: [0.0, 1.86, 2.76],
  n02: [0.0, 1.03, 2.68, 3.3],
  n03: [0.0, 2.99],
  n04: [0.0, 0.8, 2.45],
  n05: [0.0, 1.64],
  n06: [0.0, 1.35, 2.42],
  n07: [0.0],
  n08: [0.0, 2.15, 3.91],
  n09: [0.0, 1.49],
  n10: [0.0, 1.07, 2.56],
  n11: [0.0, 0.95, 2.68],
};
