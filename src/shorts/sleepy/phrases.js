// phrases.js (sleepy): when each phrase of each narration line starts, in seconds from the start of its line on the TTS
// take (subs_th.js divides by NARR_TEMPO). Picked by hand from the pauses in each line's loudness envelope and checked
// against syllable counts (see src/shorts/phrases.js for the method). Take: shorts/sleepy/take1.wav.
const PHREL = {
  n01: [0.0, 0.5, 1.35, 2.22],
  n02: [0.0, 0.77, 1.98],
  n03: [0.0, 0.91, 2.75],
  n04: [0.0, 1.4, 2.5],
  n05: [0.0, 1.84, 2.45],
  n06: [0.0, 1.18, 2.97, 3.66],
  n07: [0.0, 0.8, 1.4, 2.12],
  n08: [0.0, 1.21, 2.31],
  n09: [0.0, 1.07],
  n10: [0.0, 0.99, 1.98, 3.11, 3.85],
  n11: [0.0, 0.88, 1.87],
};
