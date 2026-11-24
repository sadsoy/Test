# Assets — ทำไมเราไม่ควรกลั้นจาม?

## ใช้ซ้ำจากโปรเจกต์ (ไม่ได้แก้ระบบเดิม)

| ส่วน | ไฟล์ |
|---|---|
| Engine | `src/core.js`, `src/timeline.js`, `render.mjs` |
| Paper Cut kit | `src/shorts/paper.js` |
| Props กลาง | `src/shorts/props.js` |
| ตัวละคร "อิ่ม", สมอง, หน้าปัดเกจ | `src/shorts/sleepy/props.js` |
| ป้ายเตือน | `src/shorts/sweat/props.js` |
| แว่นขยาย | `src/shorts/nails/props.js` |
| ซับไตเติลไทย | `src/shorts/subs_th.js` |
| Pipeline เสียงและ QC | `SHORT=sneeze` ใช้กับ `shorts_tts.py`, `shorts_voice.py`, `shorts_checkcuts.py`, `shorts_audio.mjs` |

## สร้างใหม่

| ไฟล์ | เนื้อหา |
|---|---|
| `shorts_sneeze.html`, `src/shorts/sneeze/config.js` | หน้าเรนเดอร์ |
| `src/shorts/sneeze/props.js` | ฝุ่นละออง, มือบีบจมูก, แก้มป่อง, แผนภาพทางเดินหายใจ (ดูรายละเอียดด้านล่าง), ละอองจาม (หยุดที่แขนเสื้อได้), แขนปิดจาม, ทิชชู่, การ์ดรายงาน |
| `src/shorts/sneeze/scenes.js` | 8 ช็อต |
| `src/shorts/sneeze/sound.mjs` | ดนตรี 100 BPM ใน C และ SFX ประมาณ 45 จุด |
| `src/shorts/sneeze/narration.js`, `phrases.js` | เวลาของบรรทัดและวลี |
| `shorts/sneeze/lines.json`, `take.json`, `voice.json`, `take1.wav` | บท, คำขอ TTS, ค่าการวางเสียง, เทคต้นฉบับ |

แผนภาพทางเดินหายใจประกอบด้วย:
- หัวด้านข้างที่มีกะโหลก สมอง จมูก และปาก
- ช่องจมูก ช่องปาก คอ และหลอดลม
- ปอดที่พองได้
- ลิ้นปิดคอ
- ลูกศรแรงดัน
- จุกก๊อก
- ละอองพุ่งออก
- เครื่องหมายรอยฉีก

## ผลลัพธ์ (`out/shorts/sneeze/`, ไม่ commit)

| ไฟล์ | เนื้อหา |
|---|---|
| `sneeze_shorts.mp4` | ไฟล์หลัก |
| `sneeze_shorts_720p.mp4` | สำเนาสำหรับดูบนมือถือ |
| `audio/` | เสียงทั้งหมด |
| `frames/` | เฟรม |

## สิทธิ์

| ส่วน | สิทธิ์ |
|---|---|
| ภาพ | วาดด้วยโค้ด |
| ฟอนต์ | Kanit (SIL OFL) |
| เสียงบรรยาย | Gemini TTS ควรตรวจข้อกำหนดก่อนเผยแพร่ |
| ดนตรีและ SFX | สังเคราะห์ในโปรเจกต์ |
