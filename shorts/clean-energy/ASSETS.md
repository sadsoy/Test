# Assets — สิ่งที่สร้างใหม่และสิ่งที่นำกลับมาใช้

## นำกลับมาใช้จากโปรเจกต์เดิม (ระบบหลักไม่ได้เปลี่ยน)

| ส่วน | ไฟล์ | ใช้ทำอะไรในคลิปนี้ |
|---|---|---|
| Engine | `src/core.js` | ฟังก์ชันจังหวะเวลา (`seg`, `kf`, `ease`, `backOut`, `shakeXY`, `mixCol`), paper grain และ vignette ที่ทับทั้งเฟรม, `flushBrush`, `renderAt`, `renderSheet`, และ hook `drawOverlay` ที่ซับไตเติลใช้ |
| Timeline | `src/timeline.js` | รายการช็อต (`shots`), dissolve ระหว่างช็อต และ `XFADE_AT` สำหรับตัดตรงหรือเปลี่ยนความยาว dissolve เป็นรายจุด |
| Renderer | `render.mjs` | ทำ contact sheet, strip ทุกเฟรม, เรนเดอร์เฟรมแบบขนานที่ต่อจากเดิมได้, และ encode |
| วิธีทำงาน | `.claude/skills/code-video` | ขั้นตอน storyboard → ฉาก → review loop → render และ gotchas ต่างๆ |
| แนวทางเสียง | `scripts/sfx.mjs`, `scripts/mix.mjs` | ต้นแบบของการสังเคราะห์เสียงด้วย noise และ filter, การ duck ดนตรีใต้เสียงพูด และ loudnorm สองรอบ |
| TTS | `scripts/tts_dialog.py` | ใช้รูปแบบ request ของ Gemini TTS เดียวกัน |

### แก้ไขระบบเดิมเท่าที่จำเป็น (ใช้กับไฟล์เดิมได้เหมือนเดิม)

- `src/core.js`
  - `W`/`H` อ่านจาก `PROJECT.w/h` ถ้าไม่ได้ตั้งค่าไว้ จะใช้ 1920×1080 ตามเดิม
  - setup โหลดฟอนต์จาก `PROJECT.fonts` เพิ่มได้
  - เรียก `PROJECT.setup` ได้
- `render.mjs`
  - เพิ่ม `--page=` เพื่อเรนเดอร์หน้าอื่นนอกจาก `studio.html` (ค่าเริ่มต้นยังเป็น `studio.html`)
  - เพิ่ม `--framesdir=`
  - ตั้งขนาด viewport ตามหน้าที่เรนเดอร์

`studio.html` และหนังเรื่อง "ต้นกับทะเล" ยังเรนเดอร์ได้เหมือนเดิม

## สร้างใหม่

### ภาพ (Paper Cut kit และฉาก)

