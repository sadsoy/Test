# Assets — นอนชดเชยวันหยุดทดแทนการอดนอนได้ไหม?

## ใช้ซ้ำจากโปรเจกต์ (ไม่ได้แก้ไขระบบเดิม)

| ส่วน | ไฟล์ |
|---|---|
| Engine | `src/core.js`, `src/timeline.js`, `render.mjs` |
| Paper Cut kit | `src/shorts/paper.js` |
| Props กลาง | `src/shorts/props.js`: ท้องฟ้า, ดาว, ดวงจันทร์, ดวงอาทิตย์, แบตเตอรี่ |
| ตัวละคร | `src/shorts/sleepy/props.js`: "อิ่ม" และตัว Z |
| ตาชั่งและหยดน้ำ | `src/shorts/sweat/props.js` |
| ซับไตเติลไทย | `src/shorts/subs_th.js` |
| Pipeline เสียงและ QC | `SHORT=sleepdebt` สำหรับ `shorts_tts.py`, `shorts_voice.py`, `shorts_checkcuts.py`, `shorts_audio.mjs` |

## สร้างใหม่

| ไฟล์ | เนื้อหา |
|---|---|
| `shorts_sleepdebt.html`, `src/shorts/sleepdebt/config.js` | หน้าเรนเดอร์ |
| `src/shorts/sleepdebt/props.js` | กราฟแท่ง 7 วัน (มีเส้นประเป้าหมายและแท่งเส้นประได้), เหรียญ, กระปุกหมู (ร้าวได้), กุญแจอินซูลินกับแม่กุญแจเซลล์, ตู้เย็นเปิดไฟ, ขนม 3 แบบ, ยางปะกับยางใหม่, เตียงพร้อมคนหลับ, โหลเหรียญกับต้นไม้ |
| `src/shorts/sleepdebt/scenes.js` | 8 ช็อต |
| `src/shorts/sleepdebt/sound.mjs` | ดนตรี 84 BPM ใน Eb และ SFX ประมาณ 60 จุด |
| `src/shorts/sleepdebt/narration.js`, `phrases.js` | เวลาของบรรทัดและวลี |
| `shorts/sleepdebt/lines.json`, `take.json`, `voice.json`, `take1.wav` | บท, คำขอ TTS, ค่าการวางเสียง, เทคต้นฉบับ |

## ผลลัพธ์ (`out/shorts/sleepdebt/`, ไม่ commit)

| ไฟล์ | เนื้อหา |
|---|---|
| `sleepdebt_shorts.mp4` | ไฟล์หลัก |
| `sleepdebt_shorts_720p.mp4` | สำเนาสำหรับมือถือ |
| `audio/` | ไฟล์เสียง |
| `frames/` | เฟรมทั้งหมด |

## สิทธิ์

| ส่วน | สิทธิ์ |
|---|---|
| ภาพ | วาดด้วยโค้ด |
| ฟอนต์ | Kanit (SIL OFL) |
| เสียงบรรยาย | Gemini TTS ควรตรวจข้อกำหนดก่อนเผยแพร่ |
| ดนตรีและ SFX | สังเคราะห์ในโปรเจกต์ |
