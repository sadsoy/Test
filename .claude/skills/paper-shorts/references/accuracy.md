# Accuracy: science, current events, anatomy, maps

The GH short (`assets/example/gh-sleep`) and the Super El Niño short (`assets/example/super-elnino`) were made under
briefs that put accuracy first. "Accuracy matters more than visual complexity." This file is what worked.

## 1. Research before the script

- Search for primary or authoritative sources. Use WebSearch with `mode: "extended"` for current events.
  - **Medicine and physiology:** PubMed, JCI, review papers.
  - **Climate:** NOAA CPC, WMO and the relevant national weather service.
  - **Thai statistics:** the agency's own announcement, or news that quotes it.
- For anything current, write down **the issue date** of each source. Today's date is in the environment; the next
  scheduled update (NOAA gives one) goes into the delivery as "check again before publishing".
- Build the fact-check table first, then write the script from it. The table goes into DELIVERY.md with links: one row
  per claim, with its evidence.
- List what the clip deliberately does NOT say, such as no certainty about Thailand, no invented numbers, and no
  forecast told as fact.

## 2. Wording rules (Thai narration)

| The source says | Say |
|---|---|
| A forecast or probability | "มีแนวโน้ม…", "คาดการณ์…" and on screen "คาดการณ์ · <agency> (<month year>)" |
| A typical regional impact | "มัก…", plus "แล้วแต่ภูมิภาค" and on screen "แนวโน้มที่มักเกิด ไม่ได้เกิดทุกครั้ง" |
| A risk | "อาจเพิ่มความเสี่ยง…", never "จะเกิด…แน่นอน" |
| An informal term (Super El Niño) | Say what it is: "ชื่อเรียกเอลนีโญที่แรงมาก ไม่ใช่ปรากฏการณ์ใหม่". That is a good twist. |
| A popular myth (GH 22:00–02:00) | Show the myth, then the evidence (a study graph), then the corrected statement. Narrow it to what the data shows ("ระลอกใหญ่", not "only at night"). |
| Two causes that combine (global warming + El Niño) | Separate them visually: a stacked bar with "ระยะยาว" and "+ เอลนีโญ (ชั่วคราว)". |

- **Numbers:** the narration may round ("เกือบสี่แสน"), but the screen shows the exact figure (391,027), and both must
  match the source.
- **Never invent a number:** if there is none, use words ("น้อย → มาก" in a legend, "อ่อน / ปานกลาง / แรง / แรงมาก" on
  a gauge).
- **Graphs that illustrate a study:** label them "กราฟจำลองจากงานวิจัย (Author year)". Never present them as real data.
- **Tone:** close calmly with something useful to do ("ติดตามประกาศกรมอุตุฯ และเตรียมพร้อมอย่างมีสติ"). Do not alarm.

## 3. Asset sheet / character sheet BEFORE any scene

Temporarily replace `src/scenes.js` with one `SHEET(t)` scene that draws one asset per second, then render a sheet and
inspect it:

```js
function SHEET(t) {
  window.CLEAN = true; setCam(0, 0, 1); const k = Math.floor(t);
  layer(1, () => { X.fillStyle = '#1B2150'; X.fillRect(-600, -1000, 1200, 2000);
    if (k === 0) at(0, 0, 1.2, 0, () => headProfile({ reveal: 0 }));       // silhouette
    if (k === 1) at(0, 0, 1.2, 0, () => headProfile({ reveal: 1, hypo: 1, scn: 1, pit: 1 }));  // every structure lit
    if (k === 2) at(300, -60, 3.2, 0, () => headProfile({ reveal: 1, pit: 1 }));                // close-up of the detail
  });
}
const SCENES = [[0, SHEET]];
```
```bash
node ../../render.mjs --fps=30 --sheet=0.5,1.5,2.5,3.5,4.5,5.5 --cols=3 --w=360 --out=out/check/charsheet.jpg
```
Fix the sheet before writing scenes. Keep the sheet image and send it with the delivery: the user can see the check
was done.

## 4. Anatomy

- **No hands unless the story needs them.** Paper hands drawn as five rounded rectangles read as claws. A person
  lying under a blanket, a silhouette, or a side view removes the risk entirely. Say so in the QC report.
- **One shape per body:** draw a person or head with ONE function (for example `headProfile`) and reuse it everywhere,
  including when it is rotated (the sleeper is the same head turned 90°). It cannot change shape between scenes.
- **Adult proportions:** the head is about 1/6–1/7.5 of the body length. The first pass made it 1/4, which reads as a
  child.
- **Midsagittal brain, face to −x:** cerebrum above; cerebellum at the back below the occipital lobe; brainstem in
  front of the cerebellum, running into the neck; thalamus at the centre; hypothalamus below and in front of it;
  SCN at the front of the hypothalamus, just above the optic chiasm; optic nerve from the eye to the chiasm;
  pituitary on its stalk behind the chiasm, in the sella turcica, with the anterior lobe toward the face.
  Coordinates are in `assets/example/gh-sleep/body.js` (`HEAD_P`, `BR`).
- **Folds on the medial surface curve around the corpus callosum**; never radial rays.
- **Simplifications** must not change relationships between parts. Leave detail out (ventricles, capsule) rather than
  guess, and state any symbolic element in the QC report (for example, "the vessel leaving the pituitary stands for
  'into the blood'").

## 5. Maps and geography

- Draw land from real lon/lat outlines (`LANDS_GEO` in `assets/example/super-elnino/geo.js`). One dataset gives:
  - **a globe:** orthographic projection with `sph()`; points behind the limb are pushed onto it;
  - **a map:** equirectangular, Pacific-centred, `mapXY`, with the date-line wrap handled.
- **Globe ↔ map match cut:** a globe of radius R matches a map with k = R·π/180 px per degree at its centre (R 301 ↔
  k 5.26). End the globe at camera zoom 1 and start the map at zoom 1, then dissolve.
- Check on the asset sheet:
  - which continents are west and which are east;
  - the islands (Indonesia and New Guinea north of Australia);
  - that the anomaly stops at the right coast;
  - the direction of the winds.
- **Mechanisms read best as a cross-section** (equatorial Pacific: the Walker circulation, warm layer, thermocline,
  upwelling), animated with a single state variable k from normal (0) to event (1).
- **Translucent warm colours over the blue sea turn brown.** Use opaque colours with `alpha` on the cut, or no alpha.
