# ทำไมเราถึงเห็นดวงจันทร์เพียงด้านเดียว? · YouTube Shorts

| | |
|---|---|
| Video | `deliver/moon_one_side_shorts.mp4`: 1080×1920 (9:16), 30 fps, H.264 + AAC 192k, **39.83 s**, 46 MB |
| Preview | `deliver/moon_one_side_preview_540p.mp4` (540×960, 2.4 MB, for a phone) |
| Contact sheet | `deliver/contact_sheet.jpg`: one frame every 1.5 s |
| Style | Paper-cut illustration: every shape is a sheet of paper with a soft drop shadow, fibre grain, a lit top edge and parallax layers |

## 1. Narration script (Thai)

| # | Time (s) | Line | Visual role |
|---|---|---|---|
| L1 | 0.19–4.31 | ทำไมเราเห็นกระต่ายบนดวงจันทร์ได้ทุกคืน / แต่ไม่เคยเห็นด้านหลังของมันเลย? | Hook |
| L2 | 4.74–7.21 | ทั้งที่ดวงจันทร์ก็หมุนรอบตัวเองอยู่ตลอดเวลา | The question |
| L3 | 7.59–12.41 | ความลับคือ / มันหมุนรอบตัวเองหนึ่งรอบ / เท่ากับเวลาที่โคจรรอบโลกพอดี | Explanation |
| L4 | 12.69–14.47 | เลยหันหน้าเดิมเข้าหาเราเสมอ | Explanation |
| L5 | 15.05–20.42 | หลายพันล้านปีก่อน / มันเคยหมุนเร็วกว่านี้ / แต่แรงโน้มถ่วงของโลก ค่อย ๆ เบรกการหมุนไว้ | The cause |
| L6 | 20.75–24.53 | จนหน้าของมันถูกล็อกไว้กับโลก / เรียกว่า / การล็อกแบบไทดัล | Key point |
| L7 | 25.12–28.28 | แต่ด้านหลังไม่ได้มืดนะ / มันได้แสงอาทิตย์เท่ากับด้านหน้าเลย | Twist 1 (myth) |
| L8 | 28.71–32.72 | และเพราะดวงจันทร์ส่ายเล็กน้อย / เราจึงเห็นพื้นผิวได้ถึงห้าสิบเก้าเปอร์เซ็นต์ | Twist 2 (59%) |
| L9 | 33.25–38.79 | ครั้งหน้าที่มองดวงจันทร์ / อย่าลืมว่า / มันมองเรากลับมาด้วยหน้าเดิม มาหลายพันล้านปีแล้ว | Ending |

Facts checked: the moon's rotation equals its orbit (about 27.3 days, sidereal); tidal forces from Earth raised a bulge
on the moon and braked its spin until it locked (tidal locking); the far side gets the same sunlight (the "dark side" is a
myth); libration lets us see about 59% of the surface over time.

## 2. Storyboard

