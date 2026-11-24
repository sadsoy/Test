// phrases.js (sweat): when each phrase of each narration line starts, in seconds from the start of its line on the TTS
// take (subs_th.js divides by NARR_TEMPO). Picked by hand from the pauses in each line's loudness envelope and checked
// against syllable counts (method: src/shorts/phrases.js). Take: shorts/sweat/take1.wav.
const PHREL = {
  n01: [0.0, 1.18, 2.23],
  n02: [0.0, 0.99],
  n03: [0.0, 1.79, 2.86],
  n04: [0.0, 1.18, 2.28],
  n05: [0.0, 0.66],
  n06: [0.0, 1.43, 2.28],
  n07: [0.0, 1.35, 2.67, 3.93],
  n08: [0.0, 1.21, 2.34],
  n09: [0.0, 1.02, 2.64],
  n10: [0.0, 1.46, 2.5],
  n11: [0.0, 0.96, 2.01],
};
