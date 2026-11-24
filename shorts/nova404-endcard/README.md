# NOVA 404 end card (กดติดตาม)

A 3.8 s subscribe end card built from the NOVA 404 brand kit (`src/nova_brand.js`, from `brand_identity/templates/`,
run on this engine through `src/nova_adapter.js`). The portal opens, the wordmark builds, a paper "กดติดตาม" button
pops, is pressed, turns to "ติดตามแล้ว ✓" and its bell rings. Voice: "ฝากกดติดตาม โนวา สี่ศูนย์สี่ ไว้ด้วยนะ"
(Gemini TTS, voice Puck, the moon Short's voice). There is no "next clip" line.

- `deliver/nova404_endcard.mp4`: 1080×1920, 30 fps, AAC 48 kHz stereo, −14 LUFS: append it to any Short.
- `assets/nova404_icon_dark.png`: the brand bug, from `brand_identity/logo/png/`.

Branding an existing Short without changing its content: the logo goes in at x 976, y 132, 68 px across, 90 % opacity
(brand guidelines p. 10), then the end card is appended:

```bash
ffmpeg -i IN.mp4 -i shorts/nova404-endcard/assets/nova404_icon_dark.png -i shorts/nova404-endcard/deliver/nova404_endcard.mp4 \
  -filter_complex "[1:v]scale=68:68:flags=lanczos,format=rgba,colorchannelmixer=aa=0.9[logo];[0:v][logo]overlay=942:98:format=auto,format=yuv420p,setsar=1[mv];[2:v]format=yuv420p,setsar=1[ev];[0:a]aresample=48000[ma];[2:a]aresample=48000[ea];[mv][ma][ev][ea]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 17 -r 30 -c:a aac -b:a 192k -movflags +faststart OUT_nova404.mp4
```
