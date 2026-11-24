# ต้นกับทะเล — STATUS
Goal: a calm ~200 s cartoon short with no narrator: English dialogue (TTS), ambience/SFX and original music, all made in
code, Ghibli-inspired, built with ClaudeAnimationBase (copied from P Doom).

## Done
- Cast approved: `src/cast.js` (rig v1, approved 2026-10-14: IK arms/legs, lean, nod, shrug, breath, blink, props, Mai
  run/walk + splashes, sit↔stand). Model sheet t 6.5 → `out/stills/t6_50.png`. `src/moves.js` (`TONM`, `MAIM`) = beats.
- Sets: `ghibli.js` (EXT shop front, rain; `GH`), `interior.js` (`INT.set`, 6 lights), `seascape.js` (`EXT.wide`, 4 looks),
  `stage.js` (STAGE: shared int/ext/gh/pier, cast placement, pour glass, rag, `pourCU`).
- Storyboard v1 approved: `STORYBOARD.md` (25 shots). Rough animatic v1: `scripts/animatic.py`, `out/animatic.mp4`.
- All 5 acts acted (`a01_shop` … `a05_coda`), smooth pass (0.55 s dissolves, softBack snaps, idle sway, eased camera).
  Frame-diff: no pops outside cuts. Smooth 117.75 s cut with narration sent (`out/ton-sea_smooth_720p.mp4`).
- Air time (Nick: the narration rushed; stretch to ~200 s): `src/air.js` AIR plan opens 44 gaps (+82.2 s), every shot time
  goes through `AIRV`/`AIRG`. 199.95 s. Inserts in the gaps: 03d kettle CU, 08p/24p tea-pour ECU (`STAGE.pourCU`),
  10b boots splashing in the rain. `scripts/air.mjs` (cut narration to the plan) is kept only as the timing reference.
- Sound v3 (2026-10-15, Nick: drop the narration, SFX for every event, the characters talk in English, add music):
  - Dialogue: `DIALOGUE.md` v2, 22 lines. `scripts/tts_dialog.py` (Vertex Gemini 3.8 Flash TTS, gcloud token) →
    `out/voice/raw/dNN_who.wav`. Ton = Umbriel, Mai = Sulafat (Nick picked from `out/voice/audition/`).
  - `scripts/dialog.mjs`: places lines (AT table) → `out/audio/dialogue.wav` + `src/dialog.js` (DIALOG envelopes,
    `SPEAK(who, t)`). Lip-sync: `NOW_T` (timeline.js), `speak()` in cast.js opens mouth 'o'/'pant'. Old flaps removed.
  - `scripts/shotlist.mjs` → `out/shots.txt` (44 shots, start/len). `scripts/sfx.mjs`: everything synthesized (sea +
    laps, rain, wind, thunder, gulls, shutters, kettle/flame/simmer/song, pours with rising pitch, door chime, boots,
    steps, drips, clock) → stems `out/audio/sfx_{sea,rain,wind,fx}.wav`. Per-shot ambience table `AMB`.
  - `scripts/score.mjs`: original waltz in F, 3/4 at 72 BPM (piano, strings, cello, pizz, harp, celesta, flute); melody
    in the dialogue gaps; F/A→Bb under the kettle's song. `scripts/render_music.swift` (AVAudioUnitSampler + macOS GS
    bank, offline) → `out/music/music.wav`. Needs `SDKROOT=…/MacOSX26.5.sdk`.
  - `scripts/mix.mjs`: stems at set LUFS, music ducks under voices, two-pass loudnorm -15 LUFS / -1.5 dBTP →
    `out/audio/mix.wav` (`PROJECT.audio`). Check: every line ≥ 8.6 dB over the bed (speech band).
  - Spectrogram checks of SFX and music timing passed. Claude cannot listen: Nick's ears decide levels and sounds.

