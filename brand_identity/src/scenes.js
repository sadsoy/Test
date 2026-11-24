// scenes.js — the NOVA 404 brand stills and motion pieces, drawn with paper.js + nova_brand.js on the stage page.
// Each scene is a function of t (seconds). Shorts samples are 1080 × 1920; the channel art is 2560 × 1440.

// ---------- shared bits ----------
// same values as SUBT in src/shorts/subs_th.js (that file needs a Short's narration, so it is not loaded here)
const SUBT = { size: 54, y: 1455, font: s => `600 ${s}px "Kanit", sans-serif`, hi: '#FFD84D', said: '#FFFFFF', ahead: 'rgba(255,255,255,.62)', ink: '#1E1A24' };
// the Shorts subtitle look (src/shorts/subs_th.js): Kanit 600, ink outline, the word being said in yellow
function subSample(words, hiIdx, y = 1455) {
  const c = PX, size = SUBT.size; c.save(); c.font = SUBT.font(size); c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  const ws = words.map(w => c.measureText(w).width), gap = size * .18, tot = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  let x = W / 2 - tot / 2;
  words.forEach((w, i) => {
    c.textAlign = 'left'; c.lineWidth = size * .2; c.strokeStyle = SUBT.ink; c.strokeText(w, x, y);
    c.fillStyle = i === hiIdx ? SUBT.hi : i < hiIdx ? SUBT.said : SUBT.ahead; c.fillText(w, x, y); x += ws[i] + gap;
  });
  c.restore();
}
function brandBug(alpha = .9) {           // the small corner mark used on every Short (top-right, inside the safe area)
  const c = PX; c.save(); c.globalAlpha = alpha; novaPortal(W - 104, 132, 34, { theme: 'dark' }); c.restore();
}
function paperHills(y, cols, seed = 0) {
  cols.forEach((col, i) => cut(hills(y + i * 70, 36 + i * 8, .0042 + i * .0009, seed + i * 1.9), col, 3 - Math.min(i, 2), { sa: .32 }));
}
function shortsFrame(topic, hookLines, src) {
  novaChip(topic, 72, 238, { size: 46 });
  novaHook(hookLines, W / 2, 420, { size: 86 });
  if (src) novaSource(src, 72, 1548, { size: 28 });
  brandBug();
}

// a paper atom (strips + nucleus) and a DNA ribbon for the channel art
function atom(x, y, s, t = 0, col = NOVA.mist) {
  for (let i = 0; i < 3; i++) {
    const p = new Path2D(); p.ellipse(x, y, 90 * s, 30 * s, i * Math.PI / 3 + t * .2, 0, TAU);
    PX.save(); PX.shadowColor = SHADE + '.3)'; PX.shadowBlur = 8; PX.shadowOffsetY = 4; PX.strokeStyle = col; PX.lineWidth = 7 * s; PX.stroke(p); PX.restore();
  }
  cut(Pc(x, y, 20 * s), NOVA.coral, 2);
}
function dna(x, y, s, n = 7, t = 0) {
  for (let i = 0; i < n; i++) {
    const yy = y + i * 34 * s, ph = i * .75 + t, a = Math.sin(ph) * 60 * s, b = -a, front = Math.cos(ph) > 0;
    strip([[x + a, yy], [x + b, yy]], NOVA.ink3, 6 * s, 1);
    cut(Pc(x + a, yy, 11 * s), front ? NOVA.teal : '#1A6A60', 1); cut(Pc(x + b, yy, 11 * s), front ? '#1A6A60' : NOVA.teal, 1);
  }
}
function leaf(x, y, s, rot = 0, col = '#4FA06E') {
  PX.save(); PX.translate(x, y); PX.rotate(rot);
  cut(Pblob([[0, -70 * s], [40 * s, -20 * s], [30 * s, 40 * s], [0, 70 * s], [-30 * s, 40 * s], [-40 * s, -20 * s]]), col, 2);
  strip([[0, -55 * s], [0, 75 * s]], '#2F7A4E', 4 * s, 0); PX.restore();
}
function rocket(x, y, s, rot = .5) {
  PX.save(); PX.translate(x, y); PX.rotate(rot); PX.scale(s, s);
  cut(Pp([[-38, 60], [-60, 100], [-30, 92]]), NOVA.coral, 2); cut(Pp([[38, 60], [60, 100], [30, 92]]), NOVA.coral, 2);
  cut(Pblob([[0, -120], [40, -50], [40, 80], [-40, 80], [-40, -50]]), NOVA.cream, 3);
  cut(Pc(0, -20, 20), NOVA.ink3, 1); cut(Pc(0, -20, 13), '#9FD8F0', 0, { tex: 0 });
  shine(0, 110, 60, '#FFB347', .8); cut(Pp([[-22, 85], [0, 150], [22, 85]]), NOVA.gold, 0, { tex: .3 });
  PX.restore();
}
function ringedPlanet(x, y, r, col = '#E9A86B', ringCol = NOVA.cream) {
  const back = new Path2D(); back.ellipse(x, y, r * 1.9, r * .42, -.25, Math.PI, TAU);
  const front = new Path2D(); front.ellipse(x, y, r * 1.9, r * .42, -.25, 0, Math.PI);
  PX.save(); PX.strokeStyle = ringCol; PX.lineWidth = r * .14; PX.globalAlpha = .9; PX.stroke(back); PX.restore();
  cut(Pc(x, y, r), col, 3);
  PX.save(); PX.clip(Pc(x, y, r)); for (let i = 0; i < 3; i++) cut(Pe(x, y - r * .4 + i * r * .38, r * 1.2, r * .09, -.25), i % 2 ? '#D98A52' : '#F2C08F', 0, { tex: .5 }); PX.restore();
  PX.save(); PX.shadowColor = SHADE + '.35)'; PX.shadowBlur = 10; PX.shadowOffsetY = 6; PX.strokeStyle = ringCol; PX.lineWidth = r * .14; PX.stroke(front); PX.restore();
}

