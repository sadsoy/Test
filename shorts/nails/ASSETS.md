# Assets — เล็บและผมยังยาวหลังเสียชีวิตจริงไหม?

## ใช้ซ้ำจากโปรเจกต์ (ไม่ได้แก้ไขระบบเดิม)

| ส่วน | ไฟล์ |
|---|---|
| Engine | `src/core.js`, `src/timeline.js`, `render.mjs` |
| Paper Cut kit | `src/shorts/paper.js` |
| Props กลาง | `src/shorts/props.js` (ท้องฟ้า, ดาว, ดวงจันทร์, เมฆ, ควัน) |
| ตัวละครและอุปกรณ์ | `src/shorts/sleepy/props.js` (ตัวละคร "อิ่ม", ก้อนน้ำตาล), `src/shorts/sweat/props.js` (รูปหยดน้ำ) |
| ซับไตเติลไทย | `src/shorts/subs_th.js` |
| Pipeline เสียงและ QC | `SHORT=nails` กับสคริปต์ `shorts_tts.py`, `shorts_voice.py`, `shorts_checkcuts.py`, `shorts_audio.mjs` |

## สร้างใหม่

| ไฟล์ | เนื้อหา |
|---|---|
| `shorts_nails.html`, `src/shorts/nails/config.js` | หน้าเรนเดอร์ |
| `src/shorts/nails/props.js` | ปลายนิ้ว (ผิวรอบเล็บร่นถอยได้ เล็บยาวคงที่ มีพระจันทร์เล็บและรอยข้อนิ้ว), ไม้บรรทัดวัดช่วง, คางกับตอหนวด (ผิวลดระดับได้), หัวใจ, เส้น ECG, โรงงานเปิดและปิดไฟได้, องุ่นที่กลายเป็นลูกเกด, หลอดครีม, แว่นขยาย |
| `src/shorts/nails/scenes.js` | 8 ช็อต |
| `src/shorts/nails/sound.mjs` | ดนตรี 88 BPM (D minor → F) และ SFX ประมาณ 50 จุด |
| `src/shorts/nails/narration.js` | เวลาของบรรทัด |
| `src/shorts/nails/phrases.js` | เวลาของวลี |
| `shorts/nails/lines.json` | บท |
| `shorts/nails/take.json` | คำขอ TTS |
| `shorts/nails/voice.json` | ค่าการวางเสียง |
| `shorts/nails/take1.wav` | เทคต้นฉบับ |

## ไฟล์ผลลัพธ์ (`out/shorts/nails/`, ไม่ commit)

| ไฟล์ | เนื้อหา |
|---|---|
| `nails_shorts.mp4` | ไฟล์หลัก |
| `nails_shorts_720p.mp4` | สำเนาสำหรับมือถือ |
| `audio/` | เสียงบรรยาย, ดนตรี, SFX และมิกซ์ |
| `frames/` | เฟรมทั้งหมด |

## สิทธิ์

| ส่วน | สิทธิ์ |
|---|---|
| ภาพ | วาดด้วยโค้ด |
| ฟอนต์ | Kanit (SIL OFL) |
| เสียงบรรยาย | Gemini TTS ควรตรวจข้อกำหนดก่อนเผยแพร่ |
| ดนตรีและ SFX | สังเคราะห์ในโปรเจกต์ |