- GitHub: `Kreycin/ton-sea` (public since 2026-10-15, Nick's call; secret scan of files + history clean). README.md + docs/METHOD.md explain the method; out/ is ignored
  except the TTS takes, lines.json and shots.txt; narration wavs never go in. Public only when Nick decides.
- v4 pass (2026-10-15, Nick: subtitles that belong to the story, fix Ton's arms, intro title + credits):
  - Arms v2 (`cast.js`): `sleeve()` with a round shoulder cap over a fuller forearm; towel drapes down the chest (off the
    shoulder it read as a third arm). Poses (`moves.js`): HANG_T elbow give, noren hands wide (02), hands on the sill (03a),
    shrug elbB -1 (06).
  - `src/titles.js` (`drawOverlay`, called in `composite` after the dissolve, before grain): title ต้นกับทะเล (Charm) +
    "Ton and the Sea" (Cormorant) + credits (made by Claude Opus 5.5 · voices Gemini 3.8 Flash TTS · music & sound
    written in code), 0–9.6 s in the dawn sky. Subtitles: English, Patrick Hand, Ton cream / Mai yellow, beside or over the
    speaker's head (`HEADS`, set by `seen()` in cast.js; reset per shot in timeline.js), off-screen = low italic; words in
    with the voice, out with the weather (`SUB_EXIT` rain/steam/breeze). `SUB_AT[k]` overrides a placement.

## Decisions
- Timeline: `src/air.js` (4 s pre-roll + AIR gaps), 199.95 s; no narration (Nick 2026-10-15).
- Sound order to rebuild: `node scripts/dialog.mjs` → `shotlist.mjs > out/shots.txt` → `sfx.mjs` → `score.mjs` +
  swift render → `mix.mjs`. Re-run shotlist/sfx whenever shot times change.
- Visual rules (copy from `ghibli.js`): gouache washes, no outlines on backgrounds; characters thin line `#3A2A2C` + one
  cel shade; cold world, warm light only from the shop; door ≈ 1.12 × Ton; on-screen text = intro titles + subtitles only.
- Depth stack, back to front: sky strata, sea + haze veil, shop/railing, deck, cast, rain, foreground frame.
- Colour arc: silver morning → grey → rain → gold after rain → calm dusk.
- p5.brush gotchas: `gw` makes lumpy blobs on large rects (use `gp`); a 2-point `inkLine` needs a midpoint; with `F=-1`,
  local +x points to screen-left.
- TTS uses Gemini prebuilt voice names only; never put a cloned voice ID in this repo.

## Key files
- `src/cast.js` (rig; header lists every control), `src/air.js`, `src/dialog.js` (generated), `STORYBOARD.md`, `DIALOGUE.md`.
- `src/scenes/styles.js`: rejected style tests, reference only. `out/cast_v1_backup.js`: pre-rig cast.

## Next
1. Nick reviews v4 (`out/ton-sea_v4_720p.mp4`, 2026-10-15: 199.95 s 1080p master `out/video.mp4`, frame-diff spikes = only
   lightning; 20c Mai now walks away from the shop). Small arm notes left: 22.2 s / 171.4 s long back arm, 173.5 s stool.
2. Sound notes from Nick, if any (`mix.mjs` LEVEL, events in `sfx.mjs`).
3. On YouTube (Kreycin, public, 2026-10-15): https://youtu.be/MZNS3A2qsdg, cover `out/cover/cover_rain.jpg` (covers.html +
   shoot.mjs; clean stills via `render.mjs --sheet=t --clean`), cat Film & Animation, lang en. Recorded in Control
   `data/state.json` ("2026-10-15 Ton and the Sea"). Next: the how-to video, if Nick wants it.

## Open questions
- Audio rights before any public posting: TTS voices are Google prebuilt (Vertex terms); music uses the macOS GS sound
  bank (Apple licence); SFX are synthesized in code.

## Short: ถ้าโลกเปลี่ยนไปใช้พลังงานสะอาดทั้งหมด? (2026-11-23)
- Done v3.1 (44.4 s; v3's stutter at 16 s fixed) — v3 (v1 39.9 s at 1.25× felt rushed; v2 55.9 s at 1.0× felt slow and repeated a phrase at 9 s): 44.9 s at 1.1×, new n03 wording, 1080×1920, 30 fps, paper-cut style → `out/shorts/clean-energy_shorts.mp4` (+ `_720p`). Docs in
  `shorts/clean-energy/` (SCRIPT, STORYBOARD, ASSETS, QC). Page `shorts.html` (`render.mjs --page=shorts.html --fps=30`).
- Rebuild: TTS take (`scripts/shorts_tts.py shorts/clean-energy/full4.json out/shorts/voice/take Puck gemini-2.5-flash-preview-tts`)
  → `scripts/shorts_voice.py out/shorts/voice/take/full4.wav 4.56,8.37,14.71,=18.13,23.53,27.92,31.35,36.62,41.26` (then transcribe
  narration.wav to check). v3.1: "=17.86" had cut n04's last word ปี in half (heard as a stutter at 16 s); the fix was made by
  hand on the line files (`--lines` re-places them) because full4.wav was lost with the container; 18.13 is the equivalent take cut. → re-check `src/shorts/phrases.js` → `node scripts/shorts_audio.mjs` →
  `render.mjs --page=shorts.html --fps=30 --frames --workers=4 --framesdir=out/shorts/frames` → ffmpeg mux with mix.wav.
- Open: a human listen for levels and music 
- The placed narration of v3.1 is kept in the repo as `shorts/clean-energy/narration.flac` (out/ is not committed and the TTS
  take was lost once): `ffmpeg -i shorts/clean-energy/narration.flac out/shorts/audio/narration.wav` restores it for the mix.

## Short: ทำไมเราถึงรู้สึกง่วงหลังจากกินอาหาร? (2026-11-24)
- Done: 39.9 s, 1080×1920, 30 fps → `out/shorts/sleepy/sleepy_shorts.mp4` (+ `_720p`). Docs in `shorts/sleepy/`. Page
  `shorts_sleepy.html`; code in `src/shorts/sleepy/`. Rebuild: `SHORT=sleepy python3 -I scripts/shorts_voice.py
  shorts/sleepy/take1.wav =2.80,=6.01,=10.30,=13.68,=17.20,=22.30,=25.29,=29.63,=33.37,=38.27` → `SHORT=sleepy node
  scripts/shorts_audio.mjs` → `render.mjs --page=shorts_sleepy.html --fps=30 --frames --workers=4 --framesdir=out/shorts/sleepy/frames`.
- Lesson: in a shot fn, `dur` is the shot's LENGTH; a keyframe at the shot's end is `t - lt + dur`. Fixed in sleepy; the
  clean-energy scenes still use `[dur, …]` in several camera keys (camera holds early / small snap) — not fixed, not asked.

## Short: เหงื่อออกมากแปลว่าเผาผลาญไขมันมากจริงหรือ? (2026-11-24)
- Done: 39.4 s → `out/shorts/sweat/sweat_shorts.mp4` (+ `_720p`). Docs `shorts/sweat/`, code `src/shorts/sweat/`, page `shorts_sweat.html`.
  Rebuild: `SHORT=sweat python3 -I scripts/shorts_voice.py shorts/sweat/take1.wav =4.25,=6.90,=11.15,=14.85,=17.41,=21.39,=26.89,=30.76,=35.04,=38.92`
  → `python3 -I scripts/shorts_checkcuts.py out/shorts/sweat/audio/lines` → `SHORT=sweat node scripts/shorts_audio.mjs` → render.
- Lesson: never trust the take's transcript timestamps for cuts (off by ~1.5 s here); always run shorts_checkcuts.py.

## Short: เราใช้สมองแค่ 10% จริงหรือ? (2026-11-24)
- Done: 39.83 s → `out/shorts/brain10/brain10_shorts.mp4` (+ `_720p`). Docs `shorts/brain10/`, code `src/shorts/brain10/`.
  Rebuild: `SHORT=brain10 python3 -I scripts/shorts_voice.py shorts/brain10/take1.wav =3.75,=8.54,=12.85,=16.24,=20.30,=23.74,=27.63,=31.70,=35.15,=39.46`
  → `shorts_checkcuts.py` → `SHORT=brain10 node scripts/shorts_audio.mjs` → render `--page=shorts_brain10.html`.
- Rule learned: no strobes. Full-frame flashing must stay ≤ 3 per second (photosensitive epilepsy); QC now counts them.