const SCENES = {
  // ---------- YouTube channel art: 2560 × 1440, the logo inside the 1546 × 423 area every device shows ----------
  channelart(t, guides = false, bare = false) {
    novaSky(t, { n: 120, band: 1, seed: 9 });
    // a soft glow behind the centre so the wordmark sits in light
    shine(W / 2, H / 2, 900, '#3A4A8F', .55);
    // far planets and the paper moon
    ringedPlanet(2270, 300, 120);
    cut(Pc(330, 250, 70), NOVA.mist, 2); cut(Pc(355, 235, 62), NOVA.deep, 0, { tex: 0 });
    // the desktop strip (y 508–931) carries something on both sides: the Earth on the left, the brain and atom on the right
    earth(250, 720, 150, t, 1, { spin: 0 });
    rocket(600, 1010, .7, .75);
    brainBuddy(2170, 700, .55, {}, { face: false });
    atom(1980, 420, .9, t);
    dna(2420, 960, .8, 7, t);
    novaStar(700, 300, 26, { glow: .5, lv: 1 }); novaStar(1880, 1030, 20, { glow: .4, lv: 1 }); novaStar(2050, 180, 16, { glow: .4, lv: 0 });
    // paper horizon: three ink layers, then the foreground with trees, a turbine, a leaf and อิ่ม looking up
    paperHills(1150, [NOVA.ink3, NOVA.ink2, '#151935'], 2);
    [[140, 1290, 1], [210, 1300, .8], [2350, 1300, .9], [2440, 1310, .7]].forEach(([x, y, s]) => tree(x, y, s * 1.4, '#2F7A62'));
    turbine(900, 1300, .38, t * .8, { col: '#D9DDEB' });
    leaf(1700, 1240, .8, .6); leaf(1760, 1260, .6, -.4, '#6DBE6A');
    person(2000, 1330, .62, { look: -8, smile: .6, arm: [0, .7], shirt: NOVA.teal });
    if (bare) return;
    // centre: the wordmark and the promise
    const size = 210, ww = novaWordmarkWidth(size);
    novaWordmark(W / 2 - ww / 2, 742, size, { theme: 'dark', t, glow: .25 });
    const c = PX; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `500 48px ${NOVA_FONT.th}`; c.fillStyle = NOVA.cream; c.fillText('ไขเรื่องที่สงสัย · ความเชื่อผิด ๆ · และคำถาม “ถ้าหาก…?”', W / 2, 845);
    c.font = `400 30px ${NOVA_FONT.mono}`; c.fillStyle = NOVA.goldLt; c.fillText('SCIENCE · BODY · NATURE · SPACE · WHAT IF — NEW SHORTS EVERY WEEK', W / 2, 905);
    c.restore();
    if (guides) {
      const g = (x, y, w, h, col, label) => { c.save(); c.strokeStyle = col; c.lineWidth = 4; c.setLineDash([18, 12]); c.strokeRect(x, y, w, h);
        c.font = `700 28px ${NOVA_FONT.mono}`; c.fillStyle = col; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(label, x + 12, y + 10); c.restore(); };
      g(2, 2, W - 4, H - 4, '#FFFFFF', 'TV 2560×1440');
      g(0, 508, W, 423, '#7FD6FF', 'DESKTOP max 2560×423');
      g(507, 508, 1546, 423, '#FFE08A', 'SAFE AREA (all devices) 1546×423');
      g((W - 1855) / 2, 508, 1855, 423, '#FF9C8A', 'TABLET 1855×423');
    }
  },
  channelart_guides(t) { SCENES.channelart(t, true); },
  channelart_bare(t) { SCENES.channelart(t, false, true); },     // backdrop for the guidelines cover

  // ---------- topic samples: one Shorts frame per topic, in the house style ----------
  sample_space(t) {
    novaSky(t, { n: 90, band: .9, seed: 2 });
    sun(250, 820, 120, t);
    const path = [[350, 860], [560, 930], [760, 1010], [900, 1080]];
    pulses(path, t, 4, .35, '#FFE27A', 12);
    earth(900, 1110, 95, t, 1, { spin: 0 });
    ptext('8 นาที 20 วินาที', 470, 1200, 52, NOVA.goldLt, { weight: 700, card: NOVA.ink2, lv: 2, rot: -.04 });
    paperHills(1520, [NOVA.ink2, '#151935'], 1);
    person(880, 1800, .55, { look: -10, smile: .2, arm: [.5, 0], shirt: NOVA.teal });
    shortsFrame('space', ['ดวงอาทิตย์ที่เห็น', 'คือภาพเมื่อ [[8 นาที]] ก่อน'], 'ที่มา: NASA · ระยะทาง ~150 ล้าน กม.');
    subSample(['แสง', 'ต้อง', 'เดินทาง', 'มา', 'ถึง', 'ตา', 'เรา'], 2, 1455);
  },
  sample_body(t) {
    pcBegin('#F6DCD9');
    cut(Pc(540, 1080, 520), '#F2C4C6', 1, { sa: .2 }); cut(Pc(540, 1080, 380), '#EFB2B9', 1, { sa: .2 });
    const beat = Math.max(0, Math.sin(t * 7));
    heart(540, 1000, 230, beat, '#D6334A');
    ecg(140, 940, 1300, t, false, '#D6334A');
    person(900, 1800, .55, { smile: .7, arm: [0, .6], shirt: '#E27A92' });
    ptext('~100,000 ครั้ง / วัน', 400, 1450, 48, NOVA.ink, { weight: 700, card: NOVA.cream, rot: .03 });
    shortsFrame('body', ['หัวใจเต้นไม่เคยหยุด', 'วันละ [[แสนครั้ง]]'], 'ที่มา: American Heart Association');
  },
  sample_myth(t) {
    pcBegin('#E7E1F2');
    cut(Pc(540, 1050, 470), '#D8D0EA', 1, { sa: .2 });
    brainBuddy(540, 1060, 1.05, {}, { face: true });
    novaMyth(800, 1320, 1, 1);
    ptext('สแกนสมอง: ทำงานเกือบทุกส่วน', 540, 1480, 40, NOVA.ink, { weight: 600, card: NOVA.cream, rot: -.02 });
    shortsFrame('myth', ['เราใช้สมอง', 'แค่ [[10%]] จริงหรือ?'], 'ที่มา: Scientific American (2008)');
  },
  sample_whatif(t) {
    novaSky(t, { n: 80, band: .8, seed: 6 });
    earth(540, 1080, 300, t, 1, { spin: 0 });
    // a stop sign of paper over the spinning Earth
    const c = PX; c.save(); c.translate(780, 830); c.rotate(.1);
    cut(Pp(Array.from({ length: 8 }, (_, i) => [Math.cos(i * TAU / 8 + TAU / 16) * 110, Math.sin(i * TAU / 8 + TAU / 16) * 110])), NOVA.coral, 3);
    c.font = `800 52px ${NOVA_FONT.th}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = NOVA.cream; c.fillText('หยุด!', 0, 4); c.restore();
    strip([[220, 1400], [860, 1400]], NOVA.goldLt, 6, 1);
    ptext('ลมพัด 1,600 กม./ชม.', 540, 1470, 44, NOVA.ink, { weight: 700, card: NOVA.goldLt, rot: -.02 });
    shortsFrame('whatif', ['ถ้าโลก [[หยุดหมุน]]', 'แค่ 1 วินาที?'], 'สถานการณ์สมมติ · ความเร็วที่เส้นศูนย์สูตร');
  },
  sample_nature(t) {
    pcBegin('#DDEFE4');
    cut(Pr(0, 0, W, 1250, 0), '#CFE9DA', 0);
    const soil = hills(1250, 20, .006, 1, -100, W + 100, H + 200);
    cut(soil, '#7A5A44', 3);
    cut(hills(1500, 16, .008, 2, -100, W + 100, H + 200), '#654A39', 2);
    // the fungal network under the forest floor carries nutrients between trees
    const roots = [[[230, 1260], [300, 1420], [540, 1480], [780, 1420], [850, 1260]], [[540, 1260], [520, 1400], [540, 1480]], [[230, 1260], [180, 1560], [540, 1640], [850, 1560], [850, 1260]]];
    roots.forEach(P => { strip(P, '#F2E6C9', 6, 1); pulses(P, t, 3, .4, '#FFE27A', 11); });
    [[230, 1260, 2.6], [540, 1260, 3.2], [850, 1260, 2.4]].forEach(([x, y, s]) => tree(x, y, s, '#3F9272'));
    leaf(160, 820, .9, -.5); leaf(930, 760, .8, .7, '#6DBE6A');
    shortsFrame('nature', ['ต้นไม้ [[ส่งอาหาร]]', 'ให้กันใต้ดิน?'], 'ที่มา: Simard et al., Nature (1997)');
    subSample(['ผ่าน', 'เส้นใย', 'ของ', 'รา', 'ใต้', 'ดิน'], 1, 1455);
  },
  sample_mind(t) {
    pcBegin('#E9E3F5');
    cut(Pc(540, 1080, 480), '#DCD2EF', 1, { sa: .2 });
    person(380, 1500, .95, { mouth: 1, lid: .6, arm: [.8, 0], shirt: '#8B6CC4' });
    person(760, 1520, .85, { mouth: .45, lid: .3, look: -10, shirt: NOVA.teal });
    zzz(560, 980, t, 1, 1);
    shortsFrame('mind', ['ทำไมเห็นคนหาว', 'แล้วเรา [[หาวตาม]]?'], 'ที่มา: Gallup & Eldakar (2013)');
  },

  // ---------- templates ----------
  // the Shorts cover / first frame: hook in the top third, the subject in the middle, nothing important under y = 1500
  cover_template(t) {
    novaSky(t, { n: 60 });
    shortsFrame('whatif', ['พาดหัว [[คำเด่น]]', 'ไม่เกิน 2 บรรทัด'], 'ที่มา: แหล่งข้อมูล · ปี');
    const c = PX; c.save(); c.setLineDash([16, 10]); c.lineWidth = 3;
    const box = (x, y, w, h, col, label) => { c.strokeStyle = col; c.strokeRect(x, y, w, h); c.font = `700 26px ${NOVA_FONT.mono}`; c.fillStyle = col; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(label, x + 10, y + 8); };
    box(40, 150, 1000, 450, '#FFE08A', 'HOOK ZONE');
    box(60, 640, 960, 700, '#7FD6FF', 'SUBJECT (paper-cut illustration)');
    box(60, 1360, 960, 160, '#B9F0C8', 'SUBTITLES y≈1455');
    c.fillStyle = 'rgba(232,96,76,.28)'; c.fillRect(0, 1560, W, H - 1560); c.fillRect(W - 150, 700, 150, 860);
    c.fillStyle = '#FF9C8A'; c.font = `700 26px ${NOVA_FONT.mono}`; c.fillText('YouTube UI — keep clear', 40, 1590);
    c.restore();
    cut(Pc(540, 990, 200), NOVA.ink3, 3); novaStar(540, 990, 90, { glow: .4 });
  },
  thumb_16x9(t) {                // 1280 × 720 thumbnail for long-form / playlists
    novaSky(t, { n: 50, seed: 3 });
    earth(1000, 400, 230, t, 1, { spin: 0 });
    novaChip('whatif', 70, 110, { size: 44 });
    novaHook(['ถ้าโลก [[หยุดหมุน]]?'], 440, 330, { size: 90 });
    novaMyth(330, 560, .7, 1, { label: 'สถานการณ์สมมติ' });
    novaPortal(1200, 650, 44, { theme: 'dark' });
  },
  sting(t) { novaSting(t); },
  sting_wide(t) { novaSting(t, { scale: H / 1080 * .9 }); },
  endcard(t) { novaEnd(t, { next: 'ถ้าดวงจันทร์หายไป?' }); },
  // a page of chips and pieces for the guidelines
  kit(t) {
    pcBegin('#EDE3D1');
    Object.keys(NOVA_TOPIC).forEach((k, i) => { const y = 110 + i * 92, w = novaChip(k, 80, y, { size: 42, rot: 0 }); novaChip(k, 80 + w + 30, y, { size: 30, lang: 'en', rot: 0 }); });
    novaHook(['ตัวอย่าง [[พาดหัว]]'], W / 2, 940, { size: 86 });
    novaSource('ที่มา: NASA (2024)', 80, 1110, { size: 28 });
    novaMyth(780, 1180, .8, 1);
    subSample(['คำ', 'ที่', 'กำลัง', 'พูด', 'เป็น', 'สีเหลือง'], 3, 1400);
  },
};
