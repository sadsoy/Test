// phrases.js (sneeze): when each phrase of each narration line starts, in seconds from the start of its line on the TTS
// take (subs_th.js divides by NARR_TEMPO). Picked by hand from the pauses in each line's loudness envelope and checked
// against syllable counts (method: src/shorts/phrases.js). Take: shorts/sneeze/take1.wav.
const PHREL = {
  n01: [0.0, 1.23, 2.91],
  n02: [0.0, 1.07, 2.04],
  n03: [0.0, 1.99],
  n04: [0.0, 1.46, 2.22, 3.45],
  n05: [0.0, 2.22],
  n06: [0.0, 1.26],
  n07: [0.0, 1.41, 2.84],
  n08: [0.0, 1.38],
  n09: [0.0, 1.03, 2.27],
  n10: [0.0, 1.09],
  n11: [0.0, 0.95, 1.92],
};