| Scene | Time (s) | Picture and movement | Transition out |
|---|---|---|---|
| S1 Hook | 0–4.45 | Opens tight on the paper moon; the camera pulls back to the night hill: a child points at the moon, the house light is on, clouds and stars on parallax layers. On "กระต่าย" the maria (the moon's dark seas) glow gold as the rabbit. On "ด้านหลัง" the moon tries to turn and **springs back**; a "?" and the "ด้านหลัง ?" label pop up. | Pushes into the moon and dissolves |
| S2 Spin | 4.45–7.45 | In space, a big moon makes one full turn on the line (the real maria slide round on a sphere and the cratered far side passes); gold arrows circle it; "หมุนรอบตัวเอง". | The moon shrinks onto its orbit (match cut) |
| S3 Spin = orbit | 7.45–14.8 | Top-down view: Earth turns and the dashed orbit unrolls; a rabbit sticker on the moon always faces Earth. Two dials pop in: "หมุนรอบตัวเอง 27.3 วัน" **=** "โคจรรอบโลก 27.3 วัน", their hands turning together. L4: a line of sight from an eye on Earth always lands on the same face. | A torn sheet of paper sweeps up |
| S4 Tidal lock | 14.8–24.85 | Warm palette: the young molten moon spins fast with speed streaks ("หลายพันล้านปีก่อน", "หมุนเร็วมาก!"). Earth's pull: teal arrows, the moon stretches into an egg (the bulge), "เบรก!". The spin slows smoothly until the face points at Earth while the colours cool. A padlock clicks shut; the "การล็อกแบบไทดัล / TIDAL LOCKING" stamp lands with a camera shake. | A torn sheet sweeps the other way |
| S5 Not dark | 24.85–28.45 | The far side is in darkness with a thin crescent; "ด้านมืด ?" is struck out in red. The sun swings in, the terminator sweeps across, the far side lights up fully: "ได้แสงเท่ากัน!" | Dissolve |
| S6 59% | 28.45–32.85 | The near side wobbles (libration in longitude and latitude); side arrows rock with it; a gold ring fills while the number counts **50% → 59%**. | Push into the moon, dissolve |
| S7 Ending | 32.85–39.83 | Back on the hill, the child stands and waves; the rabbit lights up again on "หน้าเดิม"; the camera pushes into the moon and ends on the **same frame as the opening**, so the Short loops seamlessly. | Loop |

## 3. Assets made for this video (all original, all made in code)

| Kind | File | What it holds |
|---|---|---|
| Engine | `src/engine.js` | A cut-paper renderer on Canvas2D: `cut()` (shadow, grain, lit edge), parallax camera, Thai type on paper backings |
| Illustration | `src/art.js` | Moon as a sphere with 14 real maria and craters (spin, libration, sunlit phase, molten young moon, rabbit glow), top-view moon, Earth, sun, sky, hills, house, trees, clouds, child (sitting, standing, waving), arrows, padlock, question mark, torn-paper wipe |
| Scenes | `src/scenes.js` | 7 scenes keyed to the phrase times |
| Subtitles | `src/subs.js` | Karaoke subtitles: Thai segmented with `Intl.Segmenter`, compounds never split, rows balanced, key words underlined in gold |
| Timing | `src/timing.js` (generated) | Line and phrase times |
| SFX cues | `src/cues.js` | 54 sound cues tied to the picture |
| Voice | `out/voice/full.wav` → `out/voice/narration.wav` | Gemini TTS (gemini-3.1-flash-tts-preview, voice Puck), one take; pauses tightened, ×1.08 |
| Music + SFX | `scripts/audio.mjs` → `out/audio/{music,sfx,mix}.wav` | Original score in D minor → F major at 96 BPM (pads, plucks, music box, bass, soft kick); 20 synthesized sound effects |
| Fonts | `assets/fonts/` | Kanit and Mitr (SIL OFL) |

Rebuild: `python3 scripts/tts_full.py` → `node scripts/split.mjs` → `node scripts/audio.mjs` →
`node ../../render.mjs --fps=30 --frames --workers=4` → `node ../../render.mjs --fps=30 --encode --out=out/video_noaudio.mp4`
→ ffmpeg mux with `out/audio/mix.wav` (run everything from `shorts/moon/`).

## 4. Quality-control report

| Check | Result |
|---|---|
| Length 30–40 s | 39.83 s ✅ |
| 1080×1920, 30 fps, MP4 (H.264 + AAC) | ✅ |
| Loudness | −14.1 LUFS integrated, peak −1.4 dBFS (YouTube's target) ✅ |
| Voice over music + SFX | At least **+8.8 dB** in the speech band on every phrase (median +17.6 dB) ✅. Before the fix it was +5.4 dB at 17.8–20.4 s; the hum, whirr and brake were lowered. |
| Picture vs voice | Picture, subtitles and SFX all run on `timing.js`, which comes from the narration file itself ✅ |
| Frame-to-frame jumps | Frame differences scanned across all 1,195 frames: the peaks are intended moves (spin, zooms, wipes). **Fixed:** the torn-paper wipe popped in already covering 40% of the frame (14.5 s, 24.6 s); it now rises in from below the frame. ✅ |
| Nothing important out of frame | Every key-word label sits in the top band, the subtitles at y≈1478 (clear of the Shorts UI on the right and at the bottom) ✅. **Fixed:** the subtitle card covered the child, so the land was raised 410 px; a cloud overlapped the moon; the "ด้านหลัง ?" label grew during the zoom. |
| Subtitles | **Fixed:** words broke mid-word (ดวง/จันทร์), so compounds are now kept together and rows balanced ✅ |
| Shapes stay consistent | Every element is drawn from fixed seeds as a function of t, so nothing changes shape between frames ✅ |
| Dead air | Pauses between lines are 0.2–0.5 s (longer only at scene changes); the 1 s tail is the loop back to the opening ✅ |
| Seamless loop | The final frame matches the opening (tight on the moon) ✅ |

Limits: Claude cannot listen to the audio. Levels, sync and timbre were checked by measurement only, so please listen once
before publishing.
Rights: the voice is Google Gemini TTS (prebuilt voice, under Google's terms); the music and SFX were synthesized here
with no samples; the fonts are OFL.
