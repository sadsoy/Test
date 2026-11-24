// config.js for the Short "นอนชดเชยวันหยุดทดแทนการอดนอนได้ไหม?" (shorts_sleepdebt.html). 1080 × 1920, 30 fps.
// Length = the placed narration (NARR_DUR in src/shorts/sleepdebt/narration.js, from SHORT=sleepdebt scripts/shorts_voice.py).
const PROJECT = { duration: NARR_DUR, bpm: 84, offset: 0, w: 1080, h: 1920, fps: 30, audio: 'out/shorts/sleepdebt/audio/mix.wav',
  fonts: ['400 40px "Kanit"', '500 40px "Kanit"', '600 60px "Kanit"', '700 100px "Kanit"', '800 120px "Kanit"'],
  setup: () => pcInit() };
