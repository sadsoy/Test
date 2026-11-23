---
name: paper-shorts
description: Make a complete 30–60 s vertical (9:16, 1080×1920, 30 fps) explainer video in a cut-paper illustration + motion-graphics style, entirely in code — research and fact-check (science, health, climate, current events), Thai (or any language) narration via Gemini TTS, storyboard, Canvas2D paper-cut scenes with continuous camera journeys, anatomy/map asset sheets, karaoke subtitles, synthesized music and SFX, mix, render, QC and delivery. Use for "YouTube Shorts", "TikTok", "Reels", "คลิปสั้น", "ทำ Shorts", "อธิบายเรื่อง ... ในคลิปสั้น", "paper cut", "กระดาษตัด", science/medical/climate explainers, or to revise such a video. For hand-painted, character-acted films and MVs use code-video instead.
---

# Paper Shorts

The method behind four Shorts the user approved (2026-11). All of them are in `shorts/` and here as examples:

| Example | What it shows best |
|---|---|
| `assets/example/moon` (ดวงจันทร์ด้านเดียว) | A sphere with real maria, spin and libration; the first version of the kit |
| `shorts/krathong` (กระทงไปไหน) | Statistics with sources; many props; a loop ending |
| `assets/example/gh-sleep` (GH กับการนอน) | **Anatomy** (head profile and midsagittal brain); a character sheet; **one continuous camera journey** (wall clock → bedroom → rotate and zoom into the head → brain → pituitary → blood → graph → clock flip → back); no hands |
| `assets/example/robots-what-if` (หุ่นยนต์ทำงานแทน?) | **What-if story arc** (fact today → stamped hypothetical → twist → mechanism → ideas → question); **robots with real joints** (`limb`, `ik`, industrial arm, humanoid) and silhouette people with walk cycles; a money-loop diagram that tears |
| `assets/example/fusion-sun` (ดวงอาทิตย์บนโลก) | Science what-if with strict fact/hypothesis separation; nuclei with exact p/n counts; a **tokamak cutaway** (D-coil loops wrapped round the tube); energy bars that separate a lab result from a whole system; caveat cards |
| `assets/example/super-elnino` (ซูเปอร์เอลนีโญ) | **Current events with a fact check** (NOAA and WMO with dates); careful forecast wording; a globe ↔ map match cut from real lon/lat; an equatorial cross-section; region-by-region impacts; a stacked bar separating causes |

Look at each example's `contact_sheet.jpg` and `DELIVERY.md`: that is the bar.

The look: every shape is a sheet of paper with a soft drop shadow, fibre grain, a lit top-left edge and a dark lower
edge; layers have parallax; colour changes from scene to scene. Every frame is a pure function of `t`.

**Core rule: every narrated phrase gets a visual beat that explains it** (an object moves, transforms, locks, counts,
lights up, flips). Motion without meaning is cut. Typography is for key words only (one label at a time, top band).
**Accuracy beats visual complexity.** When the topic is science, health, climate or news, read
`references/accuracy.md` before writing the script.

## Setup (new project, about 2 minutes)

```bash
P=shorts/<slug>; mkdir -p $P/{src,scripts,assets/fonts,out/voice,out/check,deliver}
cp -r .claude/skills/paper-shorts/assets/kit/. $P/
cp .claude/skills/paper-shorts/assets/example/moon/art.js $P/src/          # the shared prop library (sky, stars, sphere, hills...)
cp shorts/moon/assets/fonts/* $P/assets/fonts/ 2>/dev/null || (cd $P && npm init -y >/dev/null && npm i @fontsource/kanit @fontsource/mitr && for f in kanit-thai-400 kanit-thai-700 kanit-thai-800 kanit-latin-400 kanit-latin-700 kanit-latin-800 mitr-thai-500 mitr-latin-500; do n=${f%%-*}; cp node_modules/@fontsource/$n/files/$f-normal.woff2 assets/fonts/; done)
cp shorts/moon/.gitignore $P/
# optional: a topic library from an example (body.js = anatomy/bedroom/clock/EEG/blood; geo.js = globe/map/cross-section)
#   cp .claude/skills/paper-shorts/assets/example/<ex>/<lib>.js $P/src/  and add <script src="src/<lib>.js"></script> after art.js in studio.html
```

- Rendering reuses the repo's root `render.mjs`. Run it **from the project folder** with `--fps=30`:
  `node ../../render.mjs --fps=30 ...`. The page provides `renderAt`, `renderSheet`, `DUR` and `PROJECT.audio`.
- Kit files:
  - `src/engine.js`: the renderer (`cut`, `layer`, `at`, `txt`, `glow`, `strip`, `through`, `smooth`, `circ`, `ell`,
    `blob`, `kf`, `seg`, easings). Generic; do not fork it.
  - `src/ui.js`: scene helpers: `ph`, `wordAt`, `label`, `wsc`, `pin` (a label with a leader line to a world point).
    Do not redefine them in scenes.js.
  - `src/main.js`: the scene switch and the transitions table `TRANS` (`fade` / `wipe` / `cut`).
  - `src/subs.js`: karaoke subtitles. Edit `SUBT`, `SUB_SPOKEN`, `SUB_KEY`, `SUB_KEEP`.
  - `scripts/tts_full.py`; `scripts/split.mjs` (edit `SRC`/`TEMPO`/…, `PHR`, `AFTER`); `scripts/audio.mjs` (edit the
    `sec(...)` plan, `MELO` and the risers; the SFX library and the mix are generic).
