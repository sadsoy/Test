// phrases.js: when each phrase of each narration line starts, in seconds from the start of its line, measured on the
// TTS take at its own speed (subs_th.js divides by NARR_TEMPO, so the table holds when scripts/shorts_voice.py changes
// the tempo or the gaps). Picked from the pauses in the loudness envelope (the frames where the voice resumes after a
// dip) and checked against the syllable count of each phrase; where two phrases run together with no pause (n01 ทั้งหมด,
// n07 ซีเมนต์ and และเรือ) the onset is placed by syllable rate. An automatic Gemini alignment was tried and drifted up
// to 1.5 s late, so these are set by hand. Take: out/shorts/voice/take/full4.wav.
// Re-check them whenever a line is re-recorded.
const PHREL = {
  n01: [0.0, 0.79, 1.68, 2.45, 2.75, 3.33],
  n02: [0.0, 0.63, 1.46, 2.42],
  n03: [0.0, 0.99, 1.68, 2.39, 3.52],
  n04: [0.0, 1.07, 2.42],
  n05: [0.0, 2.03, 3.21],   // starts at แต่: the tail of n04's ปี moved back to n04 (it had been cut mid-word)
  n06: [0.0, 1.43, 2.83],
  n07: [0.0, 0.44, 1.07, 1.57, 2.2],
  n08: [0.0, 1.07, 3.11, 3.52],
  n09: [0.0, 1.1, 2.28],
  n10: [0.0, 2.2, 3.11],
};
