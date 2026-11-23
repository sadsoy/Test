// phrases.js: when each phrase of each narration line starts, in seconds from the start of its line, measured on the
// TTS take at its own speed (subs_th.js divides by NARR_TEMPO, so the table holds when scripts/shorts_voice.py changes
// the tempo or the gaps). Picked from the pauses in the loudness envelope (the frames where the voice resumes after a
// dip) and checked against the syllable count of each phrase; where two phrases run together with no pause (n01 ทั้งหมด,
// n07 ซีเมนต์ and และเรือ) the onset is placed by syllable rate. An automatic Gemini alignment was tried and drifted up
// to 1.5 s late, so these are set by hand. n02 is its own take (out/shorts/voice/take/n02b.wav).
// Re-check them whenever a line is re-recorded.
const PHREL = {
  n01: [0.0, 0.71, 2.0, 2.71, 3.19, 3.71],
  n02: [0, 0.53, 1.27, 2.37],
  n03: [0.0, 0.54, 1.5],
  n04: [0.0, 1.34, 3.0],
  n05: [0.0, 2.0, 3.46],
  n06: [0.0, 1.46, 3.29],
  n07: [0.0, 0.29, 0.75, 1.29, 1.88],
  n08: [0.0, 1.29, 3.66, 4.25],
  n09: [0.0, 1.09, 2.55],
  n10: [0.0, 2.45, 3.5],
};
