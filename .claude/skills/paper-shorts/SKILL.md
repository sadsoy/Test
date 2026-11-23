---
name: paper-shorts
description: Make a complete 30–60 s vertical (9:16, 1080×1920, 30 fps) explainer video in a cut-paper illustration + motion-graphics style, entirely in code — research, Thai (or any language) narration via Gemini TTS, storyboard, Canvas2D paper-cut scenes, karaoke subtitles, synthesized music and SFX, mix, render, QC and delivery. Use for "YouTube Shorts", "TikTok", "Reels", "คลิปสั้น", "ทำ Shorts", "อธิบายเรื่อง ... ในคลิปสั้น", "paper cut", "กระดาษตัด", or to revise such a video. For hand-painted, character-acted films and MVs use code-video instead.
---

# Paper Shorts

The method behind "ทำไมเราถึงเห็นดวงจันทร์เพียงด้านเดียว?" (`shorts/moon/`, 2026-11). The user approved the result
and asked for it to be kept as a skill. Look at `assets/example/moon/contact_sheet.jpg` and
`assets/example/moon/DELIVERY.md` first: that is the bar.

The look: every shape is a sheet of paper with a soft drop shadow, fibre grain, a lit top-left edge and a dark lower
edge; layers have parallax; colour changes from scene to scene. Every frame is a pure function of `t`.

**Core rule: every narrated phrase gets a visual beat that explains it** (an object moves, transforms, locks, counts,
lights up). Motion without meaning is cut. Typography is for keywords only (one label at a time, top band).

## Setup (new project, about 2 minutes)

```bash
P=shorts/<slug>; mkdir -p $P/{src,scripts,assets/fonts,out/voice,deliver}
cp -r .claude/skills/paper-shorts/assets/kit/. $P/
cp .claude/skills/paper-shorts/assets/example/moon/{art.js,scenes.js,cues.js} $P/src/   # starting points, rewrite them
cd $P && npm init -y >/dev/null && npm i @fontsource/kanit @fontsource/mitr
for f in kanit-thai-400 kanit-thai-700 kanit-thai-800 kanit-latin-400 kanit-latin-700 kanit-latin-800 mitr-thai-500 mitr-latin-500; do n=${f%%-*}; cp node_modules/@fontsource/$n/files/$f-normal.woff2 assets/fonts/; done
```

- Rendering reuses the repo's root `render.mjs` (puppeteer, run `npm i` at the repo root once). Run it **from the
  project folder** with `--fps=30`: `node ../../render.mjs --fps=30 ...`. It loads `studio.html` from the current
  directory; the page provides `renderAt`, `renderSheet`, `DUR`, `PROJECT.audio`.
- Kit files: `src/engine.js` (renderer, generic, do not fork), `src/main.js` (scene switch, transitions table `TRANS`,
  render hooks), `src/subs.js` (karaoke subs; edit `SUBT`, `SUB_SPOKEN`, `SUB_KEY`, `SUB_KEEP`),
  `scripts/tts_full.py`, `scripts/split.mjs` (edit `PHR`, `AFTER`, `TEMPO`), `scripts/audio.mjs` (edit the `sec(...)`
  section plan and `MELO`; SFX library and mix are generic).
- `art.js` from the example is a prop library: sphere projection with real lunar maria, Earth, sun, night sky, space
  strata, hills, tree, house, cloud, child silhouette (sit/point, stand/wave), arc arrows, padlock, question mark,
  torn-paper wipe. Keep what fits, add new props in the same `cut()` style.

## Workflow (do not stop for approval between steps; make creative calls yourself)

1. **Research** the topic; list 3–5 checkable facts and one or two surprising twists (a myth to bust, a number).
   Write them into DELIVERY.md later.
2. **Script** in `scripts/lines.json`: 8–10 lines, Hook (≤4 s, a question with a concrete image) → question → explain
   → cause → twist(s) → ending that pays off the hook. Budget: Thai TTS speaks about 7–8 syllables/s; aim for 33–36 s
   of speech for a 40 s cut. Put spaces where phrases should break: the TTS pauses there, and the pauses become the
   subtitle and beat boundaries.
3. **Voice**: `python3 scripts/tts_full.py` records the WHOLE script in one request (consistent voice, natural flow,
   one quota unit). Then `node scripts/split.mjs`: it finds the speech phrases with silencedetect, checks the count
   against `PHR`, tightens pauses (0.1 s inside a line, `AFTER[i]` after each line, more at scene changes), applies
   `TEMPO` (≤1.1) and writes `out/voice/narration.wav` and `src/timing.js` (`TL.lines[i].ph` = phrase times).
   If the phrase count does not match, read the silencedetect list and fix `PHR` (merged phrases are normal).
4. **Storyboard** (in DELIVERY.md): one table row per scene with time, picture, movement, and the transition out.
   Plan match cuts on a recurring object (zoom into it, shrink it into the next diagram), torn-paper wipes for palette
   changes, and end on the opening frame so the Short loops.
5. **Scenes** in `src/scenes.js`: one function per scene, `setCam(...kf(t, keys, ease5))`, then `layer(par, fn)`
   back to front. Time every beat from `ph(id, i)` and `wordAt(id, i, 'word')`, never hard-coded seconds. Register
   `SCENES = [[t0, fn], ...]` and the transitions in `main.js` `TRANS`.
