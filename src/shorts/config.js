// config.js for the Short "ถ้าโลกเปลี่ยนไปใช้พลังงานสะอาดทั้งหมด?" (shorts.html). 1080 × 1920, 30 fps.
// Length = the placed narration (src/shorts/narration.js, from scripts/shorts_voice.py), cut to 39.9 s.
const PROJECT = { duration: 39.9, bpm: 100, offset: 0, w: 1080, h: 1920, fps: 30, audio: 'out/shorts/audio/mix.wav',
  fonts: ['400 40px "Kanit"', '500 40px "Kanit"', '600 60px "Kanit"', '700 100px "Kanit"', '800 120px "Kanit"'],
  setup: () => pcInit() };
