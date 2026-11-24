// config.js for the Short "เราใช้สมองแค่ 10% จริงหรือ?" (shorts_brain10.html). 1080 × 1920, 30 fps.
// Length = the placed narration (NARR_DUR in src/shorts/brain10/narration.js, from SHORT=brain10 scripts/shorts_voice.py).
const PROJECT = { duration: NARR_DUR, bpm: 92, offset: 0, w: 1080, h: 1920, fps: 30, audio: 'out/shorts/brain10/audio/mix.wav',
  fonts: ['400 40px "Kanit"', '500 40px "Kanit"', '600 60px "Kanit"', '700 100px "Kanit"', '800 120px "Kanit"'],
  setup: () => pcInit() };
