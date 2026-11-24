// props.js (brain10): cut-paper props for "เราใช้สมองแค่ 10% จริงหรือ?". The star is a paper brain seen from the side,
// built from fixed lobe pieces that can each light up, with a small face. Everything keeps its shape; only light, position,
// rotation and scale change.

const BRN = { frontal: '#F2A7B5', parietal: '#F7C59F', occipital: '#B9A7E0', temporal: '#9FD8C8', cerebellum: '#F5D76E', stem: '#E3AD84',
  off: '#8E8A99', ink: '#2E2430', glow: '#FFE9A0' };
// lobe outlines around (0, 0), about 300 px from front to back at scale 1 (front faces left)
const LOBES = {
  frontal: [[-300, 20], [-292, -90], [-225, -190], [-110, -240], [-20, -250], [-10, -120], [-60, 0], [-150, 60], [-262, 70]],
  parietal: [[-20, -250], [90, -240], [190, -190], [232, -100], [120, -60], [-10, -120]],
  occipital: [[232, -100], [282, -10], [272, 80], [200, 112], [120, 30], [120, -60]],
  temporal: [[-150, 60], [-60, 0], [120, 30], [200, 112], [140, 160], [0, 172], [-130, 142], [-205, 100]],
  cerebellum: [[120, 160], [200, 112], [272, 80], [262, 160], [182, 212], [112, 200]],
};
const LOBE_ORDER = ['frontal', 'parietal', 'occipital', 'temporal', 'cerebellum'];
const LOBE_TH = { frontal: 'วางแผน · ตัดสินใจ', parietal: 'สัมผัส · ตำแหน่ง', occipital: 'การมองเห็น', temporal: 'ภาษา · ความจำ', cerebellum: 'ทรงตัว' };
function lobeCenter(k, x, y, s) { const P = LOBES[k]; let cx = 0, cy = 0; for (const [a, b] of P) { cx += a; cy += b; } return [x + cx / P.length * s, y + cy / P.length * s]; }
// lit: { lobe: 0..1 } (missing = 1 unless o.dim is set), o.face (draw eyes), o.sleep (eyes closed), o.dim (unlit lobes grey)
function brainBuddy(x, y, s, lit = {}, o = {}) {
  const S = v => v * s;
  cut(Pp([[x + S(40), y + S(165)], [x + S(95), y + S(165)], [x + S(85), y + S(290)], [x + S(50), y + S(290)]]), BRN.stem, 2);
  for (const k of LOBE_ORDER) {
    const v = lit[k] ?? (o.dim ? 0 : 1), col = mixCol(BRN.off, BRN[k], clamp(v));
    const P = Pblob(LOBES[k].map(([a, b]) => [x + S(a), y + S(b)]));
    if (v > .6 && o.glow !== false) { const [cx, cy] = lobeCenter(k, x, y, s); shine(cx, cy, S(170), BRN.glow, .55 * (v - .6) / .4); }
    cut(P, col, k === 'cerebellum' ? 3 : 2, { edge: .25 });
    if (k !== 'cerebellum') { const [cx, cy] = lobeCenter(k, x, y, s);           // a gyrus line or two in each lobe
      PX.save(); PX.strokeStyle = mixCol(col, '#5A2E3A', .3); PX.lineWidth = S(6); PX.lineCap = 'round';
      PX.beginPath(); PX.moveTo(cx - S(50), cy - S(10)); PX.quadraticCurveTo(cx, cy - S(45), cx + S(45), cy + S(5)); PX.stroke(); PX.restore(); }
    else for (let i = 0; i < 3; i++) strip([[x + S(140 + i * 8), y + S(150 + i * 18)], [x + S(250 - i * 10), y + S(120 + i * 22)]], mixCol(col, '#7A5A1A', .3), S(4), 0);
  }
  if (o.face !== false) {
    for (const ex of [-185, -105]) {
      const ey = -40;
      if (o.sleep) strip([[x + S(ex - 20), y + S(ey)], [x + S(ex), y + S(ey + 10)], [x + S(ex + 20), y + S(ey)]], BRN.ink, S(7), 0);
      else { cut(Pe(x + S(ex), y + S(ey), S(26), S(32)), '#FFFFFF', 1, { tex: .2 }); cut(Pc(x + S(ex + (o.look ?? 0)), y + S(ey + 4), S(14)), BRN.ink, 0, { tex: 0 }); }
    }
    PX.save(); PX.strokeStyle = BRN.ink; PX.lineWidth = S(7); PX.lineCap = 'round'; PX.beginPath();
    const sm = o.smile ?? .6; PX.moveTo(x - S(170), y + S(20)); PX.quadraticCurveTo(x - S(145), y + S(20 + 26 * sm), x - S(118), y + S(20)); PX.stroke(); PX.restore();
  }
}
// an MRI scanner ring around (x, y) with a sweeping scan line
function scannerRing(x, y, r, t, k = 1) {
  cut(Pu(Pc(x, y, r * 1.18), Pc(x, y, r * .98)), '#EDEFF3', 4, { rule: 'evenodd', edge: .4, alpha: k });
  cut(Pu(Pc(x, y, r * 1.18), Pc(x, y, r * 1.1)), '#B9C4CC', 0, { rule: 'evenodd', alpha: k });
  const a = t * 2.2; PX.save(); PX.globalAlpha *= .5 * k; PX.strokeStyle = '#7BE0E0'; PX.lineWidth = 8;
  PX.beginPath(); PX.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); PX.lineTo(x - Math.cos(a) * r, y - Math.sin(a) * r); PX.stroke(); PX.restore();
}
// a neuron: a soma with dendrites; fire 0..1 lights it
function neuron(x, y, r, fire, rot = 0) {
  const col = mixCol('#5B5480', '#FFF6C8', fire);
  if (fire > .1) shine(x, y, r * 4, fire > .9 ? '#FFFFFF' : '#FFE27A', .7 * fire);
  for (let i = 0; i < 4; i++) { const a = rot + i * TAU / 4 + .4; strip([[x, y], [x + Math.cos(a) * r * 2.2, y + Math.sin(a) * r * 2.2]], col, r * .28, 0); }
  cut(Pc(x, y, r), col, 1, { edge: .3 });
}
// a simple EEG trace from x0 to x1 at y; spike 0..1 turns calm waves into tall synchronous spikes
function eeg(x0, x1, y, t, spike, col = '#9FF0D0') {
  const P = []; for (let i = 0; i <= 120; i++) { const u = i / 120, x = lerp(x0, x1, u), ph = u * 40 - t * 12;
    const calm = Math.sin(ph) * 10 + Math.sin(ph * 2.3) * 6, wild = (frac(ph / TAU * 1.5) < .15 ? -1 : .25) * 90 * Math.sin(ph * .5) ** 2;
    P.push([x, y + lerp(calm, wild, spike)]); }
  strip(P, mixCol(col, '#FF6A5C', spike), 6, 0);
}
// instruments for the orchestra: k 0..1 how lit
function instrument(kind, x, y, s, k, t) {
  const S = v => v * s, col = mixCol('#B9AFA0', ['#D98A3A', '#E0614A', '#F2C14E', '#7B66C9', '#2E9C8E'][['violin', 'drum', 'trumpet', 'piano', 'harp'].indexOf(kind)], k);
  if (k > .5) shine(x, y, S(150), '#FFE9A0', .4 * k);
  if (kind === 'violin') { cut(Pblob([[x, y - S(70)], [x + S(40), y - S(40)], [x + S(30), y], [x + S(45), y + S(40)], [x, y + S(80)], [x - S(45), y + S(40)], [x - S(30), y], [x - S(40), y - S(40)]]), col, 2); strip([[x, y - S(70)], [x, y - S(140)]], '#5A3A2A', S(10), 1); }
  if (kind === 'drum') { cut(Pr(x - S(70), y - S(40), S(140), S(90), S(14)), col, 2); cut(Pe(x, y - S(40), S(70), S(20)), '#FBF5E8', 1); }
  if (kind === 'trumpet') { strip([[x - S(80), y], [x + S(40), y]], col, S(16), 2); cut(Pp([[x + S(30), y], [x + S(90), y - S(40)], [x + S(90), y + S(40)]]), col, 2); }
  if (kind === 'piano') { cut(Pr(x - S(90), y - S(40), S(180), S(80), S(8)), col, 2); for (let i = 0; i < 6; i++) cut(Pr(x - S(80) + i * S(28), y, S(22), S(34), S(3)), '#FBF5E8', 0); }
  if (kind === 'harp') { cut(Pp([[x - S(50), y + S(70)], [x - S(50), y - S(80)], [x + S(60), y - S(40)], [x + S(20), y + S(70)]]), col, 2); for (let i = 0; i < 5; i++) strip([[x - S(40) + i * S(14), y - S(60) + i * S(8)], [x - S(40) + i * S(14), y + S(60)]], '#FBF5E8', S(2), 0); }
  if (k > .5) for (let i = 0; i < 2; i++) { const p = frac(t * .8 + i / 2); ptext('♪', x + S(60) + p * S(60), y - S(80) - p * S(100), S(40), '#FFFFFF', { alpha: Math.sin(Math.PI * p) * k, lv: 1 }); }
}
// a padlock that opens (k 0..1)
function padlock(x, y, s, k) {
  const S = v => v * s;
  PX.save(); PX.translate(x + S(40), y - S(30) - S(50) * k); PX.rotate(-.6 * k);      // the shackle lifts and swings open
  strip([[-S(80), 0], [-S(80), -S(60)], [0, -S(60)], [0, 0]], '#9AA6B2', S(18), 1);
  PX.restore();
  cut(Pr(x - S(60), y - S(30), S(120), S(100), S(14)), '#F2C14E', 3, { edge: .3 }); cut(Pc(x, y + S(15), S(12)), '#3A2E2A', 0);
}
