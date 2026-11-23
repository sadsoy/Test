// phrases.js: the onset (s) of each phrase of each narration line, for the karaoke subtitles and the beats of the
// animation (subs_th.js ph()). Picked from the pauses in the loudness envelope of out/shorts/audio/narration.wav (the
// frames where the voice resumes after a dip) and checked against the syllable count of each phrase; where two phrases
// run together with no pause (n01 ทั้งหมด, n07 ซีเมนต์ and และเรือ) the onset is placed by syllable rate.
// An automatic Gemini alignment was tried and drifted up to 1.5 s late, so these are set by hand. Re-check them whenever
// scripts/shorts_voice.py is run again.
const PHON = {
  n01: [0.25, 0.82, 1.85, 2.42, 2.80, 3.22],
  n02: [4.26, 4.86, 5.84],
  n03: [6.49, 6.92, 7.69],
  n04: [11.39, 12.46, 13.79],
  n05: [14.67, 16.27, 17.44],
  n06: [19.11, 20.28, 21.74],
  n07: [23.57, 23.80, 24.17, 24.60, 25.07],
  n08: [26.05, 27.08, 28.98, 29.45],
  n09: [30.88, 31.75, 32.92],
  n10: [34.90, 36.86, 37.70],
};