- SFX available in `audio.mjs`: pop, pop2, shimmer, wobble, boing, whoosh(d), swish, zip, paper, wipe, whirr(d, g),
  hum(d), brake(d), click, stamp, swipe, swell(d), tick(g), ding, chime, water(d), splash, motor(d), grind(d), thud,
  bubble(d). Cue entries are `[type, t, d, g]`; g scales the level.

## Workflow (do not stop for approval between steps; make creative calls yourself)

1. **Research and fact-check** (see `references/accuracy.md`). Build a table of claims and sources with links and
   issue dates. Decide the hook question, the twist (a myth busted, an informal term explained, a number) and the
   phrases the clip must NOT say.
2. **Script** in `scripts/lines.json`: 8–10 lines, hook (≤4 s) → question → explain → cause → twist → calm ending
   that pays off the hook.
   - **Budget about 33–35 s of actual speech** for a 38–40 s cut. Voices differ: one take spoke 40 s of a script that
     another voice did in 33 s. If the first take's speech (the sum of its phrases) is over about 36 s, tighten the
     words, keep every caveat ("มีแนวโน้ม", "มัก", "อาจ"), and re-record.
   - Put spaces where phrases should break: the TTS pauses there, and the pauses become the subtitle and beat
     boundaries.
3. **Voice:** `python3 scripts/tts_full.py` records the WHOLE script in one request.
   - Run `python3 scripts/align.py`: Gemini (`gemini-3.5-flash`) transcribes every silence-separated phrase, assigns
     it to a line, prints `PHR = [...]` and lists any dropped words. It is a separate quota from TTS.
   - Then set `PHR` (from align.py; merged phrases are normal), `AFTER`, `TEMPO`
     (1.05–1.1; keep it lower if the brief says "not too fast") and `TAIL` in `split.mjs`, and run
     `node scripts/split.mjs`.
   - Check that `TL.duration` is inside the brief.
4. **Storyboard:** design **one continuous camera journey** wherever possible, not a slideshow:
   - zoom or rotate into an object to enter the next world (the camera can rotate: `setCam(x, y, z, r)`);
   - dissolve between two views of the same thing at the same scale (a globe into a map, a head silhouette into a
     cut-away);
   - push in along a path (a stalk, a vessel);
   - flip a card to its back (`X.scale(cos(flip·π), 1)`);
   - end on the opening frame so the Short loops.
   Use torn-paper wipes only for big palette changes.
5. **Asset / character sheet** for anything that must be right (people, anatomy, maps, diagrams). Use a temporary
   `SHEET` scene and fix it before any scene (`references/accuracy.md` §3).
6. **Scenes** in `src/scenes.js`: one function per scene, `setCam(...kf(t, keys, ease5))`, then `layer(par, fn)`
   back to front. Time every beat from `ph(id, i)` and `wordAt(id, i, 'word')`, never hard-coded seconds. Register
   `SCENES = [[t0, fn], ...]` and the transitions in `main.js` `TRANS`.
7. **Sound cues** in `src/cues.js` (one per visible event), then `node scripts/audio.mjs`. Measure the voice over the
   bed (see `references/qc.md`): **8 dB or more on every phrase**. Lower the offending cue's `g` or `LEVEL` if not.
8. **Review loop** (below) until clean, then **render**:
   ```bash
   rm -rf out/frames && node ../../render.mjs --fps=30 --frames --workers=4     # ~25–60 ms/frame
   node ../../render.mjs --fps=30 --encode --out=out/video_noaudio.mp4
   ffmpeg -y -i out/video_noaudio.mp4 -i out/audio/mix.wav -map 0:v -map 1:a -c:v copy -af apad -c:a aac -b:a 192k -shortest -movflags +faststart deliver/<slug>_shorts.mp4
   ffmpeg -y -i deliver/<slug>_shorts.mp4 -vf scale=540:960 -c:v libx264 -crf 26 -preset veryfast -c:a aac -b:a 128k -movflags +faststart deliver/<slug>_preview_540p.mp4
   ```
   To fix a few scenes after a full render, delete only those frames (`out/frames/fNNNNN.jpg`, frame = t×30) and
   re-run `--frames`: it resumes.
9. **QC** (all of it; `references/qc.md`) and **deliver**: write DELIVERY.md with these sections:
   - the fact-check table with sources and dates;
   - the final script with timings;
   - the storyboard;
   - the assets list;
   - a QC table (checked / found / fixed);
   - rights notes, and "check the source again before publishing" for current events.

   Then send the 540p preview, the master, the contact sheet and the asset or character sheet with SendUserFile, and
   commit and push.