| ไฟล์ | เนื้อหา |
|---|---|
| `shorts.html`, `src/shorts/config.js` | หน้าเรนเดอร์ขนาด 1080×1920 ที่ 30 fps ใช้ฟอนต์ Kanit |
| `src/shorts/paper.js` | ชุดเครื่องมือ Paper Cut: ชั้นกระดาษ (`cut`), เงานุ่มตามความสูงของชั้น, texture เส้นใยกระดาษ, ขอบไฮไลต์, กล้อง parallax (`pcCam`, `layer`), แสงเรือง (`shine`), สายและท่อ (`strip`), สายไฟห้อย (`sag`), พลังงานวิ่งตามเส้น (`pulses`) และตัวอักษรกระดาษ (`ptext`, `tag`) |
| `src/shorts/props.js` | ฉากและวัตถุ 30 ชนิด: ท้องฟ้า, เมฆ, ควันและไอน้ำ, ดวงอาทิตย์, ดวงจันทร์, ดาว, ปล่องลายขาวแดง, หอหล่อเย็นทรงเอว, โรงไฟฟ้าถ่านหิน, โรงกลั่น (ถัง, หอกลั่น, ไฟเผาก๊าซ), ปั๊มน้ำมันโยกหัว, รถยนต์และรถ EV, รถบัสไฟฟ้า, รถไฟ, เครื่องบิน, เรือสินค้า, เตาหลอมเหล็ก, เตาเผาซีเมนต์, กังหันลม 3 ใบพัด, แถวแผงโซลาร์บนขา, ตู้แบตเตอรี่พร้อมระดับประจุ, เสาส่งไฟ, อาคารที่มีหน้าต่างและโซลาร์บนหลังคา, ต้นไม้, ก้อนแร่, เหมืองเปิด และโลก (ทวีปหมุนได้ เปลี่ยนจากสีควันเป็นสีสะอาด) |
| `src/shorts/clean_energy.js` | 8 ช็อต (Hook, Setup, Escalation, Turning point ×3, Conclusion ×2), sheet wipe และป้าย "ข้อมูลปัจจุบัน" / "สถานการณ์สมมติ" |
| `src/shorts/subs_th.js` | ซับไตเติลภาษาไทยแบบ karaoke ไล่ทีละวลี และฟังก์ชัน `ph()` ที่ให้ภาพเข้าจังหวะคำพูด |

### เสียง

| ไฟล์ | เนื้อหา |
|---|---|
| `scripts/shorts_tts.py` | Gemini TTS ผ่าน Gemini API (ไม่ต้องใช้ gcloud) |
| `scripts/shorts_transcribe.py` | ถอดเสียงเพื่อตรวจว่าอ่านถูกตามบท |
| `scripts/shorts_voice.py` | ตัดเทคเดียวเป็นบรรทัด ตัดเงียบ เร่ง 1.25 เท่า วางลง timeline แล้วสร้าง `src/shorts/narration.js` |
| `src/shorts/phrases.js` | เวลาเริ่มของแต่ละวลี ตรวจกับ envelope และจำนวนพยางค์ |
| `scripts/shorts_audio.mjs` | สังเคราะห์ดนตรีต้นฉบับ (100 BPM, 4 ช่วงตามโครงเรื่อง: pad, เสียงจังหวะเครื่องจักร, arpeggio แบบดีด (Karplus–Strong), เปียโนต่ำ, กลอง) และ SFX ประมาณ 70 จุดที่ผูกกับจังหวะเดียวกับภาพ จากนั้นมิกซ์ที่ −14 LUFS |
| `shorts/clean-energy/lines.json` | บทบรรยาย 10 บรรทัด |

### ไฟล์ที่ได้จากการผลิต (อยู่ใน `out/`, ไม่ commit)

| ไฟล์ | เนื้อหา |
|---|---|
| `out/shorts/voice/take/full3.wav` | เทคบรรยายดิบ |
| `out/shorts/audio/narration.wav` | บรรยายที่วางลง timeline แล้ว |
| `out/shorts/audio/music.wav` | ดนตรี |
| `out/shorts/audio/sfx.wav` | เสียงประกอบ |
| `out/shorts/audio/mix.wav` | เสียงมิกซ์สุดท้าย |
| `out/shorts/frames/` | 1,197 เฟรม |
| `out/shorts/clean-energy_shorts.mp4` | วิดีโอสุดท้าย |

## สิทธิ์ของเสียงและภาพ

| ส่วน | ที่มาและสิทธิ์ |
|---|---|
| ภาพ | วาดด้วยโค้ดทั้งหมด ไม่มีภาพจากภายนอก |
| ฟอนต์ | Kanit (Google Fonts, SIL Open Font License) |
| เสียงบรรยาย | เสียงสำเร็จรูปของ Google Gemini TTS ใช้ตามข้อกำหนดของ Gemini API ควรตรวจข้อกำหนดก่อนเผยแพร่ |
| ดนตรีและ SFX | สังเคราะห์ด้วยโค้ดในโปรเจกต์นี้ ไม่มีแซมเปิล |