6. **Sound cues** in `src/cues.js`: one cue per visible event (pop, shimmer, whoosh, wipe, whirr, hum, brake, click,
   stamp, swipe, swell, tick, ding, chime). Then `node scripts/audio.mjs` (it reads `window.CUES` from the page,
   synthesizes the score and SFX, ducks the music under the voice, and normalises to −14 LUFS / −1.5 dBTP in two
   passes).
7. **Review loop** (below) until clean, then **render**:
   ```bash
   rm -rf out/frames && node ../../render.mjs --fps=30 --frames --workers=4     # background; ~50 ms/frame
   node ../../render.mjs --fps=30 --encode --out=out/video_noaudio.mp4
   ffmpeg -y -i out/video_noaudio.mp4 -i out/audio/mix.wav -map 0:v -map 1:a -c:v copy -af apad -c:a aac -b:a 192k -shortest -movflags +faststart deliver/<slug>_shorts.mp4
   ffmpeg -y -i deliver/<slug>_shorts.mp4 -vf scale=540:960 -c:v libx264 -crf 26 -preset veryfast -c:a aac -b:a 128k -movflags +faststart deliver/<slug>_preview_540p.mp4
   ```
   To fix a few scenes after a full render, delete only those frame numbers (`out/frames/fNNNNN.jpg`, frame = t×30)
   and re-run `--frames`: it resumes.
8. **QC** (all of it, every time; see `references/qc.md` for the commands) and **deliver**: DELIVERY.md with the
   script and timings, storyboard, assets list, QC table (what was checked, what was found and fixed), rights notes.
   Send the 540p preview and the master with SendUserFile, and commit and push.

## Review loop

```bash
node ../../render.mjs --fps=30 --sheet=t1,t2,...,t12 --cols=6 --w=300 --out=out/check/a.jpg       # one frame per beat
node ../../render.mjs --fps=30 --sheet=t1,t2 --crop=x,y,w,h --w=400 --out=out/check/detail.jpg   # full-res details
node ../../render.mjs --fps=30 --strip=a:b --cols=7 --w=150 --out=out/check/move.jpg             # every frame of a move
```
Read each image yourself. Check:
- Does each phrase read as its own action?
- Is the key-word label in the top band (screen y 200–600)?
- Is anything under the subtitle card (y about 1400–1560)?
- Is anything off-frame, or under the Shorts UI (right edge x>960 between y 900–1700; bottom 300 px)?
- Do pops and wipes enter from off-screen?

## Lessons (learned the hard way)

- **Gemini TTS**: reached through `generativelanguage.googleapis.com` (the proxy injects the key; send
  `x-goog-api-key: dummy`).
  - Free tier is **10 requests per day per model**, so record the whole script in one request.
  - **Never prefix the text with a style instruction**, in Thai or in English: it gets read aloud. Send only the
    script.
  - The response may be `audio/wav` (RIFF) or raw `audio/l16; rate=24000`; handle both.
  - Voice `Puck` worked well for Thai.
- **Subtitle words**: `Intl.Segmenter('th')` splits compounds (ดวง|จันทร์), so keep them whole with `SUB_KEEP`.
  Balance two rows; never break a row mid-word. Show digits on screen ("59%") but time them by the spoken form
  (`SUB_SPOKEN`).
- **Subtitles vs art**: they sit at y≈1478. Raise landscapes and characters so they sit above that band; they hid the
  child in the first pass.
- **Wipes**: a full-screen torn sheet must start entirely below the frame (`y = H*1.5 + margin`), or it pops in
  already covering part of it. The frame-diff scan finds this.
- **Labels inside a zooming layer** scale with the camera: fade them out before the zoom, or put them in `layer(0)`.
- **Clouds and front layers** must not cross the hero object. Big translucent "nebula blobs" read as mud; use slanted
  paper strata instead.
- **Stickers and markers** on a disc must stay inside its radius (scale about R/190, offset 0.5R).
- **Silhouette limbs** must point clearly away from the head (about −0.8 rad up-right), or they disappear into it.
- **Mix**: low rumbles and whirrs under speech mask it. Keep the speech-band (300 Hz–4 kHz) voice-over-bed ratio at
  **8 dB or more** on every phrase; lower the SFX (`LEVEL`) rather than raising the voice.
- **ffmpeg filter options** need leading zeros (`d=0.5`, not `d=.5`).
- **Sleeping**: never chain sleeps waiting on a quota or a render; run long work in the background and get notified.
- **Engine `cut()`**: costs about 3–20 ms a frame for 50–80 sheets. Canvas2D shadows are in device pixels, so they stay
  consistent under zoom. Grain is a pattern in shape space, so it moves with the shape.
- Claude cannot listen. State in the delivery that levels and sync were checked by measurement, and ask the user to
  listen once.

## Rules

- **Original work**: original illustration, original music (`audio.mjs`), synthesized SFX. No copyrighted characters.
- **Accuracy**: double-check the facts. Spoken numbers must match the on-screen numbers.
- **Length**: within the brief (default 30–40 s), checked with ffprobe.
- **Language**: reply in the user's language. The main model judges every check sheet itself.
- **Leave other work alone**: never modify other projects in the repo. Build in `shorts/<slug>/`.
- **Rights**: flag them in the delivery. The voice is Google's prebuilt TTS voice (Google's terms); the fonts are
  under the OFL.