## Review loop

```bash
node ../../render.mjs --fps=30 --sheet=t1,t2,...,t24 --cols=8 --w=220 --out=out/check/a.jpg       # keyframes, every phrase
node ../../render.mjs --fps=30 --sheet=t1,t2 --crop=x,y,w,h --w=400 --out=out/check/detail.jpg   # full-res details
node ../../render.mjs --fps=30 --strip=a:b --cols=8 --w=135 --out=out/check/move.jpg             # EVERY frame of a transition
```
Read each image yourself. Check:
- Does each phrase read as its own action?
- Is the key-word label in the top band (screen y 200–600)?
- Is anything under the subtitle card (y about 1400–1560)?
- Is anything off-frame or under the Shorts UI?
- Do labels and leader-line pins overlap each other? Stagger them, or move one to the top band.
- Do objects that exist only in the outgoing scene leave before a hard cut (fly out or fade)?
- In strips: no shape changes, nothing vanishing or snapping.

## Lessons (learned the hard way)

- **Gemini TTS** (via `generativelanguage.googleapis.com`; the proxy injects the key; send `x-goog-api-key: dummy`):
  - The free tier allows **10 requests per day per model**. Record the whole script in one request;
    `gemini-3.1-flash-tts-preview` with voice `Puck` worked well for Thai.
  - **Never prefix the text with a style instruction**: it gets read aloud.
  - A request can come back with `finishReason: SAFETY` and no audio (it happened on "กากกัมมันตรังสี"). Reword
    the phrase without changing the facts. Blocked requests still use quota.
  - If the 3.1 quota is gone, `TTS_MODEL=gemini-2.5-flash-preview-tts python3 scripts/tts_full.py` works too
    (voice Puck, slower pace; it needed ×1.13).
  - **Count your quota:** each video costs 1–3 requests. Get the script length right before recording (budget
    about 33–35 s of speech).
  - Handle both response formats: RIFF `audio/wav` and raw `audio/l16`.
- **Subtitles:**
  - Keep Thai compounds whole with `SUB_KEEP` (ดวง|จันทร์).
  - Show digits on screen but time them by the spoken form (`SUB_SPOKEN`).
  - The subtitles sit at y≈1478, so raise characters and landscapes above that band.
- **Turning a cutout:** never flip `X.scale(-1, 1)` in one frame. Ease the x-scale through a thin edge over about 0.2 s.
- **What-if topics:** stamp the hypothetical ("สถานการณ์สมมติ · WHAT IF") before it starts, show today's facts (with
  sources) first, and label proposed solutions as "still debated".
- **Science diagrams:** draw them from geometry, not by eye. For example, a toroidal coil is a loop in the plane of the
  vertical axis and the radius, so it is edge-on at the front and back. Check them on an asset sheet before animating.
- **Comments in audio.mjs:** a `//` comment placed mid-line silently disables the rest of that line (this disabled
  the risers once). Keep comments on their own lines.
- **Fonts:** Kanit has no "←" (it renders as a dash). "→", "=" and "+" are fine. Check unusual glyphs on a crop.
- **Wipes:** a torn sheet must start entirely below the frame (`y = H*1.5 + margin`).
- **Labels inside a zooming layer** scale with the camera. Fade them before the zoom, or draw them in `layer(0)` or
  with `pin()`.
- **Colour:** translucent warm colours over blue turn brown or muddy. Use opaque fills; slanted strata look better
  than big translucent blobs.
- **Silhouettes:** limbs must point clearly away from the head. Hands are the riskiest thing to draw; leave them out
  when the story allows (`references/accuracy.md` §4).
- **Graphs:**
  - Draw a "previous" curve as one faint continuous line; scattered dash segments read as noise.
  - Keep the axis label, the window label and the peak label apart.
  - Keep the whole card above the subtitle band.
- **Mix:** low rumbles, whirrs and clustered dings or splashes under speech mask it. Lower the cue (`g`) rather than
  raising the voice.
- **Tools:**
  - `ffmpeg` filter options need leading zeros (`d=0.5`).
  - Never chain sleeps; run long work in the background and use a Monitor `until` loop.
- **Delivery:** Claude cannot listen. State that levels and sync were checked by measurement, and ask the user to
  listen once.

## Rules

- **Original work:** original illustration, original music (`audio.mjs`), synthesized SFX. No copyrighted
  characters, and no recreation of a real song (for example, not the Loy Krathong song).
- **Accuracy:**
  - Facts come from sources with dates.
  - Spoken numbers must match the on-screen numbers.
  - Forecasts stay forecasts; tendencies stay tendencies.
  - No invented numbers.
  - No certainty about a specific country unless the source says so.
- **Length:** within the brief (default 30–40 s), checked with ffprobe.
- **Language and judgement:** reply in the user's language. The main model judges every check sheet itself.
- **Leave other work alone:** never modify other projects in the repo. Build in `shorts/<slug>/`.
- **Rights:** flag them in the delivery. The voice is Google's prebuilt TTS (Google's terms); the fonts are OFL.
