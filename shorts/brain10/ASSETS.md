# Assets — เราใช้สมองแค่ 10% จริงหรือ?

## ใช้ซ้ำจากโปรเจกต์

| ส่วน | ไฟล์ |
|---|---|
| Engine | `src/core.js`, `src/timeline.js`, `render.mjs` |
| Paper Cut kit | `src/shorts/paper.js` |
| Props กลาง | `src/shorts/props.js`: ท้องฟ้า, ดาว, ดวงจันทร์, สายฟ้า |
| ตัวละครและอุปกรณ์จากคลิปง่วงหลังกิน | `src/shorts/sleepy/props.js`: ตัวละคร "อิ่ม", สมองแบบเดิม, ตัว Z |
| ซับไตเติลไทย | `src/shorts/subs_th.js` |
| Pipeline เสียงและ QC | `SHORT=brain10`: `shorts_tts.py`, `shorts_voice.py`, `shorts_checkcuts.py`, `shorts_audio.mjs` |

ไม่มีการแก้ไขระบบเดิมเลยในคลิปนี้

## สร้างใหม่สำหรับคลิปนี้

| ไฟล์ | เนื้อหา |
|---|---|
| `shorts_brain10.html`, `src/shorts/brain10/config.js` | หน้าเรนเดอร์ |
| `src/shorts/brain10/props.js` | สมองตัวเอก (กลีบหน้า, กลีบข้าง, กลีบท้ายทอย, กลีบขมับ, สมองน้อย, ก้านสมอง; แต่ละกลีบสว่างแยกกันได้; ตาลืมหรือหลับ; ปาก), วงแหวนเครื่องสแกน, เซลล์ประสาท, เส้นคลื่นสมอง EEG (สงบ → ชัก), เครื่องดนตรี 5 ชิ้น, แม่กุญแจ |
| `src/shorts/brain10/scenes.js` | 8 ช็อต |
| `src/shorts/brain10/sound.mjs` | ดนตรี 92 BPM (A minor → C) และ SFX ประมาณ 80 จุด |
| `src/shorts/brain10/narration.js`, `phrases.js` | เวลาของแต่ละบรรทัดและแต่ละวลี |
| `shorts/brain10/lines.json`, `take.json`, `voice.json`, `take1.wav` | บท, คำขอ TTS, ค่าการวางเสียง, เทคต้นฉบับ |

## ไฟล์ผลลัพธ์ (`out/shorts/brain10/`, ไม่ commit)

| ไฟล์ | เนื้อหา |
|---|---|
| `brain10_shorts.mp4` | ไฟล์หลัก |
| `brain10_shorts_720p.mp4` | สำเนาสำหรับมือถือ |
| `audio/` | เสียงบรรยาย, ดนตรี, SFX, มิกซ์ |
| `frames/` | เฟรมทั้งหมด |

## สิทธิ์

| ส่วน | สิทธิ์ |
|---|---|
| ภาพ | วาดด้วยโค้ด |
| ฟอนต์ | Kanit (SIL OFL) |
| ไอคอน emoji ในฉากสแกน | Noto Color Emoji (SIL OFL) |
| เสียงบรรยาย | Gemini TTS ควรตรวจข้อกำหนดก่อนเผยแพร่ |
| ดนตรีและ SFX | สังเคราะห์ในโปรเจกต์ |
